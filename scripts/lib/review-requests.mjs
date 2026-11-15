// Review Request Engine — pure helpers (no I/O).
// Google policy compliance: every completed client gets the same neutral ask (no review gating),
// zero asks for canceled or uncompleted inspections, no incentives, 3-touch max cap, opt-out honored.

export const REMINDER_AFTER_DAYS = 7;
export const CLOSING_CHECK_AFTER_DAYS = 7; // Deprecated alias preserved only for backwards import compatibility; max 2 touches total
export const MAX_TOUCHES_PER_CLIENT = 2;
export const HOMEGAUGE_INITIAL_DELAY_MS = 4 * 3600000; // 4h after customer views completed report
const DAY_MS = 86400000;
export const MIN_GAP_BETWEEN_TOUCHES_MS = 6 * DAY_MS;
const RECENT_WINDOW_MS = 180 * DAY_MS;
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
  const entryAddrKey = normalizeAddressKey(entry.address);
  const dup = queue.find((q) =>
    (entry.email && q.email === entry.email)
    || (entry.phone && q.phone === entry.phone)
    || (entryAddrKey && normalizeAddressKey(q.address) === entryAddrKey)
  );
  if (dup) {
    if (entry.name && (!dup.name || !dup.name.includes(' ')) && entry.name.includes(' ')) dup.name = entry.name;
    if (entry.email && !dup.email) dup.email = entry.email;
    if (entry.phone && !dup.phone) dup.phone = entry.phone;
    if (entry.city && !dup.city) dup.city = entry.city;
    if (entry.address && !dup.address) dup.address = entry.address;
    if (entry.reportId && !dup.reportId) dup.reportId = entry.reportId;
    if (entry.completionVerified) dup.completionVerified = true;
    if (entry.reportUploadedAt && !dup.reportUploadedAt) dup.reportUploadedAt = entry.reportUploadedAt;
    if (entry.reportViewedAt && (!dup.reportViewedAt || entry.reportViewedAt < dup.reportViewedAt)) dup.reportViewedAt = entry.reportViewedAt;
    if (entry.customerViewedReport) dup.customerViewedReport = true;
    return false;
  }
  if (!entry.email && !entry.phone) return false;
  queue.push({ id: `rv_${now.getTime()}_${queue.length}`, ...entry, addedAt: now.toISOString(), sentAt: null, emailSentAt: null, smsSentAt: null, reminderSentAt: null, closingCheckSentAt: null, reviewedAt: null, optedOut: false, canceledAt: null });
  return true;
}

export function getMemoryPromptChips(city = '') {
  const loc = city ? city : 'your Metro Atlanta neighborhood';
  return [
    `City or Neighborhood: Mentioning ${loc} helps local homebuyers find us`,
    `On-Site Team and Thermal Scan: Our two-inspector team and calibrated infrared thermal camera scan`,
    `Report Clarity: How the same-day interactive digital report helped with your repair priorities`
  ];
}

export function identityKeys(entry = {}) {
  const keys = [];
  const em = String(entry.email || '').toLowerCase().trim();
  const ph = digits10(entry.phone || entry.raw_phone);
  const addr = normalizeAddressKey(entry.address);
  if (em) keys.push(`email:${em}`);
  if (ph.length === 10) keys.push(`phone:${ph}`);
  if (addr) keys.push(`addr:${addr}`);
  if (!keys.length && entry.id) keys.push(`id:${entry.id}`);
  return keys;
}

export function recordLedgerTouch(ledger, entry, kind, atIso = new Date().toISOString(), channels = []) {
  if (!ledger || typeof ledger !== 'object') return ledger;
  if (!ledger.byKey) ledger.byKey = {};
  const tag = `${entry.id || ''}:${kind}:${String(atIso).slice(0, 16)}`;
  for (const k of identityKeys(entry)) {
    const rec = ledger.byKey[k] || { lastTouchAt: null, touches: [] };
    if (!rec.touches.some((t) => t.tag === tag || (t.id && entry.id && t.id === entry.id && t.kind === kind))) {
      rec.touches.push({ kind, at: atIso, channels, id: entry.id || '', tag });
    }
    if (!rec.lastTouchAt || atIso > rec.lastTouchAt) rec.lastTouchAt = atIso;
    ledger.byKey[k] = rec;
  }
  return ledger;
}

export function seedLedgerFromQueue(ledger = { byKey: {} }, queue = []) {
  const out = ledger && typeof ledger === 'object' ? ledger : { byKey: {} };
  if (!out.byKey) out.byKey = {};
  for (const e of queue) {
    if (e.sentAt || e.emailSentAt || e.smsSentAt) recordLedgerTouch(out, e, 'initial', e.emailSentAt || e.smsSentAt || e.sentAt, ['seeded']);
    if (e.reminderSentAt || e.reminderEmailSentAt || e.reminderSmsSentAt) recordLedgerTouch(out, e, 'reminder', e.reminderEmailSentAt || e.reminderSmsSentAt || e.reminderSentAt, ['seeded']);
    if (e.closingCheckSentAt || e.closingCheckEmailSentAt || e.closingCheckSmsSentAt) recordLedgerTouch(out, e, 'closing_check', e.closingCheckEmailSentAt || e.closingCheckSmsSentAt || e.closingCheckSentAt, ['seeded']);
  }
  return out;
}

export function canContactClient(ledger, entry, kind, now = new Date(), suppressed = new Set()) {
  if (kind !== 'initial' && kind !== 'reminder') return { allowed: false, reason: 'max_two_touches_policy' };
  if (!entry || entry.optedOut || entry.reviewedAt || entry.canceledAt || entry.completionVerified === false) {
    return { allowed: false, reason: 'ineligible_or_opted_out' };
  }
  const em = String(entry.email || '').toLowerCase().trim();
  const ph = digits10(entry.phone || entry.raw_phone);
  if ((em && suppressed.has(em)) || (ph && suppressed.has(ph))) return { allowed: false, reason: 'suppressed_opt_out' };
  if (kind === 'initial' && (entry.sentAt || entry.emailSentAt || entry.smsSentAt)) return { allowed: false, reason: 'initial_already_sent' };
  if (kind === 'reminder' && (entry.reminderSentAt || entry.reminderEmailSentAt || entry.reminderSmsSentAt || entry.closingCheckSentAt)) {
    return { allowed: false, reason: 'reminder_or_followup_already_sent' };
  }
  const nowMs = now.getTime();
  const seenTouches = new Map();
  let latestMs = 0;
  for (const ts of [entry.sentAt, entry.emailSentAt, entry.smsSentAt, entry.reminderSentAt, entry.reminderEmailSentAt, entry.closingCheckSentAt]) {
    const ms = ts ? Date.parse(ts) : NaN;
    if (!isNaN(ms) && ms > latestMs) latestMs = ms;
  }
  if (ledger?.byKey) {
    for (const k of identityKeys(entry)) {
      const rec = ledger.byKey[k];
      if (!rec) continue;
      const lastMs = rec.lastTouchAt ? Date.parse(rec.lastTouchAt) : NaN;
      if (!isNaN(lastMs) && lastMs > latestMs) latestMs = lastMs;
      for (const t of rec.touches || []) {
        const ms = Date.parse(t.at);
        if (!isNaN(ms) && nowMs - ms <= RECENT_WINDOW_MS) {
          seenTouches.set(`${t.kind}:${t.tag || String(t.at).slice(0, 16)}`, t);
        }
      }
    }
  }
  if (latestMs && nowMs - latestMs < MIN_GAP_BETWEEN_TOUCHES_MS) return { allowed: false, reason: 'cooldown_6d_active' };
  const touchKinds = new Set([...seenTouches.values()].map((t) => t.kind));
  if (seenTouches.size >= MAX_TOUCHES_PER_CLIENT || touchKinds.has(kind)) return { allowed: false, reason: 'lifetime_cap_2_reached' };
  return { allowed: true, reason: 'ok' };
}

export function dueActions(queue, now = new Date(), suppressed = new Set(), canceledIndex = null, ledger = null) {
  const out = [];
  for (const e of queue) {
    if (e.optedOut || e.reviewedAt || e.canceledAt || e.completionVerified === false) continue;
    if (isCanceledEntry(e, canceledIndex)) continue;
    if (e.completedAt && Date.parse(e.completedAt) > now.getTime() + 5 * 60000) continue;
    const isHgAuto = String(e.source || '').startsWith('homegauge_');
    if (isHgAuto && (e.completionVerified !== true || e.customerViewedReport === false)) continue;
    if ((e.email && suppressed.has(e.email)) || (e.phone && suppressed.has(e.phone))) continue;
    const elapsedSinceInitial = e.sentAt ? now - new Date(e.sentAt) : -1;
    let kind = null;
    if (!e.sentAt) {
      const viewedAnchor = e.reportViewedAt || e.reportUploadedAt || e.addedAt;
      if (isHgAuto && viewedAnchor && now - new Date(viewedAnchor) < HOMEGAUGE_INITIAL_DELAY_MS) continue;
      kind = 'initial';
    } else if (!e.reminderSentAt && !e.closingCheckSentAt && elapsedSinceInitial >= REMINDER_AFTER_DAYS * DAY_MS) {
      kind = 'reminder';
    }
    if (!kind) continue;
    const gate = canContactClient(ledger, e, kind, now, suppressed);
    if (gate.allowed) out.push({ entry: e, kind });
  }
  return out;
}

export function buildEmail(e, link, kind = 'initial') {
  const f = firstName(e.name);
  const where = e.city ? ` in ${e.city}` : '';
  const chips = getMemoryPromptChips(e.city);
  const chipLines = `Optional prompts if you ever want ideas (1 sentence is plenty):\n- ${chips[0]}\n- ${chips[1]}\n- ${chips[2]}`;
  const optOutNote = `Prefer not to receive review emails? Reply STOP anytime and I will never send another follow-up.`;
  if (kind === 'reminder') {
    const text = `Hi ${f},\n\nI hope things are going smoothly as you wrap up your inspection review${where}. Just one brief, zero-pressure follow-up in case my earlier note landed on a busy day.\n\nCompletely optional: if you happen to have 30 seconds, an honest Google review helps other Metro Atlanta families know what to expect from our two-inspector team:\n${link}\n\n${chipLines}\n\nNo pressure at all either way — this is my only follow-up note so I will not bother your inbox again. Call 678-480-2110 anytime if any question comes up on the house.\n\n${optOutNote}\n\nChristopher Boykin, CMI\nForesight Home Inspections`;
    return { subject: `Optional follow-up (final note), ${f}`, text, html: toHtml(text, link, chips) };
  }
  const text = `Hi ${f},\n\nThank you for trusting Foresight with your ${e.service || 'home inspection'}${where}. If anything in your report needs a second look or you want to walk through a finding by phone, reply here or call 678-480-2110 anytime.\n\nNo pressure at all — if you happen to have 30 seconds once you have reviewed things, an honest Google review helps local buyers know what to expect:\n${link}\n\n${chipLines}\n\n${optOutNote}\n\nChristopher Boykin, CMI\nForesight Home Inspections`;
  return { subject: `${f}, any questions on your inspection?`, text, html: toHtml(text, link, chips) };
}

export function buildSms(e, link, kind = 'initial') {
  const f = firstName(e.name);
  const cityHint = e.city ? ` in ${e.city}` : '';
  if (kind === 'reminder') return `Hi ${f}, Chris at Foresight. One brief, optional follow-up${cityHint} — no pressure at all, and this is my last note: ${link} Reply STOP anytime to opt out.`;
  return `Hi ${f}, Chris with Foresight Home Inspections. Call 678-480-2110 if any report question comes up. Optional & no pressure: an honest Google review helps local buyers: ${link} Reply STOP to opt out.`;
}

function toHtml(text, link, chips = []) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body = esc(text).split('\n\n').map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, '<br>')}</p>`).join('');
  const chipsHtml = chips.length ? `<div style="margin:14px 0;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;color:#334155"><strong>Optional 1-Line Memory Prompts:</strong><div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px">${chips.map((c) => `<span style="background:#ffffff;border:1px solid #cbd5e1;border-radius:999px;padding:4px 10px;display:inline-block">${esc(c)}</span>`).join('')}</div></div>` : '';
  const btn = `<p style="margin:18px 0"><a href="${link}" style="background:#0f172a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">Leave a Google review</a></p>`;
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e293b;max-width:580px;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;background:#ffffff"><div style="background-color:#ffffff;border-bottom:3px solid #d4af37;padding:16px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="52" style="display:block;height:52px;width:auto;border:0;" /><div style="font-size:11px;font-weight:700;color:#0f172a;letter-spacing:0.5px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="52" width="52" style="display:inline-block;height:52px;width:52px;border:0;vertical-align:middle;margin-right:6px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="46" width="46" style="display:inline-block;height:46px;width:46px;border:0;vertical-align:middle;" /></td></tr></table></div><div style="padding:22px 24px">${body.replace(esc(link), `<a href="${link}">${esc(link)}</a>`)}${chipsHtml}${btn}</div></div>`;
}
