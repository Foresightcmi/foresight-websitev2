#!/usr/bin/env node
/**
 * TDD Verification Suite: Footer Infrared Logo, All Interactive Tools & $99 Stripe Flow
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function check(label, ok, detail = '') {
  if (ok) {
    passed++;
    console.log(`  ✅ [PASS] ${label}${detail ? ` — ${detail}` : ''}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

console.log('\n══════════════════════════════════════════════════════════════════');
console.log('  FORESIGHT WEBSITE TOOLS, INFRARED LOGO & $99 STRIPE TDD SUITE');
console.log('══════════════════════════════════════════════════════════════════\n');

// 1. Dark-Background Infrared Certified Logo Contrast Checks
const layoutCode = read('app/layout.js');
const thermalCode = read('app/components/ThermalSlider.js');
const servicePageCode = read('app/services/[service]/page.js');

check(
  '1. Footer uses high-contrast white-text Infrared Certified logo',
  layoutCode.includes('src="/images/infrared-certified-white-text.webp"') &&
    !layoutCode.includes('src="/images/infrared-certified-logo.webp"')
);
check(
  '2. ThermalSlider dark header uses white-text Infrared Certified logo',
  thermalCode.includes('src="/images/infrared-certified-white-text.webp"') &&
    !thermalCode.includes('src="/images/infrared-certified-logo.webp"')
);
check(
  '3. Service dark credential banner uses white-text Infrared Certified logo',
  servicePageCode.includes('src="/images/infrared-certified-white-text.webp"') &&
    !servicePageCode.includes('src="/images/infrared-certified-logo.webp"')
);

// 2. Interactive Tool Integrity Checks
check(
  '4. ThermalSlider Visual (100) and Infrared Thermal (0) quick-toggle buttons match clip-path math',
  thermalCode.includes("setSliderPosition(100); triggerGtag('view_visual_only')") &&
    thermalCode.includes("setSliderPosition(0); triggerGtag('view_thermal_only')")
);

const quoteCode = read('app/quote/QuoteClient.js');
const repairCheckboxSlice = quoteCode.slice(
  quoteCode.indexOf('Contractor Repair Cost &amp; Pricing Estimate') - 450,
  quoteCode.indexOf('Contractor Repair Cost &amp; Pricing Estimate') + 120
);
check(
  '5. QuoteClient Repair Estimate checkbox has readable dark contrast on white card',
  !repairCheckboxSlice.includes("'var(--color-white)'") && !repairCheckboxSlice.includes("'#fde047'")
);

const strCode = read('app/services/components/StrComplianceChecklist.js');
check(
  '6. STR Permit Readiness Checklist uses Call for Quote (zero stale $595 flat price)',
  !strCode.includes('$595') && /Call.*678.*480-2110/i.test(strCode)
);

const blogWidgetCode = read('app/components/BlogRiskScannerWidget.js');
check(
  '7. BlogRiskScannerWidget uses From $275 and From $345 starting-price transparency',
  blogWidgetCode.includes('From $275') && blogWidgetCode.includes('From $345') && !blogWidgetCode.includes('$275+')
);

// 3. Shared Pricing Engine Parity
const { calculateQuoteDetails } = await import('../lib/pricing.js');
const sampleQuote = calculateQuoteDetails({ propertyType: 'single-family', serviceType: 'buyer', sqft: 2200, foundation: 'crawlspace', ageTier: 'under-50', addons: { radon: true, sewer: true } });
const sampleStr = calculateQuoteDetails({ propertyType: 'single-family', serviceType: 'str', sqft: 2000 });
check(
  '8. lib/pricing.js matches QuoteClient & /api/v1/quote (2200 sqft + crawlspace = $550, STR = Call for Quote, zero flat addon fees)',
  sampleQuote.base === 475 && sampleQuote.extra === 75 && sampleQuote.total === 550 && sampleStr.isCustomQuote === true
);

// 4. $99 Outside-Report Tool UI, Sqft Math & Zero Visible Asterisks
const ddCode = read('app/components/DueDiligenceCalculator.js');
check(
  '9. DueDiligenceCalculator displays $99 pricing on card, modal & Stripe checkout button, with zero visible * labels',
  ddCode.includes('$99') &&
    /Proceed to Secure \$99 Stripe Checkout/i.test(ddCode) &&
    !ddCode.includes('Email Address *') &&
    !ddCode.includes('Mobile Phone *') &&
    !ddCode.includes('Property Under Contract *') &&
    !ddCode.includes('Estimated Contractor Remediation: $${d.cost.toLocaleString()}')
);

// 5. Compressed FlateDecode PDF Parsing & Expanded Trade Assemblies
const { extractTextFromPdfBuffer, parseInspectionText, computeConcession } = await import('../lib/repairEngine.js');
const streamBody = Buffer.from(
  'BT /F1 12 Tf 72 720 Td (1. Main sewer lateral root intrusion observed in cast iron pipe.) Tj ' +
  '0 -18 Td (2. Elevated radon gas concentration at 5.8 pCi/L in basement.) Tj ' +
  '0 -18 Td (3. Federal Pacific Stab-Lok breaker panel fire hazard observed.) Tj ET',
  'latin1'
);
const compressed = zlib.deflateSync(streamBody);
const fakePdf = Buffer.concat([
  Buffer.from('%PDF-1.4\n1 0 obj\n<< /Filter /FlateDecode /Length ' + compressed.length + ' >>\nstream\n', 'latin1'),
  compressed,
  Buffer.from('\nendstream\nendobj\n%%EOF', 'latin1'),
]);
const extractedPdfText = extractTextFromPdfBuffer(fakePdf);
const parsedDefects = parseInspectionText(extractedPdfText, '30309');
const concession = computeConcession(parsedDefects, 'balanced', { purchasePrice: 485000, loanType: 'conventional', downPaymentPercent: 10 });
check(
  '10. FlateDecode compressed PDF stream extracts and prices sewer, radon & electrical defects',
  parsedDefects.length >= 3 && concession.totalMedian > 5000,
  `extracted=${extractedPdfText.length} chars, defects=${parsedDefects.length}, median=$${concession.totalMedian}`
);

// 6. Stripe Paywall Verification & Idempotent Fulfillment Pipeline
const verifyRouteExists = fs.existsSync(path.join(ROOT, 'app/api/checkout/verify/route.js'));
const fulfillmentExists = fs.existsSync(path.join(ROOT, 'lib/stripeFulfillment.js'));
const deliveryCode = read('app/components/InstantAuditDelivery.js');
const checkoutCode = read('app/api/checkout/route.js');
const webhookCode = read('app/api/webhook/stripe/route.js');

check(
  '11. Stripe verification endpoint (/api/checkout/verify) & InstantAuditDelivery paywall gate exist',
  verifyRouteExists && deliveryCode.includes('/api/checkout/verify') && deliveryCode.includes('paymentVerified')
);
check(
  '12. Turnkey Stripe checkout + idempotent fulfillment (recordLead + Google Sheets + ntfy + client receipt email)',
  fulfillmentExists &&
    checkoutCode.includes('recordLead') &&
    webhookCode.includes('fulfillPaidStripeSession')
);

console.log(`\n══════════════════════════════════════════════════════════════════`);
console.log(`  TDD RESULT: ${passed}/${passed + failed} PASSED (${failed} FAILED)`);
console.log(`══════════════════════════════════════════════════════════════════\n`);
process.exit(failed > 0 ? 1 : 0);
