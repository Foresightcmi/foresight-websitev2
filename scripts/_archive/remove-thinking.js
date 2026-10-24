const fs = require('fs');
let content = fs.readFileSync('app/api/chat/route.js', 'utf8');
content = content.replace(/,\s*thinkingConfig:\s*\{\s*thinkingBudget:\s*0\s*\}/g, '');
fs.writeFileSync('app/api/chat/route.js', content);
console.log('Removed thinkingConfig');
