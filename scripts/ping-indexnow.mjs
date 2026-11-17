#!/usr/bin/env node
/**
 * IndexNow Pinger — Instant indexing for Bing, Yandex, Naver, Seznam
 * 
 * Submits recently updated URLs to search engines via the IndexNow protocol
 * so they index new content within minutes instead of days.
 * 
 * Usage: node scripts/ping-indexnow.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://www.fhinspectionsatl.com';
// IndexNow key — this is public and safe to commit
const INDEXNOW_KEY = 'foresighthomeinspections2026';

async function main() {
  console.log('📡 IndexNow Pinger — Starting...\n');

  // Collect priority newly shipped hubs & all URLs that may have changed recently
  const urls = [
    SITE_URL,
    `${SITE_URL}/about/christopher-boykin`,
    `${SITE_URL}/homebuyer-red-flags`,
    `${SITE_URL}/homeowner-care`,
    `${SITE_URL}/neighborhoods`,
  ];

  // Add all concentric neighborhood hub pages
  const neighborhoodsFile = path.join(__dirname, '..', 'data', 'neighborhoods-pseo.json');
  if (fs.existsSync(neighborhoodsFile)) {
    const neighborhoods = JSON.parse(fs.readFileSync(neighborhoodsFile, 'utf8'));
    for (const n of neighborhoods) {
      if (n && n.slug) urls.push(`${SITE_URL}/neighborhoods/${n.slug}`);
    }
  }

  urls.push(
    `${SITE_URL}/ai-fact-sheet`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/llms-full.txt`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/services`,
    `${SITE_URL}/services/municipal-rehab-inspections`,
    `${SITE_URL}/service-areas`,
    `${SITE_URL}/service-areas/counties`,
    `${SITE_URL}/faq`,
    `${SITE_URL}/review`,
    `${SITE_URL}/mcp`,
    `${SITE_URL}/privacy`,
    `${SITE_URL}/terms`
  );

  // Add all 26 SEO Colony FAQ guides
  const colonyFile = path.join(__dirname, '..', 'data', 'seo-colony-matrix.json');
  if (fs.existsSync(colonyFile)) {
    const colony = JSON.parse(fs.readFileSync(colonyFile, 'utf8'));
    for (const q of (colony.questions || [])) {
      if (q && q.slug) urls.push(`${SITE_URL}/faq/${q.slug}`);
    }
  }

  // Add recent blog posts
  const postsFile = path.join(__dirname, '..', 'data', 'posts.json');
  if (fs.existsSync(postsFile)) {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    // Only ping posts from last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    posts
      .filter(p => p.date >= weekAgo)
      .forEach(p => urls.push(`${SITE_URL}/blog/${p.slug}`));
  }

  // Add recently refreshed city pages
  const refreshLog = path.join(__dirname, '..', 'data', 'refresh-log.json');
  if (fs.existsSync(refreshLog)) {
    const log = JSON.parse(fs.readFileSync(refreshLog, 'utf8'));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    Object.entries(log).forEach(([city, date]) => {
      if (date >= weekAgo) {
        const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        urls.push(`${SITE_URL}/service-areas/${slug}`);
      }
    });
  }

  // Add all 50 GSC Leak Hunter (Bucket A Page-1 Low-CTR + Bucket B Page-2 Breakthrough) & 46 Page-2 City URLs
  const leakPath = path.join(__dirname, '..', 'data', 'gsc-leak-hunter-report.json');
  if (fs.existsSync(leakPath)) {
    const leak = JSON.parse(fs.readFileSync(leakPath, 'utf8'));
    for (const item of [...(leak.bucketAPage1LowCtr || []), ...(leak.bucketBPage2Breakthrough || [])]) {
      if (item.targetUrl) urls.push(item.targetUrl);
    }
  }
  const scorePath = path.join(__dirname, '..', 'data', 'city-rank-scoreboard.json');
  if (fs.existsSync(scorePath)) {
    const score = JSON.parse(fs.readFileSync(scorePath, 'utf8'));
    for (const row of (score.rows || [])) {
      if (row.tier === 'PAGE2' || row.tier === 'PAGE1') {
        urls.push(`${SITE_URL}/service-areas/${row.slug}`);
        urls.push(`${SITE_URL}/services/buyer-inspection/${row.slug}`);
      }
    }
  }

  // Add comparison guides
  const comparisonsFile = path.join(__dirname, '..', 'data', 'comparisons-pseo.json');
  if (fs.existsSync(comparisonsFile)) {
    const comparisons = JSON.parse(fs.readFileSync(comparisonsFile, 'utf8'));
    urls.push(`${SITE_URL}/compare`);
    comparisons.forEach(c => urls.push(`${SITE_URL}/compare/${c.slug}`));
  }

  // Add video watch pages so IndexNow & crawlers immediately re-crawl /videos/*
  const videoSlugs = [
    '',
    '/complete-home-systems-diagnostic',
    '/new-construction-inspections',
    '/11-month-warranty-inspection',
    '/pool-and-spa-inspections',
    '/sewer-scope-inspections',
    '/termite-and-wdo-inspections',
    '/radon-gas-testing',
    '/mold-indoor-air-quality-testing',
    '/short-term-rental-str-compliance-inspection'
  ];
  videoSlugs.forEach(s => urls.push(`${SITE_URL}/videos${s}`));

  // Add the 12 GSC "Video isn't on a watch page" validation URLs (last crawled Sep 16-23)
  const gscValidationUrls = [
    '/services/sewer-scope-inspection/morrow',
    '/services/new-construction-inspection/locust-grove',
    '/services/termite-inspection/suwanee',
    '/services/radon-testing/powder-springs',
    '/services/pre-listing-inspection/senoia',
    '/services/termite-inspection/tucker',
    '/services/pre-listing-inspection/east-point',
    '/service-areas/peachtree-corners',
    '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
    '/services/termite-inspection/milton',
    '/service-areas/duluth',
    '/samples'
  ];
  gscValidationUrls.forEach(s => urls.push(`${SITE_URL}${s}`));

  // Add the 24 GSC "Crawled - currently not indexed" real pages
  const crawledNotIndexedUrls = [
    '/videos/termite-and-wdo-inspections',
    '/services/sewer-scope-inspection/stone-mountain',
    '/services/pool-inspection/brooks',
    '/service-areas/dallas',
    '/service-areas/canton',
    '/service-areas/douglasville',
    '/service-areas/hapeville',
    '/service-areas/college-park',
    '/service-areas/fayetteville',
    '/service-areas/brooks',
    '/service-areas/lilburn',
    '/service-areas/tyrone',
    '/service-areas/stonecrest',
    '/service-areas/covington',
    '/service-areas/lithonia',
    '/service-areas/dunwoody',
    '/service-areas/newnan',
    '/service-areas/acworth',
    '/service-areas/woolsey',
    '/service-areas/mansfield',
    '/service-areas/conyers',
    '/service-areas/oxford',
    '/service-areas/clarkston',
    '/service-areas/norcross',
    '/service-areas/doraville'
  ];
  crawledNotIndexedUrls.forEach(s => urls.push(`${SITE_URL}${s}`));

  const uniqueUrls = [...new Set(urls)];
  console.log(`📋 ${uniqueUrls.length} unique URLs to submit\n`);

  // Submit to IndexNow API (covers Bing, Yandex, Naver, Seznam) in batches of 100
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (let i = 0; i < uniqueUrls.length; i += 100) {
    const batch = uniqueUrls.slice(i, i + 100);
    const payload = {
      host: 'www.fhinspectionsatl.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: batch,
    };
    console.log(`  Batch ${Math.floor(i / 100) + 1} (${batch.length} URLs):`);
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log(`    ${endpoint}: ${response.status} ${response.status === 200 || response.status === 202 ? '✅' : '⚠️'}`);
      } catch (err) {
        console.log(`    ${endpoint}: ❌ ${err.message}`);
      }
    }
  }

  // Verify live XML sitemaps return 200 OK (replaces deprecated Google /ping endpoint)
  console.log('\n🗺️  Verifying live XML sitemaps:');
  for (const sm of [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-images.xml`, `${SITE_URL}/sitemap-video.xml`]) {
    try {
      const smRes = await fetch(sm, { method: 'HEAD' });
      console.log(`    ${sm}: ${smRes.status} ${smRes.status === 200 ? '✅' : '⚠️'}`);
    } catch (err) {
      console.log(`    ${sm}: ❌ ${err.message}`);
    }
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
