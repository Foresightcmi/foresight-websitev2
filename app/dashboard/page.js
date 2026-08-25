import fs from 'fs';
import path from 'path';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Foresight SEO & Rankings Command Center | Loop Engineering',
  description: 'Real-time SEO ranking dashboard, loop engineering monitor, and pSEO matrix tracker for Foresight Home Inspections.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function DashboardPage() {
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
  const citiesFilePath = path.join(process.cwd(), 'data', 'cities.json');
  const servicesFilePath = path.join(process.cwd(), 'data', 'services-pseo.json');
  const defectsFilePath = path.join(process.cwd(), 'data', 'defects-pseo.json');
  const comparisonsFilePath = path.join(process.cwd(), 'data', 'comparisons-pseo.json');

  let posts = [];
  let cities = [];
  let services = [];
  let defects = [];
  let comparisons = [];

  try {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
    cities = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8'));
    services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    defects = JSON.parse(fs.readFileSync(defectsFilePath, 'utf8'));
    comparisons = JSON.parse(fs.readFileSync(comparisonsFilePath, 'utf8'));
  } catch (e) {
    console.error('Error loading data files for dashboard:', e);
  }

  const inventory = {
    totalStaticPages: 611,
    totalPosts: posts.length,
    totalCities: cities.length,
    totalServices: services.length,
    totalSilos: cities.length * services.length,
    totalDefects: defects.length,
    totalComparisons: comparisons.length
  };

  const initialKeywords = [
    {
      keyword: 'home inspector Atlanta GA',
      category: 'Head Term',
      url: '/',
      intent: 'Commercial (High)',
    },
    {
      keyword: 'best home inspector Atlanta',
      category: 'Head Term',
      url: '/',
      intent: 'Transactional',
    },
    {
      keyword: 'home inspection cost Atlanta',
      category: 'Pricing',
      url: '/quote',
      intent: 'Transactional',
    },
    {
      keyword: 'home inspector Sandy Springs GA',
      category: 'Local pSEO',
      url: '/service-areas/sandy-springs',
      intent: 'High Commercial',
    },
    {
      keyword: 'home inspector Alpharetta GA',
      category: 'Local pSEO',
      url: '/service-areas/alpharetta',
      intent: 'High Commercial',
    },
    {
      keyword: 'home inspection Johns Creek GA',
      category: 'Local pSEO',
      url: '/service-areas/johns-creek',
      intent: 'High Commercial',
    },
    {
      keyword: 'home inspector Marietta GA',
      category: 'Local pSEO',
      url: '/service-areas/marietta',
      intent: 'High Commercial',
    },
    {
      keyword: 'home inspector Decatur GA',
      category: 'Local pSEO',
      url: '/service-areas/decatur',
      intent: 'High Commercial',
    },
    {
      keyword: 'radon testing Atlanta GA',
      category: 'Sub-Niche Silo',
      url: '/services/radon-testing/atlanta',
      intent: 'Transactional ($200)',
    },
    {
      keyword: 'sewer scope inspection Atlanta',
      category: 'Sub-Niche Silo',
      url: '/services/sewer-scope-inspection/atlanta',
      intent: 'Transactional ($425)',
    },
    {
      keyword: 'pool inspection Atlanta GA',
      category: 'Sub-Niche Silo',
      url: '/services/pool-inspection/atlanta',
      intent: 'Transactional ($300)',
    },
    {
      keyword: '11 month warranty inspection near me',
      category: 'Pillar Guide',
      url: '/blog/11-month-warranty-inspection-guide-atlanta',
      intent: 'Commercial ($335+)',
    },
    {
      keyword: 'pre drywall inspection Georgia',
      category: 'Pillar Guide',
      url: '/blog/pre-drywall-framing-inspection-georgia-new-construction',
      intent: 'High-Intent',
    },
    {
      keyword: 'stucco EIFS moisture inspection Atlanta',
      category: 'Defect Diagnostic',
      url: '/defects/stucco-eifs-moisture-inspection',
      intent: 'Technical AEO',
    },
    {
      keyword: 'two inspector team vs single inspector',
      category: 'Decision Framework',
      url: '/compare/two-inspector-team-vs-single-inspector',
      intent: 'Comparison Closer',
    },
    {
      keyword: 'short term rental STR compliance Atlanta',
      category: 'Specialized Silo',
      url: '/blog/metro-atlanta-short-term-rental-str-compliance-assist-guide',
      intent: 'Commercial ($355+)',
    },
    {
      keyword: 'DeKalb County housing bond inspection',
      category: 'Municipal B2G',
      url: '/blog/pre-rehab-post-rehab-inspections-dekalb',
      intent: 'B2G Contractor',
    }
  ];

  return (
    <DashboardClient 
      initialKeywords={initialKeywords}
      inventory={inventory}
    />
  );
}
