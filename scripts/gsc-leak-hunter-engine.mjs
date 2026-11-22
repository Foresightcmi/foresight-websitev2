#!/usr/bin/env node
/**
 * Bot 2 — Leak Hunter Engine (SearchAgent OS)
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Reads real Google Search Console telemetry (data/analytics/gsc-query-page-latest.json)
 * and isolates:
 *  - Bucket A: Page 1 Low-CTR Leaks (Positions 1.0–10.0, Impressions >= 20, CTR < 3%)
 *  - Bucket B: Positions 10.1–20.5 Breakthrough Leaks (Impressions >= 20, grouped by topic cluster)
 *  - Cross-City URL Cannibalization Detector (e.g., 'atlanta' query ranking a '/suwanee' URL)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadGovernorBrief } from './lib/seo-ledger-and-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GSC_PATH = path.join(ROOT, 'data', 'analytics', 'gsc-query-page-latest.json');
const CITIES_PATH = path.join(ROOT, 'data', 'cities.json');
const OUT_PATH = path.join(ROOT, 'data', 'gsc-leak-hunter-report.json');
const today = new Date().toISOString().split('T')[0];

const cities = fs.existsSync(CITIES_PATH) ? JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8')) : [];
const citySlugMap = new Map(cities.map((c) => [String(c.Slug || '').toLowerCase(), c['City Name']]));
const govBrief = loadGovernorBrief(ROOT);
const isFreeze = govBrief?.core_update_gate?.edit_mode === 'FREEZE';
const protectedUrls = new Set(govBrief?.protected_top_urls || []);

function buildTitleRecommendation(query, pageUrl) {
  const rel = pageUrl.replace('https://www.fhinspectionsatl.com', '') || '/';
  const lastSeg = rel.split('/').filter(Boolean).pop()?.toLowerCase() || '';
  const cityMatch = citySlugMap.get(lastSeg) || 'Metro Atlanta';
  if (rel.startsWith('/service-areas/')) {
    return `${cityMatch}, GA Inspection Guide: Local Risks & Services`; // GEMINI.md Rule 5: never retitle hub to Home Inspection
  }
  const qLower = query.toLowerCase();
  if (qLower.includes('commercial')) {
    return `4.8★ Commercial Inspection ${cityMatch}, GA | ASTM PCA`;
  }
  if (qLower.includes('sewer')) {
    return `${cityMatch}, GA HD Sewer Scope Inspection | Same-Day Video`;
  }
  if (qLower.includes('mold') || qLower.includes('air quality')) {
    return `${cityMatch}, GA Mold & Air Quality Testing | 2-CMI Team`;
  }
  if (qLower.includes('radon')) {
    return `${cityMatch}, GA Continuous 48-Hr Radon Testing | CMI Team`;
  }
  if (qLower.includes('pre drywall') || qLower.includes('pre-drywall')) {
    return `4.8★ Pre-Drywall Inspection ${cityMatch}, GA | From $275`;
  }
  if (qLower.includes('new construction') || qLower.includes('new build')) {
    return `4.8★ New Construction Inspection ${cityMatch} | From $400`;
  }
  if (qLower.includes('eleven') || qLower.includes('11')) {
    return `4.8★ 11-Month Warranty Inspection ${cityMatch} | From $345`;
  }
  return `4.8★ Home Inspection ${cityMatch}, GA | From $345 (2-CMI)`;
}

function detectCrossCityCannibalization(query, pageUrl) {
  const q = query.toLowerCase();
  const rel = pageUrl.replace('https://www.fhinspectionsatl.com', '') || '/';
  const u = rel.toLowerCase();
  if (u.startsWith('/service-areas/') && /\bhome inspect(ion|ions|or|ors)\b/.test(q)) {
    const slug = u.split('/').filter(Boolean).pop();
    return `Hub cannibalization (Rule 5): guide hub ${rel} ranked for buyer query. Add prominent anchor to /services/buyer-inspection/${slug}.`;
  }
  if (q.includes('atlanta') && !u.includes('atlanta') && u.startsWith('/services/')) {
    const parts = u.split('/').filter(Boolean);
    const svcSlug = parts[1] || 'buyer-inspection';
    return `Cross-city cannibalization: query specifies "atlanta" but Google ranked ${rel}. Add canonical anchor link to /services/${svcSlug}/atlanta.`;
  }
  return null;
}

const gsc = JSON.parse(fs.readFileSync(GSC_PATH, 'utf8'));
const rows = gsc.rows || [];

const bucketA = rows
  .filter((r) => {
    const rel = String(r.keys?.[1] || '').replace('https://www.fhinspectionsatl.com', '') || '/';
    return r.position > 3.5 && r.position <= 10.0 && r.impressions >= 15 && r.ctr < 0.03 && !protectedUrls.has(rel);
  })
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25)
  .map((r, i) => {
    const [query, pageUrl] = r.keys;
    const cannibalNote = detectCrossCityCannibalization(query, pageUrl);
    return {
      rank: i + 1,
      query,
      targetUrl: pageUrl,
      source_url: pageUrl,
      retrieved_on: today,
      position: Number(r.position.toFixed(1)),
      impressions: r.impressions,
      clicks: r.clicks,
      ctrPercent: Number((r.ctr * 100).toFixed(2)),
      recommendedTitle: buildTitleRecommendation(query, pageUrl),
      cannibalizationWarning: cannibalNote,
      executionStatus: isFreeze ? 'STAGED_UNTIL_CORE_UPDATE_ENDS' : 'READY_FOR_HUMAN_APPROVAL',
      prescribedFix: cannibalNote || 'Upgraded metaTitle CTR hook + 38-word Answer Factory BLUF direct answer box'
    };
  });

const bucketB = rows
  .filter((r) => r.position > 10.0 && r.position <= 20.5 && r.impressions >= 15)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25)
  .map((r, i) => {
    const [query, pageUrl] = r.keys;
    return {
      rank: i + 1,
      query,
      targetUrl: pageUrl,
      source_url: pageUrl,
      retrieved_on: today,
      position: Number(r.position.toFixed(1)),
      impressions: r.impressions,
      clicks: r.clicks,
      recommendedTitle: buildTitleRecommendation(query, pageUrl),
      executionStatus: isFreeze ? 'STAGED_UNTIL_CORE_UPDATE_ENDS' : 'READY_FOR_HUMAN_APPROVAL',
      prescribedFix: 'Title upgrade + 38-word BLUF + Priority Internal Link Anchor from /services & county hub'
    };
  });

const report = {
  generatedAt: new Date().toISOString(),
  retrieved_on: today,
  source_url: 'https://www.fhinspectionsatl.com',
  coreUpdateEditMode: isFreeze ? 'FREEZE' : 'NORMAL',
  gscDateRange: gsc.dateRange,
  totalGscRowsAnalyzed: rows.length,
  bucketAPage1LowCtrCount: bucketA.length,
  bucketBPage2BreakthroughCount: bucketB.length,
  bucketAPage1LowCtr: bucketA,
  bucketBPage2Breakthrough: bucketB
};

fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), 'utf8');
console.log(`✅ Bot 2 (Leak Hunter): Analyzed ${rows.length} GSC rows -> Saved ${bucketA.length} Page-1 Low-CTR & ${bucketB.length} Pos 11-20 Breakthrough leaks to ${OUT_PATH}`);
