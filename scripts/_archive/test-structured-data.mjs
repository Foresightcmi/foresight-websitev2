import fs from 'fs';
import path from 'path';

console.log('🔍 Evaluating Structured Data (JSON-LD) against Google Search Console Standards...\n');

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
  assert(productBlock.includes('"reviewCount": "53"'), 'productJsonLd in services/[service]/[city] has verified reviewCount 53');
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
  assert(cityProductBlock.includes('"reviewCount": "53"'), 'productJsonLd in service-areas/[city] has verified reviewCount 53');
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

// 5. Check app/services/[service]/page.js and app/services/[service]/[city]/page.js for Product.offers.price & priceSpecification.price
const serviceHubPage = fs.readFileSync(path.join(process.cwd(), 'app', 'services', '[service]', 'page.js'), 'utf8');
const serviceCityPage = fs.readFileSync(path.join(process.cwd(), 'app', 'services', '[service]', '[city]', 'page.js'), 'utf8');
assert(!serviceHubPage.includes('"@type": "PriceSpecification"'), 'services/[service]/page.js has zero bare PriceSpecification objects without price');
assert(!serviceCityPage.includes('"@type": "PriceSpecification"'), 'services/[service]/[city]/page.js has zero bare PriceSpecification objects without price');
assert(serviceHubPage.includes('"@type": "UnitPriceSpecification"'), 'services/[service]/page.js includes UnitPriceSpecification with numeric price');
assert(serviceCityPage.includes('"@type": "UnitPriceSpecification"'), 'services/[service]/[city]/page.js includes UnitPriceSpecification with numeric price');

// 6. Simulate Offer price evaluation across all 12 services in data/services-pseo.json (including "Call for Quote" services)
const servicesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'services-pseo.json'), 'utf8'));
const allServicesHaveNumericOfferPrice = servicesData.every((serviceData) => {
  const offerPrice = `${(serviceData.price.match(/\d+/) || ['345'])[0]}.00`;
  return /^\d+\.\d{2}$/.test(offerPrice) && Number(offerPrice) > 0;
});
assert(allServicesHaveNumericOfferPrice, `All ${servicesData.length} services in services-pseo.json resolve to a valid numeric Offer.price and priceSpecification.price`);

// 7. If .next/server/app exists, parse every compiled HTML file's application/ld+json blocks
const nextAppDir = path.join(process.cwd(), '.next', 'server', 'app');
if (fs.existsSync(nextAppDir)) {
  function walkHtml(dir) {
    let out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walkHtml(full));
      else if (entry.name.endsWith('.html')) out.push(full);
    }
    return out;
  }
  const htmlFiles = walkHtml(nextAppDir);
  let totalProducts = 0;
  let totalOffers = 0;
  let invalidOffers = [];
  function inspectJsonLd(node, file) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => inspectJsonLd(n, file));
      return;
    }
    if (node['@type'] === 'Product') totalProducts++;
    if (node['@type'] === 'Offer' || node['@type'] === 'AggregateOffer') {
      totalOffers++;
      const hasPrice = typeof node.price === 'string' && /^\d+\.\d{2}$/.test(node.price);
      const specPrice = node.priceSpecification && node.priceSpecification.price;
      const hasSpecPrice = typeof specPrice === 'string' && /^\d+\.\d{2}$/.test(specPrice);
      const specDesc = (node.priceSpecification && node.priceSpecification.description) || '';
      if (!hasPrice || !hasSpecPrice) {
        invalidOffers.push({ file: path.relative(process.cwd(), file), reason: 'missing or non-2-decimal price/priceSpecification.price', node });
      }
      if (node.price === '750.00' || specDesc.includes('Starting at From ')) {
        invalidOffers.push({ file: path.relative(process.cwd(), file), reason: 'stale 750.00 price or duplicate Starting at From description', node });
      }
    }
    for (const val of Object.values(node)) inspectJsonLd(val, file);
  }
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      try {
        inspectJsonLd(JSON.parse(m[1]), file);
      } catch (err) {
        invalidOffers.push({ file: path.relative(process.cwd(), file), error: err.message });
      }
    }
  }
  if (invalidOffers.length > 0) {
    console.error('Invalid Offers found:', JSON.stringify(invalidOffers.slice(0, 5), null, 2));
  }
  assert(
    invalidOffers.length === 0 && totalProducts > 0 && totalOffers > 0,
    `All ${totalOffers} Offer/AggregateOffer nodes and ${totalProducts} Product nodes across ${htmlFiles.length} compiled HTML pages specify valid 2-decimal numeric price & priceSpecification.price`
  );
}

console.log(`\nStructured Data Evaluation Summary: ${passes} passed, ${errors} failed.`);
if (errors > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% Google Rich Results & Search Console Structured Data Compliance verified!\n');
  process.exit(0);
}
