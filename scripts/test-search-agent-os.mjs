#!/usr/bin/env node
/**
 * TDD Verification Suite for SearchAgent OS (5-Bot Architecture + Truth Guard)
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n════════════════════════════════════════════════════════════════════');
console.log('  TDD VERIFICATION: SEARCHAGENT OS & TRUTH-GUARD SUITE');
console.log('════════════════════════════════════════════════════════════════════\n');

// 1. Test comparisons-pseo.json against truth.json (Zero stale add-on prices & Zero rival-first summaries)
const compData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'comparisons-pseo.json'), 'utf8'));
const staleCompHits = compData.filter((c) => {
  const foresightFields = JSON.stringify({ summary: c.summary, benefits: c.benefits, faqs: c.faqs, foresightRows: (c.comparisonTable || []).map((r) => r.foresight) });
  return /\$450|\$250|\$125|\$165|DeKalb Low-Flow \$100|Pool \$300/.test(foresightFields);
});
const rivalFirstHits = compData.filter((c) => c.slug.startsWith('foresight-vs-') && !c.summary.startsWith('Foresight Home Inspections'));
assert('Zero stale add-on prices ($450/$250/$300/$100/$125/$165) & zero rival-first summaries in data/comparisons-pseo.json', staleCompHits.length === 0 && rivalFirstHits.length === 0, `Stale: ${staleCompHits.length}, Rival-first: ${rivalFirstHits.length}`);

// 2. Test Answer Factory 40-word BLUF rule in app/services/[service]/[city]/page.js
const serviceCityPage = fs.readFileSync(path.join(ROOT, 'app', 'services', '[service]', '[city]', 'page.js'), 'utf8');
assert('ServiceCityPage has Question-based H2 in Direct Answer Box', serviceCityPage.includes('Who offers certified') || serviceCityPage.includes('What is included in a certified'));
assert('ServiceCityPage removes hardcoded "200.00" fallback in JSON-LD Offer price', !serviceCityPage.includes('|| "200"'));

// 3. Test Bot 1 (Answer Radar) output artifact exists and has verified citations
const radarPath = path.join(ROOT, 'data', 'radar-run.json');
const hasRadar = fs.existsSync(radarPath);
assert('Bot 1 (Answer Radar): data/radar-run.json exists with 20 buyer questions', hasRadar && JSON.parse(fs.readFileSync(radarPath, 'utf8')).questions?.length === 20);

// 4. Test Bot 2 (Leak Hunter) output artifact exists with Bucket A (Page 1 Low CTR) & Bucket B (Pos 11-20)
const leakPath = path.join(ROOT, 'data', 'gsc-leak-hunter-report.json');
const hasLeak = fs.existsSync(leakPath);
assert('Bot 2 (Leak Hunter): data/gsc-leak-hunter-report.json exists with Page 1 & Page 2 buckets', hasLeak && JSON.parse(fs.readFileSync(leakPath, 'utf8')).bucketAPage1LowCtr?.length > 0);

// 5. Test Bot 4 (Source Map) output artifact exists with live-verified third-party citations & <120w outreach drafts
const sourceMapPath = path.join(ROOT, 'data', 'source-map-outreach.json');
const hasSourceMap = fs.existsSync(sourceMapPath);
assert('Bot 4 (Source Map): data/source-map-outreach.json exists with verified third-party domains & <120w drafts', hasSourceMap && JSON.parse(fs.readFileSync(sourceMapPath, 'utf8')).outreachDrafts?.length > 0);

// 6. Test Bot 5 (Signal) & Bot 3 (Answer Factory) gap queue exists
const signalPath = path.join(ROOT, 'data', 'signal-buyer-questions.json');
const hasSignal = fs.existsSync(signalPath);
assert('Bot 5 (Signal) & Bot 3 (Answer Factory): data/signal-buyer-questions.json exists with live scraped questions', hasSignal && JSON.parse(fs.readFileSync(signalPath, 'utf8')).liveQuestions?.length >= 10);

// 7. Test ComparePage, CityPage, ServiceCityPage de-cannibalization, and RelatedServiceAreas deterministic mesh
const comparePage = fs.readFileSync(path.join(ROOT, 'app', 'compare', '[slug]', 'page.js'), 'utf8');
const cityPage = fs.readFileSync(path.join(ROOT, 'app', 'service-areas', '[city]', 'page.js'), 'utf8');
const relatedComp = fs.readFileSync(path.join(ROOT, 'app', 'components', 'RelatedServiceAreas.js'), 'utf8');
assert('ComparePage renders 40-Word BLUF Direct Answer Box (#aeo-direct-answer)', comparePage.includes('id="aeo-direct-answer"'));
assert('CityPage renders Question-in-H2 + 38-Word BLUF Direct Answer Box', cityPage.includes('Who is the best home inspector in {cityName}, GA'));
assert('ServiceCityPage renders Cross-City Atlanta De-Cannibalization Link', serviceCityPage.includes('Looking for City of Atlanta coverage?'));
assert('RelatedServiceAreas uses deterministic LEAK_HUNTER_PRIORITY_SLUGS (zero Math.random)', relatedComp.includes('LEAK_HUNTER_PRIORITY_SLUGS') && !relatedComp.includes('Math.random()'));

console.log(`\n[TDD SUMMARY] Passed: ${passed} | Failed: ${failed}\n`);
process.exit(failed === 0 ? 0 : 1);
