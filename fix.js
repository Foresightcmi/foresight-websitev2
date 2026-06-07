const fs = require('fs');
let data = fs.readFileSync('data/posts.json', 'utf8');

// Regex replace the first conflict
data = data.replace(/<<<<<<< HEAD[\s\S]*?=======\n/, '');
// Now the first conflict had <<<<<<< HEAD ... ======= ... >>>>>>> c218c...
// Wait, the first one:
// <<<<<<< HEAD
//   "slug": "why-new-..."
// ...
//   {
//     "slug": "crawlspace..."
//     ...
//     "date": "2026-06-06",
// =======
//     "slug": "crawlspace..."
//     ...
//     "date": "2026-06-07",
// >>>>>>> c218c...

// If I just remove from ======= to >>>>>>> c218c... for the first block:
// Wait, we want to KEEP the HEAD version of the first block! Wait, no. The first block HEAD has BOTH the new posts AND the old date. The other branch ONLY has the new date.
// If we keep the HEAD version, we keep the new posts.
// So we should remove `=======` down to `>>>>>>> c218c...` for the first block.
// And same for the second block! We want to keep HEAD for both!

// Let's just remove the conflict markers and the content from `=======` to `>>>>>>> c218...`

const lines = data.split('\n');
const newLines = [];
let inConflict = false;
let keepLine = true;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('<<<<<<< HEAD')) {
    inConflict = true;
    keepLine = true;
    continue; // skip the marker
  }
  if (line.startsWith('=======')) {
    keepLine = false;
    continue; // skip the marker
  }
  if (line.startsWith('>>>>>>>')) {
    inConflict = false;
    keepLine = true;
    continue; // skip the marker
  }
  
  if (keepLine) {
    newLines.push(line);
  }
}

fs.writeFileSync('data/posts.json', newLines.join('\n'));
console.log('Fixed conflicts');
