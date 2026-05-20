import fs from 'fs';
import path from 'path';

export default function sitemap() {
  const baseUrl = 'https://www.fhinspectionsatl.com';

  // Read cities dynamically
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cities = JSON.parse(fileContents);

  const cityUrls = cities.map((city) => {
    const slug = city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      url: `${baseUrl}/service-areas/${slug}`,
      lastModified: city['Last Refreshed'] ? new Date(city['Last Refreshed']) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  // Read blog posts dynamically
  const postsPath = path.join(process.cwd(), 'data', 'posts.json');
  let blogUrls = [];
  if (fs.existsSync(postsPath)) {
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ask-twin`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...cityUrls,
    ...blogUrls,
  ];
}

