import fs from 'fs';
import path from 'path';

console.log('🔍 Auditing Structured Data (JSON-LD) against Google Search Console Standards...\n');

let errors = 0;
let passes = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    errors++;
  } else {
    console.log(`✅ [PASS] ${message}`);
    passes++;
  }
}

// 1. Check app/services/[service]/[city]/page.js
const serviceCityPath = path.join(process.cwd(), 'app', 'services', '[service]', '[city]', 'page.js');
const serviceCityContent = fs.readFileSync(serviceCityPath, 'utf8');

// A. Service schema must NOT contain aggregateRating (prevents GSC "Invalid object type for field <parent_node>")
const serviceBlockMatch = serviceCityContent.match(/const serviceJsonLd\s*=\s*\{([\s\S]*?)\};/);
if (serviceBlockMatch) {
  const serviceBlock = serviceBlockMatch[1];
  assert(!serviceBlock.includes('aggregateRating'), 'serviceJsonLd in services/[service]/[city] does NOT attach aggregateRating to Service node');
} else {
  assert(false, 'serviceJsonLd defined in services/[service]/[city]/page.js');
}

// B. Product schema must have image, offers, aggregateRating, sku (satisfies Merchant listings & Review snippets)
const productBlockMatch = serviceCityContent.match(/const productJsonLd\s*=\s*\{([\s\S]*?)\};/);
if (productBlockMatch) {
  const productBlock = productBlockMatch[1];
  assert(productBlock.includes('"image":'), 'productJsonLd in services/[service]/[city] includes required "image" field');
  assert(productBlock.includes('"offers":'), 'productJsonLd in services/[service]/[city] includes required "offers" field');
  assert(productBlock.includes('"aggregateRating":'), 'productJsonLd in services/[service]/[city] includes "aggregateRating" for review stars');
  assert(productBlock.includes('"reviewCount": "48"'), 'productJsonLd in services/[service]/[city] has verified reviewCount 48');
  assert(productBlock.includes('"sku":'), 'productJsonLd in services/[service]/[city] includes "sku" field');
} else {
  assert(false, 'productJsonLd defined in services/[service]/[city]/page.js');
}

// 2. Check app/service-areas/[city]/page.js
const cityPagePath = path.join(process.cwd(), 'app', 'service-areas', '[city]', 'page.js');
const cityPageContent = fs.readFileSync(cityPagePath, 'utf8');

const cityServiceBlockMatch = cityPageContent.match(/const serviceJsonLd\s*=\s*\{([\s\S]*?)\};/);
if (cityServiceBlockMatch) {
  const cityServiceBlock = cityServiceBlockMatch[1];
  assert(!cityServiceBlock.includes('aggregateRating'), 'serviceJsonLd in service-areas/[city] does NOT attach aggregateRating to Service node');
} else {
  assert(false, 'serviceJsonLd defined in service-areas/[city]/page.js');
}

const cityProductBlockMatch = cityPageContent.match(/const productJsonLd\s*=\s*\{([\s\S]*?)\};/);
if (cityProductBlockMatch) {
  const cityProductBlock = cityProductBlockMatch[1];
  assert(cityProductBlock.includes('"image":'), 'productJsonLd in service-areas/[city] includes required "image" field');
  assert(cityProductBlock.includes('"offers":'), 'productJsonLd in service-areas/[city] includes required "offers" field');
  assert(cityProductBlock.includes('"aggregateRating":'), 'productJsonLd in service-areas/[city] includes "aggregateRating"');
  assert(cityProductBlock.includes('"reviewCount": "48"'), 'productJsonLd in service-areas/[city] has verified reviewCount 48');
  assert(cityProductBlock.includes('"sku":'), 'productJsonLd in service-areas/[city] includes "sku" field');
} else {
  assert(false, 'productJsonLd defined in service-areas/[city]/page.js');
}

// 3. Check app/services/page.js
const servicesHubPath = path.join(process.cwd(), 'app', 'services', 'page.js');
const servicesHubContent = fs.readFileSync(servicesHubPath, 'utf8');

const servicesProductBlockMatch = servicesHubContent.match(/const productSchema\s*=\s*\{([\s\S]*?)\};/);
if (servicesProductBlockMatch) {
  const productBlock = servicesProductBlockMatch[1];
  assert(productBlock.includes('"image":'), 'productSchema in services/page.js includes required "image" field');
  assert(productBlock.includes('"offers":'), 'productSchema in services/page.js includes required "offers" field');
  assert(productBlock.includes('"aggregateRating":'), 'productSchema in services/page.js includes "aggregateRating"');
  assert(productBlock.includes('"sku":'), 'productSchema in services/page.js includes "sku" field');
} else {
  assert(false, 'productSchema defined in services/page.js');
}

// 4. Check data/cities.json
const citiesPath = path.join(process.cwd(), 'data', 'cities.json');
const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
let citiesWithImage = 0;
let citiesWithInvalidParent = 0;

for (const city of citiesData) {
  if (city['JSON-LD Schema']) {
    const s = JSON.parse(city['JSON-LD Schema']);
    if (s.image) citiesWithImage++;
    if (s['@type'] === 'Service' && s.aggregateRating) citiesWithInvalidParent++;
  }
}
assert(citiesWithImage === citiesData.length, `All ${citiesData.length} cities in cities.json include "image" in LocalBusiness schema`);
assert(citiesWithInvalidParent === 0, 'Zero cities in cities.json place aggregateRating on a Service node');

console.log(`\nStructured Data Audit Summary: ${passes} passed, ${errors} failed.`);
if (errors > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% Google Rich Results & Search Console Structured Data Compliance verified!\n');
  process.exit(0);
}
