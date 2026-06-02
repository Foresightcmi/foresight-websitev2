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
    { loc: '/realtors', changefreq: 'monthly', priority: 0.8 },
    { loc: '/quote', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ask-twin', changefreq: 'daily', priority: 0.9 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.6 },
    { loc: '/service-areas', changefreq: 'monthly', priority: 0.7 }
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
  
  return routes;
}
