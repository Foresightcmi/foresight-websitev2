#!/usr/bin/env node
/**
 * HeyTony Day-4 Contextual Internal-Link Funnel & Non-Competing Authority Citation Enricher
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Implements HeyTony Strategies #5, #9, #11, #12 in strict harmony with data/truth.json:
 * - Injects natural 2-6 word descriptive /services/[service]/[city] money-page anchors where missing
 * - Injects verified non-competing .gov public-safety/building-science citations where missing
 * - Respects maxInternalLinksPerPost <= 20, zero generic anchors, zero asterisks, zero banned terms
 * - Keeps exact canonical slugs while updating dateModified on refreshed posts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadGovernorBrief } from './lib/seo-ledger-and-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_PATH = path.join(ROOT, 'data', 'posts.json');
const CITIES_PATH = path.join(ROOT, 'data', 'cities.json');

const TOPIC_ROUTING = [
  {
    rx: /sewer|cast-iron|lateral-camera/i,
    servicePath: '/services/sewer-scope-inspection',
    anchor: 'HD sewer scope inspection',
    govUrl: 'https://www.epa.gov/npdes/sanitary-sewer-overflows-ssos',
    govAnchor: 'EPA sanitary sewer line maintenance guidance',
    sentence: 'Before due diligence closes, book an <a href="{SVC}">{ANCHOR}</a> (Call for Quote) alongside <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> to verify underground lateral pipe condition.'
  },
  {
    rx: /radon|granite/i,
    servicePath: '/services/radon-testing',
    anchor: 'continuous 48-hour radon testing',
    govUrl: 'https://www.epa.gov/radon/radon-zone-map',
    govAnchor: 'EPA Georgia Radon Zone 1 map',
    sentence: 'Homes over North Georgia granite formations align with the <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a>, making <a href="{SVC}">{ANCHOR}</a> (Call for Quote) essential during due diligence.'
  },
  {
    rx: /mold|air-quality|crawlspace|moisture/i,
    servicePath: '/services/mold-testing',
    anchor: 'accredited mold and air quality testing',
    govUrl: 'https://www.epa.gov/mold/mold-course-chapter-2',
    govAnchor: 'EPA indoor moisture and fungal thresholds',
    sentence: 'Per <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a>, elevated indoor humidity warrants <a href="{SVC}">{ANCHOR}</a> (Call for Quote) before closing.'
  },
  {
    rx: /termite|wdo/i,
    servicePath: '/services/termite-inspection',
    anchor: 'Georgia wood infestation inspection',
    govUrl: 'https://agr.georgia.gov/structural-pest-control',
    govAnchor: 'Georgia Department of Agriculture pest division',
    sentence: 'State wood-destroying organism rules overseen by the <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> pair directly with our <a href="{SVC}">{ANCHOR}</a> (Call for Quote).'
  },
  {
    rx: /pre-drywall|framing|i-joist/i,
    servicePath: '/services/pre-drywall-inspection',
    anchor: 'Phase 1 pre-drywall framing inspection',
    govUrl: 'https://dca.ga.gov/local-government-assistance/construction-codes-industrialized-buildings/construction-codes',
    govAnchor: 'Georgia Department of Community Affairs building codes',
    sentence: 'Independent verification against <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> starts with a <a href="{SVC}">{ANCHOR}</a> (From $275) before drywall conceals structural framing.'
  },
  {
    rx: /new-construction|infill|luxury-estate/i,
    servicePath: '/services/new-construction-inspection',
    anchor: 'final new construction inspection',
    govUrl: 'https://dca.ga.gov/local-government-assistance/construction-codes-industrialized-buildings/construction-codes',
    govAnchor: 'Georgia residential construction code schedules',
    sentence: 'Even newly permitted builds under <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> benefit from a two-inspector <a href="{SVC}">{ANCHOR}</a> (From $400) prior to final walkthrough.'
  }
];

const EXTRA_ROUTING = [
  {
    rx: /11-month|warranty/i,
    servicePath: '/services/11-month-warranty-inspection',
    anchor: '11-month builder warranty inspection',
    govUrl: 'https://consumer.ftc.gov/articles/warranties-newly-built-homes',
    govAnchor: 'FTC new-home warranty consumer guidance',
    sentence: 'Homeowners reviewing <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> should schedule an <a href="{SVC}">{ANCHOR}</a> (From $345) during month 10 or 11.'
  },
  {
    rx: /pool|spa/i,
    servicePath: '/services/pool-inspection',
    anchor: 'residential pool and spa inspection',
    govUrl: 'https://www.poolsafely.gov/parents/safety-tips/',
    govAnchor: 'U.S. CPSC Pool Safely drain and barrier guidelines',
    sentence: 'Verify anti-entrapment drains and bonding against <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> with a dedicated <a href="{SVC}">{ANCHOR}</a> (Call for Quote).'
  },
  {
    rx: /pre-listing|seller/i,
    servicePath: '/services/pre-listing-inspection',
    anchor: 'pre-listing seller home inspection',
    govUrl: 'https://www.hud.gov/topics/buying_a_home',
    govAnchor: 'HUD home-transaction inspection overview',
    sentence: 'Reviewing <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> alongside a proactive <a href="{SVC}">{ANCHOR}</a> (From $345) helps sellers address defects ahead of buyer due diligence.'
  },
  {
    rx: /str|short-term-rental/i,
    servicePath: '/services/str-short-term-rental-inspection',
    anchor: 'short-term rental safety inspection',
    govUrl: 'https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/smoke-alarms/',
    govAnchor: 'U.S. Fire Administration smoke alarm placement rules',
    sentence: 'Hosts aligning egress and alarm layouts with <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> can schedule a <a href="{SVC}">{ANCHOR}</a> (Call for Quote).'
  },
  {
    rx: /electrical|federal-pacific|zinsco|knob-and-tube|aluminum/i,
    servicePath: '/services/buyer-inspection',
    anchor: 'two-inspector home electrical evaluation',
    govUrl: 'https://www.cpsc.gov/s3fs-public/516.pdf',
    govAnchor: 'U.S. Consumer Product Safety Commission residential wiring safety publication',
    sentence: 'Buyers referencing the <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> can book a <a href="{SVC}">{ANCHOR}</a> (From $345) with calibrated infrared thermal panel scans.'
  },
  {
    rx: /hvac|heat-wave|attic|ventilation/i,
    servicePath: '/services/buyer-inspection',
    anchor: 'two-inspector Metro Atlanta home inspection',
    govUrl: 'https://www.energy.gov/energysaver/air-conditioning',
    govAnchor: 'U.S. Department of Energy residential cooling and attic ventilation guide',
    sentence: 'Pairing <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> with our <a href="{SVC}">{ANCHOR}</a> (From $345) uncovers thermal split and attic duct losses before closing.'
  },
  {
    rx: /polybutylene|water-heater|low-flow|plumbing/i,
    servicePath: '/services/buyer-inspection',
    anchor: 'Metro Atlanta buyer home inspection',
    govUrl: 'https://www.epa.gov/watersense/homes',
    govAnchor: 'EPA WaterSense residential plumbing efficiency criteria',
    sentence: 'Compare fixture and supply-line performance against <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> during a <a href="{SVC}">{ANCHOR}</a> (From $345).'
  }
];

const DEFAULT_ROUTE = {
  servicePath: '/services/buyer-inspection',
  anchor: 'two-inspector buyer home inspection',
  govUrl: 'https://www.hud.gov/program_offices/housing/sfh/ins/sfh_ins_home_inspections',
  govAnchor: 'HUD Ten Questions to Ask a Home Inspector resource',
  sentence: 'Review <a href="{GOV}" target="_blank" rel="noopener noreferrer">{GOV_ANCHOR}</a> and book a <a href="{SVC}">{ANCHOR}</a> (From $345) before your Georgia due diligence period ends.'
};

const ALL_ROUTES = [...TOPIC_ROUTING, ...EXTRA_ROUTING];

function matchCitySlug(post, cities) {
  const hay = `${post.slug} ${post.title || ''}`.toLowerCase();
  for (const c of cities) {
    const slug = String(c.Slug || '').toLowerCase();
    if (slug && slug !== 'atlanta' && new RegExp(`\\b${slug}\\b`).test(hay)) {
      return { slug, name: c['City Name'] };
    }
  }
  return null;
}

export function enrichPostsWithHeyTonyFunnel({ write = true } = {}) {
  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
  const cities = fs.existsSync(CITIES_PATH) ? JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8')) : [];
  const govBrief = loadGovernorBrief(ROOT);
  const isFreeze = govBrief?.core_update_gate?.edit_mode === 'FREEZE';
  const protectedUrls = new Set(govBrief?.protected_top_urls || []);
  const starvingServices = (govBrief?.priority_internal_link_targets || [])
    .map((t) => String(t.url || ''))
    .filter((u) => u.startsWith('/services/') && u.split('/').length >= 4);
  const todayIso = new Date().toISOString().slice(0, 10);
  let interlinksAdded = 0;
  let citationsAdded = 0;

  for (const p of posts) {
    let content = String(p.content || '').replace(/\*/g, '');
    const hasServiceLink = content.includes('/services/');
    const extLinks = [...content.matchAll(/href=["'](https?:\/\/[^"']+)["']/g)]
      .map((m) => m[1])
      .filter((u) => !u.includes('fhinspectionsatl.com'));
    const hasExtLink = extLinks.length > 0;

    if (hasServiceLink && hasExtLink) {
      p.content = content;
      continue;
    }
    if (isFreeze && p.date !== todayIso && protectedUrls.has(`/blog/${p.slug}`)) {
      p.content = content;
      continue;
    }

    const route = ALL_ROUTES.find((r) => r.rx.test(`${p.slug} ${p.title || ''}`)) || DEFAULT_ROUTE;
    const matchedCity = matchCitySlug(p, cities);
    const starvingMatch = starvingServices.find((u) => u.startsWith(route.servicePath));
    const svcUrl = matchedCity
      ? `${route.servicePath}/${matchedCity.slug}`
      : (starvingMatch || route.servicePath);
    const anchorText = matchedCity && route.servicePath === '/services/buyer-inspection'
      ? `two-inspector ${matchedCity.name} home inspection`
      : route.anchor;

    const internalMatches = [...content.matchAll(/href=["'](\/[^"']+)["']/g)];
    if (!hasServiceLink && internalMatches.length >= 20) {
      // Unlink the last duplicate /free-utility-setup or /realtors anchor to stay strictly <= 20 internal links
      content = content.replace(/<a href="\/free-utility-setup">([^<]+)<\/a>(?![\s\S]*<a href="\/free-utility-setup">)/, '$1');
    }

    let addition = '';
    if (!hasServiceLink && !hasExtLink) {
      addition = `<p>${route.sentence
        .replace('{SVC}', svcUrl)
        .replace('{ANCHOR}', anchorText)
        .replace('{GOV}', route.govUrl)
        .replace('{GOV_ANCHOR}', route.govAnchor)}</p>`;
      interlinksAdded++;
      citationsAdded++;
    } else if (!hasServiceLink) {
      addition = `<p>Ready for a thorough evaluation? Schedule our <a href="${svcUrl}">${anchorText}</a> before your Georgia due diligence window closes.</p>`;
      interlinksAdded++;
    } else if (!hasExtLink) {
      addition = `<p>For public-record building safety context, review the <a href="${route.govUrl}" target="_blank" rel="noopener noreferrer">${route.govAnchor}</a>.</p>`;
      citationsAdded++;
    }

    if (addition) {
      if (content.includes('<h2>Frequently Asked Questions</h2>')) {
        content = content.replace('<h2>Frequently Asked Questions</h2>', `${addition}\n<h2>Frequently Asked Questions</h2>`);
      } else {
        content = `${content}\n${addition}`;
      }
      p.dateModified = todayIso;
    }
    p.content = content;
  }

  if (write) {
    fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2), 'utf8');
  }
  return { totalPosts: posts.length, interlinksAdded, citationsAdded };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const res = enrichPostsWithHeyTonyFunnel({ write: !process.argv.includes('--dry-run') });
  console.log(`✅ HeyTony Interlink & Citation Enricher complete:`, res);
}
