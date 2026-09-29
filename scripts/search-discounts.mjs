import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!['.next', 'node_modules', '.git'].includes(file)) {
        results = results.concat(walk(full));
      }
    } else if (/\.(js|jsx|ts|tsx|json|md|html)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = ['app', 'lib', 'data', 'public'].flatMap(d => walk(d));
const terms = ['discount', 'military', 'veteran', 'first responder', 'hero', 'coupon', 'promo', '$25', '$50'];

console.log('Total files scanned:', allFiles.length);

for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((l, idx) => {
    const lower = l.toLowerCase();
    for (const t of terms) {
      if (lower.includes(t)) {
        // Skip irrelevant false positives
        if (t === 'hero' && !lower.includes('hero discount') && !lower.includes('hometown hero')) {
          continue;
        }
        if (t === '$25' && (lower.includes('$25,000') || lower.includes('25,000') || lower.includes('$25 million') || lower.includes('25 million'))) {
          continue;
        }
        if (t === '$50' && (lower.includes('$50,000') || lower.includes('50,000') || lower.includes('50-mile') || lower.includes('50 mile'))) {
          continue;
        }
        console.log(`${f}:${idx + 1} [${t}]: ${l.trim().slice(0, 150)}`);
        break;
      }
    }
  });
}
