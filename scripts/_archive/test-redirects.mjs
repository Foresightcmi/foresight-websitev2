import nextConfig from '../next.config.mjs';

const urls = [
  '/defects/foundation-crack-settlement-inspection',
  '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-07-29',
  '/blog/metro-atlanta-short-term-rental-str-compliance-assist-guide-2026-07-12',
  '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations-2026-07-01',
  '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-07-08',
  '/blog/metro-atlanta-short-term-rental-str-compliance-assist-guide-2026-07-15',
  '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-07-05',
  '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-07-26',
  '/blog/metro-atlanta-short-term-rental-str-compliance-assist-guide-2026-08-02',
  '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations-2026-07-22',
  '/service-areas/brooks-ga',
  '/blog/categories/home-buying-tips',
  '/_api/one-app-session-web/v3/businesses',
  '/_api/v1/access-tokens',
  '/_api/v2/dynamicmodel',
  '/post/how-to-prepare-your-atlanta-home-for-hurricane-season-a-reliable-guide-for-homeowners-to-weather-th',
  '/book',
  '/resources',
  '/post/what-you-need-to-know-about-home-inspection-services',
  '/blog/categories/inspection-insights',
  '/inspection-service-areas',
  '/search?query={search_term_string}',
  '/post/hosting-with-heart-crafting-a-home-perfect-for-entertaining',
  '/resources/faq',
  '/post/how-to-negotiate-repairs-after-a-home-inspection-in-georgia',
  '/post/understanding-the-benefits-of-home-inspection-services'
];

async function run() {
  const redirects = await nextConfig.redirects();
  console.log(`Total configured redirect rules: ${redirects.length}`);
  
  let matched = 0;
  for (const u of urls) {
    const cleanPath = u.split('?')[0];
    const match = redirects.find(r => {
      if (r.source === cleanPath) return true;
      if (r.source.includes(':') || r.source.includes('*')) {
        const regexStr = '^' + r.source.replace(/\/:[a-zA-Z0-9_]+\*/g, '(?:/.*)?').replace(/\/:[a-zA-Z0-9_]+/g, '/[^/]+') + '$';
        return new RegExp(regexStr).test(cleanPath);
      }
      return false;
    });
    if (match) {
      console.log(`PASS: ${cleanPath} -> ${match.destination}`);
      matched++;
    } else {
      console.log(`FAIL: NO MATCH for ${cleanPath}`);
    }
  }
  console.log(`\nResult: ${matched} of ${urls.length} URLs mapped to 301 redirects.`);
}

run();
