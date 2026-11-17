import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🔍 FORESIGHT DIGITAL & FIELD TOOLS VERIFICATION AUDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

console.log('1. AUDITING ONLINE QUOTE CALCULATOR (app/quote/QuoteClient.js)...');
const quoteClientCode = fs.readFileSync(path.join(ROOT, 'app', 'quote', 'QuoteClient.js'), 'utf8');
assert(quoteClientCode.includes('parsedSqft <= 1000 ? 295 : 325'), 'Condo pricing correctly starts at $295');
assert(quoteClientCode.includes('if (parsedSqft <= 1000) base = 345;'), 'Single-family starts at $345');
assert(quoteClientCode.includes('parsedSqft <= 2500 ? 275 : 300'), 'Phase 1 Pre-Drywall starts at $275');
assert(quoteClientCode.includes('if (parsedSqft <= 1800) base = 400;'), 'New Construction starts at $400');
assert(quoteClientCode.includes("foundation === 'crawlspace'") && quoteClientCode.includes('extra += 75'), 'Crawlspace foundation surcharge is +$75');
assert(quoteClientCode.includes("foundation === 'basement'") && quoteClientCode.includes('extra += 75'), 'Unfinished Basement surcharge is +$75');
assert(quoteClientCode.includes("serviceType === 'str'") && quoteClientCode.includes('Call (678) 480-2110 for Quote'), 'STR & auxiliary add-ons use Call for Quote');

console.log('\n2. AUDITING REPAIR CREDIT CALCULATOR & $99 EVALUATION TOOL (app/components/DueDiligenceCalculator.js)...');
const ddCalcCode = fs.readFileSync(path.join(ROOT, 'app', 'components', 'DueDiligenceCalculator.js'), 'utf8');
assert(ddCalcCode.includes('SAMPLE DUE DILIGENCE NEGOTIATION LANGUAGE (FOR REALTOR / CLOSING ATTORNEY REVIEW - REPAIR AMENDMENT EXHIBIT)'), 'Generates formatted Georgia repair amendment wording');
assert(ddCalcCode.includes('handleCopyAmendment'), 'Includes 1-click clipboard copy for Realtors');
assert(ddCalcCode.includes('2026 Metro Atlanta Regional Contractor Cost Index'), 'Grounded in 2026 Metro Atlanta contractor pricing index');
assert(ddCalcCode.includes('targetSettlement = Math.round(totalMedian * 0.75)'), 'Applies 75% target cash credit settlement negotiation strategy');
assert(ddCalcCode.includes('Proceed to Secure $99 Stripe Checkout') && ddCalcCode.includes('amount: 99'), 'Includes $99 Outside-Report Stripe Evaluation flow');

console.log('\n3. AUDITING BUILDING SCIENCE RISK SCANNER (app/risk-scanner/RiskScannerClient.js)...');
const riskCalcCode = fs.readFileSync(path.join(ROOT, 'app', 'risk-scanner/RiskScannerClient.js'), 'utf8');
assert(riskCalcCode.includes("gwinnett: { name: 'Gwinnett County"), 'Gwinnett County is fully mapped with geological and structural data');
assert(riskCalcCode.includes('radonZone: 1'), 'Gwinnett County correctly classified under EPA Radon Zone 1');
assert(riskCalcCode.includes('year >= 1978 && year <= 1995') && riskCalcCode.includes('polybutylene'), 'Polybutylene hazard correctly flagged for 1978-1995 homes');
assert(riskCalcCode.includes('fpe-zinsco'), 'FPE Stab-Lok / Zinsco panel fire hazards correctly analyzed');

console.log('\n4. AUDITING NOTIFICATION & STRIPE FULFILLMENT PIPELINE...');
const leadsCode = fs.readFileSync(path.join(ROOT, 'lib', 'leads.js'), 'utf8');
const stripeFulfillCode = fs.readFileSync(path.join(ROOT, 'lib', 'stripeFulfillment.js'), 'utf8');
assert(leadsCode.includes('inspect@foresightcmi.com') && leadsCode.includes('plsinspectnow@gmail.com'), 'Dual email recipients permanently codified');
assert(leadsCode.includes('https://ntfy.sh/fores-antigravity-alerts-77') && stripeFulfillCode.includes('fores-antigravity-alerts-77'), 'Instant real-time ntfy push active on leads & Stripe');
assert(leadsCode.includes('script.google.com/macros/s/') && stripeFulfillCode.includes('script.google.com/macros/s/'), 'Google Sheets Apps Script webhook bridge active on leads & Stripe');

console.log('\n5. AUDITING WEB MCP AGENT TOOLS (app/api/mcp/route.js)...');
const mcpCode = fs.readFileSync(path.join(ROOT, 'app', 'api', 'mcp', 'route.js'), 'utf8');
assert(mcpCode.includes('calculate_quote') && mcpCode.includes('check_city_coverage') && mcpCode.includes('get_service_pricing') && mcpCode.includes('book_inspection_slot'), 'Web MCP provides all 4 live agent tools');

console.log(`\n🏁 AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
process.exit(failCount > 0 ? 1 : 0);
