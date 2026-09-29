import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Foresight Home Inspections - 9:16 Vertical Video Synthesis Engine
 * Transcodes raw on-site defect videos into luxury branded 1080x1920 TikTok & Instagram Reels.
 * Uses local ffmpeg with zero external API costs.
 */

const REELS_DATA = [
  {
    id: 1,
    title: 'SPLIT DECK POST DEFECT',
    subhead: 'NEW BUILD STRUCTURAL FAIL',
    inputFile: 'public/sample-report/m1.mp4',
    outputFile: 'public/social/reels/reel-1-split-deck-post.mp4',
    hook: 'If your builder told you this cracked support post was just "normal settling", watch this...',
    caption: `If your builder told you this cracked deck post was just "cosmetic settling", don't sign that closing disclosure! 🚫👀

During a new construction inspection in Metro Atlanta, our two-inspector team found this load-bearing deck support post severely split through the center grain. Under wind loads and heavy deck occupancy, this can lead to catastrophic structural shear failure.

Most solo inspectors rushing through a 4-hour checklist glance at the deck from 20 feet away. At Foresight, Two Certified Inspectors evaluate every inch of the structure simultaneously.

🛡️ Up to $35,000 in Combined Warranty & Guarantee Protection included ($0 deductible).
🔥 FLIR® Thermal + 4K Drone Scans included standard.

"Hindsight is expensive... Choose Foresight!"

👉 Tap the link in bio for instant pricing & our Georgia Property Risk Scanner:
https://www.fhinspectionsatl.com/bio

#HomeInspectionFail #AtlantaHomes #NewConstructionAtlanta #BuilderWarranty #DeckSafety #CertifiedMasterInspector #ForesightHomeInspections`,
  },
  {
    id: 2,
    title: 'ELECTRICAL HAZARD DETECTED',
    subhead: 'FLIPPED HOME FIRE RISK',
    inputFile: 'public/sample-report/m2.mp4',
    outputFile: 'public/social/reels/reel-2-electrical-hazard.mp4',
    hook: 'The fresh flip looked modern on Zillow... until we took off the electrical panel cover.',
    caption: `The kitchen looked gorgeous on Zillow with modern quartz countertops, but look what happened when we took off the electrical panel cover... ⚡🚨

Concealed double-tapped breakers, ungrounded circuits, and scorched neutral wiring behind fresh drywall. In Metro Atlanta, quick cosmetic flips frequently skip licensed electrical permits to save cash.

Don't buy a fire hazard. Foresight Home Inspections puts Two Certified Inspectors on every job with infrared thermal panel diagnostics included at $0 extra charge.

🛡️ $10,000 Elite Master Warranty ($0 deductible) + $25,000 InterNACHI Honor Guarantee.

"Hindsight is expensive... Choose Foresight!"

👉 Tap link in bio for our instant 60-second price quote:
https://www.fhinspectionsatl.com/bio

#ElectricalSafety #FlippedHomeFail #AtlantaRealEstate #HomeInspection #BuildingScience #AtlantaHomeBuyer #ForesightDifference`,
  },
  {
    id: 3,
    title: 'AC CONDENSATION CEILING LEAK',
    subhead: 'ATTIC HVAC DRAIN TRAP',
    inputFile: 'public/sample-report/m3.mp4',
    outputFile: 'public/social/reels/reel-3-hvac-leak-hazard.mp4',
    hook: 'A clogged $5 PVC pipe in this Atlanta attic was 48 hours away from collapsing the master ceiling.',
    caption: `A clogged $5 drain pipe in this attic was literally 48 hours away from dumping 50 gallons of water through the master bedroom ceiling... 💧⚠️

In Georgia’s brutal 95°F summer humidity, your air conditioner extracts dozens of gallons of atmospheric moisture daily. When the primary condensate line clogs with algae and the secondary float switch is improperly wired, water overflows directly onto ceiling drywall.

We caught this before closing. The buyer negotiated a full HVAC overhaul paid by the seller.

"Hindsight is expensive... Choose Foresight!"

👉 Tap link in bio to book your inspection online 24/7:
https://www.fhinspectionsatl.com/bio

#HVACfail #AtticInspection #AtlantaHomes #BuildingScience #HomeInspectorLife #CertifiedMasterInspector`,
  },
  {
    id: 4,
    title: 'HIDDEN PLUMBING LEAK REVEAL',
    subhead: 'CONCEALED WALL MOISTURE',
    inputFile: 'public/sample-report/m4.mp4',
    outputFile: 'public/social/reels/reel-4-plumbing-leak-reveal.mp4',
    hook: 'To the naked eye, this bathroom wall looked dry and freshly painted. Here is what we found...',
    caption: `Drywall looked 100% dry and freshly painted to the naked eye... 💧👀

Then we ran the plumbing and engaged our high-resolution FLIR® thermal camera. An active pinhole copper leak was pooling inside the wall cavity, rotting the baseplate studs.

Solo discount inspectors with just a flashlight would have walked right past this. Foresight includes FLIR® thermal imaging standard on every full home inspection at $0 extra cost.

Two Certified Inspectors on every job. Up to $35,000 in Combined Warranty Protection.

"Hindsight is expensive... Choose Foresight!"

👉 Tap the link in bio to calculate your instant price:
https://www.fhinspectionsatl.com/bio

#PlumbingLeak #ThermalImaging #FLIR #AtlantaHomeInspection #BuildingScience #ForesightHomeInspections`,
  },
  {
    id: 5,
    title: 'UNSTABLE DECK RAILING HAZARD',
    subhead: 'SERIOUS FALL SAFETY DEFECT',
    inputFile: 'public/sample-report/m5.mp4',
    outputFile: 'public/social/reels/reel-5-deck-railing-safety.mp4',
    hook: 'Would you let your kids lean against this 15-foot high deck railing in Atlanta?',
    caption: `Would you let your kids or guests lean against this 15-foot high deck railing? 🚨😱

InterNACHI Standards of Practice require all guardrails to withstand a minimum 200-lb concentrated load. This entire railing assembly was fastened with inappropriate drywall screws instead of structural through-bolts. One firm push and it collapses into the yard below.

Our dual-inspector team tests every guardrail, stair tread, and ledger connection so your family stays safe.

🛡️ Up to $35,000 in Combined Warranty & Guarantee Protection included ($0 deductible).

"Hindsight is expensive... Choose Foresight!"

👉 Tap link in bio to read our 5-star Google reviews and book online:
https://www.fhinspectionsatl.com/bio

#DeckSafety #HomeSafety #AtlantaHomeowner #HomeInspection #CertifiedMasterInspector #ForesightHomeInspections`,
  },
];

export function renderReels() {
  const outputDir = path.resolve(process.cwd(), 'public', 'social', 'reels');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const catalog = [];

  for (const reel of REELS_DATA) {
    const inputPath = path.resolve(process.cwd(), reel.inputFile);
    const outputPath = path.resolve(process.cwd(), reel.outputFile);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Input file missing: ${inputPath}, skipping...`);
      continue;
    }

    console.log(`\n🎬 Rendering Reel #${reel.id}: "${reel.title}"...`);

    // FFmpeg filter:
    // 1. Scale video to 1080:608
    // 2. Pad to 1080:1920 with deep dark blue background 0x0B132B
    // 3. Draw text header and footers with brand colors
    const fontBd = "C\\:/Windows/Fonts/arialbd.ttf";
    const fontReg = "C\\:/Windows/Fonts/arial.ttf";

    const vf = [
      `scale=1080:608`,
      `pad=1080:1920:0:656:color=0x0B132B`,
      `drawtext=fontfile='${fontBd}':text='FORESIGHT HOME INSPECTIONS':fontcolor=0xF59E0B:fontsize=44:x=(w-text_w)/2:y=230`,
      `drawtext=fontfile='${fontBd}':text='${reel.title}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=310`,
      `drawtext=fontfile='${fontReg}':text='${reel.subhead}':fontcolor=0x94A3B8:fontsize=26:x=(w-text_w)/2:y=380`,
      `drawtext=fontfile='${fontBd}':text='Two Certified Inspectors On Every Job':fontcolor=0xF59E0B:fontsize=36:x=(w-text_w)/2:y=1380`,
      `drawtext=fontfile='${fontReg}':text='Up to $35,000 Combined Warranty Protection':fontcolor=0x34D399:fontsize=30:x=(w-text_w)/2:y=1450`,
      `drawtext=fontfile='${fontReg}':text='Hindsight is expensive... Choose Foresight!':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=1520`,
      `drawtext=fontfile='${fontBd}':text='Tap Link in Bio for Instant Quote':fontcolor=0x60A5FA:fontsize=34:x=(w-text_w)/2:y=1610`,
    ].join(',');

    const cmd = `ffmpeg -y -i "${inputPath}" -vf "${vf}" -c:a copy -c:v libx264 -crf 22 -preset fast "${outputPath}"`;

    try {
      execSync(cmd, { stdio: 'ignore' });
      console.log(`✅ Successfully generated: ${reel.outputFile}`);
      catalog.push({
        id: reel.id,
        title: reel.title,
        subhead: reel.subhead,
        hook: reel.hook,
        caption: reel.caption,
        videoUrl: `https://www.fhinspectionsatl.com/social/reels/${path.basename(reel.outputFile)}`,
        localPath: reel.outputFile,
      });
    } catch (err) {
      console.error(`❌ Failed to render Reel #${reel.id}:`, err.message);
    }
  }

  const catalogPath = path.join(outputDir, 'reels-catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`\n🎉 Reels generation complete! Catalog saved to ${catalogPath}`);
}

if (process.argv[1]?.includes('render-social-clips.mjs')) {
  renderReels();
}
