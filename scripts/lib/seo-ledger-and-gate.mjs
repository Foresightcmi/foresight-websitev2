import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export function loadGovernorBrief(rootDir) {
  const briefPath = path.join(rootDir, '.analytics', 'governor_brief.json');
  if (!fs.existsSync(briefPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(briefPath, 'utf8'));
  } catch {
    return null;
  }
}

export async function evaluateLiveCoreUpdateGate(rootDir, cooldownDays = 7) {
  const brief = loadGovernorBrief(rootDir);
  try {
    const res = await fetch('https://status.search.google.com/incidents.json', {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const incidents = await res.json();
      const nowMs = Date.now();
      const cooldownMs = cooldownDays * 86400 * 1000;
      const blocking = incidents.filter((inc) => {
        if (String(inc.service_name || '').toLowerCase() !== 'ranking') return false;
        if (!inc.end) return true;
        const endMs = Date.parse(inc.end);
        return !Number.isNaN(endMs) && nowMs - endMs < cooldownMs;
      });
      const editMode = blocking.length > 0 ? 'FREEZE' : 'NORMAL';
      return { editMode, blockingCount: blocking.length, brief, source: 'live-status' };
    }
  } catch {}
  const fallbackMode = brief?.core_update_gate?.edit_mode || 'NORMAL';
  return { editMode: fallbackMode, blockingCount: fallbackMode === 'FREEZE' ? 1 : 0, brief, source: 'cached-brief' };
}

export function extractTemplateCohort(urlPath) {
  const clean = String(urlPath || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  if (parts.length <= 1) return clean;
  return `/${parts[0]}/*`;
}

export function appendExperimentLedger(rootDir, { url, deployedAt, hypothesis, template }) {
  const normUrl = String(url || '').startsWith('/') ? String(url) : `/${String(url || '')}`;
  const depDate = String(deployedAt || new Date().toISOString().slice(0, 10)).slice(0, 10);
  if (!normUrl || normUrl === '/' || !hypothesis) return false;
  const ledgerPath = path.join(rootDir, '.analytics', 'experiments_ledger.jsonl');
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });

  const existingLines = fs.existsSync(ledgerPath)
    ? fs.readFileSync(ledgerPath, 'utf8').split(/\r?\n/).filter(Boolean)
    : [];
  for (const line of existingLines) {
    try {
      const item = JSON.parse(line);
      if (item.url === normUrl && String(item.deployed_at || '').slice(0, 10) === depDate) {
        return false; // Idempotent deduplication by (url, deployed_at)
      }
    } catch {}
  }

  let gitSha = '';
  try {
    gitSha = execSync('git rev-parse --short HEAD', { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {}

  const record = {
    url: normUrl,
    template: template || extractTemplateCohort(normUrl),
    deployed_at: depDate,
    hypothesis: String(hypothesis).slice(0, 280),
    git_sha: gitSha,
    created_at: new Date().toISOString(),
  };
  fs.appendFileSync(ledgerPath, `${JSON.stringify(record)}\n`, 'utf8');
  return true;
}
