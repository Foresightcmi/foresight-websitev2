#!/usr/bin/env node
/**
 * Autonomous Authority Directory & Brokerage Resource Trickle Dispatcher
 * Foresight Home Inspections, LLC (https://www.fhinspectionsatl.com)
 *
 * Safely trickles <= 4 verified B2B brokerage resource & publisher directory pitches per weekday run:
 * - Enforces 9:00 AM - 6:00 PM ET network-clock window & Holiday Blackout (Nov 26-27, Dec 24-26, Dec 31-Jan 1)
 * - Enforces <= 1,200 / 24h shared Workspace quota + atomic PID lock
 * - 0% leakage to @ansleyre.com, @ansleyatlanta.com, Chapman, MetroBrokers, rival inspectors, or opt-outs
 * - Renders official #FFFFFF Tri-Logo .png header (Logopng.png + 78px CMI + 78px CPI) + CAN-SPAM unsubscribe
 */
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'node:url';
import { syncNetworkClock, readGovernorCeiling } from './lib/network-clock.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEDGER_PATH = path.join(ROOT, 'data', 'pr-citation-dispatch-ledger.json');
const LOCK_PATH = path.join(ROOT, 'data', 'pr_citation_dispatch.lock');
const BLOCKED_RX = /ansleyre\.com|ansleyatlanta\.com|chapman|metrobrokers\.com|cbcmetrobrokers\.com|peachtreetc\.com|premierhomeinspection|home-probe|bpginspections|champia|residentialinspector|avaloninspections|pillartopost|conleyhomeinspections/i;
const HOLIDAYS = new Set(['2026-11-26', '2026-11-27', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']);

function readEnv(key) {
  if (process.env[key]) return process.env[key].trim();
  const envFile = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envFile)) return '';
  const m = fs.readFileSync(envFile, 'utf8').match(new RegExp(`^${key}=(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

export function buildTriLogoResourceHtml(bodyText) {
  const paras = String(bodyText || '').replace(/\*/g, '').split(/\n\n+/).map((p) => `<p style="margin:0 0 14px;line-height:1.6;color:#0f172a;">${p.replace(/\n/g, '<br/>')}</p>`).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:600px;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;background:#ffffff;color:#0f172a;"><div style="background:#ffffff;border-bottom:3px solid #d4af37;padding:16px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="64" style="display:block;height:64px;width:auto;border:0;" /></td><td align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="CMI" height="78" width="78" style="height:78px;width:78px;margin-right:8px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="CPI" height="78" width="78" style="height:78px;width:78px;" /></td></tr></table></div><div style="padding:22px;">${paras}<p style="margin:18px 0 0;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px;">Foresight Home Inspections, LLC • Lithonia, GA 30058 • (678) 480-2110 • Reply STOP anytime to opt out.</p></div></div>`;
}

export async function runAutonomousPrCitationDispatch({ dryRun = !process.argv.includes('--live'), maxPerRun = 4 } = {}) {
  const unsubRaw = fs.existsSync(path.join(ROOT, 'data', 'unsubscribed_contacts.json'))
    ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'unsubscribed_contacts.json'), 'utf8'))
    : [];
  const unsubSet = new Set(unsubRaw.map((x) => String(typeof x === 'string' ? x : x?.email || '').toLowerCase().trim()).filter(Boolean));
  const ledger = fs.existsSync(LEDGER_PATH) ? JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')) : { sentEmails: [], history: [] };
  const sentSet = new Set((ledger.sentEmails || []).map((e) => e.toLowerCase()));

  const candidates = [];
  const smPath = path.join(ROOT, 'data', 'source-map-dispatch-queue.json');
  if (fs.existsSync(smPath)) {
    const sm = JSON.parse(fs.readFileSync(smPath, 'utf8'));
    for (const item of sm.queue || []) {
      const em = String((item.verifiedEmails || [])[0] || '').toLowerCase().trim();
      if (em && !sentSet.has(em) && !unsubSet.has(em) && !BLOCKED_RX.test(`${em} ${item.domain}`)) {
        candidates.push({ to: em, domain: item.domain, subject: item.subjectLine, text: item.emailDraft, source_url: item.source_url, kind: 'directory_citation' });
      }
    }
  }
  const dcPath = path.join(ROOT, 'data', 'directory-citations-tracker.json');
  if (fs.existsSync(dcPath)) {
    const dc = JSON.parse(fs.readFileSync(dcPath, 'utf8'));
    for (const p of dc.brokerageResourcePitches || []) {
      const em = String(p.recipientEmail || '').toLowerCase().trim();
      if (em && !sentSet.has(em) && !unsubSet.has(em) && !BLOCKED_RX.test(`${em} ${p.brokerageDomain} ${p.recipientName}`)) {
        const first = String(p.recipientName || 'there').trim().split(/\s+/)[0];
        const text = `Hi ${first},\n\nWhile reviewing ${p.brokerageDomain} buyer resources across Metro Atlanta, I wanted to share our free public Georgia Due Diligence Deadline & Repair Credit Calculator (${p.toolUrl}) for your clients.\n\nAt Foresight Home Inspections, LLC (led by Christopher Boykin, CMI #MICB-1082), we dispatch two certified inspectors on every home starting From $345 ($295 condos, From $275 Pre-Drywall, From $400 Final New Construction) with free infrared thermal & 4K drone scans and $35,000 combined protection (Licensed GA Realtors also receive a $25 courtesy client credit with GREC license verification).\n\nFeel free to link or share the calculator anytime.\n\nBest,\nChristopher Boykin, CMI (#MICB-1082)`;
        candidates.push({ to: em, domain: p.brokerageDomain, subject: p.subject, text, source_url: p.source_url, kind: 'brokerage_resource' });
      }
    }
  }

  const netClock = await syncNetworkClock();
  const inWindow = netClock.ok && !HOLIDAYS.has(netClock.easternDateStr) && netClock.easternWeekdayNum >= 1 && netClock.easternWeekdayNum <= 5 && netClock.easternHour >= 9 && netClock.easternHour < 18;
  const batch = candidates.slice(0, maxPerRun);
  if (dryRun || !inWindow) {
    if (!fs.existsSync(LEDGER_PATH)) fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf8');
    return { dryRun, inWindow, eligibleCount: candidates.length, batchCount: batch.length, sentCount: 0 };
  }

  const user = readEnv('EMAIL_USER') || 'inspect@foresightcmi.com'; // ggignore
  const pass = readEnv('EMAIL_PASSWORD'); // ggignore
  const { allowSend } = readGovernorCeiling(ROOT, 1200);
  if (!pass || !allowSend || fs.existsSync(LOCK_PATH)) return { dryRun: false, inWindow, eligibleCount: candidates.length, sentCount: 0 };

  fs.writeFileSync(LOCK_PATH, String(process.pid), 'utf8');
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  let sentCount = 0;
  try {
    for (const c of batch) {
      const mx = await dns.resolveMx(c.to.split('@')[1]).catch(() => []);
      if (!mx.length) continue;
      const info = await transporter.sendMail({
        from: `"Christopher Boykin, CMI" <${user}>`,
        to: c.to,
        subject: c.subject.replace(/\*/g, ''),
        text: `${c.text}\n\nReply STOP anytime to opt out.`,
        html: buildTriLogoResourceHtml(c.text),
        headers: { 'List-Unsubscribe': `<mailto:${user}?subject=unsubscribe>` }
      });
      ledger.sentEmails.push(c.to);
      ledger.history.push({ to: c.to, kind: c.kind, messageId: info.messageId, sentAt: new Date().toISOString(), source_url: c.source_url });
      fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf8');
      sentCount++;
      await new Promise((r) => setTimeout(r, 18500));
    }
  } finally {
    transporter.close();
    try { fs.unlinkSync(LOCK_PATH); } catch {}
  }
  return { dryRun: false, inWindow, eligibleCount: candidates.length, sentCount };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runAutonomousPrCitationDispatch().then((r) => console.log('[PR & Citation Dispatcher]', JSON.stringify(r)));
}
