import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, '..', 'app');

// Check all page.js files for canonical metadata definitions
function checkCanonicals(dir) {
  let files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkCanonicals(fullPath);
    } else if (file === 'page.js' || file === 'page.jsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasMetadata = content.includes('generateMetadata') || content.includes('export const metadata');
      const hasCanonical = content.includes('canonical');
      console.log(`Page: ${fullPath.replace(/\\/g, '/')} | Metadata: ${hasMetadata} | Explicit Canonical: ${hasCanonical}`);
    }
  }
}

checkCanonicals(APP_DIR);
