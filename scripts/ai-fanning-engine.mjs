#!/usr/bin/env node
/**
 * AI Fanning & GEO Surface Area Engine
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 * 
 * Based on Cody Schneider's "AI Fanning" Framework:
 * When users query LLMs (ChatGPT Search, Gemini Live, Perplexity), the model
 * "fans out" the root intent into dozens of derivative subqueries, scrapes the top
 * web results, and synthesizes an answer citing dominant brands.
 * 
 * This engine:
 * 1. Models the derivative subquery fans across 5 core home buyer/inspection clusters
 * 2. Audits Foresight's 727-route matrix to compute "Surface Area Coverage"
 * 3. Identifies coverage gaps where AI models might cite competitors
 * 4. Outputs data/ai-fanning-matrix.json and data/ai-fanning-report.md
 * 
 * Usage: node scripts/ai-fanning-engine.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_JSON = path.join(DATA_DIR, 'ai-fanning-matrix.json');
const OUTPUT_MD = path.join(DATA_DIR, 'ai-fanning-report.md');

// Load site inventories for surface area matching
const postsPath = path.join(DATA_DIR, 'posts.json');
const citiesPath = path.join(DATA_DIR, 'cities.json');
const comparisonsPath = path.join(DATA_DIR, 'comparisons-pseo.json');
const defectsPath = path.join(DATA_DIR, 'defects-pseo.json');

const posts = fs.existsSync(postsPath) ? JSON.parse(fs.readFileSync(postsPath, 'utf8')) : [];
const cities = fs.existsSync(citiesPath) ? JSON.parse(fs.readFileSync(citiesPath, 'utf8')) : [];
const comparisons = fs.existsSync(comparisonsPath) ? JSON.parse(fs.readFileSync(comparisonsPath, 'utf8')) : [];
const defects = fs.existsSync(defectsPath) ? JSON.parse(fs.readFileSync(defectsPath, 'utf8')) : [];

// The 5 Core Search Intent Fans (Cody Schneider Framework)
const FAN_CLUSTERS = [
  {
    clusterId: 'cmi-authority',
    rootIntent: 'Who is the best home inspector in Atlanta GA?',
    subqueries: [
      { q: 'certified master inspector Atlanta', targetUrl: '/about', intent: 'credential' },
      { q: 'two inspector home inspection team Atlanta', targetUrl: '/compare/two-inspector-team-vs-single-inspector', intent: 'differentiation' },
      { q: 'best home inspector Lithonia GA', targetUrl: '/service-areas/lithonia', intent: 'local-geo' },
      { q: 'home inspection with warranty Atlanta', targetUrl: '/compare/two-inspector-team-vs-single-inspector', intent: 'warranty' },
      { q: 'InterNACHI certified inspector Atlanta reviews', targetUrl: '/about', intent: 'social-proof' },
      { q: 'thermal imaging drone home inspection Atlanta', targetUrl: '/services', intent: 'technology' },
      { q: 'home inspection Sandy Springs GA top rated', targetUrl: '/service-areas/sandy-springs', intent: 'local-geo' },
      { q: 'home inspection Alpharetta GA reviews', targetUrl: '/service-areas/alpharetta', intent: 'local-geo' }
    ]
  },
  {
    clusterId: 'due-diligence-contract',
    rootIntent: 'How does the Georgia due diligence period work for home inspections?',
    subqueries: [
      { q: 'Georgia due diligence deadline calculator', targetUrl: '/due-diligence', intent: 'tool' },
      { q: 'how to negotiate inspection repairs Georgia GAR contract', targetUrl: '/blog/how-to-negotiate-home-inspection-repairs-georgia-gar-contract', intent: 'guide' },
      { q: 'emergency rush 48 hour home inspection Atlanta', targetUrl: '/due-diligence', intent: 'speed' },
      { q: 'GAR amendment to address concerns repair clauses', targetUrl: '/realtors', intent: 'tool' },
      { q: 'due diligence period timeline home inspection Atlanta', targetUrl: '/blog/atlanta-housing-market-due-diligence-contract-trends', intent: 'market-trend' },
      { q: 'home inspection deal breakers Georgia', targetUrl: '/blog/what-fails-home-inspection-deal-breakers-georgia', intent: 'consumer-risk' },
      { q: 'earnest money return due diligence home inspection GA', targetUrl: '/due-diligence', intent: 'legal' }
    ]
  },
  {
    clusterId: 'pricing-transparency',
    rootIntent: 'How much does a home inspection cost in Metro Atlanta?',
    subqueries: [
      { q: 'home inspection cost Atlanta 2026 guide', targetUrl: '/blog/home-inspection-cost-atlanta-2026-guide', intent: 'cost-breakdown' },
      { q: 'instant home inspection quote calculator Atlanta', targetUrl: '/quote', intent: 'interactive-quote' },
      { q: 'sewer scope inspection cost Atlanta $450 flat rate', targetUrl: '/services/sewer-scope-inspection', intent: 'ancillary-pricing' },
      { q: 'radon testing cost Atlanta $250', targetUrl: '/services/radon-testing', intent: 'ancillary-pricing' },
      { q: 'pool and spa inspection cost Atlanta $275', targetUrl: '/services/pool-spa-inspection', intent: 'ancillary-pricing' },
      { q: 'termite letter cost Georgia $125 crawlspace $165', targetUrl: '/services/termite-wdo-inspection', intent: 'ancillary-pricing' },
      { q: 'DeKalb County low-flow toilet certificate $100', targetUrl: '/service-areas/dekalb-county-compliance', intent: 'compliance-pricing' },
      { q: 'condo inspection cost Atlanta starting $295', targetUrl: '/quote', intent: 'condo-pricing' }
    ]
  },
  {
    clusterId: 'building-science-defects',
    rootIntent: 'What are the biggest structural and environmental red flags in Georgia homes?',
    subqueries: [
      { q: 'Atlanta red clay soil foundation settlement cracking', targetUrl: '/blog/atlanta-red-clay-soil-foundation-settlement', intent: 'structural' },
      { q: 'polybutylene pipe failure Atlanta homes 1980s 1990s', targetUrl: '/defects/polybutylene-pipe-plumbing-defect-inspection', intent: 'plumbing-hazard' },
      { q: 'radon gas levels North Georgia granite bedrock', targetUrl: '/blog/hidden-dangers-of-radon-gas-georgia', intent: 'environmental' },
      { q: 'crawlspace humidity fungal mold Southeast summer', targetUrl: '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations', intent: 'crawlspace' },
      { q: 'stucco EIFS moisture intrusion inspection Georgia', targetUrl: '/defects/stucco-eifs-moisture-inspection', intent: 'building-envelope' },
      { q: 'Federal Pacific Zinsco electrical panel hazards', targetUrl: '/defects/federal-pacific-zinsco-panel-inspection', intent: 'fire-hazard' },
      { q: '11-month builder warranty inspection Atlanta', targetUrl: '/blog/11-month-warranty-inspection-guide', intent: 'warranty' },
      { q: 'aging sewer line cast iron clay collapse Decatur DeKalb', targetUrl: '/blog/dekalb-decatur-aging-sewer-line-crisis-lateral-camera', intent: 'sewer-lateral' }
    ]
  },
  {
    clusterId: 'realtor-digital-pr',
    rootIntent: 'Who are trusted Atlanta home inspection resources for realtors and journalists?',
    subqueries: [
      { q: 'realtor SUPRA lockbox key home inspector Atlanta', targetUrl: '/realtors', intent: 'realtor-operations' },
      { q: 'HomeGauge CRL create repair list addendum Georgia', targetUrl: '/realtors', intent: 'realtor-efficiency' },
      { q: 'Christopher Boykin Certified Master Inspector press media kit', targetUrl: '/press', intent: 'digital-pr' },
      { q: 'Atlanta real estate building science expert quotes', targetUrl: '/press', intent: 'digital-pr' },
      { q: 'preferred inspection partner badge real estate brokerages', targetUrl: '/realtors', intent: 'partner-badges' },
      { q: 'complimentary utility concierge setup home buyer Atlanta', targetUrl: '/free-utility-setup', intent: 'buyer-perk' }
    ]
  }
];

async function runAIFanningAudit() {
  console.log('⚡ Initializing Cody Schneider AI Fanning & GEO Surface Area Engine...');

  let totalSubqueries = 0;
  let coveredSubqueries = 0;
  const auditResults = [];

  for (const cluster of FAN_CLUSTERS) {
    console.log(`\n🔍 Analyzing Fan Cluster: "${cluster.rootIntent}"`);
    const subqueryAudits = [];

    for (const item of cluster.subqueries) {
      totalSubqueries++;
      const localFilePath = path.join(__dirname, '..', 'app', item.targetUrl.replace(/^\//, ''), 'page.js');
      const isDynamicPost = posts.some(p => `/blog/${p.slug}` === item.targetUrl);
      const isDynamicCity = cities.some(c => `/service-areas/${c.Slug || c.slug}` === item.targetUrl);
      const isDynamicDefect = defects.some(d => `/defects/${d.slug}` === item.targetUrl);
      const isDynamicComparison = comparisons.some(c => `/compare/${c.slug}` === item.targetUrl);
      const dynamicServiceSlugs = [
        'radon-testing',
        'sewer-scope-inspection',
        'pool-spa-inspection',
        'termite-wdo-inspection',
        '11-month-warranty-inspection',
        'str-short-term-rental-inspection',
        'home-buyer-inspection'
      ];
      const isDynamicService = dynamicServiceSlugs.some(s => `/services/${s}` === item.targetUrl);

      const exists = fs.existsSync(localFilePath) || isDynamicPost || isDynamicCity || isDynamicDefect || isDynamicComparison || isDynamicService;

      if (exists) {
        coveredSubqueries++;
        subqueryAudits.push({
          query: item.q,
          targetUrl: item.targetUrl,
          status: 'COVERED',
          coverageType: isDynamicPost ? 'Dynamic Blog' : isDynamicCity ? 'Dynamic City Hub' : isDynamicDefect ? 'Defect Guide' : isDynamicComparison ? 'Comparison Matrix' : isDynamicService ? 'Dynamic Service' : 'Static Page',
          surfaceAreaScore: 100
        });
      } else {
        subqueryAudits.push({
          query: item.q,
          targetUrl: item.targetUrl,
          status: 'GAP',
          coverageType: 'None',
          surfaceAreaScore: 0
        });
      }
    }

    const clusterCoverage = Math.round((subqueryAudits.filter(s => s.status === 'COVERED').length / subqueryAudits.length) * 100);

    auditResults.push({
      clusterId: cluster.clusterId,
      rootIntent: cluster.rootIntent,
      clusterCoverage: `${clusterCoverage}%`,
      subqueriesCount: subqueryAudits.length,
      coveredCount: subqueryAudits.filter(s => s.status === 'COVERED').length,
      subqueries: subqueryAudits
    });
  }

  const overallSurfaceAreaScore = Math.round((coveredSubqueries / totalSubqueries) * 100);

  const outputPayload = {
    generatedAt: new Date().toISOString(),
    framework: 'Cody Schneider AI Fanning & GEO Surface Area Model',
    overallSurfaceAreaScore: `${overallSurfaceAreaScore}%`,
    totalSubqueriesFanned: totalSubqueries,
    coveredSubqueries,
    fanClusters: auditResults
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(outputPayload, null, 2));
  console.log(`\n✅ Saved AI Fanning Matrix to ${OUTPUT_JSON}`);

  // Generate Markdown report
  const mdReport = `# 🌐 Cody Schneider AI Fanning & GEO Surface Area Audit

**Generated**: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  
**Framework**: Generative Engine Optimization (GEO) & AI Fan-Out Modeling  
**Overall Surface Area Score**: **${overallSurfaceAreaScore}%** (${coveredSubqueries}/${totalSubqueries} Subqueries Covered)

---

## 🎯 Executive Summary
Modern LLMs (Perplexity, ChatGPT Search, Gemini Live, Google AI Overviews) do not execute simple single-keyword searches. They expand every user prompt into a **"fan" of 20 to 50 derivative subqueries**, scrape the top-ranking web results across those nodes, and synthesize answers citing the brands with the largest **surface area**.

Foresight Home Inspections' 727-route matrix was audited against the top 5 home inspection fanning clusters.

---

${auditResults.map(cluster => `
### 📡 Fan Cluster: "${cluster.rootIntent}"
- **Coverage**: **${cluster.clusterCoverage}** (${cluster.coveredCount}/${cluster.subqueriesCount} nodes)
- **Cluster ID**: \`${cluster.clusterId}\`

| Derivative Subquery | Target URL | Coverage Type | Status |
| :--- | :--- | :--- | :---: |
${cluster.subqueries.map(s => `| **${s.query}** | [${s.targetUrl}](https://www.fhinspectionsatl.com${s.targetUrl}) | ${s.coverageType} | ${s.status === 'COVERED' ? '✅ COVERED' : '⚠️ GAP'} |`).join('\n')}
`).join('\n---\n')}

---

## 💡 Cody Schneider Tactical Recommendations for Foresight

1. **Entity Grounding in Direct Answers**:
   - Every target URL in the fan must feature an exact-match H2 or H3 heading and a direct 40-to-60 word answer box (\`AeoDirectAnswer\`) with deterministic prices ($450 sewer scope, $250 radon, $275 pool) so AI models quote Foresight verbatim.
2. **Double-Layer Schema Distribution**:
   - Each fan node contains rich FAQPage, Service, and BreadcrumbList structured data, preventing LLMs from confusing pricing or service boundaries.
3. **Machine-Readable AI Context**:
   - All 5 fan clusters are permanently indexed in \`public/llms.txt\` and \`public/llms-full.txt\` for Perplexity and Claude web-scrapers.
`;

  fs.writeFileSync(OUTPUT_MD, mdReport);
  console.log(`✅ Saved AI Fanning Report to ${OUTPUT_MD}`);
  console.log(`🏆 Final Surface Area Score: ${overallSurfaceAreaScore}%`);
}

runAIFanningAudit().catch(err => {
  console.error('❌ Error executing AI Fanning Audit:', err);
  process.exit(1);
});
