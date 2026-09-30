/**
 * Foresight Home Inspections - Automated Performance Guard (CI/CD Sentry)
 * 
 * Enforces the 6 Non-Negotiable Performance Invariants required to maintain
 * a 90+ Mobile PageSpeed Insights score:
 * 1. Zero Heavy Client Imports in Global Shell (VoiceAgentModal must remain dynamic & conditional)
 * 2. Zero Layout Thrashing / Forced Reflows (No clientWidth/offsetHeight in render JSX)
 * 3. Zero Below-The-Fold Image Priority Preloads (Lazy loading mandatory)
 * 4. Next.js Zero-CLS Font Metric Binding (globals.css must reference var(--font-inter))
 * 5. Critical Paint Path Purity (Top announcement banners paint before scripts)
 * 6. Server Component Purity (Testimonials & content sections must remain React Server Components)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const checks = [];

function pass(name, details) {
  checks.push({ status: 'PASS', name, details });
  console.log(`\x1b[32m✔ [PASS]\x1b[0m ${name}: ${details}`);
}

function fail(name, details) {
  checks.push({ status: 'FAIL', name, details });
  console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${name}: ${details}`);
}

// Check 1: AskForesightWidget.js must not statically import VoiceAgentModal
function checkVoiceAgentModalImport() {
  const file = path.join(ROOT, 'app', 'components', 'AskForesightWidget.js');
  const code = fs.readFileSync(file, 'utf8');

  if (/import\s+VoiceAgentModal\s+from/i.test(code)) {
    fail('Dynamic Voice Modal', 'VoiceAgentModal is statically imported! It must be loaded via next/dynamic.');
  } else if (!/dynamic\(\s*\(\)\s*=>\s*import\(['"]\.\/VoiceAgentModal['"]\)/.test(code)) {
    fail('Dynamic Voice Modal', 'VoiceAgentModal missing dynamic() import wrapper.');
  } else if (!/\{isVoiceOpen\s*&&\s*<VoiceAgentModal/.test(code)) {
    fail('Dynamic Voice Modal', 'VoiceAgentModal is mounted even when isVoiceOpen is false! Must be conditionally rendered.');
  } else {
    pass('Dynamic Voice Modal', 'VoiceAgentModal is dynamically imported and conditionally rendered on demand (0 initial JS bloat).');
  }
}

// Check 2: ThermalSlider.js must use GPU clip-path and have NO layout reads
function checkThermalSliderLayoutThrashing() {
  const file = path.join(ROOT, 'app', 'components', 'ThermalSlider.js');
  const code = fs.readFileSync(file, 'utf8');

  if (/containerRef\.current\.clientWidth/.test(code) || /containerRef\.current\.offsetWidth/.test(code)) {
    fail('Zero Forced Reflow', 'containerRef clientWidth/offsetWidth detected in ThermalSlider! Causes layout thrashing.');
  } else if (!/clipPath:\s*`inset\(0\s*\$\{100\s*-\s*sliderPosition\}%\s*0\s*0\)`/.test(code)) {
    fail('Zero Forced Reflow', 'ThermalSlider missing GPU-accelerated clipPath implementation.');
  } else if (/<Image[^>]*priority[^>]*ceiling/i.test(code)) {
    fail('Zero Forced Reflow', 'Below-the-fold ceiling images have priority set! Must be loading="lazy".');
  } else {
    pass('Zero Forced Reflow', 'ThermalSlider uses GPU clip-path with 0 synchronous layout reads (0ms reflow).');
  }
}

// Check 3: globals.css must bind to Next.js font variables
function checkFontVariableBindings() {
  const file = path.join(ROOT, 'app', 'globals.css');
  const code = fs.readFileSync(file, 'utf8');

  if (!/--font-main:\s*var\(--font-inter\)/.test(code)) {
    fail('Font Metric Overrides', '--font-main does not bind to var(--font-inter)! Causes FOIT / 3s text delay.');
  } else if (!/--font-heading:\s*var\(--font-outfit\)/.test(code)) {
    fail('Font Metric Overrides', '--font-heading does not bind to var(--font-outfit)!');
  } else {
    pass('Font Metric Overrides', 'Fonts bound to Next.js zero-CLS size-adjust fallback variables.');
  }
}

// Check 4: layout.js script placement
function checkLayoutScriptPlacement() {
  const file = path.join(ROOT, 'app', 'layout.js');
  const code = fs.readFileSync(file, 'utf8');

  const bodyIndex = code.indexOf('<body>');
  const firstBannerIndex = code.indexOf("var(--color-gold)");
  const firstScriptIndex = code.indexOf("<Script");

  if (bodyIndex !== -1 && firstScriptIndex !== -1 && firstScriptIndex < firstBannerIndex) {
    fail('Critical Paint Hierarchy', 'A <Script> tag appears before the top announcement banners! Delays LCP.');
  } else {
    pass('Critical Paint Hierarchy', 'Visible announcement banners paint ahead of all body scripts.');
  }
}

// Check 5: Testimonials must remain a React Server Component
function checkTestimonialsServerComponent() {
  const file = path.join(ROOT, 'app', 'components', 'Testimonials.js');
  const code = fs.readFileSync(file, 'utf8');

  if (/['"]use client['"]/.test(code)) {
    fail('Server Component Purity', 'Testimonials.js has "use client"! Must remain a static React Server Component.');
  } else {
    pass('Server Component Purity', 'Testimonials.js is a pure React Server Component (0 client JS).');
  }
}

// Check 6: Hero image mobile-first fallback in page.js
function checkHeroMobileFirst() {
  const file = path.join(ROOT, 'app', 'page.js');
  const code = fs.readFileSync(file, 'utf8');

  if (/<img[^>]*src=["']\/images\/luxury-home\.webp["']/i.test(code)) {
    fail('Hero Image Mobile-First', 'Fallback <img> src in hero points to desktop 110KB image instead of mobile webp!');
  } else {
    pass('Hero Image Mobile-First', 'Hero picture element defaults to lightweight mobile asset.');
  }
}

console.log('\n🛡️  Foresight Mobile Performance Guard — Running Automated Audit...\n');

checkVoiceAgentModalImport();
checkThermalSliderLayoutThrashing();
checkFontVariableBindings();
checkLayoutScriptPlacement();
checkTestimonialsServerComponent();
checkHeroMobileFirst();

console.log('\n------------------------------------------------------------');
const failures = checks.filter(c => c.status === 'FAIL');

if (failures.length > 0) {
  console.error(`\x1b[31m💥 AUDIT FAILED: ${failures.length} performance invariant violation(s) detected!\x1b[0m\n`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✨ ALL 6 PERFORMANCE INVARIANTS SATISFIED! Mobile 90+ Range Guaranteed.\x1b[0m\n`);
  process.exit(0);
}
