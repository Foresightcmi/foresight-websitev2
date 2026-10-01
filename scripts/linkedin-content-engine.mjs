#!/usr/bin/env node
/**
 * Foresight Autonomous LinkedIn Growth & Inbound Lead Engine
 * 
 * Synthesizes the masterclasses of:
 * - Tobi Oluwole (400,000 Followers & $6M generated): 10:00 AM weekday cadence, Freytag's Pyramid stories,
 *   picking an enemy (shoddy flips / rushed inspectors), snack-sized 8-12 lines, profile-as-a-funnel.
 * - Josh Sanders & Callum McDonnell (3 Million Followers on LinkedIn):
 *   High dwell-time cheat sheets, "See More" hook line-break architecture, old vs new split comparison cards.
 * 
 * Usage: node scripts/linkedin-content-engine.mjs [--dispatch]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const STORIES_FILE = path.join(ROOT, 'data', 'linkedin-tobi-engine.json');
const STATE_FILE = path.join(ROOT, 'data', 'social-logs', 'linkedin-state.json');
const LOG_FILE = path.join(ROOT, 'data', 'social-logs', 'linkedin-history.json');
const LATEST_STORY_MD = path.join(ROOT, 'data', 'social-logs', 'latest-linkedin-story.md');
const WEBHOOK_CONFIG = path.join(ROOT, 'secrets', 'social-webhook.json');

export async function runLinkedInEngine(shouldDispatch = false) {
  console.log('================================================================');
  console.log('🚀 Foresight LinkedIn Growth & High-Ticket Lead Engine (2026)');
  console.log('   Tobi Oluwole 8-12 Line Freytag Stories + Josh Sanders Dwell-Time');
  console.log('================================================================\n');

  if (!fs.existsSync(STORIES_FILE)) {
    throw new Error(`Stories database not found at ${STORIES_FILE}`);
  }

  const stories = JSON.parse(fs.readFileSync(STORIES_FILE, 'utf8'));
  if (!stories || stories.length === 0) {
    throw new Error('Stories database is empty');
  }

  // Ensure logging directory exists
  const logDir = path.dirname(STATE_FILE);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  let state = { nextIndex: 0, lastRun: null };
  if (fs.existsSync(STATE_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (_) {}
  }

  const currentIndex = state.nextIndex % stories.length;
  const post = stories[currentIndex];
  const now = new Date().toISOString();

  // Format post with Josh Sanders & Tobi Oluwole line-break rules:
  // Line 1: Hook
  // Double break
  // Line 2-3: Hook expansion
  // Double break
  // Core body lines
  // Double break
  // Moral / Takeaway
  const lines = post.lines;
  let formattedPost = '';

  if (lines.length >= 4) {
    const hook = lines[0];
    const expansion = lines.slice(1, 3).join('\n\n');
    const body = lines.slice(3, lines.length - 2).join('\n\n');
    const takeaway = lines.slice(lines.length - 2).join('\n\n');

    formattedPost = `${hook}\n\n${expansion}\n\n${body}\n\n${takeaway}`;
  } else {
    formattedPost = lines.join('\n\n');
  }

  // Simulate "...see more" cutoff (LinkedIn truncates around character 180-210)
  const seeMoreCutoffIndex = 195;
  const aboveFoldSnippet = formattedPost.length > seeMoreCutoffIndex 
    ? formattedPost.substring(0, seeMoreCutoffIndex) + '... [see more]' 
    : formattedPost;

  console.log(`📌 Post #${post.id} of ${stories.length} (${post.day})`);
  console.log(`🎯 Topic: ${post.topic}`);
  console.log(`🏷️  Type: ${post.type.toUpperCase()} (${post.type === 'deposit' ? 'Value/Story Deposit' : 'High-Ticket Funnel Withdrawal'})`);
  console.log(`🖼️  Visual Pairing: ${post.imagePath}\n`);

  console.log('--- [LINKEDIN FEED PREVIEW (ABOVE FOLD)] ---');
  console.log(aboveFoldSnippet);
  console.log('--------------------------------------------\n');

  console.log('--- [FULL POST BODY (8-12 LINES)] ---');
  console.log(formattedPost);
  console.log('-------------------------------------\n');

  console.log('--- [FIRST COMMENT (FUNNEL CONVERSION)] ---');
  console.log(post.firstComment);
  console.log('-------------------------------------------\n');

  // Attempt Webhook Dispatch if requested or configured
  let webhookResult = { status: 'skipped', reason: 'manual_or_local_mode' };
  if (shouldDispatch && fs.existsSync(WEBHOOK_CONFIG)) {
    try {
      const config = JSON.parse(fs.readFileSync(WEBHOOK_CONFIG, 'utf8'));
      if (config.webhookUrl && config.webhookUrl.startsWith('http')) {
        const payload = {
          channel: 'linkedin',
          post_id: post.id,
          topic: post.topic,
          type: post.type,
          formatted_text: formattedPost,
          first_comment: post.firstComment,
          image_url: `https://www.fhinspectionsatl.com${post.imagePath}`,
          timestamp: now,
          source: 'Foresight Autonomous LinkedIn Growth Engine'
        };

        const res = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          webhookResult = { status: 'success', statusCode: res.status };
          console.log(`\x1b[32m✔ Automated Webhook Delivery: SUCCESS (Status ${res.status})\x1b[0m`);
        } else {
          webhookResult = { status: 'failed', statusCode: res.status };
          console.log(`\x1b[33m⚠ Webhook returned status ${res.status}. Saved to local ledger.\x1b[0m`);
        }
      }
    } catch (err) {
      webhookResult = { status: 'error', error: err.message };
    }
  }

  // Write Latest Story Markdown Briefing
  const markdownReport = `# 🚀 Foresight LinkedIn Growth Engine: Post #${post.id}

**Schedule Slot:** ${post.day} (10:00 AM Weekday Cadence)  
**Strategy Type:** ${post.type.toUpperCase()} (${post.type === 'deposit' ? '4:1 Value Deposit (Against The Enemy)' : '1:4 High-Ticket Withdrawal'})  
**Topic:** ${post.topic}  
**Image Asset:** \`https://www.fhinspectionsatl.com${post.imagePath}\`  
**Generated At:** ${now}  

---

## 📱 Mobile Above-The-Fold Preview (Before "...see more")
\`\`\`text
${aboveFoldSnippet}
\`\`\`

---

## ✍️ Full Post Text (Copy & Paste to LinkedIn)
\`\`\`text
${formattedPost}
\`\`\`

---

## 💬 First Comment (Drop Immediately After Posting)
\`\`\`text
${post.firstComment}
\`\`\`

---

## 🎯 Conversion Mechanics
- **Hook Architecture:** Josh Sanders Line-Break Pattern (forces dwell time & "...see more" click).
- **Narrative Arc:** Freytag's Pyramid (Personal story exposing the enemy).
- **Funnel Target:** High-ticket CMI due diligence advisory & Instant Quote Calculator.
`;

  fs.writeFileSync(LATEST_STORY_MD, markdownReport, 'utf8');

  // Update State for next post
  state.nextIndex = (currentIndex + 1) % stories.length;
  state.lastRun = now;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');

  // Append to History Log
  let history = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (_) {}
  }
  history.unshift({
    timestamp: now,
    post_id: post.id,
    topic: post.topic,
    type: post.type,
    webhook: webhookResult
  });
  if (history.length > 50) history = history.slice(0, 50);
  fs.writeFileSync(LOG_FILE, JSON.stringify(history, null, 2), 'utf8');

  console.log(`✅ Post #${post.id} processed successfully!`);
  console.log(`📁 Broadcast briefing written to: data/social-logs/latest-linkedin-story.md`);
  console.log(`🔄 Next queued post: #${stories[state.nextIndex].id} ("${stories[state.nextIndex].topic}")\n`);

  return {
    post,
    formattedPost,
    firstComment: post.firstComment,
    webhookResult
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const shouldDispatch = process.argv.includes('--dispatch');
  runLinkedInEngine(shouldDispatch).catch(console.error);
}
