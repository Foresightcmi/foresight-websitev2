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
  const countiesFilePath = path.join(process.cwd(), 'data', 'counties-pseo.json');
  const servicesFilePath = path.join(process.cwd(), 'data', 'services-pseo.json');
  const defectsFilePath = path.join(process.cwd(), 'data', 'defects-pseo.json');
  const comparisonsFilePath = path.join(process.cwd(), 'data', 'comparisons-pseo.json');
  const neighborhoodsFilePath = path.join(process.cwd(), 'data', 'neighborhoods-pseo.json');

  let posts = [];
  let cities = [];
  let counties = [];
  let services = [];
  let defects = [];
  let comparisons = [];
  let neighborhoods = [];

  try {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
    cities = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8'));
    counties = JSON.parse(fs.readFileSync(countiesFilePath, 'utf8'));
    services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    defects = JSON.parse(fs.readFileSync(defectsFilePath, 'utf8'));
    comparisons = JSON.parse(fs.readFileSync(comparisonsFilePath, 'utf8'));
    neighborhoods = JSON.parse(fs.readFileSync(neighborhoodsFilePath, 'utf8'));
  } catch (e) {
    console.error('Error loading data files for dashboard:', e);
  }

  const allKeywords = [];

  // 1. Core Head Terms
  allKeywords.push(
    {
      keyword: 'home inspector Atlanta GA',
      category: 'Head Term',
      county: 'Fulton',
      url: '/',
      intent: 'Commercial (High)'
    },
    {
      keyword: 'best home inspector Atlanta',
      category: 'Head Term',
      county: 'Fulton',
      url: '/',
      intent: 'Transactional'
    },
    {
      keyword: 'home inspection cost Atlanta',
      category: 'Pricing',
      county: 'All',
      url: '/quote',
      intent: 'Transactional'
    }
  );

  // 2. All 20 County Hubs
  for (const c of counties) {
    allKeywords.push({
      keyword: `home inspector ${c.name} GA`,
      category: 'County Hub',
      county: c.name.replace(' County', ''),
      url: `/service-areas/counties/${c.slug}`,
      intent: 'Regional Hub'
    });
  }

  // 3. All 87 City Landing Pages
  for (const city of cities) {
    const slug = city.Slug || city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    allKeywords.push({
      keyword: `home inspector ${city['City Name']} GA`,
      category: 'City pSEO',
      county: city.County || 'Metro Atlanta',
      url: `/service-areas/${slug}`,
      intent: 'Local Commercial'
    });
  }

  // 4. All Service Silos across All Cities (522 Silos)
  for (const s of services) {
    for (const city of cities) {
      const citySlug = city.Slug || city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      allKeywords.push({
        keyword: `${s.name} ${city['City Name']} GA`,
        category: s.name,
        county: city.County || 'Metro Atlanta',
        url: `/services/${s.slug}/${citySlug}`,
        intent: 'Sub-Niche Silo'
      });
    }
  }

  // 5. All 26 Pillar Blog Posts
  for (const post of posts) {
    allKeywords.push({
      keyword: post.targetKeyword || post.title,
      category: 'Pillar Guide',
      county: 'All',
      url: `/blog/${post.slug}`,
      intent: 'High-Intent Guide'
    });
  }

  // 6. All 10 Luxury & Historic Neighborhood Hubs
  for (const n of neighborhoods) {
    allKeywords.push({
      keyword: `${n.name} home inspection Atlanta`,
      category: 'Luxury Neighborhood',
      county: n.county || 'Fulton/DeKalb',
      url: `/neighborhoods/${n.slug}`,
      intent: 'Historic/Luxury Hub'
    });
  }

  // 7. All 6 Defect Guides
  for (const d of defects) {
    allKeywords.push({
      keyword: d.targetKeyword || `${d.title} Atlanta`,
      category: 'Defect Diagnostic',
      county: 'All',
      url: `/defects/${d.slug}`,
      intent: 'AEO Technical'
    });
  }

  // 8. All 4 Comparison Guides
  for (const c of comparisons) {
    allKeywords.push({
      keyword: c.targetKeyword || c.title,
      category: 'Decision Framework',
      county: 'All',
      url: `/compare/${c.slug}`,
      intent: 'Comparison Closer'
    });
  }

  const inventory = {
    totalStaticPages: 703,
    totalPosts: posts.length,
    totalCities: cities.length,
    totalCounties: counties.length,
    totalServices: services.length,
    totalSilos: cities.length * services.length,
    totalDefects: defects.length,
    totalComparisons: comparisons.length,
    totalNeighborhoods: neighborhoods.length,
    totalTrackedKeywords: allKeywords.length
  };

  return (
    <DashboardClient 
      initialKeywords={allKeywords}
      inventory={inventory}
    />
  );
}
