#!/usr/bin/env node
/**
 * Foresight Tier-2 Standby PC Social & GBP Failover Publisher (PC #2)
 * Foresight Home Inspections, LLC (https://www.fhinspectionsatl.com)
 *
 * Eliminates single-PC dependency on Primary PC's omni-video-publisher:
 *   - Morning Failover Slot:   11:05 AM ET (checks if Primary PC's 10:30 AM ET run succeeded)
 *   - Afternoon Failover Slot: 03:05 PM ET (checks if Primary PC's 02:30 PM ET run succeeded)
 *   - Zero Double-Post Lock:   Pulls latest origin/main first and checks data/chief-of-staff-social-status.json
 *                              in America/New_York local time. Stands down immediately if Primary PC published!
 *
 * Modes:
 *   node scripts/pc2-social-failover-publisher.mjs --slot=morning
 *   node scripts/pc2-social-failover-publisher.mjs --slot=afternoon
 *   node scripts/pc2-social-failover-publisher.mjs --login          (Opens persistent Foresight social profile to sign in once)
 *   node scripts/pc2-social-failover-publisher.mjs --status         (Prints current multi-PC failover readiness, 0 side effects)
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const STATUS_FILE = path.join(ROOT, 'data', 'chief-of-staff-social-status.json');
const QUEUE_FILE = path.join(ROOT, 'data', 'social-queue.json');
const FAILOVER_LOG = path.join(ROOT, 'data', 'social-logs', 'pc2-failover-history.json');
const PROFILE_DIR = path.join(os.homedir(), '.gemini', 'foresight-social-profile');
const WEBHOOK_CONFIG = path.join(ROOT, 'secrets', 'social-webhook.json');
const META_CONFIG = path.join(ROOT, 'secrets', 'meta-credentials.json');

const PLATFORM_LOGIN_URLS = [
  'https://business.google.com/local/business/13295917577711269956/promote/updates',
  'https://www.linkedin.com/company/107206117/admin/page-posts/published/',
  'https://business.facebook.com/latest/composer',
  'https://studio.youtube.com/channel/UC1XFbPYDJ5uJYhjY4w3D1iw/videos/upload',
  'https://www.tiktok.com/tiktokstudio/upload',
  'https://www.pinterest.com/pin-creation-tool/',
  'https://www.fhinspectionsatl.com/studio',
];

function getEasternDateString(dateObj = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

function getEasternHour(dateObj = new Date()) {
  const hr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false,
  }).format(dateObj);
  return Number(hr) % 24;
}

function readJsonSafe(filePath, fallback = {}) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {}
  return fallback;
}

function findBrowserBin() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

function hasWebhookConfigured() {
  if (process.env.SOCIAL_WEBHOOK_URL && process.env.SOCIAL_WEBHOOK_URL.startsWith('http')) return true;
  const cfg = readJsonSafe(WEBHOOK_CONFIG, {});
  return Boolean(cfg.webhookUrl && String(cfg.webhookUrl).startsWith('http'));
}

function hasMetaApiConfigured() {
  if (process.env.META_PAGE_ID && process.env.META_PAGE_ACCESS_TOKEN) return true;
  const cfg = readJsonSafe(META_CONFIG, {});
  return Boolean(cfg.pageId && cfg.pageAccessToken);
}

function hasLocalBrowserProfile() {
  return fs.existsSync(path.join(PROFILE_DIR, 'Default')) || fs.existsSync(path.join(PROFILE_DIR, 'Local State'));
}

async function openLoginSession() {
  const browserBin = findBrowserBin();
  if (!browserBin) {
    console.error('❌ Chrome or Edge not found on this PC.');
    process.exit(1);
  }
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  console.log('🔐 Opening isolated Foresight Social Failover Browser Profile on THIS PC...');
  console.log(`   Profile Path: ${PROFILE_DIR}`);
  console.log('   Sign into GBP, LinkedIn, Meta Business Suite, YouTube Studio, TikTok & Pinterest once, then close the window.');

  const child = spawn(
    browserBin,
    [
      `--user-data-dir=${PROFILE_DIR}`,
      '--no-first-run',
      '--no-default-browser-check',
      ...PLATFORM_LOGIN_URLS,
    ],
    { detached: true, stdio: 'ignore' }
  );
  child.unref();
}

function printReadinessStatus() {
  const todayET = getEasternDateString();
  const status = readJsonSafe(STATUS_FILE, {});
  const lastRunDateET = status.lastRunAt ? getEasternDateString(new Date(status.lastRunAt)) : 'never';
  const primaryPublishedToday = lastRunDateET === todayET && (status.publishedPlatforms || []).length > 0;

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log('  FORESIGHT MULTI-PC & CLOUD SOCIAL FAILOVER STATUS (PC #2)');
  console.log('════════════════════════════════════════════════════════════════════');
  console.log(`  Current Date (America/New_York):   ${todayET}`);
  console.log(`  Primary PC Last Live Publish (ET): ${lastRunDateET} (${status.lastRunAt || 'N/A'})`);
  console.log(`  Primary PC Active Today:           ${primaryPublishedToday ? '✅ YES (Standby will skip duplicates)' : '⚠️ NO (Standby ready to take over)'}`);
  console.log(`  PC #2 Social Browser Profile:      ${hasLocalBrowserProfile() ? '✅ Initialized' : 'ℹ️ Run login_social_accounts_this_pc.bat once to sign in'}`);
  console.log(`  Direct Webhook Configured:         ${hasWebhookConfigured() ? '✅ Ready' : 'ℹ️ Optional (secrets/social-webhook.json or GitHub Secret)'}`);
  console.log(`  Direct Meta Graph API Configured:  ${hasMetaApiConfigured() ? '✅ Ready' : 'ℹ️ Optional (secrets/meta-credentials.json or GitHub Secret)'}`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

async function dispatchCloudApisIfConfigured(post) {
  const publishedPlatforms = [];
  const details = {};

  // 1. Zapier / Make / Buffer Multi-Platform Webhook
  const webhookUrl = process.env.SOCIAL_WEBHOOK_URL || readJsonSafe(WEBHOOK_CONFIG, {}).webhookUrl;
  if (webhookUrl && String(webhookUrl).startsWith('http')) {
    try {
      const payload = {
        source: 'Foresight-Failover-Publisher',
        timestamp: new Date().toISOString(),
        post_id: post.id,
        title: post.title || post.topic,
        topic: post.topic,
        link: post.link || post.url || 'https://www.fhinspectionsatl.com/quote',
        gbp_card_url: 'https://www.fhinspectionsatl.com/social/omnichannel-pack/gbp-store-264545-card.png',
        carousel_slide_urls: [1, 2, 3, 4, 5].map(
          (n) => `https://www.fhinspectionsatl.com/social/omnichannel-pack/slide_${n}.png`
        ),
        linkedin_pdf_url: 'https://www.fhinspectionsatl.com/social/omnichannel-pack/linkedin_carousel_deck.pdf',
        reel_mp4_url: 'https://www.fhinspectionsatl.com/social/omnichannel-pack/reel-3am-homebuyer-red-flags-30s.mp4',
        gbp_content: post.gbp || post.gbp_post,
        facebook_content: post.facebook || post.facebook_post,
        linkedin_content: post.linkedin || post.linkedin_post,
      };
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        publishedPlatforms.push('webhook_omnichannel');
        details.webhook = { ok: true, status: res.status };
      } else {
        details.webhook = { ok: false, status: res.status };
      }
    } catch (err) {
      details.webhook = { ok: false, error: err.message };
    }
  }

  // 2. Direct Meta Graph API (Facebook Page Photo + Caption)
  const metaCfg = readJsonSafe(META_CONFIG, {});
  const pageId = process.env.META_PAGE_ID || metaCfg.pageId;
  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN || metaCfg.pageAccessToken;
  if (pageId && pageAccessToken) {
    try {
      const endpoint = `https://graph.facebook.com/v21.0/${pageId}/photos`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: post.facebook || post.facebook_post,
          url: post.imageUrl || 'https://www.fhinspectionsatl.com/social/omnichannel-pack/slide_1.png',
          access_token: pageAccessToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && !data.error) {
        publishedPlatforms.push('facebook_page_api');
        details.facebook = { ok: true, postId: data.id || data.post_id };
      } else {
        details.facebook = { ok: false, error: data.error?.message || `HTTP ${res.status}` };
      }
    } catch (err) {
      details.facebook = { ok: false, error: err.message };
    }
  }

  return { publishedPlatforms, details };
}

async function runFailover(slot = 'morning') {
  const hourET = getEasternHour();
  // Respect daytime 8:30 AM - 6:30 PM ET window for automated notifications/launches
  const inDaytimeWindow = hourET >= 8 && hourET <= 18;

  // 1. Pull latest git state so we see if Primary PC pushed chief-of-staff-social-status.json
  try {
    execSync('git pull --rebase origin main', { cwd: ROOT, stdio: 'pipe', timeout: 30000 });
  } catch (err) {
    console.warn('⚠️ git pull skipped or offline, checking local status file:', err.message.slice(0, 100));
  }

  const todayET = getEasternDateString();
  const status = readJsonSafe(STATUS_FILE, {});
  const lastRunDateET = status.lastRunAt ? getEasternDateString(new Date(status.lastRunAt)) : '';
  const lastAfternoonET = status.afternoonCarouselRunAt
    ? getEasternDateString(new Date(status.afternoonCarouselRunAt))
    : '';

  if (slot === 'morning' && lastRunDateET === todayET && (status.publishedPlatforms || []).length > 0) {
    console.log(`✅ [PC #2 STANDBY] Primary PC already published today (${todayET}) across ${status.publishedPlatforms.length} platforms. Standing down cleanly.`);
    return;
  }
  if (slot === 'afternoon' && (lastAfternoonET === todayET || (lastRunDateET === todayET && status.slot === 'afternoon'))) {
    console.log(`✅ [PC #2 STANDBY] Afternoon batch already handled today (${todayET}). Standing down cleanly.`);
    return;
  }

  console.log(`🚨 [PC #2 FAILOVER ENGAGED] Primary PC missed the ${slot} social window on ${todayET}. Taking over on PC #2!`);

  // 2. Refresh local multi-channel & LinkedIn rotation ledgers
  try {
    execSync(`"${process.execPath}" scripts/multi-channel-publisher.mjs`, { cwd: ROOT, stdio: 'inherit' });
    execSync(`"${process.execPath}" scripts/linkedin-content-engine.mjs`, { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.warn('⚠️ Queue rotation warning:', err.message);
  }

  // 3. Pick active post & dispatch via any configured direct APIs / Webhooks
  const queue = readJsonSafe(QUEUE_FILE, []);
  const activePost = queue[queue.length - 1] || queue[0] || {
    id: 1,
    title: 'Foresight Two-Inspector Standard & Free Benefits',
    topic: 'Failover Broadcast',
    link: 'https://www.fhinspectionsatl.com/quote',
    gbp: 'Foresight Home Inspections: Two Certified Inspectors on every Metro Atlanta home From $345. Book 24/7 at https://www.fhinspectionsatl.com/quote',
    facebook: 'Foresight Home Inspections: Two Certified Inspectors on every Metro Atlanta home From $345. Book 24/7 at https://www.fhinspectionsatl.com/quote',
    linkedin: 'Foresight Home Inspections: Two Certified Inspectors on every Metro Atlanta home From $345. Book 24/7 at https://www.fhinspectionsatl.com/quote',
  };

  const apiResult = await dispatchCloudApisIfConfigured(activePost);

  // 4. If user initialized PC #2's social browser profile and is in daytime window, open /studio + composer tabs ready to click Post
  let openedComposer = false;
  if (inDaytimeWindow && hasLocalBrowserProfile() && process.env.CI !== 'true' && !process.argv.includes('--headless-only')) {
    const browserBin = findBrowserBin();
    if (browserBin) {
      const child = spawn(
        browserBin,
        [
          `--user-data-dir=${PROFILE_DIR}`,
          '--no-first-run',
          'https://www.fhinspectionsatl.com/studio',
          'https://business.google.com/local/business/13295917577711269956/promote/updates',
          'https://www.linkedin.com/feed/',
          'https://business.facebook.com/latest/composer',
        ],
        { detached: true, stdio: 'ignore' }
      );
      child.unref();
      openedComposer = true;
    }
  }

  // 5. Send daytime ntfy.sh failover alert with 1-tap /studio link
  if (inDaytimeWindow && !process.argv.includes('--no-notify')) {
    const ntfyTopic = process.env.NTFY_TOPIC || 'fores-antigravity-alerts-77';
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: {
          Title: `PC2 Social Failover Engaged (${slot.toUpperCase()})`,
          Tags: 'rotating_light,rocket',
          Click: 'https://www.fhinspectionsatl.com/studio',
        },
        body:
          apiResult.publishedPlatforms.length > 0
            ? `Primary PC was offline on ${todayET}. PC #2 automatically published via [${apiResult.publishedPlatforms.join(', ')}]!`
            : `Primary PC missed ${slot} social slot on ${todayET}. Pre-rendered GBP 4:3 Card, 5-Slide Carousel, LinkedIn PDF & 30s Anthem MP4 are queued & ready at https://www.fhinspectionsatl.com/studio`,
      });
    } catch {}
  }

  // 6. Record failover history & update chief-of-staff-social-status.json if live APIs published
  fs.mkdirSync(path.dirname(FAILOVER_LOG), { recursive: true });
  const history = readJsonSafe(FAILOVER_LOG, []);
  const entry = {
    timestamp: new Date().toISOString(),
    dateET: todayET,
    slot,
    runner: process.env.GITHUB_ACTIONS === 'true' ? 'GitHub-Cloud-Tier3' : 'PC2-Standby-Tier2',
    publishedPlatforms: apiResult.publishedPlatforms,
    openedComposer,
    postId: activePost.id,
    title: activePost.title || activePost.topic,
  };
  history.unshift(entry);
  fs.writeFileSync(FAILOVER_LOG, JSON.stringify(history.slice(0, 60), null, 2) + '\n', 'utf8');

  if (apiResult.publishedPlatforms.length > 0) {
    const nextStatus = {
      ...status,
      lastRunAt: new Date().toISOString(),
      slot,
      failoverRunner: entry.runner,
      topic: activePost.topic || activePost.title,
      livePublish: true,
      publishedPlatforms: apiResult.publishedPlatforms,
      dispatch: apiResult.details,
    };
    if (slot === 'afternoon') nextStatus.afternoonCarouselRunAt = new Date().toISOString();
    fs.writeFileSync(STATUS_FILE, JSON.stringify(nextStatus, null, 2) + '\n', 'utf8');
  }

  console.log(`✅ [FAILOVER COMPLETE] Logged to ${FAILOVER_LOG}`);
}

const args = process.argv.slice(2);
if (args.includes('--login')) {
  openLoginSession();
} else if (args.includes('--status')) {
  printReadinessStatus();
} else {
  const slotArg = args.find((a) => a.startsWith('--slot='));
  const slot = slotArg ? slotArg.split('=')[1] : 'morning';
  runFailover(slot).catch((err) => {
    console.error('❌ Failover Publisher Error:', err);
    process.exit(1);
  });
}
