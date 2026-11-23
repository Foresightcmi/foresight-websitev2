import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syncNetworkClock, readGovernorCeiling } from '../lib/network-clock.mjs';

test('syncNetworkClock parses Date header into Eastern window ignoring skewed OS clock', async () => {
  const realDateHdr = 'Mon, 23 Nov 2026 16:31:31 GMT'; // 11:31 AM ET (weekday 1)
  const snap = await syncNetworkClock({
    probes: ['https://example.test'],
    fetchImpl: async () => ({ headers: { get: (k) => (k.toLowerCase() === 'date' ? realDateHdr : null) } })
  });
  assert.equal(snap.ok, true);
  assert.equal(snap.easternHour, 11);
  assert.equal(snap.easternMinute, 31);
  assert.equal(snap.easternMinutes, 691);
  assert.equal(snap.easternWeekdayNum, 1);
  assert.equal(snap.easternDateStr, '2026-11-23');
  assert.equal(snap.isDaytimeWindow, true);
  assert.equal(snap.sourceUrl, 'https://example.test');
});

test('syncNetworkClock treats Sunday evening as out of window and fails closed when probes fail', async () => {
  const nightHdr = 'Mon, 23 Nov 2026 03:20:00 GMT'; // 10:20 PM ET Sunday 2026-11-22
  const night = await syncNetworkClock({
    probes: ['https://example.test'],
    fetchImpl: async () => ({ headers: { get: () => nightHdr } })
  });
  assert.equal(night.ok, true);
  assert.equal(night.easternHour, 22);
  assert.equal(night.easternWeekdayNum, 0);
  assert.equal(night.easternDateStr, '2026-11-22');
  assert.equal(night.isDaytimeWindow, false);

  const failed = await syncNetworkClock({
    probes: ['https://bad1.test', 'https://bad2.test'],
    fetchImpl: async () => { throw new Error('offline'); }
  });
  assert.equal(failed.ok, false);
  assert.equal(failed.isDaytimeWindow, false);
});

test('readGovernorCeiling reads governor_dispatch_plan.json when present and falls back when missing', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fhi-govcap-'));
  const webRoot = path.join(tmp, 'foresight-website');
  const engRoot = path.join(tmp, 'email-campaign-engine');
  fs.mkdirSync(webRoot, { recursive: true });
  fs.mkdirSync(engRoot, { recursive: true });

  const fallback = readGovernorCeiling(webRoot, 1200);
  assert.deepEqual(fallback, { max24h: 1200, allowSend: true, reason: 'STANDALONE_DEFAULT' });

  fs.writeFileSync(path.join(engRoot, 'governor_dispatch_plan.json'), JSON.stringify({
    effective24hCeiling: 150,
    safety: { allowColdSend: true, reason: 'BOUNCE_THROTTLE' }
  }), 'utf8');
  const active = readGovernorCeiling(webRoot, 1200);
  assert.equal(active.max24h, 150);
  assert.equal(active.allowSend, true);
  assert.equal(active.reason, 'BOUNCE_THROTTLE');

  fs.rmSync(tmp, { recursive: true, force: true });
});
