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
import { sendOpenSmsWithDhcpFallback } from './lib/opensms-fallback.mjs';
import { scanAllHistoricalHr5Reports, mineWarmWarrantyAndFinalCohorts, buildWarrantyCheckinEmail, fourKeySet } from './lib/warranty-checkin.mjs';
import { syncNetworkClock, readGovernorCeiling } from './lib/network-clock.mjs';

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
  const cfgPath = path.join(ROOT, 'data', 'opensms-config.json');
  const url = env('OPENSMS_URL') || readJson(cfgPath, {}).gatewayUrl;
  if (!key) return false;
  const out = await sendOpenSmsWithDhcpFallback({ phone, text, configuredUrl: url, apiKey: key, configFilePath: cfgPath });
  return out.ok;
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

  const netClock = await syncNetworkClock();
  if (!netClock.ok && !forceWindow) {
    console.log('[Review Engine] Network clock unavailable; fail-closed deferring sends.');
    return { added, sent: [], revoked, newWarrantyCount: hg.newWarrantyCount };
  }
  const now = netClock.ok ? netClock.nowDate : new Date();
  const nowMs = now.getTime();
  const easternDateRun = netClock.ok ? netClock.easternDateStr : new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const isHolidayRun = new Set(['2026-11-26', '2026-11-27', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']).has(easternDateRun);
  const easternHour = netClock.ok ? netClock.easternHour : Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(now));
  if (!forceWindow && (isHolidayRun || easternHour < 9 || easternHour >= 18)) {
    console.log(`[Review Engine] Outside 9 AM-6 PM ET window or holiday blackout. Queued ${added.length} viewed report(s); Revoked ${revoked.length}; sends deferred.`);
    return { added, sent: [], revoked, newWarrantyCount: hg.newWarrantyCount };
  }
  const oneDayAgoMs = nowMs - 24 * 3600 * 1000;
  let crossSent24h = 0;
  const masterDb = readJson(path.resolve(ROOT, '..', 'email-campaign-engine', 'master_realtor_database.json'), { contacts: {} });
  for (const c of Object.values(masterDb.contacts || {})) {
    for (const camp of Object.values(c?.campaigns || {})) {
      if (camp?.sent && camp.timestamp && new Date(camp.timestamp).getTime() >= oneDayAgoMs) crossSent24h++;
    }
  }
  for (const [fn, k] of [['due-diligence-outreach-log.json', 'timestamp'], ['permit-outreach-log.json', 'dispatchedAt'], ['warranty-outreach-log.json', 'timestamp'], ['new-construction-outreach-log.json', 'sentAt'], ['new-construction-outreach.json', 'sentAt'], ['agent-reach-outreach-log.json', 'timestamp']]) {
    const raw = readJson(path.join(ROOT, 'data', fn), []);
    for (const r of (Array.isArray(raw) ? raw : (raw?.history || []))) {
      const ts = r?.[k] || r?.timestamp || r?.dispatchedAt || r?.sentAt;
      if (ts && new Date(ts).getTime() >= oneDayAgoMs) crossSent24h++;
    }
  }
  const cloudSt = readJson(path.join(ROOT, 'data', 'cloud-realtor-nurture-state.json'), {});
  for (const ts of Object.values(cloudSt?.lastSentByEmail || {})) {
    if (ts && new Date(ts).getTime() >= oneDayAgoMs) crossSent24h++;
  }
  for (const rec of Object.values(ledger.byKey || {})) {
    for (const t of (rec?.touches || [])) {
      if (t?.at && Array.isArray(t.channels) && t.channels.includes('email') && new Date(t.at).getTime() >= oneDayAgoMs) crossSent24h++;
    }
  }
  const { max24h: max24hCap, allowSend: govAllow } = readGovernorCeiling(ROOT, 1200);
  let remainingEmailQuota = govAllow ? Math.max(0, max24hCap - crossSent24h) : 0;
  const cool = readJson(COOLDOWN, {});
  const emailOk = remainingEmailQuota > 0 && !(cool.cooldownUntil && new Date(cool.cooldownUntil) > now);
  const transporter = emailOk && pass ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }) : null;
  const sent = [];
  for (const { entry, kind } of dueActions(queue, now, suppressed(), canceledIndex, ledger).slice(0, MAX_AUTO_BATCH)) {
    const gate = canContactClient(ledger, entry, kind, now, suppressed());
    if (!gate.allowed) continue;
    const emailField = kind === 'initial' ? 'emailSentAt' : 'reminderEmailSentAt';
    const smsField = kind === 'initial' ? 'smsSentAt' : 'reminderSmsSentAt';
    let didSendEmail = false;
    let didSendSms = false;
    if (entry.email && !entry[emailField] && transporter && remainingEmailQuota > 0) {
      try {
        const m = buildEmail(entry, REVIEW_LINK, kind);
        await transporter.sendMail({ from: `"Christopher Boykin, CMI" <${user}>`, to: entry.email, subject: m.subject, text: m.text, html: m.html });
        entry[emailField] = now.toISOString();
        remainingEmailQuota--;
        didSendEmail = true;
      } catch (e) { console.warn('[Review Engine] Email dispatch failed:', e.message); }
    }
    if (entry.phone && !entry[smsField] && (await sendSms(entry.phone, buildSms(entry, REVIEW_LINK, kind)))) {
      entry[smsField] = now.toISOString();
      didSendSms = true;
    }
    if (didSendEmail || didSendSms) {
      const nowIso = now.toISOString();
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
  const netClock = await syncNetworkClock();
  const now = netClock.ok ? netClock.nowDate : new Date();
  const easternDate = netClock.ok ? netClock.easternDateStr : new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const isHoliday = new Set(['2026-11-26', '2026-11-27', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']).has(easternDate);
  const day = netClock.ok ? netClock.easternWeekdayNum : now.getDay();
  const mins = netClock.ok ? netClock.easternMinutes : now.getHours() * 60 + now.getMinutes();
  const inWeekdayWindow = netClock.ok && !isHoliday && day >= 1 && day <= 5 && mins >= 600 && mins <= 990;
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
  const maxAgeMs = 540 * 24 * 3600 * 1000;
  const eligible = pastClients.filter((c) => {
    if (!c || c.initial_sent === true || c.reviewedAt) return false;
    const rawAddr = String(c.address || '').trim();
    if (!rawAddr || /^your home$/i.test(rawAddr) || !/^\d+\s+\S/.test(rawAddr)) return false;
    const dtMs = c.date ? new Date(c.date).getTime() : NaN;
    if (isNaN(dtMs) || dtMs > now.getTime() || (now.getTime() - dtMs) > maxAgeMs) return false;
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
    if (!canContactClient(ledger, candidate, 'initial', now, sup).allowed) continue;
    const msg = `Hi ${c.first || c.name || 'there'}, Chris with Foresight Home Inspections checking in. Completely optional & zero pressure (no follow-ups will follow): an honest Google review helps local buyers find us: ${REVIEW_LINK} Reply STOP anytime to opt out.`;
    if (await sendSms(ph, msg)) {
      const sentIso = now.toISOString();
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
    } else if (sentCount === 0) {
      console.log('[Past-Client Reactivation] OpenSMS phone gateway currently unreachable on local Wi-Fi; deferring cleanly.');
      break;
    }
  }
  console.log(`[Past-Client Reactivation Live] Sent: ${sentCount}/${batch.length} | Remaining Eligible: ${eligible.length - sentCount}`);
  return { eligibleCount: eligible.length, batchCount: batch.length, sentCount, isDryRun: false };
}

async function runWarrantyCheckin(args, queue, cancels) {
  const isDryRun = !args.includes('--live') && !args.includes('--send');
  const forceWindow = args.includes('--force-window');
  const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1] || '4';
  const limit = Math.min(8, Math.max(1, parseInt(limitArg, 10) || 4));
  const netClock = await syncNetworkClock();
  const now = netClock.ok ? netClock.nowDate : new Date();
  const easternDate = netClock.ok ? netClock.easternDateStr : new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const easternHour = netClock.ok ? netClock.easternHour : Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(now));
  const weekdayNum = netClock.ok ? netClock.easternWeekdayNum : now.getDay();
  const isHoliday = new Set(['2026-11-26', '2026-11-27', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']).has(easternDate);
  const inWindow = netClock.ok && !isHoliday && weekdayNum >= 1 && weekdayNum <= 5 && easternHour >= 9 && easternHour < 18;

  const warrantyFile = path.join(PRIV, 'homegauge-warranty-clients.json');
  const statePath = path.join(PRIV, 'warranty-checkin-state.json');
  const state = readJson(statePath, { updatedAt: now.toISOString(), totalSent: 0, sentKeys: [], history: [] });
  const pastClients = readJson(path.join(ROOT, 'data', 'past-clients.json'), []);
  const hr5Records = scanAllHistoricalHr5Reports();
  const existingWarranty = readJson(warrantyFile, []);

  // Enrich gitignored homegauge-warranty-clients.json with historical New-Build & Pre-Drywall records
  const mergedMap = new Map();
  for (const r of [...existingWarranty, ...pastClients, ...hr5Records, ...queue]) {
    if (!r) continue;
    const key = r.reportId || `${normalizeAddressKey(r.address)}:${String(r.completedAt || r.date || '').slice(0, 10)}` || r.id;
    const prev = mergedMap.get(key) || {};
    mergedMap.set(key, { ...prev, ...r, email: r.email || prev.email || '', phone: digits10(r.phone || r.raw_phone) || prev.phone || '' });
  }
  const allRecords = [...mergedMap.values()];
  const newBuildPool = allRecords.filter((r) => /new\s+construction|pre-?\s*drywall|predrywall|phase|11-?\s*month/i.test(String(r.service || '')));
  writeJson(warrantyFile, newBuildPool);

  const sup = suppressed();
  const sentKeySet = new Set(state.sentKeys || []);
  const { cohort11Month, cohortFinal } = mineWarmWarrantyAndFinalCohorts({
    records: allRecords, cancellations: cancels, suppressedSet: sup, alreadySentKeys: sentKeySet, now
  });
  const candidates = [...cohort11Month, ...cohortFinal];
  const batch = candidates.slice(0, limit);

  if (isDryRun || (!inWindow && !forceWindow)) {
    if (!fs.existsSync(statePath)) writeJson(statePath, state);
    console.log(`[Warranty & Final Check-In ${isDryRun ? 'Dry-Run' : 'Deferred'}] Pool: ${newBuildPool.length} | 11-Month Eligible: ${cohort11Month.length} | Final Eligible: ${cohortFinal.length} | Batch: ${batch.length}`);
    return { cohort11MonthCount: cohort11Month.length, cohortFinalCount: cohortFinal.length, sentCount: 0, isDryRun };
  }

  const user = env('EMAIL_USER') || 'inspect@foresightcmi.com'; // ggignore
  const pass = env('EMAIL_PASSWORD'); // ggignore
  const cool = readJson(COOLDOWN, {});
  if (!pass || (cool.cooldownUntil && new Date(cool.cooldownUntil) > now)) {
    console.log('[Warranty & Final Check-In] Missing credentials or SMTP cooldown active; deferring.');
    return { cohort11MonthCount: cohort11Month.length, cohortFinalCount: cohortFinal.length, sentCount: 0, isDryRun: false };
  }
  const oneDayAgoMs = now.getTime() - 24 * 3600 * 1000;
  let crossSent24h = 0;
  const masterDb = readJson(path.resolve(ROOT, '..', 'email-campaign-engine', 'master_realtor_database.json'), { contacts: {} });
  for (const c of Object.values(masterDb.contacts || {})) {
    for (const camp of Object.values(c?.campaigns || {})) {
      if (camp?.sent && camp.timestamp && new Date(camp.timestamp).getTime() >= oneDayAgoMs) crossSent24h++;
    }
  }
  for (const [fn, k] of [['due-diligence-outreach-log.json', 'timestamp'], ['permit-outreach-log.json', 'dispatchedAt'], ['warranty-outreach-log.json', 'timestamp'], ['new-construction-outreach-log.json', 'sentAt'], ['new-construction-outreach.json', 'sentAt'], ['agent-reach-outreach-log.json', 'timestamp']]) {
    const raw = readJson(path.join(ROOT, 'data', fn), []);
    for (const r of (Array.isArray(raw) ? raw : (raw?.history || []))) {
      const ts = r?.[k] || r?.timestamp || r?.dispatchedAt || r?.sentAt;
      if (ts && new Date(ts).getTime() >= oneDayAgoMs) crossSent24h++;
    }
  }
  const cloudSt = readJson(path.join(ROOT, 'data', 'cloud-realtor-nurture-state.json'), {});
  for (const ts of Object.values(cloudSt?.lastSentByEmail || {})) {
    if (ts && new Date(ts).getTime() >= oneDayAgoMs) crossSent24h++;
  }
  const ledger = seedLedgerFromQueue(readJson(LEDGER, { byKey: {} }), queue);
  for (const rec of Object.values(ledger.byKey || {})) {
    for (const t of (rec?.touches || [])) {
      if (t?.at && Array.isArray(t.channels) && t.channels.some((ch) => String(ch).startsWith('email')) && new Date(t.at).getTime() >= oneDayAgoMs) crossSent24h++;
    }
  }
  const { max24h: max24hCap, allowSend: govAllow } = readGovernorCeiling(ROOT, 1200);
  if (!govAllow || crossSent24h >= max24hCap) return { cohort11MonthCount: cohort11Month.length, cohortFinalCount: cohortFinal.length, sentCount: 0, isDryRun: false };

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  let sentCount = 0;
  for (const rec of batch) {
    const mail = buildWarrantyCheckinEmail(rec, rec.cohort);
    try {
      await transporter.sendMail({ from: `"Christopher Boykin, CMI" <${user}>`, to: rec.email, subject: mail.subject, text: mail.text, html: mail.html });
      const sentIso = now.toISOString();
      for (const k of fourKeySet(rec)) { if (!sentKeySet.has(k)) { sentKeySet.add(k); state.sentKeys.push(k); } }
      state.totalSent = (state.totalSent || 0) + 1;
      state.updatedAt = sentIso;
      state.history.push({ id: rec.id, cohort: rec.cohort, city: rec.city || '', ageDays: rec.ageDays, sentAt: sentIso });
      recordLedgerTouch(ledger, rec, 'initial', sentIso, ['email_warranty_checkin']);
      writeJson(LEDGER, ledger);
      writeJson(statePath, state);
      sentCount++;
      await sleep(6000);
    } catch (e) { console.warn('[Warranty Check-In] Send failed:', e.message); break; }
  }
  transporter.close();
  console.log(`[Warranty & Final Check-In Live] Sent: ${sentCount}/${batch.length} | 11-Month Eligible: ${cohort11Month.length} | Final Eligible: ${cohortFinal.length}`);
  return { cohort11MonthCount: cohort11Month.length, cohortFinalCount: cohortFinal.length, sentCount, isDryRun: false };
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
  } else if (cmd === 'warranty-checkin') {
    await runWarrantyCheckin(args, queue, cancels);
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
