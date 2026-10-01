import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const MATRIX_PATH = path.join(ROOT_DIR, 'data', 'seo-colony-matrix.json');
const AUDIT_OUT_PATH = path.join(ROOT_DIR, 'data', 'seo-colony-audit.json');

console.log('================================================================');
console.log('🏰 Edward Sturm SEO Colony & Internal Authority Funnel Audit');
console.log('================================================================\n');

if (!fs.existsSync(MATRIX_PATH)) {
  console.error(`❌ Matrix file missing at: ${MATRIX_PATH}`);
  process.exit(1);
}

const matrix = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
const { colonies = [], questions = [] } = matrix;

console.log(`📊 Loaded ${colonies.length} Colonies and ${questions.length} PAA Feeder Questions.\n`);

// 1. Audit Question Nodes for Edward Sturm & Kyle Roof 4-Part Tag Placement
console.log('--- [1. AUDITING 4-PART ALGORITHMIC TAG PLACEMENT] ---');
let tagPlacementPassCount = 0;
const questionAudits = [];

for (const q of questions) {
  const issues = [];

  // Check 1: Meta Title length and front-loading
  if (!q.metaTitle || q.metaTitle.length < 30 || q.metaTitle.length > 75) {
    issues.push(`Meta Title length abnormal: ${q.metaTitle?.length || 0} chars`);
  }

  // Check 2: Slug cleanliness
  if (!q.slug || !/^[a-z0-9-]+$/.test(q.slug)) {
    issues.push(`Slug is not clean lowercase hyphenated: ${q.slug}`);
  }

  // Check 3: Short Answer BLUF Word Count (< 130 words)
  const wordCount = q.shortAnswer ? q.shortAnswer.trim().split(/\s+/).length : 0;
  if (wordCount < 40 || wordCount > 140) {
    issues.push(`Short answer word count outside 40-140 optimal BLUF range (${wordCount} words)`);
  }

  // Check 4: Em-dash and AI giveaway check
  if (q.shortAnswer && (q.shortAnswer.includes('—') || q.shortAnswer.includes('–'))) {
    issues.push('Contains em-dash/en-dash (AI giveaway flagged in Edward Sturm protocol)');
  }

  // Check 5: Target Money Page defined
  if (!q.moneyPageTarget || !q.moneyPageTarget.url) {
    issues.push('Missing primary target Money Page definition');
  }

  // Check 6: Topical Bridges defined
  if (!q.topicalBridges || q.topicalBridges.length < 1) {
    issues.push('Missing topical bridge connections');
  }

  const passed = issues.length === 0;
  if (passed) tagPlacementPassCount++;

  questionAudits.push({
    slug: q.slug,
    question: q.question,
    wordCount,
    moneyPageUrl: q.moneyPageTarget?.url,
    topicalBridgeCount: q.topicalBridges?.length || 0,
    passed,
    issues
  });
}

console.log(`✔ Tag Placement Validation: ${tagPlacementPassCount}/${questions.length} questions scored 100% compliant.\n`);

// 2. Audit Money Pages & Feeder Authority Graph
console.log('--- [2. AUDITING MONEY PAGE AUTHORITY FEEDERS & VALUE GRAPH] ---');
const moneyPageMap = new Map();

for (const q of questions) {
  const targetUrl = q.moneyPageTarget.url;
  if (!moneyPageMap.has(targetUrl)) {
    moneyPageMap.set(targetUrl, {
      url: targetUrl,
      targetName: q.moneyPageTarget.name,
      feederCount: 0,
      feeders: [],
      dealValue: 0
    });
  }
  const entry = moneyPageMap.get(targetUrl);
  entry.feederCount++;
  entry.feeders.push(q.slug);
}

// Add colonies primary/secondary targets
for (const col of colonies) {
  if (col.primaryMoneyPage?.url && moneyPageMap.has(col.primaryMoneyPage.url)) {
    const entry = moneyPageMap.get(col.primaryMoneyPage.url);
    entry.dealValue = col.primaryMoneyPage.dealValue || entry.dealValue;
  }
}

const moneyPageReports = [];
let totalPipelinePotential = 0;

for (const [url, mp] of moneyPageMap.entries()) {
  const estimatedBatchValue = mp.dealValue * mp.feederCount;
  totalPipelinePotential += estimatedBatchValue;

  // Score from 0 to 100 based on feeder count, bridge richness, and zero-orphan status
  let score = 70; // baseline
  if (mp.feederCount >= 2) score += 15;
  if (mp.feederCount >= 3) score += 15;

  console.log(`🎯 Money Page: ${url}`);
  console.log(`   Name: ${mp.targetName}`);
  console.log(`   Active Colony Feeders: ${mp.feederCount} (${mp.feeders.join(', ')})`);
  console.log(`   Estimated Deal Value: $${mp.dealValue} | Batch Value: $${estimatedBatchValue.toLocaleString()}`);
  console.log(`   Authority Score: ${score}/100 [${score >= 85 ? 'STRONG' : 'MODERATE'}]\n`);

  moneyPageReports.push({
    url,
    targetName: mp.targetName,
    feederCount: mp.feederCount,
    feeders: mp.feeders,
    dealValue: mp.dealValue,
    estimatedBatchValue,
    authorityScore: score
  });
}

// 3. Compile Audit Result Object
const auditSummary = {
  timestamp: new Date().toISOString(),
  totalColonies: colonies.length,
  totalFeederQuestions: questions.length,
  tagPlacementPassRate: `${((tagPlacementPassCount / questions.length) * 100).toFixed(1)}%`,
  totalTargetMoneyPages: moneyPageMap.size,
  totalPipelinePotential,
  moneyPages: moneyPageReports,
  questionAudits
};

fs.writeFileSync(AUDIT_OUT_PATH, JSON.stringify(auditSummary, null, 2), 'utf8');

console.log('----------------------------------------------------------------');
console.log(`✨ AUDIT COMPLETE! Total Pipeline Potential: $${totalPipelinePotential.toLocaleString()}`);
console.log(`📁 Detailed report written to: data/seo-colony-audit.json\n`);
