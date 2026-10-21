#!/usr/bin/env node
/**
 * FirstIndex Deterministic Truth Document Guard & Auto-Healer
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Implements Josh Pigford's FirstIndex Truth-Document Architecture:
 * 1. Validates all data JSONs, app templates, scripts, and /llms.txt against data/truth.json
 * 2. Detects and deterministically heals stale pricing ($250 radon -> $275, $275 pool -> $300)
 * 3. Strips banned legal/trademark terms (F404, F201, RSMeans, CRL, FLIR) from visible copy
 * 4. Enforces zero visible asterisks, link-count ceilings, and 100% /llms.txt inventory coverage
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const FIX_MODE = process.argv.includes('--fix');
const truthPath = path.join(ROOT, 'data', 'truth.json');
const truth = JSON.parse(fs.readFileSync(truthPath, 'utf8'));

let totalChecks = 0;
let passedChecks = 0;
let fixedItems = 0;
const findings = [];

function record(title, passed, detail = '') {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${title}${detail ? ` — ${detail}` : ''}`);
  } else {
    console.log(`  ❌ [FAIL] ${title}${detail ? ` — ${detail}` : ''}`);
    findings.push({ title, detail });
  }
}

// 1. Deterministic Replacement Rules for Visible Copy & Data Files
const COPY_REPLACEMENTS = [
  { pattern: /radon testing cost Atlanta \$250/gi, replacement: 'radon testing cost Atlanta $275', label: 'Radon $250 -> $275' },
  { pattern: /\$250 radon/gi, replacement: '$275 radon', label: 'Radon $250 -> $275' },
  { pattern: /pool and spa inspection cost Atlanta \$275/gi, replacement: 'pool and spa inspection cost Atlanta $300', label: 'Pool $275 -> $300' },
  { pattern: /\$275 pool/gi, replacement: '$300 pool', label: 'Pool $275 -> $300' },
  { pattern: /GEORGIA ASSOCIATION OF REALTORS® \(GAR\) FORM F404 AMENDMENT/g, replacement: 'GEORGIA REAL ESTATE REPAIR & CREDIT AMENDMENT REQUEST', label: 'GAR Form F404 header' },
  { pattern: /Georgia Association of REALTORS® \(GAR\) Form F404/g, replacement: 'Georgia real estate repair amendment', label: 'GAR Form F404' },
  { pattern: /GAR Form F404 Interactive Builder/g, replacement: 'Interactive Repair Amendment Builder', label: 'GAR Form F404 Builder' },
  { pattern: /Try GAR Form F404 Amendment Builder/g, replacement: 'Try Repair Amendment Builder', label: 'GAR Form F404 CTA' },
  { pattern: /Interactive GAR F404 Builder/g, replacement: 'Interactive Repair Amendment Builder', label: 'GAR F404 badge' },
  { pattern: /Build Custom GAR Form F404 Repair Amendments/g, replacement: 'Build Custom Georgia Repair Amendments', label: 'GAR F404 heading' },
  { pattern: /\[GAR F404\]/g, replacement: '[REPAIR AMENDMENT]', label: '[GAR F404] tag' },
  { pattern: /GAR Form F404 Special Stipulation/g, replacement: 'Repair Amendment Special Stipulation', label: 'GAR Form F404 mailto' },
  { pattern: /GAR F404 Repair Clause/g, replacement: 'Repair Amendment Clause', label: 'GAR F404 subject' },
  { pattern: /Include GAR F404 Document Header/g, replacement: 'Include Repair Amendment Document Header', label: 'GAR F404 checkbox' },
  { pattern: /Generated GAR F404 Clause/g, replacement: 'Generated Repair Amendment Clause', label: 'GAR F404 label' },
  { pattern: /GAR Form F404 Amendment to Address Defects/gi, replacement: 'Georgia Repair Amendment to Address Defects', label: 'GAR Form F404 blog' },
  { pattern: /GAR Form F404 Repair Addendum Generator/gi, replacement: 'Interactive Repair Addendum Generator', label: 'GAR Form F404 link' },
  { pattern: /GAR Form F404 amendment/gi, replacement: 'Georgia repair amendment', label: 'GAR Form F404 amendment' },
  { pattern: /GAR Form F404 EXHIBIT/gi, replacement: 'REPAIR AMENDMENT EXHIBIT', label: 'GAR Form F404 exhibit' },
  { pattern: /GAR Form F404/gi, replacement: 'Georgia repair amendment', label: 'GAR Form F404 generic' },
  { pattern: /GAR F404/gi, replacement: 'Georgia repair amendment', label: 'GAR F404 short' },
  { pattern: /\bF404\b/g, replacement: 'Repair Amendment', label: 'F404 token' },
  { pattern: /\bF201\b/g, replacement: 'Purchase Agreement', label: 'F201 token' },
  { pattern: /RSMeans 2026 Regional Cost Index/gi, replacement: '2026 Metro Atlanta Regional Contractor Cost Index', label: 'RSMeans comment/copy' },
  { pattern: /\bRSMeans\b/gi, replacement: 'regional contractor cost data', label: 'RSMeans token' },
  { pattern: /HomeGauge CRL create repair list addendum Georgia/gi, replacement: 'digital repair request list builder addendum Georgia', label: 'HomeGauge CRL query' },
  { pattern: /Interactive HomeGauge CRL™ reports/gi, replacement: 'Interactive digital reports with 1-click repair list builder', label: 'HomeGauge CRL™' },
  { pattern: /Create Request List \(CRL™?\)/gi, replacement: 'Digital Repair Request List Builder', label: 'Create Request List (CRL)' },
  { pattern: /Same-Day Report &amp; CRL™ Tool/gi, replacement: 'Same-Day Report &amp; Repair List Builder', label: 'CRL™ Tool heading' },
  { pattern: /Atlanta Suburb &amp; CRL Report:/gi, replacement: 'Atlanta Suburb &amp; Digital Repair List Report:', label: 'CRL Report label' },
  { pattern: /24-hour CRL report/gi, replacement: '24-hour interactive digital report', label: '24-hour CRL report' },
  { pattern: /Report &amp; CRL/g, replacement: 'Report &amp; Repair List', label: 'Report & CRL stage' },
  { pattern: /FLIR thermal sweep/gi, replacement: 'calibrated infrared thermal sweep', label: 'FLIR -> calibrated infrared' },
  { pattern: /FLIR infrared thermal imaging/gi, replacement: 'calibrated infrared thermal imaging', label: 'FLIR -> calibrated infrared' },
  { pattern: /\*DISCLAIMER:/g, replacement: 'DISCLAIMER:', label: 'Visible asterisk in DISCLAIMER' }
];

const TARGET_FILES = [
  'app/page.js',
  'app/realtors/RealtorsClient.js',
  'app/realtors/page.js',
  'app/repair-credit-calculator/page.js',
  'app/components/DueDiligenceCalculator.js',
  'app/components/QualityChecklist.js',
  'app/components/InstantAuditDelivery.js',
  'app/components/ThermalSlider.js',
  'app/components/TwoPossibilities.js',
  'app/checkout/success/page.js',
  'app/dashboard/DashboardClient.js',
  'app/quote/QuoteClient.js',
  'app/due-diligence/page.js',
  'app/concierge/page.js',
  'app/review/ReviewClient.js',
  'app/services/page.js',
  'app/neighborhoods/[slug]/page.js',
  'app/api/export/route.js',
  'app/api/mcp/route.js',
  'lib/repairEngine.js',
  'data/defects-pseo.json',
  'data/posts.json',
  'data/comparisons-pseo.json',
  'data/neighborhoods-pseo.json',
  'scripts/ai-fanning-engine.mjs',
  'scripts/audit-ai-citations.mjs',
  'scripts/audit-tools-and-inclusions.mjs',
  'scripts/autonomous-due-diligence-engine.mjs',
  'scripts/permit-email-templates.mjs',
  'scripts/update-comparisons.mjs'
];

console.log('\n════════════════════════════════════════════════════════════════════');
console.log('  FIRSTINDEX TRUTH DOCUMENT GUARD & DETERMINISTIC VALIDATOR');
console.log(`  Source of Truth: data/truth.json (v${truth.version}) | Mode: ${FIX_MODE ? 'AUTO-HEAL (--fix)' : 'AUDIT'}`);
console.log('════════════════════════════════════════════════════════════════════\n');

// Step 1: Audit & Auto-Heal Target Files Against Truth Rules
let driftFiles = 0;
for (const rel of TARGET_FILES) {
  const fullPath = path.join(ROOT, rel);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  for (const rule of COPY_REPLACEMENTS) {
    if (rule.pattern.test(content)) {
      if (FIX_MODE) {
        content = content.replace(rule.pattern, rule.replacement);
        modified = true;
        fixedItems++;
      } else {
        driftFiles++;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
}
record('Zero banned legal/trademark terms (F404/F201/RSMeans/CRL/FLIR) or stale prices across active files', driftFiles === 0, FIX_MODE ? `Auto-healed ${fixedItems} pattern instances` : `${driftFiles} rule hits remaining`);

// Step 2: Sync Missing Blog Posts into public/llms.txt (FirstIndex AI Index Completeness)
const postsPath = path.join(ROOT, 'data', 'posts.json');
const llmsPath = path.join(ROOT, 'public', 'llms.txt');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
let llmsContent = fs.readFileSync(llmsPath, 'utf8');

let missingPosts = posts.filter((p) => !llmsContent.includes(`/blog/${p.slug}`));
if (missingPosts.length > 0 && FIX_MODE) {
  const newLines = missingPosts.map(
    (p) => `- [${p.title.replace(/\*/g, '')}](https://www.fhinspectionsatl.com/blog/${p.slug}): ${(p.excerpt || p.metaDescription || '').replace(/\*/g, '').trim()}`
  );
  llmsContent = llmsContent.replace(
    /## Core Educational Guides & Analysis Articles \(\d+ Total\)/,
    `## Core Educational Guides & Analysis Articles (${posts.length} Total)`
  );
  const marker = '## Inspection Comparison & Decision Guides';
  llmsContent = llmsContent.replace(marker, `${newLines.join('\n')}\n\n${marker}`);
  fs.writeFileSync(llmsPath, llmsContent, 'utf8');
  fixedItems += missingPosts.length;
  missingPosts = posts.filter((p) => !llmsContent.includes(`/blog/${p.slug}`));
}
record(`100% of canonical blog articles (${posts.length}/${posts.length}) indexed in public/llms.txt`, missingPosts.length === 0, `${posts.length - missingPosts.length}/${posts.length} indexed`);

const servicesPath = path.join(ROOT, 'data', 'services-pseo.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
let missingServices = services.filter((s) => !llmsContent.includes(`/services/${s.slug}`));
if (missingServices.length > 0 && FIX_MODE) {
  const svcLines = services.map(
    (s) => `- [${s.name} (${s.price})](https://www.fhinspectionsatl.com/services/${s.slug}): ${(s.shortDesc || s.description || '').replace(/\*/g, '').trim()}`
  );
  const svcBlock = `## Core Inspection & Specialty Diagnostic Services (${services.length} Total)\n${svcLines.join('\n')}\n\n`;
  const marker = '## Core Educational Guides & Analysis Articles';
  llmsContent = llmsContent.replace(marker, `${svcBlock}${marker}`);
  fs.writeFileSync(llmsPath, llmsContent, 'utf8');
  fixedItems += missingServices.length;
  missingServices = services.filter((s) => !llmsContent.includes(`/services/${s.slug}`));
}
record(`100% of canonical services (${services.length}/${services.length}) indexed in public/llms.txt`, missingServices.length === 0, `${services.length - missingServices.length}/${services.length} indexed`);

// Step 3: Validate Link Counts & Zero Asterisks in data/posts.json (Pigford Link-Density Guard)
const maxLinks = truth.guardrails.maxInternalLinksPerPost || 20;
let excessiveLinkPosts = 0;
let asteriskPosts = 0;
for (const p of posts) {
  const links = (p.content.match(/<a\s+[^>]*href=/gi) || []).length;
  if (links > maxLinks) excessiveLinkPosts++;
  if ((p.title + p.excerpt + p.content).includes('*')) asteriskPosts++;
}
record(`Blog post link-density ceiling (<= ${maxLinks} links/post)`, excessiveLinkPosts === 0, `${excessiveLinkPosts} posts exceed cap`);
record('Zero visible asterisks (*) across all 39 blog posts', asteriskPosts === 0);

console.log(`\n[SUMMARY] Passed ${passedChecks}/${totalChecks} FirstIndex Truth checks (${fixedItems} items auto-healed).\n`);
process.exit(passedChecks === totalChecks ? 0 : 1);
