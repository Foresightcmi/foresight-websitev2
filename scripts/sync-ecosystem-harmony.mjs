import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEBSITE_ROOT = path.resolve(__dirname, '..');
const SCRATCH_ROOT = path.resolve(WEBSITE_ROOT, '..');

const TRUTH_FILE = path.join(WEBSITE_ROOT, 'data', 'truth.json');
const EMAIL_ENGINE_DIR = path.join(SCRATCH_ROOT, 'email-campaign-engine');
const VIDEO_STUDIO_DIR = path.join(SCRATCH_ROOT, 'omni-video-publisher');
const GBP_ENGINE_DIR = path.join(SCRATCH_ROOT, 'foresight-gbp-automation');

const TARGET_FILES = [
  { project: 'foresight-website (AI Concierge Brain)', file: path.join(WEBSITE_ROOT, 'lib', 'chris-brain-prompt.js') },
  { project: 'foresight-website (Unified Persona)', file: path.join(WEBSITE_ROOT, 'lib', 'foresight-persona.mjs') },
  { project: 'foresight-website (Dashboard Client)', file: path.join(WEBSITE_ROOT, 'app', 'dashboard', 'DashboardClient.js') },
  { project: 'foresight-website (Review Client)', file: path.join(WEBSITE_ROOT, 'app', 'review', 'ReviewClient.js') },
  { project: 'foresight-website (AI Knowledge Graph)', file: path.join(WEBSITE_ROOT, 'public', 'llms.txt') },
  { project: 'foresight-website (Comparisons Matrix)', file: path.join(WEBSITE_ROOT, 'data', 'comparisons-pseo.json') },
  { project: 'foresight-website (Social Queue)', file: path.join(WEBSITE_ROOT, 'data', 'social-queue.json') },
  { project: 'email-campaign-engine', file: path.join(EMAIL_ENGINE_DIR, 'lightweight_realtor_templates.js') },
  { project: 'omni-video-publisher (Foresight)', file: path.join(VIDEO_STUDIO_DIR, 'core', 'foresight_knowledge.py') },
  { project: 'foresight-website (Social/LinkedIn)', file: path.join(WEBSITE_ROOT, 'scripts', 'linkedin-content-engine.mjs') },
  { project: 'foresight-website (Multi-Channel)', file: path.join(WEBSITE_ROOT, 'scripts', 'multi-channel-publisher.mjs') }
];

const STRIKING_SOCIAL_POSTS = [
  {
    targetPage: '/services/buyer-inspection/norcross',
    title: 'Norcross, GA Home Inspections — 2 Certified Inspectors & Same-Day Report',
    topic: 'GSC Page-1 Booster: Norcross Buyer Inspection',
    imageUrl: 'https://www.fhinspectionsatl.com/images/two-inspectors-electrical-panel-inspection.jpg',
    city: 'Norcross',
    serviceName: 'Buyer Home Inspection',
    priceHook: 'starting at $345 for single-family homes and $295 for condos'
  },
  {
    targetPage: '/services/commercial-property-inspection/cumming',
    title: 'Cumming, GA Commercial Property Inspections & PCA Audits',
    topic: 'GSC Page-1 Booster: Cumming Commercial Inspection',
    imageUrl: 'https://www.fhinspectionsatl.com/images/drone-2.webp',
    city: 'Cumming',
    serviceName: 'Commercial Property Inspection',
    priceHook: 'starting at $750 with 24–48 hour ASTM E2018 digital report turnaround'
  },
  {
    targetPage: '/services/buyer-inspection/lilburn',
    title: 'Lilburn, GA Home Inspections — Dual-Inspector Due Diligence',
    topic: 'GSC Page-1 Booster: Lilburn Buyer Inspection',
    imageUrl: 'https://www.fhinspectionsatl.com/images/crawlspace-inspection.webp',
    city: 'Lilburn',
    serviceName: 'Buyer Home Inspection',
    priceHook: 'starting at $345 with free thermal imaging and 4K drone roof scans'
  },
  {
    targetPage: '/services/pre-drywall-inspection/dallas',
    title: 'Dallas, GA Pre-Drywall Framing Inspections (Starting at $275)',
    topic: 'GSC Page-1 Booster: Dallas Pre-Drywall Inspection',
    imageUrl: 'https://www.fhinspectionsatl.com/images/roof-1.webp',
    city: 'Dallas',
    serviceName: 'Pre-Drywall Framing Inspection',
    priceHook: 'starting at $275 up to 1,500 sq ft, $300 for 1,501–2,500 sq ft, $350 for 2,501–3,500 sq ft, and $400 for 3,501+ sq ft'
  },
  {
    targetPage: '/services/buyer-inspection/snellville',
    title: 'Snellville, GA Home Inspections — 4.8★ CMI-Led 2-Inspector Team',
    topic: 'GSC Page-1 Booster: Snellville Buyer Inspection',
    imageUrl: 'https://www.fhinspectionsatl.com/images/thermal-ceiling.webp',
    city: 'Snellville',
    serviceName: 'Buyer Home Inspection',
    priceHook: 'starting at $345 with same-day interactive digital reporting'
  },
  {
    targetPage: '/services/buyer-inspection/acworth',
    title: 'Acworth, GA Home Inspections — Two Certified Inspectors on Every Home',
    topic: 'GSC Page-1 Booster: Acworth Buyer Inspection',
    imageUrl: 'https://www.fhinspectionsatl.com/images/hvac-inspection.webp',
    city: 'Acworth',
    serviceName: 'Buyer Home Inspection',
    priceHook: 'starting at $345 backed by up to $35,000 in warranty and guarantee protection'
  }
];

export function auditAndSyncEcosystemHarmony() {
  const truth = JSON.parse(fs.readFileSync(TRUTH_FILE, 'utf8'));
  const strikingQueuePath = path.join(WEBSITE_ROOT, 'data', 'striking-distance-queue.json');
  const strikingTargets = new Set(STRIKING_SOCIAL_POSTS.map(s => s.targetPage));
  if (fs.existsSync(strikingQueuePath)) {
    const strikingData = JSON.parse(fs.readFileSync(strikingQueuePath, 'utf8'));
    for (const opp of (strikingData.opportunities || [])) {
      if (opp.targetPage) strikingTargets.add(opp.targetPage);
    }
  }
  const socialQueuePath = path.join(WEBSITE_ROOT, 'data', 'social-queue.json');
  if (fs.existsSync(socialQueuePath)) {
    let rawQueue = fs.readFileSync(socialQueuePath, 'utf8');
    rawQueue = rawQueue.replace(/\}\s*,\s*\}\s*\]\s*$/, '}\n]');
    rawQueue = rawQueue.replace(/https:\/\/fhinspectionsatl\.com/g, 'https://www.fhinspectionsatl.com');
    rawQueue = rawQueue.replace(/\/services\/dekalb-low-flow-water-certificate/g, '/service-areas/dekalb-county-compliance');
    rawQueue = rawQueue.replace(/\/services\/mold-air-quality-testing/g, '/services/mold-testing');
    rawQueue = rawQueue.replace(/\/blog\/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance-2026-09-29/g, '/blog/understanding-your-georgia-home-inspection-report-red-flags-vs-maintenance');
    rawQueue = rawQueue.replace(/\/blog\/crawlspace-moisture-the-silent-threat-to-georgia-foundations/g, '/blog/crawlspace-moisture-silent-threat-georgia-foundations');
    const parsedQueue = JSON.parse(rawQueue);
    let maxId = parsedQueue.reduce((acc, item) => Math.max(acc, Number(item.id) || 0), 0);
    let addedStriking = 0;
    for (const sp of STRIKING_SOCIAL_POSTS) {
      if (!strikingTargets.has(sp.targetPage)) continue;
      const link = `https://www.fhinspectionsatl.com${sp.targetPage}`;
      const isCommercial = sp.targetPage.includes('commercial-property-inspection');
      const turnaroundBullet = isCommercial
        ? '• Comprehensive ASTM E2018 digital report delivered in 24 to 48 hours.'
        : '• Same-day digital report delivered after a 1.5 to 2.5 hour on-site evaluation.';
      const postPayload = {
        title: sp.title,
        topic: sp.topic,
        link,
        imageUrl: sp.imageUrl,
        gbp: `Buying or building in ${sp.city}, GA? Foresight Home Inspections deploys Two Certified Inspectors on every ${sp.serviceName.toLowerCase()} in ${sp.city} (${sp.priceHook}).\n\n• Led by Certified Master Inspector® Christopher Boykin (4.8★ across 53 verified Google reviews).\n• Free calibrated infrared thermal imaging and 4K aerial drone roof scans included on full inspections.\n• Up to $35,000 in combined warranty and guarantee protection ($10,000 Elite Master Warranty + $25,000 InterNACHI Honor Guarantee).\n${turnaroundBullet}\n\nCall (678) 480-2110 or book online 24/7: ${link}`,
        facebook: `Buying or building in ${sp.city}, GA? 🏡🔍\n\nDon't rely on a solo inspector rushing through your due diligence window. Foresight Home Inspections puts Two Certified Inspectors on every ${sp.serviceName.toLowerCase()} in ${sp.city}, GA (${sp.priceHook})!\n\n✅ 4.8★ Across 53 Verified Google Reviews\n✅ Led by Certified Master Inspector® Christopher Boykin\n✅ Free Calibrated Infrared Thermal & 4K Drone Roof Scans\n✅ Up to $35,000 in Combined Warranty & Guarantee Protection\n\n👉 Check instant pricing and book online 24/7:\n${link}\n📞 Direct CMI Hotline: (678) 480-2110\n\n#${sp.city}GA #AtlantaRealEstate #HomeInspection #CertifiedMasterInspector #ForesightHomeInspections`,
        linkedin: `${sp.city}, GA ${sp.serviceName}: Why ${sp.city} homebuyers, commercial investors, and realtors trust Foresight Home Inspections (${sp.priceHook}).\n\nLed by board-certified Certified Master Inspector® Christopher Boykin (4.8★ across 53 verified Google reviews), our Two-Inspector team completes cross-checked evaluations with free infrared thermal imaging, 4K drone roof scans, and up to $35,000 in combined warranty and guarantee protection.\n\nSchedule your ${sp.city}, GA inspection online 24/7:\n${link}\n\n#${sp.city}RealEstate #AtlantaRealtors #DueDiligence #CertifiedMasterInspector #ForesightHomeInspections`
      };
      const existingIdx = parsedQueue.findIndex(item => item.link === link);
      if (existingIdx === -1) {
        maxId += 1;
        parsedQueue.push({ id: maxId, ...postPayload });
        addedStriking += 1;
      } else {
        parsedQueue[existingIdx] = { id: parsedQueue[existingIdx].id, ...postPayload };
      }
    }
    fs.writeFileSync(socialQueuePath, JSON.stringify(parsedQueue, null, 2) + '\n', 'utf8');
    if (addedStriking > 0) {
      console.log(`  📈 [GSC SOCIAL SYNC] Added ${addedStriking} Page-1 striking-distance city+service posts into data/social-queue.json`);
    }
  }
  console.log(`\n════════════════════════════════════════════════════════════════════`);
  console.log(`  FORESIGHT UNIFIED ECOSYSTEM HARMONY & TRUTH BRIDGE (v${truth.version})`);
  console.log(`════════════════════════════════════════════════════════════════════\n`);

  let issues = 0;

  for (const t of TARGET_FILES) {
    if (!fs.existsSync(t.file)) {
      console.log(`  ℹ️ [SKIP] ${t.project} not present on this runner (${path.basename(t.file)})`);
      continue;
    }
    const content = fs.readFileSync(t.file, 'utf8');
    const fileIssues = [];

    if (/foresighthomeinspections\.com/i.test(content)) {
      fileIssues.push('Legacy domain foresighthomeinspections.com detected (must be fhinspectionsatl.com)');
    }
    if (/\b(F404|F201|RSMeans|HomeGauge)\b/.test(content)) {
      fileIssues.push('Banned legal/trademark term detected (F404/F201/RSMeans/HomeGauge)');
    }
    if (/\/services\/(dekalb-low-flow-water-certificate|mold-air-quality-testing|str-compliance-inspection)\b/.test(content)) {
      fileIssues.push('Non-canonical service URL slug detected (must use /service-areas/dekalb-county-compliance, /services/mold-testing, or /blog/metro-atlanta-short-term-rental-str-compliance-guide)');
    }
    if ((t.file.endsWith('foresight_knowledge.py') || t.file.endsWith('social-queue.json') || t.file.endsWith('chris-brain-prompt.js') || t.file.endsWith('llms.txt') || t.file.endsWith('comparisons-pseo.json')) && !content.includes('$275')) {
      fileIssues.push('Missing $275 Pre-Drywall starting price');
    }
    if ((t.file.endsWith('llms.txt') || t.file.endsWith('comparisons-pseo.json')) && (!content.includes('4.8★ Across 53 Verified Google Reviews') || !content.includes('Pre-Drywall from $275'))) {
      fileIssues.push('Missing 4.8★ Across 53 Verified Google Reviews or Pre-Drywall from $275 summary');
    }
    if (t.file.endsWith('social-queue.json') && /(\(From \)|With ,000|\( Flat Rate\)|psychrometric moisture loads|parallel return paths on grounding conductors)/i.test(content)) {
      fileIssues.push('Corrupted $ regex token or banned academic jargon detected in social-queue.json');
    }
    if (t.file.endsWith('lightweight_realtor_templates.js') && !content.includes('MAX_DUE_DILIGENCE_AGE_DAYS = 2')) {
      fileIssues.push('Due diligence ceiling out of sync with 48-hour (2-day) standard');
    }
    if (t.file.endsWith('DashboardClient.js')) {
      if (!content.includes('Rating: 4.8') || !content.includes('53 reviews')) {
        fileIssues.push('DashboardClient.js drifted from 4.8 rating / 53 reviews');
      }
      if (!content.includes('https://g.page/r/CaK5MZOz_FBtEBM/review') || content.includes('CbGjW894Yg5pEAI')) {
        fileIssues.push('DashboardClient.js drifted from canonical Google review link CaK5MZOz_FBtEBM');
      }
      if (/\bCRL\b/.test(content)) {
        fileIssues.push('Banned trademark term CRL detected in DashboardClient.js');
      }
    }
    if (t.file.endsWith('ReviewClient.js')) {
      if (!content.includes('https://g.page/r/CaK5MZOz_FBtEBM/review') || content.includes('CbGjW894Yg5pEAI')) {
        fileIssues.push('ReviewClient.js drifted from canonical Google review link CaK5MZOz_FBtEBM');
      }
      if (!content.includes('$35,000')) {
        fileIssues.push('ReviewClient.js missing $35,000 combined warranty protection');
      }
      if (!content.includes('message: activeSms')) {
        fileIssues.push('ReviewClient.js missing canonical message: activeSms key in /api/open-sms payload');
      }
      if (/\bCRL\b/.test(content)) {
        fileIssues.push('Banned trademark term CRL detected in ReviewClient.js');
      }
    }

    if (fileIssues.length === 0) {
      console.log(`  ✅ [HARMONIZED] ${t.project} -> ${path.basename(t.file)}`);
    } else {
      issues += fileIssues.length;
      console.error(`  ❌ [DRIFT] ${t.project} (${path.basename(t.file)}): ${fileIssues.join('; ')}`);
    }
  }

  // Export canonical truth snapshot into email-campaign-engine & omni-video-publisher if present locally
  for (const destDir of [EMAIL_ENGINE_DIR, path.join(VIDEO_STUDIO_DIR, 'data')]) {
    if (fs.existsSync(destDir)) {
      fs.writeFileSync(path.join(destDir, 'foresight_canonical_truth.json'), JSON.stringify(truth, null, 2), 'utf8');
    }
  }

  // Sync Foresight Video & Carousel Studio packets metadata into data/unified-studio-packets.json
  const outboxDir = path.join(VIDEO_STUDIO_DIR, 'brands', 'plsinspectnow-atl', 'outbox_ready');
  if (fs.existsSync(outboxDir)) {
    const jobs = fs.readdirSync(outboxDir).filter(d => fs.statSync(path.join(outboxDir, d)).isDirectory()).sort().reverse();
    const packets = jobs.map(jobId => {
      const jp = path.join(outboxDir, jobId);
      const files = fs.readdirSync(jp);
      let title = jobId;
      if (files.includes('companion_guide.html')) {
        const html = fs.readFileSync(path.join(jp, 'companion_guide.html'), 'utf8');
        const m = html.match(/<title>([^<]+)<\/title>/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (m) title = m[1].trim();
      }
      return {
        jobId,
        title,
        date: jobId.replace(/^job-(\d{4})(\d{2})(\d{2}).*$/, '$1-$2-$3'),
        hasMasterVideo: files.includes('master_9x16.mp4'),
        hasGbp30sVideo: files.includes('gbp_30s.mp4'),
        hasCarouselPdf: files.includes('linkedin_carousel_deck.pdf'),
        slideCount: files.filter(f => f.startsWith('slide_')).length,
        fieldPhotoCount: files.filter(f => f.startsWith('field_photo_')).length,
        localPath: jp
      };
    });
    fs.writeFileSync(path.join(WEBSITE_ROOT, 'data', 'unified-studio-packets.json'), JSON.stringify(packets, null, 2), 'utf8');
    console.log(`  🎬 [STUDIO SYNC] Indexed ${packets.length} Foresight Video & Carousel packets into data/unified-studio-packets.json`);
  }

  // Zero-Leak Secret & GitGuardian False-Positive Guard
  const ggConfigPath = path.join(WEBSITE_ROOT, '.gitguardian.yaml');
  const ucPath = path.join(WEBSITE_ROOT, 'data', 'under-contract-realtors.json');
  const ucRaw = fs.existsSync(ucPath) ? fs.readFileSync(ucPath, 'utf8') : '[]';
  const hasListingKey = ucRaw.includes('"listing_key"');
  const hasLowPriceRental = JSON.parse(ucRaw).some(r => (r.raw_price || 0) < 75000);
  if (!fs.existsSync(ggConfigPath) || hasListingKey || hasLowPriceRental) {
    issues += 1;
    console.error(`  ❌ [DRIFT] GitGuardian / Due Diligence Quality Gate failed (ggConfig=${fs.existsSync(ggConfigPath)}, listing_key=${hasListingKey}, lowPriceRental=${hasLowPriceRental})`);
  } else {
    console.log(`  ✅ [HARMONIZED] GitGuardian Zero-Leak & Purchase-Only Due Diligence Quality Gate (>= $75,000, listing_ref)`);
  }

  console.log(`\n[SUMMARY] Ecosystem Harmony Check complete: ${issues} drift issues across connected engines.\n`);
  if (issues > 0) process.exitCode = 1;
  return { issues };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  auditAndSyncEcosystemHarmony();
}
