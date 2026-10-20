import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('data/under-contract-realtors.json');
const fullFilers = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Load historical outreach logs so we NEVER display or text the same person twice
const outreachLogPath = path.resolve('data/due-diligence-outreach-log.json');
const openSmsLogPath = path.resolve('data/opensms-outreach-log.json');
const outreachLog = fs.existsSync(outreachLogPath) ? JSON.parse(fs.readFileSync(outreachLogPath, 'utf8')) : [];
const openSmsLog = fs.existsSync(openSmsLogPath) ? JSON.parse(fs.readFileSync(openSmsLogPath, 'utf8')) : [];

const contactedPhones = new Set([
  ...openSmsLog.map(o => String(o.to || '').replace(/\D/g, '').slice(-10)).filter(p => p.length === 10),
  ...outreachLog.map(o => String(o.phone || '').replace(/\D/g, '').slice(-10)).filter(p => p.length === 10)
]);
const contactedNames = new Set([
  ...outreachLog.map(o => String(o.targetName || '').trim().toLowerCase()).filter(Boolean),
  ...openSmsLog.map(o => String(o.targetName || '').trim().toLowerCase()).filter(Boolean)
]);
const contactedEmails = new Set([
  ...outreachLog.map(o => String(o.email || '').trim().toLowerCase()).filter(Boolean)
]);

const sortedFilers = [...fullFilers].sort((a, b) => {
  const dCmp = (b.date || '').localeCompare(a.date || '');
  if (dCmp !== 0) return dCmp;
  if (a.role === 'BUYER_AGENT' && b.role !== 'BUYER_AGENT') return -1;
  if (b.role === 'BUYER_AGENT' && a.role !== 'BUYER_AGENT') return 1;
  return (b.raw_price || 0) - (a.raw_price || 0);
});

const seenPhones = new Set();
const seenNames = new Set();
const seenEmails = new Set();

// Filter valid 10-digit phone agents, strictly deduplicate per person, and keep up to 150 brand-new Due Diligence deals
const validFilers = [];
for (const f of sortedFilers) {
  const cleanPhone = (f.clean_phone || f.raw_phone || f.phone || '').replace(/[^0-9]/g, '').slice(-10);
  if (cleanPhone.length !== 10 || cleanPhone === '6788780215' || cleanPhone === '6784802110') continue;
  if (!f.name || /non-mls|nmls|unrepresented/i.test(f.name)) continue;
  if (/ansley|chapman group/i.test(f.brokerage || '') || /amy fuchs|joe chapman/i.test(f.name || '')) continue;

  const normName = f.name.trim().toLowerCase();
  const normEmail = String(f.email || '').trim().toLowerCase();

  // Exclude if already contacted in historical logs or already added in this batch
  if (contactedPhones.has(cleanPhone) || contactedNames.has(normName) || (normEmail && contactedEmails.has(normEmail))) continue;
  if (seenPhones.has(cleanPhone) || seenNames.has(normName) || (normEmail && seenEmails.has(normEmail))) continue;

  seenPhones.add(cleanPhone);
  seenNames.add(normName);
  if (normEmail) seenEmails.add(normEmail);
  validFilers.push(f);
  if (validFilers.length >= 150) break;
}

const minifiedFilers = validFilers.map(f => ({
  id: f.id,
  role: f.role || 'LIST_AGENT',
  name: f.name,
  first: f.first || (f.name ? f.name.trim().split(' ')[0] : 'there'),
  phone: f.phone,
  clean_phone: f.clean_phone || (f.raw_phone || f.phone || '').replace(/[^0-9]/g, ''),
  brokerage: f.brokerage || 'Real Estate Professional',
  city: f.city || 'Metro Atlanta',
  address: f.address || 'Property Under Contract',
  price: f.price || '',
  raw_price: f.raw_price || 0,
  date: f.date || ''
}));

console.log(`Minified top ${minifiedFilers.length} due diligence records for lightweight delivery.`);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Under Contract Due Diligence Dispatch - Foresight Home Inspections</title>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #151c2e;
      --card-border: #232f48;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --accent-red: #ef4444;
      --accent-green: #10b981;
      --accent-blue: #3b82f6;
      --accent-gold: #f59e0b;
      --accent-purple: #a855f7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      padding: 12px;
      padding-bottom: 90px;
      max-width: 680px;
      margin: 0 auto;
    }
    .header {
      position: sticky;
      top: 0;
      background: rgba(11, 15, 25, 0.98);
      backdrop-filter: blur(14px);
      padding: 10px 0 8px 0;
      border-bottom: 1px solid var(--card-border);
      z-index: 100;
      margin-bottom: 12px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .title {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .title span { color: var(--accent-gold); }
    .badge-live {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid var(--accent-green);
      color: var(--accent-green);
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .dot {
      width: 7px;
      height: 7px;
      background-color: var(--accent-green);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-green);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* VIP Realtor Portal Link Button in Header */
    .realtor-portal-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 8px;
      text-decoration: none;
      color: #fff;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    .realtor-portal-banner:hover, .realtor-portal-banner:active {
      border-color: var(--accent-gold);
      background: rgba(30, 41, 59, 1);
    }
    .realtor-portal-banner .gold-text {
      color: var(--accent-gold);
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .realtor-portal-banner .arrow-tag {
      background: var(--accent-gold);
      color: #000;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
    }

    /* Progress Stats Bar */
    .stats-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 10px;
    }
    .stats-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .stat-numbers { font-size: 14px; font-weight: 800; color: #fff; }
    .stat-numbers .highlight { color: var(--accent-green); }
    .progress-track {
      width: 100%;
      height: 8px;
      background: #0d1322;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      width: 0%;
      transition: width 0.3s ease;
    }

    /* Search & Filter Controls */
    .controls-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 8px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .search-input {
      width: 100%;
      background: #0d1322;
      border: 1px solid var(--card-border);
      color: #fff;
      padding: 9px 12px;
      border-radius: 7px;
      font-size: 13px;
      outline: none;
    }
    .search-input:focus { border-color: var(--accent-gold); }
    .select-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .select-ctrl {
      width: 100%;
      background: #0d1322;
      border: 1px solid var(--card-border);
      color: #f3f4f6;
      padding: 7px 8px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      outline: none;
    }

    /* Tabs */
    .tabs-nav {
      display: flex;
      gap: 4px;
      background: #111827;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      margin-bottom: 8px;
    }
    .tab-btn {
      flex: 1;
      padding: 8px 4px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-muted);
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
    }
    .tab-btn.active.live {
      background: #7f1d1d;
      color: #fca5a5;
    }
    .tab-btn.active.contacted {
      background: #064e3b;
      color: #6ee7b7;
    }
    .tab-btn.active.archive {
      background: #334155;
      color: #cbd5e1;
    }

    .filter-notice {
      background: rgba(16, 185, 129, 0.1);
      border-left: 3px solid var(--accent-green);
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 11.5px;
      color: #a7f3d0;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Cards */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 13px;
      margin-bottom: 12px;
      transition: all 0.2s ease;
    }
    .card.sent {
      border-color: rgba(16, 185, 129, 0.5);
      background: #0d1e1a;
      opacity: 0.9;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .agent-name {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .agent-brokerage {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
      line-height: 1.3;
    }
    .badge-date {
      background: #1f293d;
      color: #93c5fd;
      font-size: 10.5px;
      font-weight: 600;
      padding: 3px 7px;
      border-radius: 5px;
      white-space: nowrap;
    }
    .badge-price {
      background: #064e3b;
      color: #34d399;
      font-size: 11.5px;
      font-weight: 700;
      padding: 3px 6px;
      border-radius: 5px;
      margin-left: 4px;
    }
    .property-box {
      background: #0d1322;
      border-left: 3px solid var(--accent-red);
      padding: 7px 10px;
      border-radius: 4px;
      margin: 8px 0;
      font-size: 12px;
    }
    .prop-addr { font-weight: 700; color: #fff; }
    .prop-city { color: var(--text-muted); font-size: 11px; margin-top: 2px; }

    /* SMS Preview Box */
    .preview-box {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 7px;
      padding: 8px 10px;
      margin: 8px 0;
      font-size: 11.5px;
      color: #e2e8f0;
      line-height: 1.45;
    }
    .preview-tag {
      color: var(--accent-blue);
      font-weight: 800;
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .preview-box a {
      color: #60a5fa;
      text-decoration: underline;
      font-weight: 700;
    }

    /* Status Banner */
    .sent-status-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid var(--accent-green);
      color: #6ee7b7;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      margin: 8px 0;
    }
    .btn-toggle-unsent {
      background: transparent;
      border: 1px solid #6ee7b7;
      color: #6ee7b7;
      font-size: 10.5px;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
    }

    /* Action Buttons */
    .btn-primary-sms {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 800;
      padding: 12px 14px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      border: none;
      cursor: pointer;
      margin-top: 6px;
    }
    .btn-primary-sms:active {
      transform: scale(0.98);
      background: #047857;
    }
    .btn-primary-sms.sent {
      background: #1b2e26;
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: none;
    }

    .btn-action-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 6px;
      margin-top: 6px;
    }
    .btn-buyer-pass {
      background: #1e3a8a;
      color: #93c5fd;
      border: 1px solid #3b82f6;
      padding: 8px 10px;
      font-size: 11.5px;
      font-weight: 700;
      border-radius: 6px;
      text-decoration: none;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .btn-buyer-pass:active { background: #172554; }
    .btn-call {
      background: #1f293d;
      color: #60a5fa;
      border: 1px solid #3b82f6;
      padding: 8px 12px;
      font-size: 11.5px;
      font-weight: 700;
      border-radius: 6px;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-mark-toggle {
      background: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-mark-toggle:hover {
      background: #334155;
      color: #fff;
    }

    .load-more-btn {
      width: 100%;
      padding: 12px;
      background: #1f293d;
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      border-radius: 8px;
      font-weight: 800;
      font-size: 13.5px;
      cursor: pointer;
      margin-top: 10px;
      text-align: center;
    }

    .empty-state {
      text-align: center;
      padding: 40px 15px;
      color: var(--text-muted);
      font-size: 14px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-top">
      <div class="title">
        ⚡ FORESIGHT <span>DUE DILIGENCE DISPATCH</span>
      </div>
      <div class="badge-live">
        <div class="dot"></div> LIVE CONTRACTS
      </div>
    </div>

    <!-- Quick Access to VIP Realtor Perks Hub -->
    <a href="/realtors#gar-tool" class="realtor-portal-banner" target="_blank">
      <span class="gold-text">🏛️ VIP Realtor Partner Perks Portal</span>
      <span class="arrow-tag">GAR Form F404 Tool ↗</span>
    </a>

    <!-- Autonomous OpenSMS Gateway Control Bar -->
    <div class="stats-card" style="border-color: rgba(16, 185, 129, 0.45); background: linear-gradient(135deg, rgba(6, 78, 59, 0.35), rgba(15, 23, 42, 0.95));">
      <div class="stats-row" style="margin-bottom: 6px;">
        <span style="font-size: 12px; font-weight: 800; color: #34d399; display: flex; align-items: center; gap: 5px;">
          🤖 Autonomous OpenSMS Engine (:9292 / Cloud)
        </span>
        <span id="openSmsStatusBadge" style="font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 12px; background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.4);">
          Checking Gateway...
        </span>
      </div>
      <div style="display: flex; gap: 6px; margin-bottom: 6px;">
        <input type="password" id="openSmsKeyInput" class="search-input" style="padding: 6px 10px; font-size: 11.5px; flex: 1;" placeholder="Paste OpenSMS API Key (from Start Server)">
        <input type="text" id="openSmsUrlInput" class="search-input" style="padding: 6px 8px; font-size: 11px; width: 145px;" placeholder="Phone IP (e.g. 192.168.1.50)">
        <button type="button" onclick="saveOpenSmsKey()" style="background: #10b981; color: #0b0f19; font-weight: 800; font-size: 11.5px; padding: 6px 10px; border: none; border-radius: 6px; cursor: pointer; white-space: nowrap;">
          Connect
        </button>
      </div>
      <div style="display: flex; gap: 6px;">
        <button type="button" id="btnAutoPilot" onclick="toggleAutoPilotBatch()" style="flex: 1; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b0f19; font-weight: 800; font-size: 12px; padding: 8px 10px; border: none; border-radius: 6px; cursor: pointer;">
          ⚡ Auto-Dispatch Top 10 Due Diligence SMS Now
        </button>
      </div>
      <div id="autoPilotLog" style="font-size: 11px; color: #a7f3d0; margin-top: 5px; display: none;"></div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-card">
      <div class="stats-row">
        <span class="stat-label">Due Diligence Agent Outreach:</span>
        <span class="stat-numbers">
          <span class="highlight" id="sentCountDisplay">0</span> / <span id="totalCountDisplay">${minifiedFilers.length.toLocaleString()}</span> Contacted
        </span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" id="progressBar"></div>
      </div>
    </div>

    <!-- Search & City Select -->
    <div class="controls-panel">
      <input type="text" class="search-input" id="searchInput" placeholder="🔍 Search agent, address, city, brokerage, phone..." oninput="handleSearch(this.value)">
      <div class="select-row">
        <select class="select-ctrl" id="sortSelect" onchange="setSort(this.value)">
          <option value="date_desc">📅 Date (Newest First)</option>
          <option value="price_desc">💰 Price (High to Low)</option>
          <option value="city_asc">🏙️ City (A to Z)</option>
          <option value="name_asc">👤 Agent Name (A to Z)</option>
        </select>
        <select class="select-ctrl" id="citySelect" onchange="setCity(this.value)">
          <option value="ALL">📍 All Cities (${minifiedFilers.length.toLocaleString()})</option>
        </select>
      </div>
    </div>

    <!-- Smart Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active live" id="tabLive" onclick="setTab('live')">
        🔥 Top 150 Due Diligence (<span id="liveTabCount">0</span>)
      </button>
      <button class="tab-btn" id="tabContacted" onclick="setTab('contacted')">
        ✅ Sent (<span id="contactedTabCount">0</span>)
      </button>
      <button class="tab-btn" id="tabArchive" onclick="setTab('archive')">
        📋 All 150 (<span id="archiveTabCount">0</span>)
      </button>
    </div>
  </div>

  <div class="filter-notice" id="filterNotice">
    <span>Showing <b>up to 150 brand-new unique FMLS Pending / Under-Contract agents</b> in active due diligence (100% deduplicated per person).</span>
  </div>

  <div id="cardsContainer"></div>

  <script>
    const underContractFilers = ${JSON.stringify(minifiedFilers)};

    // State Persistence across localStorage
    const STORAGE_KEY = 'foresight_due_diligence_sent_v1';
    const OPENSMS_KEY_STORAGE = 'foresight_opensms_api_key';
    const OPENSMS_URL_STORAGE = 'foresight_opensms_gateway_url';
    let sentMap = {}; // { cardId / PHONE_xxx / NAME_xxx: timestamp }
    let openSmsKey = localStorage.getItem(OPENSMS_KEY_STORAGE) || '';
    let openSmsGatewayUrl = localStorage.getItem(OPENSMS_URL_STORAGE) || '';
    let openSmsServerConfigured = false;
    let autoPilotRunning = false;

    try {
      const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (typeof loaded === 'object' && loaded !== null && !Array.isArray(loaded)) {
        sentMap = loaded;
      }
      const legacy = localStorage.getItem('foresight_sent_sms');
      if (legacy) {
        try {
          const arr = JSON.parse(legacy);
          if (Array.isArray(arr)) {
            arr.forEach(id => {
              if (id && !sentMap[id]) sentMap[id] = 'Sent previously';
            });
          }
        } catch(e) {}
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sentMap));
    } catch(e) {
      console.warn('Storage error', e);
    }

    let currentTab = 'live';
    let currentCity = 'ALL';
    let currentSort = 'date_desc';
    let searchQuery = '';
    let displayLimit = 150;

    async function checkOpenSmsStatus() {
      const badge = document.getElementById('openSmsStatusBadge');
      const input = document.getElementById('openSmsKeyInput');
      const urlInput = document.getElementById('openSmsUrlInput');
      if (openSmsKey && input) input.value = openSmsKey;
      if (openSmsGatewayUrl && urlInput) urlInput.value = openSmsGatewayUrl;
      try {
        const res = await fetch('/api/open-sms');
        const data = await res.json();
        if (data.configured || openSmsKey) {
          openSmsServerConfigured = true;
          badge.textContent = '🟢 OpenSMS Active (' + (data.maskedKey || 'Connected') + ')';
          badge.style.background = 'rgba(16, 185, 129, 0.2)';
          badge.style.color = '#6ee7b7';
          badge.style.borderColor = '#10b981';
        } else {
          badge.textContent = '🟡 Paste OpenSMS Key to Enable Auto-Pilot';
        }
      } catch {
        if (openSmsKey) {
          badge.textContent = '🟢 OpenSMS Key Saved Locally';
          badge.style.background = 'rgba(16, 185, 129, 0.2)';
          badge.style.color = '#6ee7b7';
          badge.style.borderColor = '#10b981';
        } else {
          badge.textContent = '🟡 Native SMS Mode';
        }
      }
    }

    async function saveOpenSmsKey() {
      const val = (document.getElementById('openSmsKeyInput').value || '').trim();
      let rawUrl = (document.getElementById('openSmsUrlInput').value || '').trim();
      if (!val || val.length < 4) {
        alert('Please paste the API Key from your OpenSMS Android app (shown when you tap Start Server).');
        return;
      }
      if (rawUrl && !rawUrl.startsWith('http')) {
        rawUrl = 'http://' + rawUrl + (rawUrl.includes(':') ? '' : ':9292') + '/sms/';
      }
      openSmsKey = val;
      openSmsGatewayUrl = rawUrl;
      localStorage.setItem(OPENSMS_KEY_STORAGE, val);
      localStorage.setItem(OPENSMS_URL_STORAGE, rawUrl);
      try {
        await fetch('/api/open-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_key', apiKey: val, gatewayUrl: rawUrl })
        });
      } catch {}
      await checkOpenSmsStatus();
      renderCards();
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sentMap));
      } catch(e) {}
    }

    function isSent(id) {
      const card = underContractFilers.find(c => c.id === id);
      if (card) {
        const phoneKey = card.clean_phone ? 'PHONE_' + card.clean_phone : '';
        const nameKey = card.name ? 'NAME_' + card.name.toLowerCase().trim() : '';
        if (phoneKey && sentMap[phoneKey]) return true;
        if (nameKey && sentMap[nameKey]) return true;
      }
      return Boolean(sentMap[id]);
    }

    function recordPersonSent(id, cleanPhone, name, statusText) {
      sentMap[id] = statusText;
      if (cleanPhone) sentMap['PHONE_' + cleanPhone] = statusText;
      if (name) sentMap['NAME_' + String(name).toLowerCase().trim()] = statusText;
    }

    async function markSent(id, smsLink, cleanPhone, textBody, name, address, role) {
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      if (openSmsServerConfigured || openSmsKey) {
        // 1. Try direct local Android phone OpenSMS server first if running on phone or same LAN
        const directTarget = openSmsGatewayUrl || 'http://127.0.0.1:9292/sms/';
        try {
          const directRes = await fetch(directTarget, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + openSmsKey
            },
            body: JSON.stringify({ number: '+1' + cleanPhone, text: textBody })
          });
          if (directRes.ok) {
            recordPersonSent(id, cleanPhone, name, 'OpenSMS Sent ' + nowStr);
            saveState();
            renderStats();
            renderCards();
            return true;
          }
        } catch {}

        // 2. Fallback to Next.js /api/open-sms bridge
        try {
          const res = await fetch('/api/open-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: openSmsKey,
              gatewayUrl: openSmsGatewayUrl,
              to: cleanPhone,
              message: textBody,
              leadId: id,
              targetName: name,
              address: address,
              role: role
            })
          });
          const data = await res.json();
          if (res.ok && data.ok) {
            recordPersonSent(id, cleanPhone, name, 'OpenSMS Sent ' + nowStr);
            saveState();
            renderStats();
            renderCards();
            return true;
          }
        } catch (e) {
          console.warn('OpenSMS fallback to native:', e);
        }
      }
      recordPersonSent(id, cleanPhone, name, 'Sent ' + nowStr);
      saveState();
      renderStats();
      renderCards();
      if (smsLink) {
        window.location.href = smsLink;
      }
      return false;
    }

    async function toggleAutoPilotBatch() {
      if (autoPilotRunning) {
        autoPilotRunning = false;
        document.getElementById('btnAutoPilot').textContent = '⚡ Auto-Dispatch Top 10 Due Diligence SMS Now';
        return;
      }
      if (!openSmsServerConfigured && !openSmsKey) {
        alert('Paste the API key from your OpenSMS Android app (when you tap Start Server) in the box above first!');
        return;
      }
      const nowMs = Date.now();
      const uncontacted = underContractFilers.filter(c => {
        if (isSent(c.id) || !c.clean_phone || c.clean_phone.length !== 10) return false;
        if (!c.date) return false;
        const ageDays = (nowMs - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24);
        return ageDays >= 0 && ageDays <= 4.5;
      }).slice(0, 10);

      if (uncontacted.length === 0) {
        alert('All active Due Diligence listings (≤ 4 days old) have already been contacted!');
        return;
      }
      autoPilotRunning = true;
      const logEl = document.getElementById('autoPilotLog');
      const btn = document.getElementById('btnAutoPilot');
      logEl.style.display = 'block';

      for (let i = 0; i < uncontacted.length; i++) {
        if (!autoPilotRunning) break;
        const f = uncontacted[i];
        const isDeKalb = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|chamblee|clarkston|doraville|avondale/i.test(f.city || '') || /dekalb/i.test(f.address || '');
        const dekalbTag = isDeKalb ? ', plus on-site DeKalb Low-Flow Certificate ($100)' : '';
        const textBody = f.role === 'BUYER_AGENT'
          ? 'Hi ' + f.first + ', congrats on getting your buyers under contract at ' + f.address + ' in ' + f.city + '! Christopher Boykin, CMI with Foresight Home Inspections here. If your buyers need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report' + dekalbTag + ', we have a slot open in ' + f.city + ': https://fhinspectionsatl.com/quote?prop=' + encodeURIComponent(f.address) + ' — (678) 480-2110'
          : 'Hi ' + f.first + ', Christopher Boykin with Foresight Home Inspections here! Saw ' + f.address + ' in ' + f.city + ' is under contract—congratulations! If your buyers or co-op agent need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report delivery' + dekalbTag + ', we have a slot open in ' + f.city + ' this week. Best wishes on a smooth closing! — (678) 480-2110 | https://fhinspectionsatl.com/realtors';

        btn.textContent = '⏹️ Stop Auto-Pilot (' + (i + 1) + '/' + uncontacted.length + ' Dispatched)';
        logEl.textContent = '📤 Dispatching via OpenSMS to ' + f.name + ' (' + f.address + ')...';
        await markSent(f.id, '', f.clean_phone, textBody, f.name, f.address, f.role);

        if (i < uncontacted.length - 1 && autoPilotRunning) {
          for (let sec = 25; sec > 0; sec--) {
            if (!autoPilotRunning) break;
            logEl.textContent = '✅ Sent to ' + f.name + '. Safe carrier pacing: next text in ' + sec + 's...';
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      }
      autoPilotRunning = false;
      btn.textContent = '⚡ Auto-Dispatch Top 10 Due Diligence SMS Now';
      logEl.textContent = '🎉 Auto-Pilot Batch Complete! All queued via OpenSMS.';
    }

    function toggleSent(id) {
      const card = underContractFilers.find(c => c.id === id);
      const phoneKey = card && card.clean_phone ? 'PHONE_' + card.clean_phone : '';
      const nameKey = card && card.name ? 'NAME_' + card.name.toLowerCase().trim() : '';
      if (isSent(id)) {
        delete sentMap[id];
        if (phoneKey) delete sentMap[phoneKey];
        if (nameKey) delete sentMap[nameKey];
      } else {
        const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        recordPersonSent(id, card ? card.clean_phone : '', card ? card.name : '', 'Sent ' + nowStr);
      }
      saveState();
      renderStats();
      renderCards();
    }

    function setTab(tab) {
      currentTab = tab;
      document.getElementById('tabLive').className = 'tab-btn' + (tab === 'live' ? ' active live' : '');
      document.getElementById('tabContacted').className = 'tab-btn' + (tab === 'contacted' ? ' active contacted' : '');
      document.getElementById('tabArchive').className = 'tab-btn' + (tab === 'archive' ? ' active archive' : '');
      
      const notice = document.getElementById('filterNotice');
      if (tab === 'live') {
        notice.innerHTML = 'Showing <b>up to 150 brand-new unique FMLS under-contract agents in active 5-day due diligence window</b> (100% deduplicated per person).';
      } else if (tab === 'contacted') {
        notice.innerHTML = 'Showing <b>contacted agents</b>. Timestamp shown below.';
      } else {
        notice.innerHTML = 'Showing <b>all 150 brand-new unique due diligence listings</b> (both uncontacted and sent).';
      }
      displayLimit = 150;
      renderCards();
    }

    function setCity(city) {
      currentCity = city;
      displayLimit = 150;
      renderCards();
    }

    function setSort(sort) {
      currentSort = sort;
      renderCards();
    }

    function handleSearch(val) {
      searchQuery = (val || '').toLowerCase().trim();
      displayLimit = 150;
      renderCards();
    }

    function loadMore() {
      displayLimit += 150;
      renderCards();
    }

    function populateCityFilter() {
      const cityCounts = {};
      underContractFilers.forEach(c => {
        const city = c.city ? c.city.trim() : 'Metro Atlanta';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });

      const select = document.getElementById('citySelect');
      const sortedCities = Object.keys(cityCounts).sort((a,b) => cityCounts[b] - cityCounts[a]);
      
      select.innerHTML = '<option value="ALL">📍 All Cities (' + underContractFilers.length.toLocaleString() + ')</option>' +
        sortedCities.map(city => '<option value="' + city + '">' + city + ' (' + cityCounts[city] + ')</option>').join('');
    }

    function renderStats() {
      const total = underContractFilers.length;
      let sentCount = 0;
      underContractFilers.forEach(c => {
        if (isSent(c.id)) sentCount++;
      });
      const uncontactedCount = total - sentCount;

      const sentEl = document.getElementById('sentCountDisplay');
      const totalEl = document.getElementById('totalCountDisplay');
      const liveEl = document.getElementById('liveTabCount');
      const contactedEl = document.getElementById('contactedTabCount');
      const archiveEl = document.getElementById('archiveTabCount');

      if (sentEl) sentEl.textContent = sentCount.toLocaleString();
      if (totalEl) totalEl.textContent = total.toLocaleString();
      if (liveEl) liveEl.textContent = uncontactedCount.toLocaleString();
      if (contactedEl) contactedEl.textContent = sentCount.toLocaleString();
      if (archiveEl) archiveEl.textContent = total.toLocaleString();

      const pct = total > 0 ? Math.round((sentCount / total) * 100) : 0;
      const barEl = document.getElementById('progressBar');
      if (barEl) barEl.style.width = pct + '%';
    }

    function renderCards() {
      const container = document.getElementById('cardsContainer');
      let filtered = underContractFilers;

      // 1. Tab filter
      if (currentTab === 'live' || currentTab === 'uncontacted') {
        filtered = filtered.filter(c => !isSent(c.id));
      } else if (currentTab === 'contacted') {
        filtered = filtered.filter(c => isSent(c.id));
      }

      // 2. City filter
      if (currentCity !== 'ALL') {
        filtered = filtered.filter(c => (c.city || '').trim() === currentCity);
      }

      // 3. Search query
      if (searchQuery) {
        filtered = filtered.filter(c => 
          (c.name && c.name.toLowerCase().includes(searchQuery)) ||
          (c.city && c.city.toLowerCase().includes(searchQuery)) ||
          (c.address && c.address.toLowerCase().includes(searchQuery)) ||
          (c.phone && c.phone.includes(searchQuery)) ||
          (c.brokerage && c.brokerage.toLowerCase().includes(searchQuery))
        );
      }

      // 4. Sort
      filtered.sort((a, b) => {
        if (currentSort === 'price_desc') {
          return (b.raw_price || 0) - (a.raw_price || 0);
        } else if (currentSort === 'city_asc') {
          const cCmp = (a.city || '').localeCompare(b.city || '');
          if (cCmp !== 0) return cCmp;
          return (a.name || '').localeCompare(b.name || '');
        } else if (currentSort === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        } else {
          const dCmp = (b.date || '').localeCompare(a.date || '');
          if (dCmp !== 0) return dCmp;
          return (b.raw_price || 0) - (a.raw_price || 0);
        }
      });

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <h3>🎉 No Under-Contract Listings Found</h3>
            <p style="margin-top:6px; font-size:12px;">Try adjusting your search query, city filter, or tab selection.</p>
          </div>
        \`;
        return;
      }

      const totalMatches = filtered.length;
      const displayBatch = filtered.slice(0, displayLimit);

      const html = displayBatch.map(f => {
        const sent = isSent(f.id);
        const sentTime = sentMap[f.id] || 'Sent';

        // Dynamically synthesize text and links
        const isDeKalb = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|chamblee|clarkston|doraville|avondale/i.test(f.city || '') || /dekalb/i.test(f.address || '');
        const dekalbTag = isDeKalb ? ' + DeKalb Low-Flow Certificate ($100)' : '';
        const isBuyerAgent = f.role === 'BUYER_AGENT';

        const textBody = isBuyerAgent
          ? 'Hi ' + f.first + ', congrats on getting your buyers under contract at ' + f.address + ' in ' + f.city + '! Christopher Boykin, CMI with Foresight Home Inspections here. If your buyers need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report' + dekalbTag + ', we have a slot open in ' + f.city + ': https://fhinspectionsatl.com/quote?prop=' + encodeURIComponent(f.address) + ' — (678) 480-2110'
          : 'Hi ' + f.first + ', Christopher Boykin with Foresight Home Inspections here! Saw ' + f.address + ' in ' + f.city + ' is under contract—congratulations! If your buyers or co-op agent need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report delivery' + dekalbTag + ', we have a slot open in ' + f.city + ' this week. Best wishes on a smooth closing! — (678) 480-2110 | https://fhinspectionsatl.com/realtors';
        const smsLink = 'sms:+1' + f.clean_phone + '?&body=' + encodeURIComponent(textBody);

        const buyerBody = 'Hi ' + f.first + ', here is our 1-click due diligence scheduler and $35,000 warranty certificate for your buyers at ' + f.address + ': https://fhinspectionsatl.com/quote?prop=' + encodeURIComponent(f.address) + ' — Includes our two-inspector team, same-day report' + (isDeKalb ? ', official DeKalb Low-Flow Certificate ($100),' : '') + ', and free utility setup concierge. Feel free to pass this directly to your buyers so they can lock in their inspection date today!';
        const buyerLink = 'sms:+1' + f.clean_phone + '?&body=' + encodeURIComponent(buyerBody);

        const roleBadge = isBuyerAgent
          ? '<span style="background:rgba(16,185,129,0.2); border:1px solid #10b981; color:#6ee7b7; padding:1px 6px; border-radius:4px; font-size:10px; font-weight:800; margin-left:4px;">🎯 BUYER\\\'S AGENT</span>'
          : '<span style="background:rgba(245,158,11,0.18); border:1px solid #f59e0b; color:#fcd34d; padding:1px 6px; border-radius:4px; font-size:10px; font-weight:700; margin-left:4px;">🏡 LISTING AGENT</span>';

        const safeTextJs = textBody.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
        const safeNameJs = (f.name || '').replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
        const safeAddrJs = (f.address || '').replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");

        return \`
          <div class="card \\\${sent ? 'sent' : ''}" id="\\\${f.id}">
            <div class="card-top">
              <div>
                <div class="agent-name">
                  👤 \\\${f.name}
                  \\\${roleBadge}
                  \\\${isDeKalb ? '<span style="background:rgba(59,130,246,0.18); border:1px solid #3b82f6; color:#93c5fd; padding:1px 6px; border-radius:4px; font-size:10px; font-weight:700; margin-left:4px;">🏛️ DeKalb Low-Flow ($100)</span>' : ''}
                </div>
                <div class="agent-brokerage">\\\${f.brokerage || 'Real Estate Professional'}</div>
              </div>
              <div>
                <span class="badge-date">📅 \\\${f.date || ''}</span>
                \\\${f.price ? \\\`<span class="badge-price">\\\${f.price}</span>\\\` : ''}
              </div>
            </div>

            <div class="property-box">
              <div class="prop-addr">📍 \\\${f.address || 'Property Under Contract'}</div>
              <div class="prop-city">\\\${f.city ? f.city + ', GA • ' : ''}\\\${f.phone}</div>
            </div>

            <!-- Due Diligence Message Preview -->
            <div class="preview-box">
              <div class="preview-tag">⚡ Under Contract Due Diligence SMS:</div>
              "\${textBody}"
            </div>

            \${sent ? \`
              <div class="sent-status-banner">
                <span>✓ \${sentTime}</span>
                <button class="btn-toggle-unsent" onclick="toggleSent('\${f.id}')">Mark Unsent</button>
              </div>
            \` : ''}

            <!-- Primary Action: 1-Tap Due Diligence SMS -->
            <button class="btn-primary-sms \${sent ? 'sent' : ''}" onclick="markSent('\${f.id}', '\${smsLink}', '\${f.clean_phone}', '\${safeTextJs}', '\${safeNameJs}', '\${safeAddrJs}', '\${f.role || 'LIST_AGENT'}')">
              \${sent ? '✓ Resend Due Diligence SMS (' + f.phone + ')' : ((openSmsServerConfigured || openSmsKey) ? '🤖 Silent OpenSMS Dispatch to ' + f.first + ' (' + f.phone + ')' : '📱 1-Tap Due Diligence Text ' + f.first + ' (' + f.phone + ')')}
            </button>

            <!-- Secondary Actions: Buyer Forward Pass & Call -->
            <div class="btn-action-row">
              <a class="btn-buyer-pass" href="\${buyerLink}">
                📲 1-Tap Buyer Forward Pass
              </a>
              <a class="btn-call" href="tel:\${f.clean_phone}">
                📞 Call
              </a>
              <button class="btn-mark-toggle" onclick="toggleSent('\${f.id}')">
                \${sent ? 'Unsent' : '✓ Sent'}
              </button>
            </div>
          </div>
        \`;
      }).join('');

      let footerHtml = '';
      if (totalMatches > displayLimit) {
        footerHtml = \`
          <button class="load-more-btn" onclick="loadMore()">
            ⬇️ Load Next 60 Contacts (Showing \${displayLimit} of \${totalMatches.toLocaleString()})
          </button>
        \`;
      }

      container.innerHTML = html + footerHtml;
    }

    // Init
    populateCityFilter();
    renderStats();
    renderCards();
    checkOpenSmsStatus();
  </script>
</body>
</html>`;

fs.writeFileSync('public/vip-dispatch.html', htmlContent, 'utf8');
console.log('Successfully generated public/vip-dispatch.html!');
console.log('Lightweight file size:', (htmlContent.length / 1024).toFixed(1), 'KB');
