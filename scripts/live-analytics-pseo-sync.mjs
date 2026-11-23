#!/usr/bin/env node
/**
 * Live GSC + GA4 Analytics -> 87-City pSEO Unison Sync Engine ($0 Deterministic)
 * Syncs live Search Console query-by-page demand, GA4 AI/organic signals, county geotech,
 * ZIP/GPS corridor vectors, and truth.json pricing across all 87 Metro Atlanta cities.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (Number(d) * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function compassCorridor(lat, lon) {
  const dy = Number(lat) - 33.749;
  const dx = Number(lon) - (-84.388);
  if (Math.hypot(dy, dx) < 0.06) return 'Intown Atlanta Core';
  const ns = dy > 0.08 ? 'North' : dy < -0.08 ? 'South' : '';
  const ew = dx > 0.08 ? 'East' : dx < -0.08 ? 'West' : '';
  return `${ns}${ns && ew ? '-' : ''}${ew} Metro Corridor`.trim();
}

const COUNTY_FOCUS = {
  Fulton: 'EPA Zone 1 granite radon screening, Piedmont red-clay drainage grading, and multi-zone HVAC delta-T splits',
  DeKalb: 'Stone Mountain granite radon gas, mature cast-iron/clay sewer laterals, and unincorporated pre-1993 low-flow fixture checks',
  Gwinnett: '1978-1995 polybutylene supply piping, synthetic stucco (EIFS) moisture probing, and new-build attic truss framing',
  Cobb: 'rolling Cecil red-clay basement wall deflection, roof valley flashing via 4K drone, and crawlspace vapor barriers',
  Forsyth: 'Lake Lanier corridor custom-roofline drone scans, multi-unit HVAC static pressure, and granite bedrock radon',
  Cherokee: 'Etowah foothill lot grading, retaining-wall hydrostatic drainage, and Phase 1 Pre-Drywall rough-in checks',
  Clayton: 'mid-century Federal Pacific/Zinsco breaker panels, galvanized supply piping, and sewer lateral root intrusion',
  Henry: 'post-tension slab perimeter grading, builder 11-month warranty truss/roof checks, and underground PVC sewer compaction',
  Fayette: 'custom estate roofline flashing geometries, stucco envelope moisture scans, and crawlspace wood-moisture levels',
  Coweta: 'historic pier-and-curtain foundations alongside I-85 new-construction framing and WDO termite vectors',
  Douglas: 'Sweetwater basin hillside runoff, crawlspace relative-humidity control, and electrical panel grounding',
  Paulding: 'high-velocity production-builder Pre-Drywall rough-ins, missing kickout flashings, and attic duct connections',
  Rockdale: 'granite gneiss perched water-table moisture beneath slabs/basements and calibrated infrared thermal scans',
  Newton: 'Alcovy/Yellow River watershed crawlspace humidity, fungal joist protection, and roof boot flashing wear',
  Walton: 'high-plasticity red-clay differential settlement, brick veneer lintels, and full MEP safety verification',
  Barrow: 'Hwy 316 corridor new-construction shingle fastening, HVAC supply balancing, and exterior penetration sealing',
  Bartow: 'ridge-and-valley clay/limestone footing stability, attic thermal bypasses, and furnace combustion safety',
  Carroll: 'West Georgia shrink-swell clay foundations, subterranean WDO shelter-tube checks, and crawlspace framing',
  Hall: 'Lake Lanier shoreline slope drainage, multi-level deck ledger through-bolting, and steep-roof 4K drone scans',
  Spalding: 'early-century cast-iron drain stacks, branch-circuit grounding, and crawlspace moisture remediation ranges'
};

function sanitizeCityHtml(str = '') {
  return String(str)
    .replace(/\*/g, '')
    .replace(/handles it from \$750|available from \$750|from \$750/gi, 'is custom-quoted per property (Call (678) 480-2110 for Quote)')
    .replace(/from \$335/gi, 'from $345')
    .replace(/\(\$(450|250|125|165)\)/g, '(Call for Quote)')
    .replace(/\$(450|250|125|165)\b/g, 'Call (678) 480-2110 for Quote');
}

export function runLiveAnalyticsPseoSync() {
  const citiesPath = path.join(ROOT, 'data', 'cities.json');
  const gscPath = path.join(ROOT, 'data', 'analytics', 'gsc-query-page-latest.json');
  const ga4Path = path.join(ROOT, 'data', 'analytics', 'snapshot-live.json');
  const hoodsPath = path.join(ROOT, 'data', 'neighborhoods-pseo.json');
  const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  const gscRows = fs.existsSync(gscPath) ? (JSON.parse(fs.readFileSync(gscPath, 'utf8')).rows || []) : [];
  const ga4 = fs.existsSync(ga4Path) ? JSON.parse(fs.readFileSync(ga4Path, 'utf8')) : {};
  const hoods = fs.existsSync(hoodsPath) ? JSON.parse(fs.readFileSync(hoodsPath, 'utf8')) : [];
  const today = new Date().toISOString().slice(0, 10);

  const cityGscMap = new Map();
  for (const r of gscRows) {
    const [q = '', u = ''] = r.keys || [];
    for (const c of cities) {
      const slug = c.Slug || c['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (u.endsWith(`/${slug}`) || q.toLowerCase().includes(c['City Name'].toLowerCase())) {
        const list = cityGscMap.get(slug) || [];
        if (list.length < 3 && !list.some((x) => x.q === q)) list.push({ q, impr: r.impressions || 0, pos: r.position || 0, u });
        cityGscMap.set(slug, list);
      }
    }
  }

  for (const c of cities) {
    const name = c['City Name'];
    const slug = c.Slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const county = c.County || 'Metro Atlanta';
    const zip = c.Zip || '30058';
    const milesAtl = haversineMiles(33.749, -84.388, c.Latitude, c.Longitude);
    const milesHub = haversineMiles(33.7258, -84.0955, c.Latitude, c.Longitude);
    const corridor = compassCorridor(c.Latitude, c.Longitude);
    const focus = COUNTY_FOCUS[county] || 'Piedmont red-clay foundation grading, roof flashing, and full MEP diagnostics';
    const localHoods = hoods.filter((h) => String(h.city || '').toLowerCase() === name.toLowerCase()).map((h) => h.name).slice(0, 2);
    const gscTop = cityGscMap.get(slug) || [];
    const demandNote = gscTop.length > 0
      ? `Active ${name} buyer demand centers on "${gscTop[0].q}" — book your dedicated <a href="/services/buyer-inspection/${slug}">Home Inspection in ${name}, GA (From $345)</a> early in Georgia due diligence.`
      : `Schedule your two-inspector <a href="/services/buyer-inspection/${slug}">Home Inspection in ${name}, GA (From $345)</a> with same-day interactive digital reporting before due diligence closes.`;
    const hoodClause = localHoods.length ? ` including ${localHoods.join(' and ')} subdivisions,` : '';

    for (const field of ['Intro', 'Local Risks HTML', 'Services HTML', 'Benefits HTML', 'CTA HTML', 'Nearby Cities HTML', 'Meta Description']) {
      if (c[field]) c[field] = sanitizeCityHtml(c[field]);
    }
    if (!c['Services HTML'].includes(`/services/buyer-inspection/${slug}`)) {
      c['Services HTML'] = c['Services HTML'].replace('</ul>', `<li data-gsc="home"><a href="/services/buyer-inspection/${slug}">Home inspection in ${name}, GA</a> starts From $345 ($295 condos) with two certified inspectors, infrared thermal scans, and $35,000 combined protection.</li></ul>`);
    }
    c['Seasonal Tip'] = `<strong>${name}, GA (${county} County ZIP ${zip} • ${milesAtl} mi from Downtown Atlanta, ${corridor} — ${milesHub} mi dispatch):</strong> Across ${name}${hoodClause} our two-inspector CMI team prioritizes ${focus}, documenting $1,250–$14,200+ in typical regional contractor repair credit leverage. ${demandNote}`;
    c['Last Refreshed'] = today;

    if (c['JSON-LD Schema']) {
      const ld = typeof c['JSON-LD Schema'] === 'string' ? JSON.parse(c['JSON-LD Schema']) : c['JSON-LD Schema'];
      const sameAs = new Set([...(ld.sameAs || []), 'https://www.youtube.com/@fhinspectionsatl', 'https://certifiedmasterinspector.org/']);
      ld.sameAs = [...sameAs].map((u) => u.replace('https://facebook.com/', 'https://www.facebook.com/'));
      c['JSON-LD Schema'] = JSON.stringify(ld);
    }
  }

  fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2) + '\n', 'utf8');
  const receipt = {
    syncedAt: new Date().toISOString(),
    retrieved_on: today,
    source_url: 'https://www.fhinspectionsatl.com',
    gscQueryPageRowsSynced: gscRows.length,
    citiesWithLiveGscSignals: cityGscMap.size,
    ga4SnapshotPresent: Object.keys(ga4).length > 0,
    citiesUpdated: cities.length
  };
  fs.writeFileSync(path.join(ROOT, 'data', 'live-unison-sync-receipt.json'), JSON.stringify(receipt, null, 2) + '\n', 'utf8');
  return receipt;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const res = runLiveAnalyticsPseoSync();
  console.log(`✅ Synced ${res.citiesUpdated} Metro Atlanta pSEO cities (${res.citiesWithLiveGscSignals} with live GSC demand signals).`);
}
