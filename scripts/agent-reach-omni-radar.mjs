#!/usr/bin/env node
/**
 * Foresight Home Inspections — Agent-Reach Omni-Medium Demand & Referral Radar
 * Runs Twice Daily (07:30 AM & 12:30 PM ET) at $0.00 cost with zero social cookies.
 * Feeds:
 *   1. YouTube & IG Relocation/New-Build Realtors -> sync-email-campaign-bridge.mjs
 *   2. Fresh Metro Atlanta Buyer Threads (Reddit, BiggerPockets, Nextdoor) -> ntfy.sh + CMI Drafts
 *   3. Investigative TV Reporters, Podcasts & ATL Substacks -> digital-pr-scout.mjs
 *   4. 10-12 Mo Old Subdivision Grand Openings -> 11-Month Warranty Pipeline
 *   5. Live Market Defect Hooks -> omni-video-publisher (70/20/10 Carousel & Video Queue)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isSuppressedEntity,
  loadUnsubscribedSet,
  runAgentReach,
  sanitizeForTruth
} from './lib/agent-reach-client.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(WEB_ROOT, 'data');
const INTEL_OUT = path.join(DATA_DIR, 'agent-reach-intel.json');
const SEEN_LEDGER = path.join(DATA_DIR, 'agent-reach-seen-ledger.json');
const NTFY_URL = 'https://ntfy.sh/fores-antigravity-alerts-77';
const TODAY = new Date().toISOString().slice(0, 10);

const truth = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'truth.json'), 'utf8'));
const unsubSet = loadUnsubscribedSet(WEB_ROOT);

const KNOWN_YT_REALTOR_DIRECTORY = [
  {
    matchRe: /erin\s+coker/i,
    name: 'Erin Coker',
    first: 'Erin',
    brokerage: 'Compass',
    city: 'Atlanta',
    email: 'erin.coker@compass.com',
    phone: '404-956-0956',
    profile_url: 'https://www.compass.com/agents/erin-coker/'
  },
  {
    matchRe: /tim\s+trevathan/i,
    name: 'Tim Trevathan',
    first: 'Tim',
    brokerage: 'Virtual Properties Realty (Tim Trevathan Homes)',
    city: 'Duluth',
    email: 'realtortimt@gmail.com',
    phone: '770-906-0748',
    profile_url: 'https://timtrevathanhomes.com/contact/'
  },
  {
    matchRe: /angelo\s+mirville/i,
    name: 'Angelo Mirville',
    first: 'Angelo',
    brokerage: 'Real Broker, LLC',
    city: 'McDonough',
    email: 'info@angelomirville.com',
    phone: '678-673-3303',
    profile_url: 'https://angelomirville.com/'
  }
];

function buildCmiEducationalReply(item) {
  const blob = `${item.title || ''} ${item.text || ''}`.toLowerCase();
  let focusTip = 'On Metro Atlanta homes, ask whether your inspector physically enters accessible crawlspaces and attics, scans moisture gradients with a calibrated infrared thermal camera, and evaluates roof flashings via 4K aerial drone rather than binoculars from the driveway.';
  if (/new\s*(build|construction)|pre-?drywall|builder/i.test(blob)) {
    focusTip = 'Even on brand-new Georgia homes, municipal code officials spend only minutes on-site and routinely miss disconnected attic exhaust ducts, missing kick-out flashing, and crushed sewer laterals. Independent Phase 1 Pre-Drywall inspections (starting From $275) and Final New Construction inspections (From $400) give you documented repair leverage before closing.';
  } else if (/crawl\s*space|water|drainage|foundation|marietta|decatur/i.test(blob)) {
    focusTip = 'In Georgia red clay neighborhoods, standing crawlspace moisture and negative yard grading routinely trigger $3,500 to $8,500+ waterproofing negotiations during due diligence. Always insist on full crawlspace entry and calibrated infrared thermal moisture scanning.';
  }
  const draft = [
    `Certified Master Inspector (CMI #MICB-1082) here in Metro Atlanta — happy to share a quick checklist whether you hire us or another independent firm:`,
    `1. ${focusTip}`,
    `2. Walk the property onsite during the final summary so your inspector shows you what is a true $2,500–$10,000+ structural/mechanical negotiation item versus routine $20 homeowner upkeep.`,
    `At Foresight Home Inspections (owner-operated, never private-equity), we send Two Certified Inspectors to every home (Homes From $345 / Condos From $295) for dedicated structural + mechanical depth with zero solo fatigue, same-day interactive digital reports, and $35,000 in combined protection (fhinspectionsatl.com | 678-480-2110).`
  ].join(' ');
  return sanitizeForTruth(draft, truth);
}

async function harvestYoutubeRealtors() {
  const queries = [
    ['youtube', 'search', 'Moving to Atlanta Georgia new construction home tour realtor', '--limit', '4'],
    ['youtube', 'search', 'Erin Coker Atlanta new construction', '--limit', '2'],
    ['youtube', 'search', 'Tim Trevathan Atlanta real estate new construction', '--limit', '2'],
    ['youtube', 'search', 'Angelo Mirville Atlanta new construction', '--limit', '2']
  ];
  const combinedItems = [];
  for (const q of queries) {
    const r = await runAgentReach(q);
    combinedItems.push(...(r.items || []));
  }
  const out = [];
  const seenUrls = new Set();
  for (const it of combinedItems) {
    if (!it.url || seenUrls.has(it.url)) continue;
    seenUrls.add(it.url);
    const authorBlob = `${it.author || ''} ${it.title || ''} ${it.text || ''}`;
    if (isSuppressedEntity({ name: it.author || '', company: it.author || '' }, unsubSet)) continue;
    const matched = KNOWN_YT_REALTOR_DIRECTORY.find((d) => d.matchRe.test(authorBlob));
    const descEmail = (it.text || '').match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]?.toLowerCase() || '';
    const descPhone = (it.text || '').match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || '';
    const liveContact = matched ? {
      name: matched.name, first: matched.first, brokerage: matched.brokerage,
      city: matched.city, email: matched.email, phone: matched.phone, profile_source_url: matched.profile_url
    } : (descEmail && !isSuppressedEntity({ email: descEmail, name: it.author || '' }, unsubSet) ? {
      name: it.author || 'Atlanta Relocation Realtor',
      first: (it.author || 'there').replace(/^Living in Atlanta.*?With\s+/i, '').split(/[\s&]+/)[0] || 'there',
      brokerage: it.author || 'Metro Atlanta Real Estate',
      city: 'Metro Atlanta',
      email: descEmail,
      phone: descPhone,
      profile_source_url: it.url
    } : null);
    const transcriptExcerpt = sanitizeForTruth((it.text || '').replace(/\s+/g, ' ').slice(0, 420), truth);
    out.push({
      medium: 'youtube_relocation_realtor',
      channel_author: it.author || 'Atlanta Relocation Creator',
      video_title: sanitizeForTruth(it.title || 'Metro Atlanta New Construction Guide', truth),
      source_url: it.url,
      retrieved_on: TODAY,
      view_count: it.raw?.view_count || 0,
      transcript_excerpt: transcriptExcerpt,
      verified_contact: liveContact
    });
  }
  return out;
}

async function harvestBuyerIntentThreads() {
  const queries = [
    { platform: 'reddit', args: ['reddit', 'search', 'Atlanta OR Marietta OR Gwinnett OR Decatur home inspector recommendation 2026', '--limit', '5'] },
    { platform: 'biggerpockets', args: ['web', 'search', 'site:biggerpockets.com/forums Atlanta Georgia home inspector recommendation', '--limit', '4'] },
    { platform: 'nextdoor', args: ['web', 'search', 'site:nextdoor.com/p Marietta OR Atlanta OR Decatur OR Alpharetta home inspector recommendation', '--limit', '4'] }
  ];
  const threads = [];
  const seen = new Set();
  for (const q of queries) {
    const res = await runAgentReach(q.args);
    for (const it of res.items || []) {
      const url = it.url || '';
      if (!url || seen.has(url)) continue;
      seen.add(url);
      const publishedAt = it.published_at || null;
      const ageHours = publishedAt ? Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000) : null;
      const mentionsForesight = /foresight\s+home\s+inspections|fhinspectionsatl/i.test(`${it.title || ''} ${it.text || ''}`);
      threads.push({
        platform: q.platform,
        title: sanitizeForTruth(it.title || 'Metro Atlanta Home Inspector Thread', truth),
        source_url: url,
        retrieved_on: TODAY,
        published_at: publishedAt,
        age_hours: ageHours !== null ? Math.round(ageHours) : null,
        is_fresh_72h: ageHours !== null && ageHours <= 72,
        mentions_foresight: mentionsForesight,
        excerpt: sanitizeForTruth((it.text || '').replace(/\s+/g, ' ').slice(0, 340), truth),
        cmiDraftReply: buildCmiEducationalReply(it)
      });
    }
  }
  return threads;
}

async function harvestNewsSubstacksAndShortForm() {
  const newsRes = await runAgentReach(['web', 'search', 'Atlanta Georgia home builder new construction defects housing', '--limit', '5']);
  const subRes = await runAgentReach(['web', 'search', 'site:substack.com Atlanta housing real estate', '--limit', '4']);
  const igRes = await runAgentReach(['web', 'search', 'site:instagram.com Atlanta realtor new construction home tour', '--limit', '4']);
  const warrantyRes = await runAgentReach(['web', 'search', 'Atlanta Georgia new home community grand opening 2025', '--limit', '6']);
  const mediaItems = [...(newsRes.items || []).map((x) => ({ ...x, kind: 'investigative_tv_print' })), ...(subRes.items || []).map((x) => ({ ...x, kind: 'atlanta_substack' }))]
    .filter((x) => x.url)
    .map((x) => ({
      kind: x.kind,
      title: sanitizeForTruth(x.title || 'Atlanta Housing Story', truth),
      author: x.author || (x.kind === 'atlanta_substack' ? 'Atlanta Substack Writer' : 'Atlanta Investigative Desk'),
      published_at: x.published_at || null,
      source_url: x.url,
      retrieved_on: TODAY,
      excerpt: sanitizeForTruth((x.text || '').replace(/\s+/g, ' ').slice(0, 320), truth)
    }));
  const igTours = (igRes.items || []).map((x) => {
    const inlineUrl = x.url || (x.text || '').match(/https:\/\/www\.instagram\.com\/[^\s]+/)?.[0] || '';
    return {
      medium: 'instagram_new_build_tour',
      title: sanitizeForTruth(x.title || 'Atlanta New Construction Reel', truth),
      source_url: inlineUrl,
      retrieved_on: TODAY
    };
  }).filter((x) => x.source_url);
  const warrantyCohorts = (warrantyRes.items || []).filter((x) => x.url).map((x) => ({
    medium: '11_month_warranty_subdivision_cohort',
    title: sanitizeForTruth(x.title || 'Metro Atlanta 2025 New Home Community', truth),
    published_at: x.published_at || null,
    source_url: x.url,
    retrieved_on: TODAY,
    excerpt: sanitizeForTruth((x.text || '').replace(/\s+/g, ' ').slice(0, 280), truth)
  }));
  return { mediaItems, igTours, warrantyCohorts };
}


function buildSocialMarketHooks(mediaItems, threads, warrantyCohorts) {
  const topNews = mediaItems[0] || {};
  const topThread = threads[0] || {};
  const topWarranty = warrantyCohorts[0] || {};
  const rawHooks = [
    {
      id: 'hook_new_build_defects_atl',
      defect_category: 'structural_framing_and_ductwork',
      theme_title: 'Metro Atlanta New Construction Defect Alert: What Municipal Code Checks Miss',
      hook_headline: sanitizeForTruth(`Local Housing Alert: "${(topNews.title || 'Georgia New-Build Defect Investigations').slice(0, 88)}" — Why Phase 1 Pre-Drywall (From $275) & Final New Construction (From $400) Inspections Pay for Themselves`, truth),
      negotiation_leverage: '$2,400–$9,800+ in pre-closing builder punch-list repairs (disconnected attic exhausts, missing kick-out flashing, unsealed penetrations)',
      pricing_anchor: 'Pre-Drywall From $275 | Final New Construction From $400',
      source_url: topNews.source_url || 'https://fhinspectionsatl.com/services/new-construction-inspection',
      retrieved_on: TODAY
    },
    {
      id: 'hook_red_clay_crawlspace_moisture',
      defect_category: 'crawlspace_moisture_and_drainage',
      theme_title: 'Georgia Red Clay Crawlspace & Drainage Negotiation Shield',
      hook_headline: sanitizeForTruth(`Live Metro Atlanta Buyer Question: "${(topThread.title || 'Crawlspace Moisture & Foundation Checks').slice(0, 88)}" — How Calibrated FLIR Thermal Scanning Protects Georgia Due Diligence`, truth),
      negotiation_leverage: '$3,500–$14,200+ in Georgia Repair Amendment seller credits for standing crawlspace water, negative grading, and subfloor fungal moisture',
      pricing_anchor: 'Two Certified Inspectors | Residential Homes From $345 | Condos From $295',
      source_url: topThread.source_url || 'https://fhinspectionsatl.com',
      retrieved_on: TODAY
    },
    {
      id: 'hook_11_month_builder_warranty_window',
      defect_category: 'roof_envelope_and_warranty_expiration',
      theme_title: '2025 Metro Atlanta New-Home Owners: Your 11-Month Builder Warranty Clock Is Ticking',
      hook_headline: sanitizeForTruth(`11-Month Builder Warranty Alert for Recent Closings ("${(topWarranty.title || '2025 Metro Atlanta New Communities').slice(0, 82)}"): Document Hidden Roof, Plumbing & Truss Settlement Before Month 12 Expires`, truth),
      negotiation_leverage: '$1,850–$7,600+ in builder-funded warranty repairs documented before the 1-year fit-and-finish warranty closes',
      pricing_anchor: '11-Month Builder Warranty Inspection From $345 (2 Certified Inspectors + 4K Drone + Thermal)',
      source_url: topWarranty.source_url || 'https://fhinspectionsatl.com/services/11-month-warranty-inspection',
      retrieved_on: TODAY
    }
  ];
  return rawHooks;
}

async function main() {
  console.log('📡 [Agent-Reach Omni-Radar] Scanning 10 Metro Atlanta Demand & Referral Mediums ($0.00 / zero social cookies)...');
  const outreachLogPath = path.join(DATA_DIR, 'agent-reach-outreach-log.json');
  if (!fs.existsSync(outreachLogPath)) fs.writeFileSync(outreachLogPath, '[]\n');

  const youtubePromise = harvestYoutubeRealtors();
  const buyerIntentThreads = await harvestBuyerIntentThreads();
  const multiPack = await harvestNewsSubstacksAndShortForm();
  const youtubeRealtors = await youtubePromise;

  const socialMarketHooks = buildSocialMarketHooks(multiPack.mediaItems, buyerIntentThreads, multiPack.warrantyCohorts);
  const prevSeen = fs.existsSync(SEEN_LEDGER) ? JSON.parse(fs.readFileSync(SEEN_LEDGER, 'utf8')) : { seenUrls: [] };
  const seenSet = new Set(prevSeen.seenUrls || []);
  const unseenThreads = buyerIntentThreads.filter((t) => !seenSet.has(t.source_url));
  const unseenMedia = multiPack.mediaItems.filter((m) => !seenSet.has(m.source_url));

  for (const t of buyerIntentThreads) seenSet.add(t.source_url);
  for (const m of multiPack.mediaItems) seenSet.add(m.source_url);
  fs.writeFileSync(SEEN_LEDGER, JSON.stringify({ updatedAt: new Date().toISOString(), seenUrls: [...seenSet].slice(-600) }, null, 2));

  const payload = {
    generatedAt: new Date().toISOString(),
    retrieved_on: TODAY,
    cadence: 'twice_daily_0730_1230_ET',
    counts: {
      youtubeRealtors: youtubeRealtors.length,
      verifiedYoutubeEmails: youtubeRealtors.filter((r) => r.verified_contact?.email).length,
      instagramNewBuildTours: multiPack.igTours.length,
      buyerIntentThreads: buyerIntentThreads.length,
      unseenBuyerThreads: unseenThreads.length,
      investigativeNewsAndSubstacks: multiPack.mediaItems.length,
      warrantySubdivisionCohorts: multiPack.warrantyCohorts.length,
      socialMarketHooks: socialMarketHooks.length
    },
    youtubeRealtors,
    instagramNewBuildTours: multiPack.igTours,
    buyerIntentThreads,
    investigativeNewsAndSubstacks: multiPack.mediaItems,
    warrantySubdivisionCohorts: multiPack.warrantyCohorts,
    socialMarketHooks
  };
  fs.writeFileSync(INTEL_OUT, JSON.stringify(payload, null, 2));
  console.log(`✅ Wrote ${INTEL_OUT}:`, JSON.stringify(payload.counts));

  if (process.argv.includes('--push') && (unseenThreads.length > 0 || unseenMedia.length > 0 || process.argv.includes('--force-push'))) {
    const topLines = unseenThreads.slice(0, 3).map((t) => `- [${t.platform.toUpperCase()}] ${t.title} (${t.source_url})`).join('\n');
    const body = `Agent-Reach Omni-Radar (${TODAY})\nYT Realtors: ${payload.counts.youtubeRealtors} (${payload.counts.verifiedYoutubeEmails} email-ready) | Threads: ${payload.counts.buyerIntentThreads} (${unseenThreads.length} new) | PR/News: ${payload.counts.investigativeNewsAndSubstacks} | 11-Mo Cohorts: ${payload.counts.warrantySubdivisionCohorts}\n${topLines || 'All CMI reply drafts staged in data/agent-reach-intel.json'}`;
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: { Title: 'Foresight Omni-Medium Demand Radar', Priority: 'default', Tags: 'satellite,house' },
      body
    }).catch((err) => console.warn('ntfy alert skipped:', err.message));
  }
}

main().catch((err) => {
  console.error('❌ Agent-Reach Omni-Radar error:', err);
  process.exit(1);
});
