import fs from 'fs';
import path from 'path';
import { dispatchSocialPost } from './publish-social-webhook.mjs';

/**
 * Weekly Social Post Rotation Engine
 * Cycles through our 8 high-converting strategic posts for Facebook & Instagram.
 * Automatically scheduled to run Tuesdays and Fridays.
 */

const POSTS_QUEUE = [
  {
    id: 1,
    title: 'The Two-Inspector Story',
    message: 'Imagine waiting 4 to 5 hours while a solo home inspector checks a 3,500 sq. ft. house with a clipboard... ⏳\n\nIn real estate, your due diligence period is ticking, and your time is valuable.\n\nThat’s why Foresight Home Inspections deploys two certified inspectors on every single job:\n\n✅ Double Verification: Two sets of trained eyes auditing roof, electrical, plumbing, crawlspace & HVAC simultaneously.\n⚡ Cut On-Site Time in Half: Comprehensive 400+ point checks in 1.5 to 2.5 hours with same-day digital reports.\n🛡️ $10,000 Elite Warranty Included: Zero deductible protection for 90 days after closing.\n\nBuying in Metro Atlanta? Don’t settle for a solo inspector.\n👉 Get your instant quote in 60 seconds: https://www.fhinspectionsatl.com/quote\n\n#AtlantaRealEstate #HomeInspection #CertifiedMasterInspector #ForesightHomeInspections',
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: 'https://www.fhinspectionsatl.com/images/two-inspectors-electrical-panel-inspection.jpg',
  },
  {
    id: 2,
    title: 'What the Naked Eye Misses (FLIR Thermal Scan)',
    message: 'The wall looked completely normal, dry, and freshly painted... until we turned on our FLIR infrared thermal camera. 💧👀\n\nLook what appeared: an active plumbing leak hidden behind the drywall beneath the second-floor shower.\n\nWith just a flashlight, you would have closed on this property and inherited thousands in structural water damage and mold remediation.\n\nAt Foresight Home Inspections, high-resolution thermal imaging is included with every inspection at $0 extra charge. We don\'t believe in nickel-and-diming you for the technology that protects your investment.\n\n"Hindsight is expensive... Choose Foresight!"\n\nSchedule your inspection: https://www.fhinspectionsatl.com/quote\n\n#ThermalImaging #HomeInspectionTips #AtlantaHomeBuyer #FLIR #ForesightInspections',
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: 'https://www.fhinspectionsatl.com/images/thermal-imaging-inspection.jpg',
  },
  {
    id: 3,
    title: 'Georgia Red Clay & Crawlspace Moisture',
    message: 'Why are Georgia crawlspaces so notorious? Two words: Red Clay. 🧱\n\nMetro Atlanta’s heavy clay soil acts like a sponge, holding gallons of groundwater right against your home\'s foundation. During our inspections across Fulton, DeKalb, Cobb, and Gwinnett, we frequently see:\n\n⚠️ Missing vapor barriers allowing ground humidity to rot floor joists\n⚠️ Standing groundwater creating the perfect nursery for mold\n⚠️ Foundation settlement caused by expanding red clay\n\nDon’t buy a home without knowing what lies beneath your floorboards. Our dual-inspector team crawls every accessible inch.\n\nRead our full building science study: https://www.fhinspectionsatl.com/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations\n\n#GeorgiaRealEstate #CrawlspaceMoisture #HomeMaintenance #AtlantaInspectors',
    link: 'https://www.fhinspectionsatl.com/blog/crawlspace-moisture-the-silent-threat-to-georgia-foundations',
    imageUrl: '',
  },
  {
    id: 4,
    title: 'Realtor Partner Spotlight',
    message: 'Dear Metro Atlanta Realtors: Does this sound familiar? 🤦‍♂️\n\nYou get an inspection report back that reads like a horror novel, filled with alarmist red text, confusing language, and vague recommendations that needlessly terrify your first-time buyers and stall the deal.\n\nAt Foresight, we partner with top agents across Metro Atlanta with a clear philosophy:\n\n1️⃣ Factual & Objective: We clearly distinguish between true structural/safety hazards vs. standard routine maintenance.\n2️⃣ Speed Wins: 2-inspector teams mean faster on-site appointments and reports delivered within 24 hours.\n3️⃣ $10,000 Elite Warranty Included: Zero deductible protection that shields both the buyer and your transaction.\n4️⃣ Repair Request Builder: Easily convert report findings directly into your official amendment.\n\nPartner with a Certified Master Inspector®: https://www.fhinspectionsatl.com/realtors\n\n#AtlantaRealtors #GeorgiaRealEstate #RealtorLife #TopProducer #BrokeragePartner',
    link: 'https://www.fhinspectionsatl.com/realtors',
    imageUrl: '',
  },
  {
    id: 5,
    title: 'EPA Zone 1 Radon Gas Warning',
    message: 'Radon doesn’t care if a house is 50 years old or built yesterday. ☢️\n\nBecause North Metro Atlanta sits on natural granite bedrock, our region is classified in EPA Radon Zone 1—the highest risk tier in the country.\n\n• Completely odorless, invisible, and radioactive.\n• The #1 cause of lung cancer among non-smokers in the US.\n• The EPA recommends testing for EVERY home transaction in Georgia.\n\nForesight deploys continuous 48-hour electronic diagnostic monitors recording hourly air samples.\n\nProtect your family\'s health: https://www.fhinspectionsatl.com/services/radon-testing/atlanta\n\n#RadonTesting #FamilyHealth #HomeSafety #AtlantaRealEstate',
    link: 'https://www.fhinspectionsatl.com/services/radon-testing/atlanta',
    imageUrl: '',
  },
  {
    id: 6,
    title: 'The $10,000 Zero-Deductible Guarantee',
    message: 'What happens if an appliance breaks or a roof leak happens 30 days after you buy your home? 🏠💔\n\nMost inspectors say: “Sorry, that wasn’t leaking when I was there.”\n\nNot Foresight. Because Christopher Boykin holds the elite Certified Master Inspector® designation, every full inspection includes the $10,000 Elite Master Inspection Warranty:\n\n🛡️ $0 Deductible: Zero out-of-pocket payment required for valid claims.\n🛡️ 90 Days of Protection: Covers major appliances, HVAC, electrical, plumbing & structural framing.\n🛡️ Roof Leak & Mold Remediation: Up to $1,000 for roof leak repair and $2,250 for mold remediation.\n🛡️ InterNACHI $25,000 Honor Guarantee: If anything is missed, InterNACHI will buy back your home.\n\nCheck your home inspection price in 60 seconds: https://www.fhinspectionsatl.com/quote\n\n#HomeWarranty #PeaceOfMind #AtlantaHomeowners #EliteProtection',
    link: 'https://www.fhinspectionsatl.com/quote',
    imageUrl: '',
  },
  {
    id: 7,
    title: 'New Construction 11-Month Warranty Alert',
    message: 'Did you buy a brand-new construction home in late 2024 or 2025? 🚨\n\nYour builder’s 1-year warranty is ticking down!\n\nOnce that 12-month mark hits, the builder is off the hook, and all repair expenses come out of your savings account.\n\nDon’t let your warranty expire without an independent evaluation. A Foresight 11-Month Builder Warranty Inspection delivers:\n\n📋 Complete audit of attic trusses, roof shingles, HVAC duct balancing, plumbing & foundation grading.\n📸 Professional, photo-documented punch list ready to upload directly to your builder\'s warranty portal.\n💰 On average, our clients save $1,500–$4,000 in builder-paid repairs.\n\nBook your 11-month warranty check today: https://www.fhinspectionsatl.com/services/11-month-warranty-inspection/atlanta\n\n#NewConstructionAtlanta #BuilderWarranty #AtlantaSuburbs #NewHomeowner',
    link: 'https://www.fhinspectionsatl.com/services/11-month-warranty-inspection/atlanta',
    imageUrl: '',
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
