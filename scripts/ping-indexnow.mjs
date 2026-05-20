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

  // Collect all URLs that may have changed recently
  const urls = [SITE_URL, `${SITE_URL}/blog`, `${SITE_URL}/services`, `${SITE_URL}/service-areas`];

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

  console.log(`📋 ${urls.length} URLs to submit\n`);

  // Submit to IndexNow API (covers Bing, Yandex, Naver, Seznam)
  const payload = {
    host: 'www.fhinspectionsatl.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 100), // Max 100 per request
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`  ${endpoint}: ${response.status} ${response.status === 200 || response.status === 202 ? '✅' : '⚠️'}`);
    } catch (err) {
      console.log(`  ${endpoint}: ❌ ${err.message}`);
    }
  }

  // Also ping Google
  try {
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml`);
    console.log(`  Google Sitemap Ping: ${googleRes.status} ✅`);
  } catch {
    console.log(`  Google Sitemap Ping: ❌`);
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
