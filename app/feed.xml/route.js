import fs from 'fs';
import path from 'path';

export async function GET() {
  const SITE_URL = 'https://www.fhinspectionsatl.com';
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
  
  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  } catch (e) {
    posts = [];
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>Foresight Home Inspections | Expert Home Inspection Guides &amp; Insights</title>
  <link>${SITE_URL}/blog</link>
  <description>Certified Master Inspector insights, defect guides, and home inspection advice for Atlanta and North Georgia homeowners.</description>
  <language>en-US</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  ${sortedPosts.map(post => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>inspect@foresightcmi.com (Christopher Boykin, CMI)</author>
    <category><![CDATA[${post.category || 'Home Inspection'}]]></category>
    <description><![CDATA[${post.excerpt || post.title}]]></description>
  </item>`).join('')}
</channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
