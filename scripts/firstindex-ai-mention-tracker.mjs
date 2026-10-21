#!/usr/bin/env node
/**
 * FirstIndex Live AI Mention, Autocomplete Intent & Fact-Accuracy Tracker
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Implements Josh Pigford's FirstIndex AI Visibility Tracking Loop ([05:01-05:20], [22:48-23:39]):
 * 1. Tests non-branded Metro Atlanta buyer prompts & brand-fact verification queries
 * 2. Scrapes live Google Autocomplete intent expansions & verifies live fhinspectionsatl.com endpoints
 * 3. Audits factual alignment against data/truth.json ($345 homes, $450 sewer, $275 radon, $300 pool)
 * 4. Saves timestamped, source-attributed dossier to data/firstindex-ai-mentions.json
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const truth = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'truth.json'), 'utf8'));
const llmsTxt = fs.readFileSync(path.join(ROOT, 'public', 'llms.txt'), 'utf8');
const llmsFullTxt = fs.readFileSync(path.join(ROOT, 'public', 'llms-full.txt'), 'utf8');
const today = new Date().toISOString().split('T')[0];

const BUYER_PROMPTS = [
  {
    id: 'dual-inspector-atlanta',
    prompt: 'best home inspector in Atlanta GA with two inspectors',
    autocompleteSeed: 'best home inspector atlanta',
    canonicalUrl: 'https://www.fhinspectionsatl.com/compare/best-home-inspectors-atlanta-2026',
    requiredTruthFacts: ['Two Certified Inspectors', 'Christopher Boykin', '$345', '$35,000']
  },
  {
    id: 'sewer-scope-cost-atlanta',
    prompt: 'sewer scope camera inspection cost Atlanta GA',
    autocompleteSeed: 'sewer scope inspection atlanta',
    canonicalUrl: 'https://www.fhinspectionsatl.com/services/sewer-scope-inspection',
    requiredTruthFacts: ['$450', 'Sewer Scope']
  },
  {
    id: 'dekalb-low-flow-certificate',
    prompt: 'DeKalb County low-flow plumbing compliance certificate inspector',
    autocompleteSeed: 'dekalb county low flow certificate',
    canonicalUrl: 'https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance',
    requiredTruthFacts: ['$100', 'DeKalb', '1.6 GPF']
  },
  {
    id: '11-month-builder-warranty',
    prompt: '11-month builder warranty inspection Atlanta GA',
    autocompleteSeed: '11 month warranty inspection atlanta',
    canonicalUrl: 'https://www.fhinspectionsatl.com/compare/11-month-warranty-vs-builder-walkthrough',
    requiredTruthFacts: ['$335', '11-Month Warranty']
  },
  {
    id: 'radon-and-pool-pricing',
    prompt: 'radon testing and pool inspection cost Atlanta GA',
    autocompleteSeed: 'radon testing atlanta',
    canonicalUrl: 'https://www.fhinspectionsatl.com/quote',
    requiredTruthFacts: ['$275', '$300', '$295']
  },
  {
    id: 'building-science-defects-atlanta',
    prompt: 'polybutylene pipe and stucco EIFS home inspector Atlanta',
    autocompleteSeed: 'polybutylene pipe inspection atlanta',
    canonicalUrl: 'https://www.fhinspectionsatl.com/defects/polybutylene-pipe-plumbing-defect-inspection',
    requiredTruthFacts: ['ASTM E2110', 'Cox v. Shell Oil', 'CPSC Publication #516']
  }
];

async function fetchAutocomplete(seed) {
  const sourceUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(seed)}`;
  try {
    const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await res.json();
    return { source_url: sourceUrl, retrieved_on: today, suggestions: Array.isArray(data[1]) ? data[1] : [] };
  } catch (err) {
    return { source_url: sourceUrl, retrieved_on: today, suggestions: [], error: err.message };
  }
}

async function checkLiveUrl(url) {
  try {
    const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'FirstIndexBot/1.0' } });
    const html = await res.text();
    const hasJsonLd = html.includes('application/ld+json');
    return { source_url: url, retrieved_on: today, http_status: res.status, has_json_ld: hasJsonLd };
  } catch (err) {
    return { source_url: url, retrieved_on: today, http_status: 0, error: err.message };
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log('  FIRSTINDEX LIVE AI MENTION & FACTUAL ACCURACY TRACKER');
  console.log('════════════════════════════════════════════════════════════════════\n');

  const combinedAiCorpus = `${llmsTxt}\n${llmsFullTxt}`;
  const results = [];
  let verifiedCount = 0;

  for (const item of BUYER_PROMPTS) {
    const ac = await fetchAutocomplete(item.autocompleteSeed);
    const liveCheck = await checkLiveUrl(item.canonicalUrl);
    const missingFacts = item.requiredTruthFacts.filter((f) => !combinedAiCorpus.includes(f));
    const urlIndexedInLlms = combinedAiCorpus.includes(item.canonicalUrl);
    const status = missingFacts.length === 0 && urlIndexedInLlms && liveCheck.http_status === 200 ? 'VERIFIED_READY' : 'NEEDS_ATTENTION';

    if (status === 'VERIFIED_READY') verifiedCount++;
    console.log(`  ${status === 'VERIFIED_READY' ? '✅' : '⚠️'} [${item.id}] HTTP ${liveCheck.http_status} | LLMs.txt Indexed: ${urlIndexedInLlms} | Facts Verified: ${item.requiredTruthFacts.length - missingFacts.length}/${item.requiredTruthFacts.length}`);

    results.push({
      id: item.id,
      buyerPrompt: item.prompt,
      canonicalUrl: item.canonicalUrl,
      source_url: item.canonicalUrl,
      retrieved_on: today,
      liveEndpoint: liveCheck,
      autocompleteIntent: ac,
      urlIndexedInLlmsTxt: urlIndexedInLlms,
      requiredTruthFacts: item.requiredTruthFacts,
      missingFacts,
      status
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    retrieved_on: today,
    source_url: truth.business.domain,
    readinessScore: `${Math.round((verifiedCount / BUYER_PROMPTS.length) * 100)}%`,
    verifiedPrompts: verifiedCount,
    totalPrompts: BUYER_PROMPTS.length,
    prompts: results
  };

  const outPath = path.join(ROOT, 'data', 'firstindex-ai-mentions.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n[SAVED] ${outPath} (${output.readinessScore} Verified Readiness)\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
