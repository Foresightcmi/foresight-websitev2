import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CITIES_FILE = path.join(ROOT_DIR, 'data', 'cities.json');
const SERVICES_PSEO_FILE = path.join(ROOT_DIR, 'data', 'services-pseo.json');
const QUEUE_FILE = path.join(ROOT_DIR, 'data', 'striking-distance-queue.json');
const GSC_SNAPSHOT_FILE = path.join(ROOT_DIR, 'data', 'analytics', 'gsc-snapshot-latest.json');

console.log('🚀 Optimizing Meta Titles & Descriptions for Striking-Distance SERP Dominance...');

// 1. Optimize 87 Cities in data/cities.json
const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
let updatedCitiesCount = 0;

function formatCityTitle(name) {
  const base = `Home Inspection ${name} GA`;
  if ((base + ' | 2 Certified Inspectors | $345').length <= 60) {
    return base + ' | 2 Certified Inspectors | $345';
  }
  if ((base + ' | 2 Certified Inspectors $345').length <= 60) {
    return base + ' | 2 Certified Inspectors $345';
  }
  if ((base + ' | 2 Inspectors | $345').length <= 60) {
    return base + ' | 2 Inspectors | $345';
  }
  return base + ' | 2 Inspectors $345';
}

function formatCityDesc(name) {
  const base = `4.9★ ${name} home inspection from $345. Two certified inspectors on every job led by a CMI. Free FLIR thermal, 4K drones & $10k warranty. Fast 24-hr reports!`;
  if (base.length <= 158) return base;
  const opt2 = `4.9★ ${name} home inspection from $345. 2 certified inspectors on every job led by a CMI. Free thermal, 4K drones & $10k warranty. Fast 24-hr reports!`;
  if (opt2.length <= 158) return opt2;
  return `4.9★ ${name} home inspection from $345. 2 certified inspectors led by a CMI. Free thermal, 4K drones & $10k warranty. 24-hr report!`;
}

for (const city of cities) {
  const name = city['City Name'];
  city['Meta Title'] = formatCityTitle(name);
  city['Meta Description'] = formatCityDesc(name);
  updatedCitiesCount++;
}

fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');
console.log(`✅ Updated ${updatedCitiesCount} cities in data/cities.json with front-loaded, high-CTR titles and descriptions.`);

// 2. Optimize pSEO Services in data/services-pseo.json
const services = JSON.parse(fs.readFileSync(SERVICES_PSEO_FILE, 'utf8'));

const serviceOptimizations = {
  'sewer-scope-inspection': {
    metaTitle: '{city} Sewer Camera Inspection | HD Video $450 | Foresight',
    metaDescription: 'HD sewer camera inspection in {city}, GA. Avoid $15,000 underground repairs! Detect root intrusion & cracked pipes before closing. Flat $450 with HD video.'
  },
  'radon-testing': {
    metaTitle: '{city} Radon Testing GA | 48-Hr EPA Monitor $275 | Foresight',
    metaDescription: '48-hour continuous electronic radon testing in {city}, GA. Precision hourly pCi/L readings & same-day report. EPA compliant. Flat $275 rate. Instant booking!'
  },
  'pool-inspection': {
    metaTitle: '{city} Pool & Spa Inspection | $300 Flat Rate | Foresight',
    metaDescription: 'Certified pool & spa inspection in {city}, GA. Pumps, heaters, electrical GFCI bonding & safety barriers evaluated. Flat $300 rate. Fast 24-hr reports!'
  },
  'termite-inspection': {
    metaTitle: '{city} Termite Inspection GA | Official WDO $125 | Foresight',
    metaDescription: 'Official Georgia WDO termite clearance inspection in {city}, GA. Licensed structural wood infestation report for mortgage closings from $125. Fast scheduling!'
  },
  '11-month-warranty-inspection': {
    metaTitle: '{city} 11-Month Warranty Inspection | From $335 | Foresight',
    metaDescription: 'Beat your 1-year builder deadline in {city}, GA! Certified Master Inspector punch list with FLIR thermal scans from $335. Builder-ready report in 24 hrs.'
  },
  'new-construction-inspection': {
    metaTitle: '{city} New Construction Inspection | From $400 | Foresight',
    metaDescription: 'Independent new build inspection in {city}, GA. 2 certified inspectors uncover defects municipal code checks miss. FLIR thermal included. From $400.'
  },
  'pre-listing-inspection': {
    metaTitle: '{city} Pre-Listing Inspection GA | From $365 | Foresight',
    metaDescription: 'Pre-listing seller inspection in {city}, GA. Prevent deal-killing surprises, protect your asking price & close faster. 2 inspectors from $365. 24-hr report.'
  },
  'buyer-inspection': {
    metaTitle: '{city} Home Inspection GA | 2 Certified Inspectors | $345',
    metaDescription: 'Top-rated {city}, GA home inspection from $345. Two certified inspectors on every job led by a CMI. Free FLIR thermal, 4K drones & $10,000 warranty included!'
  },
  'pre-drywall-inspection': {
    metaTitle: '{city} Pre-Drywall Inspection | Phase 2 From $275 | Foresight',
    metaDescription: 'Pre-drywall framing & mechanical inspection in {city}, GA. Inspect framing, rough plumbing, electrical & HVAC rough-ins before drywall from $275.'
  },
  'commercial-property-inspection': {
    metaTitle: '{city} Commercial Inspection | CMI Due Diligence | Foresight',
    metaDescription: 'Commercial property condition assessment (PCA) in {city}, GA led by a Certified Master Inspector®. Retail, office, industrial & multi-family due diligence.'
  },
  'mold-testing': {
    metaTitle: '{city} Mold & Air Quality Testing | Lab Analysis $250 | Foresight',
    metaDescription: 'Certified mold inspection & indoor air quality testing in {city}, GA. Baseline indoor vs outdoor air sampling + accredited independent lab analysis from $250.'
  }
};

for (const s of services) {
  if (serviceOptimizations[s.slug]) {
    s.metaTitle = serviceOptimizations[s.slug].metaTitle;
    s.metaDescription = serviceOptimizations[s.slug].metaDescription;
  }
}

fs.writeFileSync(SERVICES_PSEO_FILE, JSON.stringify(services, null, 2), 'utf8');
console.log('✅ Updated data/services-pseo.json with striking-distance entity titles & CTR descriptions.');

// 3. Build comprehensive striking-distance queue from live GSC data
if (fs.existsSync(GSC_SNAPSHOT_FILE)) {
  const gscData = JSON.parse(fs.readFileSync(GSC_SNAPSHOT_FILE, 'utf8'));
  const allQueries = gscData.queries || [];
  
  // Striking distance: positions 8.0 to 20.0, sorted by impressions
  const striking = allQueries
    .filter(q => q.position >= 8.0 && q.position <= 20.0)
    .sort((a, b) => b.impressions - a.impressions);

  const topOpportunities = striking.slice(0, 50).map((item, idx) => {
    const query = item.keys[0];
    const imp = item.impressions;
    const pos = item.position;
    const ctr = item.ctr;

    // Detect target url
    let targetPage = '/';
    let enrichmentHook = '';
    
    if (query.includes('sewer')) {
      targetPage = '/services/sewer-scope-inspection';
      enrichmentHook = 'Flat-Rate $450 HD Sewer Camera Inspection: Preventing $15,000 Main Line Replacements';
    } else if (query.includes('radon')) {
      targetPage = '/services/radon-testing';
      enrichmentHook = 'Continuous 48-Hour Electronic Radon Monitoring ($275) Across Georgia Granite Belt';
    } else if (query.includes('pool')) {
      targetPage = '/services/pool-inspection';
      enrichmentHook = 'Complete Swimming Pool & Spa Safety & Equipment Diagnostics ($300 Flat)';
    } else if (query.includes('warranty') || query.includes('11 month')) {
      targetPage = '/services/11-month-warranty-inspection';
      enrichmentHook = 'Independent 11-Month Builder Warranty Audit: Finding Concealed Omissions Before Month 12';
    } else if (query.includes('new construction') || query.includes('pre-drywall')) {
      targetPage = '/services/new-construction-inspection';
      enrichmentHook = 'Independent New Construction Phased Inspections from $400';
    } else if (query.includes('pre-listing')) {
      targetPage = '/services/pre-listing-inspection';
      enrichmentHook = 'Certified Pre-Listing Seller Inspection: Eliminate Buyer Price Chipping from $365';
    } else {
      // Check for city name
      const matchedCity = cities.find(c => query.toLowerCase().includes(c['City Name'].toLowerCase()));
      if (matchedCity) {
        const slug = matchedCity['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
        targetPage = `/service-areas/${slug}`;
        enrichmentHook = `${matchedCity['City Name']} Home Inspections: Two Certified Inspectors on Every Job from $345`;
      } else {
        targetPage = '/services';
        enrichmentHook = 'Atlanta Home Inspection Pricing & Two-Inspector Precision from $345';
      }
    }

    return {
      rankIndex: idx + 1,
      query,
      currentPosition: Number(pos.toFixed(1)),
      impressions: imp,
      currentCtr: Number((ctr * 100).toFixed(1)),
      targetPage,
      targetUrlFull: `https://www.fhinspectionsatl.com${targetPage}`,
      enrichmentHook,
      status: 'OPTIMIZED_AND_LIVE'
    };
  });

  const updatedQueue = {
    analyzedAt: new Date().toISOString(),
    framework: 'Striking-Distance Query Climber (Positions 8 to 20)',
    totalInStrikingDistance: striking.length,
    topOpportunitiesCount: topOpportunities.length,
    opportunities: topOpportunities
  };

  fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2), 'utf8');
  console.log(`✅ Generated updated striking-distance queue with ${topOpportunities.length} top commercial targets in ${QUEUE_FILE}. Total in striking distance: ${striking.length}.`);
}

console.log('🎉 Striking-Distance optimization pass completed successfully.');
