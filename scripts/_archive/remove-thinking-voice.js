const fs = require('fs');
let content = fs.readFileSync('app/api/voice/route.js', 'utf8');
content = content.replace(/,\s*thinkingConfig:\s*\{\s*thinkingBudget:\s*0\s*\}/g, '');
content = content.replace(/'gemini-2\.5-flash'/g, "'gemini-3.5-flash'");
fs.writeFileSync('app/api/voice/route.js', content);
console.log('Removed thinkingConfig from voice route');
