import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Extracting realtor filers from git commit bce2a03...');
const content = execSync('git show bce2a03:public/vip-dispatch.html', { maxBuffer: 35 * 1024 * 1024 }).toString('utf8');
const match = content.match(/const realtorFilers = (\[.*?\]);/s);

if (!match) {
  console.error('Could not find realtorFilers in bce2a03');
  process.exit(1);
}

const filers = JSON.parse(match[1]);
console.log('Total filers in archive:', filers.length);

// Filter to recent listings: from Sept 15, 2026 to Oct 3, 2026
const recent = filers.filter(f => f.date >= '2026-09-15');

const seenPhones = new Set();
const deduped = [];

recent.forEach(f => {
  const phone = (f.raw_phone || f.phone || '').replace(/[^0-9]/g, '');
  if (phone.length === 10 && !seenPhones.has(phone)) {
    seenPhones.add(phone);
    deduped.push(f);
  }
});

// Sort newest first
deduped.sort((a, b) => b.date.localeCompare(a.date));

deduped.forEach(f => {
  const firstName = f.first || (f.name ? f.name.trim().split(' ')[0] : 'there');
  f.first = firstName;
  f.email = f.email || '';
  const cleanPhone = (f.raw_phone || f.phone || '').replace(/[^0-9]/g, '');
  f.clean_phone = cleanPhone;

  const city = f.city || 'Metro Atlanta';
  const address = f.address || 'your property';

  f.text_body = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! Saw ${address} in ${city} is under contract—congratulations! If your buyers or co-op agent need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and our 1-click GAR Form F404 repair addendum tool, we have a slot open in ${city} this week. Best wishes on a smooth closing! — (678) 480-2110 | https://fhinspectionsatl.com/realtors`;
  f.sms_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(f.text_body)}`;

  f.buyer_forward_body = `Hi ${firstName}, here is our 1-click due diligence scheduler and $35,000 warranty certificate for your buyers at ${address}: https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)} — Includes our two-inspector team, same-day report, and free utility setup concierge. Feel free to pass this directly to your buyers so they can lock in their inspection date today!`;
  f.buyer_forward_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(f.buyer_forward_body)}`;
});

const outPath = path.resolve('data/under-contract-realtors.json');
fs.writeFileSync(outPath, JSON.stringify(deduped, null, 2), 'utf8');
console.log(`Saved ${deduped.length} recent under-contract realtor contacts to ${outPath}!`);

console.log('Sample record 0:', deduped[0]);
