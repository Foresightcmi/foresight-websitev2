import fs from 'fs';

const filePath = 'C:/Users/fores/.gemini/antigravity/brain/fcf76790-8df6-41f1-9b07-3bd2b153b689/.system_generated/steps/1568/content.md';
const content = fs.readFileSync(filePath, 'utf8');

const titleMatch = content.match(/<title>([^<]+)<\/title>/);
const descMatch = content.match(/name="description" content="([^"]+)"/);
const ogTitle = content.match(/property="og:title" content="([^"]+)"/);
const ogDesc = content.match(/property="og:description" content="([^"]+)"/);

console.log('Title:', titleMatch ? titleMatch[1] : 'None');
console.log('OG Title:', ogTitle ? ogTitle[1] : 'None');
console.log('Description:', descMatch ? descMatch[1] : 'None');
console.log('OG Description:', ogDesc ? ogDesc[1] : 'None');

// Find video details in ytInitialPlayerResponse or ytInitialData
const playerResponseMatch = content.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
if (playerResponseMatch) {
  try {
    const data = JSON.parse(playerResponseMatch[1]);
    console.log('VideoDetails:', JSON.stringify(data.videoDetails, null, 2));
  } catch (e) {
    console.log('JSON parse failed for playerResponse');
  }
}
