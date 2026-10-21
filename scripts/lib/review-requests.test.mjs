// Run: node --test scripts/lib/review-requests.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIntake, upsert, dueActions, buildEmail, buildSms } from './review-requests.mjs';

test('parses pipe intake with email, phone, city, service', () => {
  const e = parseIntake('Jane Doe | Jane@Example.com | (404) 555-1234 | Lithonia | Radon Testing');
  assert.deepEqual(e, { name: 'Jane Doe', email: 'jane@example.com', phone: '4045551234', city: 'Lithonia', service: 'radon testing' });
});

test('rejects intake with no contact method', () => {
  assert.equal(parseIntake('Jane Doe | Lithonia'), null);
});

test('dedupes by email or phone', () => {
  const q = [];
  assert.equal(upsert(q, { name: 'A', email: 'a@x.com', phone: '' }), true);
  assert.equal(upsert(q, { name: 'A2', email: 'a@x.com', phone: '4045550000' }), false);
  assert.equal(q.length, 1);
});

test('initial now, one reminder after 4 days, then nothing', () => {
  const now = new Date('2026-10-21T14:00:00Z');
  const q = [{ email: 'a@x.com', sentAt: null }];
  assert.equal(dueActions(q, now)[0].kind, 'initial');
  q[0].sentAt = '2026-10-18T14:00:00Z';
  assert.equal(dueActions(q, now).length, 0);
  q[0].sentAt = '2026-10-17T13:00:00Z';
  assert.equal(dueActions(q, now)[0].kind, 'reminder');
  q[0].reminderSentAt = now.toISOString();
  assert.equal(dueActions(q, now).length, 0);
});

test('suppressed, opted-out and reviewed clients are skipped', () => {
  const q = [{ email: 'a@x.com' }, { email: 'b@x.com', optedOut: true }, { email: 'c@x.com', reviewedAt: 'x' }];
  assert.equal(dueActions(q, new Date(), new Set(['a@x.com'])).length, 0);
});

test('copy: no asterisks, no incentive language, includes link and opt-out on SMS', () => {
  const e = { name: 'Jane Doe', city: 'Lithonia', service: 'home inspection' };
  const link = 'https://g.page/r/CaK5MZOz_FBtEBM/review';
  const mail = buildEmail(e, link, 'initial');
  const sms = buildSms(e, link, 'initial');
  for (const s of [mail.text, mail.html, sms]) {
    assert.ok(!s.includes('*'));
    assert.ok(!/discount|gift|reward|\$\d/i.test(s));
    assert.ok(s.includes(link));
  }
  assert.ok(/STOP/.test(sms));
});
