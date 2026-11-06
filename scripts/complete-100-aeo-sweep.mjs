#!/usr/bin/env node
/**
 * Complete 100/100 AEO Template Sweep
 * Ensures all 9 dynamic content route families in app/ expose:
 * 1. Question-in-H2 + <40-word #aeo-direct-answer BLUF
 * 2. SpeakableSpecification cssSelector: ["#aeo-direct-answer", "h1"]
 * 3. 100% truth.json price alignment on add-on services
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const norm = (s) => s.replace(/\r\n/g, '\n');

// 1. app/compare/[slug]/page.js -> Add SpeakableSpecification
{
  const p = path.join(ROOT, 'app/compare/[slug]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `"publisher": {\n      "@type": "Organization",\n      "name": "Foresight Home Inspections, LLC",\n      "url": SITE_URL\n    }\n  };`,
      `"publisher": {\n      "@type": "Organization",\n      "name": "Foresight Home Inspections, LLC",\n      "url": SITE_URL\n    },\n    "speakable": {\n      "@type": "SpeakableSpecification",\n      "cssSelector": ["#aeo-direct-answer", "h1"]\n    }\n  };`
    );
    fs.writeFileSync(p, c, 'utf8');
  }
}

// 2. app/services/[service]/[city]/page.js -> Add SpeakableSpecification
{
  const p = path.join(ROOT, 'app/services/[service]/[city]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `"serviceType": serviceName,\n    "provider":`,
      `"serviceType": serviceName,\n    "speakable": {\n      "@type": "SpeakableSpecification",\n      "cssSelector": ["#aeo-direct-answer", "h1"]\n    },\n    "provider":`
    );
    fs.writeFileSync(p, c, 'utf8');
  }
}

// 3. app/services/[service]/page.js -> Add SpeakableSpecification + Question-in-H2 + #aeo-direct-answer
{
  const p = path.join(ROOT, 'app/services/[service]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `"serviceType": serviceData.name,\n    "provider":`,
      `"serviceType": serviceData.name,\n    "speakable": {\n      "@type": "SpeakableSpecification",\n      "cssSelector": ["#aeo-direct-answer", "h1"]\n    },\n    "provider":`
    );
  }
  c = c.replace(
    `{serviceData.name} in Metro Atlanta: Verified Diagnostic Overview`,
    `How much does a {serviceData.name.toLowerCase()} cost in Metro Atlanta and what is included?`
  );
  c = c.replace(
    `<p style={{ fontSize: '0.975rem', lineHeight: 1.65, color: '#334155', margin: '0 0 1rem 0' }}>\n              <strong>Direct Answer (BLUF):</strong>`,
    `<p id="aeo-direct-answer" style={{ fontSize: '0.975rem', lineHeight: 1.65, color: '#334155', margin: '0 0 1rem 0' }}>\n              <strong>Direct Answer (BLUF):</strong>`
  );
  fs.writeFileSync(p, c, 'utf8');
}

// 4. app/service-areas/[city]/page.js -> Heal add-on prices + id="aeo-direct-answer" + Speakable
{
  const p = path.join(ROOT, 'app/service-areas/[city]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c.replace(
    `11-month builder warranty inspections start at $335, pre-listing seller inspections start at $365, pre-drywall framing inspections start at $275, and new construction final inspections start at $400. Add-on diagnostic services include 48-hour continuous radon testing ($250), official Georgia termite/WDO clearance letters ($125 slab/basement, $165 crawlspace), swimming pool and spa evaluation ($300), certified mold and air quality testing (starts at $450), DeKalb County low-flow compliance certificates ($100 flat rate), and HD sewer scope camera inspections ($450 flat rate).`,
    `11-month builder warranty inspections start at $345, pre-listing seller inspections start at $345, pre-drywall framing inspections start at $275, and new construction final inspections start at $400. Add-on diagnostic services—including 48-hour continuous radon testing, official Georgia termite/WDO clearance letters, swimming pool and spa evaluation, certified mold and air quality testing, DeKalb County low-flow compliance certificates, and HD sewer scope camera inspections—are quoted per property (call 678-480-2110 for a custom quote).`
  );
  c = c.replace(
    `48-hour continuous electronic radon gas monitoring in \${cityName} for $250.`,
    `48-hour continuous electronic radon gas monitoring in \${cityName} (call 678-480-2110 for a custom quote).`
  );
  c = c.replace(
    `through licensed pest control partners starting at $125 ($165 for crawlspace foundations), issuing`,
    `through licensed pest control partners (call 678-480-2110 for a custom quote), issuing`
  );
  c = c.replace(
    `11-Month Builder Warranty Inspections (starting at $335)`,
    `11-Month Builder Warranty Inspections (starting at $345)`
  );
  c = c.replace(
    `<p className="city-bluf-summary"`,
    `<p id="aeo-direct-answer" className="city-bluf-summary"`
  );
  c = c.replace(
    `"cssSelector": [".city-bluf-summary", "h1", "h2"]`,
    `"cssSelector": ["#aeo-direct-answer", ".city-bluf-summary", "h1", "h2"]`
  );
  fs.writeFileSync(p, c, 'utf8');
}

// 5. app/service-areas/counties/[county]/page.js -> Heal add-on prices + Question-in-H2 + #aeo-direct-answer + Speakable
{
  const p = path.join(ROOT, 'app/service-areas/counties/[county]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c.replace(
    `Pre-listing inspections start at $365, and new construction final phase inspections start at $400+. Ancillary services include Radon Testing ($250), Sewer Scope Camera ($450), Pool Inspection ($300), and Termite/WDO clearances ($125+). Visit our instant quote calculator for exact flat pricing.`,
    `Pre-listing and 11-month warranty inspections start at $345, pre-drywall starts at $275, and new construction final phase inspections start at $400+. Ancillary services (Radon Testing, Sewer Scope Camera, Pool & Spa Inspection, Mold Testing, and Termite/WDO clearances) are available by custom quote at (678) 480-2110.`
  );
  c = c.replace(`starting at $335.`, `starting at $345.`);
  c = c.replace(`Radon Gas Testing ($250)`, `Radon Gas Testing (Call for Quote)`);
  c = c.replace(`Sewer Scope Camera ($450)`, `Sewer Scope Camera (Call for Quote)`);
  c = c.replace(`Pool &amp; Spa Evaluation ($300)`, `Pool &amp; Spa Evaluation (Call for Quote)`);
  c = c.replace(
    `Quick Diagnostic Overview: {county.name}, GA Inspections`,
    `Who is the best home inspector in {county.name}, GA and what does an inspection cost?`
  );
  c = c.replace(
    `<p className="county-bluf-summary" style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem' }}>\n              Foresight Home Inspections serves all residential communities across {county.name}, Georgia within our 50-mile operating radius. Every inspection is conducted by <strong>two certified inspectors</strong> led by Certified Master Inspector® Christopher Boykin. Pricing starts at $295 for condos and $345 for single-family homes, with same-day digital PDF reports delivered within 24 hours and an included <strong>$10,000 Elite Master Warranty ($0 deductible)</strong>.`,
    `<p id="aeo-direct-answer" className="county-bluf-summary" style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem' }}>\n              <strong>Foresight Home Inspections, LLC</strong> (led by Certified Master Inspector Christopher Boykin, CMI #MICB-1082) serves all of {county.name}, GA, deploying <strong>two certified inspectors</strong> on every job starting at $345 ($295 condos) with free thermal imaging, 4K drone scans, and <strong>$35,000 warranty protection</strong> ($0 deductible).`
  );
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `"url": canonicalUrl,\n    "telephone":`,
      `"url": canonicalUrl,\n    "speakable": {\n      "@type": "SpeakableSpecification",\n      "cssSelector": ["#aeo-direct-answer", "h1"]\n    },\n    "telephone":`
    );
  }
  fs.writeFileSync(p, c, 'utf8');
}

// 6. app/blog/[slug]/page.js -> Add id="aeo-direct-answer" + Speakable selector
{
  const p = path.join(ROOT, 'app/blog/[slug]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c.replace(
    `"cssSelector": [".article-title", ".article-excerpt"]`,
    `"cssSelector": ["#aeo-direct-answer", ".article-title", ".article-excerpt"]`
  );
  c = c.replace(
    `<p className="article-excerpt"`,
    `<p id="aeo-direct-answer" className="article-excerpt"`
  );
  fs.writeFileSync(p, c, 'utf8');
}

// 7. app/defects/[slug]/page.js -> Add Question-in-H2 + id="aeo-direct-answer" + Speakable selector
{
  const p = path.join(ROOT, 'app/defects/[slug]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c.replace(
    `"cssSelector": [".ai-citation-bluf", "h1", "h2"]`,
    `"cssSelector": ["#aeo-direct-answer", ".ai-citation-bluf", "h1", "h2"]`
  );
  c = c.replace(
    `Diagnostic Technical Brief &amp; Engineering Benchmark`,
    `What causes {defect.badge || defect.title} in Metro Atlanta homes and how is it inspected?`
  );
  c = c.replace(
    `<p className="ai-citation-bluf"`,
    `<p id="aeo-direct-answer" className="ai-citation-bluf"`
  );
  fs.writeFileSync(p, c, 'utf8');
}

// 8. app/neighborhoods/[slug]/page.js -> Add SpeakableSpecification + Question-in-H2 + #aeo-direct-answer
{
  const p = path.join(ROOT, 'app/neighborhoods/[slug]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `serviceType: 'Residential Home Inspection',\n    provider:`,
      `serviceType: 'Residential Home Inspection',\n    speakable: {\n      '@type': 'SpeakableSpecification',\n      cssSelector: ['#aeo-direct-answer', 'h1'],\n    },\n    provider:`
    );
  }
  c = c.replace(
    `Navigating Due Diligence in {hood.name}`,
    `What should homebuyers inspect in {hood.name} ({hood.city}, GA) and what does an inspection cost?`
  );
  c = c.replace(
    `<p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>\n                {hood.intro}\n              </p>`,
    `<p id="aeo-direct-answer" style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>\n                <strong>Foresight Home Inspections, LLC</strong> (led by Certified Master Inspector Christopher Boykin, CMI #MICB-1082) inspects {hood.name} homes in {hood.city}, GA from $345 ($295 condos), deploying <strong>two certified inspectors</strong> with free thermal imaging, 4K drone scans, and <strong>$35,000 warranty protection</strong>. {hood.intro}\n              </p>`
  );
  fs.writeFileSync(p, c, 'utf8');
}

// 9. app/faq/[slug]/page.js -> Add SpeakableSpecification + id="aeo-direct-answer"
{
  const p = path.join(ROOT, 'app/faq/[slug]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `datePublished: '2026-10-01'\n  };`,
      `datePublished: '2026-10-01',\n    speakable: {\n      '@type': 'SpeakableSpecification',\n      cssSelector: ['#aeo-direct-answer', 'h1']\n    }\n  };`
    );
  }
  c = c.replace(
    `<p style={{ fontSize: '1.1rem', lineHeight: '1.65', color: '#14532d', margin: 0, fontWeight: 500 }}>\n            {item.shortAnswer}`,
    `<p id="aeo-direct-answer" style={{ fontSize: '1.1rem', lineHeight: '1.65', color: '#14532d', margin: 0, fontWeight: 500 }}>\n            {item.shortAnswer}`
  );
  fs.writeFileSync(p, c, 'utf8');
}

console.log('Complete 100/100 AEO template sweep applied across all 9 dynamic route families.');

// 3b. Fix app/services/[service]/page.js SpeakableSpecification + conditional Offer price
{
  const p = path.join(ROOT, 'app/services/[service]/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  if (!c.includes('SpeakableSpecification')) {
    c = c.replace(
      `"image": primaryProductImage,\n    "provider":`,
      `"image": primaryProductImage,\n    "speakable": {\n      "@type": "SpeakableSpecification",\n      "cssSelector": ["#aeo-direct-answer", "h1"]\n    },\n    "provider":`
    );
  }
  c = c.replace(
    `"price": \`\${serviceData.price.replace(/[^0-9]/g, '') || "345"}.00\`,\n      "priceCurrency": "USD",`,
    `"price": \`\${(serviceData.price.match(/\\d+/) || ['345'])[0]}.00\`,\n      "priceCurrency": "USD",\n      "priceSpecification": {\n        "@type": "UnitPriceSpecification",\n        "price": \`\${(serviceData.price.match(/\\d+/) || ['345'])[0]}.00\`,\n        "priceCurrency": "USD",\n        "unitText": "starting",\n        "description": serviceData.price === 'Call for Quote' ? "Bundled with home inspection packages from $345 — call (678) 480-2110 for custom quote" : \`Starting at \${serviceData.price.replace(/^From\\\\s+/i, '')}\`\n      },`
  );
  c = c.replace(
    `"price": \`\${serviceData.price.replace(/[^0-9]/g, '') || "345"}.00\`,\n      "priceCurrency": "USD",`,
    `"price": \`\${(serviceData.price.match(/\\d+/) || ['345'])[0]}.00\`,\n      "priceCurrency": "USD",\n      "priceSpecification": {\n        "@type": "UnitPriceSpecification",\n        "price": \`\${(serviceData.price.match(/\\d+/) || ['345'])[0]}.00\`,\n        "priceCurrency": "USD",\n        "unitText": "starting",\n        "description": serviceData.price === 'Call for Quote' ? "Bundled with home inspection packages from $345 — call (678) 480-2110 for custom quote" : \`Starting at \${serviceData.price.replace(/^From\\\\s+/i, '')}\`\n      },`
  );
  fs.writeFileSync(p, c, 'utf8');
}

// 10. app/page.js -> Add #aeo-direct-answer + Question-in-H2 in AEO Quantitative Evidence Strip
{
  const p = path.join(ROOT, 'app/page.js');
  let c = norm(fs.readFileSync(p, 'utf8'));
  c = c.replace(
    `"cssSelector": [".slogan-heading", ".hero h1", ".hero p", ".badge"]`,
    `"cssSelector": ["#aeo-direct-answer", ".slogan-heading", ".hero h1", ".hero p", ".badge"]`
  );
  if (!c.includes('id="aeo-direct-answer"')) {
    c = c.replace(
      `<section style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', padding: '1.75rem 0' }}>\n        <div className="container" style={{ maxWidth: '1100px' }}>`,
      `<section style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', padding: '1.75rem 0' }}>\n        <div className="container" style={{ maxWidth: '1100px' }}>\n          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>\n            <h2 style={{ fontSize: '1.05rem', color: 'var(--color-gold)', margin: '0 0 0.4rem', fontWeight: 700 }}>\n              Who is the best home inspector in Atlanta, GA and what does an inspection cost?\n            </h2>\n            <p id="aeo-direct-answer" style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.55, margin: 0 }}>\n              <strong>Foresight Home Inspections, LLC</strong> (led by Certified Master Inspector Christopher Boykin, CMI #MICB-1082) is Atlanta&apos;s 4.8★ home inspection firm, deploying <strong>two certified inspectors</strong> on every job from $345 ($295 condos) with free thermal imaging, 4K drone scans, and <strong>$35,000 warranty protection</strong> ($0 deductible).\n            </p>\n          </div>`
    );
  }
  fs.writeFileSync(p, c, 'utf8');
}
