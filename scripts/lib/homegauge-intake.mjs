/**
 * HomeGauge Completed-Job Auto-Intake (IMAP Listener + CSV Export Parser)
 * Zero-PII-leak architecture: all client records stay in gitignored `data/private/`.
 */
import fs from 'node:fs';
import path from 'node:path';
import tls from 'node:tls';

export const digits10 = (s) => String(s || '').replace(/\D/g, '').slice(-10);

const IGNORED_EMAILS = new Set([
  'inspect@foresightcmi.com',
  'plsinspectnow@gmail.com',
  'support@homegauge.com',
  'noreply@homegauge.com',
  'no-reply@homegauge.com',
  'notifications@homegauge.com'
]);

/** Parse CSV line respecting quoted fields */
export function splitCsvLine(line) {
  const out = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur.trim()); cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** Extract name, email, phone from HomeGauge "Customer Information" cell or plain text */
export function parseContactBlob(blob = '') {
  const text = String(blob || '').replace(/\r/g, ' ').trim();
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch && !IGNORED_EMAILS.has(emailMatch[1].toLowerCase()) ? emailMatch[1].toLowerCase() : '';
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/);
  const phone = phoneMatch ? `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}` : '';
  const name = text
    .replace(emailMatch?.[0] || '', '')
    .replace(phoneMatch?.[0] || '', '')
    .replace(/[|(),;<>/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { name, email, phone };
}

/** Parse HomeGauge Business Insights "Download Appointment List CSV" or Contacts CSV */
export function parseHomeGaugeCsv(csvContent = '') {
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
  const iCustomer = idx((h) => h.includes('customer') || h.includes('client') || h.includes('buyer'));
  const iFirst = idx((h) => h.includes('first name') || h === 'first');
  const iLast = idx((h) => h.includes('last name') || h === 'last');
  const iEmail = idx((h) => h.includes('email'));
  const iPhone = idx((h) => h.includes('phone') || h.includes('mobile') || h.includes('cell'));

  const results = [];
  for (let r = 1; r < lines.length; r++) {
    const cols = splitCsvLine(lines[r]);
    if (cols.length < 2) continue;
    let name = '', email = '', phone = '';
    if (iCustomer >= 0 && cols[iCustomer]) {
      ({ name, email, phone } = parseContactBlob(cols[iCustomer]));
    }
    if (!name && (iFirst >= 0 || iLast >= 0)) {
      name = `${cols[iFirst] || ''} ${cols[iLast] || ''}`.trim();
    }
    if (!email && iEmail >= 0) email = (cols[iEmail] || '').toLowerCase().trim();
    if (!phone && iPhone >= 0) phone = digits10(cols[iPhone] || '');
    if (IGNORED_EMAILS.has(email)) email = '';
    if (!name || (!email && !phone)) continue;

    const address = iAddress >= 0 ? cols[iAddress] || '' : '';
    const city = iCity >= 0 ? cols[iCity] || '' : '';
    const service = (iServices >= 0 && cols[iServices] ? cols[iServices] : 'home inspection').toLowerCase();
    const yearBuilt = iYearBuilt >= 0 ? Number(cols[iYearBuilt]) || null : null;
    const curYear = new Date().getFullYear();
    const isNewConstruction = /new construction|pre-drywall|predrywall|phase|builder|11-month/i.test(service)
      || (yearBuilt && yearBuilt >= curYear - 1);
    results.push({
      reportId: iReportId >= 0 ? cols[iReportId] : `hg_csv_${r}`,
      name, email, phone, address, city, service, yearBuilt, isNewConstruction,
      completedAt: (iTime >= 0 && cols[iTime] && !isNaN(Date.parse(cols[iTime]))) ? new Date(cols[iTime]).toISOString() : new Date().toISOString(),
      source: 'homegauge_csv'
    });
  }
  return results;
}

/** Parse a HomeGauge Report Uploaded / Viewed / Notification email body & subject */
export function parseHomeGaugeNotificationEmail(rawText = '', subject = '') {
  const clean = String(rawText || '').replace(/=\r?\n/g, '').replace(/=3D/g, '=').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const combined = `${subject}\n${clean}`;
  if (!/homegauge|inspection report|report is uploaded|report is viewed|agreement has been agreed/i.test(combined)) return null;

  const emails = [...combined.matchAll(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)]
    .map((m) => m[1].toLowerCase())
    .filter((e) => !IGNORED_EMAILS.has(e) && !e.endsWith('@homegauge.com'));
  const email = emails[0] || '';

  const phoneMatch = combined.match(/(?:Client|Customer|Buyer|Phone|Mobile|Cell)[:\s]*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/i);
  const phone = phoneMatch ? `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}` : '';

  const nameMatch = combined.match(/(?:Customer|Client|Buyer|Prepared for|Recipient)[:\s]+([A-Z][a-z]+(?:\s+(?:&\s+[A-Z][a-z]+\s+)?[A-Z][a-z]+)+)/)
    || combined.match(/Hi\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*,/);
  const name = nameMatch ? nameMatch[1].trim() : (email ? email.split('@')[0].replace(/[._-]+/g, ' ') : '');
  if (!name || (!email && !phone)) return null;

  const addrMatch = combined.match(/(?:Address|Property|Report for|Inspection at)[:\s]+(\d+\s+[A-Za-z0-9\s.,#-]+?(?:GA|Georgia)\s*\d{5})/i)
    || subject.match(/(\d+\s+[A-Za-z0-9\s.,#-]+)/);
  const address = addrMatch ? addrMatch[1].trim() : '';
  const cityMatch = address.match(/,\s*([A-Za-z\s]+),\s*(?:GA|Georgia)/i);
  const city = cityMatch ? cityMatch[1].trim() : '';
  const service = /pre-drywall|predrywall/i.test(combined) ? 'pre-drywall inspection'
    : /11-month|builder warranty/i.test(combined) ? '11-month warranty inspection'
    : /new construction/i.test(combined) ? 'new construction inspection'
    : 'home inspection';
  const isNewConstruction = /new construction|pre-drywall|predrywall|phase/i.test(combined);

  return { name, email, phone, address, city, service, isNewConstruction, completedAt: new Date().toISOString(), source: 'homegauge_imap' };
}

/** Poll IMAP inbox for recent @homegauge.com notification emails */
export async function pollHomeGaugeImap(user, pass, seenUids = []) {
  if (!user || !pass) return { jobs: [], newUids: [] };
  const seen = new Set(seenUids.map(String));
  return new Promise((resolve) => {
    const jobs = [], newUids = [];
    let buf = '', step = 0;
    const sinceDate = new Date(Date.now() - 14 * 86400000).toUTCString().split(' ').slice(1, 4).join('-');
    const sock = tls.connect(993, 'imap.gmail.com', { servername: 'imap.gmail.com' });
    const finish = () => { try { sock.destroy(); } catch {} resolve({ jobs, newUids }); };
    const timer = setTimeout(finish, 9500);
    sock.on('error', () => { clearTimeout(timer); finish(); });
    sock.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      if (step === 0 && buf.includes('* OK')) {
        step = 1; buf = ''; sock.write(`A1 LOGIN "${user}" "${pass}"\r\n`);
      } else if (step === 1 && buf.includes('A1 OK')) {
        step = 2; buf = ''; sock.write('A2 SELECT INBOX\r\n');
      } else if (step === 2 && buf.includes('A2 OK')) {
        step = 3; buf = ''; sock.write(`A3 SEARCH SINCE ${sinceDate} FROM "homegauge"\r\n`);
      } else if (step === 3 && buf.includes('A3 OK')) {
        const m = buf.match(/\* SEARCH([0-9 ]+)/);
        const ids = (m ? m[1].trim().split(/\s+/).filter(Boolean) : []).filter((id) => !seen.has(id)).slice(-15);
        if (!ids.length) { clearTimeout(timer); sock.write('A4 LOGOUT\r\n'); return finish(); }
        step = 4; buf = ''; newUids.push(...ids);
        sock.write(`A4 FETCH ${ids.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)] BODY.PEEK[TEXT]<0.2500>)\r\n`);
      } else if (step === 4 && buf.includes('A4 OK')) {
        clearTimeout(timer);
        for (const blk of buf.split(/\* \d+ FETCH/).slice(1)) {
          const subj = (blk.match(/Subject:\s*(.+)/i)?.[1] || '').trim();
          const parsed = parseHomeGaugeNotificationEmail(blk, subj);
          if (parsed) jobs.push(parsed);
        }
        sock.write('A5 LOGOUT\r\n');
        finish();
      } else if (buf.includes('A1 NO') || buf.includes('A1 BAD')) {
        clearTimeout(timer); finish();
      }
    });
  });
}

/** Unified HomeGauge completed-job ingestion (IMAP + drop-in CSV exports + 11-Month Warranty routing) */
export async function ingestHomeGaugeJobs({ privDir, user, pass, cfg }) {
  const jobs = [];
  const csvDir = path.join(privDir, 'homegauge-exports');
  const procDir = path.join(csvDir, 'processed');
  fs.mkdirSync(procDir, { recursive: true });

  for (const file of fs.readdirSync(csvDir).filter((f) => f.toLowerCase().endsWith('.csv'))) {
    const full = path.join(csvDir, file);
    const parsed = parseHomeGaugeCsv(fs.readFileSync(full, 'utf8'));
    jobs.push(...parsed);
    fs.renameSync(full, path.join(procDir, `${Date.now()}_${file}`));
  }

  const imapRes = await pollHomeGaugeImap(user, pass, cfg.seenHomeGaugeImapIds || []);
  if (imapRes.newUids.length) {
    cfg.seenHomeGaugeImapIds = [...new Set([...(cfg.seenHomeGaugeImapIds || []), ...imapRes.newUids])].slice(-200);
  }
  jobs.push(...imapRes.jobs);

  const warrantyFile = path.join(privDir, 'homegauge-warranty-clients.json');
  let warrantyList = [];
  try { warrantyList = JSON.parse(fs.readFileSync(warrantyFile, 'utf8')); } catch {}
  let newWarrantyCount = 0;
  for (const j of jobs) {
    if (!j.isNewConstruction) continue;
    const dup = warrantyList.some((w) => (j.email && w.email === j.email) || (j.phone && w.phone === j.phone));
    if (!dup) {
      warrantyList.push({ id: `hg_w_${Date.now()}_${warrantyList.length}`, ...j });
      newWarrantyCount++;
    }
  }
  if (newWarrantyCount > 0) {
    fs.writeFileSync(warrantyFile, JSON.stringify(warrantyList, null, 2), 'utf8');
  }
  return { jobs, newWarrantyCount };
}
