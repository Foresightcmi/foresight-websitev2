import fs from 'fs';
import path from 'path';

function searchHoursContent(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        searchHoursContent(fullPath);
      }
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.md') || fullPath.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('monday') || content.toLowerCase().includes('wednesday') || content.toLowerCase().includes('openinghours') || content.includes('8:00 AM') || content.includes('8:00 PM')) {
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (/monday|tuesday|wednesday|thursday|friday|saturday|sunday|hours|8:00/i.test(line) && /am|pm|closed|appointment|spec|closes|opens/i.test(line)) {
              console.log(`${fullPath}:${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchHoursContent('C:/Users/fores/.gemini/antigravity/scratch/foresight-website');
