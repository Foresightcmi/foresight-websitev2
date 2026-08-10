import fs from 'fs';
import path from 'path';

function searchFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next') && !filePath.includes('.git')) {
        results = results.concat(searchFiles(filePath));
      }
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.md') || filePath.endsWith('.json')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (
          content.includes('8:00') ||
          content.includes('8am') ||
          content.includes('8pm') ||
          content.includes('openingHours') ||
          content.includes('Hours') ||
          content.includes('hours')
        ) {
          // Check for specific matches
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (/8\s*:?\s*00|8\s*am|8\s*pm|monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(line) && /hours|open|closes|schedule|time/i.test(line)) {
              results.push({ file: filePath, lineNum: index + 1, text: line.trim() });
            }
          });
        }
      }
    }
  });
  return results;
}

const matches = searchFiles('C:/Users/fores/.gemini/antigravity/scratch/foresight-website');
console.log(JSON.stringify(matches, null, 2));
