#!/usr/bin/env node
/**
 * Review Request Engine (local only; client PII stays in gitignored data/private/).
 *   node scripts/review-request-engine.mjs add "Jane Doe | jane@x.com | 4045551234 | Lithonia | home inspection"
 *   node scripts/review-request-engine.mjs run      (poll phone intake + send due asks; 9 AM-6 PM only)
 *   node scripts/review-request-engine.mjs done jane@x.com   (client reviewed: stop reminders)
 *   node scripts/review-request-engine.mjs list
 * Phone intake: publish the same pipe format to the private ntfy topic in data/private/review-config.json.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { parseIntake, upsert, dueActions, buildEmail, buildSms, digits10 } from './lib/review-requests.mjs';

const ROOT = process.cwd();
const PRIV = path.join(ROOT, 'data', 'private');
const QUEUE = path.join(PRIV, 'review-requests.json');
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

async function pollIntake(cfg, queue) {
  const added = [];
  try {
    const res = await fetch(`https://ntfy.sh/${cfg.intakeTopic}/json?poll=1&since=${cfg.lastPoll || '12h'}`);
    for (const line of (await res.text()).split('\n').filter(Boolean)) {
      const msg = JSON.parse(line);
      if (msg.event !== 'message') continue;
      cfg.lastPoll = msg.id;
      const entry = parseIntake(msg.message);
      if (entry && upsert(queue, entry)) added.push(entry.name);
    }
  } catch (e) { console.warn('[Review Engine] Intake poll skipped:', e.message); }
  return added;
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

async function run(cfg, queue) {
  const added = await pollIntake(cfg, queue);
  const hour = new Date().getHours();
  if (hour < 9 || hour >= 18) {
    console.log(`[Review Engine] Outside 9 AM-6 PM window. Queued ${added.length} new client(s); sends deferred.`);
    return { added, sent: [] };
  }
  const cool = readJson(COOLDOWN, {});
  const emailOk = !(cool.cooldownUntil && new Date(cool.cooldownUntil) > new Date());
  const user = env('EMAIL_USER') || 'inspect@foresightcmi.com'; // ggignore
  const pass = env('EMAIL_PASSWORD'); // ggignore
  const transporter = emailOk && pass ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }) : null;
  const sent = [];
  for (const { entry, kind } of dueActions(queue, new Date(), suppressed())) {
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
  return { added, sent };
}

async function main() {
  const [cmd = 'run', ...args] = process.argv.slice(2);
  const cfg = config();
  const queue = readJson(QUEUE, []);
  if (cmd === 'add') {
    const entry = parseIntake(args.join(' '));
    if (!entry) return console.error('Format: "Name | email | phone | City | service" (email or phone required)');
    console.log(upsert(queue, entry) ? `Queued ${entry.name}. First ask goes out on the next run (9 AM-6 PM).` : 'Already in queue (same email/phone).');
  } else if (cmd === 'done') {
    const key = String(args[0] || '').toLowerCase();
    const e = queue.find((q) => q.email === key || q.phone === digits10(key));
    if (e) { e.reviewedAt = new Date().toISOString(); console.log(`Marked ${e.name} as reviewed.`); } else console.log('Not found.');
  } else if (cmd === 'list') {
    for (const q of queue) console.log(`${q.name} | ${q.city || '-'} | sent:${q.sentAt ? 'Y' : 'N'} reminder:${q.reminderSentAt ? 'Y' : 'N'} reviewed:${q.reviewedAt ? 'Y' : 'N'}`);
    console.log(`\nPhone intake topic: ${cfg.intakeTopic}`);
  } else {
    const { added, sent } = await run(cfg, queue);
    if (added.length || sent.length) await push('Review requests', `New: ${added.join(', ') || 'none'}\nSent: ${sent.join(', ') || 'none'}`);
    console.log(`[Review Engine] New: ${added.length} | Sent: ${sent.length} | Queue: ${queue.length}`);
  }
  writeJson(QUEUE, queue);
  writeJson(CFG, cfg);
}

main().catch((e) => { console.error('[Review Engine] Fatal:', e.message); process.exit(1); });
