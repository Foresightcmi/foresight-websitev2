import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        results = results.concat(scanDir(filePath));
      }
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.html') || filePath.endsWith('.json')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('noindex') || content.includes('disallow') || content.includes('X-Robots-Tag')) {
          results.push({ filePath, type: 'noindex_found' });
        }
      }
    }
  });
  return results;
}

console.log(JSON.stringify(scanDir('C:/Users/fores/.gemini/antigravity/scratch/foresight-website'), null, 2));
