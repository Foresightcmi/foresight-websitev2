#!/usr/bin/env node
// Review Request Engine (local only; client PII stays in gitignored data/private/).
//   node scripts/review-request-engine.mjs add "Jane Doe | jane@x.com | 4045551234 | Lithonia | home inspection"
//   node scripts/review-request-engine.mjs cancel "100 Sample St | jane@x.com"
//   node scripts/review-request-engine.mjs run       (poll intake + quarantine cancellations + send due completed asks)
//   node scripts/review-request-engine.mjs dry-run   (sync cancellations & completed jobs without sending)
//   node scripts/review-request-engine.mjs reactivate-past-clients --dry-run --limit=8
//   node scripts/review-request-engine.mjs done jane@x.com   (client reviewed: stop reminders)
//   node scripts/review-request-engine.mjs list
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {
  parseIntake, parseCancelIntake, normalizeAddressKey, buildCanceledIndex,
  reconcileQueueCancellations, upsert, dueActions, buildEmail, buildSms, digits10,
  seedLedgerFromQueue, recordLedgerTouch, canContactClient
} from './lib/review-requests.mjs';
import { ingestHomeGaugeJobs, mergeCancellations, pollReviewOptOutReplies } from './lib/homegauge-intake.mjs';

const ROOT = process.cwd();
const PRIV = path.join(ROOT, 'data', 'private');
const QUEUE = path.join(PRIV, 'review-requests.json');
const LEDGER = path.join(PRIV, 'review-dispatch-ledger.json');
const UNSUB = path.join(ROOT, 'data', 'unsubscribed_contacts.json');
const CANCELS = path.join(PRIV, 'canceled-inspections.json');
const CFG = path.join(PRIV, 'review-config.json');
const REVIEW_LINK = 'https://g.page/r/CaK5MZOz_FBtEBM/review';
const ALERTS = 'https://ntfy.sh/fores-antigravity-alerts-77';
const COOLDOWN = path.resolve(ROOT, '..', 'email-campaign-engine', 'smtp_cooldown_state.json');
const MAX_AUTO_BATCH = 10;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const writeJson = (f, d) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, 2), 'utf8'); };

function env(key) {
  if (process.env[key]) return process.env[key].trim();
  const m = (fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '').match(new RegExp(`^${key}=(.+)$`, 'm'));
  return m ? m[1].trim() : '';
}

function config() {
  const cfg = readJson(CFG, null) || { intakeTopic: `fhi-review-intake-${crypto.randomBytes(6).toString('hex')}`, lastPoll: null };
  writeJson(CFG, cfg);
  return cfg;
}

function suppressed() {
  const set = new Set();
  for (const item of readJson(path.join(ROOT, 'data', 'unsubscribed_contacts.json'), [])) {
    const v = String(typeof item === 'string' ? item : item?.email || item?.phone || '').toLowerCase().replace(/^%20/, '').trim();
    if (v) { set.add(v); if (digits10(v).length === 10 && !v.includes('@')) set.add(digits10(v)); }
  }
  return set;
}

async function pollIntake(cfg) {
  const entries = [], cancels = [];
  try {
    const res = await fetch(`https://ntfy.sh/${cfg.intakeTopic}/json?poll=1&since=${cfg.lastPoll || '12h'}`);
    for (const line of (await res.text()).split('\n').filter(Boolean)) {
      const msg = JSON.parse(line);
      if (msg.event !== 'message') continue;
      cfg.lastPoll = msg.id;
      const cancelRec = parseCancelIntake(msg.message);
      if (cancelRec) { cancels.push(cancelRec); continue; }
      const entry = parseIntake(msg.message);
      if (entry) entries.push({ ...entry, completionVerified: true, source: 'ntfy_manual' });
    }
  } catch (e) { console.warn('[Review Engine] Intake poll skipped:', e.message); }
  return { entries, cancels };
}

async function sendSms(phone, text) {
  const key = env('OPENSMS_API_KEY');
  const url = env('OPENSMS_URL') || readJson(path.join(ROOT, 'data', 'opensms-config.json'), {}).gatewayUrl;
  if (!key || !url) return false;
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ number: `+1${phone}`, text }), signal: AbortSignal.timeout(15000) });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.stat === true;
  } catch { return false; }
}

const push = (title, body) => fetch(ALERTS, { method: 'POST', headers: { Title: title, Tags: 'star' }, body }).catch(() => {});

function auditExistingQueueCompletion(queue, hr5ByAddress) {
  const quarantined = [];
  for (const q of queue) {
    if (q.canceledAt || !String(q.source || '').startsWith('homegauge_')) continue;
    const localRec = hr5ByAddress?.get(normalizeAddressKey(q.address));
    if (localRec && localRec.uploaded && localRec.hasContent) {
      q.completionVerified = true;
      if (localRec.name && (!q.name || !q.name.includes(' '))) q.name = localRec.name;
      if (localRec.city && !q.city) q.city = localRec.city;
      if (localRec.phone && !q.phone) q.phone = localRec.phone;
    } else if (q.completionVerified !== true) {
      q.completionVerified = false;
      q.canceledAt = new Date().toISOString();
      q.cancelReason = 'unverified_or_uncompleted_homegauge_entry';
      quarantined.push(q);
    }
  }
  return quarantined;
}

function applyReplyFlags(queue, { optOuts = [], reviewed = [] }) {
  if (!optOuts.length && !reviewed.length) return 0;
  const nowIso = new Date().toISOString();
  const optSet = new Set(optOuts), revSet = new Set(reviewed);
  let changes = 0;
  for (const q of queue) {
    const em = String(q.email || '').toLowerCase().trim();
    if (em && optSet.has(em) && !q.optedOut) { q.optedOut = true; q.optedOutAt = nowIso; changes++; }
    if (em && revSet.has(em) && !q.reviewedAt) { q.reviewedAt = nowIso; changes++; }
  }
  if (optOuts.length) {
    const cur = readJson(UNSUB, []);
    const seen = new Set(cur.map((x) => String(typeof x === 'string' ? x : x?.email || x?.phone || '').toLowerCase().trim()));
    let addedUnsub = false;
    for (const em of optOuts) { if (!seen.has(em)) { cur.push(em); seen.add(em); addedUnsub = true; } }
    if (addedUnsub) writeJson(UNSUB, cur);
  }
  return changes;
}

async function run(cfg, queue, dryRun = false, forceWindow = false) {
  const intake = await pollIntake(cfg);
  const user = env('EMAIL_USER') || 'inspect@foresightcmi.com'; // ggignore
  const pass = env('EMAIL_PASSWORD'); // ggignore
  const hg = await ingestHomeGaugeJobs({ privDir: PRIV, user, pass, cfg, extraCancellations: intake.cancels });
  const canceledIndex = buildCanceledIndex(hg.cancellations);

  const revoked = [
    ...reconcileQueueCancellations(queue, hg.cancellations),
    ...auditExistingQueueCompletion(queue, hg.hr5ByAddress)
  ];

  const added = [];
  for (const entry of intake.entries) {
    if (upsert(queue, entry, new Date(), canceledIndex)) added.push(entry.name);
  }
  for (const job of hg.jobs) {
    if (upsert(queue, job, new Date(), canceledIndex)) added.push(`${job.name} (${job.address || job.city || 'Report Viewed'})`);
  }

  const ledger = seedLedgerFromQueue(readJson(LEDGER, { byKey: {} }), queue);
  writeJson(LEDGER, ledger);

  const activeEmails = queue.filter((q) => q.email && !q.optedOut && !q.reviewedAt && !q.canceledAt).map((q) => q.email);
  const replyRes = await pollReviewOptOutReplies(user, pass, activeEmails);
  applyReplyFlags(queue, replyRes);

  if (dryRun) {
    console.log(`[Review Engine Dry-Run] Added: ${added.length} | Revoked/Quarantined: ${revoked.length} | OptOuts/Reviewed: ${replyRes.optOuts.length}/${replyRes.reviewed.length} | Canceled Ledger: ${hg.cancellations.length}`);
    return { added, sent: [], revoked, newCancelCount: hg.newCancelCount };
  }

  const hour = new Date().getHours();
  if (!forceWindow && (hour < 8 || hour >= 22)) {
    console.log(`[Review Engine] Outside 8 AM-10 PM window. Queued ${added.length} viewed report(s); Revoked ${revoked.length}; sends deferred to next daytime window.`);
    return { added, sent: [], revoked, newWarrantyCount: hg.newWarrantyCount };
  }
  const cool = readJson(COOLDOWN, {});
  const emailOk = !(cool.cooldownUntil && new Date(cool.cooldownUntil) > new Date());
  const transporter = emailOk && pass ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }) : null;
  const sent = [];
  for (const { entry, kind } of dueActions(queue, new Date(), suppressed(), canceledIndex, ledger).slice(0, MAX_AUTO_BATCH)) {
    const gate = canContactClient(ledger, entry, kind, new Date(), suppressed());
    if (!gate.allowed) continue;
    const emailField = kind === 'initial' ? 'emailSentAt' : 'reminderEmailSentAt';
    const smsField = kind === 'initial' ? 'smsSentAt' : 'reminderSmsSentAt';
    let didSendEmail = false;
    let didSendSms = false;
    if (entry.email && !entry[emailField] && transporter) {
      try {
        const m = buildEmail(entry, REVIEW_LINK, kind);
        await transporter.sendMail({ from: `"Christopher Boykin, CMI" <${user}>`, to: entry.email, subject: m.subject, text: m.text, html: m.html });
        entry[emailField] = new Date().toISOString();
        didSendEmail = true;
      } catch (e) { console.warn('[Review Engine] Email dispatch failed:', e.message); }
    }
    if (entry.phone && !entry[smsField] && (await sendSms(entry.phone, buildSms(entry, REVIEW_LINK, kind)))) {
      entry[smsField] = new Date().toISOString();
      didSendSms = true;
    }
    if (didSendEmail || didSendSms) {
      const nowIso = new Date().toISOString();
      const channels = [...(didSendEmail ? ['email'] : []), ...(didSendSms ? ['sms'] : [])];
      if (kind === 'initial' && !entry.sentAt) entry.sentAt = nowIso;
      else if (kind === 'reminder') entry.reminderSentAt = entry.reminderSentAt || nowIso;
      recordLedgerTouch(ledger, entry, kind, nowIso, channels);
      writeJson(LEDGER, ledger);
      writeJson(QUEUE, queue);
      sent.push(`${entry.city || 'Metro Atlanta'} [${kind}]`);
    }
    await sleep(2500);
  }
  transporter?.close();
  return { added, sent, revoked };
}

async function reactivatePastClients(args, queue, cancels) {
  const isDryRun = !args.includes('--live') && !args.includes('--send');
  const forceWindow = args.includes('--force-window');
  const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1] || (args.indexOf('--limit') >= 0 ? args[args.indexOf('--limit') + 1] : '8');
  const limit = Math.min(10, Math.max(1, parseInt(limitArg, 10) || 8));
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const inWeekdayWindow = day >= 1 && day <= 5 && mins >= 600 && mins <= 990; // Mon-Fri 10:00-16:30 local
  const statePath = path.join(PRIV, 'past-client-reactivation.json');
  const state = readJson(statePath, { updatedAt: now.toISOString(), totalReactivated: 0, sentIds: [], sentPhones: [], sentAddresses: [] });
  const pastClients = readJson(path.join(ROOT, 'data', 'past-clients.json'), []);
  const sup = suppressed();
  const canceledIdx = buildCanceledIndex(cancels);
  const queuePhones = new Set(queue.map((q) => digits10(q.phone)).filter((p) => p.length === 10));
  const queueEmails = new Set(queue.map((q) => String(q.email || '').toLowerCase().trim()).filter(Boolean));
  const queueAddrs = new Set(queue.map((q) => normalizeAddressKey(q.address)).filter(Boolean));
  const ledger = seedLedgerFromQueue(readJson(LEDGER, { byKey: {} }), queue);
  const reactivatedPhones = new Set(state.sentPhones || []);
  const reactivatedAddrs = new Set(state.sentAddresses || []);
  const reactivatedIds = new Set(state.sentIds || []);
  const eligible = pastClients.filter((c) => {
    if (!c || c.initial_sent === true) return false;
    const ph = digits10(c.phone || c.raw_phone);
    const em = String(c.email || '').toLowerCase().trim();
    const addrKey = normalizeAddressKey(c.address);
    if (ph.length !== 10) return false;
    if (sup.has(ph) || (em && sup.has(em))) return false;
    if (queuePhones.has(ph) || (em && queueEmails.has(em)) || (addrKey && queueAddrs.has(addrKey))) return false;
    if (reactivatedPhones.has(ph) || (addrKey && reactivatedAddrs.has(addrKey)) || (c.id && reactivatedIds.has(String(c.id)))) return false;
    if (canceledIdx.byPhone.get(ph) || (em && canceledIdx.byEmail.get(em)) || (addrKey && canceledIdx.byAddress.get(addrKey))) return false;
    return canContactClient(ledger, { ...c, phone: ph, email: em }, 'initial', now, sup).allowed;
  });
  const batch = eligible.slice(0, limit);
  if (isDryRun || (!inWeekdayWindow && !forceWindow)) {
    if (!fs.existsSync(statePath)) writeJson(statePath, state);
    console.log(`[Past-Client Reactivation ${isDryRun ? 'Dry-Run' : 'Deferred Outside Mon-Fri 10:00-16:30'}] Historical: ${pastClients.length} | Eligible: ${eligible.length} | Batch (limit <= 10): ${batch.length} | InWindow(Mon-Fri 10:00-16:30): ${inWeekdayWindow}`);
    return { eligibleCount: eligible.length, batchCount: batch.length, sentCount: 0, isDryRun };
  }
  let sentCount = 0;
  for (const c of batch) {
    const ph = digits10(c.phone || c.raw_phone);
    const em = String(c.email || '').toLowerCase().trim();
    const candidate = { id: String(c.id || ''), name: c.first || c.name, city: c.city, address: c.address, phone: ph, email: em };
    if (!canContactClient(ledger, candidate, 'initial', new Date(), sup).allowed) continue;
    const msg = `Hi ${c.first || c.name || 'there'}, Chris with Foresight Home Inspections checking in. Completely optional & zero pressure (no follow-ups will follow): an honest Google review helps local buyers find us: ${REVIEW_LINK} Reply STOP anytime to opt out.`;
    if (await sendSms(ph, msg)) {
      const sentIso = new Date().toISOString();
      sentCount++;
      state.sentIds.push(String(c.id || ''));
      state.sentPhones.push(ph);
      if (normalizeAddressKey(c.address)) state.sentAddresses.push(normalizeAddressKey(c.address));
      state.totalReactivated = (state.totalReactivated || 0) + 1;
      state.updatedAt = sentIso;
      recordLedgerTouch(ledger, candidate, 'initial', sentIso, ['sms']);
      recordLedgerTouch(ledger, candidate, 'reminder', sentIso, ['single_touch_cap']);
      writeJson(LEDGER, ledger);
      writeJson(statePath, state);
      await sleep(3000);
    }
  }
  console.log(`[Past-Client Reactivation Live] Sent: ${sentCount}/${batch.length} | Remaining Eligible: ${eligible.length - sentCount}`);
  return { eligibleCount: eligible.length, batchCount: batch.length, sentCount, isDryRun: false };
}

async function main() {
  const [cmd = 'run', ...args] = process.argv.slice(2);
  const cfg = config();
  const queue = readJson(QUEUE, []);
  const cancels = readJson(CANCELS, []);
  if (cmd === 'add') {
    const entry = parseIntake(args.join(' '));
    if (!entry) return console.error('Format: "Name | email | phone | City | service" (email or phone required)');
    const ok = upsert(queue, { ...entry, completionVerified: true, source: 'cli_manual' }, new Date(), buildCanceledIndex(cancels));
    console.log(ok ? `Queued ${entry.name}. First ask goes out on the next run (9 AM-6 PM).` : 'Skipped (already in queue or matched canceled-inspections ledger).');
  } else if (cmd === 'cancel') {
    const rec = parseCancelIntake(args.join(' '), new Date(), true);
    if (!rec) return console.error('Usage: node scripts/review-request-engine.mjs cancel "<email | phone | street address | name>"');
    const merged = mergeCancellations(cancels, [rec]);
    writeJson(CANCELS, merged.list);
    const revoked = reconcileQueueCancellations(queue, merged.list);
    if (rec.name) {
      for (const q of queue) {
        if (!q.canceledAt && q.name && q.name.toLowerCase() === rec.name.toLowerCase()) {
          q.canceledAt = rec.canceledAt; q.cancelReason = 'manual_cli_name_cancel'; revoked.push(q);
        }
      }
    }
    console.log(`Recorded cancellation (${rec.address || rec.email || rec.phone || rec.name}). Revoked ${revoked.length} queued client(s).`);
  } else if (cmd === 'done') {
    const key = String(args[0] || '').toLowerCase();
    const e = queue.find((q) => q.email === key || q.phone === digits10(key));
    if (e) { e.reviewedAt = new Date().toISOString(); console.log(`Marked ${e.name} as reviewed.`); } else console.log('Not found.');
  } else if (cmd === 'list') {
    for (const q of queue) {
      console.log(`${q.city || '-'} | viewedAt:${q.reportViewedAt || '-'} | verified:${q.completionVerified ? 'Y' : 'N'} canceled:${q.canceledAt ? 'Y' : 'N'} sent:${q.sentAt ? 'Y' : 'N'} reminder:${q.reminderSentAt ? 'Y' : 'N'} closing:${q.closingCheckSentAt ? 'Y' : 'N'} reviewed:${q.reviewedAt ? 'Y' : 'N'}`);
    }
    console.log(`\nCanceled quarantine ledger: ${cancels.length} record(s) | Phone intake topic: ${cfg.intakeTopic}`);
  } else if (cmd === 'reactivate-past-clients') {
    await reactivatePastClients(args, queue, cancels);
    return;
  } else {
    const { added, sent, revoked = [] } = await run(cfg, queue, cmd === 'dry-run', cmd === 'run-now');
    if (cmd !== 'dry-run' && sent.length) {
      await push('Auto-Sent Review Request to Customer', `Automatically sent Google review request with link (${REVIEW_LINK}) to:\n- ${sent.join('\n- ')}`);
    }
    console.log(`[Review Engine] New Viewed: ${added.length} | Auto-Sent: ${sent.length} | Canceled/Quarantined: ${revoked.length} | Queue: ${queue.length}`);
  }
  writeJson(QUEUE, queue);
  writeJson(CFG, cfg);
}

main().catch((e) => { console.error('[Review Engine] Fatal:', e.message); process.exit(1); });
