#!/usr/bin/env node
/**
 * De-cannibalize city hubs vs. /services/buyer-inspection/<city>.
 * GSC (Sep 20 - Oct 18, 2026, query x page): for "home inspection <city>" Google ranks the buyer page in
 * 78 cities vs. the hub in 33 (6,462 vs 1,338 impressions); both carried near-identical titles.
 * This makes the buyer page the single "home inspection <city>" target and turns each hub into the
 * local guide (risks + all services). Rebuilds managed GSC sentences with city-specific links.
 * Idempotent. Usage: node scripts/decannibalize-city-hubs.mjs [--dry]
 */
import fs from 'fs';
import path from 'path';
import { MANAGED_RE, INTENTS, buildSentence } from './lib/gsc-city-injector.mjs';

const DRY = process.argv.includes('--dry');
const file = path.join(process.cwd(), 'data', 'cities.json');
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));

export function hubTitle(name) {
  for (const t of [`${name}, GA Inspection Guide: Local Risks & Services`, `${name}, GA Inspection Guide & Local Risks`, `${name} GA Inspection Guide`]) {
    if (t.length <= 60) return t;
  }
  return `${name} GA Inspection Guide`.slice(0, 60);
}

export function hubDescription(name) {
  for (const d of [
    `What to check before buying in ${name}, GA: local housing risks, every inspection service we offer, and pricing. 2-inspector team, home inspections from $345.`,
    `${name}, GA local housing risks, every inspection service we offer, and pricing. 2-inspector team, home inspections from $345.`
  ]) if (d.length <= 158) return d;
  return `${name}, GA housing risks and inspection services. Home inspections from $345.`;
}

let retitled = 0;
let relinked = 0;
for (const city of cities) {
  const name = city['City Name'];
  const t = hubTitle(name);
  if (city['Meta Title'] !== t) { city['Meta Title'] = t; city['Meta Description'] = hubDescription(name); retitled++; }
  city['Title Strategy'] = 'hub-local-guide-v1';
  const html = city['Services HTML'] || '';
  const rebuilt = html.replace(MANAGED_RE, (_m, id) => buildSentence(name, INTENTS.find((i) => i.id === id), city.Slug));
  if (rebuilt !== html) { city['Services HTML'] = rebuilt; relinked++; }
}

if (!DRY) fs.writeFileSync(file, JSON.stringify(cities, null, 2), 'utf8');
console.log(`${DRY ? '[DRY] ' : ''}Hubs retitled: ${retitled}/${cities.length} | managed sentences relinked in ${relinked} hubs`);
console.log('Samples:', cities.slice(0, 3).map((c) => `${c['Meta Title']} (${c['Meta Title'].length})`).join(' || '));
const longest = cities.reduce((a, c) => (c['Meta Title'].length > a['Meta Title'].length ? c : a));
console.log('Longest:', longest['Meta Title'], longest['Meta Title'].length, '| desc max:', Math.max(...cities.map((c) => c['Meta Description'].length)));
