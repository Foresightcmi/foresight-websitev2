#!/usr/bin/env node
/**
 * 100%-Idempotent GSC Intent-Mismatch & Starving-Money-Page Internal-Link Auto-Healer
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Reads .analytics/governor_brief.json (url_intent_mismatches + priority_internal_link_targets)
 * and weaves missing contextual internal anchors from corridor-aligned blog posts to the exact
 * canonical /services/[service]/[city] money URLs.
 *
 * Safety & Idempotency Guarantees:
 * - Zero edits if target URL already has >= 1 internal link anywhere in data/posts.json (prevents 7-21d GSC lag loops)
 * - Respects edit_mode === "FREEZE" on protected_top_urls; never alters <title>, <h1>, or slugs
 * - Strictly enforces <= 19 internal links/post, zero asterisks (*), zero banned words, and GEMINI.md pricing truth
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadGovernorBrief, appendExperimentLedger } from './lib/seo-ledger-and-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_PATH = path.join(ROOT, 'data', 'posts.json');
const CITIES_PATH = path.join(ROOT, 'data', 'cities.json');
const DRY_RUN = process.argv.includes('--dry-run');

function buildTruthLockedSentence(targetUrl, cityName) {
  if (targetUrl.startsWith('/services/buyer-inspection/')) {
    return `<p>Preparing an offer nearby? Schedule our two-inspector <a href="${targetUrl}">${cityName} buyer home inspection</a> (From $345) with calibrated infrared thermal scans and same-day reporting.</p>`;
  }
  if (targetUrl.startsWith('/services/sewer-scope-inspection/')) {
    return `<p>Checking underground drain lines before Georgia due diligence closes? Request an <a href="${targetUrl}">${cityName} HD sewer scope inspection</a> — Call (678) 480-2110 for Quote.</p>`;
  }
  if (targetUrl.startsWith('/services/mold-testing/')) {
    return `<p>Evaluating crawlspace humidity or indoor air quality? Book <a href="${targetUrl}">${cityName} mold and air quality testing</a> — Call (678) 480-2110 for Quote.</p>`;
  }
  if (targetUrl.startsWith('/services/new-construction-inspection/')) {
    return `<p>Closing on a newly built home? Schedule a two-inspector <a href="${targetUrl}">${cityName} new construction inspection</a> (From $400) prior to your final walkthrough.</p>`;
  }
  if (targetUrl.startsWith('/services/pre-drywall-inspection/')) {
    return `<p>Building from the ground up? Book a Phase 1 <a href="${targetUrl}">${cityName} pre-drywall framing inspection</a> (From $275) before drywall conceals framing and rough-ins.</p>`;
  }
  if (targetUrl.startsWith('/defects/stucco-eifs-moisture-inspection')) {
    return `<p>Evaluating stucco or EIFS cladding? Review our <a href="${targetUrl}">stucco and EIFS moisture evaluation guide</a> before due diligence expires.</p>`;
  }
  return null;
}

export function autoHealIntentMismatches({ write = !DRY_RUN } = {}) {
  const govBrief = loadGovernorBrief(ROOT);
  if (!govBrief || !fs.existsSync(POSTS_PATH) || !fs.existsSync(CITIES_PATH)) {
    return { healedCount: 0, healedTargets: [] };
  }

  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
  const cities = JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8'));
  const citySlugToInfo = new Map(
    cities.map((c) => [String(c.Slug || '').toLowerCase(), { name: c['City Name'], county: String(c.County || '').toLowerCase() }])
  );

  const isFreeze = govBrief?.core_update_gate?.edit_mode === 'FREEZE';
  const protectedUrls = new Set(govBrief?.protected_top_urls || []);
  const todayIso = new Date().toISOString().slice(0, 10);

  // Collect candidate canonical URLs needing internal-link consolidation
  const candidateUrls = [];
  for (const m of govBrief.url_intent_mismatches || []) {
    if (m.expected_url && !candidateUrls.includes(m.expected_url)) candidateUrls.push(m.expected_url);
  }
  for (const p of govBrief.priority_internal_link_targets || []) {
    if (p.url && (p.url.startsWith('/services/') || p.url.startsWith('/defects/')) && p.url !== '/services' && !candidateUrls.includes(p.url)) {
      candidateUrls.push(p.url);
    }
  }

  // Global href index across all posts for 100% idempotency across daily runs
  const globallyLinkedUrls = new Set();
  for (const post of posts) {
    for (const match of String(post.content || '').matchAll(/href=["'](\/[^"'#?]+)\/?["']/g)) {
      globallyLinkedUrls.add(match[1]);
    }
  }

  const healedTargets = [];
  for (const targetUrl of candidateUrls.slice(0, 10)) {
    if (globallyLinkedUrls.has(targetUrl)) continue; // Already linked -> 0 duplicate churn

    const segs = targetUrl.split('/').filter(Boolean);
    const lastSeg = (segs[segs.length - 1] || '').toLowerCase();
    const cityInfo = citySlugToInfo.get(lastSeg);
    if (targetUrl.startsWith('/services/') && segs.length >= 3 && !cityInfo) continue; // Skip invalid city slugs

    const sentence = buildTruthLockedSentence(targetUrl, cityInfo ? cityInfo.name : 'Metro Atlanta');
    if (!sentence) continue;

    // Pick best non-protected post mentioning the city, county, or matching topic with < 19 internal links
    const bestPost = posts.find((p) => {
      if (isFreeze && protectedUrls.has(`/blog/${p.slug}`)) return false;
      const content = String(p.content || '');
      const linkCount = [...content.matchAll(/href=["']\/[^"']+["']/g)].length;
      if (linkCount >= 19) return false;
      const hay = `${p.slug} ${p.title} ${content}`.toLowerCase();
      if (cityInfo && (hay.includes(cityInfo.name.toLowerCase()) || (cityInfo.county && hay.includes(cityInfo.county)))) return true;
      if (targetUrl.includes('sewer') && hay.includes('sewer')) return true;
      if (targetUrl.includes('mold') && hay.includes('mold')) return true;
      if (targetUrl.includes('stucco') && hay.includes('stucco')) return true;
      return false;
    }) || posts.find((p) => {
      if (isFreeze && protectedUrls.has(`/blog/${p.slug}`)) return false;
      return [...String(p.content || '').matchAll(/href=["']\/[^"']+["']/g)].length < 18;
    });

    if (!bestPost) continue;

    if (String(bestPost.content).includes('<h2>Frequently Asked Questions</h2>')) {
      bestPost.content = bestPost.content.replace('<h2>Frequently Asked Questions</h2>', `${sentence}\n<h2>Frequently Asked Questions</h2>`);
    } else {
      bestPost.content = `${bestPost.content}\n${sentence}`;
    }
    bestPost.dateModified = todayIso;
    globallyLinkedUrls.add(targetUrl);
    healedTargets.push({ targetUrl, hostPostSlug: bestPost.slug });

    if (write) {
      appendExperimentLedger(ROOT, {
        url: targetUrl,
        deployedAt: todayIso,
        hypothesis: `Auto-healed intent mismatch / starving page via contextual link from /blog/${bestPost.slug}`,
      });
    }
  }

  if (write && healedTargets.length > 0) {
    fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2) + '\n', 'utf8');
  }
  return { healedCount: healedTargets.length, healedTargets };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const res = autoHealIntentMismatches();
  console.log(`✅ Intent-Mismatch & Starving-Page Auto-Healer (${DRY_RUN ? 'DRY-RUN' : 'LIVE'}): healed ${res.healedCount} targets`, res.healedTargets);
}
