export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/mcp'],
        disallow: ['/private/', '/api/chat', '/api/voice', '/dashboard', '/opengraph-image', '/*/opengraph-image'],
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
    sitemap: 'https://www.fhinspectionsatl.com/sitemap.xml',
  }
}
