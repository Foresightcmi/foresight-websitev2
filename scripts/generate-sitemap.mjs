#!/usr/bin/env node
/**
 * Physical Sitemap XML Generator for Foresight Home Inspections
 * 
 * Compiles a physical public/sitemap.xml file from the cities and posts databases.
 * This guarantees the sitemap is served with the correct XML mime-type (application/xml)
 * and bypasses any next.js dynamic route or server routing issues.
 * 
 * Usage: node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');
const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');
const SITEMAP_OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml');

const baseUrl = 'https://www.fhinspectionsatl.com';

function main() {
  console.log('📡 Generating physical public/sitemap.xml...');

  const urls = [];

  // 1. Static Pages
  const staticPages = [
    { loc: '', changefreq: 'weekly', priority: '1.0' },
    { loc: '/services', changefreq: 'monthly', priority: '0.8' },
    { loc: '/quote', changefreq: 'weekly', priority: '0.9' },
    { loc: '/ask-twin', changefreq: 'daily', priority: '0.9' },
    { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/service-areas', changefreq: 'monthly', priority: '0.7' }
  ];

  const nowString = new Date().toISOString();

  for (const page of staticPages) {
    let imgTag = '';
    if (page.loc === '') {
      imgTag = `\n    <image:image>\n      <image:loc>${baseUrl}/images/Logopng.png</image:loc>\n      <image:title>Foresight Home Inspections Logo</image:title>\n    </image:image>`;
    } else if (page.loc === '/services') {
      imgTag = `\n    <image:image>\n      <image:loc>${baseUrl}/images/ac-pic.png</image:loc>\n      <image:title>Foresight Home Inspections HVAC Inspection</image:title>\n    </image:image>`;
    }

    urls.push(`  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${nowString}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imgTag}
  </url>`);
  }

  // 2. Dynamic City Landing Pages
  if (fs.existsSync(CITIES_FILE)) {
    try {
      const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
      console.log(`🏘️  Found ${cities.length} cities in database`);
      
      for (const city of cities) {
        const slug = city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const lastMod = city['Last Refreshed'] 
          ? new Date(city['Last Refreshed']).toISOString() 
          : nowString;

        urls.push(`  <url>
    <loc>${baseUrl}/service-areas/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    } catch (err) {
      console.error(`❌ Error parsing cities database: ${err.message}`);
    }
  } else {
    console.warn(`⚠️  Cities database not found at ${CITIES_FILE}`);
  }

  // 3. Dynamic Blog Pages
  if (fs.existsSync(POSTS_FILE)) {
    try {
      const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
      console.log(`📚 Found ${posts.length} blog posts in database`);
      
      for (const post of posts) {
        const lastMod = post.date 
          ? new Date(post.date).toISOString() 
          : nowString;

        urls.push(`  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
      }
    } catch (err) {
      console.error(`❌ Error parsing blog database: ${err.message}`);
    }
  } else {
    console.warn(`⚠️  Blog database not found at ${POSTS_FILE}`);
  }

  // 4. Compile XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(SITEMAP_OUTPUT, xmlContent, 'utf8');
  console.log(`🎉 Physical sitemap successfully written to ${SITEMAP_OUTPUT}! (${urls.length} URLs total)\n`);
}

main();
