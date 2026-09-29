import fs from 'fs';
import path from 'path';

/**
 * Autonomous TikTok & Instagram Reel Dispatcher
 * Selects the next 9:16 vertical video kit from the catalog and dispatches
 * a mobile push alert via ntfy.sh with 1-click video download and formatted captions.
 */

const CATALOG_PATH = path.resolve(process.cwd(), 'public', 'social', 'reels', 'reels-catalog.json');
const STATE_FILE = path.resolve(process.cwd(), 'data', 'social-logs', 'tiktok-reel-state.json');
const DISPATCH_LOG = path.resolve(process.cwd(), 'data', 'social-logs', 'tiktok-dispatched.json');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

export async function dispatchNextReel(targetId = null) {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog missing at ${CATALOG_PATH}. Run scripts/render-social-clips.mjs first.`);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  if (catalog.length === 0) {
    throw new Error('Catalog is empty.');
  }

  const stateDir = path.dirname(STATE_FILE);
  if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });

  let state = { nextIndex: 0 };
  if (fs.existsSync(STATE_FILE)) {
    try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch {}
  }

  let reel;
  let reelIndex;

  if (targetId) {
    reelIndex = catalog.findIndex(r => r.id === Number(targetId));
    if (reelIndex === -1) throw new Error(`Reel with ID ${targetId} not found.`);
    reel = catalog[reelIndex];
  } else {
    reelIndex = state.nextIndex % catalog.length;
    reel = catalog[reelIndex];
  }

  console.log(`\n📲 Preparing TikTok & Reel Kit #${reel.id}: "${reel.title}"...`);

  const ntfyPayload = {
    topic: NTFY_TOPIC,
    title: `🎬 New Reel Ready: ${reel.title}`,
    message: `HOOK: "${reel.hook}"\n\nTap to download 9:16 video & post to TikTok / Instagram Reels in 15 seconds!\n\nCaption pre-written with #AtlantaRealEstate hashtags.`,
    priority: 4,
    tags: ['movie_camera', 'sparkles', 'georgia'],
    click: `https://www.fhinspectionsatl.com/social/reels/${path.basename(reel.localPath)}`,
    actions: [
      {
        action: 'view',
        label: '📥 Download Video',
        url: `https://www.fhinspectionsatl.com/social/reels/${path.basename(reel.localPath)}`,
        clear: true,
      },
      {
        action: 'view',
        label: '🌐 Open Bio Hub',
        url: 'https://www.fhinspectionsatl.com/bio',
      },
    ],
  };

  // Dispatch to ntfy.sh using JSON body to support full UTF-8 emojis
  try {
    const res = await fetch(`https://ntfy.sh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ntfyPayload),
    });

    console.log(`📡 Alert dispatched to ntfy.sh/${NTFY_TOPIC} (Status: ${res.status})`);
  } catch (err) {
    console.warn('⚠️ Could not reach ntfy.sh:', err.message);
  }

  // Update State
  state.nextIndex = (reelIndex + 1) % catalog.length;
  state.lastDispatchedId = reel.id;
  state.lastTitle = reel.title;
  state.lastDispatchedAt = new Date().toISOString();

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');

  // Append to Dispatch Log
  let logs = [];
  if (fs.existsSync(DISPATCH_LOG)) {
    try { logs = JSON.parse(fs.readFileSync(DISPATCH_LOG, 'utf8')); } catch {}
  }
  logs.push({
    timestamp: new Date().toISOString(),
    reelId: reel.id,
    title: reel.title,
    caption: reel.caption,
    videoUrl: reel.videoUrl,
  });
  fs.writeFileSync(DISPATCH_LOG, JSON.stringify(logs, null, 2), 'utf8');

  console.log(`✅ Success! Reel #${reel.id} is dispatched and ready on your phone.`);
  console.log(`\n📋 PRE-WRITTEN CAPTION READY TO COPY:\n----------------------------------------\n${reel.caption}\n----------------------------------------\n`);

  return reel;
}

if (process.argv[1]?.includes('dispatch-tiktok-kit.mjs')) {
  const target = process.argv[2] || null;
  dispatchNextReel(target).catch(err => {
    console.error('Fatal dispatch error:', err.message);
    process.exit(1);
  });
}
