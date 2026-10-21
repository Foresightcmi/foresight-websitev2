// Run: node --test scripts/lib/gsc-city-injector.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { detectIntent, applyQueryToCity, buildSentence, managedIntents, matchCity } from './gsc-city-injector.mjs';

const legacy = '<ul><li>Dock evaluations</li><li>Certified <strong>home inspection acworth ga</strong> and full residential property diagnostics ($345+ homes, $450 flat-rate sewer camera scope, 2-inspector CMI team)</li><li>Certified <strong>home inspector in acworth, ga</strong> and full residential property diagnostics ($345+ homes, $450 flat-rate sewer camera scope, 2-inspector CMI team)</li></ul>';

test('intent detection maps services to correct truth.json pricing', () => {
  assert.equal(detectIntent('indoor air quality testing service college park').price, 'from $450');
  assert.equal(detectIntent('dallas pre drywall inspection').id, 'predrywall');
  assert.equal(detectIntent('radon testing decatur').price, 'a $250 flat rate');
  assert.equal(detectIntent('home inspector in acworth, ga').id, 'home');
});

test('legacy duplicate bullets collapse into one natural sentence', () => {
  const city = { 'City Name': 'Acworth', 'Services HTML': legacy, 'Meta Title': 'Keep Me' };
  applyQueryToCity(city, 'home inspection acworth ga');
  applyQueryToCity(city, 'home inspector in acworth, ga');
  assert.equal((city['Services HTML'].match(/<li/g) || []).length, 2);
  assert.deepEqual(managedIntents(city['Services HTML']), ['home']);
  assert.ok(!/Certified <strong>/.test(city['Services HTML']));
  assert.equal(city['Meta Title'], 'Keep Me');
});

test('caps managed sentences per city at 2', () => {
  const city = { 'City Name': 'Tucker', 'Services HTML': '<ul></ul>' };
  for (const q of ['home inspection tucker ga', 'radon tucker', 'sewer scope tucker', 'pool inspection tucker']) applyQueryToCity(city, q);
  assert.equal(managedIntents(city['Services HTML']).length, 2);
});

test('manual override hubs are never touched', () => {
  const city = { 'City Name': 'Lithonia', 'Services HTML': '<ul></ul>', 'Manual Override': true };
  assert.equal(applyQueryToCity(city, 'home inspection lithonia ga'), false);
});

test('sentence has no asterisks and links the service page', () => {
  const s = buildSentence('College Park', detectIntent('indoor air quality testing'));
  assert.ok(!s.includes('*'));
  assert.ok(s.includes('href="/services/mold-testing"'));
});

test('city matching uses whole words and prefers the longest name', () => {
  const cities = [{ 'City Name': 'Peachtree City' }, { 'City Name': 'Peachtree Corners' }, { 'City Name': 'Lithonia' }];
  assert.equal(matchCity('commercial inspections peachtree corners ga', cities)['City Name'], 'Peachtree Corners');
  assert.equal(matchCity('home inspection near me', cities), undefined);
});
