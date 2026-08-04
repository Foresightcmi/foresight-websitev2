const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace references like contact.html, about.html, etc.
  // Note: we want to replace things like `href='../contact.html'` or `href="/about.html"`
  // We can use a regex that looks for `.html` inside href attributes or just generally `.html` followed by `'` or `"`
  // Let's do a safe replacement for internal links.
  
  const oldContent = content;
  content = content.replace(/href=['"]([^'"]+)\.html['"]/g, (match, urlPath) => {
    // If it's something like ../contact, we can clean it to /contact to be safe, 
    // or just remove the .html if it's already an absolute or root-relative path.
    // Given the Next.js app structure, it's best if we just use root-relative paths like /contact
    if (urlPath === '../contact') return 'href="/contact"';
    if (urlPath === '../about') return 'href="/about"';
    if (urlPath.startsWith('../')) return `href="/${urlPath.replace('../', '')}"`;
    return `href="${urlPath}"`;
  });
  
  if (content !== oldContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplacements++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Finished processing. Updated ${totalReplacements} files.`);
