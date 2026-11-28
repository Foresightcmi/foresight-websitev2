const rateBuckets = new Map();

const ALLOWED_HOSTS = new Set([
  'www.fhinspectionsatl.com',
  'fhinspectionsatl.com',
  'localhost',
  '127.0.0.1',
]);

const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above|system)\s+instructions/i,
  /(?:reveal|print|dump|repeat|output|show)\s+(?:your\s+)?(?:system\s+prompt|instructions|chris_system_instruction|api\s*key|gemini_api_key)/i,
  /\b(?:GEMINI_API_KEY|STRIPE_SECRET_KEY|CHRIS_SYSTEM_INSTRUCTION|RECEPTIONIST_SYSTEM_INSTRUCTION)\b/i,
  /(?:override|bypass|change|rewrite)\s+(?:your\s+)?(?:pricing|fee\s+schedule|rules|guardrails)/i,
  /(?:give\s+me|quote\s+me|confirm|agree\s+to)\s+a\s+\$(?:0|1|5|10|25|50|99)\s+(?:full\s+)?home\s+inspection/i,
  /you\s+are\s+now\s+(?:dan|unrestricted|developer\s+mode|jailbroken)/i,
];

export function resetRateLimitStore() {
  rateBuckets.clear();
}

export function verifyAllowedOrigin(rawOrigin = '', rawReferer = '') {
  const candidate = String(rawOrigin || rawReferer || '').trim();
  if (!candidate) return { allowed: true, host: 'same-origin-or-direct' };
  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();
    if (ALLOWED_HOSTS.has(host) || host.endsWith('.vercel.app')) {
      return { allowed: true, host };
    }
    return { allowed: false, host };
  } catch {
    return { allowed: false, host: 'malformed-origin' };
  }
}

export function checkSlidingRateLimit(routeKey, clientIp = 'unknown', maxRequests = 20, windowMs = 60_000) {
  const now = Date.now();
  const key = `${routeKey}:${clientIp}`;
  const cutoff = now - windowMs;
  const existing = (rateBuckets.get(key) || []).filter((ts) => ts > cutoff);
  if (existing.length >= maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((existing[0] + windowMs - now) / 1000));
    rateBuckets.set(key, existing);
    return { allowed: false, remaining: 0, retryAfterSec };
  }
  existing.push(now);
  rateBuckets.set(key, existing);
  if (rateBuckets.size > 2000) {
    const firstKey = rateBuckets.keys().next().value;
    if (firstKey) rateBuckets.delete(firstKey);
  }
  return { allowed: true, remaining: Math.max(0, maxRequests - existing.length), retryAfterSec: 0 };
}

export function detectPromptInjection(rawText = '') {
  const text = String(rawText || '').slice(0, 4000);
  for (const pat of INJECTION_PATTERNS) {
    if (pat.test(text)) {
      return {
        blocked: true,
        safeReply: 'Foresight Home Inspections quotes follow our official Metro Atlanta fee schedule starting at $345 for single-family homes and $295 for condos, with auxiliary services custom-quoted at (678) 480-2110. Share your property square footage or city for an exact deterministic quote.',
      };
    }
  }
  return { blocked: false, safeReply: '' };
}

export function enforceApiSecurity(request, { routeKey = 'api', maxRequests = 20, windowMs = 60_000 } = {}) {
  const originCheck = verifyAllowedOrigin(request.headers.get('origin') || '', request.headers.get('referer') || '');
  if (!originCheck.allowed) {
    return { ok: false, ip: 'blocked-origin', response: Response.json({ error: 'Cross-origin request rejected.' }, { status: 403 }) };
  }
  const xff = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const ip = xff.split(',')[0].trim() || '127.0.0.1';
  const rl = checkSlidingRateLimit(routeKey, ip, maxRequests, windowMs);
  if (!rl.allowed) {
    return {
      ok: false,
      ip,
      response: Response.json(
        { error: 'Rate limit exceeded. Please wait a moment or call (678) 480-2110.', retryAfterSeconds: rl.retryAfterSec },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec), 'RateLimit-Remaining': '0' } }
      ),
    };
  }
  return { ok: true, ip, remaining: rl.remaining };
}

export function isAuthorizedAdminRequest({ headers, cookies, searchParams } = {}) {
  const configuredToken = String(process.env.ADMIN_ACCESS_TOKEN || '').trim();
  if (!configuredToken || configuredToken.length < 12) return false;
  const authHeader = headers?.get?.('authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const headerToken = headers?.get?.('x-admin-token') || '';
  const cookieToken = cookies?.get?.('foresight_admin_key')?.value || '';
  const queryToken = typeof searchParams?.get === 'function' ? searchParams.get('key') : (searchParams?.key || '');
  return [bearer, headerToken, cookieToken, queryToken].some((val) => val && val === configuredToken);
}
