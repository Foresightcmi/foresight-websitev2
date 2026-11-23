import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_PROBES = [
  'https://www.google.com',
  'https://cloudflare.com',
  'http://www.google.com',
  'http://cloudflare.com'
];

const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function computeEasternParts(nowMs) {
  const nowDate = new Date(nowMs);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }).formatToParts(nowDate);
  const get = (t) => parts.find((p) => p.type === t)?.value || '';
  const easternHour = Number(get('hour')) % 24;
  const easternMinute = Number(get('minute'));
  const easternMinutes = easternHour * 60 + easternMinute;
  const easternWeekdayNum = WEEKDAY_MAP[get('weekday')] ?? nowDate.getUTCDay();
  const easternDateStr = `${get('year')}-${get('month')}-${get('day')}`;
  return {
    nowDate,
    easternHour,
    easternMinute,
    easternMinutes,
    easternWeekdayNum,
    easternDateStr,
    isDaytimeWindow: easternHour >= 9 && easternHour < 18
  };
}

/** Sync wall-clock time from external HTTP Date headers; fails closed when unreachable. */
export async function syncNetworkClock({
  probes = DEFAULT_PROBES,
  timeoutMs = 4000,
  fetchImpl = globalThis.fetch
} = {}) {
  for (const url of probes) {
    try {
      const res = await fetchImpl(url, { method: 'HEAD', signal: AbortSignal.timeout(timeoutMs) });
      const dateHdr = res?.headers?.get?.('date');
      const nowMs = dateHdr ? Date.parse(dateHdr) : NaN;
      if (Number.isFinite(nowMs)) {
        return { ok: true, nowMs, isoNow: new Date(nowMs).toISOString(), sourceUrl: url, ...computeEasternParts(nowMs) };
      }
    } catch {}
  }
  return {
    ok: false,
    nowMs: null,
    isoNow: null,
    nowDate: null,
    easternHour: null,
    easternMinute: null,
    easternMinutes: null,
    easternWeekdayNum: null,
    easternDateStr: null,
    isDaytimeWindow: false,
    error: 'network_clock_unavailable'
  };
}

/** Read Governor dispatch ceiling and safety allowSend flag if present; fallback standalone. */
export function readGovernorCeiling(rootDir, fallbackCap = 1200) {
  const planPath = path.resolve(rootDir, '..', 'email-campaign-engine', 'governor_dispatch_plan.json');
  try {
    if (!fs.existsSync(planPath)) return { max24h: fallbackCap, allowSend: true, reason: 'STANDALONE_DEFAULT' };
    const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
    const max24h = Number.isFinite(Number(plan?.effective24hCeiling)) ? Number(plan.effective24hCeiling) : fallbackCap;
    const allowSend = plan?.safety?.allowColdSend !== false;
    return { max24h, allowSend, reason: plan?.safety?.reason || 'OK' };
  } catch {
    return { max24h: fallbackCap, allowSend: true, reason: 'PLAN_READ_FALLBACK' };
  }
}
