#!/usr/bin/env node
/**
 * Weekly Google Business Profile Kit (no GBP API access; Chris pastes, ~10 min/week).
 * Rotates service x home-ring city by ISO week so posts never repeat for months.
 * Prices come from data/truth.json. Writes data/gbp-weekly-kit.md and pushes the post to phone.
 * Usage: node scripts/gbp-weekly-kit.mjs [--no-push]
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const truth = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'truth.json'), 'utf8')).pricing;
const services = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'services-pseo.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'cities.json'), 'utf8'));

// Map-pack-winnable ring around the verified Lithonia pin (closest first).
const HOME_RING = ['Lithonia', 'Stonecrest', 'Redan', 'Conyers', 'Stone Mountain', 'Snellville', 'Decatur', 'Tucker', 'Covington', 'Lilburn'];
const PRICE = {
  'buyer-inspection': `from ${truth.singleFamily} (${truth.condoTownhome} condos)`,
  'radon-testing': `${truth.radon} flat`,
  'sewer-scope-inspection': `${truth.sewerScope} flat`,
  'termite-inspection': `from ${truth.termiteWdoSlab} (${truth.termiteWdoCrawlspace} crawlspace)`,
  'mold-testing': `from ${truth.moldAirQuality}`,
  'pre-listing-inspection': `from ${truth.preListing}`,
  '11-month-warranty-inspection': `from ${truth.elevenMonthWarranty}`,
  'new-construction-inspection': `from ${truth.newConstruction}`,
  'pre-drywall-inspection': `from ${truth.preDrywall}`,
  'pool-inspection': `${truth.poolSpa} flat`,
  'commercial-property-inspection': 'quoted per property'
};
// Turnaround wording must match how each service actually works.
const REPORT = {
  'mold-testing': 'Accredited lab results in 24 to 48 hours',
  'radon-testing': 'Hourly radon graph delivered when the 48-hour test ends',
  'termite-inspection': 'Official Georgia wood infestation report for your lender',
  'sewer-scope-inspection': 'HD video of the full sewer line with your report'
};
// Buyer inspection every other week; specialty services fill the rest.
const ROTATION = ['buyer-inspection', 'radon-testing', 'buyer-inspection', 'sewer-scope-inspection', 'buyer-inspection', 'termite-inspection',
  'buyer-inspection', 'mold-testing', 'buyer-inspection', 'pre-listing-inspection', 'buyer-inspection', '11-month-warranty-inspection'];

function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
}

const week = isoWeek();
const svc = services.find((s) => s.slug === ROTATION[week % ROTATION.length]);
const ring = HOME_RING.map((n) => cities.find((c) => c['City Name'] === n)).filter(Boolean);
const city = ring[week % ring.length];
const name = city['City Name'];
const fill = (s) => String(s || '').replaceAll('{city}', name).replace(/\*/g, '');
const url = `https://www.fhinspectionsatl.com/services/${svc.slug}/${city.Slug}?utm_source=gbp&utm_medium=post&utm_campaign=wk${week}`;
const faq = svc.faqs?.[0];

const post = [
  `${svc.name} in ${name}, GA`,
  '',
  fill(svc.heroSub),
  '',
  `Two certified inspectors on every job, led by Christopher Boykin, Certified Master Inspector. ${REPORT[svc.slug] || 'Infrared thermal imaging included, same-day digital report'}, ${PRICE[svc.slug] || svc.price}.`,
  faq ? `\n${fill(faq.q)}\n${fill(faq.a).split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.')}` : '',
  '',
  'Call 678-480-2110 or book online.'
].join('\n').replace(/\n{3,}/g, '\n\n').trim();

const md = `# GBP Weekly Kit — Week ${week} (${new Date().toISOString().slice(0, 10)})

## 1. Post (Google Business Profile > Add update)
Button: **Book** → ${url}

\`\`\`
${post}
\`\`\`
Characters: ${post.length} / 1,500

## 2. Photos (upload 2–3 real photos from this week's jobs)
- A ${svc.name.toLowerCase()} photo from a real job (no client faces, no house numbers)
- One team photo on site (two inspectors), or a thermal/drone image
- File names like \`${svc.slug}-${city.Slug}-ga.jpg\` (helps you stay organized)

## 3. Reviews
- Reply to every new review within 24 hours. Mention the service and city naturally.
- Add each finished client to the review engine (phone intake topic in data/private/review-config.json).
`;

fs.writeFileSync(path.join(ROOT, 'data', 'gbp-weekly-kit.md'), md, 'utf8');
console.log(md);
if (!process.argv.includes('--no-push')) {
  await fetch('https://ntfy.sh/fores-antigravity-alerts-77', {
    method: 'POST',
    headers: { Title: `GBP post for week ${week}: ${svc.name} in ${name}`, Tags: 'round_pushpin', Click: url },
    body: `Paste into Google Business Profile > Add update. Button: Book > ${url}\n\n${post}`
  }).catch((e) => console.warn('ntfy push skipped:', e.message));
}
