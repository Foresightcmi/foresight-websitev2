import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const pseo = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'services-pseo.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'cities.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'posts.json'), 'utf8'));

// 1. Canonical From $... pricing & <=62-char CTR metaTitle in services-pseo.json
const fromSlugs = [
  'buyer-inspection',
  'pre-listing-inspection',
  'new-construction-inspection',
  'pre-drywall-inspection',
  '11-month-warranty-inspection',
];
for (const slug of fromSlugs) {
  const svc = pseo.find((s) => s.slug === slug);
  assert.ok(svc, `Missing service ${slug}`);
  assert.match(svc.price, /^From \$\d+/, `${slug}.price must start with From $: got ${svc.price}`);
  assert.match(svc.metaTitle, /From \$\d+/, `${slug}.metaTitle must include From $ CTR hook`);
  const rendered = svc.metaTitle.replace('{city}', 'Atlanta').replace('{City}', 'Atlanta');
  assert.ok(rendered.length <= 62, `${slug} rendered title too long (${rendered.length}): ${rendered}`);
}

// 2. Clean cities.json: zero stale $450 sewer add-on price & keep Inspection Guide anti-cannibalization title
for (const c of cities) {
  const blob = JSON.stringify(c);
  assert.ok(!blob.includes('$450'), `Stale $450 found in cities.json for ${c['City Name']}`);
  assert.match(c['Meta Title'], /Inspection Guide/i, `City hub ${c['City Name']} must keep Inspection Guide title`);
}

// 3. Top-30% Buyer Inspection Funnel in app/service-areas/[city]/page.js
const cityPageSrc = fs.readFileSync(path.join(ROOT, 'app', 'service-areas', '[city]', 'page.js'), 'utf8');
assert.ok(
  cityPageSrc.includes('/services/buyer-inspection/${slug}') && cityPageSrc.includes('From $345'),
  'app/service-areas/[city]/page.js must link prominently above-the-fold to /services/buyer-inspection/${slug} (From $345)'
);

// 4. app/services/page.js: From $ pricing + 25 GSC striking-distance buyer-inspection links
const servicesPageSrc = fs.readFileSync(path.join(ROOT, 'app', 'services', 'page.js'), 'utf8');
assert.ok(!servicesPageSrc.includes("'$295+'") && !servicesPageSrc.includes("'$345+'"), 'Remove bare + prices without From');
const strikingCities = [
  'norcross', 'austell', 'lilburn', 'snellville', 'acworth', 'woodstock', 'johns-creek',
  'buford', 'stone-mountain', 'smyrna', 'powder-springs', 'chattahoochee-hills', 'fairburn',
  'fayetteville', 'mcdonough', 'suwanee', 'duluth', 'clarkston', 'redan', 'cumming',
  'peachtree-corners', 'alpharetta', 'marietta', 'canton', 'dallas',
];
assert.ok(
  servicesPageSrc.includes('href={`/services/buyer-inspection/${cSlug}`}'),
  '/services/page.js missing dynamic /services/buyer-inspection/${cSlug} pill href'
);
for (const sc of strikingCities) {
  assert.ok(
    servicesPageSrc.includes(`'${sc}'`) || servicesPageSrc.includes(`/services/buyer-inspection/${sc}`),
    `/services/page.js missing priority striking-distance link for ${sc}`
  );
}

// 5. Blog post CTR title/description check
const reportPost = posts.find(
  (p) => p.slug === 'understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance'
);
assert.ok(reportPost, 'Missing inspection report guide post');
assert.ok(reportPost.metaTitle && reportPost.metaTitle.length <= 60, 'reportPost.metaTitle must be <=60 chars');
assert.ok(reportPost.description && reportPost.description.length <= 160, 'reportPost.description must be <=160 chars');
assert.ok(!JSON.stringify(reportPost).includes('*'), 'reportPost must have zero asterisks');

// 6. Quad-Search (SEO <=60c across all 957 routes, AEO speakable, AIO table, Local SEO GBP CID + LinkedIn)
for (const s of pseo) {
  for (const c of cities) {
    const rendered = s.metaTitle.replace(/\{city\}/gi, c['City Name']);
    assert.ok(rendered.length <= 60, `${s.slug} for ${c['City Name']} exceeds 60 chars (${rendered.length}): ${rendered}`);
  }
}
const svcCitySrc = fs.readFileSync(path.join(ROOT, 'app', 'services', '[service]', '[city]', 'page.js'), 'utf8');
assert.ok(!svcCitySrc.includes('starting at ${serviceData.price}'), 'Fix redundant starting at From $ grammar');
assert.ok(svcCitySrc.includes('cid=10862078652033010531') && svcCitySrc.includes('107206117'), 'Service-city missing GBP CID or LinkedIn');
assert.ok(cityPageSrc.includes('cid=10862078652033010531') && cityPageSrc.includes('SpeakableSpecification') && cityPageSrc.includes('107206117'), 'City hub missing GBP CID, Speakable, or LinkedIn');
assert.ok(servicesPageSrc.includes('cid=10862078652033010531') && servicesPageSrc.includes('SpeakableSpecification') && servicesPageSrc.includes('107206117'), '/services missing GBP CID, Speakable, or LinkedIn');
assert.ok(servicesPageSrc.includes('id="services-aeo-summary"') && servicesPageSrc.includes('<caption'), '/services missing AEO summary ID or AIO table caption');

console.log('[PASS] All GSC Page-1 CTR & Anti-Cannibalization checks passed.');
