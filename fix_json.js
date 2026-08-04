const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const citiesPath = path.join(dataDir, 'cities.json');

let content = fs.readFileSync(citiesPath, 'utf8');

// The script replaced href='...' with href="..."
// We need to change href="..." back to href='...' if it's inside a JSON string.
// Let's just fix the specific replacements we made:
content = content.replace(/href="\/contact"/g, "href='/contact'");
content = content.replace(/href="\/about"/g, "href='/about'");
// We also need to fix any other ones like href="/..." that might have double quotes now.
// Since it's inside HTML which is a string value in JSON, we can just replace all `href="/... "` with `href='/... '`
// actually, a safer regex:
content = content.replace(/href="(\/[^"]+)"/g, "href='$1'");

fs.writeFileSync(citiesPath, content, 'utf8');
console.log('Fixed quotes in cities.json');

// Let's also verify it's valid JSON now
try {
  JSON.parse(content);
  console.log('JSON is now valid.');
} catch (e) {
  console.error('JSON is still invalid:', e);
}
