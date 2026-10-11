import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/vip-dispatch.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Read vip-dispatch.html:', content.length, 'bytes');

// 1. Extract realtorFilers and clientCards
const realtorMatch = content.match(/const realtorFilers = (\[.*?\]);/s);
const clientMatch = content.match(/const clientCards = (\[.*?\]);/s);

if (!realtorMatch || !clientMatch) {
  console.error('Could not match realtorFilers or clientCards');
  process.exit(1);
}

const clientCards = JSON.parse(clientMatch[1]);
console.log('Original clientCards count:', clientCards.length);

// 2. Regenerate 5-star Google review request on all client cards
const directReviewUrl = "https://g.page/r/CaK5MZOz_FBtEBM/review";

clientCards.forEach(cl => {
  const addrPart = (cl.address && cl.address !== 'your home' && cl.address !== 'your property')
    ? ` at ${cl.address}`
    : '';
  const firstName = cl.first || (cl.name ? cl.name.split(' ')[0] : 'Valued Client');
  
  cl.first = firstName;
  cl.review_body = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! It was an absolute honor inspecting your home${addrPart}. As an independent Atlanta local business, our reputation is built on 5-star reviews from valued clients like you. Could you please take 30 seconds to give us a 5-star review on Google? ⭐ Tap here for instant access: ${directReviewUrl} - It means the world to our team! Thank you so much! Christopher Boykin, CMI® (678) 480-2110`;
  
  const cleanPhone = (cl.raw_phone || cl.phone || '').replace(/[^0-9]/g, '');
  cl.raw_phone = cleanPhone;
  cl.review_link = `sms:+1${cleanPhone}?&body=${encodeURIComponent(cl.review_body)}`;
});

console.log('Updated 5-star review request on all', clientCards.length, 'client cards.');

// 3. Ensure banner CSS is in <style>
const bannerCSS = `
    .sent-status-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(5, 150, 105, 0.12));
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 7px 11px;
      margin-bottom: 10px;
    }
    .sent-status-left {
      display: flex;
      align-items: center;
      gap: 7px;
      flex-wrap: wrap;
    }
    .sent-badge-pill {
      background: #059669;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 2.5px 8px;
      border-radius: 5px;
      letter-spacing: 0.4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .sent-time {
      font-size: 11px;
      color: #6ee7b7;
      font-weight: 600;
    }
    .btn-undo {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.22);
      color: #e2e8f0;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .btn-undo:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: #ef4444;
      color: #fca5a5;
    }
    .pending-status-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(245, 158, 11, 0.08);
      border: 1px dashed rgba(245, 158, 11, 0.4);
      border-radius: 8px;
      padding: 6px 11px;
      margin-bottom: 10px;
    }
    .pending-status-left {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pending-badge-pill {
      background: rgba(245, 158, 11, 0.25);
      color: #fbbf24;
      font-size: 10.5px;
      font-weight: 800;
      padding: 2.5px 7px;
      border-radius: 5px;
      letter-spacing: 0.3px;
    }
    .pending-time {
      font-size: 11px;
      color: #94a3b8;
    }
    .btn-mark-sent-manual {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .btn-mark-sent-manual:hover {
      background: #10b981;
      color: #0b0f19;
    }
  </style>`;

if (!content.includes('.sent-status-banner')) {
  content = content.replace('</style>', bannerCSS);
  console.log('Added banner CSS rules to <style>');
}

// 4. Ensure quickClientBar HTML markup is right before <div id="cardsContainer"></div>
const quickClientMarkup = `  <!-- Quick Manual Client Dispatch Accordion (Visible in Clients Mode) -->
  <div id="quickClientBar" style="display:none; background:#151c2e; border:1px solid #f59e0b; border-radius:10px; padding:12px; margin-bottom:12px; box-shadow:0 4px 15px rgba(245, 158, 11, 0.15);">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <span style="font-size:13px; font-weight:800; color:#f59e0b;">➕ Instant 5-Star SMS to Any Client (New or Unlisted)</span>
      <span style="font-size:10.5px; background:rgba(245, 158, 11, 0.2); color:#f59e0b; padding:2px 7px; border-radius:10px; font-weight:700;">DIRECT 5-STAR</span>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:6px;">
      <input type="text" id="quickClientName" placeholder="Client Name (e.g. Rachel)" style="background:#0d1322; border:1px solid #334155; color:#fff; padding:8px 10px; border-radius:6px; font-size:12px; outline:none;" />
      <input type="tel" id="quickClientPhone" placeholder="Cell Phone (e.g. 4045550199)" style="background:#0d1322; border:1px solid #334155; color:#fff; padding:8px 10px; border-radius:6px; font-size:12px; outline:none;" />
    </div>
    <input type="text" id="quickClientAddress" placeholder="Property Address (e.g. 520 Piedmont Ave, Atlanta GA)" style="width:100%; background:#0d1322; border:1px solid #334155; color:#fff; padding:8px 10px; border-radius:6px; font-size:12px; margin-bottom:8px; outline:none;" />
    <button onclick="dispatchQuickClient()" style="width:100%; background:linear-gradient(135deg, #10b981, #059669); color:#fff; font-weight:800; font-size:13px; padding:10px; border:none; border-radius:6px; cursor:pointer; box-shadow:0 3px 10px rgba(16, 185, 129, 0.3);">
      📲 1-Tap Text 5-Star Review Request to Client
    </button>
  </div>
  <div id="cardsContainer"></div>`;

if (!content.includes('id="quickClientBar"')) {
  content = content.replace('<div id="cardsContainer"></div>', quickClientMarkup);
  console.log('Inserted quickClientBar markup before cardsContainer');
}

// 5. Replace clientCards JSON array
content = content.replace(/const clientCards = \[.*?\];/s, `const clientCards = ${JSON.stringify(clientCards)};`);
console.log('Replaced clientCards in vip-dispatch.html');

// 6. Build updated script logic starting after clientCards
const scriptAfterClientCards = `
    let currentMode = 'realtors'; // 'realtors' or 'clients'
    let currentTab = 'uncontacted'; // 'uncontacted', 'contacted', 'all'
    let currentSort = 'date_desc';
    let currentCity = 'ALL';
    let searchQuery = '';
    let displayLimit = 80;

    // Helper function for formatted timestamps
    function getFormattedDateTime(d = new Date()) {
      try {
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const day = d.getDate();
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return \`\${month} \${day} at \${hours}:\${minutes} \${ampm}\`;
      } catch (e) {
        return 'Recently';
      }
    }

    // Realtor Sent Log & Set
    const realtorSentLog = JSON.parse(localStorage.getItem('foresight_sent_realtor_log') || '{}');
    const realtorSentSet = new Set(JSON.parse(localStorage.getItem('foresight_sent_sms') || '[]'));
    realtorFilers.forEach(f => {
      if (f.initial_sent) {
        realtorSentSet.add(f.id);
        if (!realtorSentLog[f.id]) {
          realtorSentLog[f.id] = { sentAt: null, displayDate: 'Sep 25, 2026' };
        }
      }
    });
    realtorSentSet.forEach(id => {
      if (!realtorSentLog[id]) {
        realtorSentLog[id] = { sentAt: null, displayDate: 'Previously Sent' };
      }
    });
    localStorage.setItem('foresight_sent_sms', JSON.stringify([...realtorSentSet]));
    localStorage.setItem('foresight_sent_realtor_log', JSON.stringify(realtorSentLog));

    // Client Sent Log & Set
    const clientSentLog = JSON.parse(localStorage.getItem('foresight_sent_client_log') || '{}');
    const clientSentSet = new Set(JSON.parse(localStorage.getItem('foresight_sent_client_sms') || '[]'));
    clientSentSet.forEach(id => {
      if (!clientSentLog[id]) {
        clientSentLog[id] = { sentAt: null, displayDate: 'Previously Sent' };
      }
    });
    Object.keys(clientSentLog).forEach(id => clientSentSet.add(id));
    localStorage.setItem('foresight_sent_client_sms', JSON.stringify([...clientSentSet]));
    localStorage.setItem('foresight_sent_client_log', JSON.stringify(clientSentLog));

    function toggleSent(id, mode = 'clients', event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      const isClient = mode === 'clients';
      const sentLog = isClient ? clientSentLog : realtorSentLog;
      const sentSet = isClient ? clientSentSet : realtorSentSet;
      const storageKey = isClient ? 'foresight_sent_client_sms' : 'foresight_sent_sms';
      const logKey = isClient ? 'foresight_sent_client_log' : 'foresight_sent_realtor_log';

      if (sentSet.has(id)) {
        // Toggle from Sent to Unsent (Undo)
        sentSet.delete(id);
        delete sentLog[id];
      } else {
        // Toggle from Unsent to Sent (Mark as Sent)
        sentSet.add(id);
        sentLog[id] = {
          sentAt: new Date().toISOString(),
          displayDate: getFormattedDateTime()
        };
      }

      localStorage.setItem(storageKey, JSON.stringify([...sentSet]));
      localStorage.setItem(logKey, JSON.stringify(sentLog));
      updateStats();
      renderCards();
    }

    function setMode(mode) {
      currentMode = mode;
      currentCity = 'ALL';
      displayLimit = 80;
      searchQuery = '';
      document.getElementById('searchInput').value = '';

      const btnR = document.getElementById('btnModeRealtors');
      const btnC = document.getElementById('btnModeClients');
      if (mode === 'realtors') {
        btnR.className = 'mode-btn active';
        btnC.className = 'mode-btn';
        document.getElementById('searchInput').placeholder = '🔍 Search agent, brokerage, address, or city...';
        const qb = document.getElementById('quickClientBar'); if (qb) qb.style.display = 'none';
      } else {
        btnR.className = 'mode-btn';
        btnC.className = 'mode-btn client-active';
        document.getElementById('searchInput').placeholder = '🔍 Search client name, address, or referring agent...';
        const qb = document.getElementById('quickClientBar'); if (qb) qb.style.display = 'block';
      }

      populateCityFilter();
      setTab(currentTab);
    }

    function populateCityFilter() {
      const select = document.getElementById('citySelect');
      const items = currentMode === 'realtors' ? realtorFilers : clientCards;
      const cities = Array.from(new Set(items.map(f => f.city).filter(Boolean))).sort();

      select.innerHTML = '<option value="ALL">All Cities (' + items.length + ')</option>';
      cities.forEach(city => {
        const count = items.filter(f => f.city === city).length;
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city + ' (' + count + ')';
        select.appendChild(opt);
      });
      select.value = currentCity;
    }

    function setTab(tab) {
      currentTab = tab;
      displayLimit = 80;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'uncontacted', 'contacted'));
      const activeBtn = document.getElementById(tab === 'uncontacted' ? 'tabUncontacted' : tab === 'contacted' ? 'tabContacted' : 'tabAll');
      if (activeBtn) {
        activeBtn.classList.add('active', tab);
      }
      
      const notice = document.getElementById('filterNotice');
      const entity = currentMode === 'realtors' ? 'listings' : 'homeowners';
      if (tab === 'uncontacted') {
        notice.innerHTML = \`<span>Showing <b>uncontacted</b> \${entity}. Tapping sends & archives card.</span>\`;
        notice.style.display = 'flex';
      } else if (tab === 'contacted') {
        notice.innerHTML = \`<span>Showing <b>already contacted</b> \${entity} archived in your log.</span>\`;
        notice.style.display = 'flex';
      } else {
        notice.style.display = 'none';
      }

      renderCards();
    }

    function setSort(sortVal) {
      currentSort = sortVal;
      displayLimit = 80;
      renderCards();
    }

    function setCity(cityVal) {
      currentCity = cityVal;
      displayLimit = 80;
      renderCards();
    }

    function handleSearch(val) {
      searchQuery = (val || '').toLowerCase().trim();
      displayLimit = 80;
      renderCards();
    }

    function loadMore() {
      displayLimit += 80;
      renderCards();
    }

    function updateStats() {
      const items = currentMode === 'realtors' ? realtorFilers : clientCards;
      const sentSet = currentMode === 'realtors' ? realtorSentSet : clientSentSet;
      const sentCount = items.filter(f => sentSet.has(f.id)).length;
      const uncontactedCount = items.length - sentCount;
      
      document.getElementById('sentCounter').textContent = sentCount;
      document.getElementById('remainingCount').textContent = uncontactedCount;
      document.getElementById('uncontactedTabCount').textContent = uncontactedCount;
      document.getElementById('contactedTabCount').textContent = sentCount;
      document.getElementById('allTabCount').textContent = items.length;
    }

    function markSent(id, smsLink, mode = 'realtors') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      let finalLink = smsLink;
      if (isIOS) {
        finalLink = finalLink.replace("?&body=", "&body=").replace("?body=", "&body=");
      } else {
        finalLink = finalLink.replace("?&body=", "?body=");
      }

      const isClient = mode === 'clients';
      const sentLog = isClient ? clientSentLog : realtorSentLog;
      const sentSet = isClient ? clientSentSet : realtorSentSet;
      const storageKey = isClient ? 'foresight_sent_client_sms' : 'foresight_sent_sms';
      const logKey = isClient ? 'foresight_sent_client_log' : 'foresight_sent_realtor_log';

      sentSet.add(id);
      sentLog[id] = {
        sentAt: new Date().toISOString(),
        displayDate: getFormattedDateTime()
      };
      localStorage.setItem(storageKey, JSON.stringify([...sentSet]));
      localStorage.setItem(logKey, JSON.stringify(sentLog));
      updateStats();

      const card = document.getElementById(id);
      if (card) {
        if (currentTab === 'uncontacted') {
          card.style.opacity = '0.3';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.remove();
            if (document.querySelectorAll('.card').length === 0) {
              renderCards();
            }
          }, 300);
        } else {
          renderCards();
        }
      }
      window.location.href = finalLink;
    }

    function copyReviewText(clientId) {
      const client = clientCards.find(c => c.id === clientId);
      if (!client) return;
      navigator.clipboard.writeText(client.review_body);
      const btn = document.getElementById("copyBtn_" + clientId);
      if (btn) {
        btn.textContent = "✅ Copied to Clipboard!";
        btn.style.color = "#10b981";
        setTimeout(() => {
          btn.textContent = "📋 Copy Review Text";
          btn.style.color = "#93c5fd";
        }, 2200);
      }
    }

    function dispatchQuickClient() {
      const name = (document.getElementById("quickClientName").value || "Valued Client").trim();
      const phone = (document.getElementById("quickClientPhone").value || "").trim();
      const addr = (document.getElementById("quickClientAddress").value || "your home").trim();
      if (!phone) {
        alert("Please enter a phone number for the client.");
        return;
      }
      const firstName = name.split(" ")[0];
      const addrPart = addr && addr !== 'your home' ? \` at \${addr}\` : '';
      const text = \`Hi \${firstName}, Christopher Boykin with Foresight Home Inspections here! It was an absolute honor inspecting your home\${addrPart}. As an independent Atlanta local business, our reputation is built on 5-star client trust. If our thorough two-inspector audit, infrared thermal scan, and report gave you peace of mind, would you take 30 seconds to share a quick 5-star review on Google? ⭐ Tap here for instant access: \${directReviewUrl} - Thank you so much! Christopher Boykin, CMI® (678) 480-2110\`;
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const smsLink = \`sms:+1\${cleanPhone}?&body=\${encodeURIComponent(text)}\`;
      
      const quickId = "quick_" + cleanPhone;
      clientSentSet.add(quickId);
      clientSentLog[quickId] = {
        sentAt: new Date().toISOString(),
        displayDate: getFormattedDateTime()
      };
      localStorage.setItem('foresight_sent_client_sms', JSON.stringify([...clientSentSet]));
      localStorage.setItem('foresight_sent_client_log', JSON.stringify(clientSentLog));
      updateStats();

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      let finalLink = smsLink;
      if (isIOS) {
        finalLink = \`sms:+1\${cleanPhone}&body=\${encodeURIComponent(text)}\`;
      }
      window.location.href = finalLink;
    }

    function renderCards() {
      updateStats();
      const container = document.getElementById('cardsContainer');
      const items = currentMode === 'realtors' ? realtorFilers : clientCards;
      const sentSet = currentMode === 'realtors' ? realtorSentSet : clientSentSet;

      let filtered = items;

      // 1. Tab filtering
      if (currentTab === 'uncontacted') {
        filtered = filtered.filter(f => !sentSet.has(f.id));
      } else if (currentTab === 'contacted') {
        filtered = filtered.filter(f => sentSet.has(f.id));
      }

      // 2. City dropdown filtering
      if (currentCity !== 'ALL') {
        filtered = filtered.filter(f => f.city === currentCity);
      }

      // 3. Search query filtering
      if (searchQuery) {
        filtered = filtered.filter(f => 
          (f.name && f.name.toLowerCase().includes(searchQuery)) ||
          (f.city && f.city.toLowerCase().includes(searchQuery)) ||
          (f.address && f.address.toLowerCase().includes(searchQuery)) ||
          (f.brokerage && f.brokerage.toLowerCase().includes(searchQuery)) ||
          (f.service && f.service.toLowerCase().includes(searchQuery)) ||
          (f.agent_name && f.agent_name.toLowerCase().includes(searchQuery)) ||
          (f.phone && f.phone.includes(searchQuery))
        );
      }

      // 4. Sorting logic
      filtered.sort((a, b) => {
        if (currentSort === 'city_asc') {
          const cityCmp = (a.city || '').localeCompare(b.city || '');
          if (cityCmp !== 0) return cityCmp;
          return (a.name || '').localeCompare(b.name || '');
        } else if (currentSort === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        } else if (currentSort === 'price_desc') {
          return (b.raw_price || 0) - (a.raw_price || 0);
        } else {
          const dateCmp = (b.date || '').localeCompare(a.date || '');
          if (dateCmp !== 0) return dateCmp;
          return (a.city || '').localeCompare(b.city || '');
        }
      });

      const totalMatches = filtered.length;
      const displayBatch = filtered.slice(0, displayLimit);

      if (displayBatch.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div style="font-size:36px; margin-bottom:12px;">🎉</div>
            <div style="font-size:16px; font-weight:800; color:#fff; margin-bottom:6px;">No \${currentMode === 'realtors' ? 'Listings' : 'Clients'} Found</div>
            <div>All caught up in this filter or no results matched your search.</div>
          </div>
        \`;
        return;
      }

      let html = '';
      if (currentMode === 'realtors') {
        html = displayBatch.map(f => {
          const isSent = sentSet.has(f.id);
          const sentInfo = realtorSentLog[f.id];
          const sentDateStr = sentInfo ? sentInfo.displayDate : '';
          return \`
            <div class="card \${isSent ? 'sent' : ''}" id="\${f.id}">
              <div class="card-top">
                <div>
                  <div class="card-title">\${f.name}</div>
                  <div class="card-subtitle">\${f.brokerage}</div>
                </div>
                <div>
                  \${f.price ? \`<span class="price-badge">\${f.price}</span>\` : \`<span class="badge">\${f.date}</span>\`}
                </div>
              </div>

              <div class="property-box">
                <div class="prop-addr">📍 \${f.address}</div>
                <div class="prop-city">\${f.city}, GA • Filed: \${f.date} • \${f.phone}</div>
              </div>

              <div class="preview-text">"\${f.text_body.replace('*Foresight Home Inspections*', '<strong style="color:#ffffff; font-weight:800;">Foresight Home Inspections</strong>').replace('https://fhinspectionsatl.com', \`<a href="https://fhinspectionsatl.com" target="_blank" style="color:#60a5fa; text-decoration:underline; font-weight:700;">fhinspectionsatl.com</a>\`)}"</div>

              <button class="btn-sms \${isSent ? 'sent' : ''}" onclick="markSent('\${f.id}', '\${f.sms_link}', 'realtors')">
                \${isSent ? \`✓ Text Sent (\${sentDateStr || 'Logged'}) • Tap to Re-Send\` : '📱 1-Tap Text ' + f.first + ' (' + f.phone + ')'}
              </button>
            </div>
          \`;
        }).join('');
      } else {
        // Client / Homeowner Cards
        html = displayBatch.map(cl => {
          const isSent = sentSet.has(cl.id);
          const sentInfo = clientSentLog[cl.id];
          const sentDateStr = sentInfo ? sentInfo.displayDate : '';
          return \`
            <div class="card \${isSent ? 'sent' : 'pending'}" id="\${cl.id}">
              \${isSent ? \`
                <div class="sent-status-banner">
                  <div class="sent-status-left">
                    <span class="sent-badge-pill">✅ 5-STAR REVIEW TEXT SENT</span>
                    <span class="sent-time">📅 Sent: <b>\${sentDateStr || 'Recorded in Log'}</b></span>
                  </div>
                  <button class="btn-undo" onclick="toggleSent('\${cl.id}', 'clients', event)" title="Click to move back to Ready to Text">
                    ↩️ Mark Unsent
                  </button>
                </div>
              \` : \`
                <div class="pending-status-banner">
                  <div class="pending-status-left">
                    <span class="pending-badge-pill">🟡 READY TO TEXT</span>
                    <span class="pending-time">Not contacted yet</span>
                  </div>
                  <button class="btn-mark-sent-manual" onclick="toggleSent('\${cl.id}', 'clients', event)" title="Mark as sent if already contacted">
                    ✓ Mark Sent
                  </button>
                </div>
              \`}

              <div class="card-top">
                <div>
                  <div class="card-title">👤 \${cl.name}</div>
                  <div class="card-subtitle">\${cl.service || 'Past Home Inspection Client'}</div>
                </div>
                <div>
                  \${cl.date ? \`<span class="badge">📅 \${cl.date}</span>\` : ''}
                  \${cl.price ? \`<span class="price-badge" style="margin-left:4px;">\${cl.price}</span>\` : ''}
                </div>
              </div>

              <div class="property-box client-prop-box">
                <div class="prop-addr">🏡 \${cl.address}</div>
                <div class="prop-city">\${cl.city}, GA • \${cl.phone}</div>
              </div>

              \${cl.agent_name ? \`
                <div class="agent-rep-box">
                  <span>🤝 Buyer's Agent: <b>\${cl.agent_name}</b> \${cl.agent_phone ? '• ' + cl.agent_phone : ''}</span>
                  \${cl.agent_sms_link ? \`<a class="btn-agent-text" href="\${cl.agent_sms_link}">📱 Text Agent</a>\` : ''}
                </div>
              \` : ''}

              <div class="preview-text" style="border:1px solid rgba(245, 158, 11, 0.45); background:rgba(245, 158, 11, 0.08); padding:9px 10px; border-radius:8px; margin-bottom:9px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="color:#f59e0b; font-weight:800; font-size:12px;">⭐ REQUEST TO GIVE US A 5-STAR REVIEW (SMS Preview):</span>
                  <a href="\${directReviewUrl}" target="_blank" style="color:#f59e0b; font-size:11px; text-decoration:underline; font-weight:700;">Test Link &rarr;</a>
                </div>
                <div style="color:#f3f4f6; font-size:12px; line-height:1.5;">"\${cl.review_body.replace('*Foresight Home Inspections*', '<strong style=\\"color:#ffffff; font-weight:800;\\">Foresight Home Inspections</strong>').replace('give us a 5-star review on Google? ⭐', '<strong style=\\"color:#f59e0b; background:rgba(245, 158, 11, 0.2); padding:1px 4px; border-radius:3px; font-weight:800;\\">GIVE US A 5-STAR REVIEW ON GOOGLE? ⭐</strong>').replace(directReviewUrl, \`<a href=\\"\${directReviewUrl}\\" target=\\"_blank\\" style=\\"color:#f59e0b; text-decoration:underline; font-weight:800;\\">Direct Google 5-Star Review Dialog</a>\`)}"</div>
              </div>

              <button class="btn-sms \${isSent ? 'sent' : ''}" style="\${isSent ? 'background:#13261e; color:#34d399; border:1px solid #10b981; font-weight:800; font-size:13.5px; padding:11px 12px; margin-bottom:7px;' : 'background:linear-gradient(135deg, #f59e0b, #d97706); color:#0b0f19; font-weight:800; font-size:13.5px; padding:11px 12px; margin-bottom:7px; box-shadow:0 4px 14px rgba(245, 158, 11, 0.35);'}" onclick="markSent('\${cl.id}', '\${cl.review_link}', 'clients')">
                \${isSent ? \`✅ 5-Star SMS Sent (\${sentDateStr || 'Logged'}) • Tap to Re-Send\` : \`⭐ 1-Tap Text 5-Star Review Request to \${cl.first} (\${cl.phone})\`}
              </button>

              <div class="btn-dual-row">
                <button class="btn-sub-action" style="background:#1e293b; color:#93c5fd; border:1px solid #3b82f6;" onclick="copyReviewText('\${cl.id}')" id="copyBtn_\${cl.id}">
                  📋 Copy Review Text
                </button>
                <button class="btn-sub-action btn-warranty" onclick="markSent('\${cl.id}', '\${cl.warranty_link}', 'clients')">
                  🛠️ 1-Tap Warranty/Checkup
                </button>
              </div>
            </div>
          \`;
        }).join('');
      }

      if (totalMatches > displayLimit) {
        html += \`
          <button class="load-more-btn" onclick="loadMore()">
            ⬇️ Load Next 80 Cards (Showing \${displayLimit} of \${totalMatches})
          </button>
        \`;
      }

      container.innerHTML = html;
    }

    populateCityFilter();
    renderCards();
  </script>
</body>
</html>
`;

// Replace everything from `let currentMode = 'realtors';` to end of file
const splitIdx = content.indexOf("let currentMode = 'realtors';");
if (splitIdx !== -1) {
  content = content.slice(0, splitIdx) + scriptAfterClientCards;
  console.log('Successfully spliced updated script logic');
} else {
  console.error("Could not find start of script logic: let currentMode = 'realtors';");
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Wrote updated vip-dispatch.html successfully!');
