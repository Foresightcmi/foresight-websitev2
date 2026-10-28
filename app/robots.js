export default function robots() {
  const aiSearchAllowPaths = ['/', '/api/mcp', '/llms.txt', '/llms-full.txt', '/videos', '/videos/', '/images/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/mcp', '/llms.txt', '/llms-full.txt', '/videos', '/videos/'],
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
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot',
          'Applebot-Extended',
          'Bingbot',
          'DuckAssistBot',
          'Meta-ExternalAgent',
          'Meta-ExternalFetcher',
          'Amazonbot'
        ],
        allow: aiSearchAllowPaths,
      },
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'PetalBot',
          'Bytespider',
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
  };
}
