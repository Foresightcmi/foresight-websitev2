import fs from 'fs';
import path from 'path';

const VIP_FILE = path.resolve('public/vip-dispatch.html');
console.log('⚡ Loading public/vip-dispatch.html...');

let content = fs.readFileSync(VIP_FILE, 'utf8');

// 1. Locate realtorFilers JSON array
const startPattern = 'const realtorFilers = ';
const startIdx = content.indexOf(startPattern);
if (startIdx === -1) {
  console.error('❌ Could not find realtorFilers in vip-dispatch.html');
  process.exit(1);
}

const jsonStart = startIdx + startPattern.length;
const tabIdx = content.indexOf('let currentTab =', jsonStart);
if (tabIdx === -1) {
  console.error('❌ Could not find let currentTab in vip-dispatch.html');
  process.exit(1);
}

const jsonEnd = content.lastIndexOf(';', tabIdx);
if (jsonEnd === -1) {
  console.error('❌ Could not find end semicolon of realtorFilers array');
  process.exit(1);
}

console.log(`Parsing realtorFilers JSON chunk (${(jsonEnd - jsonStart).toLocaleString()} bytes)...`);
const realtorFilers = JSON.parse(content.substring(jsonStart, jsonEnd));
console.log(`Found ${realtorFilers.length} realtors.`);

// 2. Refine text_body and sms_link for EVERY realtor (NO CRL, NO asterisks, refined high-converting copy)
const dekalbRegex = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|clarkston|doraville|avondale/i;

let crlRemovedCount = 0;
let dekalbCount = 0;

realtorFilers.forEach(f => {
  const firstName = f.first || (f.name ? f.name.trim().split(' ')[0] : 'there');
  f.first = firstName;

  const isDeKalb = dekalbRegex.test(f.city || '') || dekalbRegex.test(f.address || '');
  if (isDeKalb) dekalbCount++;

  const dekalbBonus = isDeKalb ? ', and on-site DeKalb Low-Flow Certificate ($100)' : '';

  // Refined high-converting text message (NO CRL, zero asterisks, elite agency standard)
  const newTextBody = `Hi ${firstName}, saw your listing at ${f.address} in ${f.city} is active—congratulations! Christopher Boykin, CMI with Foresight Home Inspections here. We have a 24-hr due diligence slot open in ${f.city} this week with our two-inspector team, active SUPRA eKEY access, same-day report delivery${dekalbBonus}. Best wishes on a smooth closing! — (678) 480-2110 | https://fhinspectionsatl.com`;

  if (f.text_body && f.text_body.includes('CRL')) {
    crlRemovedCount++;
  }

  f.text_body = newTextBody;

  const cleanPhone = (f.clean_phone || f.raw_phone || f.phone || '').replace(/[^0-9]/g, '');
  f.clean_phone = cleanPhone;
  f.sms_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(newTextBody)}`;
});

console.log(`✓ Removed CRL from ${crlRemovedCount} realtor messages.`);
console.log(`✓ Enhanced ${dekalbCount} DeKalb County listings with Low-Flow Certificate mention.`);

// 3. Replace the array in the HTML
const newJsonString = JSON.stringify(realtorFilers);
content = content.substring(0, jsonStart) + newJsonString + content.substring(jsonEnd);

// 4. Update preview display to ensure Foresight Home Inspections styling works without asterisks
content = content.replace(
  `replace('*Foresight Home Inspections*', '<strong style=\\"color:#ffffff; font-weight:800;\\">Foresight Home Inspections</strong>')`,
  `replace('Foresight Home Inspections', '<strong style=\\"color:#ffffff; font-weight:800;\\">Foresight Home Inspections</strong>')`
);

// 5. Update Version Cache-Buster so user's phone updates immediately
const newVersion = '2026.10.13-no-crl-v8';
content = content.replace(/DISPATCH_VERSION = '.*?';/, `DISPATCH_VERSION = '${newVersion}';`);
content = content.replace(/v=[0-9]/g, 'v=8');
content = content.replace(/5-STAR REVIEW CONSOLE ACTIVE/, 'VIP DISPATCH ACTIVE (NO CRL / REFINED)');

fs.writeFileSync(VIP_FILE, content, 'utf8');
console.log(`✅ Saved refined public/vip-dispatch.html (Version ${newVersion})!`);
