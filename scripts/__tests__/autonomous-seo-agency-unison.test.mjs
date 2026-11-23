import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '..', '..');
const AGENCY = path.resolve(WEB, '..', 'foresight-promotion-agency');

test('[1] llms.txt, llms-full.txt & FAQ hide SAB street address, strip HomeGauge/asterisks & disambiguate FH brand', () => {
  const llms = fs.readFileSync(path.join(WEB, 'public', 'llms.txt'), 'utf8');
  const full = fs.readFileSync(path.join(WEB, 'public', 'llms-full.txt'), 'utf8');
  const faq = fs.readFileSync(path.join(WEB, 'app', 'faq', 'page.js'), 'utf8');
  const calc = fs.readFileSync(path.join(WEB, 'app', 'repair-credit-calculator', 'page.js'), 'utf8');

  assert.ok(!/1816\s+s(outh)?\s+deshon/i.test(llms), 'llms.txt must not expose SAB street address');
  assert.ok(!/1816\s+s(outh)?\s+deshon/i.test(full), 'llms-full.txt must not expose SAB street address');
  assert.equal((llms.match(/\*/g) || []).length, 0, 'llms.txt must contain zero asterisks');
  assert.equal((full.match(/\*/g) || []).length, 0, 'llms-full.txt must contain zero asterisks');
  assert.ok(!/homegauge/i.test(full), 'llms-full.txt must not contain HomeGauge');
  assert.ok(!/homegauge/i.test(faq), 'app/faq/page.js must not render HomeGauge in visible copy');
  assert.ok(!/\$99\b/.test(calc), 'repair-credit-calculator must not show retired $99 flat fee');
  assert.ok(/Full House Inspections/i.test(llms) && /Full House Inspections/i.test(full), 'Entity disambiguation required');
});

test('[2] Core hubs render #aeo-direct-answer, non-frozen <title> <=60 chars, RSL 1.0 & CSP-Report-Only', () => {
  for (const rel of ['app/quote/page.js', 'app/repair-credit-calculator/page.js', 'app/compare/page.js', 'app/faq/page.js']) {
    const src = fs.readFileSync(path.join(WEB, rel), 'utf8');
    assert.ok(src.includes('id="aeo-direct-answer"'), `${rel} missing #aeo-direct-answer`);
  }
  for (const rel of ['app/quote/page.js', 'app/compare/page.js', 'app/about/christopher-boykin/page.js']) {
    const src = fs.readFileSync(path.join(WEB, rel), 'utf8');
    const m = src.match(/absolute:\s*['"]([^'"]+)['"]/);
    assert.ok(m && m[1].length <= 60, `${rel} must use absolute title <=60 chars (got: ${m?.[1]})`);
  }
  assert.ok(fs.readFileSync(path.join(WEB, 'app/quote/page.js'), 'utf8').includes('From $345'));
  assert.ok(fs.existsSync(path.join(WEB, 'public', 'rsl.xml')), 'public/rsl.xml must exist');
  assert.ok(fs.readFileSync(path.join(WEB, 'next.config.mjs'), 'utf8').includes('Content-Security-Policy-Report-Only'));
  assert.ok(fs.readFileSync(path.join(WEB, 'app/layout.js'), 'utf8').includes('https://www.youtube.com/@fhinspectionsatl'));
  assert.ok(fs.readFileSync(path.join(WEB, 'scripts/source-map-citation-dispatcher.mjs'), 'utf8').includes('foresighthomeinspections2026'));
});

test('[3] 87-city pSEO database has zero stale prices, YouTube sameAs & unique non-boilerplate telemetry', () => {
  const cities = JSON.parse(fs.readFileSync(path.join(WEB, 'data', 'cities.json'), 'utf8'));
  assert.equal(cities.length, 87);
  const tipCounts = new Map();
  for (const c of cities) {
    const raw = JSON.stringify(c);
    assert.ok(!/(\$750|\$335|\$450|\$250|\$125|\$165)\b/.test(raw), `Stale price in ${c['City Name']}`);
    assert.ok(String(c['JSON-LD Schema'] || '').includes('youtube.com/@fhinspectionsatl'), `${c['City Name']} schema missing YouTube sameAs`);
    const normTip = String(c['Seasonal Tip'] || '').replaceAll(c['City Name'], '{CITY}');
    tipCounts.set(normTip, (tipCounts.get(normTip) || 0) + 1);
  }
  const maxDup = Math.max(...tipCounts.values());
  assert.ok(maxDup <= 2, `City Seasonal Tip boilerplate repeated ${maxDup} times across 87 cities`);
});

test('[4] FTC 16 CFR 465.2 compliance: zero synthetic Marcus Vance/Sarah Jenkins reviews or physical shipping on services', () => {
  const sc = fs.readFileSync(path.join(WEB, 'app/services/[service]/[city]/page.js'), 'utf8');
  const ct = fs.readFileSync(path.join(WEB, 'app/service-areas/[city]/page.js'), 'utf8');
  assert.ok(!/Marcus Vance|Sarah Jenkins/.test(sc) && !/Marcus Vance|Sarah Jenkins/.test(ct));
  assert.ok(!sc.includes('buildServiceCityOfferSchema(serviceData, canonicalUrl, cityName, true)'));
});

test('[5] Unison automation: Email fallback on offline OpenSMS, PR dispatcher, GSC->GBP sync & outcome health monitor', () => {
  const rev = fs.readFileSync(path.join(WEB, 'scripts/review-request-engine.mjs'), 'utf8');
  assert.ok(rev.includes('email_past_client_fallback'), 'review-request-engine must support email fallback when OpenSMS offline');
  assert.ok(fs.existsSync(path.join(WEB, 'scripts/live-analytics-pseo-sync.mjs')), 'live-analytics-pseo-sync.mjs must exist');
  assert.ok(fs.existsSync(path.join(WEB, 'scripts/autonomous-pr-citation-dispatcher.mjs')), 'autonomous-pr-citation-dispatcher.mjs must exist');
  const cos = fs.readFileSync(path.join(AGENCY, 'src/chief-of-staff.mjs'), 'utf8');
  assert.ok(cos.includes('striking-distance-queue.json') && /generateLocalizedGbpPosts\([^)]+\)/.test(cos), 'chief-of-staff must feed GSC striking queries into GBP posts');
  const mon = fs.readFileSync(path.join(AGENCY, 'src/system-health-monitor.mjs'), 'utf8');
  assert.ok(mon.includes('seoUnisonHealthy'), 'system-health-monitor must verify SEO/GEO unison outcome receipts');
});
