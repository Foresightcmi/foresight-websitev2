/**
 * First-Touch AI Agent & Referral Attribution Engine ($0 Cost)
 * Identifies bookings and inquiries originating from ChatGPT, Grok, Claude,
 * Perplexity, Gemini, Copilot, Meta AI / Muse, WebMCP, and organic search.
 */

const STORAGE_KEY = 'foresight_first_touch_attribution_v1';

const AGENT_RULES = [
  { label: 'AI Agent: Grok (xAI)', test: (s) => /grok\.com|x\.ai|grokbot|xai-bot|\/i\/grok|\bgrok\b/i.test(s) },
  { label: 'AI Agent: ChatGPT (OpenAI)', test: (s) => /chatgpt\.com|chat\.openai\.com|oai-searchbot|chatgpt-user|gptbot|\bchatgpt\b|\bopenai\b/i.test(s) },
  { label: 'AI Agent: Claude (Anthropic)', test: (s) => /claude\.ai|anthropic\.com|claude-user|claudebot|claude-searchbot|\bclaude\b/i.test(s) },
  { label: 'AI Agent: Perplexity', test: (s) => /perplexity\.ai|perplexity-user|perplexitybot|\bperplexity\b/i.test(s) },
  { label: 'AI Agent: Google Gemini', test: (s) => /gemini\.google\.com|bard\.google\.com|aistudio\.google\.com|\bgemini\b/i.test(s) },
  { label: 'AI Agent: Microsoft Copilot', test: (s) => /copilot\.microsoft\.com|edgeservices\.bing\.com|\bcopilot\b/i.test(s) },
  { label: 'AI Agent: Meta AI / Muse', test: (s) => /meta\.ai|metamuse|meta-externalagent|\bmetamuse\b/i.test(s) },
  { label: 'Browser WebMCP Agent', test: (s) => /\bwebmcp\b|modelcontext/i.test(s) },
];

const CHANNEL_RULES = [
  { label: 'Google Search / GBP', test: (s) => /google\.com|googleadservices/i.test(s) },
  { label: 'Bing Search', test: (s) => /bing\.com/i.test(s) },
  { label: 'YouTube', test: (s) => /youtube\.com|youtu\.be/i.test(s) },
  { label: 'LinkedIn', test: (s) => /linkedin\.com|lnkd\.in/i.test(s) },
  { label: 'Instagram', test: (s) => /instagram\.com/i.test(s) },
  { label: 'Facebook', test: (s) => /facebook\.com|fb\.com/i.test(s) },
  { label: 'Nextdoor', test: (s) => /nextdoor\.com/i.test(s) },
  { label: 'Yelp', test: (s) => /yelp\.com/i.test(s) },
  { label: 'X (Twitter)', test: (s) => /(?:^|\/\/|\.)(x\.com|twitter\.com|t\.co)/i.test(s) },
];

export function detectAgentSource({ referrer = '', search = '', userAgent = '', clientName = '', selfReported = '' } = {}) {
  const params = new URLSearchParams(String(search || '').replace(/^\?/, ''));
  const utmBundle = [
    params.get('utm_source'),
    params.get('utm_medium'),
    params.get('utm_campaign'),
    params.get('ref'),
    params.get('agent'),
  ].filter(Boolean).join(' ');

  const signal = `${clientName} ${utmBundle} ${referrer} ${userAgent}`.trim();

  for (const rule of AGENT_RULES) {
    if (rule.test(signal)) return rule.label;
  }
  if (selfReported && String(selfReported).trim()) {
    for (const rule of AGENT_RULES) {
      if (rule.test(selfReported)) return rule.label;
    }
    return `Self-Reported: ${String(selfReported).trim()}`;
  }
  for (const rule of CHANNEL_RULES) {
    if (rule.test(signal)) return rule.label;
  }
  if (utmBundle) return `Campaign (${utmBundle})`;
  return '';
}

export function captureBrowserFirstTouch() {
  if (typeof window === 'undefined') return '';
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    const detected = detectAgentSource({
      referrer: document.referrer || '',
      search: window.location.search || '',
    });
    if (detected && (!existing || !existing.startsWith('AI Agent:'))) {
      window.sessionStorage.setItem(STORAGE_KEY, detected);
      return detected;
    }
    return existing || detected || '';
  } catch {
    return '';
  }
}
