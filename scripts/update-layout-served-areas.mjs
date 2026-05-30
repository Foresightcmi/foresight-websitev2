import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');
const LAYOUT_FILE = path.join(__dirname, '..', 'app', 'layout.js');

function main() {
  console.log('🔄 Synchronizing layout.js served areas with database...');

  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  console.log(`🏘️ Found ${cities.length} total cities in database`);

  const areas = [{ "@type": "State", "name": "Georgia" }];
  
  // Sort cities alphabetically to keep schema organized
  const sortedCities = [...cities].sort((a, b) => a['City Name'].localeCompare(b['City Name']));
  
  for (const city of sortedCities) {
    areas.push({ "@type": "City", "name": city['City Name'] });
  }

  const schemaString = `    "areaServed": ${JSON.stringify(areas, null, 6).replace(/\n/g, '\n  ')}`;

  let layoutContent = fs.readFileSync(LAYOUT_FILE, 'utf8');

  // Replace areaServed block recursively/safely using regex
  const regex = /"areaServed":\s*\[[\s\S]*?\s*\]/g;
  layoutContent = layoutContent.replace(regex, schemaString);

  fs.writeFileSync(LAYOUT_FILE, layoutContent, 'utf8');
  console.log(`🎉 layout.js successfully updated with all ${cities.length} served areas!\n`);
}

main();
