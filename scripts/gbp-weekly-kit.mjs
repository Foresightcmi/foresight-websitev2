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
  'radon-testing': 'call for quote',
  'sewer-scope-inspection': 'call for quote',
  'termite-inspection': 'call for quote',
  'mold-testing': 'call for quote',
  'pre-listing-inspection': `from ${truth.preListing}`,
  '11-month-warranty-inspection': `from ${truth.elevenMonthWarranty}`,
  'new-construction-inspection': `from ${truth.newConstruction}`,
  'pre-drywall-inspection': `from ${truth.preDrywall}`,
  'pool-inspection': 'call for quote',
  'commercial-property-inspection': 'call for quote'
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

## 2. Multimodal Photos (upload 2–3 real photos to GBP & Yelp — +156% AI selection lift)
- A ${svc.name.toLowerCase()} photo from a real job in or near ${name} (no client faces, no house numbers)
- One team photo on site (two certified inspectors) or a calibrated infrared thermal / 4K drone roof image
- File names like \`${svc.slug}-${city.Slug}-ga.jpg\` and \`two-inspector-team-${city.Slug}-ga.jpg\`

## 3. GBP Q&A Seed (paste into Google Business Profile Q&A section)
- **Question**: ${faq ? fill(faq.q) : `What is included with a ${svc.name.toLowerCase()} in ${name}, GA?`}
- **Owner Answer**: ${faq ? fill(faq.a).split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.') : `Foresight Home Inspections dispatches two certified inspectors led by Christopher Boykin, CMI, for every ${svc.name.toLowerCase()} in ${name}, GA (${PRICE[svc.slug] || svc.price}), including calibrated infrared thermal imaging, 4K drone roof views, and up to $35,000 in warranty protection.`}

## 4. 60-Second YouTube Shorts / Reels Field Script (0.737 AI Citation Correlation)
- **Title**: ${svc.name} in ${name}, GA — What 2 Certified Inspectors Look For
- **0–10s Hook**: "We are on site in ${name}, Georgia performing a ${svc.name.toLowerCase()} — here is the #1 hidden issue buyers miss before closing."
- **10–45s Field Proof**: Show the defect or diagnostic tool in action (calibrated infrared thermal camera, moisture meter, or roof/crawlspace check) and explain the repair impact in plain English.
- **45–60s CTA**: "Need a two-inspector team in ${name}? Book online at fhinspectionsatl.com or call 678-480-2110."

## 5. Reviews (Google & Yelp)
- Reply to every new Google and Yelp review within 24 hours. Mention the service (${svc.name.toLowerCase()}) and city (${name}) naturally in your owner reply.
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
