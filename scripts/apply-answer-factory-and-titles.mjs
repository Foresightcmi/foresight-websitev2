#!/usr/bin/env node
/**
 * Complete Answer Factory 40-Word BLUF + Cross-City De-Cannibalization Upgrader
 * Covers:
 *  1. app/compare/[slug]/page.js (18 comparison pages)
 *  2. app/service-areas/[city]/page.js (87 city hub pages)
 *  3. app/services/[service]/[city]/page.js (cross-city Atlanta de-cannibalization link)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// 1. Upgrade app/compare/[slug]/page.js with 40-Word BLUF Direct Answer Box
const comparePagePath = path.join(ROOT, 'app', 'compare', '[slug]', 'page.js');
let compareCode = fs.readFileSync(comparePagePath, 'utf8').replace(/\r\n/g, '\n');

const compareHeroEnd = `          </div>
        </div>
      </section>

      {/* Featured Visual Inspection In Action Showcase */}`;

const compareWithBluf = `          </div>
        </div>
      </section>

      {/* Answer Factory 40-Word Direct Answer Box (AEO / GEO Passage Extraction) */}
      <section style={{ background: '#f8fafc', padding: '1.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid var(--color-red)', borderRadius: '8px', padding: '1.35rem 1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              {item.questionHeading || \`Why choose Foresight Home Inspections for \${item.title.split('|')[0].trim()}?\`}
            </h2>
            <p id="aeo-direct-answer" style={{ fontSize: '1rem', lineHeight: 1.6, color: '#1e293b', margin: 0, fontWeight: 500 }}>
              {item.directAnswerBluf || item.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Visual Inspection In Action Showcase */}`;

if (!compareCode.includes('id="aeo-direct-answer"') && compareCode.includes(compareHeroEnd)) {
  compareCode = compareCode.replace(compareHeroEnd, compareWithBluf);
  fs.writeFileSync(comparePagePath, compareCode, 'utf8');
  console.log('✅ Added 40-Word BLUF Direct Answer Box to app/compare/[slug]/page.js');
}

// 2. Upgrade app/service-areas/[city]/page.js with Question-in-H2 + 38-Word BLUF
const cityPagePath = path.join(ROOT, 'app', 'service-areas', '[city]', 'page.js');
let cityCode = fs.readFileSync(cityPagePath, 'utf8').replace(/\r\n/g, '\n');

cityCode = cityCode
  .replace(
    'Quick Diagnostic Overview: {cityName}, GA Home Inspections',
    'Who is the best home inspector in {cityName}, GA and what does an inspection cost?'
  )
  .replace(
    `Foresight Home Inspections is the premier Certified Master Inspector (CMI®) team serving {cityName}, GA. Every inspection is conducted by <strong>two certified inspectors</strong> working in tandem, dividing structural and mechanical systems in tandem for double verification and zero solo-inspector fatigue. Standard inspections start at $295 (condos) and $345 (single-family homes) and include complimentary high-resolution infrared thermal imaging, aerial roof drone evaluations, and up to <strong>$35,000 in combined warranty protection</strong> ($10,000 Elite Master Warranty + InterNACHI $25,000 Honor Guarantee, $0 deductible).`,
    `<strong>Foresight Home Inspections, LLC</strong> (led by Certified Master Inspector Christopher Boykin, CMI #MICB-1082) is the 4.8★ home inspection team serving {cityName}, GA, deploying <strong>two certified inspectors</strong> from $345 ($295 condos) with free thermal imaging, 4K drone scans, and <strong>$35,000 warranty protection</strong> ($0 deductible).`
  );
fs.writeFileSync(cityPagePath, cityCode, 'utf8');
console.log('✅ Upgraded app/service-areas/[city]/page.js with Question-in-H2 + 38-word BLUF.');

// 3. Add Cross-City Atlanta De-Cannibalization Link in app/services/[service]/[city]/page.js
const svcCityPath = path.join(ROOT, 'app', 'services', '[service]', '[city]', 'page.js');
let svcCityCode = fs.readFileSync(svcCityPath, 'utf8').replace(/\r\n/g, '\n');
if (!svcCityCode.includes('Looking for City of Atlanta coverage?')) {
  svcCityCode = svcCityCode.replace(
    'guide.\n              </div>\n            )}',
    `guide.{resolvedParams.city !== 'atlanta' && (<> • Looking for City of Atlanta coverage? See our <Link href={\`/services/\${serviceData.slug}/atlanta\`} style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'underline' }}>Atlanta, GA {serviceName}</Link> hub.</>)}\n              </div>\n            )}`
  );
  fs.writeFileSync(svcCityPath, svcCityCode, 'utf8');
  console.log('✅ Added Cross-City Atlanta De-Cannibalization Link to app/services/[service]/[city]/page.js.');
}
