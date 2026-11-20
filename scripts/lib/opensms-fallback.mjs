import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import { execSync } from 'node:child_process';

const PRIVATE_OPENSMS_RX = /^http:\/\/(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):9292\/sms\/?$/i;

export function isTrustedPrivateOpenSmsUrl(url = '') {
  return PRIVATE_OPENSMS_RX.test(String(url || '').trim());
}

function probePort(ip, port = 9292, timeoutMs = 400) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    sock.setTimeout(timeoutMs);
    sock.once('connect', () => { sock.destroy(); resolve(`http://${ip}:${port}/sms/`); });
    sock.once('timeout', () => { sock.destroy(); resolve(''); });
    sock.once('error', () => { sock.destroy(); resolve(''); });
    sock.connect(port, ip);
  });
}

export async function discoverLocalOpenSmsPhone(port = 9292) {
  const arpIps = [];
  try {
    const arpOut = execSync('arp -a', { encoding: 'utf8', timeout: 1500, stdio: ['ignore', 'pipe', 'ignore'] });
    for (const m of arpOut.matchAll(/\b((?:192\.168|10\.\d{1,3})\.\d{1,3}\.\d{1,3})\b/g)) {
      if (!m[1].endsWith('.255') && !m[1].endsWith('.1')) arpIps.push(m[1]);
    }
  } catch {}
  for (let i = 0; i < arpIps.length; i += 32) {
    const hits = (await Promise.all(arpIps.slice(i, i + 32).map((ip) => probePort(ip, port, 350)))).filter(Boolean);
    if (hits[0] && isTrustedPrivateOpenSmsUrl(hits[0])) return hits[0];
  }
  const prefixes = new Set(['192.168.1']);
  const nets = os.networkInterfaces();
  for (const list of Object.values(nets)) {
    for (const iface of list || []) {
      if (iface.family === 'IPv4' && !iface.internal && (iface.address.startsWith('192.168.') || iface.address.startsWith('10.'))) {
        prefixes.add(iface.address.split('.').slice(0, 3).join('.'));
      }
    }
  }
  for (const prefix of prefixes) {
    for (let start = 2; start <= 254; start += 32) {
      const batch = Array.from({ length: Math.min(32, 255 - start) }, (_, idx) => `${prefix}.${start + idx}`);
      const hits = (await Promise.all(batch.map((ip) => probePort(ip, port, 380)))).filter(Boolean);
      if (hits[0] && isTrustedPrivateOpenSmsUrl(hits[0])) return hits[0];
    }
  }
  return '';
}

function persistGatewayAtomically(configFilePath, newUrl, apiKey = '') {
  if (!configFilePath || !isTrustedPrivateOpenSmsUrl(newUrl)) return;
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(configFilePath, 'utf8')); } catch {}
  const updated = { ...existing, ...(apiKey && !existing.apiKey ? { apiKey } : {}), gatewayUrl: newUrl, updatedAt: new Date().toISOString() };
  const tmp = `${configFilePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(updated, null, 2), 'utf8');
  fs.renameSync(tmp, configFilePath);
}

export async function sendOpenSmsWithDhcpFallback({
  phone, text, bodyOverride = null, configuredUrl = '', apiKey = '', configFilePath = '',
  fetchFn = fetch, discoverFn = discoverLocalOpenSmsPhone
}) {
  let targetUrl = configuredUrl || (await discoverFn(9292));
  if (!targetUrl) return { ok: false, endpoint: '', data: null, error: 'no_gateway' };
  const buildReq = (url) => {
    const isLocal = url.includes(':9292') || url.endsWith('/sms/');
    const headers = { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) };
    const body = JSON.stringify(bodyOverride || (isLocal ? { number: `+1${phone}`, text } : { to: `+1${phone}`, message: text }));
    return { method: 'POST', headers, body, signal: AbortSignal.timeout(15000) };
  };
  try {
    const res = await fetchFn(targetUrl, buildReq(targetUrl));
    const data = await res.json().catch(() => ({}));
    return { ok: Boolean(res.ok && (data.stat !== false)), status: res.status, endpoint: targetUrl, data };
  } catch (err) {
    if (!targetUrl.includes(':9292')) return { ok: false, endpoint: targetUrl, data: null, error: err.message };
    const discovered = await discoverFn(9292);
    if (!discovered || discovered === targetUrl || !isTrustedPrivateOpenSmsUrl(discovered)) {
      return { ok: false, endpoint: targetUrl, data: null, error: err.message };
    }
    try {
      const retryRes = await fetchFn(discovered, buildReq(discovered));
      const retryData = await retryRes.json().catch(() => ({}));
      if (retryRes.ok) persistGatewayAtomically(configFilePath, discovered, apiKey);
      return { ok: Boolean(retryRes.ok && (retryData.stat !== false)), status: retryRes.status, endpoint: discovered, data: retryData, rediscovered: true };
    } catch (retryErr) {
      return { ok: false, endpoint: discovered, data: null, error: retryErr.message };
    }
  }
}
