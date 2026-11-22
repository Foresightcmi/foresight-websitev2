import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

test('[1a] GBP Weekly Kit strips raw phone numbers & raw URLs from post body block', () => {
  const mdPath = path.join(ROOT, 'data', 'gbp-weekly-kit.md');
  assert.ok(fs.existsSync(mdPath), 'gbp-weekly-kit.md must exist');
  const md = fs.readFileSync(mdPath, 'utf8');
  const fenceMatch = md.match(/```\r?\n([\s\S]*?)\r?\n```/);
  assert.ok(fenceMatch, 'GBP post fenced block must exist');
  const postBody = fenceMatch[1];
  assert.ok(!/\b\d{3}[-.\s)]*\d{3}[-.\s]*\d{4}\b/.test(postBody), 'GBP post body must not contain phone digits');
  assert.ok(!/https?:\/\//i.test(postBody), 'GBP post body must not contain raw URLs');
  assert.ok(/Button:\s*\*\*Book\*\*\s*→\s*https:\/\/www\.fhinspectionsatl\.com\/services\//.test(md), 'CTA Book button URL must remain intact');
});

test('[2] All published blog posts have contextual /services/ money links + external authority citations', () => {
  const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'posts.json'), 'utf8'));
  assert.ok(posts.length >= 46, `Expected >= 46 posts, got ${posts.length}`);
  for (const p of posts) {
    const c = p.content || '';
    assert.ok(c.includes('/services/'), `Post ${p.slug} missing /services/ contextual money link`);
    const extLinks = [...c.matchAll(/href=["'](https?:\/\/[^"']+)["']/g)]
      .map((m) => m[1])
      .filter((u) => !u.includes('fhinspectionsatl.com'));
    assert.ok(extLinks.length >= 1, `Post ${p.slug} missing non-competing external authority citation`);
    assert.ok(!/>(click here|learn more|read more)</i.test(c), `Post ${p.slug} uses generic anchor text`);
    const internalCount = [...c.matchAll(/href=["']\/[^"']+["']/g)].length;
    assert.ok(internalCount <= 20, `Post ${p.slug} exceeds maxInternalLinksPerPost (20): ${internalCount}`);
    assert.ok(!c.includes('*'), `Post ${p.slug} contains visible asterisk`);
  }
});

test('[3] Striking-Distance Engine enforces Top-3 Freeze Lock + HeyTony AIO/Three-Kings scoring', () => {
  const qPath = path.join(ROOT, 'data', 'striking-distance-queue.json');
  assert.ok(fs.existsSync(qPath));
  const q = JSON.parse(fs.readFileSync(qPath, 'utf8'));
  assert.ok(Number(q.freezeLockedTop3Count) >= 100, 'Must freeze-lock 100+ Pos <=3.9 GSC winners');
  assert.ok(Array.isArray(q.freezeLockedUrls) && q.freezeLockedUrls.length > 0);
  assert.ok(q.opportunities.length > 0);
  const sample = q.opportunities[0];
  assert.ok(sample.heytonyAudit, 'Opportunity must carry heytonyAudit object');
  assert.equal(typeof sample.heytonyAudit.titleH1Frozen, 'boolean');
  assert.ok(sample.heytonyAudit.aioScopeMatch);
});

test('[4] Competitor Watchdog + GBP Gap & AI-Agent Readiness Audit produce verified JSON', () => {
  const wdPath = path.join(ROOT, 'data', 'heytony-competitor-watchdog.json');
  const gbpPath = path.join(ROOT, 'data', 'gbp-gap-and-ai-agent-report.json');
  assert.ok(fs.existsSync(wdPath), 'heytony-competitor-watchdog.json must exist');
  assert.ok(fs.existsSync(gbpPath), 'gbp-gap-and-ai-agent-report.json must exist');

  const wd = JSON.parse(fs.readFileSync(wdPath, 'utf8'));
  assert.ok(wd.retrieved_on, 'Watchdog must carry retrieved_on date');
  assert.ok(Array.isArray(wd.competitors) && wd.competitors.length >= 3);
  assert.ok(wd.competitors.every((c) => c.source_url && c.retrieved_on));

  const gbp = JSON.parse(fs.readFileSync(gbpPath, 'utf8'));
  assert.equal(gbp.primaryCategoryLocked, 'Home inspector');
  assert.equal(gbp.aiAgentReadiness.privacyPolicyPresent, true);
  assert.equal(gbp.aiAgentReadiness.termsOfServicePresent, true);
  assert.equal(gbp.aiAgentReadiness.sabStreetHiddenInVisibleCopy, true);
  assert.ok(gbp.gbpServiceCards.length >= 11);
});

test('[5] Passive Backlink Micro-Tool (<80 KB dynamic) + DRAFT_ONLY Link-Gap Queue', () => {
  const pagePath = path.join(ROOT, 'app', 'home-system-lifespan-calculator', 'page.js');
  const clientPath = path.join(ROOT, 'app', 'home-system-lifespan-calculator', 'LifespanGraderWrapper.js');
  const sitemapPath = path.join(ROOT, 'app', 'sitemap.js');
  const linkGapPath = path.join(ROOT, 'data', 'heytony-linkgap-triage.json');

  assert.ok(fs.existsSync(pagePath), 'Micro-tool Server Component page.js must exist');
  assert.ok(fs.existsSync(clientPath), 'Dynamic client wrapper must exist');
  const pageCode = fs.readFileSync(pagePath, 'utf8');
  const wrapperCode = fs.readFileSync(clientPath, 'utf8');
  assert.ok(!/^['"]use client['"]/m.test(pageCode), 'page.js must remain a React Server Component');
  assert.ok(/dynamic\(/.test(wrapperCode) && /ssr:\s*false/.test(wrapperCode), 'Interactive grader must load via next/dynamic({ ssr: false })');
  assert.ok(/SoftwareApplication/.test(pageCode) && /FAQPage/.test(pageCode), 'Must emit SoftwareApplication + FAQPage JSON-LD');
  assert.ok(fs.readFileSync(sitemapPath, 'utf8').includes('/home-system-lifespan-calculator'), 'Must be registered in app/sitemap.js');

  assert.ok(fs.existsSync(linkGapPath), 'heytony-linkgap-triage.json must exist');
  const lg = JSON.parse(fs.readFileSync(linkGapPath, 'utf8'));
  assert.equal(lg.dispatchMode, 'DRAFT_ONLY');
  assert.ok(Array.isArray(lg.items));
  for (const item of lg.items) {
    assert.ok(!/ansleyre\.com|ansleyatlanta\.com/i.test(JSON.stringify(item)));
    assert.ok(item.source_url && item.retrieved_on);
  }
});

test('[6b] HeyTony 5-Question E-E-A-T Voice/Text Interview Extractor exists & validates truth', async () => {
  const modPath = path.join(ROOT, 'scripts', 'heytony-voice-interview.mjs');
  assert.ok(fs.existsSync(modPath), 'heytony-voice-interview.mjs must exist');
  const mod = await import(`file://${modPath.replace(/\\/g, '/')}`);
  assert.equal(mod.FIVE_EEAT_INTERVIEW_QUESTIONS.length, 5);
  const draft = mod.synthesizeInterviewToBlogEntry({
    topic: 'Crawlspace Vapor Barrier Inspection in Decatur',
    primaryKeyword: 'crawlspace inspection Decatur GA',
    citySlug: 'decatur',
    serviceSlug: 'buyer-inspection',
    answers: [
      'Open crawlspace vents in humid Decatur summers trap 75% relative humidity against floor joists.',
      'Last month in a 1958 Decatur ranch we measured 24% wood moisture on center girders before closing.',
      'Sellers often lay loose plastic sheets without sealing foundation piers, hiding active condensation.',
      'Buyers used our same-day interactive digital report to secure a $4,800 seller closing credit.',
      'Always inspect the rim joist behind porch steps before Georgia due diligence expires.'
    ]
  });
  assert.ok(draft.title.length <= 60);
  assert.ok(draft.content.includes('/services/buyer-inspection/decatur'));
  assert.ok(/https:\/\/www\.epa\.gov/.test(draft.content));
  assert.ok(!draft.content.includes('*'));
});
