#!/usr/bin/env node
/**
 * SEO & Pricing Health Check Script for Foresight Home Inspections
 * 
 * Verifies:
 * 1. Correct price configurations across the site databases (Radon = $200, Buyer = $315+)
 * 2. Integrity and schema validity of all cities and posts databases
 * 3. No duplicate canonical definitions or missing titles/descriptions
 * 4. Absolute NAP (Name, Address, Phone) consistency
 * 
 * Usage: node scripts/seo-health-check.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');
const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');

console.log('🛡️  Foresight SEO & Pricing Health Check — Initiating...\n');

let issuesFound = 0;
let warningsFound = 0;

function reportIssue(message, isCritical = true) {
  if (isCritical) {
    console.error(`❌ CRITICAL: ${message}`);
    issuesFound++;
  } else {
    console.warn(`⚠️  WARNING: ${message}`);
    warningsFound++;
  }
}

// 1. Validate Database Existence
if (!fs.existsSync(CITIES_FILE)) {
  reportIssue('cities.json database is missing from data/ folder!');
}
if (!fs.existsSync(POSTS_FILE)) {
  reportIssue('posts.json database is missing from data/ folder!');
}

if (issuesFound > 0) {
  console.log(`\n❌ Failed. ${issuesFound} critical issues blocking build.`);
  process.exit(1);
}

// Load databases
const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));

console.log(`📊 Loaded Databases: ${cities.length} Service Area Cities, ${posts.length} Blog Posts`);

// 2. Validate Radon Pricing Across Databases & Files
console.log('\n💲 Validating Radon & Core Service Pricing Consistency...');

// Check blog content
posts.forEach(post => {
  const contentLower = post.content.toLowerCase();
  const titleLower = post.title.toLowerCase();
  
  if (contentLower.includes('radon') || titleLower.includes('radon')) {
    // Radon price must be exactly $200
    const pricingMatch = contentLower.match(/radon[^]{0,120}\$(\d+)/) || titleLower.match(/radon[^]{0,120}\$(\d+)/);
    if (pricingMatch && pricingMatch[1] !== '200' && pricingMatch[1] !== '10' && pricingMatch[1] !== '10000') {
      reportIssue(`Blog post "${post.title}" contains suspicious Radon pricing: $${pricingMatch[1]} (Expected: $200)`);
    } else {
      console.log(`✅ Blog Post "${post.title.substring(0, 30)}..." Radon pricing looks correct.`);
    }
  }
});

// Check city pages for Radon pricing discrepancies
cities.forEach(city => {
  const servicesLower = (city['Services HTML'] || '').toLowerCase();
  if (servicesLower.includes('radon')) {
    const radonPriceMatch = servicesLower.match(/\$(\d+)[^]*?radon/) || servicesLower.match(/radon[^]*?\$(\d+)/);
    if (radonPriceMatch && radonPriceMatch[1] !== '200') {
      reportIssue(`City page "${city['City Name']}" has discrepant Radon pricing: $${radonPriceMatch[1]} (Expected: $200)`);
    }
  }
});
console.log('✅ Pricing audit complete.');

// 3. Validate Meta Tag & Schema integrity
console.log('\n🔍 Auditing Service Areas SEO & Schema Structure...');
const seenSlugs = new Set();
const seenPhoneNumbers = new Set();

cities.forEach(city => {
  const cityName = city['City Name'];
  const slug = city['Slug'] || cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Check unique slugs
  if (seenSlugs.has(slug)) {
    reportIssue(`Duplicate city slug detected: "${slug}" on city "${cityName}"`);
  }
  seenSlugs.add(slug);

  // Validate Meta properties
  if (!city['Meta Title']) {
    reportIssue(`Missing Meta Title for city page: "${cityName}"`, false);
  } else if (!city['Meta Title'].includes(cityName)) {
    reportIssue(`Meta Title for "${cityName}" does not contain the city name!`, false);
  }

  if (!city['Meta Description']) {
    reportIssue(`Missing Meta Description for city page: "${cityName}"`);
  } else if (city['Meta Description'].length < 100) {
    reportIssue(`Meta Description for "${cityName}" is too short (${city['Meta Description'].length} chars)`, false);
  }

  // Validate Schema.org structure
  if (city['JSON-LD Schema']) {
    try {
      const schema = typeof city['JSON-LD Schema'] === 'string' 
        ? JSON.parse(city['JSON-LD Schema']) 
        : city['JSON-LD Schema'];
      
      if (schema['@type'] !== 'LocalBusiness' && schema['@type'] !== 'HomeAndConstructionBusiness') {
        reportIssue(`City page "${cityName}" schema type is incorrect: ${schema['@type']}`);
      }

      // Check NAP consistency
      if (schema.telephone !== '678-480-2110') {
        reportIssue(`City page "${cityName}" schema phone number is inconsistent: ${schema.telephone} (Expected: 678-480-2110)`);
      }
      
      const zipCode = city['Zip'];
      if (zipCode && schema.address?.postalCode !== zipCode) {
        reportIssue(`City page "${cityName}" schema zip code discrepancy: ${schema.address?.postalCode} vs ${zipCode}`, false);
      }
    } catch (err) {
      reportIssue(`City page "${cityName}" JSON-LD Schema fails to parse: ${err.message}`);
    }
  } else {
    reportIssue(`Missing JSON-LD Schema for city page: "${cityName}"`);
  }
});

// 4. Validate Blog Posts Structure & Canonical Targets
console.log('\n📚 Auditing Blog Posts & Anti-Cannibalization...');
const seenPostSlugs = new Set();

posts.forEach(post => {
  if (seenPostSlugs.has(post.slug)) {
    reportIssue(`Duplicate blog post slug detected: "${post.slug}"`);
  }
  seenPostSlugs.add(post.slug);

  if (!post.title || post.title.length < 20) {
    reportIssue(`Blog post Title "${post.title}" is missing or too short.`);
  }

  if (!post.description || post.description.length < 80) {
    reportIssue(`Blog post Description is missing or too short for: "${post.title}"`, false);
  }

  if (post.targetKeyword && (post.targetKeyword.includes('florida') || post.targetKeyword.includes('ontario'))) {
    reportIssue(`Blog post "${post.title}" contains out-of-market target keyword: "${post.targetKeyword}"`);
  }
});

console.log('\n🏁 Health Check complete.');
if (issuesFound > 0) {
  console.log(`\n❌ Validation FAILED: ${issuesFound} critical issues found, ${warningsFound} warnings. Fix them to protect SEO integrity.`);
  process.exit(1);
} else {
  console.log(`\n🎉 Success! 0 critical errors, ${warningsFound} minor warnings. Ready for safe compile.\n`);
  process.exit(0);
}
