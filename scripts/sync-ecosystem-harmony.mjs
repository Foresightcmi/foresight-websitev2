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
  { project: 'email-campaign-engine', file: path.join(EMAIL_ENGINE_DIR, 'lightweight_realtor_templates.js') },
  { project: 'omni-video-publisher (Foresight)', file: path.join(VIDEO_STUDIO_DIR, 'core', 'foresight_knowledge.py') },
  { project: 'foresight-gbp-automation', file: path.join(GBP_ENGINE_DIR, 'gbp_content_engine.js') },
  { project: 'foresight-website (Social/LinkedIn)', file: path.join(WEBSITE_ROOT, 'scripts', 'linkedin-content-engine.mjs') },
  { project: 'foresight-website (Multi-Channel)', file: path.join(WEBSITE_ROOT, 'scripts', 'multi-channel-publisher.mjs') }
];

export function auditAndSyncEcosystemHarmony() {
  const truth = JSON.parse(fs.readFileSync(TRUTH_FILE, 'utf8'));
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
    if (t.file.endsWith('foresight_knowledge.py') && !content.includes('$275')) {
      fileIssues.push('Missing $275 Pre-Drywall starting price');
    }
    if (t.file.endsWith('lightweight_realtor_templates.js') && !content.includes('MAX_DUE_DILIGENCE_AGE_DAYS = 2')) {
      fileIssues.push('Due diligence ceiling out of sync with 48-hour (2-day) standard');
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

  console.log(`\n[SUMMARY] Ecosystem Harmony Check complete: ${issues} drift issues across connected engines.\n`);
  if (issues > 0) process.exitCode = 1;
  return { issues };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  auditAndSyncEcosystemHarmony();
}
