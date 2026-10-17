import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'opensms-config.json');
const LOG_PATH = path.join(process.cwd(), 'data', 'opensms-outreach-log.json');

function getOpenSmsConfig(providedKey, providedUrl) {
  let apiKey = providedKey ? String(providedKey).trim() : (process.env.OPENSMS_API_KEY || '').trim();
  let gatewayUrl = providedUrl ? String(providedUrl).trim() : (process.env.OPENSMS_URL || '').trim();

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      if (!apiKey && cfg.apiKey) apiKey = String(cfg.apiKey).trim();
      if (!gatewayUrl && cfg.gatewayUrl) gatewayUrl = String(cfg.gatewayUrl).trim();
    }
  } catch {}
  return { apiKey, gatewayUrl };
}

function normalizePhoneE164(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

export async function GET() {
  const { apiKey, gatewayUrl } = getOpenSmsConfig();
  let totalDispatched = 0;
  try {
    if (fs.existsSync(LOG_PATH)) {
      const log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
      if (Array.isArray(log)) totalDispatched = log.length;
    }
  } catch {}

  return NextResponse.json({
    configured: Boolean(apiKey || gatewayUrl),
    maskedKey: apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : null,
    gatewayUrl: gatewayUrl || null,
    totalDispatched
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, apiKey, gatewayUrl, to, message, leadId, targetName, address, role } = body || {};

    if (action === 'save_key') {
      const cleanKey = String(apiKey || '').trim();
      const cleanUrl = String(gatewayUrl || '').trim();
      if (!cleanKey && !cleanUrl) {
        return NextResponse.json(
          { error: 'Provide your OpenSMS API key (and optional Phone IP:9292 URL).' },
          { status: 400 }
        );
      }
      try {
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
        fs.writeFileSync(
          CONFIG_PATH,
          JSON.stringify({ apiKey: cleanKey, gatewayUrl: cleanUrl, updatedAt: new Date().toISOString() }, null, 2),
          'utf8'
        );
      } catch {}
      return NextResponse.json({
        ok: true,
        configured: true,
        maskedKey: cleanKey ? `${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}` : 'Saved',
        gatewayUrl: cleanUrl || null
      });
    }

    const cfg = getOpenSmsConfig(apiKey, gatewayUrl);
    if (!cfg.apiKey && !cfg.gatewayUrl) {
      return NextResponse.json(
        {
          error: 'OpenSMS API key not configured yet.',
          configured: false
        },
        { status: 400 }
      );
    }

    const e164 = normalizePhoneE164(to);
    if (!e164 || !message) {
      return NextResponse.json(
        { error: 'Valid 10-digit US phone number and message are required.' },
        { status: 400 }
      );
    }

    const targetEndpoint = cfg.gatewayUrl
      ? (cfg.gatewayUrl.endsWith('/sms/') ? cfg.gatewayUrl : `${cfg.gatewayUrl.replace(/\/+$/, '')}/sms/`)
      : 'https://opensms.dev/api/v1/messages';

    const isDasLearning = targetEndpoint.includes(':9292') || targetEndpoint.endsWith('/sms/');
    const headers = { 'Content-Type': 'application/json' };
    if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;

    const payload = isDasLearning
      ? { number: e164, text: String(message).trim() }
      : { to: e164, message: String(message).trim() };

    const res = await fetch(targetEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.detail || data.error || data.message || `OpenSMS HTTP ${res.status}`,
          details: data
        },
        { status: res.status }
      );
    }

    try {
      let logs = [];
      if (fs.existsSync(LOG_PATH)) {
        logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
      }
      logs.push({
        id: data.id || leadId || `sms_${Date.now()}`,
        leadId: leadId || null,
        to: e164,
        targetName: targetName || null,
        address: address || null,
        role: role || 'DUE_DILIGENCE_AGENT',
        gateway: isDasLearning ? 'DasLearning-Local-9292' : 'OpenSMS-Cloud',
        status: data.stat === true ? 'sent' : (data.status || 'pending'),
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2), 'utf8');
    } catch {}

    return NextResponse.json({
      ok: true,
      id: data.id || `sms_${Date.now()}`,
      status: data.stat === true ? 'sent' : (data.status || 'pending'),
      to: e164
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
