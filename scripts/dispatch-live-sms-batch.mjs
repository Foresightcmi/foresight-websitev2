import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const UNDER_CONTRACT_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const OPENSMS_LOG_FILE = path.join(ROOT_DIR, 'data', 'opensms-outreach-log.json');
const OUTREACH_LOG_FILE = path.join(ROOT_DIR, 'data', 'due-diligence-outreach-log.json');
const OPENSMS_CONFIG_FILE = path.join(ROOT_DIR, 'data', 'opensms-config.json');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

function getOpenSmsConfig() {
  let apiKey = (process.env.OPENSMS_API_KEY || '').trim();
  let gatewayUrl = (process.env.OPENSMS_URL || '').trim();

  if (fs.existsSync(ENV_LOCAL_FILE)) {
    const content = fs.readFileSync(ENV_LOCAL_FILE, 'utf8');
    const km = content.match(/OPENSMS_API_KEY=(.+)/);
    const um = content.match(/OPENSMS_URL=(.+)/);
    if (!apiKey && km) apiKey = km[1].trim();
    if (!gatewayUrl && um) gatewayUrl = um[1].trim();
  }
  if (fs.existsSync(OPENSMS_CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(OPENSMS_CONFIG_FILE, 'utf8'));
      if (!apiKey && cfg.apiKey) apiKey = cfg.apiKey.trim();
      if (!gatewayUrl && cfg.gatewayUrl) gatewayUrl = cfg.gatewayUrl.trim();
    } catch {}
  }
  return {
    apiKey: apiKey || 'osms_N4M32OxKt0NeBRr0ATFqKVy4eWQZ2NwAR6alBJTQG-o',
    gatewayUrl: gatewayUrl || 'http://192.168.1.71:9292/sms/'
  };
}

const args = process.argv.slice(2);
let batchLimit = 10;
const batchArg = args.find(a => a.startsWith('--batch=') || a.startsWith('-b='));
if (batchArg) {
  const parsed = parseInt(batchArg.split('=')[1], 10);
  if (!isNaN(parsed) && parsed > 0) batchLimit = parsed;
}

const SPACING_MS = 20000; // 20s carrier-safe spacing

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dispatchPushAlert(sentList) {
  try {
    const summary = sentList.map(s => `• ${s.name} (${s.city}) - ${s.phone}`).join('\n');
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': `${sentList.length} Due Diligence SMS Sent via OpenSMS`,
        'Priority': 'default',
        'Tags': 'speech_balloon,briefcase'
      },
      body: `Successfully dispatched live VIP SMS to ${sentList.length} Buyer Agents:\n${summary}`
    });
  } catch (err) {
    console.warn('⚠️ Push notification note:', err.message);
  }
}

async function run() {
  const { apiKey, gatewayUrl } = getOpenSmsConfig();
  console.log('🚀 [Live SMS Dispatcher] Initializing Batch Run via Android OpenSMS...');
  console.log(`📱 Gateway: ${gatewayUrl}`);
  console.log(`📦 Batch Limit: ${batchLimit}`);

  if (!fs.existsSync(UNDER_CONTRACT_FILE)) {
    console.error('❌ Missing data/under-contract-realtors.json');
    return;
  }

  const filers = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));

  let openSmsLog = [];
  if (fs.existsSync(OPENSMS_LOG_FILE)) {
    try {
      openSmsLog = JSON.parse(fs.readFileSync(OPENSMS_LOG_FILE, 'utf8'));
    } catch {}
  }
  const contactedPhones = new Set(openSmsLog.map(l => (l.to || '').replace(/\D/g, '').slice(-10)));

  let outreachLog = [];
  if (fs.existsSync(OUTREACH_LOG_FILE)) {
    try {
      outreachLog = JSON.parse(fs.readFileSync(OUTREACH_LOG_FILE, 'utf8'));
    } catch {}
  }

  // Filter for uncontacted Buyer Agents in active 0-4 day Due Diligence window (strict freshness gate)
  const nowMs = Date.now();
  const candidateDeals = filers.filter(f => {
    // 1. Strict Freshness Gate: ONLY contracts signed in the last 4 days (active 5-day due diligence window)
    if (!f.date) return false;
    const dealDate = new Date(f.date).getTime();
    const ageDays = (nowMs - dealDate) / (1000 * 60 * 60 * 24);
    if (ageDays < 0 || ageDays > 4.5) return false;

    // 2. Valid Phone & Not Self
    const p = (f.clean_phone || f.raw_phone || f.phone || '').replace(/\D/g, '').slice(-10);
    if (p.length !== 10 || p === '6788780215' || p === '6784802110') return false;
    if (contactedPhones.has(p)) return false;

    // 3. Suppression List
    if (/ansley|chapman group/i.test(f.brokerage || '') || /amy fuchs|joe chapman/i.test(f.name || '')) return false;

    return true;
  });

  const targets = candidateDeals.slice(0, batchLimit);
  console.log(`📋 Found ${candidateDeals.length} uncontacted deals. Dispatching top ${targets.length} in this batch.\n`);

  const sentSuccessfully = [];

  for (let i = 0; i < targets.length; i++) {
    const r = targets[i];
    const cleanPhone = (r.clean_phone || r.raw_phone || r.phone || '').replace(/\D/g, '').slice(-10);
    const firstName = r.first || (r.name ? r.name.trim().split(' ')[0] : 'there');
    const roleTag = r.role === 'BUYER_AGENT' ? "Buyer's Agent" : 'Listing Agent';

    const message = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! Saw ${r.address} in ${r.city} just went under contract—congratulations! If your buyers need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report, we have a slot open in ${r.city}: https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(r.address || '')} — (678) 480-2110`;

    console.log(`[${i + 1}/${targets.length}] 📤 Sending to ${r.name} (${roleTag}) at +1${cleanPhone}...`);
    console.log(`     Property: ${r.address}, ${r.city}`);

    try {
      const res = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          number: `+1${cleanPhone}`,
          text: message
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.stat === true) {
        console.log(`     ✅ Sent successfully! (Response: stat=true)`);
        sentSuccessfully.push({
          name: r.name,
          phone: cleanPhone,
          address: r.address,
          city: r.city,
          role: r.role
        });

        contactedPhones.add(cleanPhone);

        openSmsLog.push({
          id: `sms_${Date.now()}_${cleanPhone}`,
          leadId: r.id,
          to: `+1${cleanPhone}`,
          targetName: r.name,
          address: r.address,
          city: r.city,
          role: r.role || 'BUYER_AGENT',
          gateway: 'DasLearning-Local-9292',
          status: 'sent',
          timestamp: new Date().toISOString()
        });
        fs.writeFileSync(OPENSMS_LOG_FILE, JSON.stringify(openSmsLog, null, 2), 'utf8');

        outreachLog.push({
          key: `SMS_${r.id}_${cleanPhone}`,
          type: 'UNDER_CONTRACT_SMS',
          role: r.role || 'BUYER_AGENT',
          targetName: r.name,
          brokerage: r.brokerage,
          address: r.address,
          city: r.city,
          phone: cleanPhone,
          date: r.date,
          timestamp: new Date().toISOString()
        });
        fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

      } else {
        console.warn(`     ❌ Failed to send (HTTP ${res.status}):`, data);
      }
    } catch (sendErr) {
      console.error(`     ❌ Error connecting to phone:`, sendErr.message);
      break;
    }

    if (i < targets.length - 1) {
      console.log(`     ⏳ Waiting ${SPACING_MS / 1000}s carrier spacing...\n`);
      await sleep(SPACING_MS);
    }
  }

  console.log(`\n🏁 [Live SMS Dispatcher] Batch completed: ${sentSuccessfully.length}/${targets.length} sent.`);

  if (sentSuccessfully.length > 0) {
    await dispatchPushAlert(sentSuccessfully);
  }
}

run();
