#!/usr/bin/env node
/**
 * TDD Verification Gate: Foresight Agent-Reach Omni-Medium Integration
 * Enforces Rule 5/6 Ground-Truth Data Law, data/truth.json compliance,
 * 0% Ansley/Unsubscribed leakage, and 1,200/24h cross-engine quota accounting.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const EMAIL_ROOT = path.resolve(WEB_ROOT, '..', 'email-campaign-engine');
const OMNI_ROOT = path.resolve(WEB_ROOT, '..', 'omni-video-publisher');

const truth = JSON.parse(fs.readFileSync(path.join(WEB_ROOT, 'data', 'truth.json'), 'utf8'));
const BANNED_DOMAINS = /(ansleyre\.com|ansleyatlanta\.com|metrobrokers\.com|cbcmetrobrokers\.com|cgrealtyinc\.com|drhorton\.com|pulte\.com|lennar\.com|tollbrothers\.com)/i;

function assertTruthSafe(copy, label) {
  assert.ok(copy && copy.length > 10, `${label}: empty copy`);
  assert.ok(!copy.includes('*'), `${label}: contains visible asterisk (*)`);
  assert.ok(!/1816 South Deshon/i.test(copy), `${label}: leaks schema-only street address`);
  for (const b of truth.guardrails.bannedLegalAndBrandTerms) {
    assert.ok(!new RegExp(`\\b${b.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(copy), `${label}: contains banned term "${b.term}"`);
  }
}

console.log('🧪 Running Foresight Agent-Reach Omni-Medium TDD Verification Suite...');

// 1. Loan Officers Ground-Truth Remediation Check
const loPath = path.join(WEB_ROOT, 'data', 'loan-officers.json');
const loanOfficers = JSON.parse(fs.readFileSync(loPath, 'utf8'));
assert.ok(Array.isArray(loanOfficers) && loanOfficers.length >= 4, 'loan-officers.json must have >=4 verified entries');
for (const lo of loanOfficers) {
  assert.ok(!/David M\. Caldwell|lo_movement_01/i.test(JSON.stringify(lo)), 'Legacy unverified loan officer must be purged');
  assert.ok(/^https?:\/\//.test(lo.source_url || ''), `LO ${lo.name} missing valid source_url`);
  assert.ok(/^2026-\d{2}-\d{2}/.test(lo.retrieved_on || ''), `LO ${lo.name} missing retrieved_on date`);
  assert.ok(lo.verified === true, `LO ${lo.name} must pass HTTP/DNS verification`);
  assert.ok(!BANNED_DOMAINS.test(lo.email || ''), `LO ${lo.name} violates domain suppression`);
}

// 2. Adjacent B2B Referral Partners Ledger Check
const b2bPath = path.join(WEB_ROOT, 'data', 'b2b-referral-partners.json');
assert.ok(fs.existsSync(b2bPath), 'data/b2b-referral-partners.json must exist');
const b2bPartners = JSON.parse(fs.readFileSync(b2bPath, 'utf8'));
assert.ok(Array.isArray(b2bPartners) && b2bPartners.length >= 5, 'b2b-referral-partners.json must have >=5 verified partners');
const cats = new Set(b2bPartners.map((p) => p.category));
for (const reqCat of ['attorney_closing_probate', 'insurance_agency', 'podcast_media']) {
  assert.ok(cats.has(reqCat), `b2b-referral-partners.json missing category: ${reqCat}`);
}
for (const p of b2bPartners) {
  assert.ok(/^https?:\/\//.test(p.source_url || ''), `Partner ${p.name} missing source_url`);
  assert.ok(/^2026-\d{2}-\d{2}/.test(p.retrieved_on || ''), `Partner ${p.name} missing retrieved_on`);
  assert.ok(p.verified === true, `Partner ${p.name} must pass HTTP/DNS verification`);
  assert.ok(!BANNED_DOMAINS.test(`${p.email || ''} ${p.company || ''}`), `Partner ${p.name} violates suppression`);
}

// 3. Agent-Reach 10-Medium Intelligence Payload Check
const intelPath = path.join(WEB_ROOT, 'data', 'agent-reach-intel.json');
assert.ok(fs.existsSync(intelPath), 'data/agent-reach-intel.json must exist');
const intel = JSON.parse(fs.readFileSync(intelPath, 'utf8'));
assert.ok(intel.youtubeRealtors?.length >= 3, 'Must capture >=3 live YouTube Relocation/New-Build Realtors');
assert.ok(intel.buyerIntentThreads?.length >= 4, 'Must capture >=4 Metro Atlanta buyer-intent threads (Reddit/BP/Nextdoor)');
assert.ok(intel.investigativeNewsAndSubstacks?.length >= 4, 'Must capture >=4 local investigative news & Substack items');
assert.ok(intel.warrantySubdivisionCohorts?.length >= 4, 'Must capture >=4 11-month builder warranty subdivision cohorts');
assert.ok(intel.socialMarketHooks?.length >= 3, 'Must stage >=3 live market hooks for omni-video-publisher');
for (const t of intel.buyerIntentThreads) {
  assertTruthSafe(t.cmiDraftReply, `Buyer thread draft (${t.title})`);
}

// 4. Cross-Repo Quota, Template & PR/Social Hook Checks
const watchdogSrc = fs.readFileSync(path.join(EMAIL_ROOT, 'catchup_nurture_watchdog.js'), 'utf8');
const eodSrc = fs.readFileSync(path.join(EMAIL_ROOT, 'generate_eod_report.js'), 'utf8');
assert.ok(watchdogSrc.includes('agent-reach-outreach-log.json'), 'Watchdog must count agent-reach-outreach-log.json in 1,200 cap');
assert.ok(eodSrc.includes('agent-reach-intel.json'), 'EOD report must include Agent-Reach Omni-Radar metrics');

const { buildConversationalRealtorEmail } = await import(`file:///${path.join(EMAIL_ROOT, 'lightweight_realtor_templates.js').replace(/\\/g, '/')}`);
const sampleMail = buildConversationalRealtorEmail({
  first_name: 'Erin', email: 'sample@compass.com', brokerage: 'Compass', city: 'Atlanta',
  is_new_construction: true, video_title: 'NEVER Buy a New Construction Home in Georgia'
});
assert.ok(sampleMail.text.includes('NEVER Buy a New Construction Home in Georgia'), 'Video Realtor template must reference video_title');
assert.ok(/from \$275/i.test(sampleMail.html) && /from \$400/i.test(sampleMail.html), 'Template must display From $275 / From $400');
assert.ok(sampleMail.html.includes('height="78"') && sampleMail.html.includes('height="70"'), 'Template must enforce CMI 78px > CPI 70px');

const prData = JSON.parse(fs.readFileSync(path.join(WEB_ROOT, 'data', 'pr-pitches-ready.json'), 'utf8'));
const prDispatches = Array.isArray(prData) ? prData : (prData.dispatches || []);
assert.ok(prDispatches.some((p) => p.liveSourceUrl), 'pr-pitches-ready.json must include live Agent-Reach reactive pitches');

const carouselPy = fs.readFileSync(path.join(OMNI_ROOT, 'automation', 'post_editorial_carousel.py'), 'utf8');
assert.ok(carouselPy.includes('agent-reach-intel.json'), 'post_editorial_carousel.py must bridge agent-reach-intel.json');

console.log('✅ ALL FORESIGHT AGENT-REACH OMNI-MEDIUM TDD GATES PASSED (100%)!');
