import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const filePath = path.resolve('public/vip-dispatch.html');
console.log('Reading current vip-dispatch.html...');
let currentContent = fs.readFileSync(filePath, 'utf8');

// 1. Get 4,627 realtors from commit 3857525
console.log('Extracting 4,627 realtors from commit 3857525...');
const oldContent = execSync('git show 3857525:public/vip-dispatch.html', { maxBuffer: 25 * 1024 * 1024 }).toString('utf8');
const oldRealtorMatch = oldContent.match(/const realtorFilers = (\[.*?\]);/s);
if (!oldRealtorMatch) {
  console.error('Failed to match realtorFilers in 3857525');
  process.exit(1);
}
const realtorFilers = JSON.parse(oldRealtorMatch[1]);
console.log('Loaded realtors from 3857525 count:', realtorFilers.length);

// 2. Get client cards from current file and ensure review_body is 100% verified
const curClientMatch = currentContent.match(/const clientCards = (\[.*?\]);/s);
if (!curClientMatch) {
  console.error('Failed to match clientCards in currentContent');
  process.exit(1);
}
const clientCards = JSON.parse(curClientMatch[1]);
console.log('Loaded clientCards count:', clientCards.length);

const directReviewUrl = "https://g.page/r/CaK5MZOz_FBtEBM/review";

clientCards.forEach(cl => {
  const addrPart = (cl.address && cl.address !== 'your home' && cl.address !== 'your property')
    ? ` at ${cl.address}`
    : '';
  const firstName = cl.first || (cl.name ? cl.name.split(' ')[0] : 'Valued Client');
  
  cl.first = firstName;
  cl.review_body = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! It was an absolute honor inspecting your home${addrPart}. As an independent Atlanta local business, our reputation is built on 5-star reviews from valued clients like you. Could you please take 30 seconds to give us a 5-star review on Google? ⭐ Tap here for instant access: ${directReviewUrl} - It means the world to our team! Thank you so much! Christopher Boykin, CMI® (678) 480-2110`;
  
  const cleanPhone = (cl.raw_phone || cl.phone || '').replace(/[^0-9]/g, '');
  cl.raw_phone = cleanPhone;
  cl.review_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(cl.review_body)}`;
});

// 3. Update realtorFilers in HTML
currentContent = currentContent.replace(/const realtorFilers = \[.*?\];/s, `const realtorFilers = ${JSON.stringify(realtorFilers)};`);

// 4. Update clientCards in HTML
currentContent = currentContent.replace(/const clientCards = \[.*?\];/s, `const clientCards = ${JSON.stringify(clientCards)};`);

// 5. Update header button text to Realtors (4,627)
currentContent = currentContent.replace(/🏠 Realtors \([0-9,]+\)/g, `🏠 Realtors (${realtorFilers.length.toLocaleString()})`);

// 6. Add cache-control meta tags and auto-reload script in <head>
const cacheControlHead = `  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <script>
    // Immediate Cache-Buster & Sync Engine
    const DISPATCH_VERSION = '2026.09.29-review-v5';
    try {
      const storedVer = localStorage.getItem('foresight_dispatch_version');
      if (storedVer !== DISPATCH_VERSION) {
        localStorage.setItem('foresight_dispatch_version', DISPATCH_VERSION);
        if (!window.location.search.includes('v=5')) {
          const u = new URL(window.location.href);
          u.searchParams.set('v', '5');
          u.searchParams.set('ts', Date.now());
          window.location.replace(u.toString());
        }
      }
    } catch(e) {}
  </script>`;

if (!currentContent.includes('DISPATCH_VERSION')) {
  currentContent = currentContent.replace('<head>', `<head>\n${cacheControlHead}`);
}

// 7. Add visual version banner right above mode-nav
const versionBanner = `    <!-- Cache-Bust & 5-Star Status Banner -->
    <div style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.12)); border:1px solid #f59e0b; border-radius:8px; padding:8px 12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
      <div style="font-size:12px; font-weight:800; color:#fbbf24; display:flex; align-items:center; gap:6px;">
        <span>⭐ 5-STAR REVIEW CONSOLE ACTIVE</span>
        <span style="background:#059669; color:#fff; font-size:10px; padding:1px 5px; border-radius:4px;">LIVE</span>
      </div>
      <button onclick="window.location.href='/vip-dispatch.html?v=5&ts='+Date.now()" style="background:#f59e0b; color:#0b0f19; font-size:11px; font-weight:800; padding:4px 9px; border:none; border-radius:5px; cursor:pointer;">
        🔄 Refresh
      </button>
    </div>`;

if (!currentContent.includes('5-STAR REVIEW CONSOLE ACTIVE')) {
  currentContent = currentContent.replace('<div class="mode-nav">', `${versionBanner}\n    <div class="mode-nav">`);
}

fs.writeFileSync(filePath, currentContent, 'utf8');
console.log('Rebuilt vip-dispatch.html successfully!');
console.log('Realtors count in file:', realtorFilers.length);
console.log('Clients count in file:', clientCards.length);
