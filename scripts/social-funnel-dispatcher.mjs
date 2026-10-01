#!/usr/bin/env node
/**
 * Foresight Comment-to-DM Social Funnel Automation Dispatcher
 * 
 * Synthesizes the Marketing Against the Grain / Sabrina Ramonov ($120k/Year) system:
 * - Listens for comment keywords ('CLAUSE', 'RADON', 'QUOTE', 'ESTATE', 'CHECKLIST')
 * - Generates high-converting DM response with UTM tracking links
 * - Asks the single qualifying question to trigger a conversation
 * - Routes converted leads directly into Foresight's CRM ledger (data/leads.json)
 * 
 * Usage:
 *   node scripts/social-funnel-dispatcher.mjs --keyword=CLAUSE --name="Sarah Jenkins" --platform=LinkedIn
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const RULES_FILE = path.join(ROOT, 'data', 'social-funnel-rules.json');
const LEADS_FILE = path.join(ROOT, 'data', 'leads.json');
const DISPATCH_LOG = path.join(ROOT, 'data', 'social-logs', 'social-funnel-history.json');
const LATEST_BRIEFING = path.join(ROOT, 'data', 'social-logs', 'latest-funnel-dispatch.md');

export async function processSocialComment({
  keyword = 'CLAUSE',
  commenterName = 'Atlanta Realtor',
  platform = 'LinkedIn',
  postTitle = 'The 1-Click GAR Clause Generator'
}) {
  console.log('================================================================');
  console.log('⚡ Foresight Social Comment-to-DM Automation ($120k MATG System)');
  console.log('================================================================\n');

  if (!fs.existsSync(RULES_FILE)) {
    throw new Error(`Rules file not found at ${RULES_FILE}`);
  }

  const { rules } = JSON.parse(fs.readFileSync(RULES_FILE, 'utf8'));
  const cleanKw = keyword.trim().toUpperCase();
  const matchedRule = rules.find(r => r.keyword === cleanKw) || rules[0];

  const firstName = commenterName.split(' ')[0] || 'there';
  const personalizedDm = matchedRule.dmScript.replace(/{firstName}/g, firstName);
  const now = new Date().toISOString();

  console.log(`👤 Commenter: ${commenterName} (${platform})`);
  console.log(`🔑 Trigger Keyword: "${cleanKw}"`);
  console.log(`🎯 Lead Magnet: ${matchedRule.leadMagnetName}`);
  console.log(`🔗 Tracked URL: ${matchedRule.trackedUrl}`);
  console.log(`💰 Potential Deal Value: $${matchedRule.estimatedDealValue}\n`);

  console.log('--- [AUTOMATED DM PAYLOAD] ---');
  console.log(personalizedDm);
  console.log('------------------------------\n');

  // Ingest Lead into data/leads.json
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    } catch (_) {}
  }

  const newLead = {
    id: `social_dm_${Date.now()}`,
    name: commenterName,
    platform,
    triggerKeyword: matchedRule.keyword,
    leadMagnet: matchedRule.leadMagnetName,
    status: 'DM_DISPATCHED',
    stage: 'Lead Magnet Delivered',
    estimatedTotal: matchedRule.estimatedDealValue,
    source: `${platform} DM Automation (${matchedRule.keyword})`,
    date: now,
    followUpQuestion: matchedRule.followUpQuestion,
    notes: `Triggered by comment on post: "${postTitle}". Automated DM sent with ${matchedRule.leadMagnetName}.`
  };

  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  console.log(`✅ Lead captured and attributed in data/leads.json!`);

  // Write Markdown Briefing
  const mdReport = `# ⚡ Social Funnel DM Automation Dispatch

**Commenter:** ${commenterName}  
**Platform:** ${platform}  
**Trigger Keyword:** \`${matchedRule.keyword}\`  
**Delivered Magnet:** ${matchedRule.leadMagnetName}  
**Pipeline Value:** $${matchedRule.estimatedDealValue}  
**Timestamp:** ${now}  

---

## 💬 Automated DM Message
\`\`\`text
${personalizedDm}
\`\`\`

---

## 🎯 Next Step
Awaiting user response to qualification prompt:
> *"${matchedRule.followUpQuestion}"*
`;

  const logDir = path.dirname(LATEST_BRIEFING);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(LATEST_BRIEFING, mdReport, 'utf8');

  // Append to history
  let history = [];
  if (fs.existsSync(DISPATCH_LOG)) {
    try {
      history = JSON.parse(fs.readFileSync(DISPATCH_LOG, 'utf8'));
    } catch (_) {}
  }
  history.unshift({
    timestamp: now,
    commenter: commenterName,
    platform,
    keyword: matchedRule.keyword,
    value: matchedRule.estimatedDealValue
  });
  if (history.length > 50) history = history.slice(0, 50);
  fs.writeFileSync(DISPATCH_LOG, JSON.stringify(history, null, 2), 'utf8');

  return {
    success: true,
    lead: newLead,
    personalizedDm
  };
}

// CLI Execution support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let kw = 'CLAUSE';
  let name = 'Marcus Vance (Keller Williams Luxury)';
  let plat = 'LinkedIn';

  for (const a of args) {
    if (a.startsWith('--keyword=')) kw = a.split('=')[1];
    if (a.startsWith('--name=')) name = a.split('=')[1];
    if (a.startsWith('--platform=')) plat = a.split('=')[1];
  }

  processSocialComment({ keyword: kw, commenterName: name, platform: plat }).catch(console.error);
}
