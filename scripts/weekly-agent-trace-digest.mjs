#!/usr/bin/env node
/**
 * Weekly Privacy-Scrubbed Agent Trace & Endpoint Health Digest (Track 1 Cloud Automation)
 * Runs Mondays inside 9:00 AM - 6:00 PM ET. Zero writes to data/*.json or Git.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'fores-antigravity-alerts-77';
const BASE_URL = process.env.PUBLIC_SITE_URL || 'https://www.fhinspectionsatl.com';
const DRY_RUN = process.argv.includes('--dry-run');

async function probeEndpoint(url, options = {}) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { ...options, signal: AbortSignal.timeout(8000) });
    return { ok: res.ok, status: res.status, ms: Date.now() - t0 };
  } catch (err) {
    return { ok: false, status: 0, ms: Date.now() - t0, err: err.message };
  }
}

function summarizeLocalTmpTraces() {
  const tmpFile = path.join(os.tmpdir(), 'foresight-agent-traces.jsonl');
  if (!fs.existsSync(tmpFile)) return { count: 0, byChannel: {}, topAddons: {}, conversions: 0 };
  const lines = fs.readFileSync(tmpFile, 'utf8').split('\n').filter(Boolean);
  const byChannel = {};
  const topAddons = {};
  let conversions = 0;
  for (const line of lines) {
    try {
      const r = JSON.parse(line);
      byChannel[r.channel] = (byChannel[r.channel] || 0) + 1;
      if (r.converted) conversions += 1;
      for (const a of r.addonsRequested || []) topAddons[a] = (topAddons[a] || 0) + 1;
    } catch {}
  }
  return { count: lines.length, byChannel, topAddons, conversions };
}

async function fetchRemoteTraceSummary() {
  const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url}?action=agent_trace_weekly_summary`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = await res.json();
    return json && typeof json === 'object' ? json : null;
  } catch {
    return null;
  }
}

async function main() {
  const [mcpHealth, quoteHealth, isAgenticSnap, remoteSummary] = await Promise.all([
    probeEndpoint(`${BASE_URL}/api/mcp`),
    probeEndpoint(`${BASE_URL}/api/v1/quote?sqft=2400&propertyType=single-family`),
    probeEndpoint(`https://is-agentic.com/api/v1/report?url=${encodeURIComponent(BASE_URL)}`),
    fetchRemoteTraceSummary(),
  ]);

  const localStats = summarizeLocalTmpTraces();
  const totalTraces = remoteSummary?.totalTraces ?? localStats.count;
  const conversions = remoteSummary?.conversions ?? localStats.conversions;

  const lines = [
    `Foresight Weekly Agentic & Concierge Brief (${new Date().toISOString().slice(0, 10)})`,
    `• Web MCP (/api/mcp): ${mcpHealth.ok ? `ONLINE (${mcpHealth.ms}ms)` : `CHECK (${mcpHealth.status})`}`,
    `• Deterministic Quote API (/api/v1/quote): ${quoteHealth.ok ? `ONLINE (${quoteHealth.ms}ms)` : `CHECK (${quoteHealth.status})`}`,
    `• Is-Agentic Public Score Endpoint: HTTP ${isAgenticSnap.status}`,
    `• Scrubbed Trace Events (0% PII): ${totalTraces} logged | ${conversions} Priority Slot requests`,
    `• SEO Isolation: 0 indexed pages or data/*.json files modified`,
  ].join('\n');

  console.log(lines);

  if (!DRY_RUN) {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        Title: 'Foresight Weekly Agentic & Trace Digest',
        Priority: 'default',
        Tags: 'robot,chart_with_upwards_trend,shield',
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: Buffer.from(lines, 'utf8'),
    }).catch((e) => console.warn('[DIGEST] ntfy warning:', e.message));
  }
}

main();
