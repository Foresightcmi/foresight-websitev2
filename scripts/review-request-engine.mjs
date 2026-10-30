#!/usr/bin/env node
/**
 * Review Request Engine (local only; client PII stays in gitignored data/private/).
 *   node scripts/review-request-engine.mjs add "Jane Doe | jane@x.com | 4045551234 | Lithonia | home inspection"
 *   node scripts/review-request-engine.mjs cancel "100 Sample St | jane@x.com"
 *   node scripts/review-request-engine.mjs run       (poll intake + quarantine cancellations + send due completed asks; 9 AM-6 PM)
 *   node scripts/review-request-engine.mjs dry-run   (sync cancellations & completed jobs without sending)
 *   node scripts/review-request-engine.mjs done jane@x.com   (client reviewed: stop reminders)
 *   node scripts/review-request-engine.mjs list
 * Phone intake: publish pipe format (or "CANCEL: <address|email|phone>") to private ntfy topic in data/private/review-config.json.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {
  parseIntake, parseCancelIntake, normalizeAddressKey, buildCanceledIndex,
  reconcileQueueCancellations, upsert, dueActions, buildEmail, buildSms, digits10
} from './lib/review-requests.mjs';
import { ingestHomeGaugeJobs, mergeCancellations } from './lib/homegauge-intake.mjs';

const ROOT = process.cwd();
const PRIV = path.join(ROOT, 'data', 'private');
const QUEUE = path.join(PRIV, 'review-requests.json');
const CANCELS = path.join(PRIV, 'canceled-inspections.json');
const CFG = path.join(PRIV, 'review-config.json');
const REVIEW_LINK = 'https://g.page/r/CaK5MZOz_FBtEBM/review';
const ALERTS = 'https://ntfy.sh/fores-antigravity-alerts-77';
const COOLDOWN = path.resolve(ROOT, '..', 'email-campaign-engine', 'smtp_cooldown_state.json');
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

async function run(cfg, queue, dryRun = false) {
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
    if (upsert(queue, job, new Date(), canceledIndex)) added.push(`${job.name} [HomeGauge Verified]`);
  }

  if (dryRun) {
    console.log(`[Review Engine Dry-Run] Added: ${added.length} | Revoked/Quarantined: ${revoked.length} | Canceled Ledger: ${hg.cancellations.length}`);
    return { added, sent: [], revoked, newCancelCount: hg.newCancelCount };
  }

  const hour = new Date().getHours();
  if (hour < 9 || hour >= 18) {
    console.log(`[Review Engine] Outside 9 AM-6 PM window. Queued ${added.length} completed client(s); Revoked ${revoked.length}; sends deferred.`);
    return { added, sent: [], revoked, newWarrantyCount: hg.newWarrantyCount };
  }
  const cool = readJson(COOLDOWN, {});
  const emailOk = !(cool.cooldownUntil && new Date(cool.cooldownUntil) > new Date());
  const transporter = emailOk && pass ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }) : null;
  const sent = [];
  for (const { entry, kind } of dueActions(queue, new Date(), suppressed(), canceledIndex)) {
    let ok = false;
    if (entry.email && transporter) {
      try {
        const m = buildEmail(entry, REVIEW_LINK, kind);
        await transporter.sendMail({ from: `"Christopher Boykin, CMI" <${user}>`, to: entry.email, subject: m.subject, text: m.text, html: m.html });
        ok = true;
      } catch (e) { console.warn(`[Review Engine] Email failed for ${entry.name}:`, e.message); }
    }
    if (entry.phone && (await sendSms(entry.phone, buildSms(entry, REVIEW_LINK, kind)))) ok = true;
    if (ok) {
      entry[kind === 'initial' ? 'sentAt' : 'reminderSentAt'] = new Date().toISOString();
      sent.push(`${entry.name} (${kind})`);
    }
    await sleep(2500);
  }
  transporter?.close();
  return { added, sent, revoked };
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
      console.log(`${q.name} | ${q.address || q.city || '-'} | verified:${q.completionVerified ? 'Y' : 'N'} canceled:${q.canceledAt ? 'Y' : 'N'} sent:${q.sentAt ? 'Y' : 'N'} reminder:${q.reminderSentAt ? 'Y' : 'N'} reviewed:${q.reviewedAt ? 'Y' : 'N'}`);
    }
    console.log(`\nCanceled quarantine ledger: ${cancels.length} record(s) | Phone intake topic: ${cfg.intakeTopic}`);
  } else {
    const { added, sent, revoked = [] } = await run(cfg, queue, cmd === 'dry-run');
    if (cmd !== 'dry-run' && (added.length || sent.length || revoked.length)) {
      await push('Review requests', `New completed: ${added.join(', ') || 'none'}\nSent: ${sent.join(', ') || 'none'}\nCanceled blocked: ${revoked.map((r) => r.name).join(', ') || 'none'}`);
    }
    console.log(`[Review Engine] New: ${added.length} | Sent: ${sent.length} | Canceled/Quarantined: ${revoked.length} | Queue: ${queue.length}`);
  }
  writeJson(QUEUE, queue);
  writeJson(CFG, cfg);
}

main().catch((e) => { console.error('[Review Engine] Fatal:', e.message); process.exit(1); });
