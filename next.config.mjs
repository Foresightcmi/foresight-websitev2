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
  turbopack: {
    root: process.cwd(),
  },
  // Security Headers to boost SEO trust scores and technical robustness
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
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
        ],
      },
      {
        source: '/:path*.(woff2|woff|ttf|eot|svg|png|jpg|jpeg|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
      // Old dated blog post slugs to canonical
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
    ];
  },
};

export default nextConfig;
