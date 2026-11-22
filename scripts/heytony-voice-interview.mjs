#!/usr/bin/env node
/**
 * HeyTony Rank Week Day-1 Voice/Text 5-Question E-E-A-T Interview Extractor
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Extracts authentic first-party field inspection telemetry 1 question at a time
 * and synthesizes a truth-locked, Three-Kings + Day-4 interlinked blog entry.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const FIVE_EEAT_INTERVIEW_QUESTIONS = [
  '1. What specific building-science defect or question are buyers and Realtors asking about right now?',
  '2. Walk through one real privacy-scrubbed Metro Atlanta home where your 2-inspector team uncovered this issue.',
  '3. What cosmetic shortcut or misconception causes solo walkthroughs or sellers to miss it?',
  '4. How did documenting this in the interactive digital report protect the buyer during Georgia due diligence?',
  '5. What single check should a homeowner or agent perform before due diligence closes?'
];

const BANNED_REPLACEMENTS = [
  [/\bFLIR\b/gi, 'calibrated infrared thermal camera'],
  [/\bHomeGauge\b/gi, 'interactive digital report'],
  [/\bRSMeans\b/gi, 'regional contractor cost data'],
  [/\bGAR Form F404\b|\bF404\b/gi, 'Georgia Repair Amendment'],
  [/\bF201\b/gi, 'Purchase Agreement'],
  [/\*/g, '']
];

function sanitizeTruth(text) {
  let out = String(text || '');
  for (const [rx, rep] of BANNED_REPLACEMENTS) out = out.replace(rx, rep);
  return out.trim();
}

export function synthesizeInterviewToBlogEntry({
  topic,
  primaryKeyword,
  citySlug = 'atlanta',
  serviceSlug = 'buyer-inspection',
  answers = []
}) {
  const cleanTopic = sanitizeTruth(topic);
  const cleanKw = sanitizeTruth(primaryKeyword || topic);
  const title = (cleanTopic.length <= 60 ? cleanTopic : cleanTopic.slice(0, 57).trim() + '...').replace(/\*/g, '');
  const slug = cleanKw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 68);
  const cityLabel = citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, ' ');
  const a = answers.map(sanitizeTruth);
  const svcHref = `/services/${serviceSlug}/${citySlug}`;

  const content = [
    `<p>Homebuyers researching <strong>${cleanKw}</strong> need clear field diagnostics before Georgia due diligence expires. ${a[0] || ''} Every Single-Family Inspection (From $345; Condos From $295) by our two certified inspectors includes calibrated infrared thermal scans and $35,000 in combined protection ($10,000 Elite Master Warranty plus $25,000 InterNACHI Honor Guarantee).</p>`,
    `<h2>Real Metro Atlanta Field Findings in ${cityLabel}</h2>`,
    `<p>${a[1] || ''}</p>`,
    `<h2>Why Cosmetic Walkthroughs Miss Hidden Risks</h2>`,
    `<p>${a[2] || ''} Compare regional moisture and air-quality benchmarks via the <a href="https://www.epa.gov/mold/mold-course-chapter-2" target="_blank" rel="noopener noreferrer">EPA residential moisture control guide</a>.</p>`,
    `<h2>Protecting Buyer Equity During Georgia Due Diligence</h2>`,
    `<p>${a[3] || ''} Model seller closing credits with our <a href="/repair-credit-calculator">Repair Credit Calculator</a> or schedule a <a href="${svcHref}">two-inspector ${cityLabel} inspection</a>.</p>`,
    `<h2>Pro Tip Before Closing</h2>`,
    `<p>${a[4] || ''} Book online at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>`
  ].join('\n');

  return {
    slug,
    title,
    description: `${cleanKw}: real Metro Atlanta two-inspector field findings, due diligence tips, and inspection guidance.`.slice(0, 155),
    date: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    category: 'Field Diagnostics & Due Diligence',
    keywords: [cleanKw, `${cityLabel} home inspection`],
    content
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--questions-json')) {
    console.log(JSON.stringify({ questions: FIVE_EEAT_INTERVIEW_QUESTIONS }, null, 2));
  } else {
    console.log('HeyTony 5-Question E-E-A-T Interview Prompts:\n' + FIVE_EEAT_INTERVIEW_QUESTIONS.join('\n'));
  }
}
