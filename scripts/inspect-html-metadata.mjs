import fs from 'fs';
import path from 'path';

const nextServerDir = 'C:/Users/fores/.gemini/antigravity/scratch/foresight-website/.next/server/app';

function scanHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanHtmlFiles(fullPath);
    } else if (file.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf8');
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
      const robotsMatch = html.match(/<meta name="robots" content="([^"]*)"/);
      const canonical = canonicalMatch ? canonicalMatch[1] : 'NONE';
      const robots = robotsMatch ? robotsMatch[1] : 'NONE';
      
      const relativeRoute = fullPath.replace(nextServerDir, '').replace(/\\/g, '/');
      console.log(`Route: ${relativeRoute} | Canonical: ${canonical} | Robots: ${robots}`);
    }
  }
}

scanHtmlFiles(nextServerDir);
