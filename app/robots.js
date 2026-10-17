export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/mcp'],
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
          '/videos/',
          '/audio/',
          '/sample-report/'
        ],
      },
      {
        userAgent: 'Googlebot-Video',
        disallow: ['/videos/', '/sample-report/'],
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
    ],
  }
}
