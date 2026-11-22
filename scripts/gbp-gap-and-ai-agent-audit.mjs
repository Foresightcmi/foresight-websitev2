#!/usr/bin/env node
/**
 * HeyTony GBP Gap (gbpgap.com) & Google Business Profile AI-Agent Readiness Audit
 * Foresight Home Inspections (Store Code 264545 — Primary Category: Home inspector)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'data', 'gbp-gap-and-ai-agent-report.json');

export function runGbpGapAndAiAgentAudit() {
  const truth = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'truth.json'), 'utf8'));
  const services = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'services-pseo.json'), 'utf8'));
  const batch2 = fs.existsSync(path.join(ROOT, 'data', 'competitor-deep-dive-batch2.json'))
    ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'competitor-deep-dive-batch2.json'), 'utf8'))
    : {};

  const privacyPresent = fs.existsSync(path.join(ROOT, 'app', 'privacy', 'page.js'));
  const termsPresent = fs.existsSync(path.join(ROOT, 'app', 'terms', 'page.js'));
  const homeCode = fs.readFileSync(path.join(ROOT, 'app', 'page.js'), 'utf8');
  const sabHidden = !homeCode.includes(truth.business.schemaOnlyStreetAddress);

  const PRICE_MAP = {
    'buyer-inspection': `From ${truth.pricing.singleFamily} (${truth.pricing.condoTownhome} condos)`,
    'pre-listing-inspection': `From ${truth.pricing.preListing}`,
    '11-month-warranty-inspection': `From ${truth.pricing.elevenMonthWarranty}`,
    'pre-drywall-inspection': `From ${truth.pricing.preDrywall}`,
    'new-construction-inspection': `From ${truth.pricing.newConstruction}`
  };

  const gbpServiceCards = services.map((s) => {
    const priceLabel = PRICE_MAP[s.slug] || 'Call for Quote';
    const cleanDesc = `${s.name} across Metro Atlanta by two certified inspectors led by Christopher Boykin, CMI (${priceLabel}). Calibrated infrared thermal imaging and same-day interactive digital report included.`
      .replace(/\*/g, '')
      .slice(0, 295);
    return {
      slug: s.slug,
      serviceName: s.name,
      priceDisplay: priceLabel,
      gbpPasteReadyDescription: cleanDesc,
      landingUrl: `${truth.business.domain}/services/${s.slug}`
    };
  });

  const rivalServicesDetected = new Set(
    Object.values(batch2).flatMap((e) => [...(e.homepage?.services_detected || []), ...(e.services_page?.services_detected || [])].map((x) => String(x).toLowerCase()))
  );
  const coveredTokens = services.map((s) => s.name.toLowerCase());
  const uncoveredRivalServices = [...rivalServicesDetected].filter(
    (rs) => !coveredTokens.some((ct) => ct.includes(rs) || rs.includes(ct.split(' ')[0]))
  );

  const report = {
    analyzedAt: new Date().toISOString(),
    source_url: truth.business.domain,
    retrieved_on: new Date().toISOString().split('T')[0],
    storeCode: '264545',
    primaryCategoryLocked: truth.business.primaryGbpCategory,
    recommendedSecondaryCategories: ['Commercial real estate inspector', 'Environmental health service'],
    aiAgentReadiness: {
      privacyPolicyPresent: privacyPresent,
      termsOfServicePresent: termsPresent,
      sabStreetHiddenInVisibleCopy: sabHidden,
      nameStuffingCheckPassed: truth.business.brandName === 'Foresight Home Inspections',
      readyToEnableGbpAiAgent: privacyPresent && termsPresent && sabHidden
    },
    gbpServiceCards,
    uncoveredRivalServices
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), 'utf8');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = runGbpGapAndAiAgentAudit();
  console.log(`✅ GBP Gap & AI Agent Readiness verified: ${r.gbpServiceCards.length} service cards, AI-Agent Ready=${r.aiAgentReadiness.readyToEnableGbpAiAgent}`);
}
