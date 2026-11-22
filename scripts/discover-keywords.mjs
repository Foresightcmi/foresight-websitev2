#!/usr/bin/env node
/**
 * Keyword Discovery Agent for Foresight Home Inspections
 * 
 * Researches trending and popular search queries using Google's
 * autocomplete suggestions API (free, no key needed) and identifies
 * high-value content opportunities.
 * 
 * Outputs a keyword brief that feeds into the blog generator.
 * 
 * Usage: node scripts/discover-keywords.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');
const KEYWORD_BRIEF_FILE = path.join(__dirname, '..', 'data', 'keyword-brief.json');

// Seed queries — these rotate and branch out to discover what people search
const SEED_QUERIES = [
  // Core service queries
  "home inspection",
  "home inspector",
  "home inspection cost",
  "home inspection checklist",
  // Georgia/Atlanta specific
  "home inspection atlanta",
  "home inspection georgia",
  "home inspector near me atlanta",
  // Service-specific
  "radon testing",
  "termite inspection",
  "new construction inspection",
  "pre listing inspection",
  "11 month warranty inspection",
  // Buyer questions
  "should I get a home inspection",
  "what does a home inspector look for",
  "home inspection failed",
  "home inspection report",
  "home inspection red flags",
  "home inspection negotiation",
  // Seasonal/maintenance
  "home maintenance tips",
  "home maintenance checklist",
  "first time home buyer tips",
  // Emerging topics
  "home inspection AI",
  "thermal imaging home",
  "mold inspection",
  "sewer scope inspection",
  "foundation inspection",
  "roof inspection",
  "HVAC inspection",
  "electrical inspection home",
  "plumbing inspection",
  "pool inspection",
  // Voice search query seeds (AEO)
  "hey google home inspector",
  "alexa find home inspection",
  "siri home inspector Lithonia",
  "what does a home inspection cost in Georgia",
  "why should I get a radon test in Atlanta",
  "who is the best home inspector in Lithonia"
];

// Question prefixes to discover "People Also Ask" style queries
const QUESTION_PREFIXES = [
  "how to",
  "what is",
  "why do",
  "when should",
  "how much",
  "do I need",
  "is it worth",
  "can a home inspector",
  "what happens if",
  "how long does",
  "how much does",
  "who is the best",
  "should I pay for",
  "is a radon test required in"
];

/**
 * Fetch Google autocomplete suggestions for a query
 * Uses the public suggest API that powers Google's search bar
 */
async function fetchSuggestions(query) {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    // Response format: [query, [suggestion1, suggestion2, ...]]
    return data[1] || [];
  } catch {
    return [];
  }
}

const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');
const ALL_CITY_NAMES = fs.existsSync(CITIES_FILE)
  ? JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8')).map((c) => String(c['City Name'] || '').toLowerCase()).filter(Boolean)
  : ['atlanta', 'lithonia', 'decatur'];

const NON_BUYER_BLOCKLIST_RX =
  /\b(nursing home|assisted living|daycare|restaurant|health department|food|car\b|vehicle|auto\b|emissions|osha|elevator|fire marshal|become a|how to become|get into home inspection|license|licensing|exam|nhie|training|course|school|salary|how much do.*make|start a|start home inspection|how to price a|software|homegauge|spectora|jobs|hiring)\b/i;

const INFORMATIONAL_MODIFIER_RX =
  /\b(how|what|why|when|should|do i|is it|worth|cost|checklist|tips|guide|due diligence|issues|problems|risks|red flags|before|vs|checklist|negotiate|credit|granite|clay|crawlspace|moisture|stucco|truss)\b/i;

function hasMetroCityMatch(kwLower) {
  if (/\b(georgia|atlanta|ga)\b/.test(kwLower)) return true;
  return ALL_CITY_NAMES.some((city) => {
    const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(kwLower);
  });
}

function isBareServiceCityHeadTerm(kwLower) {
  // GEMINI.md Section 5: Any city-modified buyer/service head term without an informational/question/defect angle belongs strictly to /services/[service]/[city]
  if ((hasMetroCityMatch(kwLower) || /\bsandy spgs\b/.test(kwLower)) && !INFORMATIONAL_MODIFIER_RX.test(kwLower)) {
    if (!/\b(georgia|atlanta|\bga\b)\b/.test(kwLower) || /\b(home|buyer|certified|best|services?)\s+inspect(ion|ions|or|ors)\b/.test(kwLower)) {
      return true;
    }
  }
  return false;
}

/**
 * Score a keyword based on buyer intent, Metro Atlanta location, and empirical GSC impressions
 */
function scoreKeyword(keyword, gscImpressions = 0) {
  const kw = keyword.toLowerCase().trim();
  if (NON_BUYER_BLOCKLIST_RX.test(kw) || isBareServiceCityHeadTerm(kw)) {
    return -100;
  }
  let score = 0;
  if (gscImpressions > 0) {
    score += Math.min(30, 15 + Math.round(gscImpressions / 20));
  }

  // High relevance terms
  if (kw.includes('inspection')) score += 10;
  if (kw.includes('inspector')) score += 10;
  if (kw.includes('home')) score += 5;
  if (kw.includes('house')) score += 5;

  // Location relevance (word-boundary safe across all 87 cities; never matches "garage" on " ga")
  if (hasMetroCityMatch(kw)) score += 8;
  
  // Question format (great for FAQ/AIO)
  if (kw.startsWith('how') || kw.startsWith('what') || kw.startsWith('why') || kw.startsWith('when') || kw.startsWith('do i') || kw.startsWith('should') || kw.startsWith('is it')) score += 7;
  
  // Voice search and conversational AEO triggers
  if (kw.includes('hey google') || kw.includes('alexa') || kw.includes('siri') || kw.includes('hey siri')) score += 15;
  if (kw.startsWith('who is') || kw.startsWith('where is') || kw.startsWith('which is') || kw.startsWith('is there a') || kw.startsWith('can you')) score += 10;
  if (kw.includes('near me') || kw.includes('nearby') || kw.includes('closest')) score += 8;

  // Service terms
  if (kw.includes('radon')) score += 6;
  if (kw.includes('termite')) score += 6;
  if (kw.includes('mold')) score += 6;
  if (kw.includes('roof')) score += 5;
  if (kw.includes('foundation')) score += 5;
  if (kw.includes('hvac') || kw.includes('air condition')) score += 5;
  if (kw.includes('thermal') || kw.includes('infrared')) score += 6;
  if (kw.includes('pool')) score += 4;
  if (kw.includes('new construction') || kw.includes('new build')) score += 6;
  if (kw.includes('warranty')) score += 6;
  
  // Buyer intent (commercial value)
  if (kw.includes('cost') || kw.includes('price') || kw.includes('how much')) score += 8;
  if (kw.includes('near me')) score += 7;
  if (kw.includes('best')) score += 6;
  if (kw.includes('need') || kw.includes('worth')) score += 5;
  if (kw.includes('checklist')) score += 5;
  if (kw.includes('buy') || kw.includes('buyer')) score += 5;
  
  // Long-tail bonus (more specific = less competition = great for voice search answer matching)
  const wordCount = kw.split(' ').length;
  if (wordCount >= 4) score += 3;
  if (wordCount >= 6) score += 2;
  
  return score;
}

/**
 * Check if a keyword topic is already covered by existing blog posts
 */
function isAlreadyCovered(keyword, existingPosts) {
  const kw = keyword.toLowerCase();
  return existingPosts.some(post => {
    const titleMatch = post.title.toLowerCase();
    const keywordMatch = (post.keywords || []).some(k => kw.includes(k.toLowerCase()) || k.toLowerCase().includes(kw));
    // Check for significant overlap
    const kwWords = kw.split(' ').filter(w => w.length > 3);
    const titleWords = titleMatch.split(' ').filter(w => w.length > 3);
    const overlap = kwWords.filter(w => titleWords.includes(w)).length;
    return keywordMatch || overlap >= 3;
  });
}

async function main() {
  console.log('🔍 Foresight Keyword Discovery Agent — Starting...\n');

  // Load existing posts to avoid duplicate topics
  let existingPosts = [];
  if (fs.existsSync(POSTS_FILE)) {
    existingPosts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  }
  console.log(`📚 ${existingPosts.length} existing posts loaded\n`);

  // Phase 1: Gather suggestions from seed queries + Closed-Loop SEO Governor gaps
  console.log('Phase 1: Gathering search suggestions...');
  const allSuggestions = new Set();
  const gscGapImpressions = new Map();
  const govBriefPath = path.join(__dirname, '..', '.analytics', 'governor_brief.json');
  let govBrief = null;
  if (fs.existsSync(govBriefPath)) {
    try {
      govBrief = JSON.parse(fs.readFileSync(govBriefPath, 'utf8'));
      for (const gap of (govBrief.safe_topic_gaps || []).slice(0, 15)) {
        if (gap.query) {
          allSuggestions.add(gap.query);
          gscGapImpressions.set(String(gap.query).toLowerCase().trim(), Number(gap.impressions || 0));
        }
      }
      console.log(`  Injected ${gscGapImpressions.size} live GSC non-cannibalized topic gaps from SEO Governor`);
    } catch {}
  }

  // Pick a random subset of seeds to avoid hitting rate limits
  const shuffledSeeds = [...SEED_QUERIES].sort(() => Math.random() - 0.5).slice(0, 15);
  const shuffledQuestions = QUESTION_PREFIXES.map(prefix => 
    `${prefix} home inspection`
  ).sort(() => Math.random() - 0.5).slice(0, 5);

  const queriesToSearch = [...shuffledSeeds, ...shuffledQuestions];

  for (const query of queriesToSearch) {
    const suggestions = await fetchSuggestions(query);
    suggestions.forEach(s => allSuggestions.add(s));
    // Rate limit: 300ms between requests
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`  Found ${allSuggestions.size} unique suggestions\n`);

  // Phase 2: Score and rank keywords
  console.log('Phase 2: Scoring keywords by relevance and value...');
  const scored = [...allSuggestions]
    .map(kw => ({
      keyword: kw,
      score: scoreKeyword(kw, gscGapImpressions.get(String(kw).toLowerCase().trim()) || 0),
    }))
    .filter(item => item.score >= 10) // Minimum relevance threshold
    .filter(item => !isAlreadyCovered(item.keyword, existingPosts))
    .sort((a, b) => b.score - a.score);

  console.log(`  ${scored.length} high-value keywords after filtering\n`);

  if (scored.length === 0) {
    console.log('⚠️ No new keywords found. Using fallback topic.');
    const brief = {
      targetKeyword: "home inspection tips for first time buyers in Georgia",
      relatedKeywords: ["first time home buyer inspection", "what to look for home inspection"],
      score: 15,
      discoveredAt: new Date().toISOString(),
      source: "fallback"
    };
    fs.writeFileSync(KEYWORD_BRIEF_FILE, JSON.stringify(brief, null, 2), 'utf8');
    console.log('💾 Fallback brief saved');
    return;
  }

  // Phase 3: Select the best keyword and gather related terms
  const topKeyword = scored[0];
  const relatedKeywords = scored.slice(1, 6).map(s => s.keyword);

  console.log('🏆 Top keyword opportunities:');
  scored.slice(0, 10).forEach((item, i) => {
    console.log(`  ${i + 1}. [${item.score}] "${item.keyword}"`);
  });

  // Phase 4: Save the keyword brief (including starving money pages for contextual links)
  const brief = {
    targetKeyword: topKeyword.keyword,
    relatedKeywords,
    score: topKeyword.score,
    priorityInternalLinkTargets: (govBrief?.priority_internal_link_targets || []).slice(0, 5).map(p => ({
      url: p.url,
      conversionRatePct: p.conversion_rate_pct,
      gscClicks: p.gsc_clicks
    })),
    allOpportunities: scored.slice(0, 20).map(s => ({ keyword: s.keyword, score: s.score })),
    discoveredAt: new Date().toISOString(),
    source: govBrief ? "seo-governor+google-suggest" : "google-suggest"
  };

  fs.writeFileSync(KEYWORD_BRIEF_FILE, JSON.stringify(brief, null, 2), 'utf8');
  console.log(`\n💾 Keyword brief saved to ${KEYWORD_BRIEF_FILE}`);
  console.log(`🎯 Target: "${topKeyword.keyword}" (score: ${topKeyword.score})`);
  console.log(`🔗 Related: ${relatedKeywords.join(', ')}`);
  console.log('\n✅ Done! Ready for blog generator.');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
