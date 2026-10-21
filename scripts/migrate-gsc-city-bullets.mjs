#!/usr/bin/env node
/**
 * One-time migration: collapse legacy "Certified <strong>phrase</strong> and full residential..."
 * bullets in data/cities.json into deduplicated, natural, correctly priced sentences.
 * Usage: node scripts/migrate-gsc-city-bullets.mjs [--dry]
 */
import fs from 'fs';
import path from 'path';
import { LEGACY_BULLET_RE, applyQueryToCity, stripLegacy, managedIntents } from './lib/gsc-city-injector.mjs';

const DRY = process.argv.includes('--dry');
const file = path.join(process.cwd(), 'data', 'cities.json');
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));

let touched = 0;
let removed = 0;
for (const city of cities) {
  const html = city['Services HTML'] || '';
  const legacy = html.match(LEGACY_BULLET_RE) || [];
  if (!legacy.length) continue;
  const phrases = legacy.map((b) => b.match(/<strong>([^<]+)<\/strong>/)[1]);
  city['Services HTML'] = stripLegacy(html);
  for (const p of phrases) applyQueryToCity(city, p);
  removed += legacy.length;
  touched++;
  console.log(`${city['City Name']}: ${legacy.length} legacy -> [${managedIntents(city['Services HTML']).join(', ')}]`);
}

if (!DRY) fs.writeFileSync(file, JSON.stringify(cities, null, 2), 'utf8');
console.log(`\n${DRY ? '[DRY RUN] ' : ''}Cities cleaned: ${touched} | legacy bullets removed: ${removed}`);
