/**
 * HomeGauge Completed-Job Auto-Intake & Cancellation Quarantine Guard
 * Zero-PII-leak architecture: all client records stay in gitignored `data/private/`.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import tls from 'node:tls';
import { normalizeAddressKey, buildCanceledIndex, isCanceledEntry, reconcileQueueCancellations } from './review-requests.mjs';

export const digits10 = (s) => String(s || '').replace(/\D/g, '').slice(-10);

const IGNORED_EMAILS = new Set([
  'inspect@foresightcmi.com',
  'plsinspectnow@gmail.com',
  'support@homegauge.com',
  'bounce@homegauge.com',
  'noreply@homegauge.com',
  'no-reply@homegauge.com',
  'no-reply@email.homegauge.com',
  'notifications@homegauge.com'
]);

export function splitCsvLine(line) {
  const out = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

export function parseContactBlob(blob = '') {
  const text = String(blob || '').replace(/\r/g, ' ').trim();
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch && !IGNORED_EMAILS.has(emailMatch[1].toLowerCase()) ? emailMatch[1].toLowerCase() : '';
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?\(?\s*(\d{3})\s*\)?[-.\s]*(\d{3})[-.\s]*(\d{4})/);
  const phone = phoneMatch ? `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}` : '';
  const name = text
    .replace(emailMatch?.[0] || '', '')
    .replace(phoneMatch?.[0] || '', '')
    .replace(/[|(),;<>/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { name, email, phone };
}

/** Parse HomeGauge CSV exports — strictly rejecting canceled, pending, unuploaded, or future rows */
export function parseHomeGaugeCsv(csvContent = '', now = new Date()) {
  const lines = String(csvContent || '').split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  const idx = (pred) => headers.findIndex(pred);
  const iReportId = idx((h) => h.includes('report id') || h === 'id');
  const iTime = idx((h) => h === 'time' || h.includes('date'));
  const iAddress = idx((h) => h.includes('address') || h.includes('street'));
  const iCity = idx((h) => h === 'city');
  const iYearBuilt = idx((h) => h.includes('year built'));
  const iServices = idx((h) => h.includes('service'));
  const iStatus = idx((h) => h.includes('status') || h.includes('state') || h.includes('cancel'));
  const iUploaded = idx((h) => h.includes('uploaded') || h.includes('completed') || h.includes('delivered'));
  const iCustomer = idx((h) => h.includes('customer') || h.includes('client') || h.includes('buyer'));
  const iFirst = idx((h) => h.includes('first name') || h === 'first');
  const iLast = idx((h) => h.includes('last name') || h === 'last');
  const iEmail = idx((h) => h.includes('email'));
  const iPhone = idx((h) => h.includes('phone') || h.includes('mobile') || h.includes('cell'));

  const results = [];
  for (let r = 1; r < lines.length; r++) {
    const cols = splitCsvLine(lines[r]);
    if (cols.length < 2) continue;
    const statusVal = iStatus >= 0 ? (cols[iStatus] || '') : '';
    const uploadedVal = iUploaded >= 0 ? (cols[iUploaded] || '').trim() : '';
    if (/\bcancel(?:ed|led)\b|\bno[- ]?show\b|\brescheduled\b|\bvoid\b|\bpending\b|\bscheduled\b|\brequested\b/i.test(statusVal)) continue;
    if (iUploaded >= 0 && /^(?:no|false|0|n|pending|unuploaded|draft)$/i.test(uploadedVal)) continue;
    if (iTime >= 0 && cols[iTime] && !isNaN(Date.parse(cols[iTime])) && Date.parse(cols[iTime]) > now.getTime() + 5 * 60000) continue;

    let name = '', email = '', phone = '';
    if (iCustomer >= 0 && cols[iCustomer]) ({ name, email, phone } = parseContactBlob(cols[iCustomer]));
    if (!name && (iFirst >= 0 || iLast >= 0)) name = `${cols[iFirst] || ''} ${cols[iLast] || ''}`.trim();
    if (!email && iEmail >= 0) email = (cols[iEmail] || '').toLowerCase().trim();
    if (!phone && iPhone >= 0) phone = digits10(cols[iPhone] || '');
    if (IGNORED_EMAILS.has(email)) email = '';
    if (!name || (!email && !phone)) continue;

    const address = iAddress >= 0 ? cols[iAddress] || '' : '';
    const city = iCity >= 0 ? cols[iCity] || '' : '';
    const service = (iServices >= 0 && cols[iServices] ? cols[iServices] : 'home inspection').toLowerCase();
    const yearBuilt = iYearBuilt >= 0 ? Number(cols[iYearBuilt]) || null : null;
    const curYear = now.getFullYear();
    const isNewConstruction = /new construction|pre-drywall|predrywall|phase|builder|11-month/i.test(service) || Boolean(yearBuilt && yearBuilt >= curYear - 1);
    const completedAt = (iTime >= 0 && cols[iTime] && !isNaN(Date.parse(cols[iTime]))) ? new Date(cols[iTime]).toISOString() : now.toISOString();
    results.push({
      reportId: iReportId >= 0 ? cols[iReportId] : `hg_csv_${r}`,
      name, email, phone, address, city, service, yearBuilt, isNewConstruction,
      completionVerified: true, reportUploadedAt: completedAt, completedAt, source: 'homegauge_csv'
    });
  }
  return results;
}

function cleanImapHtml(rawText = '') {
  return String(rawText || '')
    .replace(/=\r?\n/g, '')
    .replace(/=3D/g, '=')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parse HomeGauge "Inspection Canceled for <Date> - <Address>" email into quarantine record */
export function parseHomeGaugeCancellationEmail(rawText = '', subject = '', dateHeader = '') {
  const clean = cleanImapHtml(rawText);
  const subj = String(subject || '').trim();
  if (!/\bcancel(?:ed|led)\b/i.test(subj) && !/\bInspection Cancel(?:ed|led)!/i.test(clean)) return null;

  const custSection = (clean.match(/Customer\(s\)([\s\S]*?)(?:Real Estate Professional\(s\)|Service\s+Price|Report ID:|$)/i)?.[1] || clean);
  const emails = [...custSection.matchAll(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)]
    .map((m) => m[1].toLowerCase())
    .filter((e) => !IGNORED_EMAILS.has(e) && !e.endsWith('@homegauge.com'));
  const email = emails[0] || '';
  const phoneMatch = custSection.match(/(?:Mobile|Phone|Cell)?[:\s]*\(?\s*(\d{3})\s*\)?[-.\s]*(\d{3})[-.\s]*(\d{4})/i);
  const phone = phoneMatch ? `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}` : '';
  const nameMatch = custSection.match(/^\s*([A-Za-z][A-Za-z\s.'&-]{1,50}?)(?:\s*\(|\s+[a-zA-Z0-9._%+-]+@)/);
  const name = nameMatch ? nameMatch[1].trim() : '';
  const subjAddr = subj.match(/-\s*(\d+\s+.+)$/)?.[1]?.trim() || '';
  const bodyAddr = clean.match(/\b(\d+\s+[A-Za-z0-9\s.,#-]+?,\s*(?:GA|Georgia)\s*\d{5})\b/i)?.[1]?.trim() || '';
  const address = subjAddr || bodyAddr;
  const addressKey = normalizeAddressKey(address);
  const reportId = clean.match(/Report ID:\s*([A-Za-z0-9-]+)/i)?.[1]?.trim() || '';
  if (!email && !phone && !addressKey && !reportId) return null;
  const canceledAt = (dateHeader && !isNaN(Date.parse(dateHeader))) ? new Date(dateHeader).toISOString() : new Date().toISOString();
  return { name, email, phone, address, addressKey, reportId, canceledAt, source: 'homegauge_imap_canceled' };
}

/** Parse ONLY genuine completed & uploaded HomeGauge Inspection Report Customer-Viewed emails */
export function parseHomeGaugeNotificationEmail(rawText = '', subject = '', dateHeader = '') {
  const subj = String(subject || '').trim();
  const clean = cleanImapHtml(rawText);
  const combined = `${subj}\n${clean}`;

  // Hard reject pre-inspection, cancellation, agreement, payment, bounce, attachment, and Realtor/3rd-party emails
  if (/\bcancel(?:ed|led)\b|\bappointment requested\b|\bscheduled\b|\bappointment has been changed\b|\brescheduled\b/i.test(combined)) return null;
  if (/\bagreement\b|\bhas been agreed\b|\bpayment received\b|\binvoice created\b|\bthank you for your payment\b|\bcouldn't charge\b|\bsubscription\b/i.test(combined)) return null;
  if (/\berror sending email\b|\bunable to deliver\b|\bcause of failure\b|\bbounce@homegauge\.com\b/i.test(combined)) return null;
  if (/\bpeace of mind guide\b|\bbuildfax\b|\bpreparation checklist\b|\brequest list for\b|\b3rd party\b|\bviewed by rep\b/i.test(combined)) return null;

  if (!/^(?:Inspection Report|Wood Destroying Insect|Radon Report|Mold Report|Air Quality Report|Sewer Scope Report|Pre-Drywall[^]*Report|11-Month[^]*Report)\s+for\s+.+\s+Viewed$/i.test(subj)) {
    return null;
  }

  const m = clean.match(/(?:Inspection Report|Wood Destroying Insect|Radon Report|Mold Report|Air Quality Report|Sewer Scope Report)\s+uploaded on\s+([0-9T:\s-]+(?:\s*[A-Z]{2,4})?)\s+for\s+(.+?)\s+has been viewed by Customer\s+([^/<\r\n]+?)\s*\/\s*([^\s<)]+)/i);
  if (!m) return null;

  const [, uploadedRaw, rawAddr, rawCustomerName, rawHandle] = m;
  const handleLower = rawHandle.trim().toLowerCase();
  const email = (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(handleLower) && !IGNORED_EMAILS.has(handleLower) && !handleLower.endsWith('@homegauge.com')) ? handleLower : '';
  const phoneMatch = clean.match(/(?:Client|Customer|Buyer|Phone|Mobile|Cell)[:\s]*\(?\s*(\d{3})\s*\)?[-.\s]*(\d{3})[-.\s]*(\d{4})/i);
  const phone = phoneMatch ? `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}` : '';
  const name = rawCustomerName.trim();
  if (!name || (!email && !phone)) return null;

  const address = rawAddr.trim();
  const cityMatch = address.match(/,\s*([A-Za-z\s]+),\s*(?:GA|Georgia)/i);
  const city = cityMatch ? cityMatch[1].trim() : '';
  const service = /wood destroying|wdo|termite/i.test(subj) ? 'termite & WDO inspection'
    : /pre-drywall|predrywall/i.test(combined) ? 'pre-drywall inspection'
    : /11-month|builder warranty/i.test(combined) ? '11-month warranty inspection'
    : /new construction/i.test(combined) ? 'new construction inspection'
    : 'home inspection';
  const isNewConstruction = /new construction|pre-drywall|predrywall|phase/i.test(combined);
  const parsedUp = Date.parse(uploadedRaw.trim().replace(/\s+EDT|\s+EST/i, ''));
  const reportUploadedAt = !isNaN(parsedUp) ? new Date(parsedUp).toISOString() : ((dateHeader && !isNaN(Date.parse(dateHeader))) ? new Date(dateHeader).toISOString() : new Date().toISOString());

  return {
    name, email, phone, address, city, service, isNewConstruction,
    completionVerified: true, reportUploadedAt, completedAt: reportUploadedAt, source: 'homegauge_imap'
  };
}

/** Poll IMAP inbox for HomeGauge cancellations (30d) and completed-report customer views */
export async function pollHomeGaugeImap(user, pass, seenUids = [], seenCancelUids = []) {
  if (!user || !pass) return { jobs: [], cancellations: [], newUids: [], newCancelUids: [] };
  const seen = new Set(seenUids.map(String)), seenCan = new Set(seenCancelUids.map(String));
  return new Promise((resolve) => {
    const jobs = [], cancellations = [], newUids = [], newCancelUids = [];
    let buf = '', step = 0, cancelIds = [], viewIds = [];
    const sinceDate = new Date(Date.now() - 30 * 86400000).toUTCString().split(' ').slice(1, 4).join('-');
    const sock = tls.connect(993, 'imap.gmail.com', { servername: 'imap.gmail.com' });
    const finish = () => { try { sock.destroy(); } catch {} resolve({ jobs, cancellations, newUids, newCancelUids }); };
    const timer = setTimeout(finish, 9500);
    sock.on('error', () => { clearTimeout(timer); finish(); });
    sock.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      if (step === 0 && buf.includes('* OK')) { step = 1; buf = ''; sock.write(`A1 LOGIN "${user}" "${pass}"\r\n`); }
      else if (step === 1 && buf.includes('A1 OK')) { step = 2; buf = ''; sock.write('A2 SELECT INBOX\r\n'); }
      else if (step === 2 && buf.includes('A2 OK')) { step = 3; buf = ''; sock.write(`A3 SEARCH SINCE ${sinceDate} FROM "homegauge"\r\n`); }
      else if (step === 3 && buf.includes('A3 OK')) {
        const ids = ((buf.match(/\* SEARCH([0-9 ]+)/)?.[1] || '').trim().split(/\s+/).filter(Boolean))
          .filter((id) => !seen.has(id) || !seenCan.has(id)).slice(-80);
        if (!ids.length) { clearTimeout(timer); sock.write('A4 LOGOUT\r\n'); return finish(); }
        step = 4; buf = '';
        sock.write(`A4 FETCH ${ids.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])\r\n`);
      } else if (step === 4 && buf.includes('A4 OK')) {
        for (const blk of buf.split(/\* (?=\d+ FETCH)/).slice(1)) {
          const id = blk.match(/^(\d+) FETCH/)?.[1];
          const subj = (blk.match(/Subject:\s*(.+)/i)?.[1] || '').trim();
          if (!id) continue;
          if (!seenCan.has(id)) {
            newCancelUids.push(id);
            if (/\bcancel(?:ed|led)\b/i.test(subj)) cancelIds.push(id);
          }
          if (!seen.has(id)) {
            newUids.push(id);
            if (/^(?:Inspection Report|Wood Destroying Insect|Radon Report|Mold Report|Air Quality Report|Sewer Scope Report)\s+for\s+.+\s+Viewed$/i.test(subj)) viewIds.push(id);
          }
        }
        if (cancelIds.length) { step = 5; buf = ''; sock.write(`A5 FETCH ${cancelIds.join(',')} (BODY.PEEK[HEADER.FIELDS (SUBJECT DATE)] BODY.PEEK[TEXT]<0.45000>)\r\n`); }
        else if (viewIds.length) { step = 6; buf = ''; sock.write(`A6 FETCH ${viewIds.join(',')} (BODY.PEEK[HEADER.FIELDS (SUBJECT DATE)] BODY.PEEK[TEXT]<0.3500>)\r\n`); }
        else { clearTimeout(timer); sock.write('A7 LOGOUT\r\n'); finish(); }
      } else if (step === 5 && buf.includes('A5 OK')) {
        for (const blk of buf.split(/\* (?=\d+ FETCH)/).slice(1)) {
          const subj = (blk.match(/Subject:\s*(.+)/i)?.[1] || '').trim();
          const dt = (blk.match(/Date:\s*(.+)/i)?.[1] || '').trim();
          const parsed = parseHomeGaugeCancellationEmail(blk, subj, dt);
          if (parsed) cancellations.push(parsed);
        }
        if (viewIds.length) { step = 6; buf = ''; sock.write(`A6 FETCH ${viewIds.join(',')} (BODY.PEEK[HEADER.FIELDS (SUBJECT DATE)] BODY.PEEK[TEXT]<0.3500>)\r\n`); }
        else { clearTimeout(timer); sock.write('A7 LOGOUT\r\n'); finish(); }
      } else if (step === 6 && buf.includes('A6 OK')) {
        clearTimeout(timer);
        for (const blk of buf.split(/\* (?=\d+ FETCH)/).slice(1)) {
          const subj = (blk.match(/Subject:\s*(.+)/i)?.[1] || '').trim();
          const dt = (blk.match(/Date:\s*(.+)/i)?.[1] || '').trim();
          const parsed = parseHomeGaugeNotificationEmail(blk, subj, dt);
          if (parsed) jobs.push(parsed);
        }
        sock.write('A7 LOGOUT\r\n'); finish();
      } else if (buf.includes('A1 NO') || buf.includes('A1 BAD')) { clearTimeout(timer); finish(); }
    });
  });
}

/** Scan local HomeGauge Desktop Reports (`RIUploaded === "1"` + findings/photos) for ground-truth completion verification */
export function scanLocalCompletedHr5Reports(hr5SinceIso = '2026-10-30T00:00:00.000Z', now = new Date()) {
  const byAddressKey = new Map(), completedJobs = [];
  const reportsDir = path.join(os.homedir(), 'Documents', 'HomeGauge', 'Reports');
  if (!fs.existsSync(reportsDir)) return { byAddressKey, completedJobs };
  const sinceMs = Date.parse(hr5SinceIso) || 0;
  const recentCutoffMs = now.getTime() - 45 * 86400000;

  for (const folder of fs.readdirSync(reportsDir)) {
    const fp = path.join(reportsDir, folder, 'report.hr5');
    if (!fs.existsSync(fp)) continue;
    let st;
    try { st = fs.statSync(fp); } catch { continue; }
    if (st.mtimeMs < recentCutoffMs) continue;
    const xml = fs.readFileSync(fp, 'utf8');
    const prop = (n) => (xml.match(new RegExp(`<prop\\s+name="${n}"[^>]*>([\\s\\S]*?)</prop>`, 'i'))?.[1] || '').trim();
    const uploaded = prop('RIUploaded') === '1';
    const hasContent = /<Pic|<Comment/i.test(xml);
    const address = prop('RIAddress1');
    const addrKey = normalizeAddressKey(address);
    const name = `${prop('CFName1')} ${prop('CLName1')}`.trim();
    const rawEmail = prop('CEmail').toLowerCase();
    const email = (!IGNORED_EMAILS.has(rawEmail) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail)) ? rawEmail : '';
    const phone = digits10(prop('CMobilePhone') || prop('CHomePhone'));
    const city = prop('RICity');
    const rawDate = prop('RIDate').replace(/\//g, '-');
    const inspMs = rawDate && !isNaN(Date.parse(rawDate)) ? Date.parse(rawDate) : st.mtimeMs;
    const svcRaw = (xml.match(/<SName>([\s\S]*?)<\/SName>/i)?.[1] || 'home inspection').trim().toLowerCase();
    const isNewConstruction = /new construction|pre-drywall|predrywall|phase|11-month/i.test(svcRaw);
    const rec = {
      reportId: folder, name, email, phone, address, city, service: svcRaw, isNewConstruction,
      uploaded, hasContent, completionVerified: uploaded && hasContent,
      reportUploadedAt: st.mtime.toISOString(), completedAt: new Date(inspMs).toISOString(), source: 'homegauge_hr5'
    };
    if (addrKey) byAddressKey.set(addrKey, rec);
    if (uploaded && hasContent && inspMs >= sinceMs && inspMs <= now.getTime() + 5 * 60000 && name && (email || phone)) {
      completedJobs.push(rec);
    }
  }
  return { byAddressKey, completedJobs };
}

export function mergeCancellations(existing = [], incoming = []) {
  const out = [...existing];
  let addedCount = 0;
  for (const c of incoming) {
    if (!c) continue;
    const keyAddr = c.addressKey || normalizeAddressKey(c.address);
    const dup = out.some((x) =>
      (c.reportId && x.reportId && c.reportId.toLowerCase() === x.reportId.toLowerCase())
      || (c.email && x.email && c.email === x.email && (!keyAddr || !x.addressKey || keyAddr === x.addressKey))
      || (keyAddr && x.addressKey === keyAddr && String(c.canceledAt || '').slice(0, 10) === String(x.canceledAt || '').slice(0, 10))
    );
    if (!dup) { out.push({ ...c, addressKey: keyAddr }); addedCount++; }
  }
  return { list: out, addedCount };
}

/** Unified HomeGauge completed-job ingestion + cancellation quarantine */
export async function ingestHomeGaugeJobs({ privDir, user, pass, cfg, extraCancellations = [] }) {
  const cancelFile = path.join(privDir, 'canceled-inspections.json');
  let savedCancels = [];
  try { savedCancels = JSON.parse(fs.readFileSync(cancelFile, 'utf8')); } catch {}

  const candidateJobs = [];
  const csvDir = path.join(privDir, 'homegauge-exports');
  const procDir = path.join(csvDir, 'processed');
  fs.mkdirSync(procDir, { recursive: true });

  for (const file of fs.readdirSync(csvDir).filter((f) => f.toLowerCase().endsWith('.csv'))) {
    const full = path.join(csvDir, file);
    candidateJobs.push(...parseHomeGaugeCsv(fs.readFileSync(full, 'utf8')));
    fs.renameSync(full, path.join(procDir, `${Date.now()}_${file}`));
  }

  const imapRes = await pollHomeGaugeImap(user, pass, cfg.seenHomeGaugeImapIds || [], cfg.seenHomeGaugeCancelIds || []);
  if (imapRes.newUids.length) cfg.seenHomeGaugeImapIds = [...new Set([...(cfg.seenHomeGaugeImapIds || []), ...imapRes.newUids])].slice(-300);
  if (imapRes.newCancelUids.length) cfg.seenHomeGaugeCancelIds = [...new Set([...(cfg.seenHomeGaugeCancelIds || []), ...imapRes.newCancelUids])].slice(-300);
  candidateJobs.push(...imapRes.jobs);

  const merged = mergeCancellations(savedCancels, [...extraCancellations, ...imapRes.cancellations]);
  if (merged.addedCount > 0 || !fs.existsSync(cancelFile)) {
    fs.writeFileSync(cancelFile, JSON.stringify(merged.list, null, 2), 'utf8');
  }
  const canceledIndex = buildCanceledIndex(merged.list);

  if (!cfg.hr5CompletedSince) cfg.hr5CompletedSince = '2026-10-30T00:00:00.000Z';
  const hr5 = scanLocalCompletedHr5Reports(cfg.hr5CompletedSince);
  candidateJobs.push(...hr5.completedJobs);

  const jobs = [];
  for (const j of candidateJobs) {
    if (isCanceledEntry(j, canceledIndex)) continue;
    const localRec = hr5.byAddressKey.get(normalizeAddressKey(j.address));
    if (localRec) {
      if (!localRec.uploaded || !localRec.hasContent) continue; // Local draft exists but report NOT uploaded -> block!
      if (localRec.name && (!j.name || !j.name.includes(' '))) j.name = localRec.name;
      if (localRec.city && !j.city) j.city = localRec.city;
      if (localRec.phone && !j.phone) j.phone = localRec.phone;
      if (localRec.email && !j.email) j.email = localRec.email;
    }
    if (j.completionVerified === true) jobs.push(j);
  }

  const warrantyFile = path.join(privDir, 'homegauge-warranty-clients.json');
  let warrantyList = [];
  try { warrantyList = JSON.parse(fs.readFileSync(warrantyFile, 'utf8')); } catch {}
  const revokedWarranty = reconcileQueueCancellations(warrantyList, merged.list);
  let newWarrantyCount = 0;
  for (const j of jobs) {
    if (!j.isNewConstruction) continue;
    const dup = warrantyList.some((w) => (j.email && w.email === j.email) || (j.phone && w.phone === j.phone));
    if (!dup) { warrantyList.push({ id: `hg_w_${Date.now()}_${warrantyList.length}`, ...j }); newWarrantyCount++; }
  }
  if (newWarrantyCount > 0 || revokedWarranty.length > 0) {
    fs.writeFileSync(warrantyFile, JSON.stringify(warrantyList, null, 2), 'utf8');
  }
  return { jobs, cancellations: merged.list, newCancelCount: merged.addedCount, newWarrantyCount, hr5ByAddress: hr5.byAddressKey };
}
