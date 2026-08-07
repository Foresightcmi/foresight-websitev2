#!/usr/bin/env node
/**
 * City Page Refresher for Foresight Home Inspections
 * 
 * Uses Google Gemini API (with retries & fallback) to refresh city pages
 * with updated content and seasonal tips.
 * 
 * Usage: GEMINI_API_KEY=your_key node scripts/refresh-city-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');
const REFRESH_LOG = path.join(__dirname, '..', 'data', 'refresh-log.json');

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
        process.env[key] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CITIES_PER_RUN = 3;

function getMonth() {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

function getSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

const SEASONAL_CONTEXT = {
  spring: 'Spring in Georgia brings heavy rain, pollen, and storm season. Common concerns: roof damage from storms, moisture in crawlspaces, HVAC transition from heat to cooling, gutter clogs from pollen.',
  summer: 'Georgia summers bring extreme heat (95°F+) and humidity. Common concerns: HVAC overwork and failures, moisture and mold in attics/crawlspaces, foundation issues from soil expansion, pest activity (termites, mosquitoes).',
  fall: 'Fall in Georgia means cooling temps and prep for winter. Common concerns: HVAC transition to heating, roof inspections before winter, gutter cleaning from falling leaves, checking weatherstripping and insulation.',
  winter: 'Georgia winters are mild but can bring freezing snaps. Common concerns: pipe freeze risk, heating system failures, fireplace/chimney safety, poor insulation causing high energy bills.'
};

const FALLBACK_TIPS = {
  spring: (cityName) => `Georgia spring rains can place significant stress on your roof decking and gutter systems in ${cityName}. Homeowners should inspect crawlspaces for moisture intrusion and verify that AC condensation lines are flowing freely before hot weather sets in. Have a licensed HVAC or moisture contractor evaluate further as needed.`,
  summer: (cityName) => `Georgia summers bring extreme heat and high humidity, which can place significant stress on your home's HVAC system. Homeowners in ${cityName} should prioritize checking their AC system's temperature split and air filters. It is also important to verify that attic ventilation fans are operating correctly to prevent moisture buildup in the roof decking. Have a licensed HVAC contractor evaluate further and repair as needed.`,
  fall: (cityName) => `Fall in ${cityName} brings cooling temperatures. Inspect heating elements and fireplace flues before first use, clear autumn leaves from roof valleys and gutters, and verify exterior door weatherstripping is intact to maintain indoor energy efficiency.`,
  winter: (cityName) => `Winter cold snaps in ${cityName} can freeze vulnerable exterior plumbing lines. Insulate crawlspace vent openings, disconnect garden hoses from outdoor spigots, and test furnace heating performance to prevent emergency mid-winter repairs.`
};

async function generateCityRefreshWithRetry(cityName, county, season, month) {
  if (!GEMINI_API_KEY) {
    return { seasonalTip: FALLBACK_TIPS[season](cityName) };
  }

  const prompt = `Generate a short seasonal update paragraph (3-4 sentences) for a home inspection company's city page. This is for ${cityName}, ${county} County, Georgia in ${month} (${season}).

Context: ${SEASONAL_CONTEXT[season]}

Write a brief, helpful seasonal tip specific to ${cityName} homeowners. Mention one specific home maintenance action they should take this ${season}. Keep it practical and relevant to the local area.

Return ONLY valid JSON:
{
  "seasonalTip": "The paragraph text here. Keep it 3-4 sentences."
}`;

  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash'
  ];

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (rawText) {
            let jsonStr = rawText;
            if (jsonStr.startsWith('```')) {
              jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            }
            return JSON.parse(jsonStr);
          }
        }

        if (response.status === 429) {
          // Wait before retry
          await new Promise(r => setTimeout(r, 2000 * attempt));
        }
      } catch (e) {
        // Retry next
      }
    }
  }

  // If API quota or model fails, return local fallback tip
  return { seasonalTip: FALLBACK_TIPS[season](cityName) };
}

async function main() {
  console.log('🗺️  Foresight City Page Refresher — Starting...\n');

  if (!fs.existsSync(CITIES_FILE)) {
    console.error(`ERROR: ${CITIES_FILE} does not exist.`);
    process.exit(1);
  }

  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  const season = getSeason();
  const month = getMonth();

  let refreshLog = {};
  if (fs.existsSync(REFRESH_LOG)) {
    try {
      refreshLog = JSON.parse(fs.readFileSync(REFRESH_LOG, 'utf8'));
    } catch (e) {
      refreshLog = {};
    }
  }

  const sortedCities = [...cities].sort((a, b) => {
    const aDate = refreshLog[a['City Name']] || '2000-01-01';
    const bDate = refreshLog[b['City Name']] || '2000-01-01';
    return aDate.localeCompare(bDate);
  });

  const citiesToRefresh = sortedCities.slice(0, CITIES_PER_RUN);
  console.log(`📅 Season: ${season} | Month: ${month}`);
  console.log(`🏘️  Refreshing ${citiesToRefresh.length} cities...\n`);

  let updatedCount = 0;

  for (const city of citiesToRefresh) {
    const cityName = city['City Name'];
    const county = city.County || 'Georgia';

    try {
      console.log(`  ⏳ ${cityName}...`);
      const result = await generateCityRefreshWithRetry(cityName, county, season, month);

      const seasonalPrefix = `<strong>${month} ${new Date().getFullYear()} Update for ${cityName}:</strong> ${result.seasonalTip}`;
      
      const originalCity = cities.find(c => c['City Name'] === cityName);
      if (originalCity) {
        originalCity['Seasonal Tip'] = seasonalPrefix;
        originalCity['Last Refreshed'] = new Date().toISOString().split('T')[0];
        refreshLog[cityName] = new Date().toISOString().split('T')[0];
        updatedCount++;
        console.log(`  ✅ ${cityName} — updated`);
      }

      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`  ⚠️  ${cityName} — using fallback due to: ${err.message}`);
      const fallbackTip = FALLBACK_TIPS[season](cityName);
      const seasonalPrefix = `<strong>${month} ${new Date().getFullYear()} Update for ${cityName}:</strong> ${fallbackTip}`;
      const originalCity = cities.find(c => c['City Name'] === cityName);
      if (originalCity) {
        originalCity['Seasonal Tip'] = seasonalPrefix;
        originalCity['Last Refreshed'] = new Date().toISOString().split('T')[0];
        refreshLog[cityName] = new Date().toISOString().split('T')[0];
        updatedCount++;
      }
    }
  }

  fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');
  fs.writeFileSync(REFRESH_LOG, JSON.stringify(refreshLog, null, 2), 'utf8');

  console.log(`\n📊 Updated ${updatedCount}/${citiesToRefresh.length} cities`);
  console.log('✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
