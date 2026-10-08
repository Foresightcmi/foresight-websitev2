/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Normalize URLs to remove trailing slashes for duplicate content SEO safety
  trailingSlash: false,
  // Automatic compression of static assets (gzip, brotli)
  compress: true,
  // Image formats optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingExcludes: {
    '*': [
      './public/videos/**',
      './public/sample-report/**',
      './public/vip-dispatch.html',
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  // Security Headers to boost SEO trust scores and technical robustness
  async headers() {
    return [
      {
        source: '/sample-report/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *',
          },
        ],
      },
      {
        source: '/((?!sample-report).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=31536000',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
        ],
      },
      {
        source: '/audio/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
        ],
      },
      {
        source: '/(vip-dispatch|dispatch)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/(vip-dispatch|dispatch).html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*.(woff2|woff|ttf|eot|svg|png|jpg|jpeg|webp|avif|ico|mp3|mp4|m4a|wav|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
        ],
      },
      {
        source: '/opengraph-image',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/(.*)/opengraph-image',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Concierge unification redirect
      {
        source: '/ask-twin',
        destination: '/concierge',
        permanent: true,
      },
      // VIP Dispatch instant route
      {
        source: '/dispatch',
        destination: '/vip-dispatch.html',
        permanent: false,
      },
      {
        source: '/vip',
        destination: '/vip-dispatch.html',
        permanent: false,
      },
      // VIP Realtor Partner Portal route
      {
        source: '/vip-realtors',
        destination: '/realtors',
        permanent: false,
      },
      // Legacy XML feeds
      {
        source: '/blog-feed.xml',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/feed.xml',
        permanent: true,
      },
      // Legacy -ga city routes
      {
        source: '/service-areas/peoplestown-ga',
        destination: '/service-areas/atlanta',
        permanent: true,
      },
      {
        source: '/service-areas/home-park-ga',
        destination: '/service-areas/atlanta',
        permanent: true,
      },
      {
        source: '/service-areas/rex-ga',
        destination: '/service-areas/rex',
        permanent: true,
      },
      // Legacy or mistyped city / county routes
      {
        source: '/service-areas/forest-20park',
        destination: '/service-areas/forest-park',
        permanent: true,
      },
      {
        source: '/services/:service/forest-20park',
        destination: '/services/:service/forest-park',
        permanent: true,
      },
      {
        source: '/service-areas/counties/georgia-county',
        destination: '/service-areas/counties',
        permanent: true,
      },
      // Service slug normalization redirects
      {
        source: '/services/pool-spa-inspection',
        destination: '/services/pool-inspection',
        permanent: true,
      },
      {
        source: '/services/pool-spa-inspection/:city',
        destination: '/services/pool-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/termite-wdo-inspection',
        destination: '/services/termite-inspection',
        permanent: true,
      },
      {
        source: '/services/termite-wdo-inspection/:city',
        destination: '/services/termite-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/home-buyer-inspection',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/services/home-buyer-inspection/:city',
        destination: '/service-areas/:city',
        permanent: true,
      },
      // Essential service variations and legacy aliases
      {
        source: '/services/home-inspection',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/services/home-inspections',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/services/general-home-inspection',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/services/residential-home-inspection',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/services/buyer-home-inspection',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/services/home-inspection/:city',
        destination: '/services/buyer-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/home-inspections/:city',
        destination: '/services/buyer-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/radon',
        destination: '/services/radon-testing',
        permanent: true,
      },
      {
        source: '/services/radon/:city',
        destination: '/services/radon-testing/:city',
        permanent: true,
      },
      {
        source: '/services/termite',
        destination: '/services/termite-inspection',
        permanent: true,
      },
      {
        source: '/services/termite/:city',
        destination: '/services/termite-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/sewer-scope',
        destination: '/services/sewer-scope-inspection',
        permanent: true,
      },
      {
        source: '/services/sewer-scope/:city',
        destination: '/services/sewer-scope-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/pool',
        destination: '/services/pool-inspection',
        permanent: true,
      },
      {
        source: '/services/pool/:city',
        destination: '/services/pool-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/warranty-inspection',
        destination: '/services/11-month-warranty-inspection',
        permanent: true,
      },
      {
        source: '/services/warranty-inspection/:city',
        destination: '/services/11-month-warranty-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/new-construction',
        destination: '/services/new-construction-inspection',
        permanent: true,
      },
      {
        source: '/services/new-construction/:city',
        destination: '/services/new-construction-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/commercial',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/commercial-inspection',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/commercial-inspections',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/commercial-inspection/:city',
        destination: '/service-areas/:city',
        permanent: true,
      },
      {
        source: '/services/mold-inspection',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/thermal-imaging',
        destination: '/services',
        permanent: true,
      },
      // Common legacy static HTML pages
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/services.html',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog.html',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/quote.html',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/pricing.html',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/faq.html',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/reviews.html',
        destination: '/review',
        permanent: true,
      },
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      // Old dated blog post slugs to canonical
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-09-09',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-09-06',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-06-14',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      {
        source: '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations-2026-09-02',
        destination: '/blog/crawlspace-moisture-silent-threat-georgia-foundations',
        permanent: true,
      },
      {
        source: '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations-2026-06-10',
        destination: '/blog/crawlspace-moisture-silent-threat-georgia-foundations',
        permanent: true,
      },
      {
        source: '/blog/why-new-construction-inspections-are-important',
        destination: '/blog/why-new-construction-needs-inspections',
        permanent: true,
      },
      {
        source: '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations-2026-08-09',
        destination: '/blog/crawlspace-moisture-silent-threat-georgia-foundations',
        permanent: true,
      },
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-05-27',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-08-19',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      // Keyword cannibalization consolidation redirects
      {
        source: '/blog/metro-atlanta-short-term-rental-str-compliance-assist-guide',
        destination: '/blog/metro-atlanta-short-term-rental-str-compliance-guide',
        permanent: true,
      },
      {
        source: '/blog/hidden-dangers-flipped-homes-atlanta',
        destination: '/blog/hidden-dangers-of-flipped-homes-atlanta-inspection-guide',
        permanent: true,
      },
      {
        source: '/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations',
        destination: '/blog/crawlspace-moisture-silent-threat-georgia-foundations',
        permanent: true,
      },
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-09-30',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      {
        source: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-09-29',
        destination: '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance',
        permanent: true,
      },
      // Legacy /post/ URLs to modern /blog/ routes
      {
        source: '/post/unveiling-the-hidden-value-the-unknown-marketing-power-of-pre-listing-inspections-for-sellers',
        destination: '/blog/pre-listing-seller-inspection-guide',
        permanent: true,
      },
      {
        source: '/post/detailed-inspections-for-new-constructions',
        destination: '/blog/why-new-construction-needs-inspections',
        permanent: true,
      },
      {
        source: '/post/pre-sale-home-inspection-tips-for-atlanta-sellers',
        destination: '/blog/pre-listing-seller-inspection-guide',
        permanent: true,
      },
      {
        source: '/post/essential-tips-for-reliable-home-inspections',
        destination: '/blog/first-time-home-buyer-inspection-checklist-atlanta',
        permanent: true,
      },
      {
        source: '/post/nature-s-touch-bringing-the-outdoors-inside-with-plants-and-greenery',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/post/why-professional-home-inspection-services-matter',
        destination: '/blog/what-fails-home-inspection-deal-breakers-georgia',
        permanent: true,
      },
      {
        source: '/post/comprehensive-overview-of-home-inspection-services',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/post/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/author/:slug*',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Legacy common URL aliases and variations
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/prices',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/cost',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/schedule',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/schedule-inspection',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/book-now',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/reviews',
        destination: '/review',
        permanent: true,
      },
      {
        source: '/testimonials',
        destination: '/review',
        permanent: true,
      },
      {
        source: '/service-area',
        destination: '/service-areas',
        permanent: true,
      },
      {
        source: '/service-area/:city',
        destination: '/service-areas/:city',
        permanent: true,
      },
      {
        source: '/our-services',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/service/:slug*',
        destination: '/services/:slug*',
        permanent: true,
      },
      // Legacy WordPress paths
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-admin/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sample-page',
        destination: '/about',
        permanent: true,
      },
      // Google Search Console 404 Remediation Redirects
      {
        source: '/book',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/resources/faq',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/inspection-service-areas',
        destination: '/service-areas',
        permanent: true,
      },
      {
        source: '/blog/categories/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/_api/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/search',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/post/how-to-prepare-your-atlanta-home-for-hurricane-season-a-reliable-guide-for-homeowners-to-weather-th',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/post/what-you-need-to-know-about-home-inspection-services',
        destination: '/blog/what-fails-home-inspection-deal-breakers-georgia',
        permanent: true,
      },
      {
        source: '/post/hosting-with-heart-crafting-a-home-perfect-for-entertaining',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/post/how-to-negotiate-repairs-after-a-home-inspection-in-georgia',
        destination: '/blog/how-to-negotiate-home-inspection-repairs-georgia-gar-contract',
        permanent: true,
      },
      {
        source: '/post/understanding-the-benefits-of-home-inspection-services',
        destination: '/blog/what-fails-home-inspection-deal-breakers-georgia',
        permanent: true,
      },
      {
        source: '/blog/estate-and-luxury-home-inspection-guide',
        destination: '/services/buyer-inspection',
        permanent: true,
      },
      {
        source: '/blog/why-you-need-home-inspection-new-build',
        destination: '/services/new-construction-inspection',
        permanent: true,
      },
      // GSC 3-Month Performance Recovery & Striking-Distance Redirects
      {
        source: '/service-areas/brooks-ga',
        destination: '/service-areas/brooks',
        permanent: true,
      },
      {
        source: '/services/sewer-camera-inspection',
        destination: '/services/sewer-scope-inspection',
        permanent: true,
      },
      {
        source: '/services/sewer-camera-inspection/:city',
        destination: '/services/sewer-scope-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/sewer-video-inspection',
        destination: '/services/sewer-scope-inspection',
        permanent: true,
      },
      {
        source: '/services/sewer-video-inspection/:city',
        destination: '/services/sewer-scope-inspection/:city',
        permanent: true,
      },
      {
        source: '/services/sewer-inspection',
        destination: '/services/sewer-scope-inspection',
        permanent: true,
      },
      {
        source: '/services/sewer-inspection/:city',
        destination: '/services/sewer-scope-inspection/:city',
        permanent: true,
      },
      // GAR Tool & Due Diligence Direct Aliases
      {
        source: '/gar-tool',
        destination: '/repair-credit-calculator',
        permanent: true,
      },
      {
        source: '/gar',
        destination: '/repair-credit-calculator',
        permanent: true,
      },
      {
        source: '/gar-calculator',
        destination: '/repair-credit-calculator',
        permanent: true,
      },
      {
        source: '/gar-amendment',
        destination: '/repair-credit-calculator',
        permanent: true,
      },
      {
        source: '/amendment-generator',
        destination: '/repair-credit-calculator',
        permanent: true,
      },
      {
        source: '/gar-f404',
        destination: '/realtors',
        permanent: true,
      },
      {
        source: '/gar-builder',
        destination: '/realtors',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
