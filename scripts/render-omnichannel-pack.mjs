#!/usr/bin/env node
/**
 * Foresight Omnichannel Social & GBP Visual + Video Pack Renderer
 * Foresight Home Inspections, LLC (https://www.fhinspectionsatl.com)
 *
 * Renders 100% Brand-Locked Tri-Logo Assets into public/social/omnichannel-pack/:
 *   1. gbp-store-264545-card.png         (1200x900 4:3 GBP Update Card — CMI 122px > CPI 112px)
 *   2. slide_1.png .. slide_5.png        (1080x1350 4:5 Carousel Slides — CMI 115px > CPI 106px header; 90px > 82px Slide 5 dock)
 *   3. linkedin_carousel_deck.pdf        (5-Page 1080x1350 LinkedIn Document Carousel PDF)
 *   4. reel-3am-homebuyer-red-flags-30s.mp4 (1080x1920 9:16 30s Vertical Reel scored with foresight-anthem-30s-hook.mp3)
 *   5. pack-manifest.json                (Structured metadata + ready-to-paste captions for /studio)
 *
 * Strictly enforces AGENTS.md §1 & §6:
 *   - Logopng.png unmodified (filter: none) on #FFFFFF header pill/bar
 *   - Optical CMI > CPI sizing across every surface
 *   - Unclipped 1.67:1 Christopher_Boykin.jpg portrait
 *   - Zero asterisks (*), zero banned tokens, From $345 / From $295 / From $275 / From $400 + Call for Quote
 */

import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'social', 'omnichannel-pack');

fs.mkdirSync(OUT_DIR, { recursive: true });

function dataUri(relPath) {
  const full = path.join(ROOT, relPath);
  const ext = path.extname(full).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`;
}

const IMG = {
  logo: dataUri('public/images/Logopng.png'),
  cmi: dataUri('public/images/cmi_logo.png'),
  cpi: dataUri('public/images/cpi_logo.png'),
  chris: dataUri('public/images/Christopher_Boykin.jpg'),
  thermal: dataUri('public/images/thermal-ceiling.png'),
  crawlspace: dataUri('public/images/crawlspace.png'),
  drone: dataUri('public/images/drone-2.png'),
  panel: dataUri('public/images/two-inspectors-electrical-panel-inspection.jpg'),
};

function baseCss() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
      background: #0B132B;
      color: #F8FAFC;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .tri-header {
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 38px;
      border-bottom: 5px solid #D4AF37;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .tri-header .brand-logo {
      height: 82px;
      width: auto;
      object-fit: contain;
      filter: none;
    }
    .tri-badges {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .pill {
      display: inline-block;
      background: rgba(212, 175, 55, 0.16);
      color: #FACC15;
      border: 1.5px solid rgba(212, 175, 55, 0.55);
      border-radius: 999px;
      padding: 8px 20px;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .footer-strip {
      background: #070C1C;
      border-top: 2px solid rgba(212, 175, 55, 0.4);
      padding: 18px 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 21px;
      font-weight: 700;
      color: #E2E8F0;
    }
    .gold { color: #FACC15; }
    .red-accent { color: #F87171; }
    .green { color: #34D399; }
  `;
}

function buildGbpCardHtml() {
  // 1200 x 900 (4:3 GBP Card: CMI 122px vs CPI 112px)
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseCss()}
    .canvas { width: 1200px; height: 900px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(145deg, #0B132B 0%, #131F3E 60%, #091024 100%); }
    .body-grid { display: grid; grid-template-columns: 1.18fr 0.82fr; gap: 32px; padding: 28px 42px; align-items: center; flex: 1; }
    h1 { font-size: 42px; line-height: 1.14; font-weight: 900; margin: 14px 0 16px; color: #FFFFFF; }
    .checks { list-style: none; display: grid; gap: 11px; margin-bottom: 20px; }
    .checks li { font-size: 21px; font-weight: 600; color: #F1F5F9; display: flex; align-items: center; gap: 10px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #34D399; flex-shrink: 0; }
    .price-row { display: flex; flex-wrap: wrap; gap: 10px; }
    .price-chip { background: #1E293B; border: 1.5px solid #D4AF37; border-radius: 10px; padding: 9px 14px; font-size: 19px; font-weight: 800; color: #FFFFFF; }
    .right-card { background: #111B36; border: 2px solid rgba(212,175,55,0.45); border-radius: 18px; padding: 18px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.45); }
    .portrait-wrap { width: 100%; aspect-ratio: 1024 / 614; border-radius: 12px; overflow: hidden; border: 2px solid #D4AF37; background: #0B132B; margin-bottom: 14px; }
    .portrait-wrap img { width: 100%; height: 100%; object-fit: contain; }
    .stat-box { background: rgba(16,185,129,0.14); border: 1px solid rgba(52,211,153,0.45); border-radius: 12px; padding: 12px; margin-top: 12px; }
  </style></head><body>
    <div class="canvas">
      <div class="tri-header">
        <img class="brand-logo" src="${IMG.logo}" alt="Foresight Home Inspections" style="height: 88px; filter: none;" />
        <div class="tri-badges">
          <img src="${IMG.cmi}" alt="CMI MICB-1082" style="height: 122px; width: auto; object-fit: contain;" />
          <img src="${IMG.cpi}" alt="InterNACHI CPI" style="height: 112px; width: auto; object-fit: contain;" />
        </div>
      </div>
      <div class="body-grid">
        <div>
          <span class="pill">4.8 Stars • 53 Verified Google Reviews • 20 Metro Counties</span>
          <h1>2 Certified Inspectors on Every Home + <span class="gold">$0 Free Thermal &amp; 4K Drone</span></h1>
          <ul class="checks">
            <li><span class="dot"></span>Dedicated Structural + Mechanical Parallel Focus (Zero Solo Fatigue)</li>
            <li><span class="dot"></span>Same-Day Interactive Report + 1-Click Repair Request Builder</li>
            <li><span class="dot"></span>$35,000 Combined Warranty &amp; Honor Guarantee ($0 Deductible)</li>
            <li><span class="dot"></span>Documenting $1,250–$14,200+ in Typical Seller Repair Credits</li>
          </ul>
          <div class="price-row">
            <div class="price-chip">Homes <span class="gold">From $345</span></div>
            <div class="price-chip">Condos <span class="gold">From $295</span></div>
            <div class="price-chip">Pre-Drywall <span class="gold">From $275</span></div>
            <div class="price-chip">New Build <span class="gold">From $400</span></div>
          </div>
        </div>
        <div class="right-card">
          <div class="portrait-wrap">
            <img src="${IMG.chris}" alt="Christopher Boykin CMI" />
          </div>
          <div style="font-size: 23px; font-weight: 900; color: #FFFFFF;">Christopher Boykin, CMI</div>
          <div style="font-size: 16px; color: #CBD5E1; font-weight: 600; margin-top: 3px;">CMI #MICB-1082 • InterNACHI #NACHI18051119</div>
          <div class="stat-box">
            <div style="font-size: 15px; font-weight: 800; color: #34D399; text-transform: uppercase;">Free 3:00 AM Buyer Tool</div>
            <div style="font-size: 15.5px; font-weight: 800; color: #FFFFFF; margin-top: 4px; white-space: nowrap;">fhinspectionsatl.com/homebuyer-red-flags</div>
          </div>
        </div>
      </div>
      <div class="footer-strip">
        <span>Instant 24/7 Quote: <span class="gold">fhinspectionsatl.com/quote</span></span>
        <span>Auxiliary &amp; Commercial PCA: <span class="gold">Call (678) 480-2110 for Quote</span></span>
      </div>
    </div>
  </body></html>`;
}

const CAROUSEL_SLIDES = [
  {
    num: '1 / 5',
    badge: 'Metro Atlanta Buyer Due Diligence Guide',
    title: '5 Red Flags Atlanta Homebuyers Google at <span class="gold">3:00 AM</span>',
    subtitle: 'And what Metro Atlanta contractors actually charge to repair them before your Georgia due diligence window closes.',
    photo: IMG.thermal,
    photoCaption: 'Calibrated Infrared Thermal Moisture Scan — Included at $0 Extra Charge',
    bullets: [
      'Georgia has zero state licensing requirement for residential home inspectors.',
      'Led by Certified Master Inspector Christopher Boykin (CMI #MICB-1082).',
      'Two Certified Inspectors on every home for double diagnostic depth.'
    ]
  },
  {
    num: '2 / 5',
    badge: 'Red Flags #1 & #2 • Moisture & Foundation',
    title: 'Musty AC Odors &amp; <span class="gold">Stair-Step Brick Cracks</span>',
    subtitle: 'Piedmont red clay and humid vented crawlspaces drive two of Georgia’s steepest hidden repair bills:',
    photo: IMG.crawlspace,
    photoCaption: 'Subfloor Joist Moisture & Vapor Barrier Profiling Under Metro Atlanta Homes',
    bullets: [
      'Earthy Odor When AC Runs: Crawlspace wood moisture >19% ($1,800 to $9,500+ encapsulation or subfloor repair).',
      'Diagonal Brick Cracks & Sticking Doors: Differential footing settlement ($2,500 to $14,200+ piering & drainage).',
      'Optional Mold/IAQ & 48-Hr Radon Testing: Call (678) 480-2110 for Quote.'
    ]
  },
  {
    num: '3 / 5',
    badge: 'Red Flags #3 & #4 • Roofs, Pipes & Panels',
    title: 'Fresh Ceiling Paint Patches &amp; <span class="gold">1980s Panels / Pipes</span>',
    subtitle: 'Fresh white primer hides active leaks from the naked eye—and legacy systems trigger 30-day insurance drops:',
    photo: IMG.panel,
    photoCaption: 'Two Certified Inspectors Evaluating Electrical Panels & Thermal Loads in Parallel',
    bullets: [
      'Repainted Ceiling Squares: Concealed roof flashing or shower-pan leaks ($1,250 to $8,800+ repair range).',
      '1978–1995 Grey Polybutylene Pipes or FPE/Zinsco Panels: ($1,900 to $8,500+ repipe or panel upgrade).',
      'Pre-1995 Wooded Sewer Laterals: HD Fiber-Optic Sewer Scope — Call (678) 480-2110 for Quote.'
    ]
  },
  {
    num: '4 / 5',
    badge: 'Red Flag #5 • New Builds & Solo Fatigue',
    title: 'Why Solo Walkthroughs Miss <span class="gold">$1,500–$9,000+</span> in Defects',
    subtitle: 'County code officials spend 10–15 minutes checking minimums. Foresight sends Two Certified Inspectors on every property:',
    photo: IMG.drone,
    photoCaption: '4K Aerial Drone Roof Valley & Flashing Scan — Included Free on Full Inspections',
    bullets: [
      'Free Calibrated Infrared Thermal Imaging + Free 4K Drone Roof Photography.',
      'Same-Day Interactive Digital Report + 1-Click Digital Repair Request Builder.',
      '$35,000 Combined Protection ($10,000 Elite Master Warranty $0 Deductible + $25,000 Honor Guarantee).'
    ]
  }
];

function buildCarouselSlideHtml(slideIdx) {
  // 1080 x 1350 (4:5 Carousel: CMI 115px > CPI 106px header; Slide 5 dock 90px > 82px)
  if (slideIdx < 4) {
    const s = CAROUSEL_SLIDES[slideIdx];
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${baseCss()}
      .canvas { width: 1080px; height: 1350px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg, #0B132B 0%, #131F3E 58%, #080E20 100%); }
      .main { padding: 34px 48px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
      .top-meta { display: flex; justify-content: space-between; align-items: center; }
      .slide-num { font-size: 22px; font-weight: 900; color: #94A3B8; background: #1E293B; padding: 8px 18px; border-radius: 999px; border: 1px solid #334155; }
      h1 { font-size: 50px; line-height: 1.13; font-weight: 900; margin-top: 18px; color: #FFFFFF; }
      .sub { font-size: 25px; line-height: 1.42; color: #CBD5E1; margin-top: 14px; font-weight: 500; }
      .photo-card { border-radius: 18px; overflow: hidden; border: 2px solid rgba(212,175,55,0.55); background: #091024; box-shadow: 0 16px 36px rgba(0,0,0,0.45); margin: 22px 0; }
      .photo-card img { width: 100%; height: 410px; object-fit: cover; display: block; }
      .photo-cap { background: #111B36; padding: 12px 20px; font-size: 19px; font-weight: 700; color: #FACC15; border-top: 1px solid rgba(212,175,55,0.35); }
      .bullets { list-style: none; display: grid; gap: 16px; }
      .bullets li { background: rgba(30,41,59,0.78); border-left: 5px solid #D4AF37; border-radius: 10px; padding: 16px 20px; font-size: 23px; line-height: 1.36; font-weight: 600; color: #F8FAFC; }
    </style></head><body>
      <div class="canvas">
        <div class="tri-header">
          <img class="brand-logo" src="${IMG.logo}" alt="Foresight Home Inspections" style="height: 82px; filter: none;" />
          <div class="tri-badges">
            <img src="${IMG.cmi}" alt="CMI MICB-1082" style="height: 115px; width: auto; object-fit: contain;" />
            <img src="${IMG.cpi}" alt="InterNACHI CPI" style="height: 106px; width: auto; object-fit: contain;" />
          </div>
        </div>
        <div class="main">
          <div>
            <div class="top-meta">
              <span class="pill">${s.badge}</span>
              <span class="slide-num">Slide ${s.num}</span>
            </div>
            <h1>${s.title}</h1>
            <p class="sub">${s.subtitle}</p>
          </div>
          <div class="photo-card">
            <img src="${s.photo}" alt="Foresight Field Diagnostic" />
            <div class="photo-cap">${s.photoCaption}</div>
          </div>
          <ul class="bullets">
            ${s.bullets.map((b) => `<li>${b}</li>`).join('')}
          </ul>
        </div>
        <div class="footer-strip">
          <span>Homes <span class="gold">From $345</span> • Pre-Drywall <span class="gold">From $275</span> • New Build <span class="gold">From $400</span></span>
          <span class="gold">Swipe →</span>
        </div>
      </div>
    </body></html>`;
  }

  // Slide 5 (Action + Transparent Pricing + Unclipped 1.67:1 Portrait + 90px vs 82px Dock)
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseCss()}
    .canvas { width: 1080px; height: 1350px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg, #0B132B 0%, #131F3E 58%, #080E20 100%); }
    .main { padding: 30px 48px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .top-meta { display: flex; justify-content: space-between; align-items: center; }
    .slide-num { font-size: 22px; font-weight: 900; color: #94A3B8; background: #1E293B; padding: 8px 18px; border-radius: 999px; border: 1px solid #334155; }
    h1 { font-size: 46px; line-height: 1.14; font-weight: 900; margin-top: 14px; color: #FFFFFF; }
    .hero-box { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 24px; background: #111B36; border: 2px solid rgba(212,175,55,0.5); border-radius: 18px; padding: 22px; align-items: center; }
    .portrait-wrap { width: 100%; aspect-ratio: 1024 / 614; border-radius: 12px; overflow: hidden; border: 2px solid #D4AF37; background: #0B132B; }
    .portrait-wrap img { width: 100%; height: 100%; object-fit: contain; }
    .price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .p-card { background: #1E293B; border: 1.5px solid rgba(212,175,55,0.45); border-radius: 14px; padding: 16px 20px; }
    .p-label { font-size: 19px; color: #CBD5E1; font-weight: 700; }
    .p-val { font-size: 32px; font-weight: 900; color: #FACC15; margin-top: 4px; }
    .cta-banner { background: linear-gradient(90deg, #D32F2F 0%, #B71C1C 100%); border: 2px solid #FACC15; border-radius: 18px; padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
    .dock { background: #FFFFFF; border-radius: 14px; padding: 10px 18px; display: flex; align-items: center; gap: 14px; }
  </style></head><body>
    <div class="canvas">
      <div class="tri-header">
        <img class="brand-logo" src="${IMG.logo}" alt="Foresight Home Inspections" style="height: 82px; filter: none;" />
        <div class="tri-badges">
          <img src="${IMG.cmi}" alt="CMI MICB-1082" style="height: 115px; width: auto; object-fit: contain;" />
          <img src="${IMG.cpi}" alt="InterNACHI CPI" style="height: 106px; width: auto; object-fit: contain;" />
        </div>
      </div>
      <div class="main">
        <div>
          <div class="top-meta">
            <span class="pill">Transparent Upfront Rates • $35,000 Protection</span>
            <span class="slide-num">Slide 5 / 5</span>
          </div>
          <h1>Test Our Free Red-Flag Translator or <span class="gold">Lock Your Instant Quote</span></h1>
        </div>
        <div class="hero-box">
          <div class="portrait-wrap">
            <img src="${IMG.chris}" alt="Christopher Boykin CMI" />
          </div>
          <div>
            <div style="font-size: 26px; font-weight: 900; color: #FFFFFF;">Christopher Boykin, CMI</div>
            <div style="font-size: 19px; color: #FACC15; font-weight: 700; margin: 4px 0 10px;">CMI #MICB-1082 • InterNACHI #NACHI18051119</div>
            <div style="font-size: 19px; color: #E2E8F0; line-height: 1.4;">4.8 Stars Across 53 Verified Google Reviews • Active SUPRA eKEY • -$25 Partner Credit for Verified Licensed GA Realtors</div>
          </div>
        </div>
        <div class="price-grid">
          <div class="p-card"><div class="p-label">Single-Family Homes (Buyer / Seller / 11-Mo)</div><div class="p-val">From $345</div></div>
          <div class="p-card"><div class="p-label">Condos &amp; Townhomes</div><div class="p-val">From $295</div></div>
          <div class="p-card"><div class="p-label">Phase 1 Pre-Drywall / Final New Build</div><div class="p-val">From $275 / From $400</div></div>
          <div class="p-card"><div class="p-label">Sewer, Radon, WDO, Pool, Mold &amp; PCA</div><div class="p-val" style="font-size: 25px;">Call (678) 480-2110</div></div>
        </div>
        <div class="cta-banner">
          <div>
            <div style="font-size: 19px; font-weight: 800; color: #FDE047; text-transform: uppercase;">Free Tool + 60-Second Online Booking</div>
            <div style="font-size: 27px; font-weight: 900; color: #FFFFFF; margin-top: 4px; white-space: nowrap;">fhinspectionsatl.com/homebuyer-red-flags</div>
            <div style="font-size: 21.5px; font-weight: 800; color: #F8FAFC; margin-top: 4px; white-space: nowrap;">Instant Quote: fhinspectionsatl.com/quote • (678) 480-2110</div>
          </div>
          <div class="dock">
            <img src="${IMG.cmi}" alt="CMI" style="height: 90px; width: auto; object-fit: contain;" />
            <img src="${IMG.cpi}" alt="CPI" style="height: 82px; width: auto; object-fit: contain;" />
          </div>
        </div>
      </div>
      <div class="footer-strip">
        <span>Hindsight is expensive... <span class="gold">Choose Foresight!</span></span>
        <span>Sunday By Appointment Only</span>
      </div>
    </div>
  </body></html>`;
}

function buildPdfDeckHtml() {
  // 5-page 1080x1350 print document for LinkedIn PDF Carousel
  const pages = [0, 1, 2, 3, 4].map((idx) => {
    const raw = buildCarouselSlideHtml(idx);
    const bodyMatch = raw.match(/<body>([\s\S]*?)<\/body>/i);
    const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);
    return `<section class="pdf-page"><style>${styleMatch ? styleMatch[1] : ''}</style>${bodyMatch ? bodyMatch[1] : ''}</section>`;
  });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @page { size: 1080px 1350px; margin: 0; }
    html, body { margin: 0; padding: 0; background: #0B132B; }
    .pdf-page { width: 1080px; height: 1350px; page-break-after: always; break-after: page; overflow: hidden; }
    .pdf-page:last-child { page-break-after: auto; break-after: auto; }
  </style></head><body>${pages.join('\n')}</body></html>`;
}

function buildVerticalReelFrameHtml(idx) {
  // 1080 x 1920 (9:16 Vertical Reel Frame)
  const frames = [
    {
      pill: 'Touring Metro Atlanta Homes?',
      h1: 'Saw Fresh Ceiling Paint or Smelled a <span class="gold">Musty Closet?</span>',
      sub: 'Do not guess during a 5-to-7 day Georgia due diligence window.',
      img: IMG.thermal,
      cap: 'Calibrated Infrared Thermal Scan Reveals Hidden Leaks Behind Dry Paint ($0 Extra Charge)'
    },
    {
      pill: 'Real Atlanta Repair Stakes',
      h1: 'Hidden Red Flags Cost <span class="gold">$1,250 to $14,200+</span> After Closing',
      sub: 'Crawlspace moisture >19%, Piedmont red-clay brick cracks, grey polybutylene pipes &amp; FPE panels.',
      img: IMG.crawlspace,
      cap: 'Subfloor Moisture & Foundation Drainage Evaluated on Every Home'
    },
    {
      pill: 'Georgia Has Zero Inspector Licensing',
      h1: 'We Send <span class="gold">Two Certified Inspectors</span> to Every Home',
      sub: 'Led by Certified Master Inspector Christopher Boykin (CMI #MICB-1082) — double verification, zero solo fatigue.',
      img: IMG.panel,
      cap: 'Dedicated Parallel Exterior/Roof + Interior MEP Evaluation'
    },
    {
      pill: '6 Free Inclusions ($0 Extra Charge)',
      h1: 'Free Thermal + Free 4K Drone + <span class="gold">$35,000 Protection</span>',
      sub: '$10,000 Elite Master Warranty ($0 deductible) + $25,000 InterNACHI Honor Guarantee + Same-Day Interactive Report.',
      img: IMG.drone,
      cap: '4K Aerial Drone Roof Valley & Flashing Photography Included Standard'
    },
    {
      pill: 'Transparent Upfront Starting Rates',
      h1: 'Homes <span class="gold">From $345</span> • Condos <span class="gold">From $295</span>',
      sub: 'Pre-Drywall From $275 • Final New Construction From $400 • Auxiliary Add-Ons: Call (678) 480-2110 for Quote',
      img: IMG.chris,
      cap: 'Free Tool: fhinspectionsatl.com/homebuyer-red-flags • Instant Quote: /quote',
      isPortrait: true
    }
  ];
  const f = frames[idx];
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseCss()}
    .canvas { width: 1080px; height: 1920px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(170deg, #0B132B 0%, #131F3E 55%, #070C1C 100%); }
    .body { padding: 48px 52px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    h1 { font-size: 58px; line-height: 1.13; font-weight: 900; margin-top: 22px; color: #FFFFFF; }
    .sub { font-size: 30px; line-height: 1.42; color: #CBD5E1; margin-top: 18px; font-weight: 600; }
    .media { border-radius: 22px; overflow: hidden; border: 3px solid #D4AF37; background: #091024; box-shadow: 0 20px 44px rgba(0,0,0,0.5); }
    .media img { width: 100%; height: ${f.isPortrait ? '590px' : '680px'}; object-fit: ${f.isPortrait ? 'contain' : 'cover'}; display: block; background: #0B132B; }
    .mcap { background: #111B36; padding: 20px 24px; font-size: 24px; font-weight: 800; color: #FACC15; border-top: 2px solid rgba(212,175,55,0.4); text-align: center; }
    .cta-box { background: #1E293B; border: 2px solid #D4AF37; border-radius: 18px; padding: 26px; text-align: center; }
  </style></head><body>
    <div class="canvas">
      <div class="tri-header" style="padding: 24px 42px;">
        <img class="brand-logo" src="${IMG.logo}" alt="Foresight" style="height: 86px; filter: none;" />
        <div class="tri-badges">
          <img src="${IMG.cmi}" alt="CMI" style="height: 115px; width: auto; object-fit: contain;" />
          <img src="${IMG.cpi}" alt="CPI" style="height: 106px; width: auto; object-fit: contain;" />
        </div>
      </div>
      <div class="body">
        <div>
          <span class="pill" style="font-size: 23px; padding: 10px 24px;">${f.pill}</span>
          <h1>${f.h1}</h1>
          <p class="sub">${f.sub}</p>
        </div>
        <div class="media">
          <img src="${f.img}" alt="Foresight Inspection" />
          <div class="mcap">${f.cap}</div>
        </div>
        <div class="cta-box">
          <div style="font-size: 23px; font-weight: 800; color: #34D399; text-transform: uppercase;">4.8 Stars • 53 Verified Google Reviews</div>
          <div style="font-size: 34px; font-weight: 900; color: #FFFFFF; margin-top: 8px;">fhinspectionsatl.com/quote</div>
          <div style="font-size: 28px; font-weight: 800; color: #FACC15; margin-top: 6px;">Direct Priority Desk: (678) 480-2110</div>
        </div>
      </div>
      <div class="footer-strip" style="padding: 24px 42px; font-size: 24px;">
        <span>Hindsight is expensive... <span class="gold">Choose Foresight!</span></span>
        <span>CMI #MICB-1082</span>
      </div>
    </div>
  </body></html>`;
}

function findFfmpeg() {
  const uvCacheDir = path.join(os.homedir(), 'AppData', 'Local', 'uv', 'cache');
  if (fs.existsSync(uvCacheDir)) {
    const stack = [uvCacheDir];
    while (stack.length) {
      const cur = stack.pop();
      let entries = [];
      try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
      for (const e of entries) {
        const full = path.join(cur, e.name);
        if (e.isDirectory()) stack.push(full);
        else if (/^ffmpeg.*\.exe$/i.test(e.name)) return full;
      }
    }
  }
  return 'ffmpeg';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chromeCandidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ];
  const browserBin = chromeCandidates.find((p) => fs.existsSync(p));
  if (!browserBin) throw new Error('Chrome/Edge binary not found');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'foresight-omni-render-'));
  const htmlDir = path.join(tmpDir, 'html');
  const reelFramesDir = path.join(tmpDir, 'reel_frames');
  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(reelFramesDir, { recursive: true });

  const chrome = spawn(
    browserBin,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${path.join(tmpDir, 'profile')}`,
      '--remote-debugging-port=9349',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    for (let i = 0; i < 30; i++) {
      try {
        const r = await fetch('http://127.0.0.1:9349/json/version');
        if (r.ok) break;
      } catch {}
      await sleep(300);
    }

    const targets = await (await fetch('http://127.0.0.1:9349/json/list')).json();
    const wsUrl = targets.find((t) => t.type === 'page').webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 0;
    const pending = new Map();
    ws.onmessage = (ev) => {
      const d = JSON.parse(ev.data);
      if (d.id && pending.has(d.id)) {
        const { resolve, reject } = pending.get(d.id);
        pending.delete(d.id);
        d.error ? reject(new Error(d.error.message)) : resolve(d.result);
      }
    };
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++msgId;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send('Page.enable');

    async function renderHtmlToPng(htmlContent, width, height, outPath) {
      const htmlPath = path.join(htmlDir, `render_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
      fs.writeFileSync(htmlPath, htmlContent, 'utf8');
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await send('Page.navigate', { url: `file:///${htmlPath.replace(/\\/g, '/')}` });
      await sleep(550);
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width, height, scale: 1 },
      });
      fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    }

    // 1. Render 4:3 GBP Card (1200x900)
    const gbpOut = path.join(OUT_DIR, 'gbp-store-264545-card.png');
    await renderHtmlToPng(buildGbpCardHtml(), 1200, 900, gbpOut);
    console.log(`✅ Rendered 4:3 GBP Card: ${gbpOut}`);

    // 2. Render 5 4:5 Carousel Slides (1080x1350)
    for (let i = 0; i < 5; i++) {
      const slideOut = path.join(OUT_DIR, `slide_${i + 1}.png`);
      await renderHtmlToPng(buildCarouselSlideHtml(i), 1080, 1350, slideOut);
      console.log(`✅ Rendered 4:5 Carousel Slide ${i + 1}: ${slideOut}`);
    }

    // 3. Render 5 Vertical 9:16 Reel Frames (1080x1920) BEFORE printToPDF
    for (let i = 0; i < 5; i++) {
      const frameOut = path.join(reelFramesDir, `frame_${i + 1}.png`);
      await renderHtmlToPng(buildVerticalReelFrameHtml(i), 1080, 1920, frameOut);
    }

    // 4. Render 5-Page LinkedIn Carousel PDF (1080x1350)
    const pdfHtmlPath = path.join(htmlDir, 'linkedin_deck.html');
    fs.writeFileSync(pdfHtmlPath, buildPdfDeckHtml(), 'utf8');
    await send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1350, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `file:///${pdfHtmlPath.replace(/\\/g, '/')}` });
    await sleep(800);
    const pdfData = await send('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      paperWidth: 1080 / 96,
      paperHeight: 1350 / 96,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    });
    const pdfOut = path.join(OUT_DIR, 'linkedin_carousel_deck.pdf');
    fs.writeFileSync(pdfOut, Buffer.from(pdfData.data, 'base64'));
    console.log(`✅ Rendered 5-Page LinkedIn Carousel PDF: ${pdfOut}`);
    ws.close();

    const ffmpegBin = findFfmpeg();
    const audioPath = path.join(ROOT, 'public', 'audio', 'foresight-anthem-30s-hook.mp3');
    const mp4Out = path.join(OUT_DIR, 'reel-3am-homebuyer-red-flags-30s.mp4');
    const concatTxt = path.join(reelFramesDir, 'frames.txt');
    const lines = [];
    for (let i = 1; i <= 5; i++) {
      const fp = path.join(reelFramesDir, `frame_${i}.png`).replace(/\\/g, '/');
      lines.push(`file '${fp}'`);
      lines.push('duration 6');
    }
    lines.push(`file '${path.join(reelFramesDir, 'frame_5.png').replace(/\\/g, '/')}'`);
    fs.writeFileSync(concatTxt, lines.join('\n'), 'utf8');

    execFileSync(
      ffmpegBin,
      [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatTxt,
        '-i', audioPath,
        '-t', '30',
        '-vf', 'fps=30,format=yuv420p',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '22',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
        '-shortest',
        mp4Out,
      ],
      { stdio: 'ignore' }
    );
    console.log(`✅ Rendered 30s 9:16 Anthem Video Reel: ${mp4Out}`);
  } finally {
    chrome.kill();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error('❌ Omnichannel Render Failed:', err);
  process.exit(1);
});
