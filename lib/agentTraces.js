import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const TMP_TRACE_FILE = path.join(os.tmpdir(), 'foresight-agent-traces.jsonl');

export function scrubTracePii(rawText = '') {
  let text = String(rawText || '');
  // 1. Strip email addresses
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // 2. Strip US phone numbers
  text = text.replace(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]');
  // 3. Strip street house-number addresses while preserving city names
  text = text.replace(
    /\b\d{1,6}\s+[A-Za-z0-9.\s]{2,32}\b(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd|boulevard|court|ct|circle|cir|parkway|pkwy|trail|trl|place|pl|terrace|ter)(?:\s+(?:ne|nw|se|sw|n|s|e|w))?\b/gi,
    '[REDACTED_ADDRESS]'
  );
  // 4. Strip conversational self-introductions ("I am Sarah Jenkins", "my name is ...")
  text = text.replace(
    /\b(?:my name is|i am|i'm|this is|call me)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}/g,
    '[REDACTED_NAME]'
  );
  return text.replace(/\s+/g, ' ').trim().slice(0, 240);
}

export function bucketSqft(sqft) {
  const n = Number(sqft);
  if (!Number.isFinite(n) || n <= 0) return 'unspecified';
  if (n <= 1500) return '<=1500';
  if (n <= 2500) return '1501-2500';
  if (n <= 3500) return '2501-3500';
  return '3501+';
}

export function buildScrubbedTraceRecord({
  channel = 'unknown',
  detectedAgent = '',
  toolCalled = '',
  city = '',
  zip = '',
  sqft = null,
  serviceType = '',
  addonsRequested = [],
  converted = false,
  sanitizedTopic = '',
  blockedReason = '',
} = {}) {
  return {
    timestamp: new Date().toISOString(),
    channel: String(channel).slice(0, 32),
    detectedAgent: String(detectedAgent || 'human-or-unspecified').slice(0, 64),
    toolCalled: String(toolCalled || 'none').slice(0, 48),
    city: scrubTracePii(city).slice(0, 48),
    zip: /^\d{5}$/.test(String(zip || '').trim()) ? String(zip).trim() : '',
    sqftBucket: bucketSqft(sqft),
    serviceType: String(serviceType || '').slice(0, 32),
    addonsRequested: Array.isArray(addonsRequested) ? addonsRequested.map((a) => String(a).slice(0, 24)).slice(0, 8) : [],
    converted: Boolean(converted),
    sanitizedTopic: scrubTracePii(sanitizedTopic),
    blockedReason: String(blockedReason || '').slice(0, 64),
  };
}

export function emitAgentTrace(payload = {}) {
  try {
    const record = buildScrubbedTraceRecord(payload);
    const line = JSON.stringify(record);
    console.info(`[FORESIGHT_AGENT_TRACE] ${line}`);
    try {
      fs.appendFileSync(TMP_TRACE_FILE, `${line}\n`, 'utf8');
    } catch {}
    const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (webhookUrl && process.env.NODE_ENV === 'production') {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'capture_agent_trace', trace: record }),
        signal: AbortSignal.timeout(2000),
      }).catch(() => {});
    }
    return record;
  } catch {
    return null;
  }
}
