const fs = require('fs');
let content = fs.readFileSync('app/api/chat/route.js', 'utf8');
content = content.replace(/gemini-2\.5-flash/g, 'gemini-3.5-flash');
fs.writeFileSync('app/api/chat/route.js', content);
console.log('Upgraded to gemini-3.5-flash');
