#!/usr/bin/env node
/**
 * Deterministic Verification Suite for YouTube Growth System Swarm
 * Todd Anderson 7-Step Map-Pack + Be-Picked 5-Pillar AI-Authority Hourglass
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Usage: node scripts/audit-youtube-growth-system.mjs
 * Exits 0 on 100% pass, 1 on any failure.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

function check(label, condition, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${label}${detail ? ` — ${detail}` : ''}`);
  } else {
    console.error(`  ❌ [FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
    failures.push({ label, detail });
  }
}

function readRel(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, content: '' };
  }
  return { exists: true, content: fs.readFileSync(fullPath, 'utf8') };
}

function stripJsComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ');
}

function stripAllowedUrls(source) {
  return source.replace(/https?:\/\/[^\s"'`<>]*homegauge\.com[^\s"'`<>]*/gi, ' ');
}

function findBannedTokenHits(rawText) {
  const cleaned = stripAllowedUrls(rawText);
  const patterns = [
    { label: 'GAR Form F404 / GAR F404 / F404', re: /\b(?:GAR\s+Form\s+F404|GAR\s+F404|F404)\b/i },
    { label: 'F201', re: /\bF201\b/i },
    { label: 'HomeGauge', re: /\bHomeGauge\b/i },
    { label: 'CRL', re: /\bCRL\b/ },
    { label: 'RSMeans', re: /\bRSMeans\b/i },
    { label: 'FLIR', re: /\bFLIR\b/i },
    { label: 'audit/audits/audited/auditing', re: /\baudit(s|ed|ing)?\b/i },
  ];
  const hits = [];
  for (const { label, re } of patterns) {
    if (re.test(cleaned)) hits.push(label);
  }
  return hits;
}

function findLegacyAuxPriceHits(rawText) {
  const patterns = [
    { label: 'Sewer Scope flat $450', re: /sewer\s+scope[^.\n]{0,50}\$450\b/i },
    { label: 'Radon flat $250', re: /radon[^.\n]{0,50}\$250\b/i },
    { label: 'Pool & Spa flat $300', re: /pool(?:\s*(?:&|and)\s*spa)?[^.\n]{0,50}\$300\b/i },
    { label: 'Termite/WDO flat $125/$165', re: /(?:termite|wdo)[^.\n]{0,50}\$(?:125|165)\b/i },
    { label: 'DeKalb Low-Flow flat $100', re: /low-flow[^.\n]{0,50}\$100\b/i },
    { label: 'Commercial flat $750', re: /commercial[^.\n]{0,50}\$750\b/i },
  ];
  const hits = [];
  for (const { label, re } of patterns) {
    if (re.test(rawText)) hits.push(label);
  }
  return hits;
}

console.log('\n════════════════════════════════════════════════════════════════════');
console.log('  FORESIGHT YOUTUBE GROWTH SYSTEM AUDIT (TODD ANDERSON + BE-PICKED)');
console.log('════════════════════════════════════════════════════════════════════\n');

// ---------------------------------------------------------------------------
// SECTION 1: TODD ANDERSON 7-STEP MAP-PACK CHECKS
// ---------------------------------------------------------------------------
console.log('1. TODD ANDERSON 7-STEP LOCAL SEO & ANTI-CANNIBALIZATION CHECKS');

const citiesFile = readRel('data/cities.json');
let validCityNames = new Set();
if (citiesFile.exists) {
  try {
    const cities = JSON.parse(citiesFile.content);
    validCityNames = new Set(cities.map((c) => c['City Name']));
  } catch {
    validCityNames = new Set();
  }
}

const hoodsFile = readRel('data/neighborhoods-pseo.json');
let hoods = [];
let hoodsParseOk = false;
if (hoodsFile.exists) {
  try {
    hoods = JSON.parse(hoodsFile.content);
    hoodsParseOk = Array.isArray(hoods);
  } catch {
    hoodsParseOk = false;
  }
}

const REQUIRED_RING1_SLUGS = [
  'arabia-mountain-panola-stonecrest',
  'smoke-rise-main-street-stone-mountain',
  'honey-creek-lake-capri-conyers',
  'brookwood-summit-chase-snellville',
  'riverside-chastain-sandy-springs',
  'country-club-of-the-south-johns-creek',
  'woodstock-towne-lake-eagle-watch',
  'acworth-brookstone-lake-acworth',
  'powder-springs-lost-mountain-seven-springs',
  'peachtree-corners-amberfield-river-station',
  'lawrenceville-tribble-mill-collins-hill',
  'brookhaven-ashford-park-historic-club',
];

const hoodSlugs = new Set(hoods.map((h) => h.slug));
const missingRingSlugs = REQUIRED_RING1_SLUGS.filter((s) => !hoodSlugs.has(s));
const invalidHoodCities = hoods
  .filter((h) => !validCityNames.has(h.city))
  .map((h) => `${h.slug}:${h.city}`);
const schemaIncompleteHoods = hoods
  .filter(
    (h) =>
      !h.slug ||
      !h.name ||
      !h.city ||
      !h.county ||
      !h.type ||
      !h.tagline ||
      !h.era ||
      !h.intro ||
      !Array.isArray(h.keyDefects) ||
      h.keyDefects.length < 4 ||
      !Array.isArray(h.recommendedServices) ||
      h.recommendedServices.length < 1 ||
      !Array.isArray(h.faqs) ||
      h.faqs.length < 2
  )
  .map((h) => h.slug);
const missing4FaqsNewHoods = REQUIRED_RING1_SLUGS.filter((slug) => {
  const entry = hoods.find((h) => h.slug === slug);
  return !entry || !Array.isArray(entry.faqs) || entry.faqs.length < 4;
});

check(
  'T1. data/neighborhoods-pseo.json has >= 28 valid entries matching cities.json',
  hoodsParseOk &&
    hoods.length >= 28 &&
    hoodSlugs.size === hoods.length &&
    invalidHoodCities.length === 0 &&
    schemaIncompleteHoods.length === 0 &&
    missing4FaqsNewHoods.length === 0,
  `Count: ${hoods.length}, Unique: ${hoodSlugs.size}, Invalid cities: [${invalidHoodCities.join(', ')}], Incomplete: [${schemaIncompleteHoods.join(', ')}]`
);

check(
  'T2. data/neighborhoods-pseo.json includes all 12 Ring-1, North Metro & Page-2 Breakthrough slugs',
  missingRingSlugs.length === 0,
  missingRingSlugs.length ? `Missing: ${missingRingSlugs.join(', ')}` : '12/12 concentric & Page-2 slugs present'
);

const stopwatchRe = /\b(?:2\.0\s*(?:to|[-–])\s*2\.5\s*hours|1\.5\s*(?:to|[-–])\s*2\.5\s*hours|half\s+the\s+time)\b/i;
const gaZipRe = /\b(?:30\d{3}|31\d{3})\b/;
const hoodHasStopwatch = stopwatchRe.test(hoodsFile.content);
const hoodHasZip = gaZipRe.test(hoodsFile.content);
const hoodHasAsterisk = hoodsFile.content.includes('*');
const hoodBannedHits = findBannedTokenHits(hoodsFile.content);
const hoodLegacyPrices = findLegacyAuxPriceHits(hoodsFile.content);

check(
  'T3. data/neighborhoods-pseo.json has zero rigid stopwatch claims, zip lists, asterisks, or banned tokens',
  hoodsFile.exists &&
    !hoodHasStopwatch &&
    !hoodHasZip &&
    !hoodHasAsterisk &&
    hoodBannedHits.length === 0 &&
    hoodLegacyPrices.length === 0,
  `stopwatch=${hoodHasStopwatch}, zip=${hoodHasZip}, asterisk=${hoodHasAsterisk}, banned=[${hoodBannedHits.join(', ')}], legacyPrices=[${hoodLegacyPrices.join(', ')}]`
);

const hoodTemplate = readRel('app/neighborhoods/[slug]/page.js');
const hoodTemplateCode = hoodTemplate.content;
const hoodTemplateNoComments = stripJsComments(hoodTemplateCode);
const homeLinkMatches = hoodTemplateCode.match(/href=(?:["']\/["']|\{['"]\/['"]\})/g) || [];

check(
  'T4. app/neighborhoods/[slug]/page.js links upward to "/", buyer-inspection, service-areas, repair-credit-calculator & emits Offer/345.00',
  hoodTemplate.exists &&
    homeLinkMatches.length >= 2 &&
    hoodTemplateCode.includes('/services/buyer-inspection/${citySlug}') &&
    hoodTemplateCode.includes('/service-areas/${citySlug}') &&
    hoodTemplateCode.includes('/repair-credit-calculator') &&
    hoodTemplateCode.includes('offers') &&
    hoodTemplateCode.includes('priceSpecification') &&
    hoodTemplateCode.includes('345.00') &&
    !hoodTemplateCode.includes('Math.random()') &&
    !hoodTemplateNoComments.includes('*'),
  `upwardHomeLinks=${homeLinkMatches.length}, hasAsterisk=${hoodTemplateNoComments.includes('*')}`
);

const hoodsIndex = readRel('app/neighborhoods/page.js');
check(
  'T5. app/neighborhoods/page.js has #aeo-direct-answer, SpeakableSpecification, and upward links (/, /services/buyer-inspection, /service-areas)',
  hoodsIndex.exists &&
    hoodsIndex.content.includes('id="aeo-direct-answer"') &&
    hoodsIndex.content.includes('SpeakableSpecification') &&
    hoodsIndex.content.includes('href="/"') &&
    hoodsIndex.content.includes('/services/buyer-inspection') &&
    hoodsIndex.content.includes('/service-areas')
);

const layoutFile = readRel('app/layout.js');
const headerFile = readRel('app/components/Header.js');
const requiredFooterBuyerCities = [
  '/services/buyer-inspection/atlanta',
  '/services/buyer-inspection/alpharetta',
  '/services/buyer-inspection/marietta',
  '/services/buyer-inspection/sandy-springs',
  '/services/buyer-inspection/decatur',
  '/services/buyer-inspection/lithonia',
  '/services/buyer-inspection/stonecrest',
  '/services/buyer-inspection/roswell',
  '/services/buyer-inspection/johns-creek',
  '/services/buyer-inspection/lawrenceville',
];
const missingFooterCities = requiredFooterBuyerCities.filter((u) => !layoutFile.content.includes(u));
const hasOldAtlantaCannibalAnchor = /href=["']\/service-areas\/atlanta["'][^>]*>\s*Atlanta Home Inspection\s*<\/Link>/i.test(
  layoutFile.content
);
const hasDecannibalizedAtlantaGuideAnchor =
  /href=["']\/service-areas\/atlanta["'][^>]*>\s*Atlanta,\s*GA Inspection Guide\s*<\/Link>/i.test(layoutFile.content);

check(
  'T6. app/layout.js footer links anti-cannibalized /services/buyer-inspection/ money pages + new hubs, and Header links /homebuyer-red-flags',
  layoutFile.exists &&
    headerFile.exists &&
    missingFooterCities.length === 0 &&
    !hasOldAtlantaCannibalAnchor &&
    hasDecannibalizedAtlantaGuideAnchor &&
    layoutFile.content.includes('/about/christopher-boykin') &&
    layoutFile.content.includes('/homebuyer-red-flags') &&
    layoutFile.content.includes('/homeowner-care') &&
    layoutFile.content.includes('/neighborhoods') &&
    headerFile.content.includes('/homebuyer-red-flags'),
  missingFooterCities.length
    ? `Missing footer cities: ${missingFooterCities.join(', ')}`
    : `All 10 buyer city hubs + decannibalized /service-areas/atlanta (${hasDecannibalizedAtlantaGuideAnchor}) + Header verified`
);

const homePage = readRel('app/page.js');
const homeMallRoutes = [
  '/homebuyer-red-flags',
  '/about/christopher-boykin',
  '/homeowner-care',
  '/neighborhoods',
  '/repair-credit-calculator',
  '/services/buyer-inspection',
  '/service-areas',
  '/free-utility-setup',
  '/risk-scanner',
  '/list-of-3',
];
const missingHomeRoutes = homeMallRoutes.filter((r) => !homePage.content.includes(r));
const hasHomeFreeBenefitsSpotlight =
  homePage.content.includes('6 Free Included Inspection Benefits') &&
  homePage.content.includes('5 Free Metro Atlanta Self-Serve Tools');

check(
  'T7. app/page.js has zero "GAR Repair Lists" token, links all Mall-Entrance routes & showcases Free Benefits + 5 Free Tools',
  homePage.exists &&
    !homePage.content.includes('GAR Repair Lists') &&
    missingHomeRoutes.length === 0 &&
    hasHomeFreeBenefitsSpotlight,
  missingHomeRoutes.length
    ? `Missing routes: ${missingHomeRoutes.join(', ')}`
    : `Zero "GAR Repair Lists", all Mall-Entrance + 5 Free Tool routes & 6 Free Benefits verified`
);

// ---------------------------------------------------------------------------
// SECTION 2: BE-PICKED 5-PILLAR AI-AUTHORITY HOURGLASS CHECKS
// ---------------------------------------------------------------------------
console.log('\n2. BE-PICKED 5-PILLAR AI-AUTHORITY & HOURGLASS SYSTEM CHECKS');

const chrisBio = readRel('app/about/christopher-boykin/page.js');
const aboutPage = readRel('app/about/page.js');
const chrisCode = chrisBio.content;
const chrisImageTags = chrisCode.match(/<(?:Image|img)\b[\s\S]*?\/>/g) || [];
const hasCmi110 = chrisImageTags.some((tag) => /cmi_logo/i.test(tag) && /110px/i.test(tag));
const hasCpi100 = chrisImageTags.some((tag) => /cpi_logo/i.test(tag) && /100px/i.test(tag));
const hasOpticalCmiGreaterCpi = hasCmi110 && hasCpi100;
const hasUnmodifiedLogo =
  chrisCode.includes('Logopng.png') &&
  (/filter:\s*['"]none['"]/.test(chrisCode) || /background:\s*['"]#(?:fff|ffffff)['"]/i.test(chrisCode));

check(
  'B1. app/about/christopher-boykin/page.js has ProfilePage, Person, Speakable, FAQPage, #aeo-direct-answer, CMI/NACHI IDs, BY Christopher Boykin, optical 110px > 100px & /about link',
  chrisBio.exists &&
    aboutPage.exists &&
    chrisCode.includes('ProfilePage') &&
    chrisCode.includes('Person') &&
    chrisCode.includes('SpeakableSpecification') &&
    chrisCode.includes('FAQPage') &&
    chrisCode.includes('id="aeo-direct-answer"') &&
    chrisCode.includes('MICB-1082') &&
    chrisCode.includes('NACHI18051119') &&
    chrisCode.includes('176873') &&
    /BY\s+Christopher\s+Boykin/i.test(chrisCode) &&
    /dual/i.test(chrisCode) &&
    hasOpticalCmiGreaterCpi &&
    hasUnmodifiedLogo &&
    !chrisCode.includes('certifiedmasterinspector.org/verify/christopher-boykin') &&
    aboutPage.content.includes('/about/christopher-boykin'),
  `exists=${chrisBio.exists}, optical110vs100=${hasOpticalCmiGreaterCpi}, unmodifiedLogo=${hasUnmodifiedLogo}`
);

const redFlagsPage = readRel('app/homebuyer-red-flags/page.js');
const symptomClient = readRel('app/homebuyer-red-flags/SymptomTranslatorClient.js');
const redFlagsCombined = `${redFlagsPage.content}\n${symptomClient.content}`;
const hasUseClient =
  symptomClient.content.includes("'use client'") || symptomClient.content.includes('"use client"');
const has3AmSymptoms =
  /musty/i.test(redFlagsCombined) &&
  /crack/i.test(redFlagsCombined) &&
  /(ceiling|paint|roof)/i.test(redFlagsCombined) &&
  /(panel|pipe|polybutylene)/i.test(redFlagsCombined) &&
  /(builder|new)/i.test(redFlagsCombined) &&
  /due diligence/i.test(redFlagsCombined);
const has4Stages =
  /1\./.test(symptomClient.content) &&
  /2\./.test(symptomClient.content) &&
  /3\./.test(symptomClient.content) &&
  /4\./.test(symptomClient.content);

check(
  'B2. app/homebuyer-red-flags/page.js + SymptomTranslatorClient.js have #aeo-direct-answer, FAQPage, Speakable, 3:00 AM symptoms, 4 awareness stages & $1,250–$14,200 leverage',
  redFlagsPage.exists &&
    symptomClient.exists &&
    hasUseClient &&
    redFlagsPage.content.includes('id="aeo-direct-answer"') &&
    redFlagsPage.content.includes('FAQPage') &&
    redFlagsPage.content.includes('SpeakableSpecification') &&
    has3AmSymptoms &&
    has4Stages &&
    redFlagsCombined.includes('$1,250') &&
    redFlagsCombined.includes('$14,200') &&
    redFlagsCombined.includes('/repair-credit-calculator') &&
    redFlagsCombined.includes('/quote'),
  `useClient=${hasUseClient}, 3amSymptoms=${has3AmSymptoms}, 4Stages=${has4Stages}`
);

const homeownerCare = readRel('app/homeowner-care/page.js');
const hcCode = homeownerCare.content;
const hasFourSeasons =
  /spring/i.test(hcCode) &&
  /summer/i.test(hcCode) &&
  /fall|autumn/i.test(hcCode) &&
  /winter/i.test(hcCode);

check(
  'B3. app/homeowner-care/page.js has 4-season checklist, $35,000 protection, 11-Month From $345, /free-utility-setup & Google review CTA',
  homeownerCare.exists &&
    hcCode.includes('id="aeo-direct-answer"') &&
    hcCode.includes('SpeakableSpecification') &&
    hasFourSeasons &&
    hcCode.includes('$35,000') &&
    hcCode.includes('$10,000') &&
    hcCode.includes('$25,000') &&
    /11-Month/i.test(hcCode) &&
    hcCode.includes('$345') &&
    hcCode.includes('/services/11-month-warranty-inspection') &&
    hcCode.includes('/free-utility-setup') &&
    (hcCode.includes('g.page/r/CaK5MZOz_FBtEBM/review') || hcCode.includes('writereview')),
  `4Seasons=${hasFourSeasons}, has11Month=${/11-Month/i.test(hcCode)}`
);

const sitemapFile = readRel('app/sitemap.js');
const llmsFile = readRel('public/llms.txt');
const factSheetFile = readRel('app/ai-fact-sheet/page.js');
const NEW_ROUTES = ['/about/christopher-boykin', '/homebuyer-red-flags', '/homeowner-care'];

const missingInSitemap = NEW_ROUTES.filter((r) => !sitemapFile.content.includes(r));
const missingInLlms = [...NEW_ROUTES, '/neighborhoods', ...hoods.map((h) => `/neighborhoods/${h.slug}`)].filter(
  (r) => !llmsFile.content.includes(r)
);
const missingInFactSheet = [...NEW_ROUTES, '/neighborhoods'].filter((r) => !factSheetFile.content.includes(r));
const factSheetBrokenVerify = factSheetFile.content.includes('certifiedmasterinspector.org/verify/christopher-boykin');
const factSheetFbOk = factSheetFile.content.includes('https://www.facebook.com/fhinspectionsatl/');
const llmsNoBold = llmsFile.content.replace(/\*\*[^*\n]+\*\*/g, '');
const llmsHasStrayAsterisk = llmsNoBold.includes('*');
const llmsAppendedSection = llmsFile.content.split(/^##\s+Practitioner\s+Authority/im)[1] || '';
const llmsNewSectionHasAsterisk = llmsAppendedSection.includes('*');

check(
  'B4. app/sitemap.js, public/llms.txt (all 22 neighborhoods, 0 stray asterisks), and app/ai-fact-sheet/page.js register all new routes cleanly',
  sitemapFile.exists &&
    llmsFile.exists &&
    factSheetFile.exists &&
    missingInSitemap.length === 0 &&
    missingInLlms.length === 0 &&
    missingInFactSheet.length === 0 &&
    !factSheetBrokenVerify &&
    factSheetFbOk &&
    !llmsHasStrayAsterisk &&
    !llmsNewSectionHasAsterisk,
  `sitemapMissing=${missingInSitemap.length}, llmsMissing=${missingInLlms.length}, factSheetMissing=${missingInFactSheet.length}, brokenVerify=${factSheetBrokenVerify}, llmsStrayAsterisk=${llmsHasStrayAsterisk}`
);

const PLAYBOOK_FILES = [
  'docs/youtube-growth-swarm/action-playbook.md',
  'docs/youtube-growth-swarm/video-1-todd-anderson-7-step-map-pack.md',
  'docs/youtube-growth-swarm/video-2-be-picked-ai-authority-hourglass.md',
  'docs/youtube-growth-swarm/metro-atlanta-chameleonic-scorecard.md',
  'docs/youtube-growth-swarm/ready-to-paste-omnichannel-pack.md',
];
const missingPlaybooks = PLAYBOOK_FILES.filter((p) => {
  const f = readRel(p);
  return !f.exists || f.content.trim().length < 1000;
});
const actionPlaybook = readRel('docs/youtube-growth-swarm/action-playbook.md');
const hasFreeBenefitsMatrix =
  actionPlaybook.exists &&
  /Free \(\$0 Monthly Spend\) Benefits Matrix/i.test(actionPlaybook.content) &&
  actionPlaybook.content.includes('/free-utility-setup') &&
  actionPlaybook.content.includes('/risk-scanner') &&
  actionPlaybook.content.includes('/list-of-3');
const agencySkill = readRel('.agents/skills/foresight-seo-social-agency/SKILL.md');
const agencyBrief = readRel('data/agency-growth-brief.json');
const scorecardJson = readRel('data/chameleonic-map-pack-scorecard.json');
const servicesPseo = readRel('data/services-pseo.json');
const allServicesStarred =
  servicesPseo.exists &&
  JSON.parse(servicesPseo.content).every((s) => String(s.metaTitle || '').startsWith('4.8★'));

check(
  'B5. All 5 playbook/scorecard/omnichannel docs + 4.8★ CTR titles + Foresight SEO/Social Agency skill & brief verified',
  missingPlaybooks.length === 0 &&
    hasFreeBenefitsMatrix &&
    agencySkill.exists &&
    agencyBrief.exists &&
    scorecardJson.exists &&
    allServicesStarred,
  missingPlaybooks.length
    ? `Missing/empty: ${missingPlaybooks.join(', ')}`
    : `5/5 docs + 11/11 4.8★ service titles + Agency Skill & Brief verified`
);

const NEW_PAGE_FILES = [
  'app/about/christopher-boykin/page.js',
  'app/homebuyer-red-flags/page.js',
  'app/homebuyer-red-flags/SymptomTranslatorClient.js',
  'app/homeowner-care/page.js',
  'app/neighborhoods/[slug]/page.js',
];
const pageGuardrailIssues = [];
for (const rel of NEW_PAGE_FILES) {
  const f = readRel(rel);
  if (!f.exists) {
    pageGuardrailIssues.push(`${rel}: missing`);
    continue;
  }
  const stripped = stripJsComments(f.content);
  if (stripped.includes('*')) pageGuardrailIssues.push(`${rel}: visible asterisk (*)`);
  const banned = findBannedTokenHits(stripped);
  if (banned.length) pageGuardrailIssues.push(`${rel}: banned [${banned.join(', ')}]`);
  const legacy = findLegacyAuxPriceHits(stripped);
  if (legacy.length) pageGuardrailIssues.push(`${rel}: legacy price [${legacy.join(', ')}]`);
  if (stopwatchRe.test(stripped)) pageGuardrailIssues.push(`${rel}: rigid stopwatch claim`);
  // Street address must appear ONLY inside schema (preceded by streetAddress:)
  const nonSchemaAddr = stripped.replace(/['"]?streetAddress['"]?\s*:\s*['"`]1816\s+South\s+Deshon\s+Road['"`]/gi, '');
  if (/1816\s+South\s+Deshon/i.test(nonSchemaAddr)) {
    pageGuardrailIssues.push(`${rel}: visible street address outside JSON-LD`);
  }
}

check(
  'B6. Guardrail hygiene across all new/updated page templates (0 asterisks, 0 banned tokens, 0 legacy aux prices, 0 visible street address)',
  pageGuardrailIssues.length === 0,
  pageGuardrailIssues.length ? pageGuardrailIssues.join('; ') : 'All 5 page templates clean'
);

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`  AUDIT SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED`);
console.log('════════════════════════════════════════════════════════════════════\n');

if (passedChecks === totalChecks) {
  console.log('🏆 100% PASS — YouTube Growth System (Todd Anderson + Be-Picked) Verified.\n');
  process.exit(0);
} else {
  console.error('❌ FAILURES DETECTED:\n');
  for (const f of failures) {
    console.error(`   - ${f.label}${f.detail ? ` (${f.detail})` : ''}`);
  }
  console.error('');
  process.exit(1);
}
