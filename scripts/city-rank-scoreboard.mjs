#!/usr/bin/env node
/**
 * City Rank Scoreboard — tracks the goal "map pack OR page 1 in every city".
 * Source: data/analytics/gsc-snapshot-latest.json (real Google Search Console data).
 * For each city in data/cities.json, finds the best-ranking core query
 * ("home inspection/inspector(s) <city>") and the city hub page position.
 * Tiers: PAGE1 (<=10), PAGE2 (10-20), DEEP (>20), NO_DATA. Map pack is not visible in GSC.
 * Writes data/city-rank-scoreboard.json and prints the page-2 push list.
 * Usage: node scripts/city-rank-scoreboard.mjs [--push]
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const gsc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'analytics', 'gsc-snapshot-latest.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'cities.json'), 'utf8'));
const norm = (s) => ` ${String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
const CORE = /\bhome inspect(ion|ions|or|ors)\b/;

const queries = (gsc.queries || []).map((q) => ({ q: q.query || q.keys?.[0] || '', i: +q.impressions || 0, c: +q.clicks || 0, p: +q.position || 99 }));
const pages = (gsc.pages || []).map((p) => ({ u: p.page || p.keys?.[0] || '', i: +p.impressions || 0, c: +p.clicks || 0, p: +p.position || 99 }));
const tier = (p) => (p == null ? 'NO_DATA' : p <= 10 ? 'PAGE1' : p <= 20 ? 'PAGE2' : 'DEEP');

const rows = cities.map((city) => {
  const name = norm(city['City Name']);
  const core = queries.filter((x) => CORE.test(x.q) && norm(x.q).includes(name));
  // Impression-weighted position across core queries = what a typical searcher sees.
  const impr = core.reduce((s, x) => s + x.i, 0);
  const wPos = impr ? core.reduce((s, x) => s + x.p * x.i, 0) / impr : null;
  const best = core.sort((a, b) => a.p - b.p)[0];
  const hub = pages.find((p) => p.u.replace(/\/$/, '').endsWith(`/service-areas/${city.Slug}`));
  return {
    city: city['City Name'], slug: city.Slug,
    coreImpressions: impr, coreClicks: core.reduce((s, x) => s + x.c, 0),
    weightedPosition: wPos && +wPos.toFixed(1), tier: tier(wPos),
    bestQuery: best?.q || null, bestPosition: best ? +best.p.toFixed(1) : null,
    hubPosition: hub ? +hub.p.toFixed(1) : null, hubImpressions: hub?.i || 0
  };
});

const count = (t) => rows.filter((r) => r.tier === t).length;
const summary = { dateRange: gsc.dateRange, generatedAt: new Date().toISOString(), cities: rows.length,
  page1: count('PAGE1'), page2: count('PAGE2'), deep: count('DEEP'), noData: count('NO_DATA') };
fs.writeFileSync(path.join(ROOT, 'data', 'city-rank-scoreboard.json'), JSON.stringify({ summary, rows }, null, 2), 'utf8');

console.log(`GSC ${summary.dateRange?.startDate} to ${summary.dateRange?.endDate} | ${rows.length} cities`);
console.log(`PAGE1: ${summary.page1} | PAGE2: ${summary.page2} | DEEP (>20): ${summary.deep} | NO DATA: ${summary.noData}\n`);
for (const t of ['PAGE1', 'PAGE2', 'DEEP']) {
  console.log(`--- ${t} ---`);
  rows.filter((r) => r.tier === t).sort((a, b) => b.coreImpressions - a.coreImpressions)
    .forEach((r) => console.log(`${r.city.padEnd(22)} pos ${String(r.weightedPosition).padStart(5)} | ${String(r.coreImpressions).padStart(4)} impr | hub ${r.hubPosition ?? '-'}`));
}

if (process.argv.includes('--push')) {
  await fetch('https://ntfy.sh/fores-antigravity-alerts-77', { method: 'POST', headers: { Title: `City scoreboard: ${summary.page1}/${rows.length} on page 1`, Tags: 'trophy' },
    body: `Page 1: ${summary.page1} | Page 2: ${summary.page2} | Deeper: ${summary.deep} | No data: ${summary.noData}\n(GSC ${summary.dateRange?.startDate} to ${summary.dateRange?.endDate}; map pack not measured by GSC)` }).catch(() => {});
}
