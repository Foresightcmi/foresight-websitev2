const fs = require('fs');
const file = 'app/components/VoiceAgentModal.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\/videos\/chris-avatar-office-loop\.mp4/g, '/videos/chris-avatar-real.mp4');
content = content.replace(/\/videos\/chris-avatar-loop\.mp4/g, '/videos/chris-avatar-real.mp4');
fs.writeFileSync(file, content);
console.log('Replaced video paths.');
