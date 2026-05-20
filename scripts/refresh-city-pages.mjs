#!/usr/bin/env node
/**
 * City Page Refresher for Foresight Home Inspections
 * 
 * Uses Google Gemini API to refresh 10-15 city pages per run with
 * updated content, seasonal tips, and fresh FAQ questions.
 * 
 * Usage: GEMINI_API_KEY=your_key node scripts/refresh-city-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');
const REFRESH_LOG = path.join(__dirname, '..', 'data', 'refresh-log.json');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required.');
  process.exit(1);
}

const CITIES_PER_RUN = 12;

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

async function generateCityRefresh(cityName, county, season, month) {
  const prompt = `Generate a short seasonal update paragraph (3-4 sentences) for a home inspection company's city page. This is for ${cityName}, ${county} County, Georgia in ${month} (${season}).

Context: ${SEASONAL_CONTEXT[season]}

Write a brief, helpful seasonal tip specific to ${cityName} homeowners. Mention one specific home maintenance action they should take this ${season}. Keep it practical and relevant to the local area.

Return ONLY valid JSON:
{
  "seasonalTip": "The paragraph text here. Keep it 3-4 sentences."
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  let jsonStr = rawText;
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(jsonStr);
}

async function main() {
  console.log('🗺️  Foresight City Page Refresher — Starting...\n');

  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  const season = getSeason();
  const month = getMonth();

  // Load refresh log to track which cities were last updated
  let refreshLog = {};
  if (fs.existsSync(REFRESH_LOG)) {
    refreshLog = JSON.parse(fs.readFileSync(REFRESH_LOG, 'utf8'));
  }

  // Sort cities by last refresh date (oldest first) so we cycle through all
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
      const result = await generateCityRefresh(cityName, county, season, month);

      // Add seasonal tip to the city's Intro (prepend seasonal context)
      const seasonalPrefix = `<strong>${month} ${new Date().getFullYear()} Update for ${cityName}:</strong> ${result.seasonalTip}`;
      
      // Find the city in the original array and update
      const originalCity = cities.find(c => c['City Name'] === cityName);
      if (originalCity) {
        // Store the seasonal tip as a separate field so it can be rendered
        originalCity['Seasonal Tip'] = seasonalPrefix;
        originalCity['Last Refreshed'] = new Date().toISOString().split('T')[0];
        refreshLog[cityName] = new Date().toISOString().split('T')[0];
        updatedCount++;
        console.log(`  ✅ ${cityName} — updated`);
      }

      // Rate limit: wait 1 second between API calls
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`  ❌ ${cityName} — error: ${err.message}`);
    }
  }

  // Save updated cities
  fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');
  fs.writeFileSync(REFRESH_LOG, JSON.stringify(refreshLog, null, 2), 'utf8');

  console.log(`\n📊 Updated ${updatedCount}/${citiesToRefresh.length} cities`);
  console.log('✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
