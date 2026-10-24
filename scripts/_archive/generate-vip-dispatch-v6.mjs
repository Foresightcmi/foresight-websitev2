import fs from 'fs';
import path from 'path';

// Read past clients
const clientsPath = path.resolve('data/past-clients.json');
const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));

console.log(`Loaded ${clients.length} past clients from ${clientsPath}`);

// Verify every client has the exact 5-star Google review link and copy
const directReviewUrl = "https://g.page/r/CaK5MZOz_FBtEBM/review";

clients.forEach((cl) => {
  const firstName = cl.first || (cl.name ? cl.name.trim().split(' ')[0] : 'Valued Client');
  cl.first = firstName;

  const addrPart = (cl.address && cl.address !== 'your home' && cl.address !== 'your property')
    ? ` at ${cl.address}`
    : '';

  const cleanPhone = (cl.raw_phone || cl.phone || '').replace(/[^0-9]/g, '');
  cl.raw_phone = cleanPhone;

  cl.review_body = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! It was an absolute honor inspecting your home${addrPart}. As an independent Atlanta local business, our reputation is built on 5-star reviews from valued clients like you. Could you please take 30 seconds to give us a 5-star review on Google? ⭐ Tap here for instant access: ${directReviewUrl} - It means the world to our team! Thank you so much! Christopher Boykin, CMI® (678) 480-2110`;
  cl.review_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(cl.review_body)}`;

  const cityPart = cl.city ? ` in ${cl.city}` : '';
  cl.warranty_body = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! Checking in on your home${addrPart}${cityPart}. If you are approaching your 1-year builder warranty deadline or need an annual roof/crawlspace checkup before the season shifts, we have slots open this week. Best wishes! — (678) 480-2110 | https://fhinspectionsatl.com`;
  cl.warranty_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(cl.warranty_body)}`;
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Foresight VIP 5-Star Review Dispatch</title>
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
      font-size: 16px;
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
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .dot {
      width: 7px;
      height: 7px;
      background-color: var(--accent-gold);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-gold);
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
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
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
    .tab-btn.active.uncontacted {
      background: #1e3a8a;
      color: #93c5fd;
    }
    .tab-btn.active.contacted {
      background: #064e3b;
      color: #6ee7b7;
    }
    .tab-btn.active.all {
      background: var(--card-border);
      color: #fff;
    }

    .filter-notice {
      background: rgba(245, 158, 11, 0.1);
      border-left: 3px solid var(--accent-gold);
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 11.5px;
      color: #fde68a;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Client Cards */
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
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .client-name {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .client-service {
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
      font-size: 11px;
      font-weight: 700;
      padding: 3px 6px;
      border-radius: 5px;
      margin-left: 4px;
    }
    .property-box {
      background: #0d1322;
      border-left: 3px solid var(--accent-gold);
      padding: 7px 10px;
      border-radius: 4px;
      margin: 8px 0;
      font-size: 12px;
    }
    .prop-addr { font-weight: 700; color: #fff; }
    .prop-city { color: var(--text-muted); font-size: 11px; margin-top: 2px; }

    .agent-rep-box {
      background: rgba(59, 130, 246, 0.08);
      border: 1px dashed rgba(59, 130, 246, 0.4);
      padding: 6px 9px;
      border-radius: 5px;
      font-size: 11px;
      color: #93c5fd;
      margin: 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-agent-text {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      border: 1px solid #3b82f6;
      font-size: 11px;
      padding: 3px 7px;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      font-weight: 700;
    }

    /* SMS Preview Box */
    .preview-box {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 7px;
      padding: 8px 10px;
      margin: 8px 0;
      font-size: 11.5px;
      color: #e2e8f0;
      line-height: 1.45;
    }
    .preview-tag {
      color: var(--accent-gold);
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
    .btn-review-sms {
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
    .btn-review-sms:active {
      transform: scale(0.98);
      background: #047857;
    }
    .btn-review-sms.sent {
      background: #1b2e26;
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: none;
    }

    .btn-secondary-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 6px;
      margin-top: 6px;
    }
    .btn-warranty {
      background: #312e81;
      color: #c7d2fe;
      border: 1px solid #4338ca;
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
    .btn-mark-toggle {
      background: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
      padding: 8px 12px;
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
        ⭐ FORESIGHT <span>5-STAR REVIEWS</span>
      </div>
      <div class="badge-live">
        <div class="dot"></div> 459 CLIENTS
      </div>
    </div>

    <!-- Quick Access to VIP Realtor Perks Hub -->
    <a href="/realtors#gar-tool" class="realtor-portal-banner" target="_blank">
      <span class="gold-text">🏛️ VIP Realtor Partner Perks Portal</span>
      <span class="arrow-tag">GAR Form F404 Tool ↗</span>
    </a>

    <!-- Stats Bar -->
    <div class="stats-card">
      <div class="stats-row">
        <span class="stat-label">Google 5-Star Reviews Progress:</span>
        <span class="stat-numbers">
          <span class="highlight" id="sentCountDisplay">0</span> / <span id="totalCountDisplay">459</span> Sent
        </span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" id="progressBar"></div>
      </div>
    </div>

    <!-- Search & City Select -->
    <div class="controls-panel">
      <input type="text" class="search-input" id="searchInput" placeholder="🔍 Search client name, street, city, phone, agent..." oninput="handleSearch(this.value)">
      <div class="select-row">
        <select class="select-ctrl" id="sortSelect" onchange="setSort(this.value)">
          <option value="date_desc">📅 Date (Newest)</option>
          <option value="name_asc">👤 Client Name (A-Z)</option>
          <option value="city_asc">🏙️ City (A-Z)</option>
        </select>
        <select class="select-ctrl" id="citySelect" onchange="setCity(this.value)">
          <option value="ALL">📍 All Cities (459)</option>
        </select>
      </div>
    </div>

    <!-- Smart Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active uncontacted" id="tabUncontacted" onclick="setTab('uncontacted')">
        🔥 Ready to Text (<span id="uncontactedTabCount">0</span>)
      </button>
      <button class="tab-btn" id="tabContacted" onclick="setTab('contacted')">
        ✅ Sent (<span id="contactedTabCount">0</span>)
      </button>
      <button class="tab-btn" id="tabAll" onclick="setTab('all')">
        All (<span id="allTabCount">0</span>)
      </button>
    </div>
  </div>

  <div class="filter-notice" id="filterNotice">
    <span>Showing <b>uncontacted clients</b>. Tapping 1-Tap SMS copies text, opens native SMS, and marks card as sent.</span>
  </div>

  <div id="cardsContainer"></div>

  <script>
    const directReviewUrl = "https://g.page/r/CaK5MZOz_FBtEBM/review";
    const clientCards = ${JSON.stringify(clients)};

    // State Persistence across localStorage
    const STORAGE_KEY = 'foresight_client_reviews_sent_v6';
    let sentMap = {}; // { clientId: timestamp }

    try {
      // Load modern v6 store
      const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (typeof loaded === 'object' && loaded !== null && !Array.isArray(loaded)) {
        sentMap = loaded;
      }
      
      // Also migrate from legacy arrays if present
      const legacyArrays = [
        localStorage.getItem('foresight_sent_client_reviews'),
        localStorage.getItem('foresight_sent_sms')
      ];
      legacyArrays.forEach(leg => {
        if (leg) {
          try {
            const arr = JSON.parse(leg);
            if (Array.isArray(arr)) {
              arr.forEach(id => {
                if (id && !sentMap[id]) {
                  sentMap[id] = 'Sent previously';
                }
              });
            }
          } catch(e) {}
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sentMap));
    } catch(e) {
      console.warn('Storage error', e);
    }

    let currentTab = 'uncontacted'; // 'uncontacted' | 'contacted' | 'all'
    let currentCity = 'ALL';
    let currentSort = 'date_desc';
    let searchQuery = '';
    let displayLimit = 60;

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sentMap));
      } catch(e) {}
    }

    function isSent(id) {
      return Boolean(sentMap[id]);
    }

    function markSent(id, smsLink) {
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      sentMap[id] = 'Sent ' + nowStr;
      saveState();
      renderStats();
      renderCards();
      if (smsLink) {
        window.location.href = smsLink;
      }
    }

    function toggleSent(id) {
      if (sentMap[id]) {
        delete sentMap[id];
      } else {
        const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        sentMap[id] = 'Sent ' + nowStr;
      }
      saveState();
      renderStats();
      renderCards();
    }

    function setTab(tab) {
      currentTab = tab;
      document.getElementById('tabUncontacted').className = 'tab-btn' + (tab === 'uncontacted' ? ' active uncontacted' : '');
      document.getElementById('tabContacted').className = 'tab-btn' + (tab === 'contacted' ? ' active contacted' : '');
      document.getElementById('tabAll').className = 'tab-btn' + (tab === 'all' ? ' active all' : '');
      
      const notice = document.getElementById('filterNotice');
      if (tab === 'uncontacted') {
        notice.innerHTML = 'Showing <b>uncontacted clients</b>. Tapping 1-Tap SMS opens native SMS and marks as sent.';
      } else if (tab === 'contacted') {
        notice.innerHTML = 'Showing <b>contacted clients</b>. Review timestamps shown below.';
      } else {
        notice.innerHTML = 'Showing <b>all 459 past clients</b>.';
      }
      displayLimit = 60;
      renderCards();
    }

    function setCity(city) {
      currentCity = city;
      displayLimit = 60;
      renderCards();
    }

    function setSort(sort) {
      currentSort = sort;
      renderCards();
    }

    function handleSearch(val) {
      searchQuery = (val || '').toLowerCase().trim();
      displayLimit = 60;
      renderCards();
    }

    function loadMore() {
      displayLimit += 60;
      renderCards();
    }

    function populateCityFilter() {
      const cityCounts = {};
      clientCards.forEach(c => {
        const city = c.city ? c.city.trim() : 'Metro Atlanta';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });

      const select = document.getElementById('citySelect');
      const sortedCities = Object.keys(cityCounts).sort((a,b) => a.localeCompare(b));
      
      select.innerHTML = '<option value="ALL">📍 All Cities (' + clientCards.length + ')</option>' +
        sortedCities.map(city => '<option value="' + city + '">' + city + ' (' + cityCounts[city] + ')</option>').join('');
    }

    function renderStats() {
      const total = clientCards.length;
      let sentCount = 0;
      clientCards.forEach(c => {
        if (isSent(c.id)) sentCount++;
      });
      const uncontactedCount = total - sentCount;

      document.getElementById('sentCountDisplay').textContent = sentCount;
      document.getElementById('totalCountDisplay').textContent = total;
      document.getElementById('uncontactedTabCount').textContent = uncontactedCount;
      document.getElementById('contactedTabCount').textContent = sentCount;
      document.getElementById('allTabCount').textContent = total;

      const pct = Math.round((sentCount / total) * 100);
      document.getElementById('progressBar').style.width = pct + '%';
    }

    function renderCards() {
      const container = document.getElementById('cardsContainer');
      let filtered = clientCards;

      // 1. Tab filter
      if (currentTab === 'uncontacted') {
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
          (c.agent_name && c.agent_name.toLowerCase().includes(searchQuery)) ||
          (c.service && c.service.toLowerCase().includes(searchQuery))
        );
      }

      // 4. Sort
      filtered.sort((a, b) => {
        if (currentSort === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        } else if (currentSort === 'city_asc') {
          const cCmp = (a.city || '').localeCompare(b.city || '');
          if (cCmp !== 0) return cCmp;
          return (a.name || '').localeCompare(b.name || '');
        } else {
          return (b.date || '').localeCompare(a.date || '');
        }
      });

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <h3>🎉 No Clients Found</h3>
            <p style="margin-top:6px; font-size:12px;">Try adjusting your search query, city filter, or tab selection.</p>
          </div>
        \`;
        return;
      }

      const totalMatches = filtered.length;
      const displayBatch = filtered.slice(0, displayLimit);

      const html = displayBatch.map(cl => {
        const sent = isSent(cl.id);
        const sentTime = sentMap[cl.id] || 'Sent';

        return \`
          <div class="card \${sent ? 'sent' : ''}" id="\${cl.id}">
            <div class="card-top">
              <div>
                <div class="client-name">👤 \${cl.name}</div>
                <div class="client-service">\${cl.service || 'Past Home Inspection Client'}</div>
              </div>
              <div>
                <span class="badge-date">📅 \${cl.date || ''}</span>
                \${cl.price ? \`<span class="badge-price">\${cl.price}</span>\` : ''}
              </div>
            </div>

            <div class="property-box">
              <div class="prop-addr">🏡 \${cl.address || 'Property Inspected'}</div>
              <div class="prop-city">\${cl.city ? cl.city + ', GA • ' : ''}\${cl.phone}</div>
            </div>

            \${cl.agent_name ? \`
              <div class="agent-rep-box">
                <span>🤝 Buyer's Agent: <b>\${cl.agent_name}</b> \${cl.agent_phone ? '• ' + cl.agent_phone : ''}</span>
                \${cl.agent_sms_link ? \`<a class="btn-agent-text" href="\${cl.agent_sms_link}">📱 Text Agent</a>\` : ''}
              </div>
            \` : ''}

            <!-- 5-Star Review Request Preview -->
            <div class="preview-box">
              <div class="preview-tag">⭐ 5-Star Google Review SMS Text:</div>
              "\${cl.review_body.replace(directReviewUrl, '<a href=\"' + directReviewUrl + '\" target=\"_blank\">' + directReviewUrl + '</a>')}"
            </div>

            \${sent ? \`
              <div class="sent-status-banner">
                <span>✓ \${sentTime}</span>
                <button class="btn-toggle-unsent" onclick="toggleSent('\${cl.id}')">Mark Unsent</button>
              </div>
            \` : ''}

            <!-- Primary Action: 1-Tap 5-Star Google Review SMS -->
            <button class="btn-review-sms \${sent ? 'sent' : ''}" onclick="markSent('\${cl.id}', '\${cl.review_link}')">
              \${sent ? '✓ Resend 5-Star Review SMS (' + cl.phone + ')' : '⭐ 1-Tap 5-Star Review SMS (' + cl.phone + ')'}
            </button>

            <!-- Secondary Actions -->
            <div class="btn-secondary-row">
              <a class="btn-warranty" href="\${cl.warranty_link}">
                🛠️ 1-Tap Warranty/Checkup SMS
              </a>
              <button class="btn-mark-toggle" onclick="toggleSent('\${cl.id}')">
                \${sent ? 'Mark Unsent' : '✓ Mark Sent'}
              </button>
            </div>
          </div>
        \`;
      }).join('');

      let footerHtml = '';
      if (totalMatches > displayLimit) {
        footerHtml = \`
          <button class="load-more-btn" onclick="loadMore()">
            ⬇️ Load Next 60 Clients (Showing \${displayLimit} of \${totalMatches})
          </button>
        \`;
      }

      container.innerHTML = html + footerHtml;
    }

    // Init
    populateCityFilter();
    renderStats();
    renderCards();
  </script>
</body>
</html>`;

fs.writeFileSync('public/vip-dispatch.html', htmlContent, 'utf8');
console.log('Successfully generated public/vip-dispatch.html!');
console.log('New file size:', (htmlContent.length / 1024).toFixed(1), 'KB');

// Also update public/dispatch.html redirect so it points directly to vip-dispatch.html without delay
const dispatchRedirect = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Foresight VIP 5-Star Review Dispatch</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="refresh" content="0; url=/vip-dispatch.html">
  <script>
    window.location.replace('/vip-dispatch.html');
  </script>
</head>
<body style="background:#0b0f19; color:#f3f4f6; font-family:sans-serif; text-align:center; padding-top:40px;">
  <p>Loading Foresight VIP 5-Star Review Dispatch...</p>
</body>
</html>`;

fs.writeFileSync('public/dispatch.html', dispatchRedirect, 'utf8');
console.log('Successfully updated public/dispatch.html!');
