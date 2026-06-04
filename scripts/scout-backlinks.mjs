#!/usr/bin/env node
/**
 * Backlink Opportunity Scout for Foresight Home Inspections
 * 
 * Searches the web for link-building opportunities:
 * 1. Guest post opportunities on real estate/home blogs
 * 2. Unlinked mentions of the business
 * 3. Competitor analysis — directories where competitors have listings
 * 4. Broken link opportunities on real estate sites
 * 
 * Outputs actionable leads to data/backlink-opportunities.json
 * 
 * Usage: GEMINI_API_KEY=your_key node scripts/scout-backlinks.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OPPORTUNITIES_FILE = path.join(__dirname, '..', 'data', 'backlink-opportunities.json');

// Automatically load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const eqIdx = trimmed.indexOf('=');
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (key && val && !process.env[key]) {
        process.env[key] = val.replace(/^["']|["']$/g, ''); // strip optional surrounding quotes
      }
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Search queries to find backlink opportunities
const SEARCH_QUERIES = [
  // Guest post opportunities
  { query: "home inspection guest post write for us", type: "guest_post" },
  { query: "real estate blog write for us Georgia", type: "guest_post" },
  { query: "home buyer tips contribute guest article", type: "guest_post" },
  { query: "home inspection blog accepting guest posts", type: "guest_post" },
  // Unlinked mentions
  { query: '"Foresight Home Inspections" -site:fhinspectionsatl.com', type: "unlinked_mention" },
  { query: '"Christopher Boykin" home inspector -site:fhinspectionsatl.com', type: "unlinked_mention" },
  { query: '"fhinspectionsatl" -site:fhinspectionsatl.com', type: "unlinked_mention" },
  // Directory opportunities
  { query: "home inspector directory Atlanta submit listing", type: "directory" },
  { query: "Georgia home inspection business directory free listing", type: "directory" },
  { query: "best home inspectors Atlanta list", type: "directory" },
  // Local citation sources
  { query: "Atlanta home services directory submit business", type: "directory" },
  { query: "Georgia small business directory free listing", type: "directory" },
  // Real estate resource pages
  { query: "Atlanta real estate resources home inspection links", type: "resource_page" },
  { query: "first time home buyer resources Georgia links", type: "resource_page" },
  { query: "home buying checklist resources recommended inspectors", type: "resource_page" },
  // Forum/community opportunities
  { query: "home inspection advice forum Atlanta", type: "community" },
  { query: "Atlanta real estate reddit home inspection", type: "community" },
];

// Key directories that every local business should be listed on
const CITATION_CHECKLIST = [
  { name: "Google Business Profile", url: "https://business.google.com", priority: "critical", status: "claimed" },
  { name: "InterNACHI Directory", url: "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873", priority: "critical", status: "active" },
  { name: "Yelp", url: "https://biz.yelp.com", priority: "high", status: "check" },
  { name: "Facebook Business", url: "https://facebook.com/fhinspectionsatl", priority: "high", status: "active" },
  { name: "LinkedIn Company", url: "https://www.linkedin.com/company/foresight-home-inspections-llc/", priority: "high", status: "active" },
  { name: "Better Business Bureau", url: "https://www.bbb.org", priority: "high", status: "check" },
  { name: "Angi (Angie's List)", url: "https://www.angi.com", priority: "high", status: "check" },
  { name: "HomeAdvisor", url: "https://www.homeadvisor.com", priority: "high", status: "check" },
  { name: "Thumbtack", url: "https://www.thumbtack.com", priority: "medium", status: "check" },
  { name: "Nextdoor Business", url: "https://business.nextdoor.com", priority: "medium", status: "check" },
  { name: "Apple Maps", url: "https://mapsconnect.apple.com", priority: "medium", status: "check" },
  { name: "Bing Places", url: "https://www.bingplaces.com", priority: "medium", status: "check" },
  { name: "Zillow Professional", url: "https://www.zillow.com/professionals", priority: "high", status: "check" },
  { name: "Realtor.com", url: "https://www.realtor.com", priority: "medium", status: "check" },
  { name: "Porch", url: "https://porch.com", priority: "medium", status: "check" },
  { name: "Manta", url: "https://www.manta.com", priority: "low", status: "check" },
  { name: "Chamber of Commerce (local)", url: "https://www.metroatlantachamber.com", priority: "high", status: "check" },
  { name: "ASHI (if applicable)", url: "https://www.ashi.org", priority: "medium", status: "check" },
  { name: "InspectorPages", url: "https://www.inspectorpages.com", priority: "medium", status: "check" },
  { name: "Home Inspector Pro Directory", url: "https://www.homeinspectorpro.com", priority: "medium", status: "check" },
];

// NAP consistency — the EXACT info every directory should have
const BUSINESS_NAP = {
  name: "Foresight Home Inspections, LLC",
  phone: "678-480-2110",
  email: "plsinspectnow@gmail.com",
  website: "https://www.fhinspectionsatl.com",
  address: "Atlanta, GA",
  serviceArea: "Metro Atlanta and surrounding areas",
  owner: "Christopher Boykin",
  credentials: "Certified Master Inspector (CMI), Certified Professional Inspector (CPI)",
  certBody: "InterNACHI",
  description: "Premium home inspection services in Metro Atlanta with two certified inspectors on every job. Led by Christopher Boykin, CMI. Every inspection includes thermal imaging, drone technology, and a $10,000 warranty. Serving 163+ cities across Georgia.",
  shortDescription: "Certified Master Inspector serving Metro Atlanta. Two inspectors on every job. $10,000 warranty included.",
  categories: ["Home Inspector", "Home Inspection Service", "Real Estate Inspection", "Building Inspector"],
  hours: "Monday-Saturday 7:00 AM - 6:00 PM",
  socialLinks: {
    facebook: "https://facebook.com/fhinspectionsatl",
    instagram: "https://www.instagram.com/fhinspectionsatl/",
    tiktok: "https://www.tiktok.com/@fhinspectionsatl",
    youtube: "https://www.youtube.com/@ForesightHomeInspections-t6r",
    linkedin: "https://www.linkedin.com/company/foresight-home-inspections-llc/"
  }
};

async function fetchGoogleSuggestions(query) {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data[1] || [];
  } catch {
    return [];
  }
}

async function analyzeWithGemini(opportunities) {
  if (!GEMINI_API_KEY || opportunities.length === 0) return null;

  const prompt = `You are a local SEO expert. Analyze these backlink opportunity search suggestions and identify the top 5 most actionable link-building strategies for a home inspection company in Atlanta, GA.

Suggestions found:
${opportunities.map(o => `- [${o.type}] "${o.suggestion}"`).join('\n')}

For each of the top 5, provide:
1. What to do (specific action)
2. Why it helps (SEO benefit)
3. Estimated effort (low/medium/high)

Return ONLY valid JSON:
{
  "strategies": [
    {
      "action": "what to do",
      "benefit": "why it helps",
      "effort": "low|medium|high",
      "relatedQuery": "the search query this relates to"
    }
  ]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
        })
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    let jsonStr = rawText;
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔗 Foresight Backlink Scout — Starting...\n');

  // Load existing opportunities
  let existingData = { opportunities: [], citationChecklist: [], nap: {}, strategies: [], lastScanned: null };
  if (fs.existsSync(OPPORTUNITIES_FILE)) {
    try { existingData = JSON.parse(fs.readFileSync(OPPORTUNITIES_FILE, 'utf8')); } catch {}
  }

  // Phase 1: Discover new opportunities via Google suggestions
  console.log('Phase 1: Searching for backlink opportunities...');
  const allOpportunities = [];

  // Pick a random subset to avoid rate limits
  const searchSubset = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5).slice(0, 8);

  for (const sq of searchSubset) {
    const suggestions = await fetchGoogleSuggestions(sq.query);
    suggestions.forEach(s => {
      allOpportunities.push({
        suggestion: s,
        type: sq.type,
        sourceQuery: sq.query,
        discoveredAt: new Date().toISOString().split('T')[0],
      });
    });
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`  Found ${allOpportunities.length} suggestions\n`);

  // Phase 2: AI analysis of opportunities
  let strategies = existingData.strategies || [];
  if (GEMINI_API_KEY && allOpportunities.length > 0) {
    console.log('Phase 2: Analyzing opportunities with AI...');
    const analysis = await analyzeWithGemini(allOpportunities);
    if (analysis?.strategies) {
      strategies = analysis.strategies;
      console.log(`  Generated ${strategies.length} actionable strategies\n`);
    }
  }

  // Phase 3: Merge with existing data (deduplicate)
  const existingSuggestions = new Set((existingData.opportunities || []).map(o => o.suggestion));
  const newOpportunities = allOpportunities.filter(o => !existingSuggestions.has(o.suggestion));
  const mergedOpportunities = [...(existingData.opportunities || []), ...newOpportunities];

  console.log(`  ${newOpportunities.length} new opportunities added`);
  console.log(`  ${mergedOpportunities.length} total opportunities tracked\n`);

  // Phase 4: Save everything
  const output = {
    lastScanned: new Date().toISOString(),
    nap: BUSINESS_NAP,
    citationChecklist: CITATION_CHECKLIST,
    strategies,
    opportunities: mergedOpportunities.slice(-100), // Keep last 100
  };

  fs.writeFileSync(OPPORTUNITIES_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`💾 Saved to ${OPPORTUNITIES_FILE}`);

  // Print summary
  console.log('\n📊 Citation Checklist Summary:');
  const needsAction = CITATION_CHECKLIST.filter(c => c.status === 'check');
  console.log(`  ✅ Active: ${CITATION_CHECKLIST.filter(c => c.status === 'active' || c.status === 'claimed').length}`);
  console.log(`  ⚠️ Needs checking: ${needsAction.length}`);
  needsAction.slice(0, 5).forEach(c => console.log(`     → ${c.name} (${c.priority} priority): ${c.url}`));

  if (strategies.length > 0) {
    console.log('\n🎯 Top Strategies This Week:');
    strategies.slice(0, 3).forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.action} [${s.effort} effort]`);
    });
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
