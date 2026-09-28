import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const vipDispatchPath = path.join(projectRoot, 'public', 'vip-dispatch.html');
const dispatchPath = path.join(projectRoot, 'public', 'dispatch.html');

console.log('Reading public/vip-dispatch.html...');
let html = fs.readFileSync(vipDispatchPath, 'utf8');

// 1. Add CSS for sent & pending status banners and enhance card styling
const cssToInsert = `
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
`;

if (!html.includes('.sent-status-banner')) {
  html = html.replace('</style>', `${cssToInsert}\r\n  </style>`);
  console.log('Added sent/pending banner CSS styles.');
}

// Enhance .card.sent style using regex that matches CRLF or LF
const cardSentRegex = /\.card\.sent\s*\{[^}]*\}/;
const newCardSentStyle = `.card.sent {
      border: 2px solid #10b981 !important;
      background: #091713 !important;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.12);
    }
    .card.pending {
      border: 1px solid rgba(245, 158, 11, 0.35);
    }`;

if (cardSentRegex.test(html) && !html.includes('card.pending')) {
  html = html.replace(cardSentRegex, newCardSentStyle);
  console.log('Enhanced .card.sent and added .card.pending styles.');
}

// 2. Replace the sentSet initialization with rich log + set + toggleSent
const sentInitRegex = /const realtorSentSet\s*=\s*new Set\(JSON\.parse\(localStorage\.getItem\('foresight_sent_sms'\) \|\| '\[\]'\)\);[\s\S]*?localStorage\.setItem\('foresight_sent_sms',\s*JSON\.stringify\(\[\.\.\.realtorSentSet\]\)\);/;

const newSentInit = `// Helper function for formatted timestamps
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
    }`;

if (sentInitRegex.test(html)) {
  html = html.replace(sentInitRegex, newSentInit);
  console.log('Replaced sent state initialization and added toggleSent.');
} else {
  console.error('Could not find sentInitRegex in html!');
}

// 3. Update markSent function
const oldMarkSentRegex = /function markSent\(id, smsLink, mode = 'realtors'\) \{[\s\S]*?window\.location\.href = finalLink;\s*\}/;

const newMarkSent = `function markSent(id, smsLink, mode = 'realtors') {
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
    }`;

if (oldMarkSentRegex.test(html)) {
  html = html.replace(oldMarkSentRegex, newMarkSent);
  console.log('Updated markSent function.');
}

// 4. Update renderCards function
const oldRenderCardsRegex = /if \(currentMode === 'realtors'\) \{[\s\S]*?container\.innerHTML = html;\s*\}/;

const newRenderCards = `if (currentMode === 'realtors') {
        html = displayBatch.map(f => {
          const isSent = sentSet.has(f.id);
          const sentInfo = realtorSentLog[f.id];
          const sentDateStr = sentInfo ? sentInfo.displayDate : '';
          return \`
            <div class="card \${isSent ? 'sent' : 'pending'}" id="\${f.id}">
              \${isSent ? \`
                <div class="sent-status-banner">
                  <div class="sent-status-left">
                    <span class="sent-badge-pill">✅ TEXT SENT</span>
                    <span class="sent-time">📅 Sent: <b>\${sentDateStr || 'Recorded in Log'}</b></span>
                  </div>
                  <button class="btn-undo" onclick="toggleSent('\${f.id}', 'realtors', event)" title="Click to move back to Ready to Text">
                    ↩️ Mark Unsent
                  </button>
                </div>
              \` : \`
                <div class="pending-status-banner">
                  <div class="pending-status-left">
                    <span class="pending-badge-pill">🟡 READY TO TEXT</span>
                    <span class="pending-time">Not contacted yet</span>
                  </div>
                  <button class="btn-mark-sent-manual" onclick="toggleSent('\${f.id}', 'realtors', event)" title="Mark as sent if already contacted">
                    ✓ Mark Sent
                  </button>
                </div>
              \`}

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
                  <a href="https://g.page/r/CaK5MZOz_FBtEBM/review" target="_blank" style="color:#f59e0b; font-size:11px; text-decoration:underline; font-weight:700;">Test Link &rarr;</a>
                </div>
                <div style="color:#f3f4f6; font-size:12px; line-height:1.5;">"\${cl.review_body.replace('*Foresight Home Inspections*', '<strong style=\\"color:#ffffff; font-weight:800;\\">Foresight Home Inspections</strong>').replace('give us a 5-star review on Google? ⭐', '<strong style=\\"color:#f59e0b; background:rgba(245, 158, 11, 0.2); padding:1px 4px; border-radius:3px; font-weight:800;\\">GIVE US A 5-STAR REVIEW ON GOOGLE? ⭐</strong>').replace('https://g.page/r/CaK5MZOz_FBtEBM/review', \`<a href=\\"https://g.page/r/CaK5MZOz_FBtEBM/review\\" target=\\"_blank\\" style=\\"color:#f59e0b; text-decoration:underline; font-weight:800;\\">Direct Google 5-Star Review Dialog</a>\`)}"</div>
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
    }`;

if (oldRenderCardsRegex.test(html)) {
  html = html.replace(oldRenderCardsRegex, newRenderCards);
  console.log('Updated renderCards function with sent and pending banners.');
}

// 5. Update dispatchQuickClient to log sent timestamps
const oldQuickClientRegex = /function dispatchQuickClient\(\) \{[\s\S]*?window\.location\.href = finalLink;\s*\}/;

const newQuickClient = `function dispatchQuickClient() {
      const name = (document.getElementById("quickClientName").value || "Valued Client").trim();
      const phone = (document.getElementById("quickClientPhone").value || "").trim();
      const addr = (document.getElementById("quickClientAddress").value || "your home").trim();
      if (!phone) {
        alert("Please enter a phone number for the client.");
        return;
      }
      const firstName = name.split(" ")[0];
      const directReviewUrl = "https://g.page/r/CaK5MZOz_FBtEBM/review";
      const text = \`Hi \${firstName}, Christopher Boykin with Foresight Home Inspections here! It was an absolute honor inspecting your home at \${addr}. As an independent Atlanta local business, our reputation is built on 5-star client trust. If our thorough two-inspector audit, FLIR thermal scan, and report gave you peace of mind, would you take 30 seconds to share a quick 5-star review on Google? ⭐ Tap here for instant access: \${directReviewUrl} - Thank you so much! Christopher Boykin, CMI® (678) 480-2110\`;
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
        finalLink = finalLink.replace("?&body=", "&body=").replace("?body=", "&body=");
      } else {
        finalLink = finalLink.replace("?&body=", "?body=");
      }
      window.location.href = finalLink;
    }`;

if (oldQuickClientRegex.test(html)) {
  html = html.replace(oldQuickClientRegex, newQuickClient);
  console.log('Updated dispatchQuickClient function.');
}

// Write to both vip-dispatch.html and dispatch.html
fs.writeFileSync(vipDispatchPath, html, 'utf8');
console.log('Successfully saved to public/vip-dispatch.html');

fs.writeFileSync(dispatchPath, html, 'utf8');
console.log('Successfully cloned to public/dispatch.html');
