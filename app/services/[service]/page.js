import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import GooglePreferredSource from '../../components/GooglePreferredSource';
import StrComplianceChecklist from '../components/StrComplianceChecklist';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const dynamic = 'force-static';
export const dynamicParams = false;

const SERVICE_MAP = {
  'buyer-inspection': {
    name: 'Full Home Inspection & Buyer Due Diligence',
    price: 'From $345',
    icon: '01',
    headline: 'Full Home Inspection Services & Certified Home Inspectors Across Metro Atlanta',
    metaTitle: 'Full Home Inspection Services Atlanta GA | 2 Inspectors $345',
    metaDescription: '4.9★ Buyer home inspection in Atlanta, GA from $345 ($295 condos). 2 certified inspectors led by a CMI, free thermal, 4K drones & $35,000 warranty!',
    description: 'Every Foresight full home inspection includes two certified inspectors on site led by Christopher Boykin, Certified Master Inspector® (CMI). We evaluate the entire structural, mechanical, electrical, plumbing, roof, and attic systems, delivering comprehensive reports within 24 hours backed by up to $35,000 in combined warranty protection.',
    included: [
      'Two certified inspectors on site for 2x thoroughness in half the time',
      'Infrared thermal imaging and moisture meter diagnostics included free',
      'Aerial camera drone roof scanning for high or steep roofs',
      'Up to $35,000 in combined warranty protection ($10,000 Elite Warranty + $25,000 InterNACHI Honor Guarantee, $0 deductible)',
      'Free Utilities Plus VIP utility setup concierge ($150 value)'
    ]
  },
  'home-buyer-inspection': {
    name: 'Full Home Inspection & Buyer Due Diligence',
    price: 'From $345',
    icon: '01',
    headline: 'Full Home Inspection Services & Certified Home Inspectors Across Metro Atlanta',
    metaTitle: 'Full Home Inspection Services Atlanta GA | 2 Inspectors $345',
    metaDescription: '4.9★ Buyer home inspection in Atlanta, GA from $345 ($295 condos). 2 certified inspectors led by a CMI, free thermal, 4K drones & $35,000 warranty!',
    description: 'Every Foresight full home inspection includes two certified inspectors on site led by Christopher Boykin, Certified Master Inspector® (CMI). We evaluate the entire structural, mechanical, electrical, plumbing, roof, and attic systems, delivering comprehensive reports within 24 hours backed by up to $35,000 in combined warranty protection.',
    included: [
      'Two certified inspectors on site for 2x thoroughness in half the time',
      'Infrared thermal imaging and moisture meter diagnostics included free',
      'Aerial camera drone roof scanning for high or steep roofs',
      'Up to $35,000 in combined warranty protection ($10,000 Elite Warranty + $25,000 InterNACHI Honor Guarantee, $0 deductible)',
      'Free Utilities Plus VIP utility setup concierge ($150 value)'
    ]
  },
  'radon-testing': {
    name: 'Radon Gas Testing',
    price: '$250',
    icon: '02',
    headline: 'Continuous 48-Hour Electronic Radon Testing Across Metro Atlanta',
    metaTitle: 'Electronic Radon Testing Atlanta GA | 48-Hr EPA Monitor $250',
    metaDescription: 'EPA-certified 48-hour continuous electronic radon testing across Metro Atlanta. Precision hourly pCi/L graph & same-day report. Flat $250. Call 678-480-2110!',
    description: 'Radon is an odorless, invisible radioactive gas that represents the second leading cause of lung cancer in the United States. Northern Georgia geology contains significant granite bedrock with naturally occurring uranium deposits. Foresight uses state-of-the-art continuous electronic radon monitors delivering precision hourly graphs and EPA-compliant action reports.',
    included: [
      '48-hour continuous electronic active monitor placement',
      'Hourly air concentration measurement graph',
      'Tamper-resistant sensor tracking (temperature, barometric pressure, movement)',
      'Same-day digital EPA-compliance report upon completion'
    ]
  },
  'sewer-scope-inspection': {
    name: 'Sewer Scope Camera Inspection',
    price: '$450',
    icon: '03',
    headline: 'HD Fiber-Optic Main Drain & Lateral Sewer Scope Camera Audits',
    metaTitle: 'Sewer Scope Camera Inspection Atlanta GA | HD Pipe Audit $450',
    metaDescription: 'HD fiber-optic sewer scope camera inspection in Metro Atlanta. Detect root intrusions, crushed pipes & blockages before closing. Flat $450. Video report included.',
    description: 'Replacing a broken underground sewer lateral costs between $5,000 and $25,000 and is not covered by standard homeowners insurance. Foresight pushes a self-leveling HD fiber-optic camera through the entire line to the municipal connection or septic tank, pinpointing root intrusions, crushed pipes, low-pitch bellies, and joint separations.',
    included: [
      'Full 100+ foot self-leveling color video camera push',
      'Digital video recording link embedded directly in your report',
      'Depth and location pinpointing of defects',
      'Evaluation of cast iron, PVC, clay, and Orangeburg piping'
    ]
  },
  'pool-inspection': {
    name: 'Pool & Spa Inspection',
    price: '$300',
    icon: '04',
    headline: 'Comprehensive Swimming Pool, Spa & Equipment Diagnostic Evaluations',
    metaTitle: 'Pool & Spa Inspection Atlanta GA | $300 Flat',
    metaDescription: 'Certified swimming pool & spa inspection in Metro Atlanta. Pumps, heaters, electrical bonding, filtration & barrier safety audits. Flat $300 rate with 24-hr report.',
    description: 'Swimming pools and integrated spas involve high-voltage electricity, pressurized plumbing, structural gunite/vinyl membranes, and complex heating systems. Our InterNACHI Certified Pool Inspector verifies equipment operation, safety coping, GFCI and bonding compliance, surface integrity, and safety fencing.',
    included: [
      'Pump, filtration, and circulation system pressure testing',
      'Pool heater ignition, burner, and heat exchanger evaluation',
      'Electrical safety, GFCI, and equipotential bonding audit',
      'Safety barriers, self-latching gates, and anti-entrapment drains'
    ]
  },
  'pool-spa-inspection': {
    name: 'Pool & Spa Inspection',
    price: '$300',
    icon: '04',
    headline: 'Comprehensive Swimming Pool, Spa & Equipment Diagnostic Evaluations',
    metaTitle: 'Pool & Spa Inspection Atlanta GA | $300 Flat',
    metaDescription: 'Certified swimming pool & spa inspection in Metro Atlanta. Pumps, heaters, electrical bonding, filtration & barrier safety audits. Flat $300 rate with 24-hr report.',
    description: 'Swimming pools and integrated spas involve high-voltage electricity, pressurized plumbing, structural gunite/vinyl membranes, and complex heating systems. Our InterNACHI Certified Pool Inspector verifies equipment operation, safety coping, GFCI and bonding compliance, surface integrity, and safety fencing.',
    included: [
      'Pump, filtration, and circulation system pressure testing',
      'Pool heater ignition, burner, and heat exchanger evaluation',
      'Electrical safety, GFCI, and equipotential bonding audit',
      'Safety barriers, self-latching gates, and anti-entrapment drains'
    ]
  },
  'termite-inspection': {
    name: 'Termite & WDO Clearance Inspection',
    price: '$125+',
    icon: '05',
    headline: 'Official Georgia Wood Destroying Organism (WDO) Clearance Letters',
    metaTitle: 'Official Termite & WDO Inspection Atlanta GA | $125+',
    metaDescription: 'Official Georgia Wood Infestation (WDO) clearance letters for mortgage loans & buyers in Metro Atlanta. Fast scheduling, licensed inspection. From $125+.',
    description: 'Georgia is located in the highest-risk termite zone in North America (Zone 1). Subterranean termites, carpenter ants, and wood-boring beetles cause billions of dollars in structural damage annually. We inspect all crawlspaces, sill plates, foundation perimeters, and framing for active infestations and past damage.',
    included: [
      'Comprehensive crawlspace, basement, and foundation perimeter sweep',
      'Inspection for subterranean termites, carpenter ants, and powderpost beetles',
      'Identification of wood rot, high-moisture contact, and earth-to-wood conditions',
      'Official Georgia WDO clearance letter for lenders and mortgage closing'
    ]
  },
  'termite-wdo-inspection': {
    name: 'Termite & WDO Clearance Inspection',
    price: '$125+',
    icon: '05',
    headline: 'Official Georgia Wood Destroying Organism (WDO) Clearance Letters',
    metaTitle: 'Official Termite & WDO Inspection Atlanta GA | $125+',
    metaDescription: 'Official Georgia Wood Infestation (WDO) clearance letters for mortgage loans & buyers in Metro Atlanta. Fast scheduling, licensed inspection. From $125+.',
    description: 'Georgia is located in the highest-risk termite zone in North America (Zone 1). Subterranean termites, carpenter ants, and wood-boring beetles cause billions of dollars in structural damage annually. We inspect all crawlspaces, sill plates, foundation perimeters, and framing for active infestations and past damage.',
    included: [
      'Comprehensive crawlspace, basement, and foundation perimeter sweep',
      'Inspection for subterranean termites, carpenter ants, and powderpost beetles',
      'Identification of wood rot, high-moisture contact, and earth-to-wood conditions',
      'Official Georgia WDO clearance letter for lenders and mortgage closing'
    ]
  },
  'new-construction-inspection': {
    name: 'New Construction & Phased Inspection',
    price: 'From $400',
    icon: '06',
    headline: 'Independent Phased & Final New Construction Inspections in Metro Atlanta',
    metaTitle: 'New Construction Inspection Atlanta GA | From $400',
    metaDescription: 'Independent new construction & pre-drywall inspections in Metro Atlanta. 2 certified inspectors, thermal scans & builder punch lists. From $400.',
    description: 'Rushed building schedules, subcontractor turnover, and supply chain substitutions mean even custom brand-new homes in Metro Atlanta frequently have major concealed defects. Municipal code inspectors only spend 15 minutes on site. Our independent two-inspector team evaluates every system before final closing.',
    included: [
      'Pre-drywall framing, rough plumbing, electrical and HVAC audit',
      'Final phase complete mechanical, structural and cosmetic evaluation',
      'infrared thermal imaging to verify attic and wall insulation integrity',
      'Builder-ready digital punch list with photos and technical citations'
    ]
  },
  'pre-listing-inspection': {
    name: 'Pre-Listing Seller Inspection',
    price: 'From $365',
    icon: '07',
    headline: 'Sell With Confidence: Pre-Listing Inspections for Atlanta Homeowners',
    metaTitle: 'Pre-Listing Inspection Atlanta GA | From $365',
    metaDescription: 'Pre-listing seller home inspection in Metro Atlanta. Prevent deal-killers, negotiate from strength & close faster with a Certified Master Inspector. From $365.',
    description: 'When a buyer inspector finds unexpected major defects, negotiations stall or contracts fall through. A Pre-Listing Seller Inspection by Foresight gives you total transparency into your home condition before hitting the MLS, letting you make targeted repairs on your timeline.',
    included: [
      'Complete two-inspector evaluation of roof, HVAC, electrical, plumbing & foundation',
      'infrared thermal scan to catch hidden moisture or insulation gaps',
      'Prioritized repair roadmap to eliminate buyer negotiation leverage',
      'Shareable inspection report to build buyer confidence and justify asking price'
    ]
  },
  '11-month-warranty-inspection': {
    name: '11-Month Builder Warranty Inspection',
    price: 'From $335',
    icon: '06',
    headline: 'Protect Your New Construction Equity Before the 1-Year Builder Warranty Expires',
    metaTitle: '11-Month Warranty Inspection Atlanta | From $335',
    metaDescription: 'Independent 11-month builder warranty inspection in Metro Atlanta. 2 certified inspectors, infrared thermal scans & builder-ready punch lists before warranty expires.',
    description: 'Most new construction homes include a 1-year builder warranty covering materials and workmanship. Over the first year, homes settle, framing contracts, roof shingles experience storm cycles, and HVAC ductwork can detach. Our two-inspector team provides a comprehensive punch list backed by thermal imaging to submit directly to your builder.',
    included: [
      'Two certified inspectors on site for complete dual coverage',
      'infrared thermal imaging to verify attic and wall insulation integrity',
      'Roof, flashing, attic truss, and structural movement verification',
      'Digital punch-list report with photos formatted for builder warranty submissions'
    ]
  },
  'str-short-term-rental-inspection': {
    name: 'Short-Term Rental (STR) Inspection',
    price: 'From $395',
    icon: '08',
    headline: 'Safety, Code Compliance & Due Diligence for Airbnb & STR Investments',
    metaTitle: 'Airbnb & STR Inspection Atlanta GA | From $395',
    metaDescription: 'Short-term rental (STR) safety, liability & municipal compliance home inspections in Atlanta, DeKalb, Fulton & Gwinnett. Airbnb/VRBO safety audit from $395.',
    description: 'Operating a short-term rental in Metro Atlanta requires strict adherence to life-safety codes, electrical load capacities, and guest protection standards. Foresight provides investor-focused inspections verifying smoke/CO alarms, egress paths, water heater capacity, HVAC performance, and structural reliability.',
    included: [
      'Life-safety audit (egress windows, smoke/CO interconnectivity, handrails)',
      'High-occupancy mechanical load capacity verification',
      'Thermal imaging of electrical panels and HVAC distribution',
      'Municipal STR compliance checklist support'
    ]
  },
  'mold-testing': {
    name: 'Mold & Indoor Air Quality Testing',
    price: 'From $450',
    icon: '09',
    headline: 'Certified Spore Trap Air Quality & Mold Lab Diagnostics in Metro Atlanta',
    metaTitle: 'Certified Mold Testing Atlanta GA | Air Quality From $450',
    metaDescription: 'Certified mold testing & indoor air quality lab analysis in Metro Atlanta from $450. Spore trap air cassettes, moisture mapping & lab report. Call 678-480-2110!',
    description: 'Georgia\'s high humidity, red clay soil, and vented crawlspaces create optimal conditions for hidden toxic mold blooms (including Stachybotrys, Aspergillus, and Penicillium). Starting at $450, Certified Master Inspector® Christopher Boykin combines precision infrared thermal moisture mapping with calibrated spore-trap air sampling analyzed by an accredited independent microbiology laboratory, with optional surface swabs or extra samples available as needed.',
    included: [
      'Comprehensive moisture intrusion & thermal infrared wall/ceiling scan',
      'Calibrated baseline sampling (indoor air samples vs. outdoor control baseline, starts at $450)',
      'Spore trap cassette analysis for toxigenic & allergenic fungal species',
      'Optional surface swabs or additional zone air samples available (additional lab fees apply)',
      'Certified independent microbiology laboratory report within 24–48 hours',
      'Actionable remediation protocol recommendations if elevated spore counts are detected'
    ]
  },
  'mold-inspection': {
    name: 'Mold & Indoor Air Quality Testing',
    price: 'From $450',
    icon: '09',
    headline: 'Certified Spore Trap Air Quality & Mold Lab Diagnostics in Metro Atlanta',
    metaTitle: 'Certified Mold Testing Atlanta GA | Air Quality From $450',
    metaDescription: 'Certified mold testing & indoor air quality lab analysis in Metro Atlanta from $450. Spore trap air cassettes, moisture mapping & lab report. Call 678-480-2110!',
    description: 'Georgia\'s high humidity, red clay soil, and vented crawlspaces create optimal conditions for hidden toxic mold blooms (including Stachybotrys, Aspergillus, and Penicillium). Starting at $450, Certified Master Inspector® Christopher Boykin combines precision infrared thermal moisture mapping with calibrated spore-trap air sampling analyzed by an accredited independent microbiology laboratory, with optional surface swabs or extra samples available as needed.',
    included: [
      'Comprehensive moisture intrusion & thermal infrared wall/ceiling scan',
      'Calibrated baseline sampling (indoor air samples vs. outdoor control baseline, starts at $450)',
      'Spore trap cassette analysis for toxigenic & allergenic fungal species',
      'Optional surface swabs or additional zone air samples available (additional lab fees apply)',
      'Certified independent microbiology laboratory report within 24–48 hours',
      'Actionable remediation protocol recommendations if elevated spore counts are detected'
    ]
  },
  'commercial-property-inspection': {
    name: 'Commercial Real Estate Due Diligence & Property Condition Assessments',
    price: 'From $750',
    icon: '10',
    headline: 'Commercial Real Estate Due Diligence Inspection Services in Metro Atlanta',
    metaTitle: 'Commercial Real Estate Due Diligence Inspection Services Atlanta GA',
    metaDescription: '4.9★ Commercial real estate due diligence inspection services and ASTM E2018 Property Condition Assessments (PCA) in Metro Atlanta led by a CMI. Fast quotes!',
    description: 'Commercial real estate acquisitions carry substantial capital expenditure liabilities. From flat commercial roofing membranes and 3-phase high-voltage electrical switchgear to multi-zone rooftop HVAC units and ADA accessibility compliance, Foresight Home Inspections delivers forensic Property Condition Assessments adhering to ASTM E2018-15 standards.',
    included: [
      'ASTM E2018-15 compliant Property Condition Assessment (PCA) & Baseline Report',
      'Evaluation of commercial roof membranes, rooftop HVAC package units, and 3-phase electrical switchgear',
      'Immediate life-safety repair vs. 1-to-5 year capital replacement reserve cost tables',
      'ADA Title III accessibility compliance checklist and building envelope moisture diagnostics',
      'Full digital engineer-ready report delivered within 24–48 hours for investor underwriting'
    ]
  },
  'pre-drywall-inspection': {
    name: 'Pre-Drywall Framing & Mechanical Inspection',
    price: 'From $275',
    icon: '11',
    headline: 'Independent Pre-Drywall Inspections for New Builds Across Metro Atlanta',
    metaTitle: 'Pre-Drywall Inspections for New Builds Atlanta GA | From $275',
    metaDescription: '4.9★ Independent pre-drywall inspections for new builds in Metro Atlanta from $275. 2 certified inspectors audit structural framing, rough plumbing, electrical & HVAC!',
    description: 'Once drywall is hung, over 80% of your home structural framing, rough plumbing stacks, electrical loops, and HVAC ductwork become permanently sealed behind walls. Our two-inspector team conducts a comprehensive Phase 1 pre-drywall framing and mechanical audit before sheetrock concealment.',
    included: [
      'Two certified inspectors on site evaluating structural framing, roof trusses, and load headers',
      'Rough-in plumbing DWV, supply line pressure, and nail plate puncture safety audit',
      'Electrical rough-in wire routing, junction box placement, and circuit arc protection checks',
      'Attic and wall HVAC duct routing, airflow volume checks, and exterior air barrier alignment',
      'Builder-ready digital punch list with high-definition photos delivered within 24 hours'
    ]
  }
};

function loadCities() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function loadServicesPseo() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'services-pseo.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return Object.keys(SERVICE_MAP).map(service => ({ service }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const canonicalService = resolvedParams.service === 'termite-wdo-inspection' ? 'termite-inspection' :
                           resolvedParams.service === 'pool-spa-inspection' ? 'pool-inspection' :
                           resolvedParams.service === 'home-buyer-inspection' ? 'buyer-inspection' :
                           resolvedParams.service === 'mold-inspection' ? 'mold-testing' :
                           resolvedParams.service;
  const serviceData = SERVICE_MAP[canonicalService] || SERVICE_MAP[resolvedParams.service];
  if (!serviceData) {
    return { title: 'Service Not Found | Foresight' };
  }
  return {
    title: serviceData.metaTitle,
    description: serviceData.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/services/${canonicalService}`,
    },
    openGraph: {
      title: serviceData.metaTitle,
      description: serviceData.metaDescription,
      url: `${SITE_URL}/services/${canonicalService}`,
      type: 'website',
    },
  };
}

export default async function ServiceHubPage({ params }) {
  const resolvedParams = await params;
  const canonicalService = resolvedParams.service === 'termite-wdo-inspection' ? 'termite-inspection' :
                           resolvedParams.service === 'pool-spa-inspection' ? 'pool-inspection' :
                           resolvedParams.service === 'home-buyer-inspection' ? 'buyer-inspection' :
                           resolvedParams.service === 'mold-inspection' ? 'mold-testing' :
                           resolvedParams.service;
  const serviceData = SERVICE_MAP[canonicalService] || SERVICE_MAP[resolvedParams.service];
  if (!serviceData) {
    notFound();
  }

  const cities = loadCities();
  const servicesPseo = loadServicesPseo();
  const pseoMatch = servicesPseo.find(s => s.slug === canonicalService || s.slug === resolvedParams.service);

  const defaultFaqs = [
    {
      q: `Why does Foresight dispatch two certified inspectors for ${serviceData.name}?`,
      a: `Our signature Two-Inspector Protocol pairs Lead Certified Master Inspector® Christopher Boykin with a senior inspector, completing thorough structural, mechanical, and diagnostic checks in 1.5 to 2.5 hours rather than 4+ hours solo, eliminating fatigue and delivering double verification.`
    },
    {
      q: `How fast do I receive the ${serviceData.name} report?`,
      a: `All digital inspection reports are delivered within 24 hours (often the same evening). Reports include high-definition photos, thermal scans, drone imagery, and 1-click repair request list builders.`
    },
    {
      q: `What warranties are included with ${serviceData.name}?`,
      a: `Every standard home inspection includes up to $35,000 in combined warranty and guarantee protection: our $10,000 Elite Master Inspection Warranty ($0 deductible) plus InterNACHI's $25,000 Honor Guarantee.`
    },
    {
      q: `How much does ${serviceData.name} cost in Metro Atlanta?`,
      a: `${serviceData.name} pricing starts at ${serviceData.price} with transparent flat-rate pricing and no hidden mileage fees across our 50-mile Metro Atlanta service footprint.`
    }
  ];

  const activeFaqs = (pseoMatch?.faqs && pseoMatch.faqs.length > 0)
    ? pseoMatch.faqs.map(f => ({
        q: f.q.replace(/{city}/g, 'Metro Atlanta'),
        a: f.a.replace(/{city}/g, 'Metro Atlanta')
      }))
    : defaultFaqs;

  const serviceImages = {
    'sewer-scope-inspection': `${SITE_URL}/images/sewer-scope.png`,
    'pool-spa-inspection': `${SITE_URL}/images/pool-inspecting.png`,
    'pool-inspection': `${SITE_URL}/images/pool-inspecting.png`,
    'thermal-imaging': `${SITE_URL}/images/thermal-1.png`,
    'mold-testing': `${SITE_URL}/images/thermal-1.png`,
    'mold-inspection': `${SITE_URL}/images/thermal-1.png`,
    'termite-inspection': `${SITE_URL}/images/crawlspace.png`,
    'termite-wdo-inspection': `${SITE_URL}/images/crawlspace.png`,
    '11-month-warranty-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'pre-listing-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'new-construction-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'pre-drywall-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'commercial-property-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'buyer-inspection': `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`,
    'home-buyer-inspection': `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`
  };
  const primaryProductImage = serviceImages[canonicalService] || `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.name,
    "description": serviceData.description,
    "image": primaryProductImage,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "image": `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`,
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com",
      "url": SITE_URL,
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1816 South Deshon Road",
        "addressLocality": "Lithonia",
        "addressRegion": "GA",
        "postalCode": "30058",
        "addressCountry": "US"
      },
      "hasMap": "https://maps.google.com/?cid=10862078652033010531",
      "sameAs": [
        "https://maps.google.com/?cid=10862078652033010531",
        "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": `${serviceData.price.replace(/[^0-9]/g, '') || "345"}.00`,
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
      "validThrough": "2027-12-31",
      "validFrom": "2026-01-01",
      "availability": "https://schema.org/InStock",
      "url": `${SITE_URL}/services/${canonicalService}`
    }
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${serviceData.name} Package in Metro Atlanta`,
    "description": `Comprehensive ${serviceData.name.toLowerCase()} in Metro Atlanta by Certified Master Inspector Christopher Boykin of Foresight Home Inspections. Includes professional testing equipment, full digital report within 24 hours, and up to $35,000 in warranty protection.`,
    "image": [
      primaryProductImage,
      `${SITE_URL}/images/luxury-home.jpg`,
      `${SITE_URL}/images/Logopng.png`
    ],
    "sku": `FHI-HUB-${canonicalService.toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": "Foresight Home Inspections"
    },
    "offers": {
      "@type": "Offer",
      "price": `${serviceData.price.replace(/[^0-9]/g, '') || "345"}.00`,
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
      "validThrough": "2027-12-31",
      "validFrom": "2026-01-01",
      "availability": "https://schema.org/InStock",
      "url": `${SITE_URL}/services/${canonicalService}`,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US", "addressRegion": "GA" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "48",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Marcus Vance" },
        "datePublished": "2026-06-15",
        "reviewBody": "Christopher and his secondary inspector saved us thousands on our Atlanta home purchase. Their thermal camera caught a massive hidden moisture issue behind the master bath tile that standard inspectors missed.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a.replace(/<[^>]*>/g, '')
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1.25rem' }}>
            Specialized Inspection Service
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {serviceData.name} in Metro Atlanta
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, maxWidth: '750px', margin: '0 auto 2rem' }}>
            {serviceData.headline}. Transparent pricing starting at <strong style={{ color: 'var(--color-gold)' }}>{serviceData.price.replace(/^From\s+/i, '')}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.9rem 2rem' }}>
              Schedule {serviceData.name}
            </a>
            <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.9rem 2rem' }}>
              Calculate Instant Fee
            </Link>
          </div>
        </div>
      </section>

      {/* ── AEO / GEO DIRECT ANSWER & HARD-NUMBER EVIDENCE BOX (AI Overviews & LLM Scraping) ── */}
      <section style={{ background: '#F8FAFC', padding: '2rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderLeft: '5px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#0F172A', margin: 0, fontWeight: 700 }}>
                {serviceData.name} in Metro Atlanta: Verified Diagnostic Overview
              </h2>
              <span style={{ fontSize: '0.8rem', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                Verified 2026 Standards
              </span>
            </div>
            <p style={{ fontSize: '0.975rem', lineHeight: 1.65, color: '#334155', margin: '0 0 1rem 0' }}>
              <strong>Direct Answer (BLUF):</strong> Foresight Home Inspections delivers certified <strong>{serviceData.name.toLowerCase()}</strong> across 20 Metro Atlanta counties starting at <strong>{serviceData.price.replace(/^From\s+/i, '')}</strong>. Led by board-certified Certified Master Inspector® (CMI) Christopher Boykin, every inspection features two certified inspectors working simultaneously, cutting on-site disruption to 1.5–2.5 hours while delivering double verification. Reports are delivered digitally in under 24 hours backed by up to <strong>$35,000 in combined warranty protection</strong> ($10,000 Elite Master Warranty with $0 deductible + InterNACHI $25,000 Honor Guarantee).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', fontSize: '0.85rem', color: '#475569' }}>
              <div><strong>Lead Credential:</strong> Certified Master Inspector® (CMI)</div>
              <div><strong>Deployment:</strong> 2 Certified Inspectors (100% of jobs)</div>
              <div><strong>⏱️ Duration:</strong> 1.5–2.5 Hours (50% faster than solo)</div>
              <div><strong>Turnaround:</strong> Under 24 Hours (Same-Day Evening Avg.)</div>
              <div><strong>⭐ Rating:</strong> 4.9/5.0 (48+ Verified 5-Star Reviews)</div>
              <div><strong>Protection:</strong> $35,000 Warranty / Guarantee ($0 Deductible)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#0F172A', fontWeight: 800, marginBottom: '1rem' }}>
              Why Choose Foresight for {serviceData.name}?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {serviceData.description}
            </p>

            {canonicalService === 'new-construction-inspection' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#0F172A', color: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Image src="/images/internachi_new_construction_inspector.webp" alt="InterNACHI Certified New Construction Inspector" width={140} height={95} style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <h4 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>InterNACHI® Certified New Construction Inspector</h4>
                  <p style={{ margin: '0.35rem 0 0', color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Christopher Boykin holds specialized certification for phased residential builds, ensuring pre-pour foundation assessments, pre-drywall framing diagnostics, and pre-closing builder warranty inspections meet strict national structural standards.
                  </p>
                </div>
              </div>
            )}

            {canonicalService === '11-month-warranty-inspection' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#0F172A', color: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid rgba(212,175,55,0.3)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Image src="/images/11-month-warranty-logo.webp" alt="InterNACHI Certified 11th Month Warranty Inspector" width={100} height={100} style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
                  <Image src="/images/internachi_new_construction_inspector.webp" alt="InterNACHI Certified New Construction Inspector" width={140} height={95} style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h4 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>InterNACHI® Certified 11th Month Warranty Inspector</h4>
                  <p style={{ margin: '0.35rem 0 0', color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Specialized builder warranty verification. We audit structural settlement, roof truss movement, and envelope seal integrity to generate an airtight, photo-documented punch list formatted directly for your builder&apos;s warranty portal before month 12.
                  </p>
                </div>
              </div>
            )}

            {(canonicalService === 'thermal-imaging-inspection' || canonicalService === 'buyer-inspection' || canonicalService === 'home-buyer-inspection') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#0F172A', color: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid rgba(212,175,55,0.3)', flexWrap: 'wrap' }}>
                <Image src="/images/infrared-certified-logo.webp" alt="InterNACHI Infrared Certified Inspector" width={100} height={100} style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h4 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>InterNACHI® Infrared Certified® Inspector</h4>
                  <p style={{ margin: '0.35rem 0 0', color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Certified high-resolution radiometric infrared thermal imaging. We detect hidden plumbing seepage behind tile, electrical breaker hot spots, and missing attic insulation voids with zero drywall damage. Included on every inspection.
                  </p>
                </div>
              </div>
            )}

            {canonicalService === 'mold-testing' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#0F172A', color: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid rgba(52,211,153,0.3)' }}>
                <Image src="/images/internachi_moisture_intrusion_inspector.webp" alt="InterNACHI Certified Moisture Intrusion Inspector" width={90} height={90} style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <h4 style={{ color: '#34d399', margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>InterNACHI® Certified Moisture Intrusion Inspector</h4>
                  <p style={{ margin: '0.35rem 0 0', color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Certified building envelope and moisture science diagnostics. We pinpoint active condensation points, plumbing seepage, and crawlspace relative humidity to identify mold breeding grounds before taking calibrated indoor air spore trap samples.
                  </p>
                </div>
              </div>
            )}

            {canonicalService === 'str-short-term-rental-inspection' && (
              <StrComplianceChecklist />
            )}

            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-gold)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: 700, marginBottom: '1rem' }}>
                What&apos;s Included in Every Evaluation:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {serviceData.included.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#334155', fontSize: '1rem' }}>
                    <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISIBLE BUYER FAQ ACCORDION (Steve Chou Category Page Doctrine) ── */}
      <section className="section bg-white" style={{ padding: '3.5rem 0', borderTop: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.4)', marginBottom: '0.75rem' }}>
              Frequently Asked Questions
            </span>
            <h2 style={{ fontSize: '2rem', color: '#0F172A', fontWeight: 800 }}>
              {serviceData.name} FAQs for Georgia Homeowners &amp; Buyers
            </h2>
          </div>
          <div>
            {activeFaqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: '#F8FAFC',
                }}
              >
                <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', color: '#0F172A' }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.7, color: '#334155', fontSize: '0.975rem' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 87 City Silo Directory Grid */}
      <section className="section" style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.75rem' }}>
              {serviceData.name} Service Coverage by City
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
              Select your local municipality to view localized soil risks, local infrastructure notes, and dedicated scheduling options.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {cities.map((city) => {
              const citySlug = city.Slug || city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const cityName = city['City Name'];
              const pseoServices = [
                'radon-testing',
                'termite-inspection',
                'sewer-scope-inspection',
                'new-construction-inspection',
                'pool-inspection',
                'pre-listing-inspection',
                'mold-testing',
                'buyer-inspection',
                '11-month-warranty-inspection'
              ];
              const href = pseoServices.includes(canonicalService)
                ? `/services/${canonicalService}/${citySlug}`
                : `/service-areas/${citySlug}`;

              return (
                <Link
                  key={citySlug}
                  href={href}
                  prefetch={false}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem 1.25rem',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'none',
                    color: '#0F172A',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s, transform 0.2s'
                  }}
                >
                  <span>{cityName}</span>
                  <span style={{ color: 'var(--color-red)', fontSize: '0.85rem' }}>&rarr;</span>
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
            <GooglePreferredSource variant="card" />
          </div>
        </div>
      </section>
    </>
  );
}
