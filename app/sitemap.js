import fs from 'fs';
import path from 'path';

export default async function sitemap() {
  const CITIES_FILE = path.join(process.cwd(), 'data', 'cities.json');
  const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');
  
  const baseUrl = 'https://www.fhinspectionsatl.com';
  const routes = [];
  
  // 1. Static Pages
  const staticPages = [
    { loc: '', changefreq: 'weekly', priority: 1.0 },
    { loc: '/services', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/municipal-rehab-inspections', changefreq: 'monthly', priority: 0.85 },
    { loc: '/samples', changefreq: 'monthly', priority: 0.85 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/realtors', changefreq: 'monthly', priority: 0.8 },
    { loc: '/quote', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ask-twin', changefreq: 'monthly', priority: 0.5 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
    { loc: '/due-diligence', changefreq: 'weekly', priority: 0.9 },
    { loc: '/neighborhoods', changefreq: 'weekly', priority: 0.85 },
    { loc: '/service-areas', changefreq: 'monthly', priority: 0.7 },
    { loc: '/service-areas/dekalb-county-compliance', changefreq: 'monthly', priority: 0.85 },
    { loc: '/free-utility-setup', changefreq: 'monthly', priority: 0.8 },
    { loc: '/review', changefreq: 'monthly', priority: 0.8 },
    { loc: '/faq', changefreq: 'monthly', priority: 0.7 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/terms', changefreq: 'yearly', priority: 0.3 }
  ];
  
  const now = new Date();
  
  for (const page of staticPages) {
    routes.push({
      url: `${baseUrl}${page.loc}`,
      lastModified: now,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  }
  
  // 2. Dynamic City Landing Pages
  if (fs.existsSync(CITIES_FILE)) {
    try {
      const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
      for (const city of cities) {
        const slug = city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const lastMod = city['Last Refreshed'] 
          ? new Date(city['Last Refreshed']) 
          : now;
          
        routes.push({
          url: `${baseUrl}/service-areas/${slug}`,
          lastModified: lastMod,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    } catch (err) {
      console.error('Error reading cities in sitemap.js:', err);
    }
  }
  
  // 3. Dynamic Blog Pages
  if (fs.existsSync(POSTS_FILE)) {
    try {
      const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
      for (const post of posts) {
        const lastMod = post.date 
          ? new Date(post.date) 
          : now;
          
        routes.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: lastMod,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    } catch (err) {
      console.error('Error reading posts in sitemap.js:', err);
    }
  }

  // 4. Dynamic pSEO Service x City Pages
  const SERVICES_PSEO_FILE = path.join(process.cwd(), 'data', 'services-pseo.json');
  if (fs.existsSync(CITIES_FILE) && fs.existsSync(SERVICES_PSEO_FILE)) {
    try {
      const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
      const services = JSON.parse(fs.readFileSync(SERVICES_PSEO_FILE, 'utf8'));

      for (const service of services) {
        for (const city of cities) {
          const citySlug = city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
          routes.push({
            url: `${baseUrl}/services/${service.slug}/${citySlug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
          });
        }
      }
    } catch (err) {
      console.error('Error adding pSEO routes in sitemap.js:', err);
    }
  }

  // 5. Dynamic Defect Audit Pages
  const DEFECTS_FILE = path.join(process.cwd(), 'data', 'defects-pseo.json');
  if (fs.existsSync(DEFECTS_FILE)) {
    try {
      const defects = JSON.parse(fs.readFileSync(DEFECTS_FILE, 'utf8'));
      for (const d of defects) {
        routes.push({
          url: `${baseUrl}/defects/${d.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    } catch (err) {
      console.error('Error reading defects in sitemap.js:', err);
    }
  }

  // 6. Dynamic Comparison Framework Pages
  const COMPARISONS_FILE = path.join(process.cwd(), 'data', 'comparisons-pseo.json');
  if (fs.existsSync(COMPARISONS_FILE)) {
    try {
      const comparisons = JSON.parse(fs.readFileSync(COMPARISONS_FILE, 'utf8'));
      for (const c of comparisons) {
        routes.push({
          url: `${baseUrl}/compare/${c.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    } catch (err) {
      console.error('Error reading comparisons in sitemap.js:', err);
    }
  }

  // 7. Dynamic Neighborhood & Subdivision Hubs
  const NEIGHBORHOODS_FILE = path.join(process.cwd(), 'data', 'neighborhoods-pseo.json');
  if (fs.existsSync(NEIGHBORHOODS_FILE)) {
    try {
      const neighborhoods = JSON.parse(fs.readFileSync(NEIGHBORHOODS_FILE, 'utf8'));
      for (const n of neighborhoods) {
        routes.push({
          url: `${baseUrl}/neighborhoods/${n.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.85,
        });
      }
    } catch (err) {
      console.error('Error reading neighborhoods in sitemap.js:', err);
    }
  }

  // 8. Dynamic County Landing Hubs
  const COUNTIES_FILE = path.join(process.cwd(), 'data', 'counties-pseo.json');
  if (fs.existsSync(COUNTIES_FILE)) {
    try {
      const counties = JSON.parse(fs.readFileSync(COUNTIES_FILE, 'utf8'));
      for (const c of counties) {
        routes.push({
          url: `${baseUrl}/service-areas/counties/${c.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.85,
        });
      }
    } catch (err) {
      console.error('Error reading counties in sitemap.js:', err);
    }
  }

  return routes;
}


