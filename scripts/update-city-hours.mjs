import fs from 'fs';
import path from 'path';

const citiesPath = path.join(process.cwd(), 'data', 'cities.json');
const schemaPkgPath = path.join(process.cwd(), 'data', 'schema_package.json');

const newHoursSpecs = [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "20:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Wednesday", "Sunday"],
    "opens": "08:00",
    "closes": "20:00",
    "description": "By appointment only"
  }
];

if (fs.existsSync(citiesPath)) {
  const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  let updatedCount = 0;
  for (const city of cities) {
    if (city['JSON-LD Schema']) {
      try {
        const schemaObj = JSON.parse(city['JSON-LD Schema']);
        schemaObj.openingHoursSpecification = newHoursSpecs;
        city['JSON-LD Schema'] = JSON.stringify(schemaObj);
        updatedCount++;
      } catch (err) {
        console.error(`Error parsing schema for ${city['City Name']}:`, err);
      }
    }
  }
  fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2), 'utf8');
  console.log(`Updated JSON-LD schemas in cities.json for ${updatedCount} cities.`);
}

if (fs.existsSync(schemaPkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(schemaPkgPath, 'utf8'));
    if (pkg.openingHoursSpecification) {
      pkg.openingHoursSpecification = newHoursSpecs;
    }
    fs.writeFileSync(schemaPkgPath, JSON.stringify(pkg, null, 2), 'utf8');
    console.log(`Updated schema_package.json.`);
  } catch (err) {
    console.error('Error updating schema_package.json:', err);
  }
}
