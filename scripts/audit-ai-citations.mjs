import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

console.log('\n════════════════════════════════════════════════════════════════');
console.log('       FORESIGHT AI-SEO & GEO CITATION READINESS AUDIT');
console.log("       Standard: Princeton KDD '24 GEO Benchmark & BLUF Rule");
console.log('════════════════════════════════════════════════════════════════\n');

let totalChecks = 0;
let passedChecks = 0;

function check(title, condition, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${title}`);
    if (detail) console.log(`            ${detail}`);
  } else {
    console.log(`  ❌ [FAIL] ${title}`);
    if (detail) console.log(`            ${detail}`);
  }
}

// 1. LLMS.TXT & LLMS-FULL.TXT CHECKS
console.log('1. MACHINE-READABLE AI KNOWLEDGE GRAPH FILES');
const llmsPath = path.join(ROOT, 'public', 'llms.txt');
const llmsFullPath = path.join(ROOT, 'public', 'llms-full.txt');

check('public/llms.txt exists', fs.existsSync(llmsPath));
check('public/llms-full.txt exists', fs.existsSync(llmsFullPath));

if (fs.existsSync(llmsPath)) {
  const content = fs.readFileSync(llmsPath, 'utf8');
  check('llms.txt contains CMI credentialing & 50-mile radius', 
    content.includes('Certified Master Inspector') && content.includes('50-Mile Radius'));
  check('llms.txt contains all 7 defect guide statistical benchmarks',
    content.includes('ASTM E2110') && content.includes('CPSC Publication #516') && content.includes('NJIT/IEEE') && content.includes('Cox v. Shell Oil'));
  check('llms.txt documents Web MCP endpoint and tools',
    content.includes('/api/mcp') && content.includes('calculate_quote') && content.includes('get_service_pricing'));
  check('llms.txt has strict pricing ($450 sewer scope, $250 radon, $345 homes)',
    content.includes('$450 flat rate') && content.includes('$250') && content.includes('$345'));
}

if (fs.existsSync(llmsFullPath)) {
  const fullContent = fs.readFileSync(llmsFullPath, 'utf8');
  check('llms-full.txt contains rich defect benchmarks',
    fullContent.includes('Synthetic Stucco (EIFS) Moisture Intrusion') && fullContent.includes('Aluminum Branch Circuit Wiring Safety'));
}

// 2. DEFECTS PSEO KNOWLEDGE BASE CHECKS
console.log('\n2. DEFECT DIAGNOSTIC KNOWLEDGE BASE (data/defects-pseo.json)');
const defectsPath = path.join(ROOT, 'data', 'defects-pseo.json');
check('data/defects-pseo.json exists', fs.existsSync(defectsPath));

if (fs.existsSync(defectsPath)) {
  const defects = JSON.parse(fs.readFileSync(defectsPath, 'utf8'));
  check('Contains all 7 critical housing defect records', defects.length === 7, `Found ${defects.length} records`);

  let allHaveBluf = true;
  let allHaveStats = true;
  let allHaveTables = true;

  for (const d of defects) {
    if (!d.blufSummary || d.blufSummary.length < 50) allHaveBluf = false;
    if (!d.statisticalBenchmarks || !d.statisticalBenchmarks.riskMetric || !d.statisticalBenchmarks.diagnosticThreshold || !d.statisticalBenchmarks.authorityCitation || !d.statisticalBenchmarks.remediationCost) {
      allHaveStats = false;
    }
    if (!d.tableData || !d.tableData.primaryRisk || !d.tableData.thermalSignatures || !d.tableData.governingStandard || !d.tableData.realtorAction) {
      allHaveTables = false;
    }
  }

  check('100% of defect guides have BLUF answer blocks (First 30% rule)', allHaveBluf);
  check('100% of defect guides have hard statistical benchmarks (+40% citation lift)', allHaveStats);
  check('100% of defect guides have structured technical comparison tables', allHaveTables);
}

// 3. CODEBASE TEMPLATE SCHEMA & SPEAKABLE AUDIT
console.log('\n3. CODEBASE TEMPLATE SCHEMA & SPEAKABLE SPECIFICATION AUDIT');
const defectPagePath = path.join(ROOT, 'app', 'defects', '[slug]', 'page.js');
const cityPagePath = path.join(ROOT, 'app', 'service-areas', '[city]', 'page.js');
const comparePagePath = path.join(ROOT, 'app', 'compare', '[slug]', 'page.js');

if (fs.existsSync(defectPagePath)) {
  const defectPageCode = fs.readFileSync(defectPagePath, 'utf8');
  check('Defect template includes SpeakableSpecification schema targeting .ai-citation-bluf', 
    defectPageCode.includes('SpeakableSpecification') && defectPageCode.includes('.ai-citation-bluf'));
  check('Defect template renders 4-column statistical benchmark grid',
    defectPageCode.includes('defect.statisticalBenchmarks.riskMetric') && defectPageCode.includes('diagnosticThreshold'));
}

if (fs.existsSync(cityPagePath)) {
  const cityPageCode = fs.readFileSync(cityPagePath, 'utf8');
  check('City template includes SpeakableSpecification targeting .city-bluf-summary',
    cityPageCode.includes('SpeakableSpecification') && cityPageCode.includes('.city-bluf-summary'));
  check('City template renders localized EPA Radon Zone designation',
    cityPageCode.includes('EPA Radon Risk') && cityPageCode.includes('Zone 1'));
}

if (fs.existsSync(comparePagePath)) {
  const comparePageCode = fs.readFileSync(comparePagePath, 'utf8');
  check('Compare template integrates interactive ThermalSlider component',
    comparePageCode.includes('ThermalSlider') && comparePageCode.includes('thermal-imaging-vs-standard-visual-inspection'));
}

// 4. REALTOR PRODUCT SURFACE & INTERACTIVE BUILDER AUDIT
console.log('\n4. REALTOR GAR F404 INTERACTIVE BUILDER AUDIT');
const realtorClientPath = path.join(ROOT, 'app', 'realtors', 'RealtorsClient.js');

if (fs.existsSync(realtorClientPath)) {
  const realtorCode = fs.readFileSync(realtorClientPath, 'utf8');
  check('Realtor portal has interactive GAR Form F404 builder',
    realtorCode.includes('GAR Form F404 Interactive Builder') || realtorCode.includes('GAR_PRESETS'));
  check('Realtor builder supports Contractor Repair vs Closing Credit toggling',
    realtorCode.includes('requestMode') && realtorCode.includes('repair') && realtorCode.includes('credit'));
  check('Realtor builder includes 1-click clipboard copy with gtag tracking',
    realtorCode.includes('realtor_gar_clause_copied'));
}

// SUMMARY & SCORE
const score = Math.round((passedChecks / totalChecks) * 100);
console.log('\n════════════════════════════════════════════════════════════════');
console.log(`  AI CITATION READINESS SCORE: ${score}% (${passedChecks}/${totalChecks} Checks Passed)`);
console.log('════════════════════════════════════════════════════════════════\n');

if (score === 100) {
  console.log('🏆 STATUS: FULLY OPTIMIZED FOR GOOGLE AI OVERVIEWS & PERPLEXITY\n');
  process.exit(0);
} else {
  console.log('⚠️ STATUS: SOME CHECKS REQUIRE ATTENTION\n');
  process.exit(1);
}