import sitemap from '../app/sitemap.js';

async function testSitemap() {
  const routes = await sitemap();
  console.log(`Total sitemap URLs generated: ${routes.length}`);
  
  let invalidUrls = 0;
  let missingSlashOrMalformed = 0;
  
  for (const r of routes) {
    if (!r.url.startsWith('https://www.fhinspectionsatl.com')) {
      console.log(`Invalid domain URL: ${r.url}`);
      invalidUrls++;
    }
    if (r.url.endsWith('//') || r.url.includes('undefined')) {
      console.log(`Malformed URL: ${r.url}`);
      missingSlashOrMalformed++;
    }
  }
  
  console.log(`Validation results: Invalid Domain URLs = ${invalidUrls}, Malformed URLs = ${missingSlashOrMalformed}`);
  console.log('Sample URLs from sitemap:', routes.slice(0, 10));
}

testSitemap();
