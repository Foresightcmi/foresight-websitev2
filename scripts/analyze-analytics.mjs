import fs from 'fs';
import path from 'path';

const gsc = JSON.parse(fs.readFileSync(path.resolve('./data/analytics/gsc-snapshot-latest.json'), 'utf8'));
const ga4 = JSON.parse(fs.readFileSync(path.resolve('./data/analytics/snapshot-live.json'), 'utf8'));

console.log('=== GSC METRICS ===');
const queries = gsc.queries || [];
console.log('Total GSC queries tracked:', queries.length);

const byImp = [...queries].sort((a,b) => b.impressions - a.impressions);
console.log('\nAll 50 GSC Queries by Impressions:');
byImp.forEach((q, i) => {
  console.log(`  ${i+1}. "${q.keys[0]}": ${q.impressions} imp, ${q.clicks} clicks, pos ${q.position.toFixed(1)}, CTR: ${(q.ctr*100).toFixed(1)}%`);
});

const striking = queries.filter(q => q.position >= 4 && q.position <= 20 && q.impressions >= 2)
  .sort((a,b) => b.impressions - a.impressions);
console.log('\nStriking Distance (Pos 4-20, imp >= 2):');
striking.forEach(q => {
  console.log(`  "${q.keys[0]}": ${q.impressions} imp, ${q.clicks} clicks, pos ${q.position.toFixed(1)}`);
});

console.log('\n=== GA4 TOP PAGES ===');
(ga4.topPages?.rows || []).slice(0, 15).forEach(r => {
  const views = Number(r.metricValues[0].value);
  const users = Number(r.metricValues[1].value);
  const engSec = Number(r.metricValues[2].value);
  const avgEng = users > 0 ? (engSec / users).toFixed(0) : '0';
  console.log(`  ${r.dimensionValues[1].value} [${views} views, ${users} users, avg ${avgEng}s] - "${r.dimensionValues[0].value}"`);
});

console.log('\n=== GA4 CHANNELS ===');
(ga4.channels?.rows || []).forEach(r => {
  console.log(`  ${r.dimensionValues[0].value} (${r.dimensionValues[1].value}): ${r.metricValues[0].value} sessions, ${r.metricValues[1].value} users, ${r.metricValues[2].value} pvs`);
});
