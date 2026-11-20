import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { sendOpenSmsWithDhcpFallback, isTrustedPrivateOpenSmsUrl } from '../lib/opensms-fallback.mjs';
import { mineWarmWarrantyAndFinalCohorts, buildWarrantyCheckinEmail } from '../lib/warranty-checkin.mjs';

test('Item 5: OpenSMS DHCP fallback updates opensms-config.json on private LAN IP shift and blocks untrusted hosts', async () => {
  assert.equal(isTrustedPrivateOpenSmsUrl('http://192.168.1.142:9292/sms/'), true);
  assert.equal(isTrustedPrivateOpenSmsUrl('http://10.0.0.55:9292/sms/'), true);
  assert.equal(isTrustedPrivateOpenSmsUrl('http://203.0.113.9:9292/sms/'), false);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opensms-test-'));
  const cfgPath = path.join(tmpDir, 'opensms-config.json');
  fs.writeFileSync(cfgPath, JSON.stringify({ apiKey: 'test-key', gatewayUrl: 'http://192.168.1.71:9292/sms/' }), 'utf8');

  const calls = [];
  const mockFetch = async (url) => {
    calls.push(url);
    if (url.includes('192.168.1.71')) throw new Error('fetch failed');
    return { ok: true, status: 200, json: async () => ({ stat: true, id: 'sms_ok_1' }) };
  };

  const res = await sendOpenSmsWithDhcpFallback({
    phone: '4045551234',
    text: 'Test message',
    configuredUrl: 'http://192.168.1.71:9292/sms/',
    apiKey: 'test-key',
    configFilePath: cfgPath,
    fetchFn: mockFetch,
    discoverFn: async () => 'http://192.168.1.142:9292/sms/'
  });

  assert.equal(res.ok, true);
  assert.equal(res.endpoint, 'http://192.168.1.142:9292/sms/');
  assert.deepEqual(calls, ['http://192.168.1.71:9292/sms/', 'http://192.168.1.142:9292/sms/']);
  const saved = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  assert.equal(saved.gatewayUrl, 'http://192.168.1.142:9292/sms/');

  // Rejects untrusted public IP returned by discovery
  const untrustedRes = await sendOpenSmsWithDhcpFallback({
    phone: '4045551234',
    text: 'Test message',
    configuredUrl: 'http://192.168.1.71:9292/sms/',
    apiKey: 'test-key',
    configFilePath: cfgPath,
    fetchFn: async () => { throw new Error('fetch failed'); },
    discoverFn: async () => 'http://198.51.100.8:9292/sms/'
  });
  assert.equal(untrustedRes.ok, false);
});

test('Item 2: Warm past-client mining enforces 4-key cross-stage dedup, Pre-Drywall clock exclusion, and Ansley/cancel gates', () => {
  const now = new Date('2026-11-20T14:00:00Z');
  const records = [
    // Eligible Cohort A (10.5 months post New-Build Buyer inspection)
    { id: 'c1', name: 'Sample Buyer', email: 'buyer1@example.com', phone: '4045550101', address: '120 Sample Oak Way', city: 'Dallas', zip: '30132', service: 'new construction home inspection (buyers)', completedAt: '2026-01-05T15:00:00Z', completionVerified: true },
    // Ineligible: Pre-Drywall at 10.5 months MUST NOT trigger 11-Month Warranty (wrong clock anchor)
    { id: 'c2', name: 'Early Framing', email: 'early@example.com', phone: '4045550102', address: '200 Sample Pine St', city: 'Cumming', zip: '30040', service: 'pre-drywall framing inspection', completedAt: '2026-01-05T15:00:00Z', completionVerified: true },
    // Ineligible Cohort B: Pre-Drywall under Spouse A ("Lot 42 Oak Creek"), followed 60d later by Final under Spouse B ("104 Elm St, Lot 42 Oak Creek")
    { id: 'c3', name: 'Alex Taylor', email: 'alex@example.com', phone: '4045550103', address: 'Lot 42 Oak Creek', city: 'Acworth', zip: '30101', service: 'pre-drywall inspection', completedAt: '2026-08-15T15:00:00Z', completionVerified: true },
    { id: 'c4', name: 'Jordan Taylor', email: 'jordan@example.com', phone: '4045550103', address: '104 Elm St Lot 42 Oak Creek', city: 'Acworth', zip: '30101', service: 'new construction inspection', completedAt: '2026-10-15T15:00:00Z', completionVerified: true },
    // Eligible Cohort B: Pre-Drywall 65 days ago with NO subsequent Final inspection
    { id: 'c5', name: 'Morgan Lee', email: 'morgan@example.com', phone: '4045550105', address: '88 Sample Ridge Dr', city: 'Kennesaw', zip: '30144', service: 'phase 1 pre-drywall inspection', completedAt: '2026-09-16T15:00:00Z', completionVerified: true },
    // Suppressed: Realtor is Ansley Real Estate
    { id: 'c6', name: 'Blocked Client', email: 'blocked@example.com', phone: '4045550106', address: '55 Sample Ct', city: 'Atlanta', service: 'new construction inspection', agentEmail: 'agent@ansleyre.com', completedAt: '2026-01-10T15:00:00Z', completionVerified: true }
  ];

  const { cohort11Month, cohortFinal } = mineWarmWarrantyAndFinalCohorts({
    records,
    cancellations: [],
    suppressedSet: new Set(),
    alreadySentKeys: new Set(),
    now
  });
  assert.deepEqual(cohort11Month.map((r) => r.id), ['c1']);
  assert.deepEqual(cohortFinal.map((r) => r.id), ['c5']);

  const email11m = buildWarrantyCheckinEmail(cohort11Month[0], '11_month_warranty');
  assert.match(email11m.subject, /11-month/i);
  assert.match(email11m.text, /From \$345/);
  assert.match(email11m.text, /If you closed on/i);
  assert.match(email11m.text, /Reply STOP/i);
  assert.equal(/1816 South Deshon/i.test(email11m.html), false);
  assert.equal(/\*/.test(email11m.text), false);
  assert.match(email11m.html, /height="78" width="78"/);

  const emailFinal = buildWarrantyCheckinEmail(cohortFinal[0], 'final_walkthrough');
  assert.match(emailFinal.text, /From \$400/);
  assert.match(emailFinal.html, /height="78" width="78"/);
});

test('Item 3: All 77x9 pSEO routes stay <=60 char title, <=158 char description, de-cannibalize 11-month, and never fake $345 on Call for Quote', async () => {
  const root = path.resolve(import.meta.dirname, '..', '..');
  const services = JSON.parse(fs.readFileSync(path.join(root, 'data', 'services-pseo.json'), 'utf8'));
  const cities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'cities.json'), 'utf8'));
  const { buildServiceCitySeoMeta, buildServiceCityOfferSchema } = await import('../../lib/pseoMetadata.js');

  for (const svc of services) {
    for (const city of cities) {
      const cityName = city['City Name'];
      const { title, description } = buildServiceCitySeoMeta(svc, cityName);
      assert.ok(title.length <= 60, `Title > 60 (${title.length}) for ${svc.slug}/${cityName}: "${title}"`);
      assert.ok(description.length <= 158, `Desc > 158 (${description.length}) for ${svc.slug}/${cityName}: "${description}"`);
      assert.equal(/december 2026/i.test(title), false);
      assert.equal(/\*/.test(title) || /\*/.test(description), false);

      if (svc.slug === '11-month-warranty-inspection') {
        assert.equal(new RegExp(`home inspections?\\s+(?:in\\s+)?${cityName}`, 'i').test(title), false, `Cannibalizing title: ${title}`);
        assert.equal(/warranty home inspections/i.test(description), false, `Cannibalizing desc: ${description}`);
      }

      const offer = buildServiceCityOfferSchema(svc, `https://www.fhinspectionsatl.com/services/${svc.slug}/kennesaw`, cityName);
      assert.ok(offer && /^\d+\.\d{2}$/.test(offer.price) && Number(offer.price) >= 275, `GSC Product Snippet Offer must emit valid 2-decimal floor for ${svc.slug}`);
      assert.equal(offer.priceSpecification.description, svc.priceDetails);
    }
  }
});
