const fs = require('fs');
const path = require('path');

const citiesFile = path.join(__dirname, '..', 'data', 'cities.json');
const refreshLogFile = path.join(__dirname, '..', 'data', 'refresh-log.json');

const cities = JSON.parse(fs.readFileSync(citiesFile, 'utf8'));
let refreshLog = {};

if (fs.existsSync(refreshLogFile)) {
  refreshLog = JSON.parse(fs.readFileSync(refreshLogFile, 'utf8'));
}

const month = "June";
const year = "2026";
const season = "summer";

// Summer seasonal tips for the cities
const seasonalTips = {
  "Sandy Springs": "Georgia summers bring extreme heat and high humidity, which can place significant stress on your home's HVAC system. Homeowners in Sandy Springs should prioritize checking their AC system's temperature split and air filters. It is also important to verify that attic ventilation fans are operating correctly to prevent moisture buildup in the roof decking. Have a licensed HVAC contractor evaluate further and repair as needed.",
  "Alpharetta": "With summer temperatures rising in Alpharetta, clay soils around foundations can contract and shift, potentially leading to structural settlement. Homeowners should ensure proper perimeter watering and keep gutters clear to maintain consistent soil moisture levels. It is also crucial to inspect basement crawlspaces for signs of condensation or mold growth caused by high humidity. Have a licensed foundation or moisture contractor evaluate further and repair as needed.",
  "Johns Creek": "Summer in Johns Creek means increased pest activity, particularly termites and carpenter ants that thrive in warm, damp wood. Homeowners should inspect the exterior perimeter of their homes for any soil-to-wood contact and clear away firewood or mulch piles near foundation walls. Keeping gutters clear prevents roof rot that attracts pests. Have a licensed pest control contractor evaluate further and repair as needed."
};

// Sort cities by last refresh date (oldest first)
const sortedCities = [...cities].sort((a, b) => {
  const aDate = refreshLog[a['City Name']] || '2000-01-01';
  const bDate = refreshLog[b['City Name']] || '2000-01-01';
  return aDate.localeCompare(bDate);
});

// Refresh Sandy Springs, Alpharetta, Johns Creek
const targetCities = ["Sandy Springs", "Alpharetta", "Johns Creek"];

let updatedCount = 0;
for (const cityName of targetCities) {
  const originalCity = cities.find(c => c['City Name'] === cityName);
  if (originalCity) {
    const tip = seasonalTips[cityName];
    const seasonalPrefix = `<strong>${month} ${year} Update for ${cityName}:</strong> ${tip}`;
    originalCity['Seasonal Tip'] = seasonalPrefix;
    originalCity['Last Refreshed'] = new Date().toISOString().split('T')[0];
    refreshLog[cityName] = new Date().toISOString().split('T')[0];
    updatedCount++;
    console.log(`  ✅ ${cityName} — updated with summer fallback tip`);
  }
}

// Save updated databases
fs.writeFileSync(citiesFile, JSON.stringify(cities, null, 2), 'utf8');
fs.writeFileSync(refreshLogFile, JSON.stringify(refreshLog, null, 2), 'utf8');

console.log(`\n📊 Successfully updated ${updatedCount} city pages with summer seasonal tips.`);
