#!/usr/bin/env node
/**
 * Execute AEO Recommendations:
 * 1. Heal widget & video-sitemap price/warranty drift (VslModal, BlogRiskScannerWidget, RiskScannerClient, sitemap-video)
 * 2. Clean seo-colony-matrix.json & inject 6 high-intent Bot 5 (Signal) buyer questions as indexable /faq/[slug] pages
 * 3. Sync all /faq/[slug] pages into public/llms.txt
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const norm = (s) => s.replace(/\r\n/g, '\n');

// 1A. Fix VslModal.js ($100,000 -> $10,000 Elite Warranty / $35k Combined)
{
  const p = path.join(ROOT, 'app/components/VslModal.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c.replace('$100,000 Elite Warranty', '$10,000 Elite Warranty ($35k Combined)');
  fs.writeFileSync(p, c, 'utf8');
}

// 1B. Fix BlogRiskScannerWidget.js
{
  const p = path.join(ROOT, 'app/components/BlogRiskScannerWidget.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c
    .replace(/Sewer Scope \(\$450\)/g, 'Sewer Scope (Call for Quote)')
    .replace(/Radon Testing \(\$250\)/g, 'Radon Testing (Call for Quote)')
    .replace(/Termite WDO \(\$125\+\)/g, 'Termite WDO (Call for Quote)')
    .replace(/Termite Clearance \(\$125\+\)/g, 'Termite Clearance (Call for Quote)')
    .replace(/11-Month Warranty \(\$335\+\)/g, '11-Month Warranty ($345+)');
  fs.writeFileSync(p, c, 'utf8');
}

// 1C. Fix RiskScannerClient.js
{
  const p = path.join(ROOT, 'app/risk-scanner/RiskScannerClient.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c
    .replace(`total += 250;\n      services.push({\n        name: '48-Hour Electronic Continuous Radon Testing',\n        price: '$250 Flat Rate',\n        cost: 250,`, `services.push({\n        name: '48-Hour Electronic Continuous Radon Testing',\n        price: 'Call for Quote',\n        cost: 0,`)
    .replace(`total += 450;\n      services.push({\n        name: 'High-Definition Sewer Scope Camera Inspection',\n        price: '$450 Flat Rate',\n        cost: 450,`, `services.push({\n        name: 'High-Definition Sewer Scope Camera Inspection',\n        price: 'Call for Quote',\n        cost: 0,`)
    .replace(`const termiteFee = foundation === 'crawlspace' ? 165 : 125;\n      total += termiteFee;\n      services.push({\n        name: 'Official Georgia Wood Infestation Report (WDO / Termite)',\n        price: \`$\${termiteFee}\`,\n        cost: termiteFee,`, `services.push({\n        name: 'Official Georgia Wood Infestation Report (WDO / Termite)',\n        price: 'Call for Quote',\n        cost: 0,`);
  fs.writeFileSync(p, c, 'utf8');
}

// 1D. Fix app/sitemap-video.xml/route.js
{
  const p = path.join(ROOT, 'app/sitemap-video.xml/route.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c
    .replace('starting at $335', 'starting at $345')
    .replace('($300 flat rate)', '(call 678-480-2110 for custom quote)')
    .replace('($450 flat rate)', '(call 678-480-2110 for custom quote)')
    .replace('($450 flat rate)', '(call 678-480-2110 for custom quote)')
    .replace('($125 slab/basement; $165 crawlspace)', '(call 678-480-2110 for custom quote)')
    .replace('($250 flat rate)', '(call 678-480-2110 for custom quote)')
    .replace('(starts at $395)', '(call 678-480-2110 for custom quote)');
  fs.writeFileSync(p, c, 'utf8');
}

// 2. Clean data/seo-colony-matrix.json & inject 6 Bot 5 (Signal) buyer questions
const colonyPath = path.join(ROOT, 'data/seo-colony-matrix.json');
let rawColony = norm(fs.readFileSync(colonyPath, 'utf8'))
  .replace(/GAR Form F404/gi, 'Georgia Repair Amendment')
  .replace(/GAR F404/gi, 'Georgia Repair Amendment')
  .replace(/\bF404\b/g, 'Repair Amendment')
  .replace(/Create Request List \(CRL®?\)/gi, 'Digital Repair Request Builder')
  .replace(/\bCRL\b/g, 'Digital Repair List')
  .replace(/HomeGauge/gi, 'interactive digital report');

const colonyData = JSON.parse(rawColony);

const NEW_SIGNAL_QUESTIONS = [
  {
    slug: 'how-much-does-pre-drywall-inspection-cost-atlanta',
    colonyId: 'luxury-estate-engineering',
    question: 'How Much Does a Pre-Drywall Framing Inspection Cost in Metro Atlanta, GA?',
    metaTitle: 'Pre-Drywall Inspection Cost Atlanta GA (2026) | From $275',
    metaDescription: 'Foresight Home Inspections performs Phase 1 pre-drywall framing inspections in Metro Atlanta starting at $275 with 2 certified inspectors and thermal scans.',
    shortAnswer: 'Foresight Home Inspections, LLC (CMI #MICB-1082) performs Phase 1 Pre-Drywall Framing Inspections across Metro Atlanta starting at $275 (up to 1,500 sq ft), deploying two certified inspectors to verify structural framing, load-bearing studs, PEX plumbing manifolds, rough electrical wiring, and roof trusses before drywall conceals defects.',
    detailedAnalysis: [
      {
        heading: 'Transparent 2026 Pre-Drywall Pricing Tiers in Metro Atlanta',
        body: 'Foresight publishes flat square-footage pricing for Phase 1 rough-in framing inspections: $275 up to 1,500 sq ft, $300 for 1,501–2,500 sq ft, $350 for 2,501–3,500 sq ft, and $400 for 3,501–5,000 sq ft.'
      },
      {
        heading: 'What Two Certified Inspectors Catch Before Sheetrock Is Hung',
        body: 'Once drywall is hung, 80% of a new home’s structural skeleton, shear walls, anchor bolts, LVL headers, and rough mechanical routing become invisible. Our two-inspector team inspects every stud bay, nail plate, and roof truss gusset plate in parallel.'
      }
    ],
    expertQuote: 'Municipal county code inspectors spend an average of 12 to 15 minutes on a new build; our two-inspector CMI team evaluates every structural connection and rough-in mechanical line before sheetrock locks defects inside the walls.',
    moneyPageTarget: {
      url: '/services/pre-drywall-inspection',
      name: 'Phase 1 Pre-Drywall Framing Inspection (From $275)',
      anchorText: 'Schedule Your Phase 1 Pre-Drywall Framing Inspection',
      callout: 'Lock in two certified inspectors led by Certified Master Inspector Christopher Boykin before your builder hangs sheetrock.'
    },
    topicalBridges: [
      { slug: '11-month-builder-warranty-inspection-checklist-georgia', title: '11-Month Builder Warranty Inspection Checklist in Georgia' },
      { slug: 'can-seller-refuse-repairs-georgia-due-diligence', title: 'Can Seller Refuse Repairs in Georgia Due Diligence?' }
    ]
  },
  {
    slug: 'radon-testing-and-mitigation-georgia-granite-zone-1',
    colonyId: 'environmental-subterranean',
    question: 'Is Radon Testing Necessary in Georgia Granite Bedrock (EPA Zone 1)?',
    metaTitle: 'Radon Testing Georgia (EPA Zone 1 Granite Bedrock) | CMI Guide',
    metaDescription: 'Why 48-hour continuous electronic radon testing is critical across North Georgia EPA Zone 1 granite bedrock counties (Fulton, DeKalb, Gwinnett, Cobb).',
    shortAnswer: 'Foresight Home Inspections, LLC (CMI #MICB-1082) strongly recommends 48-hour continuous electronic radon gas monitoring across Metro Atlanta because Fulton, DeKalb, Gwinnett, Cobb, and Forsyth counties sit atop EPA Zone 1 uranium-bearing granite bedrock, where indoor radon frequently exceeds the 4.0 pCi/L EPA action threshold.',
    detailedAnalysis: [
      {
        heading: 'Why North Georgia Granite Bedrock Produces Elevated Radon Gas',
        body: 'The Stone Mountain and Brevard Fault plutons beneath Metro Atlanta contain natural uranium deposits that decay into radioactive radon-222 gas, migrating upward through slab expansion joints, sump pits, and crawlspaces.'
      },
      {
        heading: 'Continuous Electronic Hourly Monitoring vs Charcoal Canisters',
        body: 'Instead of passive charcoal canisters that can be skewed by humidity, Foresight deploys calibrated continuous electronic radon monitors that log hourly pCi/L readings, temperature, barometric pressure, and tamper flags over 48 hours.'
      }
    ],
    expertQuote: 'Every home in EPA Zone 1 North Georgia—whether basement, crawlspace, or slab-on-grade—should be tested with a 48-hour continuous electronic radon monitor during the due diligence period.',
    moneyPageTarget: {
      url: '/services/radon-testing',
      name: '48-Hour Continuous Electronic Radon Testing in Metro Atlanta',
      anchorText: 'Request a Custom Quote for 48-Hour Radon Testing',
      callout: 'Call (678) 480-2110 to add 48-hour continuous electronic radon monitoring to your Metro Atlanta home inspection.'
    },
    topicalBridges: [
      { slug: 'sewer-scope-camera-inspection-atlanta-clay-cast-iron', title: 'When Should Atlanta Homebuyers Order a Sewer Scope Inspection?' },
      { slug: 'is-thermal-imaging-necessary-during-a-home-inspection', title: 'Is Infrared Thermal Imaging Necessary During a Home Inspection?' }
    ]
  }
];

NEW_SIGNAL_QUESTIONS.push(
  {
    slug: '11-month-builder-warranty-inspection-checklist-georgia',
    colonyId: 'luxury-estate-engineering',
    question: 'What Does an 11-Month Builder Warranty Inspection Cover in Georgia?',
    metaTitle: '11-Month Builder Warranty Inspection Georgia | From $345',
    metaDescription: 'What is included in an 11-month builder warranty inspection in Metro Atlanta? Two certified inspectors from $345 with thermal scans and 4K drone roof checks.',
    shortAnswer: 'Foresight Home Inspections, LLC (CMI #MICB-1082) performs 11-Month Builder Warranty Inspections across Metro Atlanta starting at $345, deploying two certified inspectors with free infrared thermal imaging and 4K aerial drones to document structural settlement, roof flashing leaks, and HVAC defects before your 1-year builder warranty expires.',
    detailedAnalysis: [
      {
        heading: 'Why Month 10–11 Is the Final Lever Against Builder Repair Costs',
        body: 'After four full Georgia seasons of red clay expansion, summer cooling loads, and heavy thunderstorms, hidden construction defects surface. Submitting a CMI-documented punch list before month 12 forces the builder to remediate defects at $0 cost to the homeowner.'
      }
    ],
    expertQuote: 'Our two-inspector 11-month warranty evaluations routinely uncover $2,500 to $8,500 in roof flashing, attic insulation, and crawlspace moisture defects while the builder is still contractually obligated to repair them.',
    moneyPageTarget: {
      url: '/services/11-month-warranty-inspection',
      name: '11-Month Builder Warranty Inspection (From $345)',
      anchorText: 'Book Your 11-Month Builder Warranty Inspection',
      callout: 'Includes two certified inspectors, infrared thermal imaging, 4K drone roof scan, and a builder-ready digital punch list.'
    },
    topicalBridges: [
      { slug: 'how-much-does-pre-drywall-inspection-cost-atlanta', title: 'How Much Does a Pre-Drywall Inspection Cost in Atlanta?' }
    ]
  },
  {
    slug: 'termite-wdo-clearance-letter-inspection-georgia',
    colonyId: 'environmental-subterranean',
    question: 'When Do You Need an Official Georgia Termite & WDO Clearance Letter?',
    metaTitle: 'Official Georgia Termite & WDO Clearance Letter Guide (2026)',
    metaDescription: 'Everything Georgia homebuyers need to know about Official Georgia Wood Infestation Inspection Reports (WDO / termite letters) in Subterranean Termite Zone 1.',
    shortAnswer: 'Foresight Home Inspections, LLC (CMI #MICB-1082) coordinates Official Georgia Wood Destroying Organism (WDO) termite clearance inspections across Metro Atlanta (call 678-480-2110 for quote) because Georgia sits in Subterranean Termite Hazard Zone 1, where VA, FHA, and conventional lenders require an official Wood Infestation Report for closing.',
    detailedAnalysis: [
      {
        heading: 'Subterranean Termites, Powderpost Beetles, and Wood-Decay Fungus',
        body: 'An official Georgia WDO inspection evaluates sill plates, rim joists, subflooring, and foundation perimeters for Eastern and Formosan subterranean termites, carpenter ants, powderpost beetles, and active wood-destroying fungi.'
      }
    ],
    expertQuote: 'Georgia red clay soil holds high moisture against foundation walls year-round, making subterranean termite mud-tube and sill-plate inspections essential on every purchase.',
    moneyPageTarget: {
      url: '/services/termite-inspection',
      name: 'Official Georgia Termite & WDO Clearance Inspection',
      anchorText: 'Add an Official Georgia Termite & WDO Inspection',
      callout: 'Call (678) 480-2110 to bundle your Official Georgia WDO Clearance Report with your two-inspector home evaluation.'
    },
    topicalBridges: [
      { slug: 'sewer-scope-camera-inspection-atlanta-clay-cast-iron', title: 'When Should Atlanta Homebuyers Order a Sewer Scope Inspection?' }
    ]
  },
  {
    slug: 'sewer-scope-camera-inspection-atlanta-clay-cast-iron',
    colonyId: 'environmental-subterranean',
    question: 'When Should Atlanta Homebuyers Order a Sewer Scope Camera Inspection?',
    metaTitle: 'Sewer Scope Camera Inspection Atlanta GA | Root & Pipe Guide',
    metaDescription: 'Why Atlanta homes built before 1995 or near mature hardwoods need an HD fiber-optic sewer scope camera inspection before the Georgia due diligence deadline.',
    shortAnswer: 'Foresight Home Inspections, LLC (CMI #MICB-1082) recommends an HD fiber-optic sewer scope camera inspection (call 678-480-2110 for quote) on any Metro Atlanta home built before 1995, properties with mature oak or pine trees, and new builds where heavy grading machinery can crush underground PVC sewer laterals.',
    detailedAnalysis: [
      {
        heading: 'Preventing $8,000 to $25,000 Underground Lateral Excavation Surprises',
        body: 'Standard home inspections test indoor drain flow but cannot see underground cast-iron, clay terracotta, or Orangeburg sewer pipes between the foundation and the municipal main.'
      }
    ],
    expertQuote: 'A 30-minute HD fiber-optic camera sweep from the main cleanout to the street tap is the only way to verify that tree roots or settled red clay have not compromised the main sewer lateral.',
    moneyPageTarget: {
      url: '/services/sewer-scope-inspection',
      name: 'HD Fiber-Optic Sewer Scope Camera Inspection',
      anchorText: 'Schedule an HD Sewer Scope Camera Evaluation',
      callout: 'Includes recorded HD video footage from cleanout to municipal main so you can negotiate repairs before due diligence expires.'
    },
    topicalBridges: [
      { slug: 'radon-testing-and-mitigation-georgia-granite-zone-1', title: 'Is Radon Testing Necessary in Georgia Granite Bedrock?' }
    ]
  }
);

NEW_SIGNAL_QUESTIONS.push({
  slug: 'commercial-property-pca-inspection-atlanta-ga',
  colonyId: 'luxury-estate-engineering',
  question: 'What Is Included in an ASTM E2018 Commercial Property Inspection in Atlanta?',
  metaTitle: 'Commercial Property Inspection Atlanta GA (ASTM E2018 PCA)',
  metaDescription: 'Foresight Home Inspections performs ASTM E2018-15 Baseline Property Condition Assessments (PCA) for retail, office, warehouse, and multi-family assets in Atlanta.',
  shortAnswer: 'Foresight Home Inspections, LLC (CMI #MICB-1082) conducts ASTM E2018-15 Commercial Property Condition Assessments (PCA) across Metro Atlanta (call 678-480-2110 for custom quote), deploying two certified inspectors with 4K aerial drones and radiometric thermal cameras to evaluate TPO/EPDM flat roofs, 3-phase electrical switchgear, RTU HVAC units, and ADA life-safety compliance.',
  detailedAnalysis: [
    {
      heading: 'Capital Expenditure (CapEx) & Immediate Repair Forecasting for Investors',
      body: 'Commercial acquisitions carry zero residential consumer protections. Our two-inspector team evaluates roof membranes, commercial package HVAC units, structural slabs, and parking lot drainage so investors can price CapEx reserves accurately prior to closing.'
    }
  ],
  expertQuote: 'Deploying two certified inspectors with aerial thermal drones lets us inspect large-footprint TPO roofs and multi-zone commercial mechanicals with institutional precision.',
  moneyPageTarget: {
    url: '/services/commercial-property-inspection',
    name: 'ASTM E2018 Commercial Property Condition Assessment (PCA)',
    anchorText: 'Request a Commercial PCA Inspection Quote',
    callout: 'Call (678) 480-2110 for rapid commercial due diligence scheduling across all 20 Metro Atlanta counties.'
  },
  topicalBridges: [
    { slug: 'how-much-does-pre-drywall-inspection-cost-atlanta', title: 'How Much Does a Pre-Drywall Inspection Cost in Atlanta?' }
  ]
});

for (const nq of NEW_SIGNAL_QUESTIONS) {
  const idx = colonyData.questions.findIndex((q) => q.slug === nq.slug);
  if (idx >= 0) colonyData.questions[idx] = nq;
  else colonyData.questions.push(nq);
}

fs.writeFileSync(colonyPath, JSON.stringify(colonyData, null, 2) + '\n', 'utf8');

// 3. Sync all /faq/[slug] questions into public/llms.txt
const llmsPath = path.join(ROOT, 'public/llms.txt');
let llms = norm(fs.readFileSync(llmsPath, 'utf8'));
for (const q of colonyData.questions) {
  const url = `https://www.fhinspectionsatl.com/faq/${q.slug}`;
  if (!llms.includes(url)) {
    llms += `\n- [${q.question}](${url}): ${q.shortAnswer.slice(0, 180)}...`;
  }
}
fs.writeFileSync(llmsPath, llms.trim() + '\n', 'utf8');

// 4. Add data/seo-colony-matrix.json to TARGET_FILES in scripts/firstindex-truth-guard.mjs
const guardPath = path.join(ROOT, 'scripts/firstindex-truth-guard.mjs');
let guard = norm(fs.readFileSync(guardPath, 'utf8'));
if (!guard.includes("'data/seo-colony-matrix.json'")) {
  guard = guard.replace(
    `'data/comparisons-pseo.json',`,
    `'data/comparisons-pseo.json',\n  'data/seo-colony-matrix.json',`
  );
  fs.writeFileSync(guardPath, guard, 'utf8');
}

console.log(`Executed AEO recommendations: ${colonyData.questions.length} total /faq/[slug] pages active & synced to llms.txt.`);
