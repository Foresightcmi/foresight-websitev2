import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { digits10, firstName, normalizeAddressKey, buildCanceledIndex, isCanceledEntry } from './review-requests.mjs';

const DAY_MS = 86400000;
const IGNORED_EMAILS = new Set(['inspect@foresightcmi.com', 'christopher@fhinspectionsatl.com', 'info@fhinspectionsatl.com']);
const BLOCKED_BROKER_RX = /ansley|chapman\s+group|amy\s+fuchs|joe\s+chapman/i;

export function extractLotKey(address = '', city = '') {
  const m = String(address || '').toLowerCase().match(/\blot\s*#?\s*([a-z0-9-]+)\s+([a-z0-9\s]{3,30})/);
  if (!m) return '';
  const lotNum = m[1].trim();
  const subRoot = m[2].trim().split(/\s+/).slice(0, 2).join(' ');
  const cityClean = String(city || '').toLowerCase().trim();
  return lotNum && subRoot ? `${lotNum}:${subRoot}:${cityClean}` : '';
}

function extractSurname(name = '') {
  const parts = String(name || '').trim().toLowerCase().replace(/[^a-z\s-]/g, '').split(/\s+/).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 1] : '';
}

export function fourKeySet(rec = {}) {
  const keys = [];
  const addrKey = normalizeAddressKey(rec.address);
  const zip = String(rec.zip || '').trim().slice(0, 5);
  const lotKey = extractLotKey(rec.address, rec.city);
  const em = String(rec.email || '').toLowerCase().trim();
  const ph = digits10(rec.phone || rec.raw_phone);
  const surname = extractSurname(rec.name);
  if (addrKey) {
    keys.push(`addr:${addrKey}`);
    if (zip) keys.push(`addrzip:${addrKey}:${zip}`);
  }
  if (lotKey) keys.push(`lot:${lotKey}`);
  if (em) keys.push(`email:${em}`);
  if (ph.length === 10 && surname) keys.push(`phonesurname:${ph}:${surname}`);
  else if (ph.length === 10) keys.push(`phone:${ph}`);
  return keys;
}

export function isPreDrywallService(svc = '') {
  return /pre-?\s*drywall|predrywall|phase\s*1|framing\s+inspection/i.test(String(svc || ''));
}

export function isFinalOrNewBuildService(svc = '') {
  const s = String(svc || '');
  if (isPreDrywallService(s) || /11-?\s*month|builder\s+warranty|mold|radon|sewer|termite|wdo|pool|re-?inspection/i.test(s)) return false;
  return /new\s+construction|new\s+build|phase\s*2|final\s+walkthrough/i.test(s);
}

function isBlockedContact(rec = {}, suppressedSet = new Set()) {
  const fields = [rec.name, rec.email, rec.agentName, rec.agentEmail, rec.agentBrokerage].map((x) => String(x || '').trim()).join(' ');
  if (BLOCKED_BROKER_RX.test(fields)) return true;
  const em = String(rec.email || '').toLowerCase().trim();
  const ph = digits10(rec.phone || rec.raw_phone);
  if ((em && suppressedSet.has(em)) || (ph.length === 10 && suppressedSet.has(ph))) return true;
  return false;
}

export function scanAllHistoricalHr5Reports(reportsDir = path.join(os.homedir(), 'Documents', 'HomeGauge', 'Reports')) {
  if (!fs.existsSync(reportsDir)) return [];
  const out = [];
  for (const folder of fs.readdirSync(reportsDir)) {
    const fp = path.join(reportsDir, folder, 'report.hr5');
    if (!fs.existsSync(fp)) continue;
    let xml = '', st = null;
    try { st = fs.statSync(fp); xml = fs.readFileSync(fp, 'utf8'); } catch { continue; }
    const prop = (n) => (xml.match(new RegExp(`<prop\\s+name="${n}"[^>]*>([\\s\\S]*?)</prop>`, 'i'))?.[1] || '').trim();
    const uploaded = prop('RIUploaded') === '1';
    const hasContent = /<Pic|<Comment/i.test(xml);
    if (!uploaded || !hasContent) continue;
    const rawEmail = prop('CEmail').toLowerCase();
    const email = (!IGNORED_EMAILS.has(rawEmail) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail)) ? rawEmail : '';
    const phone = digits10(prop('CMobilePhone') || prop('CHomePhone'));
    const rawDate = prop('RIDate').replace(/\//g, '-');
    const inspMs = rawDate && !isNaN(Date.parse(rawDate)) ? Date.parse(rawDate) : st.mtimeMs;
    const svcRaw = (xml.match(/<SName>([\s\S]*?)<\/SName>/i)?.[1] || 'home inspection').trim();
    out.push({
      id: `hr5_${folder}`, reportId: folder,
      name: `${prop('CFName1')} ${prop('CLName1')}`.trim(),
      email, phone,
      address: prop('RIAddress1'), city: prop('RICity'), zip: prop('RIZip'),
      service: svcRaw,
      agentName: `${prop('RepFName')} ${prop('RepLName')}`.trim(),
      agentEmail: prop('RepEmail').toLowerCase(),
      agentBrokerage: prop('RepCompany'),
      completionVerified: true,
      completedAt: new Date(inspMs).toISOString(),
      source: 'homegauge_hr5_historical'
    });
  }
  return out;
}
export function mineWarmWarrantyAndFinalCohorts({
  records = [],
  cancellations = [],
  suppressedSet = new Set(),
  alreadySentKeys = new Set(),
  now = new Date()
}) {
  const canceledIdx = buildCanceledIndex(cancellations);
  const nowMs = now.getTime();
  const valid = records.filter((r) => r && r.completionVerified !== false && !isCanceledEntry(r, canceledIdx));

  const latestByKey = new Map();
  for (const r of valid) {
    const ms = Date.parse(r.completedAt || r.date || '');
    if (isNaN(ms)) continue;
    for (const k of fourKeySet(r)) {
      const prev = latestByKey.get(k) || 0;
      if (ms > prev) latestByKey.set(k, ms);
    }
  }

  const cohort11Month = [];
  const cohortFinal = [];
  const seenOutKeys = new Set();

  for (const r of valid) {
    const email = String(r.email || '').toLowerCase().trim();
    if (!email || !email.includes('@')) continue;
    if (isBlockedContact(r, suppressedSet)) continue;

    const inspMs = Date.parse(r.completedAt || r.date || '');
    if (isNaN(inspMs) || inspMs > nowMs) continue;
    const ageDays = (nowMs - inspMs) / DAY_MS;

    const keys = fourKeySet(r);
    if (keys.some((k) => alreadySentKeys.has(k) || seenOutKeys.has(k))) continue;
    // 4-key cross-stage dedup: suppress if ANY later inspection exists for this address, lot, email, or phone+surname
    if (keys.some((k) => (latestByKey.get(k) || 0) > inspMs + 3 * DAY_MS)) continue;

    if (isFinalOrNewBuildService(r.service) && ageDays >= 270 && ageDays <= 395) {
      keys.forEach((k) => seenOutKeys.add(k));
      cohort11Month.push({ ...r, email, cohort: '11_month_warranty', ageDays: Math.round(ageDays) });
    } else if (isPreDrywallService(r.service) && ageDays >= 30 && ageDays <= 160) {
      keys.forEach((k) => seenOutKeys.add(k));
      cohortFinal.push({ ...r, email, cohort: 'final_walkthrough', ageDays: Math.round(ageDays) });
    }
  }

  return { cohort11Month, cohortFinal };
}

function streetNameOnly(address = '', city = '') {
  const seg = String(address || '').split(',')[0].replace(/^\d+\s+/, '').trim();
  if (seg && seg.length >= 3) return city ? `${seg} in ${city}` : seg;
  return city ? `your new build in ${city}` : 'your new construction home';
}

export function buildWarrantyCheckinEmail(rec = {}, cohortKind = '11_month_warranty') {
  const f = firstName(rec.name);
  const propLabel = streetNameOnly(rec.address, rec.city);
  const quoteUrl = 'https://www.fhinspectionsatl.com/quote';
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const is11m = cohortKind === '11_month_warranty';
  const subject = is11m
    ? `11-month builder warranty check-in (${rec.city || 'Metro Atlanta'})`
    : `Final walkthrough check-in on ${propLabel}`;

  const text = is11m
    ? `Hi ${f},\n\nIt has been about ${Math.max(9, Math.round((rec.ageDays || 300) / 30))} months since our team inspected ${propLabel} for you. If you closed on the home, your builder's 1-year workmanship warranty is approaching its expiration window.\n\nBefore month 12 arrives, we perform a full 11-Month Builder Warranty Inspection (From $345, including two certified inspectors, calibrated infrared thermal imaging, 4K drone roof scanning, and a builder-ready punch list) so your builder addresses settlement cracks, roof flashing gaps, plumbing leaks, or HVAC imbalances under warranty.\n\nIf you already scheduled or went a different direction on that property, no action is needed at all — this is a single courtesy check-in. Otherwise, you can lock in a morning slot online at ${quoteUrl} or reply here anytime.\n\nReply STOP anytime to opt out.\n\nChristopher Boykin, CMI (#MICB-1082)\nForesight Home Inspections, LLC • Lithonia, GA 30058\n(678) 480-2110`
    : `Hi ${f},\n\nChecking in on the Phase 1 Pre-Drywall inspection our team completed for you on ${propLabel}. As drywall, trim, and mechanical hookups wrap up ahead of your builder orientation, we wanted to make sure your Phase 2 Final New Construction Inspection (From $400, with two certified inspectors, calibrated infrared thermal imaging, 4K drone roof scan, and up to $35,000 combined protection) is on our calendar 3 to 5 days before closing.\n\nIf your closing timeline shifted or you already made arrangements, no worries at all — this is my only check-in note. Otherwise, reply here with your target walkthrough week or schedule 24/7 at ${quoteUrl}.\n\nReply STOP anytime to opt out.\n\nChristopher Boykin, CMI (#MICB-1082)\nForesight Home Inspections, LLC • Lithonia, GA 30058\n(678) 480-2110`;

  const ctaLabel = is11m ? 'Schedule 11-Month Warranty Inspection (From $345)' : 'Schedule Final New Construction Inspection (From $400)';
  const bodyHtml = esc(text).split('\n\n').map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, '<br>')}</p>`).join('').replace(esc(quoteUrl), `<a href="${quoteUrl}" style="color:#9b2c2c;font-weight:700">${esc(quoteUrl)}</a>`);
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e293b;max-width:580px;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;background:#ffffff"><div style="background-color:#ffffff;border-bottom:3px solid #d4af37;padding:16px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="64" style="display:block;height:64px;width:auto;border:0;" /><div style="font-size:11px;font-weight:700;color:#0f172a;letter-spacing:0.5px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;margin-right:8px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;" /></td></tr></table></div><div style="padding:22px 24px">${bodyHtml}<p style="margin:18px 0"><a href="${quoteUrl}" style="background:#0f172a;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block">${ctaLabel}</a></p></div></div>`;
  return { subject, text, html };
}
