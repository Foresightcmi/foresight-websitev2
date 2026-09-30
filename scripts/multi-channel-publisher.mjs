import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const QUEUE_FILE = path.join(ROOT, 'data', 'social-queue.json');
const STATE_FILE = path.join(ROOT, 'data', 'social-logs', 'multi-channel-state.json');
const LOG_FILE = path.join(ROOT, 'data', 'social-logs', 'multi-channel-history.json');
const LATEST_BROADCAST_FILE = path.join(ROOT, 'data', 'social-logs', 'latest-broadcast.md');
const WEBHOOK_CONFIG = path.join(ROOT, 'secrets', 'social-webhook.json');

/**
 * Dispatches the next queued post across Google Business Profile, Facebook, and LinkedIn.
 */
export async function publishNextMultiChannelPost() {
  if (!fs.existsSync(QUEUE_FILE)) {
    throw new Error(`Queue file not found at ${QUEUE_FILE}`);
  }

  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
  if (!queue || queue.length === 0) {
    throw new Error('Queue is empty');
  }

  // Ensure logging directory exists
  const logDir = path.dirname(STATE_FILE);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  // Read or initialize rotation state
  let state = { nextIndex: 0 };
  if (fs.existsSync(STATE_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (_) {}
  }

  const currentIndex = state.nextIndex % queue.length;
  const post = queue[currentIndex];
  const now = new Date().toISOString();

  console.log(`\n============================================================`);
  console.log(`📣 Foresight Multi-Channel Publisher (GBP + Facebook + LinkedIn)`);
  console.log(`============================================================`);
  console.log(`📌 Publishing Post #${post.id} of ${queue.length}: "${post.title}"`);
  console.log(`🎯 Topic: ${post.topic}`);
  console.log(`🔗 Target URL: ${post.link}`);
  console.log(`🖼️  Image Asset: ${post.imageUrl}\n`);

  // Attempt Webhook Dispatch (Zapier / Make.com / Pabbly)
  let webhookResult = { status: 'skipped', reason: 'no_webhook_configured' };
  if (fs.existsSync(WEBHOOK_CONFIG)) {
    try {
      const config = JSON.parse(fs.readFileSync(WEBHOOK_CONFIG, 'utf8'));
      if (config.webhookUrl && config.webhookUrl.startsWith('http')) {
        const payload = {
          post_id: post.id,
          title: post.title,
          topic: post.topic,
          link: post.link,
          image_url: post.imageUrl,
          timestamp: now,
          source: 'Foresight Autonomous Multi-Channel Engine',
          // Distinct channel representations:
          gbp_content: post.gbp,
          facebook_content: post.facebook,
          linkedin_content: post.linkedin,
          // Universal fallback:
          message: post.facebook,
        };

        const res = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const resData = await res.json().catch(() => ({ status: 'delivered' }));
          webhookResult = { status: 'success', statusCode: res.status, response: resData };
          console.log(`\x1b[32m✔ Automated Webhook Delivery: SUCCESS (Status ${res.status})\x1b[0m`);
        } else {
          const errText = await res.text().catch(() => '');
          webhookResult = { status: 'failed', statusCode: res.status, error: errText };
          console.log(`\x1b[33m⚠ Webhook returned status ${res.status} (${errText.slice(0, 100)}). Post saved to local broadcast ledger.\x1b[0m`);
        }
      }
    } catch (err) {
      webhookResult = { status: 'error', error: err.message };
      console.log(`\x1b[33m⚠ Webhook dispatch error: ${err.message}. Post saved to local broadcast ledger.\x1b[0m`);
    }
  }

  // Generate the formatted Markdown broadcast briefing
  const broadcastMarkdown = `# 📣 Active Multi-Channel Broadcast: Post #${post.id}
**Title:** ${post.title}  
**Topic:** ${post.topic}  
**Generated At:** ${now}  
**Target Booking Link:** [${post.link}](${post.link})  
**High-Res Image Asset:** [${post.imageUrl}](${post.imageUrl})  
**Webhook Status:** \`${webhookResult.status}\`

---

## 📍 1. Google Business Profile (GBP) Post
*Optimized for Local 3-Pack, local municipal entities, and direct phone/online booking.*

\`\`\`text
${post.gbp}
\`\`\`

**GBP Call to Action:** Book Online or Call (678) 480-2110  
**Link:** ${post.link}  
**Photo:** Attach \`${post.imageUrl}\`

---

## 👥 2. Facebook Page Post
*Optimized for social engagement, visual storytelling, consumer trust, and homebuyer education.*

\`\`\`text
${post.facebook}
\`\`\`

---

## 💼 3. LinkedIn Thought Leadership Post
*Optimized for Real Estate Agents, GAR Contract Due Diligence, Investors, Attorneys, and Building Science Authority.*

\`\`\`text
${post.linkedin}
\`\`\`

---
*Next post in rotation:* **Post #${queue[(currentIndex + 1) % queue.length].id}: "${queue[(currentIndex + 1) % queue.length].title}"**
`;

  fs.writeFileSync(LATEST_BROADCAST_FILE, broadcastMarkdown, 'utf8');

  // Update rotation state
  state.nextIndex = (currentIndex + 1) % queue.length;
  state.lastPublishedAt = now;
  state.lastPostId = post.id;
  state.lastTitle = post.title;
  state.webhookStatus = webhookResult.status;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');

  // Append to history ledger
  let history = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (_) {}
  }
  history.push({
    postId: post.id,
    title: post.title,
    publishedAt: now,
    webhookResult,
    link: post.link,
  });
  fs.writeFileSync(LOG_FILE, JSON.stringify(history, null, 2), 'utf8');

  console.log(`\n📄 Formatted broadcast briefing generated at:`);
  console.log(`   ${LATEST_BROADCAST_FILE}`);
  console.log(`\n⏭️  Next scheduled post: Post #${queue[state.nextIndex].id}: "${queue[state.nextIndex].title}"\n`);

  return {
    post,
    webhookResult,
    nextPostId: queue[state.nextIndex].id,
  };
}

if (process.argv[1]?.includes('multi-channel-publisher.mjs')) {
  publishNextMultiChannelPost().catch(err => {
    console.error('Fatal multi-channel error:', err);
    process.exit(1);
  });
}
