#!/usr/bin/env node
/**
 * Pull real Census ACS 5-year housing data for home-ring cities (Verified source: api.census.gov).
 * Writes data/census-home-ring.json with source_url + retrieved_on on every row.
 * Needs CENSUS_API_KEY in .env.local. Usage: node scripts/fetch-census-home-ring.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const key = (fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').match(/^CENSUS_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!key) throw new Error('CENSUS_API_KEY missing in .env.local');

const YEAR = 2023;
// B25035 median year built; B25034 year-built buckets; B25077 median value; B25003 tenure
const VARS = ['NAME', 'B25035_001E', 'B25034_001E', 'B25034_007E', 'B25034_008E', 'B25034_009E', 'B25034_010E', 'B25034_011E', 'B25077_001E', 'B25003_001E', 'B25003_002E'];
const RING = ['Lithonia', 'Stonecrest', 'Redan', 'Conyers', 'Stone Mountain', 'Snellville', 'Decatur', 'Tucker', 'Covington', 'Lilburn'];
const url = `https://api.census.gov/data/${YEAR}/acs/acs5?get=${VARS.join(',')}&for=place:*&in=state:13&key=${key}`;

const res = await fetch(url);
if (!res.ok) throw new Error(`Census HTTP ${res.status}`);
const [hdr, ...rows] = await res.json();
const ix = Object.fromEntries(hdr.map((h, i) => [h, i]));
const num = (v) => (v == null || +v < 0 ? null : +v);
const sourceUrl = url.replace(/&key=.+$/, '');
const out = [];
for (const city of RING) {
  const row = rows.find((r) => new RegExp(`^${city} (city|CDP|town),`).test(r[ix.NAME]));
  if (!row) { out.push({ city, status: 'NOT FOUND in ACS', source_url: sourceUrl }); continue; }
  const total = num(row[ix.B25034_001E]);
  const pre1980 = ['B25034_007E', 'B25034_008E', 'B25034_009E', 'B25034_010E', 'B25034_011E'].reduce((s, v) => s + (num(row[ix[v]]) || 0), 0);
  out.push({
    city, acsName: row[ix.NAME], medianYearBuilt: num(row[ix.B25035_001E]), housingUnits: total,
    pctBuiltBefore1980: total ? +((pre1980 / total) * 100).toFixed(1) : null,
    medianHomeValue: num(row[ix.B25077_001E]),
    pctOwnerOccupied: num(row[ix.B25003_001E]) ? +((num(row[ix.B25003_002E]) / num(row[ix.B25003_001E])) * 100).toFixed(1) : null,
    source_url: sourceUrl, retrieved_on: new Date().toISOString().slice(0, 10), acsYear: `${YEAR - 4}-${YEAR} 5-year`
  });
}
fs.writeFileSync(path.join(ROOT, 'data', 'census-home-ring.json'), JSON.stringify(out, null, 2), 'utf8');
for (const o of out) console.log(o.status || `${o.city.padEnd(15)} medYearBuilt ${o.medianYearBuilt} | pre-1980 ${o.pctBuiltBefore1980}% | units ${o.housingUnits} | medValue $${o.medianHomeValue} | owner ${o.pctOwnerOccupied}%`);
