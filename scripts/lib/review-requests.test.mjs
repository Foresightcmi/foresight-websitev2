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

import {
  normalizeAddressKey,
  parseCancelIntake,
  buildCanceledIndex,
  isCanceledEntry,
  reconcileQueueCancellations
} from './review-requests.mjs';
import {
  parseHomeGaugeNotificationEmail,
  parseHomeGaugeCancellationEmail,
  parseHomeGaugeCsv
} from './homegauge-intake.mjs';

test('rejects pre-inspection, agreement, deposit, bounce, guide, BuildFax, and REP view emails', () => {
  const nonCompletedSamples = [
    ['Online Appointment Requested for Oct 26, 2026 - 100 Sample Oak Dr', 'Customer jane@example.com requested Oct 26'],
    ['Inspection Scheduled for Oct 27, 2026 - 200 Sample Pine Ave', 'Scheduled for Alex Buyer alex@example.com'],
    ['Agreement Signed: FORESIGHT BASIC HOME INSPECTION AGREEMENT for 100 Sample Oak Dr', 'FORESIGHT BASIC HOME INSPECTION AGREEMENT uploaded on Oct 25 2026 for 100 Sample Oak Dr has been agreed to by Jane Buyer jane@example.com'],
    ['Payment Received: 200 Sample Pine Ave', 'A payment of $155.00 was made by CUSTOMER A Buyer / alex@example.com Non-refundable deposit'],
    ['Error Sending Email: Your WDO/Termite Inspection has been Scheduled - Action Required', 'Hello from HomeGauge! Intended Recipient: typo.buyer@example.com Cause of failure: 550 5.1.1'],
    ['Home Inspection Peace of Mind Guide - FHI for 200 Sample Pine Ave', 'Home Inspection Peace of Mind Guide - FHI uploaded on 2026-10-27 for 200 Sample Pine Ave has been viewed by Customer Alex Buyer/alex@example.com'],
    ['BuildFax Report: 200 Sample Pine Ave for 200 Sample Pine Ave Viewed', 'BuildFax Report: 200 Sample Pine Ave uploaded on 2026-10-27 for 200 Sample Pine Ave has been viewed by Customer Alex Buyer/alex@example.com'],
    ['Inspection Report for 200 Sample Pine Ave Viewed', 'Dear CHRISTOPHER, Inspection Report uploaded on 2026-10-27 for 200 Sample Pine Ave has been viewed by REP Sample Agent/agent@example.com'],
    ['Inspection Canceled for Oct 30, 2026 - 900 Sample Cancel Rd', 'Home Inspection Canceled! Customer(s) Pat Cancel pat.cancel@example.com Mobile: (770 )555-0199']
  ];
  for (const [subj, body] of nonCompletedSamples) {
    assert.equal(parseHomeGaugeNotificationEmail(body, subj), null, `Must reject: ${subj}`);
  }
});

test('accepts genuine completed Inspection Report Viewed by Customer and extracts full human name', () => {
  const subj = 'Inspection Report for 200 Sample Pine Ave Viewed';
  const body = 'Dear CHRISTOPHER, Inspection Report uploaded on 2026-10-27 17:15:27 EDT for 200 Sample Pine Ave has been viewed by Customer Alex Buyer/alex@example.com You can turn off these notifications.';
  const job = parseHomeGaugeNotificationEmail(body, subj);
  assert.ok(job, 'Expected completed report notification to parse');
  assert.equal(job.name, 'Alex Buyer');
  assert.equal(job.email, 'alex@example.com');
  assert.equal(job.address, '200 Sample Pine Ave');
  assert.equal(job.completionVerified, true);
});

test('extracts cancellation details from HomeGauge Inspection Canceled email (including spaced area code)', () => {
  const subj = 'Inspection Canceled for Oct 30, 2026 - 900 Sample Cancel Rd';
  const body = 'Home Inspection Canceled! Oct 30, 2026 at 2:00 PM 900 Sample Cancel Rd, Sample Plaza, Hampton, GA 30228 Directions: Customer(s) Pat Cancel (PatCancel172) pat.cancel@example.com Mobile: (770 )555-0199 Real Estate Professional(s) Service Price INDOOR AIR QUALITY TESTING $800.00 Report ID: 20261030-900-Sample-Cancel-Rd';
  const c = parseHomeGaugeCancellationEmail(body, subj, 'Fri, 30 Oct 2026 12:54:54 +0000');
  assert.ok(c);
  assert.equal(c.email, 'pat.cancel@example.com');
  assert.equal(c.phone, '7705550199');
  assert.equal(normalizeAddressKey(c.address), '900 sample cancel rd');
  assert.equal(c.reportId, '20261030-900-Sample-Cancel-Rd');
});

test('blocks CSV rows that are canceled, unuploaded, or scheduled in the future', () => {
  const csv = [
    'Report ID,Date,Address,City,Services,Status,Uploaded,Customer',
    'R1,2026-10-25,100 Main St,Atlanta,Home Inspection,Completed,Yes,"Alice Smith alice@example.com 404-555-1111"',
    'R2,2026-10-25,200 Oak Ave,Atlanta,Home Inspection,Canceled,No,"Bob Cancel bob@example.com 404-555-2222"',
    'R3,2026-10-25,300 Pine Rd,Atlanta,Home Inspection,Scheduled,No,"Carl Pending carl@example.com 404-555-3333"',
    'R4,2099-12-31,400 Future Blvd,Atlanta,Home Inspection,Active,Yes,"Dana Future dana@example.com 404-555-4444"'
  ].join('\n');
  const jobs = parseHomeGaugeCsv(csv);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].email, 'alice@example.com');
});

test('retroactively revokes queued clients (initial and reminder) when canceled by email, phone, or address', () => {
  const cancellations = [
    { email: 'pat.cancel@example.com', phone: '7705550199', address: '900 Sample Cancel Rd', reportId: '20261030-900-Sample-Cancel-Rd', canceledAt: '2026-10-30T12:54:54.000Z' },
    { email: '', phone: '', address: '500 Sample Green Dr SW', canceledAt: '2026-10-06T12:00:00.000Z' }
  ];
  const idx = buildCanceledIndex(cancellations);
  const queue = [
    { id: '1', name: 'Pat Cancel', email: 'pat.cancel@example.com', phone: '', address: '', addedAt: '2026-10-29T20:25:00Z', sentAt: null },
    { id: '2', name: 'Sample Buyer', email: 'buyer2@example.com', phone: '', address: '500 Sample Green Dr SW, Atlanta, GA', addedAt: '2026-10-05T10:00:00Z', sentAt: '2026-10-05T15:00:00Z', reminderSentAt: null },
    { id: '3', name: 'Alex Buyer', email: 'alex@example.com', phone: '', address: '200 Sample Pine Ave', completionVerified: true, addedAt: '2026-10-28T13:00:00Z', sentAt: null }
  ];
  const revoked = reconcileQueueCancellations(queue, cancellations);
  assert.equal(revoked.length, 2);
  assert.ok(queue[0].canceledAt);
  assert.ok(queue[1].canceledAt);
  assert.equal(isCanceledEntry(queue[2], idx), false);
  const due = dueActions(queue, new Date('2026-10-30T15:00:00Z'), new Set(), idx);
  assert.equal(due.length, 1);
  assert.equal(due[0].entry.email, 'alex@example.com');
  assert.ok(parseCancelIntake('CANCEL: 900 Sample Cancel Rd | pat.cancel@example.com'));
});
