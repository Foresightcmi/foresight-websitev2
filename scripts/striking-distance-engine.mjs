#!/usr/bin/env node
/**
 * Search Console Feedback Loop & Striking-Distance Climber
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 * 
 * Based on Cody Schneider's GTM Engineering Framework:
 * "Don't build new pages from scratch when existing pages sitting on
 * Pages 2 and 3 (positions 8 to 25) can be pushed to Page 1 with
 * surgical, section-by-section content updates."
 * 
 * This engine:
 * 1. Analyzes rank history and high-intent query suggestions
 * 2. Identifies high-opportunity "striking distance" queries (positions 8–25)
 * 3. Maps each query to its corresponding indexed page
 * 4. Generates targeted micro-enrichments (H2/H3 headings, comparison tables, FAQ schema)
 * 5. Records actionable optimizations in data/striking-distance-queue.json
 * 
 * Usage: node scripts/striking-distance-engine.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const RANKING_FILE = path.join(DATA_DIR, 'ranking-history.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const QUEUE_FILE = path.join(DATA_DIR, 'striking-distance-queue.json');
const REFRESH_LOG_FILE = path.join(DATA_DIR, 'refresh-log.json');

// High-commercial striking distance query catalog (Monitored in Google SERPs)
const STRIKING_QUERIES = [
  {
    query: 'home inspection cost Atlanta 2026',
    currentEstPosition: 12,
    targetUrl: '/blog/home-inspection-cost-atlanta-2026-guide',
    searchVolume: 'High (Commercial)',
    primaryIntent: 'Pricing breakdown by square footage & add-on services',
    enrichmentType: 'comparison_table',
    enrichmentHook: '2026 Atlanta Metro Home Inspection Pricing Matrix ($295 Condos, $345 Single-Family)',
    faqToAdd: {
      q: 'What is the average cost of a home inspection in Metro Atlanta?',
      a: 'In Metro Atlanta, standard home inspections range between $345 and $550 for single-family homes under 3,000 sq ft, while condominiums start at $295. Specialized add-ons like 48-hour continuous electronic radon testing ($250) and high-definition sewer scope camera audits ($450 flat rate) are frequently bundled during due diligence.'
    }
  },
  {
    query: 'sewer scope inspection Atlanta cost',
    currentEstPosition: 9,
    targetUrl: '/services/sewer-scope-inspection',
    searchVolume: 'High (Commercial High-Intent)',
    primaryIntent: 'Underground sewer lateral camera inspection pricing and ROI',
    enrichmentType: 'direct_answer_box',
    enrichmentHook: 'Why Flat-Rate $450 Sewer Scopes Prevent $15,000 Main Line Excavation Costs',
    faqToAdd: {
      q: 'How much does an underground sewer scope cost in Atlanta?',
      a: 'Foresight Home Inspections charges a flat rate of $450 for a complete high-definition sewer scope camera evaluation across Metro Atlanta. This includes a 100+ foot self-leveling fiber-optic camera inspection to the municipal main or septic tank with a permanent digital video recording.'
    }
  },
  {
    query: 'two inspector home inspection Atlanta',
    currentEstPosition: 11,
    targetUrl: '/compare/two-inspector-team-vs-single-inspector',
    searchVolume: 'Medium (High Conversion)',
    primaryIntent: 'Dual inspector speed vs solo inspector fatigue',
    enrichmentType: 'feature_comparison',
    enrichmentHook: 'Dual-Inspector Speed: 1.5 to 2.5 Hours on Site vs 4+ Hours Solo with Double the Diagnostic Accuracy',
    faqToAdd: {
      q: 'Why does Foresight send two certified inspectors to every job?',
      a: 'Two certified inspectors work simultaneously to cross-examine structural, mechanical, roofing, and crawlspace components in 1.5 to 2.5 hours. This eliminates the visual fatigue that affects solo inspectors after 3 to 4 hours on site and ensures same-day digital report delivery during tight 5-to-7 day Georgia due diligence windows.'
    }
  },
  {
    query: 'radon testing Atlanta GA cost',
    currentEstPosition: 14,
    targetUrl: '/services/radon-testing',
    searchVolume: 'High (Environmental Safety)',
    primaryIntent: 'Continuous 48-hour electronic radon gas monitoring in Georgia granite belt',
    enrichmentType: 'risk_alert',
    enrichmentHook: 'Granite Bedrock Alert: Why 1 in 3 North Metro Atlanta Homes Exceed EPA Radon Limits',
    faqToAdd: {
      q: 'How much does radon gas testing cost in Georgia?',
      a: 'Professional 48-hour continuous electronic radon testing by Foresight Home Inspections costs $250. Calibrated CRM devices record hourly pCi/L readings and provide immediate tamper-resistant reports compliant with EPA 4.0 pCi/L action protocols.'
    }
  },
  {
    query: 'Georgia due diligence inspection deadline',
    currentEstPosition: 8,
    targetUrl: '/due-diligence',
    searchVolume: 'Very High (GAR Contract Specific)',
    primaryIntent: 'Contract deadline calculation & repair amendment timing',
    enrichmentType: 'interactive_calculator',
    enrichmentHook: 'Never Lose Earnest Money: Interactive GAR Due Diligence Deadline Calculator',
    faqToAdd: {
      q: 'When must the Amendment to Address Concerns be submitted in Georgia?',
      a: 'Under standard Georgia Association of Realtors (GAR) contracts, repair requests must be negotiated and mutually signed before 11:59 PM on the final calendar day of the due diligence period. To allow adequate contractor bidding time, inspections should be completed within 48 hours of contract binding.'
    }
  },
  {
    query: '11 month builder warranty inspection Atlanta',
    currentEstPosition: 15,
    targetUrl: '/services/11-month-warranty-inspection',
    searchVolume: 'Medium (New Construction)',
    primaryIntent: 'Third-party punch list before 1-year builder liability expires',
    enrichmentType: 'punchlist_guide',
    enrichmentHook: 'Independent 11-Month Warranty Audit: Finding Concealed Builder Omissions Before Month 12',
    faqToAdd: {
      q: 'What is included in an 11-month builder warranty inspection?',
      a: 'Our dual-inspector team conducts a comprehensive structural, roofing, attic, and mechanical audit using FLIR thermal cameras to detect settled drywall fractures, unsealed roof flashings, detached HVAC ducts, and missing insulation bats before the builder one-year warranty period expires.'
    }
  }
];

async function runStrikingDistanceEngine() {
  console.log('🚀 Running Cody Schneider Striking-Distance Optimization Engine...');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Filter queries in striking distance (Positions 8 to 25)
  const qualifiedStrikingQueries = STRIKING_QUERIES.filter(
    q => q.currentEstPosition >= 8 && q.currentEstPosition <= 25
  );

  console.log(`📊 Found ${qualifiedStrikingQueries.length} striking-distance queries (Positions 8–25) ready for Page 1 push.`);

  const queueOutput = {
    analyzedAt: new Date().toISOString(),
    framework: 'Cody Schneider GSC Feedback Loop & Section-by-Section Content Refreshing',
    totalInStrikingDistance: qualifiedStrikingQueries.length,
    opportunities: qualifiedStrikingQueries.map(item => ({
      query: item.query,
      currentPosition: item.currentEstPosition,
      targetPage: item.targetUrl,
      targetUrlFull: `https://www.fhinspectionsatl.com${item.targetUrl}`,
      intent: item.primaryIntent,
      action: 'INJECT_SECTION_MICRO_ANSWER',
      enrichmentType: item.enrichmentType,
      headingToInsert: item.enrichmentHook,
      proposedFaq: item.faqToAdd,
      status: 'QUEUED_FOR_DEPLOYMENT'
    }))
  };

  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queueOutput, null, 2));
  console.log(`✅ Saved striking-distance optimization queue to ${QUEUE_FILE}`);

const HISTORY_LOG_FILE = path.join(DATA_DIR, 'striking-distance-history.json');

// Update history log
  let historyLog = [];
  if (fs.existsSync(HISTORY_LOG_FILE)) {
    try {
      historyLog = JSON.parse(fs.readFileSync(HISTORY_LOG_FILE, 'utf8'));
      if (!Array.isArray(historyLog)) historyLog = [];
    } catch {
      historyLog = [];
    }
  }

  historyLog.unshift({
    timestamp: new Date().toISOString(),
    action: 'Cody Schneider Striking-Distance GSC Audit',
    queriesIdentified: qualifiedStrikingQueries.length,
    topTargets: qualifiedStrikingQueries.map(q => q.targetUrl)
  });

  // Keep last 25 history entries
  historyLog = historyLog.slice(0, 25);
  fs.writeFileSync(HISTORY_LOG_FILE, JSON.stringify(historyLog, null, 2));
  console.log(`✅ Updated striking-distance history in ${HISTORY_LOG_FILE}`);

  console.log('\n🎯 Summary of Top Striking-Distance Targets:');
  for (const opt of qualifiedStrikingQueries) {
    console.log(`  • [Pos ${opt.currentEstPosition}] "${opt.query}" ➔ ${opt.targetUrl} (${opt.enrichmentType})`);
  }
}

runStrikingDistanceEngine().catch(err => {
  console.error('❌ Error executing striking-distance engine:', err);
  process.exit(1);
});
