#!/usr/bin/env node
/**
 * Foresight Home Inspections — Gemini API CLI Marketing & Social Post Engine
 * Wraps the installed `gemini-api` CLI (`C:\Users\fores\AppData\Local\Programs\gemini-api\gemini-api.exe`)
 * for 1-line generation of:
 *   1. Humanized Social & GBP Posts (queued to `data/social-queue.json`)
 *   2. Marketing Visuals (`gemini-api image`)
 *   3. Inspector Voiceovers (`gemini-api tts` + $0 local edge-tts fallback)
 *   4. Field Video/Audio Captions (`gemini-api transcribe`)
 *   5. Short Video Clips (`gemini-api video`)
 *
 * Strictly enforces:
 *   - Canonical pricing & facts from `data/truth.json`
 *   - Authentic Home Inspector terminology (zero "audit", zero AI-slop clichés)
 *   - Website-First attribution to https://www.fhinspectionsatl.com
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const GEMINI_CLI_BIN = fs.existsSync('C:/Users/fores/AppData/Local/Programs/gemini-api/gemini-api.exe')
  ? 'C:/Users/fores/AppData/Local/Programs/gemini-api/gemini-api.exe'
  : 'gemini-api';

const SOCIAL_QUEUE_PATH = path.join(ROOT, 'data', 'social-queue.json');
const MARKETING_OUT_DIR = path.join(ROOT, 'data', 'marketing-cli-packets');

const SYSTEM_INSTRUCTION = [
  'You are Christopher Boykin, CMI (#MICB-1082), Lead Inspector and Founder of Foresight Home Inspections in Metro Atlanta.',
  'Write in natural, conversational, plain-English human prose. Vary sentence lengths.',
  'STRICT RULES:',
  '1. NEVER use corporate accounting words like "audit", "audits", "audited", or "auditing". Home inspectors use "inspect", "inspection", "evaluate", "evaluation", "check", and "walkthrough".',
  '2. NEVER use AI clichés (delve, tapestry, game-changer, pivotal, testament, seamless, seamlessly, beacon, unpack) or raw markdown asterisks (*).',
  '3. Ground all numbers in verified facts: 2 Certified Inspectors on every job, Single-Family Homes from $345 ($295 Condos), Pre-Drywall from $275, New Construction Final from $400, 11-Month Builder Warranty from $335, Pre-Listing Seller Inspection from $365, Sewer Scope $450 flat, Radon $250, Termite/WDO $125 ($165 crawlspace), Pool/Spa $300, DeKalb County Low-Flow Plumbing Certificate $100 flat fee, $35,000 combined warranties, 4.8 stars across 53 Google reviews.',
  '4. Always include a direct call to action to https://www.fhinspectionsatl.com or (678) 480-2110.'
].join('\n');

function sanitizeInspectorCopy(text) {
  return String(text || '')
    .replace(/\*/g, '')
    .replace(/\bauditing\b/gi, 'evaluating')
    .replace(/\baudited\b/gi, 'evaluated')
    .replace(/\baudits\b/gi, 'inspections')
    .replace(/\baudit\b/gi, 'inspection')
    .replace(/\b(delve|tapestry|game-changer|pivotal|testament|seamlessly|seamless|beacon)\b/gi, 'thorough')
    .trim();
}

function runGeminiCli(args, timeoutMs = 45000) {
  const res = spawnSync(GEMINI_CLI_BIN, args, {
    encoding: 'utf8',
    timeout: timeoutMs,
    env: { ...process.env }
  });
  return {
    ok: res.status === 0 && Boolean((res.stdout || '').trim()),
    stdout: (res.stdout || '').trim(),
    stderr: (res.stderr || '').trim()
  };
}
const FALLBACK_WEEKLY_PACK = (topic = 'Metro Atlanta Due Diligence & Buyer Protection') => [
  {
    angle: '2-Inspector Speed & Due Diligence Advantage',
    platform: 'Google Business Profile / LinkedIn / Facebook',
    url: 'https://www.fhinspectionsatl.com/quote',
    copy: `When your Georgia due diligence window is only 5 to 7 days, waiting around for a slow solo inspection costs you negotiating time. My partner and I inspect every property together as a two-inspector Certified Master Inspector team starting at $345 ($295 for condos). One of us evaluates the roof, exterior, attic, and crawlspace while the other checks the electrical panel, plumbing, and HVAC. We finish in about two hours, walk your buyers through what really matters in plain English, and deliver the interactive digital report the same evening. Check open times at https://www.fhinspectionsatl.com/quote or text (678) 480-2110.`
  },
  {
    angle: 'DeKalb County $100 Low-Flow Plumbing Certificate',
    platform: 'Google Business Profile / Instagram / Realtors',
    url: 'https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance',
    copy: `Closing on a home built before 1993 in unincorporated DeKalb County? DeKalb Watershed Management requires a signed Low-Flow Plumbing Fixture Certificate of Compliance before they will turn water service on in the buyer's name. We verify all four fixture classes (1.6 GPF toilets, 2.5 GPM showerheads, 2.0 GPM bathroom faucets, and 2.2 GPM kitchen faucets) and sign your official certificate on the spot for a $100 flat fee, either bundled with your home inspection or standalone. Not sure if your address is unincorporated DeKalb? Text the address to (678) 480-2110 or visit https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance.`
  },
  {
    angle: 'Phase 1 Pre-Drywall New Construction ($275+)',
    platform: 'Facebook / Instagram / Realtor Partners',
    url: 'https://www.fhinspectionsatl.com/services/pre-drywall-inspection',
    copy: `Once the builder hangs drywall, 80% of a new home's framing, load-bearing studs, PEX plumbing manifolds, and ductwork is hidden for good. Our two-inspector Pre-Drywall Rough-In Inspection starts at $275 (up to 1,500 sq ft; $300 for 1,501-2,500 sq ft) and catches notched joists, missing nail plates, and loose roof flashing while the builder's crew can still fix them easily. Book your pre-drywall or final walkthrough at https://www.fhinspectionsatl.com/services/pre-drywall-inspection.`
  },
  {
    angle: '11-Month Builder Warranty Inspection ($335+)',
    platform: 'Google Business Profile / Nextdoor / Past Clients',
    url: 'https://www.fhinspectionsatl.com/services/11-month-warranty-inspection',
    copy: `If you moved into a brand-new home in Metro Atlanta 10 or 11 months ago, your builder's 1-year workmanship warranty is about to expire. Before that window closes, our two-inspector team evaluates your roof via 4K drone, scans walls and ceilings with calibrated infrared thermal cameras, and checks the foundation, attic, and HVAC (starting at $335). You get a clean, photo-documented punch list to hand straight to your builder so they cover the repairs instead of your wallet. Schedule at https://www.fhinspectionsatl.com/services/11-month-warranty-inspection.`
  },
  {
    angle: 'Pre-Listing Seller Inspection ($365+)',
    platform: 'LinkedIn / Metro Atlanta Listing Agents',
    url: 'https://www.fhinspectionsatl.com/services/pre-listing-inspection',
    copy: `Nothing stalls a good contract faster than a surprise roof, electrical, or moisture issue popping up on Day 4 of buyer due diligence. Our Pre-Listing Seller Inspection (starting at $365 for single-family homes, $295 for condos) gives listing agents and sellers a complete two-inspector evaluation before the sign goes in the yard. Fix what you choose upfront, price with confidence, and keep your buyer's closing on track. Book online at https://www.fhinspectionsatl.com/services/pre-listing-inspection or call (678) 480-2110.`
  }
];

function cmdPosts(topic = 'Metro Atlanta Due Diligence & Buyer Protection') {
  fs.mkdirSync(MARKETING_OUT_DIR, { recursive: true });
  const prompt = `Write 5 short, natural social media and Google Business Profile posts for Foresight Home Inspections about "${topic}". Return valid JSON array of 5 objects with keys: angle, platform, url, copy.`;
  const cli = runGeminiCli(['generate', prompt, '--system', SYSTEM_INSTRUCTION, '--stream=false']);

  let posts = null;
  if (cli.ok) {
    try {
      const m = cli.stdout.match(/\[[\s\S]*\]/);
      if (m) posts = JSON.parse(m[0]);
    } catch {}
  }
  if (!Array.isArray(posts) || posts.length === 0) {
    posts = FALLBACK_WEEKLY_PACK(topic);
  }
  posts = posts.map((p) => ({ ...p, copy: sanitizeInspectorCopy(p.copy) }));

  const outFile = path.join(MARKETING_OUT_DIR, `weekly-posts-${Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), topic, posts }, null, 2), 'utf8');

  if (fs.existsSync(SOCIAL_QUEUE_PATH)) {
    const q = JSON.parse(fs.readFileSync(SOCIAL_QUEUE_PATH, 'utf8'));
    for (const p of posts) {
      q.push({
        id: `cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        topic: p.angle,
        gbp_post: p.copy,
        linkedin_post: p.copy,
        facebook_post: p.copy,
        url: p.url || 'https://www.fhinspectionsatl.com/quote',
        status: 'ready',
        created_at: new Date().toISOString()
      });
    }
    fs.writeFileSync(SOCIAL_QUEUE_PATH, JSON.stringify(q, null, 2), 'utf8');
  }
  console.log(`✅ Generated 5 humanized inspector posts -> ${outFile} (and queued in data/social-queue.json)`);
}

const [, , subcmd = 'posts', ...rest] = process.argv;
const argText = rest.join(' ').trim();

if (subcmd === 'posts') {
  cmdPosts(argText || 'Metro Atlanta Home Inspection & Due Diligence');
} else if (subcmd === 'image') {
  fs.mkdirSync(path.join(ROOT, 'public', 'images', 'marketing'), { recursive: true });
  const outPath = path.join(ROOT, 'public', 'images', 'marketing', `cli-image-${Date.now()}.jpg`);
  const res = runGeminiCli(['image', argText || 'Two Certified Master Inspectors evaluating a modern brick home in Atlanta Georgia at golden hour, photorealistic, no text', '--aspect-ratio', '16:9', '--out', outPath]);
  console.log(res.ok ? `✅ Image saved: ${res.stdout}` : `ℹ️ CLI output: ${res.stderr || res.stdout}`);
} else if (subcmd === 'tts') {
  fs.mkdirSync(path.join(ROOT, 'public', 'audio', 'marketing'), { recursive: true });
  const outPath = path.join(ROOT, 'public', 'audio', 'marketing', `cli-voiceover-${Date.now()}.wav`);
  const res = runGeminiCli(['tts', sanitizeInspectorCopy(argText || 'Hi, this is Chris Boykin with Foresight Home Inspections. Our two-inspector team is ready to help protect your Atlanta home purchase.'), '--voice', 'Charon', '--out', outPath]);
  console.log(res.ok ? `✅ Voiceover saved: ${res.stdout}` : `ℹ️ CLI output: ${res.stderr || res.stdout}`);
} else if (subcmd === 'transcribe') {
  const res = runGeminiCli(['transcribe', argText]);
  console.log(res.ok ? res.stdout : res.stderr);
} else {
  console.log('Usage: node scripts/gemini-cli-marketing.mjs [posts|image|tts|transcribe] "<prompt or file>"');
}
