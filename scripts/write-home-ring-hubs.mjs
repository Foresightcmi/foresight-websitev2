#!/usr/bin/env node
/**
 * Home-ring hub content from real Census ACS data (data/census-home-ring.json).
 * Every number printed on a page comes from that file; building-science statements are general
 * inspection knowledge and are worded as "commonly", never as city-specific measurements.
 * Marks hubs "Manual Override" so the daily GSC injector leaves them alone. Idempotent.
 * Usage: node scripts/write-home-ring-hubs.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const citiesFile = path.join(ROOT, 'data', 'cities.json');
const cities = JSON.parse(fs.readFileSync(citiesFile, 'utf8'));
const census = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'census-home-ring.json'), 'utf8')).map((r) => [r.city, r]));
const LITHONIA_POP = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'census-dekalb-places.json'), 'utf8')).find((p) => p.name === 'Lithonia city, Georgia').population;
const money = (n) => `$${Number(n).toLocaleString('en-US')}`;
const nf = (n) => Number(n).toLocaleString('en-US');
const link = (href, text) => `<a href="${href}">${text}</a>`;

const SOURCE = (c) => `<p style="font-size:0.85rem;opacity:0.8">Source: U.S. Census Bureau, American Community Survey ${c.acsYear} estimates for ${c.acsName.replace(', Georgia', ', GA')} (tables B25034, B25035, B25077, B25003), retrieved ${c.retrieved_on}.</p>`;

const FACTS = (c) => `<ul><li>Median year homes were built: <strong>${c.medianYearBuilt}</strong></li><li>Homes built before 1980: <strong>${c.pctBuiltBefore1980}%</strong> of ${nf(c.housingUnits)} housing units</li><li>Median home value: <strong>${money(c.medianHomeValue)}</strong></li><li>Owner-occupied homes: <strong>${c.pctOwnerOccupied}%</strong></li></ul>`;

const ANGLES = {
  Lithonia: (c) => ({
    intro: `Lithonia is where our team is based. The figures on this page describe the City of Lithonia itself (population ${nf(LITHONIA_POP)}), and many addresses with a Lithonia mailing address are actually in unincorporated DeKalb, Stonecrest or Redan. Inside the city, the median home was built in ${c.medianYearBuilt}, ${c.pctBuiltBefore1980}% of homes predate 1980, and only ${c.pctOwnerOccupied}% are owner-occupied, so many buyers are investors purchasing rental houses. We inspect Lithonia-area homes with that age, and that buyer, in mind.`,
    risks: `<p>At a median build year of ${c.medianYearBuilt}, the typical Lithonia house has original or partly updated systems. Federal lead-paint rules took effect in 1978, so any home built before then deserves a paint question. Original electrical panels, aged water heaters and HVAC, and older sewer laterals are the items that most often turn a low price into a large repair bill.</p><p>With a median value of ${money(c.medianHomeValue)}, an unexpected repair is a larger share of the purchase price than it would be in a higher-priced area. We pair the standard inspection with a ${link('/services/sewer-scope-inspection/lithonia', 'sewer scope ($450)')} and ${link('/services/radon-testing/lithonia', 'radon test ($250)')} when the age of the home calls for it.</p>${FACTS(c)}${SOURCE(c)}`,
    benefits: `<ul><li>Two inspectors on site, so older houses with attics and crawlspaces are covered in about two hours</li><li>Investor-friendly reports: defects ranked by repair urgency so you can price rent-ready costs</li><li>Same-day digital report, with the DeKalb low-flow certificate available for $100 when your property qualifies</li></ul>`
  }),
  Stonecrest: (c) => ({
    intro: `Stonecrest is a much newer market than the rest of east DeKalb. The median home was built in ${c.medianYearBuilt}, only ${c.pctBuiltBefore1980}% of its ${nf(c.housingUnits)} housing units predate 1980, and ${c.pctOwnerOccupied}% are owner-occupied. A late-1990s home is now about 25 years old, which is when original roofs, HVAC systems and water heaters reach the end of their service life.`,
    risks: `<p>Homes from the late 1990s and 2000s are past the age where builder-grade components are expected to be replaced. Roof coverings, HVAC condensers, water heaters and exterior caulking are the usual first findings. Homes built before the mid-1990s may also carry polybutylene supply lines, which we check for on every inspection.</p><p>If you are buying new construction in or near Stonecrest, a ${link('/services/new-construction-inspection/stonecrest', 'new construction inspection')} before closing and a ${link('/services/11-month-warranty-inspection/stonecrest', '11-month warranty inspection')} before the builder warranty ends catch defects while the builder still has to fix them.</p>${FACTS(c)}${SOURCE(c)}`,
    benefits: `<ul><li>Age-based checklist for 25-year-old systems: roof, HVAC, water heater, exterior sealants</li><li>Pre-drywall, final and 11-month inspections for new builds in the area</li><li>Infrared thermal imaging included to find hidden moisture behind finished walls</li></ul>`
  }),
  Conyers: (c) => ({
    intro: `Conyers sits in Rockdale County with a median build year of ${c.medianYearBuilt}. ${c.pctBuiltBefore1980}% of homes predate 1980, and ${c.pctOwnerOccupied}% are owner-occupied, so you will see everything from 1970s ranches to 2000s subdivisions, plus a sizable rental market. Median home value is ${money(c.medianHomeValue)}.`,
    risks: `<p>A 1989 median means many Conyers houses were built when certain electrical panels and plumbing materials were still common. Federal Pacific and Zinsco panels were widely installed through about 1990, and polybutylene supply pipe was used until the mid-1990s. We identify both on site. Crawlspace moisture is the other recurring item in this part of Georgia, because red clay holds water against foundations.</p><p>If the house has a crawlspace or basement, expect a ${link('/services/buyer-inspection/conyers', 'full buyer inspection')} to include a physical crawl. Add a ${link('/services/termite-inspection/conyers', 'termite and WDO report')} when your lender requires one.</p>${FACTS(c)}${SOURCE(c)}`,
    benefits: `<ul><li>Panel and plumbing material checks aimed at 1970s through early-1990s construction</li><li>Crawlspace and moisture evaluation with infrared imaging</li><li>Georgia termite and wood-destroying-organism report available at closing</li></ul>`
  }),
  Decatur: (c) => ({
    intro: `Decatur is the highest-value market in our home ring. Median home value is ${money(c.medianHomeValue)}, the median home was built in ${c.medianYearBuilt}, and ${c.pctBuiltBefore1980}% of homes predate 1980. ${c.pctOwnerOccupied}% are owner-occupied. At these prices, an older house with additions and renovations needs a careful look at what is hidden behind the finishes.`,
    risks: `<p>Older Decatur homes are often renovated, expanded or both. Permit history, additions tied into old framing, and updated kitchens over original plumbing are where we focus. Mature trees add roof, gutter and foundation drainage concerns, and sewer laterals under older lots deserve a ${link('/services/sewer-scope-inspection/decatur', 'camera scope ($450)')} before you commit.</p><p>On a ${money(c.medianHomeValue)} purchase, findings carry real negotiating weight. Our report ranks defects by urgency, and the optional $99 contractor repair estimate gives you numbers to use in a repair request.</p>${FACTS(c)}${SOURCE(c)}`,
    benefits: `<ul><li>Added-room and renovation checks: framing tie-ins, electrical loads, permit questions to ask the seller</li><li>Sewer camera scope for older lots and mature-tree root intrusion</li><li>Optional itemized repair estimate for due diligence negotiations</li></ul>`
  })
};

let changed = 0;
for (const [name, build] of Object.entries(ANGLES)) {
  const city = cities.find((c) => c['City Name'] === name);
  const data = census[name];
  if (!city || !data || data.status) { console.warn(`Skipped ${name}: missing city or Census row`); continue; }
  const a = build(data);
  city.Intro = a.intro;
  city['Local Risks HTML'] = a.risks;
  city['Benefits HTML'] = a.benefits;
  city['Manual Override'] = true;
  city['Last Refreshed'] = new Date().toISOString().slice(0, 10);
  changed++;
  console.log(`${name}: intro ${a.intro.length} chars`);
}
fs.writeFileSync(citiesFile, JSON.stringify(cities, null, 2), 'utf8');
console.log(`Hubs rewritten: ${changed}/4`);
