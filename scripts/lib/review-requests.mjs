/**
 * Review Request Engine — pure helpers (no I/O).
 * Google policy compliance: every completed client gets the same ask (no review gating),
 * zero asks for canceled or uncompleted inspections, no incentives, one reminder max, opt-out honored.
 */

export const REMINDER_AFTER_DAYS = 4;
export const HOMEGAUGE_INITIAL_DELAY_MS = 24 * 3600000; // 24h after verified completed report upload
const DAY_MS = 86400000;
const RESCHEDULE_GRACE_MS = 2 * 3600000;

export const digits10 = (s) => String(s || '').replace(/\D/g, '').slice(-10);
export const firstName = (n) => (String(n || '').trim().split(/\s+/)[0] || 'there');

/** Normalize street address to core number + street name ("100 Sample St, Hampton, GA" -> "100 sample st") */
export function normalizeAddressKey(addr = '') {
  const firstSegment = String(addr || '').split(',')[0]
    .replace(/\b(?:apt|unit|ste|suite|lot|#)\s*[a-z0-9-]+\b/gi, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return /^\d+\s+[a-z0-9]/.test(firstSegment) ? firstSegment : '';
}

/** Parse "CANCEL: 100 Sample St | jane@x.com | 404-555-1234" or direct CLI cancel argument */
export function parseCancelIntake(text, now = new Date(), allowBare = false) {
  const raw = String(text || '').trim();
  const isPrefixed = /^(?:cancel|canceled|cancelled)\s*[:|-]\s*/i.test(raw);
  if (!allowBare && !isPrefixed) return null;
  const body = raw.replace(/^(?:cancel|canceled|cancelled)\s*[:|-]\s*/i, '').trim();
  if (!body) return null;
  const parts = body.split(/[|,\n]/).map((p) => p.trim()).filter(Boolean);
  const email = (parts.find((p) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p)) || '').toLowerCase();
  const phonePart = parts.find((p) => !p.includes('@') && !/^\d+\s+[A-Za-z]/.test(p) && digits10(p).length === 10) || '';
  const phone = phonePart ? digits10(phonePart) : '';
  const reportId = parts.find((p) => /^\d{8}-[A-Za-z0-9-]+$/.test(p)) || '';
  const addrPart = parts.find((p) => p !== email && p !== phonePart && p !== reportId && /^\d+\s+[A-Za-z]/.test(p)) || '';
  const namePart = parts.find((p) => p !== email && p !== phonePart && p !== reportId && p !== addrPart) || '';
  const addressKey = normalizeAddressKey(addrPart);
  if (!email && !phone && !addressKey && !reportId && !namePart) return null;
  return {
    email,
    phone,
    address: addrPart,
    addressKey,
    reportId,
    name: namePart,
    canceledAt: now.toISOString(),
    source: isPrefixed ? 'ntfy_cancel' : 'manual_cli_cancel'
  };
}

export function buildCanceledIndex(cancellations = []) {
  const byEmail = new Map(), byPhone = new Map(), byAddress = new Map(), byReportId = new Map();
  const put = (map, key, rec) => {
    if (!key) return;
    const prev = map.get(key);
    if (!prev || String(rec.canceledAt || '') >= String(prev.canceledAt || '')) map.set(key, rec);
  };
  for (const c of cancellations) {
    if (!c) continue;
    put(byEmail, String(c.email || '').toLowerCase().trim(), c);
    put(byPhone, digits10(c.phone).length === 10 ? digits10(c.phone) : '', c);
    put(byAddress, c.addressKey || normalizeAddressKey(c.address), c);
    put(byReportId, String(c.reportId || '').trim().toLowerCase(), c);
  }
  return { byEmail, byPhone, byAddress, byReportId };
}

export function matchCancellation(entry, canceledIndex) {
  if (!entry || !canceledIndex) return null;
  const email = String(entry.email || '').toLowerCase().trim();
  const phone = digits10(entry.phone).length === 10 ? digits10(entry.phone) : '';
  const addrKey = normalizeAddressKey(entry.address);
  const repId = String(entry.reportId || '').trim().toLowerCase();
  const hit = (email && canceledIndex.byEmail?.get(email))
    || (phone && canceledIndex.byPhone?.get(phone))
    || (repId && canceledIndex.byReportId?.get(repId))
    || (addrKey && canceledIndex.byAddress?.get(addrKey))
    || null;
  if (!hit) return null;
  if (entry.completionVerified === true && entry.reportUploadedAt && hit.canceledAt) {
    const upMs = Date.parse(entry.reportUploadedAt), canMs = Date.parse(hit.canceledAt);
    if (!isNaN(upMs) && !isNaN(canMs) && upMs > canMs + RESCHEDULE_GRACE_MS) return null;
  }
  return hit;
}

export const isCanceledEntry = (entry, canceledIndex) => Boolean(entry?.canceledAt || matchCancellation(entry, canceledIndex));

export function reconcileQueueCancellations(queue = [], cancellations = [], now = new Date()) {
  const idx = buildCanceledIndex(cancellations);
  const revoked = [];
  for (const q of queue) {
    if (q.canceledAt) continue;
    const hit = matchCancellation(q, idx);
    if (hit) {
      q.canceledAt = hit.canceledAt || now.toISOString();
      q.cancelReason = hit.source || 'homegauge_canceled';
      revoked.push(q);
    }
  }
  return revoked;
}

/** Parse "Jane Doe | jane@x.com | 404-555-1234 | Lithonia | home inspection" */
export function parseIntake(text) {
  if (/^(?:cancel|canceled|cancelled)\s*[:|-]/i.test(String(text || '').trim())) return null;
  const parts = String(text || '').split(/[|,\n]/).map((p) => p.trim()).filter(Boolean);
  const email = parts.find((p) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p)) || '';
  const phone = parts.find((p) => digits10(p).length === 10 && !p.includes('@') && !/^\d+\s+[A-Za-z]/.test(p)) || '';
  const rest = parts.filter((p) => p !== email && p !== phone);
  const [name = '', city = '', service = 'home inspection'] = rest;
  if (!name || (!email && !phone)) return null;
  return { name, email: email.toLowerCase(), phone: digits10(phone), city, service: service.toLowerCase() };
}

export function upsert(queue, entry, now = new Date(), canceledIndex = null) {
  if (!entry || entry.completionVerified === false || isCanceledEntry(entry, canceledIndex)) return false;
  if (entry.completedAt && Date.parse(entry.completedAt) > now.getTime() + 5 * 60000) return false;
  const dup = queue.find((q) => (entry.email && q.email === entry.email) || (entry.phone && q.phone === entry.phone));
  if (dup) {
    if (entry.name && (!dup.name || !dup.name.includes(' ')) && entry.name.includes(' ')) dup.name = entry.name;
    if (entry.city && !dup.city) dup.city = entry.city;
    if (entry.address && !dup.address) dup.address = entry.address;
    if (entry.completionVerified) dup.completionVerified = true;
    if (entry.reportUploadedAt && !dup.reportUploadedAt) dup.reportUploadedAt = entry.reportUploadedAt;
    return false;
  }
  queue.push({ id: `rv_${now.getTime()}_${queue.length}`, ...entry, addedAt: now.toISOString(), sentAt: null, reminderSentAt: null, reviewedAt: null, optedOut: false, canceledAt: null });
  return true;
}

export function dueActions(queue, now = new Date(), suppressed = new Set(), canceledIndex = null) {
  const out = [];
  for (const e of queue) {
    if (e.optedOut || e.reviewedAt || e.canceledAt || e.completionVerified === false) continue;
    if (isCanceledEntry(e, canceledIndex)) continue;
    if (e.completedAt && Date.parse(e.completedAt) > now.getTime() + 5 * 60000) continue;
    const isHgAuto = String(e.source || '').startsWith('homegauge_');
    if (isHgAuto && e.completionVerified !== true) continue;
    if ((e.email && suppressed.has(e.email)) || (e.phone && suppressed.has(e.phone))) continue;
    if (!e.sentAt) {
      if (isHgAuto && e.addedAt && now - new Date(e.addedAt) < HOMEGAUGE_INITIAL_DELAY_MS) continue;
      out.push({ entry: e, kind: 'initial' });
    } else if (!e.reminderSentAt && now - new Date(e.sentAt) >= REMINDER_AFTER_DAYS * DAY_MS) {
      out.push({ entry: e, kind: 'reminder' });
    }
  }
  return out;
}

const YELP_REVIEW_LINK = 'https://www.yelp.com/biz/foresight-home-inspections-lithonia-2';

export function buildEmail(e, link, kind) {
  const f = firstName(e.name);
  const where = e.city ? ` in ${e.city}` : '';
  if (kind === 'reminder') {
    const text = `Hi ${f},\n\nJust a quick follow-up in case my last note got buried. If you have a minute, a Google or Yelp review of your inspection${where} helps other buyers find us:\nGoogle: ${link}\nYelp: ${YELP_REVIEW_LINK}\n\nThanks either way, and congratulations on the new place.\n\nChristopher Boykin, CMI\nForesight Home Inspections | 678-480-2110`;
    return { subject: `Quick follow-up from Foresight, ${f}`, text, html: toHtml(text, link) };
  }
  const text = `Hi ${f},\n\nThank you for trusting Foresight with your ${e.service || 'home inspection'}${where}. Would you share a quick review of your experience? It takes about a minute, and it helps neighbors find an inspector they can rely on.\n\nLeave a Google review: ${link}\nPrefer Yelp? Leave a Yelp review: ${YELP_REVIEW_LINK}\n\nIf you are comfortable, mentioning ${e.city || 'your city'}, our two-inspector team, or the calibrated infrared thermal scan helps buyers and search assistants match the exact service you received.\n\nAnything in the report unclear? Reply here or call 678-480-2110 and I will walk you through it.\n\nChristopher Boykin, CMI\nForesight Home Inspections`;
  return { subject: `${f}, how did your inspection go?`, text, html: toHtml(text, link) };
}

export function buildSms(e, link, kind) {
  const f = firstName(e.name);
  if (kind === 'reminder') return `Hi ${f}, Chris from Foresight again. If you have a minute, a quick Google review would mean a lot: ${link} Reply STOP to opt out.`;
  return `Hi ${f}, it's Chris with Foresight Home Inspections. Thanks for choosing us${e.city ? ` in ${e.city}` : ''}. Would you share a quick Google review of your experience? ${link} Reply STOP to opt out.`;
}

function toHtml(text, link) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body = esc(text).split('\n\n').map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, '<br>')}</p>`).join('');
  const btn = `<p style="margin:18px 0"><a href="${link}" style="background:#0f172a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">Leave a Google review</a></p>`;
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e293b;max-width:580px;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;background:#ffffff"><div style="background-color:#ffffff;border-bottom:3px solid #d4af37;padding:16px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="52" style="display:block;height:52px;width:auto;border:0;" /><div style="font-size:11px;font-weight:700;color:#0f172a;letter-spacing:0.5px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="52" width="52" style="display:inline-block;height:52px;width:52px;border:0;vertical-align:middle;margin-right:6px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="46" width="46" style="display:inline-block;height:46px;width:46px;border:0;vertical-align:middle;" /></td></tr></table></div><div style="padding:22px 24px">${body.replace(esc(link), `<a href="${link}">${esc(link)}</a>`)}${btn}</div></div>`;
}
