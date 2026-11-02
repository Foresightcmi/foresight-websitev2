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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GSC_PATH = path.join(ROOT, 'data', 'analytics', 'gsc-query-page-latest.json');
const OUT_PATH = path.join(ROOT, 'data', 'gsc-leak-hunter-report.json');
const today = new Date().toISOString().split('T')[0];

function buildTitleRecommendation(query, pageUrl) {
  const rel = pageUrl.replace('https://www.fhinspectionsatl.com', '') || '/';
  const qLower = query.toLowerCase();
  const cityMatch = rel.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Atlanta';
  if (qLower.includes('commercial')) {
    return `Commercial Property Inspection ${cityMatch}, GA | 2-Inspector CMI Team`;
  }
  if (qLower.includes('sewer')) {
    return `${cityMatch}, GA Sewer Scope & Video Inspection | 200-Ft HD Camera`;
  }
  if (qLower.includes('pre drywall') || qLower.includes('pre-drywall')) {
    return `Pre-Drywall & Framing Inspection ${cityMatch}, GA | $275+ (2-Team)`;
  }
  if (qLower.includes('eleven') || qLower.includes('11')) {
    return `11-Month Builder Warranty Inspection ${cityMatch}, GA | $345+ (2-Team)`;
  }
  return `Home Inspection & Inspector ${cityMatch}, GA | $345+ (2-Team)`;
}

function detectCrossCityCannibalization(query, pageUrl) {
  const q = query.toLowerCase();
  const u = pageUrl.toLowerCase();
  if (q.includes('atlanta') && !u.includes('atlanta') && u.includes('/services/')) {
    return `Cross-city cannibalization: query specifies "atlanta" but Google ranked ${u.replace('https://www.fhinspectionsatl.com', '')}. Add canonical anchor link to /services/sewer-scope-inspection/atlanta.`;
  }
  return null;
}

const gsc = JSON.parse(fs.readFileSync(GSC_PATH, 'utf8'));
const rows = gsc.rows || [];

const bucketA = rows
  .filter((r) => r.position <= 10.0 && r.impressions >= 20 && r.ctr < 0.03)
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
      prescribedFix: cannibalNote || 'Upgraded metaTitle CTR hook + 38-word Answer Factory BLUF direct answer box'
    };
  });

const bucketB = rows
  .filter((r) => r.position > 10.0 && r.position <= 20.5 && r.impressions >= 20)
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
      prescribedFix: 'Title upgrade + 38-word BLUF + Priority Internal Link Anchor from /services & county hub'
    };
  });

const report = {
  generatedAt: new Date().toISOString(),
  retrieved_on: today,
  source_url: 'https://www.fhinspectionsatl.com',
  gscDateRange: gsc.dateRange,
  totalGscRowsAnalyzed: rows.length,
  bucketAPage1LowCtrCount: bucketA.length,
  bucketBPage2BreakthroughCount: bucketB.length,
  bucketAPage1LowCtr: bucketA,
  bucketBPage2Breakthrough: bucketB
};

fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), 'utf8');
console.log(`✅ Bot 2 (Leak Hunter): Analyzed ${rows.length} GSC rows -> Saved ${bucketA.length} Page-1 Low-CTR & ${bucketB.length} Pos 11-20 Breakthrough leaks to ${OUT_PATH}`);
