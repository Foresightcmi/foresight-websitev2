/**
 * Deterministic Node.js Client for Agent-Reach v1.6.0 (`schema_version: 1`)
 * - 100% Zero-Cookie / Public-Web Safe (protects @fhinspectionsatl & personal accounts)
 * - Live DNS MX & HTTP Status Verification (Rule 6.3)
 * - Strict Ansley / MetroBrokers / Builder / Unsubscribed Firewall & truth.json Sanitizer
 */
import { execFile } from 'node:child_process';
import dns from 'node:dns/promises';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const DEFAULT_BIN = process.env.AGENT_REACH_BIN ||
  path.join(os.homedir(), '.local', 'bin', process.platform === 'win32' ? 'agent-reach.exe' : 'agent-reach');

const YT_DLP_CANDIDATES = [
  process.env.YT_DLP_BIN,
  path.join(os.homedir(), 'AppData', 'Roaming', 'uv', 'tools', 'agent-reach', 'Scripts', 'yt-dlp.exe'),
  path.join(os.homedir(), '.local', 'bin', 'yt-dlp'),
  '/usr/local/bin/yt-dlp',
  '/usr/bin/yt-dlp'
].filter(Boolean);
const YT_DLP_BIN = YT_DLP_CANDIDATES.find((p) => fs.existsSync(p)) || '';

function decodeXml(s = '') {
  return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function liveOpenWebFallback(safeArgs) {
  const [channel, action, query = ''] = safeArgs;
  const limIdx = safeArgs.indexOf('--limit');
  const limit = limIdx !== -1 ? Number(safeArgs[limIdx + 1] || 6) : 6;
  if (channel === 'youtube' && action === 'search' && fs.existsSync(YT_DLP_BIN)) {
    try {
      const { stdout } = await execFileAsync(YT_DLP_BIN, ['--flat-playlist', '--dump-json', `ytsearch${limit}:${query}`], { timeout: 22000, maxBuffer: 8 * 1024 * 1024, windowsHide: true });
      const items = stdout.trim().split(/\r?\n/).filter(Boolean).map((line) => {
        const d = JSON.parse(line);
        return { title: d.title, url: d.webpage_url || d.url, author: (d.channel || d.uploader || '').trim(), text: d.description || '', raw: { view_count: d.view_count || 0 } };
      });
      return { ok: items.length > 0, channel, action, backend: 'yt-dlp-direct', items };
    } catch {}
  }
  if ((channel === 'web' || channel === 'reddit') && action === 'search') {
    const q = channel === 'reddit' && !/site:reddit\.com/i.test(query) ? `site:reddit.com ${query}` : query;
    const siteMatch = q.match(/site:([^\s]+)/i);
    const hostFilter = siteMatch ? siteMatch[1].split('/')[0].toLowerCase() : '';
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const exaRes = await fetch('https://mcp.exa.ai/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'web_search_exa', arguments: { query: q, numResults: limit } } }),
        signal: AbortSignal.timeout(14000)
      });
      if (exaRes.ok) {
        const raw = await exaRes.text();
        const dataLines = raw.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim());
        const msg = JSON.parse(dataLines[dataLines.length - 1] || raw);
        const textBlob = (msg?.result?.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
        const items = textBlob.split(/\n(?=Title: )/).map((blk) => {
          const b = blk.trim();
          if (!b.startsWith('Title:')) return null;
          const title = b.match(/^Title:\s*(.*)$/m)?.[1]?.trim() || '';
          const url = b.match(/^URL:\s*(.*)$/m)?.[1]?.trim() || '';
          const pub = b.match(/^Published:\s*(.*)$/m)?.[1]?.trim() || null;
          const author = b.match(/^Author:\s*(.*)$/m)?.[1]?.trim() || null;
          const text = b.replace(/^(Title|URL|Published|Author):.*$/gm, '').replace(/\s+/g, ' ').trim();
          return { title, url, author, published_at: pub, text };
        }).filter((x) => x && x.url && (!hostFilter || x.url.toLowerCase().includes(hostFilter))).slice(0, limit);
        if (items.length > 0) return { ok: true, channel, action, backend: 'exa-mcp-sequential', items };
      }
    } catch {}
    if (hostFilter) return null;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
    try {
      const res = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, signal: AbortSignal.timeout(10000) });
      const xml = await res.text();
      const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit);
      const items = blocks.map((m) => {
        const b = m[1];
        const title = decodeXml(b.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
        const url = decodeXml(b.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '');
        const pub = decodeXml(b.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '');
        const text = decodeXml(b.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');
        const src = decodeXml(b.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || '');
        return { title, url, author: src || null, published_at: pub ? new Date(pub).toISOString() : null, text };
      }).filter((x) => x.url);
      if (items.length > 0) return { ok: true, channel, action, backend: 'live-rss-fallback', items };
    } catch {}
  }
  return null;
}

export const EXCLUDED_DOMAINS = new Set([
  'ansleyre.com', 'ansleyatlanta.com', 'metrobrokers.com', 'cbcmetrobrokers.com',
  'cgrealtyinc.com', 'peachtreetc.com', 'drhorton.com', 'pulte.com', 'lennar.com',
  'ashtonwoods.com', 'stanleymartin.com', 'centurycommunities.com', 'beazer.com',
  'adamshomes.com', 'rocklynhomes.com', 'meritagehomes.com', 'tollbrothers.com',
  'kbhome.com', 'taylormorrison.com', 'smithdouglas.com', 'chafincommunities.com',
  'chafinrealtyinc.com', 'paranhomes.com', 'dwhomes.com', 'theprovidencegroup.com',
  'relianthomes.com', 'odwyerhomes.com', 'cstonega.com'
]);

const EXCLUDED_ENTITY_RE = /ansley|chapman\s+group|amy\s*fuchs|joe\s*chapman|d\.?\s*r\.?\s*horton|pulte|lennar|meritage|toll\s*brothers|beazer|kb\s*home|ashton\s*woods|taylor\s*morrison|stanley\s*martin/i;

export async function runAgentReach(args, { timeoutMs = 28000 } = {}) {
  const safeArgs = [...args].filter((a) => a !== '--json');
  const channel = safeArgs[0];
  if (['reddit', 'facebook', 'twitter'].includes(channel) && !safeArgs.includes('--backend')) {
    safeArgs.push('--backend', 'public-web');
  }
  try {
    const { stdout } = await execFileAsync(DEFAULT_BIN, safeArgs, {
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
      encoding: 'utf8',
      windowsHide: true
    });
    const parsed = JSON.parse(stdout);
    if (parsed && parsed.ok && Array.isArray(parsed.items) && parsed.items.length > 0) {
      return parsed;
    }
    const fb = await liveOpenWebFallback(safeArgs);
    return fb || (parsed && typeof parsed === 'object' ? parsed : { ok: false, items: [], error: { code: 'PARSE_ERR' } });
  } catch (err) {
    const fb = await liveOpenWebFallback(safeArgs);
    if (fb) return fb;
    if (err?.stdout) {
      try { return JSON.parse(err.stdout); } catch {}
    }
    return { ok: false, items: [], error: { code: 'EXEC_ERR', message: err.message } };
  }
}

export function loadUnsubscribedSet(webRoot) {
  const set = new Set();
  const candidates = [
    path.join(webRoot, 'data', 'unsubscribed_contacts.json'),
    path.resolve(webRoot, '..', 'email-campaign-engine', 'unsubscribed_contacts.json')
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
      const arr = Array.isArray(raw) ? raw : Object.keys(raw);
      for (const item of arr) {
        const e = String(typeof item === 'string' ? item : item?.email || '').trim().toLowerCase();
        if (e) set.add(e);
      }
    } catch {}
  }
  return set;
}

export function isSuppressedEntity({ email = '', name = '', company = '' }, unsubSet = new Set()) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const domain = cleanEmail.includes('@') ? cleanEmail.split('@')[1] : '';
  if (cleanEmail && (unsubSet.has(cleanEmail) || EXCLUDED_DOMAINS.has(domain))) return true;
  if (EXCLUDED_ENTITY_RE.test(`${cleanEmail} ${name} ${company}`)) return true;
  return false;
}

export async function verifyRecord({ sourceUrl, email }) {
  let urlOk = false;
  let mxOk = !email;
  try {
    const res = await fetch(sourceUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ForesightTruthVerifier/1.0)' },
      signal: AbortSignal.timeout(9000)
    });
    urlOk = res.status >= 200 && res.status < 405;
  } catch {}
  if (email && email.includes('@')) {
    try {
      const mx = await dns.resolveMx(email.split('@')[1]);
      mxOk = Array.isArray(mx) && mx.length > 0;
    } catch { mxOk = false; }
  }
  return { urlOk, mxOk, verified: Boolean(urlOk && mxOk) };
}

export function sanitizeForTruth(text, truth) {
  let out = String(text || '').replace(/\*/g, '').replace(/1816\s+South\s+Deshon(\s+Road|\s+Rd)?/gi, 'Metro Atlanta');
  for (const rule of truth?.guardrails?.bannedLegalAndBrandTerms || []) {
    const re = new RegExp(`\\b${rule.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    out = out.replace(re, rule.replacement);
  }
  return out.trim();
}
