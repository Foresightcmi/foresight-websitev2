/**
 * Review Request Engine — pure helpers (no I/O).
 * Google policy compliance: every client gets the same ask (no review gating), no incentives,
 * one reminder max, opt-out honored.
 */

export const REMINDER_AFTER_DAYS = 4;
export const HOMEGAUGE_INITIAL_DELAY_MS = 24 * 3600000; // 24h after HomeGauge report upload
const DAY_MS = 86400000;

export const digits10 = (s) => String(s || '').replace(/\D/g, '').slice(-10);
export const firstName = (n) => (String(n || '').trim().split(/\s+/)[0] || 'there');

/** Parse "Jane Doe | jane@x.com | 404-555-1234 | Lithonia | home inspection" (pipes or commas, any order for email/phone). */
export function parseIntake(text) {
  const parts = String(text || '').split(/[|,\n]/).map((p) => p.trim()).filter(Boolean);
  const email = parts.find((p) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p)) || '';
  const phone = parts.find((p) => digits10(p).length === 10 && !p.includes('@')) || '';
  const rest = parts.filter((p) => p !== email && p !== phone);
  const [name = '', city = '', service = 'home inspection'] = rest;
  if (!name || (!email && !phone)) return null;
  return { name, email: email.toLowerCase(), phone: digits10(phone), city, service: service.toLowerCase() };
}

export function upsert(queue, entry, now = new Date()) {
  const dup = queue.find((q) => (entry.email && q.email === entry.email) || (entry.phone && q.phone === entry.phone));
  if (dup) return false;
  queue.push({ id: `rv_${now.getTime()}_${queue.length}`, ...entry, addedAt: now.toISOString(), sentAt: null, reminderSentAt: null, reviewedAt: null, optedOut: false });
  return true;
}

export function dueActions(queue, now = new Date(), suppressed = new Set()) {
  const out = [];
  for (const e of queue) {
    if (e.optedOut || e.reviewedAt) continue;
    if ((e.email && suppressed.has(e.email)) || (e.phone && suppressed.has(e.phone))) continue;
    if (!e.sentAt) {
      const isHgAuto = String(e.source || '').startsWith('homegauge_');
      if (isHgAuto && e.addedAt && now - new Date(e.addedAt) < HOMEGAUGE_INITIAL_DELAY_MS) continue;
      out.push({ entry: e, kind: 'initial' });
    }
    else if (!e.reminderSentAt && now - new Date(e.sentAt) >= REMINDER_AFTER_DAYS * DAY_MS) out.push({ entry: e, kind: 'reminder' });
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
  const text = `Hi ${f},\n\nThank you for trusting Foresight with your ${e.service}${where}. Would you share a quick review of your experience? It takes about a minute, and it helps neighbors find an inspector they can rely on.\n\nLeave a Google review: ${link}\nPrefer Yelp? Leave a Yelp review: ${YELP_REVIEW_LINK}\n\nIf you are comfortable, mentioning ${e.city || 'your city'}, our two-inspector team, or the calibrated infrared thermal scan helps buyers and search assistants match the exact service you received.\n\nAnything in the report unclear? Reply here or call 678-480-2110 and I will walk you through it.\n\nChristopher Boykin, CMI\nForesight Home Inspections`;
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
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e293b;max-width:580px;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;background:#ffffff"><div style="background-color:#0f172a;border-bottom:3px solid #d4af37;padding:16px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="44" style="display:block;height:52px;background:#ffffff;padding:4px 8px;border-radius:6px;width:auto;border:0;" /><div style="font-size:11px;font-weight:700;color:#d4af37;letter-spacing:0.5px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="46" width="46" style="display:inline-block;height:46px;width:46px;border:0;vertical-align:middle;margin-right:6px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="46" width="46" style="display:inline-block;height:46px;width:46px;border:0;vertical-align:middle;" /></td></tr></table></div><div style="padding:22px 24px">${body.replace(esc(link), `<a href="${link}">${esc(link)}</a>`)}${btn}</div></div>`;
}
