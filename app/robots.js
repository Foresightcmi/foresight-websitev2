export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/mcp', '/videos', '/videos/'],
        disallow: [
          '/private/',
          '/api/chat',
          '/api/voice',
          '/dashboard',
          '/vip-dispatch',
          '/vip-dispatch.html',
          '/dispatch',
          '/dispatch.html',
          '/warranty-dispatch',
          '/warranty-dispatch.html',
          '/videos/chris-avatar*',
          '/audio/',
          '/sample-report/'
        ],
      },
      {
        userAgent: 'Googlebot-Video',
        allow: ['/videos', '/videos/'],
        disallow: ['/videos/chris-avatar*', '/sample-report/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/images/', '/favicon.ico', '/icon-48x48.png', '/icon-96x96.png', '/icon-192x192.png', '/apple-touch-icon.png'],
        disallow: ['/sample-report/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'PetalBot',
          'Bytespider',
          'Amazonbot',
          'DataForSeoBot',
          'CCBot',
          'BLEXBot',
          'YandexBot',
          'Baiduspider',
          'Sogou',
          'Exabot',
          'TurnitinBot',
          'ZoominfoBot',
          'Barkrowler',
          'Seekport',
          'SEOkicks'
        ],
        disallow: '/',
      },
    ],
    sitemap: [
      'https://www.fhinspectionsatl.com/sitemap.xml',
      'https://www.fhinspectionsatl.com/sitemap-images.xml',
      'https://www.fhinspectionsatl.com/sitemap-video.xml',
    ],
  }
}
