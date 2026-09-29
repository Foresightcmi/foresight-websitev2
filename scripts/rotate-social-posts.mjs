import fs from 'fs';
import path from 'path';
import { dispatchSocialPost } from './publish-social-webhook.mjs';

/**
 * Foresight Home Inspections - Luxury Social Rotation Engine
 * Cycles through 8 high-converting, brand-aligned posts for Facebook & Instagram.
 * Fully synchronized with official website branding:
 * - Two Certified Inspectors on Every Job
 * - Certified Master Inspector® (CMI) Leadership
 * - Free FLIR® Thermal Infrared + Free 4K Drone Scans
 * - Up to $35,000 Combined Warranty & Guarantee Protection ($0 Deductible)
 * - Zero Asterisks & Exact Fee Schedule Synchronization
 */

const POSTS_QUEUE = [
  {
    id: 1,
    title: 'The Two-Inspector Difference',
    message: `Why settle for one set of eyes when you can have two? 👥✨

Imagine waiting 4 to 5 exhausting hours while a solo inspector walks a 3,500 sq. ft. home alone with a clipboard... ⏳

In real estate, your due diligence window is strictly ticking, and your time is valuable.

That’s why Foresight Home Inspections deploys Two Certified Inspectors on Every Single Job:

👥 Double the Scrutiny: One inspector thoroughly evaluates the roof, exterior grading, foundation, and crawlspace, while the second audits electrical panels, mechanicals, plumbing fixtures, and attic insulation simultaneously.
⚡ Half the On-Site Time: Comprehensive 1,600-point InterNACHI SOP evaluations completed in 1.5 to 2.5 hours—with same-day digital reporting.
🔥 FLIR® Thermal Infrared & 4K Aerial Drones Included FREE: Zero extra fees for the advanced diagnostic technology that protects your investment.
🛡️ Up to $35,000 in Warranty Protection: Every full inspection includes our $10,000 Elite Master Inspection Warranty ($0 deductible) plus InterNACHI’s $25,000 Honor Guarantee.

Led by board-certified Certified Master Inspector® Christopher Boykin.

"Hindsight is expensive... Choose Foresight!"

📍 Serving Metro Atlanta & 87+ Georgia Cities Across 20 Counties.
👉 Get your instant price & book online 24/7 in 60 seconds:
https://www.fhinspectionsatl.com/quote

#AtlantaRealEstate #HomeInspection #CertifiedMasterInspector #ForesightHomeInspections #MetroAtlantaHomes #HomeBuyerTips`,
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: 'https://www.fhinspectionsatl.com/images/two-inspectors-electrical-panel-inspection.jpg',
  },
  {
    id: 2,
    title: 'What the Naked Eye Misses (FLIR® Thermal Scan)',
    message: `The ceiling in this Metro Atlanta home looked pristine, freshly painted, and completely dry to the naked eye... 💧👀

Look what appeared when we powered on our FLIR® high-resolution radiometric infrared camera: an active, concealed plumbing leak pooling behind the drywall beneath the second-floor master bath.

If you hired a discount inspector with just a flashlight, you would have closed on this property and inherited thousands of dollars in structural wood rot and toxic mold remediation behind your walls.

At Foresight Home Inspections:
✅ FLIR® Thermal Infrared Imaging is included standard on EVERY full inspection at $0 extra charge. We never nickel-and-dime you for the diagnostics that protect your equity.
✅ Two Certified Inspectors on every job.
✅ Up to $35,000 in Combined Warranty & Guarantee Protection included ($0 deductible).

"Hindsight is expensive... Choose Foresight!"

Tag someone buying a home in Georgia right now! 👇
👉 Calculate your instant quote online: https://www.fhinspectionsatl.com/quote
📞 Direct CMI Hotline: (678) 480-2110

#ThermalImaging #FLIR #BuildingScience #AtlantaHomeBuyer #HomeInspectionFail #ForesightHomeInspections`,
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: 'https://www.fhinspectionsatl.com/images/thermal-ceiling.png',
  },
  {
    id: 3,
    title: 'The Georgia Red Clay Crawlspace Nightmare',
    message: `Why are Georgia crawlspaces notorious for concealed structural damage? Two words: Red Clay. 🧱

Metro Atlanta’s high-plasticity clay soil acts like an underground sponge, trapping thousands of gallons of hydrostatic groundwater right against your home’s foundation footings.

During our inspections across Fulton, DeKalb, Cobb, and Gwinnett, our two-inspector team frequently discovers:
⚠️ Missing or torn vapor barriers allowing ground moisture to rot subflooring and joists
⚠️ Relative humidity exceeding 70%—the exact scientific threshold for wood-destroying fungal mycelium bloom
⚠️ Foundation block step-cracking caused by expanding Georgia clay pressure
⚠️ Subterranean termite mud tubes bridging directly from clay soil into floor framing

Don't buy a house without knowing what lies beneath your floorboards. Our dual-inspector team traverses every accessible inch of the crawlspace with electronic moisture meters and FLIR thermal cameras.

"Hindsight is expensive... Choose Foresight!"

📖 Read our Georgia Crawlspace Building Science Study:
https://www.fhinspectionsatl.com/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations
👉 Book your inspection online 24/7: https://www.fhinspectionsatl.com/quote

#GeorgiaRealEstate #CrawlspaceMoisture #BuildingScience #AtlantaHomeInspector #RedClay #ForesightHomeInspections`,
    link: 'https://www.fhinspectionsatl.com/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations',
    imageUrl: 'https://www.fhinspectionsatl.com/images/crawlspace.png',
  },
  {
    id: 4,
    title: 'Realtor VIP Partner Spotlight',
    message: `Dear Metro Atlanta Realtors: Does this sound familiar? 🤦‍♂️

You get an inspection report back that reads like an alarmist horror novel—filled with confusing red text, vague warnings, and dramatic statements that needlessly terrify your first-time buyers and derail your contract.

At Foresight Home Inspections, we partner with top-producing agents across Metro Atlanta with a modern, professional philosophy:

1️⃣ Objective Building Science: We clearly distinguish between true structural/safety hazards vs. routine deferred maintenance, so your clients stay calm and informed.
2️⃣ SUPRA® eKEY Integrated: We carry active electronic lockbox access across Metro Atlanta boards—you don't have to spend your Saturday waiting around on-site.
3️⃣ Two Inspectors = Faster Appointments: We cut on-site time from 4+ hours down to 1.5–2.5 hours, minimizing seller disruption, and deliver digital reports within 24 hours.
4️⃣ 1-Click GAR Repair Request Builder: Easily convert report findings into official Georgia Association of REALTORS® (GAR) Form F404 amendment language in seconds.
5️⃣ $10,000 Elite Warranty Protection Included: Zero-deductible coverage that shields both the buyer and your transaction after closing.

Elevate your client experience with board-certified Certified Master Inspector® Christopher Boykin.

🤝 Join the Foresight Realtor VIP Partner Network:
https://www.fhinspectionsatl.com/realtors

#AtlantaRealtors #GeorgiaRealEstate #RealtorLife #TopProducerAtlanta #ForesightRealtorVIP`,
    link: 'https://www.fhinspectionsatl.com/realtors',
    imageUrl: 'https://www.fhinspectionsatl.com/images/Christopher_Boykin.webp',
  },
  {
    id: 5,
    title: 'EPA Radon Zone 1 Granite Bedrock Warning',
    message: `Radon gas doesn't care if a house is 50 years old or a brand-new custom build completed yesterday. ☢️

Because North Metro Atlanta sits directly on a subterranean granite bedrock formation (the Georgia Piedmont belt), the EPA designates Fulton, DeKalb, Gwinnett, Cobb, Cherokee, and Forsyth counties in Radon Zone 1—the highest risk classification in the nation:

• Completely odorless, tasteless, and invisible radioactive gas.
• The #1 leading cause of lung cancer among non-smokers in the United States.
• The EPA urges continuous electronic testing for EVERY residential real estate transaction in Georgia.

Foresight Home Inspections deploys calibrated continuous 48-hour electronic CRM radon monitors that capture hourly air samples, delivering an indisputable lab-grade report during your due diligence window ($250 flat rate).

Protect your family's health and negotiate seller mitigation credits before closing.

"Hindsight is expensive... Choose Foresight!"

👉 Learn more & book your radon test:
https://www.fhinspectionsatl.com/services/radon-testing/atlanta

#RadonTesting #EPAZone1 #AtlantaHealth #AtlantaHomes #BuildingScience #ForesightHomeInspections`,
    link: 'https://www.fhinspectionsatl.com/services/radon-testing/atlanta',
    imageUrl: 'https://www.fhinspectionsatl.com/images/luxury-home.webp',
  },
  {
    id: 6,
    title: 'The $35,000 Combined Warranty Advantage',
    message: `What happens if your primary air conditioner fails or a roof leak manifests 30 days after you move in? 🏠💔

Most solo inspectors simply point to their contract disclaimer and say: "Sorry, it was working on the day of the inspection."

Not Foresight. Because Christopher Boykin holds the board-certified Certified Master Inspector® (CMI) designation—the top 1% in North America—every full inspection includes Up to $35,000 in Combined Warranty & Guarantee Protection:

🛡️ $10,000 Elite Master Inspection Warranty ($0 Deductible):
• 90 Days of coverage after closing (or 120 days from inspection).
• Covers major appliances, HVAC heating/cooling, electrical service, plumbing supply/drains, and structural framing.
• Includes up to $1,000 for roof leak repair and $2,250 for mold remediation.
🛡️ InterNACHI® $25,000 Honor Guarantee:
• Complete peace of mind backing our inspector's integrity and ethics.

While solo discount operators carry zero warranty, Foresight backs every evaluation with real financial security.

"Hindsight is expensive... Choose Foresight!"

👉 Calculate your transparent quote in 60 seconds:
https://www.fhinspectionsatl.com/quote

#HomeWarranty #CertifiedMasterInspector #AtlantaHomeowner #BuyerProtection #ForesightDifference`,
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: 'https://www.fhinspectionsatl.com/images/internachi_inspection_warranty_card.webp',
  },
  {
    id: 7,
    title: 'New Construction & 11-Month Builder Warranty Alert',
    message: `Did you buy a new construction home in Metro Atlanta over the past 11 months? 🚨

Your builder’s 1-year comprehensive warranty is ticking down to the final days. Once that 12-month anniversary passes, the builder is legally off the hook—and every hidden defect becomes your out-of-pocket financial liability.

Georgia building science data proves that first-year homes routinely develop:
⚠️ Roof shingle nail pops and compromised chimney/plumbing flashings
⚠️ Attic truss uplift cracking drywall seams
⚠️ Negative exterior grading causing rainwater to pool against foundation walls
⚠️ Unbalanced HVAC duct dampers leaving master bedrooms overheated

A Foresight 11-Month Builder Warranty Inspection (from $335) gives you an independent, Certified Master Inspector photo punch list ready to upload directly into your builder's warranty portal.

On average, our clients save $1,500 to $4,500 in builder-paid repairs before warranty expiration!

"Hindsight is expensive... Choose Foresight!"

👉 Book your 11-Month Warranty Inspection today:
https://www.fhinspectionsatl.com/services/11-month-warranty-inspection/atlanta
📞 Direct CMI Phone: (678) 480-2110

#NewConstructionAtlanta #BuilderWarranty #11MonthWarranty #AtlantaSuburbs #NewHomeowner`,
    link: 'https://www.fhinspectionsatl.com/services/11-month-warranty-inspection/atlanta',
    imageUrl: 'https://www.fhinspectionsatl.com/images/roof-1.webp',
  },
  {
    id: 8,
    title: '4K Drone Aerial Roof Scans Included Free',
    message: `When a solo inspector arrives at a steep 2-story roof in Atlanta, what happens? 🚁👀

Most inspectors mark the roof section as "Viewed from ground with binoculars" or "Too steep to inspect safely", leaving you completely blind to damaged architectural shingles, missing valley flashings, and cracked plumbing boots.

At Foresight Home Inspections:
✅ FAA Part 107 Commercial Drone Aerial Scans are INCLUDED FREE on every full inspection.
✅ We capture 4K ultra-high-definition imaging of every roof plane, chimney cap, and plumbing penetration.
✅ Two Certified Inspectors on every job.
✅ Up to $35,000 in Combined Warranty & Guarantee Protection included ($0 deductible).

Don’t buy a home with an uninspected roof. Choose the technology and thoroughness your investment deserves.

"Hindsight is expensive... Choose Foresight!"

👉 Get your instant price online 24/7:
https://www.fhinspectionsatl.com/quote

#DroneRoofInspection #FAAPart107 #AtlantaHomeInspection #RoofingInspection #CertifiedMasterInspector #ForesightHomeInspections`,
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: 'https://www.fhinspectionsatl.com/images/drone-2.webp',
  }
];

const STATE_FILE = path.resolve(process.cwd(), 'data', 'social-logs', 'rotation-state.json');

export async function runNextSocialPost() {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let state = { nextIndex: 0 };
  if (fs.existsSync(STATE_FILE)) {
    try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch {}
  }

  const postIndex = state.nextIndex % POSTS_QUEUE.length;
  const post = POSTS_QUEUE[postIndex];

  console.log(`Executing Social Post #${post.id}: "${post.title}"...`);
  const result = await dispatchSocialPost(post);

  state.nextIndex = (postIndex + 1) % POSTS_QUEUE.length;
  state.lastPublishedAt = new Date().toISOString();
  state.lastPostId = post.id;
  state.lastTitle = post.title;

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');

  console.log(`Success! Next scheduled post will be Post #${POSTS_QUEUE[state.nextIndex].id}: "${POSTS_QUEUE[state.nextIndex].title}"`);
  return result;
}

if (process.argv[1]?.includes('rotate-social-posts.mjs')) {
  runNextSocialPost().catch(err => {
    console.error('Fatal rotation error:', err);
    process.exit(1);
  });
}
