import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');

function toSlug(cityName) {
  return cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function main() {
  console.log('🔄 Fixing nearby cities links & promoting Sewer Scope service...');

  const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  console.log(`🏘️ Loaded ${cities.length} cities from database`);

  let updatedCount = 0;

  for (const city of cities) {
    const currentName = city['City Name'];
    const currentCounty = city.County;
    
    // 1. Find other cities in the same county
    let matches = cities.filter(c => c.County === currentCounty && c['City Name'] !== currentName);
    
    // 2. Fallback: if not enough cities in the same county, pull from others
    if (matches.length < 3) {
      const otherCities = cities.filter(c => c.County !== currentCounty);
      matches = [...matches, ...otherCities].slice(0, 3);
    } else {
      // Pick up to 3-4 matches randomly or sequentially
      matches = matches.slice(0, 3);
    }

    // 3. Generate correct, relative sitemap-compliant links
    const linkItems = matches.map(c => {
      const slug = toSlug(c['City Name']);
      return `<a href="/service-areas/${slug}" style="text-decoration: underline; font-weight: 600;">${c['City Name']}</a>`;
    });

    const linksHtml = `Nearby communities we serve: ${linkItems.join(', ')}.`;

    // 4. Add dynamic Sewer Scope marketing promotion block
    const sewerScopePromo = `<div style="margin-top: 1.25rem; font-size: 0.95rem; background: var(--color-red-light); padding: 1rem; border-left: 4px solid var(--color-red); border-radius: var(--radius-sm); text-align: left; color: var(--color-dark);">
  🛡️ <strong>Sewer Scope Protection Advantage:</strong> Established neighborhoods near ${currentName} GA are highly prone to underground sewer line root intrusion, cracks, or collapses due to mature trees. Protect yourself from $5,000+ in excavation repairs by adding our high-definition <strong>Sewer Scope Inspection ($400)</strong> to your dual-inspector booking! <a href="/services#sewer-scope-inspections" style="color: var(--color-red); text-decoration: underline; font-weight: 700;">Explore Sewer Services &rarr;</a>
</div>`;

    city['Nearby Cities HTML'] = `<p style="margin-bottom: 0.75rem; color: var(--color-gray-dark);">${linksHtml}</p>${sewerScopePromo}`;
    updatedCount++;
  }

  fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');
  console.log(`🎉 Successfully fixed nearby cities boxes & added Sewer Scope marketing across all ${updatedCount} cities!`);
}

main();
