#!/usr/bin/env node
/**
 * HeyTony Competitor SEO Watchdog (watchdog.heytony.ca Native $0 Clone)
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Fetches live Metro Atlanta rival pages, hashes <title> and <h1>, diffs against
 * prior snapshot, and alerts ntfy.sh when a competitor alters SEO positioning.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'data', 'heytony-competitor-watchdog.json');
const NO_ALERT = process.argv.includes('--no-alert');
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'fores-antigravity-alerts-77';

const WATCH_TARGETS = [
  { name: 'BPG Inspections Atlanta', url: 'https://www.bpginspections.com/ga/atlanta-home-inspections/' },
  { name: 'Home-Probe Inc', url: 'https://www.home-probe.com/' },
  { name: 'Champia Real Estate Inspections', url: 'https://www.champia.com/' },
  { name: 'Residential Inspector of America', url: 'https://www.residentialinspector.com/' },
  { name: 'Pillar To Post', url: 'https://pillartopost.com/' }
];

const sha = (s) => crypto.createHash('sha256').update(String(s || '')).digest('hex').slice(0, 16);
const cleanTag = (html, tag) => {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) : '';
};

export async function runCompetitorWatchdog({ noAlert = NO_ALERT } = {}) {
  const today = new Date().toISOString().split('T')[0];
  let prevMap = {};
  if (fs.existsSync(OUT_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
      for (const c of prev.competitors || []) prevMap[c.source_url] = c;
    } catch {}
  }

  const results = [];
  const diffs = [];
  for (const t of WATCH_TARGETS) {
    let status = 0, title = '', h1 = '', h2Count = 0;
    try {
      const res = await fetch(t.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ForesightSEOWatchdog/1.0)' },
        signal: AbortSignal.timeout(8000)
      });
      status = res.status;
      if (res.ok) {
        const html = await res.text();
        title = cleanTag(html, 'title');
        h1 = cleanTag(html, 'h1');
        h2Count = (html.match(/<h2\b/gi) || []).length;
      }
    } catch {
      status = 0;
    }
    const titleHash = sha(title);
    const h1Hash = sha(h1);
    const prior = prevMap[t.url];
    const changed = Boolean(prior && status === 200 && prior.http_status === 200 && (prior.titleHash !== titleHash || prior.h1Hash !== h1Hash));
    if (changed) diffs.push(`${t.name}: Title/H1 changed -> "${title}"`);
    results.push({ name: t.name, source_url: t.url, http_status: status, retrieved_on: today, title, h1, h2Count, titleHash, h1Hash, changedSinceLastRun: changed });
  }

  const payload = { analyzedAt: new Date().toISOString(), retrieved_on: today, totalWatched: results.length, changesDetected: diffs.length, diffs, competitors: results };
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), 'utf8');
  if (diffs.length > 0 && !noAlert) {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers: { Title: 'Competitor SEO Watchdog Alert', Tags: 'eyes' }, body: diffs.join('\n') }).catch(() => {});
  }
  return payload;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCompetitorWatchdog().then((r) => console.log(`✅ Competitor Watchdog checked ${r.totalWatched} rivals (${r.changesDetected} changes).`));
}
