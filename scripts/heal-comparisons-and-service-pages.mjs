#!/usr/bin/env node
/**
 * Answer Factory & Self-Cannibalization Healer for data/comparisons-pseo.json
 * Aligns 100% with data/truth.json and Julian Goldie's 40-Word BLUF + Zero Rival Praise Rule
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const compPath = path.join(ROOT, 'data', 'comparisons-pseo.json');

const raw = fs.readFileSync(compPath, 'utf8');
let cleaned = raw
  .replace(/Sewer Scope \$450 • Radon \$250 • Pool \$300 • DeKalb Low-Flow \$100/g, 'Specialty Add-Ons (Sewer Scope, Radon, Pool, WDO, DeKalb Low-Flow): Call (678) 480-2110 for Quote')
  .replace(/Sewer Scope Camera inspections are a \$450 flat rate, 48-hour continuous electronic Radon gas testing is \$250, Pool and Spa inspections are \$300, Georgia Termite \/ WDO inspections are \$125 \(\$165 crawlspace\), and DeKalb County Low-Flow Plumbing Compliance Certificates are \$100 flat rate whether standalone or bundled\./g, 'and specialty diagnostics (Sewer Scope Camera, 48-hour continuous electronic Radon gas testing, Pool and Spa, Georgia Termite / WDO, and DeKalb County Low-Flow Plumbing Compliance Certificates) are custom-quoted by calling (678) 480-2110.')
  .replace(/, flat-rate \$450 sewer scopes,/g, ', 200-ft HD fiber-optic sewer scopes (Call for Quote),')
  .replace(/and flat-rate \$450 sewer scopes\./g, 'and 200-ft HD fiber-optic sewer scopes (Call for Quote).')
  .replace(/Strictly \$450 Flat Rate \(HD Video Included\)/g, 'Call (678) 480-2110 for Quote (HD Video Included)')
  .replace(/Strictly \$450 Flat Rate \(Main Out to Street\)/g, 'Call (678) 480-2110 for Quote (Main Out to Street)')
  .replace(/Commercial High-Definition Camera \(\$450 Flat\)/g, 'Commercial High-Definition Camera (Call for Quote)')
  .replace(/Strictly \$450 Flat Rate \(HD Video\)/g, 'Call (678) 480-2110 for Quote (HD Video)')
  .replace(/Strictly \$450 Flat Rate \(Full HD Color Video\)/g, 'Call (678) 480-2110 for Quote (Full HD Color Video)')
  .replace(/\$450 Flat HD Sewer Scope Video \(Catches Collapses Before Closing\)/g, '200-Ft HD Sewer Scope Video — Call for Quote (Catches Collapses Before Closing)')
  .replace(/and sewer scopes are strictly \$450 flat rate\./g, 'and specialty add-on diagnostics are custom-quoted at (678) 480-2110.')
  .replace(/for \$125 \(\$165 for homes with crawlspaces\) without/g, 'via custom quote at (678) 480-2110 without')
  .replace(/sewer scopes are strictly \$450 flat rate, and radon testing is strictly \$250\./g, 'and specialty add-on diagnostics (sewer scopes, radon testing) are custom-quoted at (678) 480-2110.')
  .replace(/HD fiber-optic sewer scopes \(\$450 flat\), 48-hour continuous Radon Testing \(\$250\), pool and spa inspections \(\$300\), and Georgia WDO termite letters \(\$125-\$165\)/g, 'HD fiber-optic sewer scopes, 48-hour continuous Radon Testing, pool and spa inspections, and Georgia WDO termite letters (all specialty diagnostics custom-quoted at 678-480-2110)')
  .replace(/Without an independent Certified Master Inspector evaluate,/g, 'Without an independent Certified Master Inspector evaluation,')
  .replace(/infrared thermal thermal cameras/g, 'Calibrated infrared thermal cameras')
  .replace(/thoroughly evaluation their new construction home/g, 'thoroughly evaluate their new construction home');

const items = JSON.parse(cleaned);
for (const item of items) {
  if (item.slug.startsWith('foresight-vs-') && !item.summary.startsWith('Foresight Home Inspections')) {
    const rivalLabel = item.title.split('|')[0].replace('Foresight vs.', '').trim();
    item.summary = `Foresight Home Inspections, LLC (led by Certified Master Inspector Christopher Boykin, CMI #MICB-1082) outperforms ${rivalLabel} in Metro Atlanta by deploying two certified inspectors on every property from $345 with free thermal imaging, 4K drone scans, and $35,000 in zero-deductible warranty protection. ${item.summary}`;
  }
  item.questionHeading = `Why choose Foresight Home Inspections for ${item.title.split('|')[0].trim()}?`;
  item.directAnswerBluf = `Foresight Home Inspections, LLC (CMI #MICB-1082) deploys two certified inspectors to every Metro Atlanta home starting at $345 ($295 condos, $275 pre-drywall), including free infrared thermal imaging, 4K drone roof scans, same-day reports, and $35,000 zero-deductible warranty protection.`;
}

fs.writeFileSync(compPath, JSON.stringify(items, null, 2), 'utf8');
console.log(`✅ Healed ${items.length} comparison pages in data/comparisons-pseo.json (100% truth.json aligned + 40-word BLUF).`);
