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

/**
 * Score a keyword based on relevance to home inspections
 */
function scoreKeyword(keyword) {
  let score = 0;
  const kw = keyword.toLowerCase();
  
  // High relevance terms
  if (kw.includes('inspection')) score += 10;
  if (kw.includes('inspector')) score += 10;
  if (kw.includes('home')) score += 5;
  if (kw.includes('house')) score += 5;
  
  // Location relevance
  if (kw.includes('georgia') || kw.includes('atlanta') || kw.includes(' ga')) score += 8;
  
  // Question format (great for FAQ/AIO)
  if (kw.startsWith('how') || kw.startsWith('what') || kw.startsWith('why') || kw.startsWith('when') || kw.startsWith('do i') || kw.startsWith('should') || kw.startsWith('is it')) score += 7;
  
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
  
  // Long-tail bonus (more specific = less competition)
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

  // Phase 1: Gather suggestions from seed queries
  console.log('Phase 1: Gathering search suggestions...');
  const allSuggestions = new Set();

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
    .map(kw => ({ keyword: kw, score: scoreKeyword(kw) }))
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

  // Phase 4: Save the keyword brief
  const brief = {
    targetKeyword: topKeyword.keyword,
    relatedKeywords,
    score: topKeyword.score,
    allOpportunities: scored.slice(0, 20).map(s => ({ keyword: s.keyword, score: s.score })),
    discoveredAt: new Date().toISOString(),
    source: "google-suggest"
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
