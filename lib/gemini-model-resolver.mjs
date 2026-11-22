const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedCatalog = null;
let cachedAt = 0;

export const DEFAULT_TEXT_FALLBACK_MODELS = [
  'gemini-4-hydrogen',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest'
];

export const DEFAULT_LIVE_FALLBACK_MODELS = [
  'gemini-3.8-live',
  'gemini-3.8-live-extended-thinking'
];

async function fetchModelCatalog(apiKey) {
  if (!apiKey) return null;
  const now = Date.now();
  if (cachedCatalog && now - cachedAt < CACHE_TTL_MS) return cachedCatalog;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?pageSize=100&key=${apiKey}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data.models)) {
      cachedCatalog = data.models;
      cachedAt = now;
      return cachedCatalog;
    }
  } catch {
    return null;
  }
  return null;
}

export async function resolveGeminiTextModels(apiKey, { allowMetered = false } = {}) {
  const models = await fetchModelCatalog(apiKey);
  if (!models || models.length === 0) return [...DEFAULT_TEXT_FALLBACK_MODELS];
  const validIds = models
    .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map((m) => String(m.name || '').replace(/^models\//, ''))
    .filter((id) => id && !/(tts|image|embedding|robotics|computer-use|nano-banana|live)/i.test(id));
  const zeroCostModern = validIds
    .filter((id) => /^(gemini-4-hydrogen|gemini-(4|3\.[6-9])-flash)$/i.test(id))
    .sort()
    .reverse();
  const meteredFrontier = allowMetered
    ? validIds.filter((id) => /^gemini-4-(neon|carbon|argon)$/i.test(id)).sort()
    : [];
  return [...new Set([...zeroCostModern, ...DEFAULT_TEXT_FALLBACK_MODELS, ...meteredFrontier])];
}

export async function resolveGeminiPrimaryTextModel(apiKey) {
  const list = await resolveGeminiTextModels(apiKey);
  return list[0] || DEFAULT_TEXT_FALLBACK_MODELS[0];
}

export async function resolveGeminiLiveModels(apiKey) {
  const models = await fetchModelCatalog(apiKey);
  if (!models || models.length === 0) return [...DEFAULT_LIVE_FALLBACK_MODELS];
  const liveIds = models
    .filter((m) => (m.supportedGenerationMethods || []).includes('bidiGenerateContent') || /live/i.test(m.name || ''))
    .map((m) => String(m.name || '').replace(/^models\//, ''))
    .filter((id) => /^gemini-(4|3\.[1-9]).*live/i.test(id))
    .sort()
    .reverse();
  return [...new Set([...liveIds, ...DEFAULT_LIVE_FALLBACK_MODELS])];
}
