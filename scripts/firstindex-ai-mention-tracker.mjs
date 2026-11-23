#!/usr/bin/env node
/**
 * FirstIndex Live AI Mention, SERP Grounding, Autocomplete & Fact-Accuracy Tracker
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const truth = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'truth.json'), 'utf8'));
const llmsTxt = fs.readFileSync(path.join(ROOT, 'public', 'llms.txt'), 'utf8');
const llmsFullTxt = fs.readFileSync(path.join(ROOT, 'public', 'llms-full.txt'), 'utf8');
const today = new Date().toISOString().split('T')[0];

const BUYER_PROMPTS = [
  { id: 'dual-inspector-atlanta', prompt: 'best home inspector in Atlanta GA with two inspectors', autocompleteSeed: 'best home inspector atlanta', canonicalUrl: 'https://www.fhinspectionsatl.com/compare/best-home-inspectors-atlanta-2026', requiredTruthFacts: ['Two Certified Inspectors', 'Christopher Boykin', '$345', '$35,000'] },
  { id: 'sewer-scope-cost-atlanta', prompt: 'sewer scope camera inspection Atlanta GA', autocompleteSeed: 'sewer scope inspection atlanta', canonicalUrl: 'https://www.fhinspectionsatl.com/services/sewer-scope-inspection', requiredTruthFacts: ['Call (678) 480-2110 for Quote', 'Sewer Scope'] },
  { id: 'dekalb-low-flow-certificate', prompt: 'DeKalb County low-flow plumbing compliance certificate inspector', autocompleteSeed: 'dekalb county low flow certificate', canonicalUrl: 'https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance', requiredTruthFacts: ['DeKalb', '1.6 GPF'] },
  { id: '11-month-builder-warranty', prompt: '11-month builder warranty inspection Atlanta GA', autocompleteSeed: '11 month warranty inspection atlanta', canonicalUrl: 'https://www.fhinspectionsatl.com/compare/11-month-warranty-vs-builder-walkthrough', requiredTruthFacts: ['$345', '11-Month'] },
  { id: 'radon-and-pool-pricing', prompt: 'radon testing and pool inspection Atlanta GA', autocompleteSeed: 'radon testing atlanta', canonicalUrl: 'https://www.fhinspectionsatl.com/quote', requiredTruthFacts: ['$275', '$295', 'Call (678) 480-2110 for Quote'] },
  { id: 'building-science-defects-atlanta', prompt: 'polybutylene pipe and stucco EIFS home inspector Atlanta', autocompleteSeed: 'polybutylene pipe inspection atlanta', canonicalUrl: 'https://www.fhinspectionsatl.com/defects/polybutylene-pipe-plumbing-defect-inspection', requiredTruthFacts: ['ASTM E2110', 'Cox v. Shell Oil', 'CPSC Publication #516'] }
];

async function fetchAutocomplete(seed) {
  const sourceUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(seed)}`;
  try {
    const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    return { source_url: sourceUrl, retrieved_on: today, suggestions: Array.isArray(data[1]) ? data[1] : [] };
  } catch (err) {
    return { source_url: sourceUrl, retrieved_on: today, suggestions: [], error: err.message };
  }
}

async function checkLiveUrl(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'FirstIndexBot/2.0' }, signal: AbortSignal.timeout(10000) });
    const html = await res.text();
    const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ');
    return {
      source_url: url,
      retrieved_on: today,
      http_status: res.status,
      ttfb_ms: Date.now() - t0,
      has_json_ld: html.includes('application/ld+json'),
      has_aeo_answer: html.includes('aeo-direct-answer'),
      sab_clean: !/1816\s+s(outh)?\s+deshon/i.test(visible)
    };
  } catch (err) {
    return { source_url: url, retrieved_on: today, http_status: 0, error: err.message };
  }
}

async function checkPublicSerpCitation(query) {
  const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(ddgUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    const citedDomain = /fhinspectionsatl\.com/i.test(html);
    const citedBrand = /Foresight Home Inspections/i.test(html);
    const misnamedFullHouse = /Full House Inspections/i.test(html) && citedDomain && !citedBrand;
    return { source_url: ddgUrl, retrieved_on: today, http_status: res.status, citedDomain, citedBrand, misnamedFullHouse };
  } catch (err) {
    return { source_url: ddgUrl, retrieved_on: today, http_status: 0, citedDomain: false, citedBrand: false, error: err.message };
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log('  FIRSTINDEX LIVE AI MENTION, SERP CITATION & ACCURACY TRACKER');
  console.log('════════════════════════════════════════════════════════════════════\n');

  const combinedAiCorpus = `${llmsTxt}\n${llmsFullTxt}`;
  const rslCheck = await checkLiveUrl('https://www.fhinspectionsatl.com/rsl.xml');
  const results = [];
  let verifiedCount = 0;

  for (const item of BUYER_PROMPTS) {
    const [ac, liveCheck, serp] = await Promise.all([
      fetchAutocomplete(item.autocompleteSeed),
      checkLiveUrl(item.canonicalUrl),
      checkPublicSerpCitation(item.prompt)
    ]);
    const missingFacts = item.requiredTruthFacts.filter((f) => !combinedAiCorpus.includes(f));
    const urlIndexedInLlms = combinedAiCorpus.includes(item.canonicalUrl);
    const status = missingFacts.length === 0 && urlIndexedInLlms && liveCheck.http_status === 200 && liveCheck.sab_clean ? 'VERIFIED_READY' : 'NEEDS_ATTENTION';
    if (status === 'VERIFIED_READY') verifiedCount++;

    console.log(`  ${status === 'VERIFIED_READY' ? '✅' : '⚠️'} [${item.id}] HTTP ${liveCheck.http_status} (${liveCheck.ttfb_ms || 0}ms) | SERP Cited: ${serp.citedDomain} | Misnamed FH: ${serp.misnamedFullHouse}`);
    results.push({
      id: item.id,
      buyerPrompt: item.prompt,
      canonicalUrl: item.canonicalUrl,
      source_url: item.canonicalUrl,
      retrieved_on: today,
      liveEndpoint: liveCheck,
      publicSerpCitation: serp,
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
    rslLicenseLiveStatus: rslCheck.http_status,
    readinessScore: `${Math.round((verifiedCount / BUYER_PROMPTS.length) * 100)}%`,
    verifiedPrompts: verifiedCount,
    totalPrompts: BUYER_PROMPTS.length,
    liveSerpDomainCitations: results.filter((r) => r.publicSerpCitation?.citedDomain).length,
    misnamedFullHouseCount: results.filter((r) => r.publicSerpCitation?.misnamedFullHouse).length,
    prompts: results
  };

  fs.writeFileSync(path.join(ROOT, 'data', 'firstindex-ai-mentions.json'), JSON.stringify(output, null, 2), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'data', 'ai-mention-ledger.json'), JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n[SAVED] data/firstindex-ai-mentions.json & data/ai-mention-ledger.json (${output.readinessScore})\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
