import fs from 'fs';
import path from 'path';

const CITIES_PATH = path.resolve('data/cities.json');
const SERVICES_PATH = path.resolve('data/services-pseo.json');

// 1. Update cities.json with front-loaded mathematical title tags
const cities = JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8'));
let updatedCitiesCount = 0;

for (const city of cities) {
  const name = city['City Name'];
  city['Meta Title'] = `${name} Home Inspections | Certified Master Inspector® | Foresight`;
  city['Meta Description'] = `4.9★ Rated ${name} home inspections led by Certified Master Inspector Christopher Boykin. 2 certified inspectors on every job from $345 with free FLIR thermal, drone scans & $10k warranty!`;
  updatedCitiesCount++;
}

fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2), 'utf8');
console.log(`[EXPANSION] Successfully updated ${updatedCitiesCount} city hubs with front-loaded '{City} Home Inspections' title tags.`);

// 2. Expand services-pseo.json with all 11 core categories
const existingServices = JSON.parse(fs.readFileSync(SERVICES_PATH, 'utf8'));

const newCategories = [
  {
    slug: "buyer-inspection",
    name: "Buyer Home Inspection",
    metaTitle: "{city} Buyer Home Inspection | Two Certified Inspectors from $345",
    metaDescription: "Comprehensive pre-purchase buyer inspection in {city}, GA led by a Certified Master Inspector. 2 inspectors on every job, thermal imaging & $10,000 warranty included!",
    price: "$345+",
    priceDetails: "Condos from $295 | Single Family Homes from $345 based on square footage",
    icon: "🏡",
    badge: "Most Popular",
    heroSub: "Don't buy a home in {city} with blind spots. Our two-inspector team evaluates every system from roof to foundation with same-day digital reporting.",
    overview: "Purchasing a home in {city} is one of the largest financial investments of your life. Standard single-inspector companies take 4+ hours and often miss concealed defects. Foresight dispatches two certified inspectors—led by board-certified Certified Master Inspector® Christopher Boykin—cutting time to 1.5–2.5 hours while delivering double verification across structural, mechanical, plumbing, electrical, and roofing systems.",
    standards: "Conducted strictly to InterNACHI Standards of Practice with complimentary FLIR thermal infrared scans, 4K aerial roof drone evaluations, and up to $35,000 in warranty protection.",
    equipment: "FLIR thermal cameras, aerial inspection drones, digital moisture meters, circuit load testers, and combustible gas sniffers.",
    faqs: [
      {
        q: "Why do you send two certified inspectors to a buyer inspection in {city}?",
        a: "Our Two-Inspector Standard ensures complete, uncompromised coverage in half the time (1.5 to 2.5 hours vs. 4+ hours solo). One inspector focuses on the exterior, roof, and foundation while the other inspects mechanicals, electrical panels, and interiors, eliminating inspector fatigue."
      },
      {
        q: "What warranties are included with a buyer inspection in {city}, GA?",
        a: "Every buyer inspection includes our $10,000 Elite Master Inspection Warranty ($0 deductible) covering major appliances, structural components, HVAC, plumbing, electrical, mold remediation, and roof leaks, plus InterNACHI's $25,000 Honor Guarantee."
      },
      {
        q: "How fast do I receive my inspection report in {city}?",
        a: "We guarantee digital delivery within 24 hours of inspection completion (often same-day evening). The interactive HomeGauge CRL tool allows you and your realtor to create a formal repair amendment in minutes."
      }
    ],
    riskContext: "Georgia does not license home inspectors. Hiring an unvetted solo inspector puts your earnest money and due diligence deposit at severe risk.",
    relatedBlogSlug: "first-time-home-buyer-inspection-checklist-atlanta"
  },
  {
    slug: "commercial-property-inspection",
    name: "Commercial Property Inspection",
    metaTitle: "{city} Commercial Property Inspection | CMI Due Diligence | Foresight",
    metaDescription: "Certified commercial building inspections in {city}, GA for retail, office, industrial & multifamily properties. Full ASTM E2018 PCA due diligence reports.",
    price: "$750+",
    priceDetails: "Custom quote based on square footage, use type, and mechanical complexity",
    icon: "🏢",
    badge: "ASTM E2018 Standard",
    heroSub: "Protect your commercial real estate capital in {city}. Comprehensive Property Condition Assessments (PCA) for investors, lenders, and tenants.",
    overview: "Commercial real estate acquisitions in {city} carry substantial capital expenditure liabilities. From flat commercial roofing membranes and 3-phase high-voltage electrical switchgear to multi-zone rooftop HVAC units and ADA accessibility compliance, Foresight Home Inspections delivers forensic Property Condition Assessments adhering to ASTM E2018-15 standards.",
    standards: "Conducted to ASTM E2018 Standard Guide for Property Condition Assessments (PCA) and CCPIA guidelines with clear immediate repair vs. reserve study cost tables.",
    equipment: "High-resolution thermal drones for flat roof ponding, 3-phase power analyzers, industrial moisture meters, and fiber-optic pipe cameras.",
    faqs: [
      {
        q: "What commercial property types do you inspect in {city}, GA?",
        a: "We inspect retail storefronts, office complexes, medical suites, light industrial warehouses, mixed-use buildings, strip centers, and multi-family apartment communities throughout {city} and surrounding Metro Atlanta counties."
      },
      {
        q: "Do your commercial inspection reports include cost estimates for {city} properties?",
        a: "Yes. Our Property Condition Reports include tables categorizing immediate life-safety defects, short-term maintenance needs (1-2 years), and long-term capital replacement forecasts to assist in purchase price negotiations."
      }
    ],
    riskContext: "Deferred maintenance on commercial HVAC chillers or flat TPO roofs in {city} can easily exceed $50,000 to $100,000 in unbudgeted capital expenditures post-closing.",
    relatedBlogSlug: "metro-atlanta-residential-defect-index-building-science-study"
  },
  {
    slug: "pre-drywall-inspection",
    name: "Pre-Drywall Framing Inspection",
    metaTitle: "{city} Pre-Drywall Framing Inspection | Phase 2 Audit from $275",
    metaDescription: "Independent phase 2 pre-drywall inspection in {city}, GA. Inspect studs, trusses, plumbing, electrical & HVAC rough-ins before drywall conceals defects.",
    price: "$275+",
    priceDetails: "$275 up to 2,500 sq ft | $300 for 2,500+ sq ft",
    icon: "📐",
    badge: "Phase 2 Framing Audit",
    heroSub: "Drywall permanently hides structural, electrical, and plumbing defects. Inspect the bare bones of your new {city} home before walls are closed.",
    overview: "Once drywall is hung, you can never see the structural skeleton of your home again. In {city}'s booming new construction subdivisions, framing crews rush through production builds. Our Certified Master Inspector team inspects load-bearing studs, engineered roof trusses, shear walls, foundation anchor bolts, and rough-in plumbing/electrical runs before sheetrock is installed.",
    standards: "Evaluated against the International Residential Code (IRC), Georgia amendments, and manufacturer engineered truss specification sheets.",
    equipment: "Laser levels, framing alignment squares, high-output LED worklights, and digital moisture meters for framing lumber.",
    faqs: [
      {
        q: "When should a pre-drywall inspection be scheduled in {city}?",
        a: "Schedule the inspection after all framing, electrical rough-ins, plumbing supply/waste lines, and HVAC ductwork are installed, and after municipal rough-in code approval, but BEFORE insulation and drywall installation begins."
      },
      {
        q: "Will the builder allow an independent inspector for pre-drywall in {city}?",
        a: "Yes. Georgia builders routinely accommodate independent third-party inspections. We coordinate with your builder's site superintendent and provide a builder-ready punch list report with photo documentation."
      }
    ],
    riskContext: "Subcontractors frequently notch or over-bore load-bearing joists for plumbing pipes, compromising structural integrity in new {city} framing.",
    relatedBlogSlug: "pre-drywall-framing-inspection-georgia-new-construction"
  },
  {
    slug: "11-month-warranty-inspection",
    name: "11-Month Builder Warranty Inspection",
    metaTitle: "{city} 11-Month Builder Warranty Inspection | Catch Defects from $335",
    metaDescription: "Independent 11-month builder warranty home inspection in {city}, GA. Submit verified defect reports to your builder before the 1-year warranty expires.",
    price: "$335+",
    priceDetails: "11-month warranty audits from $335+ based on home square footage",
    icon: "⏳",
    badge: "One-Year Deadline",
    heroSub: "Your builder's one-year warranty is about to expire. Uncover structural settlement, HVAC leaks, and roof flaws before the repair bill becomes yours in {city}.",
    overview: "During the first year of living in a new home in {city}, seasonal temperature swings, foundation settling, and everyday living reveal hidden construction defects. An 11-Month Warranty Inspection gives you an independent Certified Master Inspector report documenting code deficiencies, drywall nail pops, truss uplift, and drainage issues to submit directly to your builder for mandatory repairs before your warranty coverage ends.",
    standards: "Complete 1,600-point InterNACHI evaluation with thermal imaging, roof drone scans, and cosmetic/structural settlement audit.",
    equipment: "FLIR thermal cameras, roof drones, laser leveling devices, and circuit analyzers.",
    faqs: [
      {
        q: "Why shouldn't I just do the 11-month walkthrough myself in {city}?",
        a: "Homeowners catch cosmetic items like paint scuffs, but miss major issues like roof flashing leaks, improperly pitched gutters, missing attic insulation, unglued drain lines, and HVAC refrigerant leaks that require specialized diagnostic equipment."
      },
      {
        q: "How does the builder receive the 11-month warranty report in {city}?",
        a: "Our digital reports are formatted with high-resolution photos and specific technical descriptions that can be uploaded directly to your builder's warranty portal or emailed to your warranty representative."
      }
    ],
    riskContext: "Once your 365-day builder warranty window closes, any undiscovered defects become the sole financial responsibility of the homeowner.",
    relatedBlogSlug: "11-month-warranty-inspection-guide"
  },
  {
    slug: "mold-testing",
    name: "Mold & Air Quality Inspection",
    metaTitle: "{city} Mold Inspection & Air Quality Testing | Certified Lab Analysis",
    metaDescription: "Certified indoor air quality & mold testing in {city}, GA. Spore trap air samples, surface swabs & independent laboratory analysis. Call 678-480-2110!",
    price: "$250+",
    priceDetails: "$250 includes 2 air samples (indoor vs outdoor baseline) + independent certified lab report",
    icon: "🧫",
    badge: "Certified Lab Analysis",
    heroSub: "Hidden mold triggers severe respiratory allergies and indicates active water leaks. Protect your family's health in {city} with certified air quality testing.",
    overview: "Georgia's high ambient humidity, heavy rainfall, and vented crawlspaces create prime conditions for toxic mold growth (including Stachybotrys and Aspergillus/Penicillium). If you detect musty odors, observe water stains, or family members experience unexplained allergy symptoms in {city}, Foresight collects calibrated spore-trap air samples and surface swabs analyzed by an independent accredited microbiology laboratory.",
    standards: "Conducted to IAC2 (International Association of Certified Indoor Air Consultants) standards and EPA indoor air quality guidance.",
    equipment: "Calibrated high-volume air sampling pumps, Air-O-Cell spore trap cassettes, digital thermal hygrometers, and moisture meters.",
    faqs: [
      {
        q: "When is mold testing recommended in {city}, GA?",
        a: "Mold testing is strongly recommended if you notice musty odors, see visible fungal growth, have a history of plumbing or roof leaks, are buying a home with a crawlspace or basement, or if occupants suffer from asthma or unexplained respiratory allergies."
      },
      {
        q: "How long do mold lab results take in {city}?",
        a: "Samples are sent to an independent accredited laboratory with full analytical results and interpretation reports returned within 2 to 3 business days (rush 24-hour service available)."
      }
    ],
    riskContext: "Over 60% of vented Georgia crawlspaces exceed the 19% wood moisture threshold required for active fungal growth and spore transmission into living areas.",
    relatedBlogSlug: "crawlspace-moisture-silent-threat-georgia-foundations"
  }
];

// Merge without duplicates
const existingSlugs = new Set(existingServices.map(s => s.slug));
for (const cat of newCategories) {
  if (!existingSlugs.has(cat.slug)) {
    existingServices.push(cat);
  }
}

fs.writeFileSync(SERVICES_PATH, JSON.stringify(existingServices, null, 2), 'utf8');
console.log(`[EXPANSION] Successfully updated services-pseo.json with ${existingServices.length} total core categories across all cities!`);
