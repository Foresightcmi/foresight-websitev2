import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const PROPERTY_ID = '342062426';
const KEY_PATH = path.resolve(process.cwd(), 'secrets', 'ga4-key.json');
const OUTPUT_DIR = path.resolve(process.cwd(), 'data', 'analytics');
const LEADS_PATH = path.resolve(process.cwd(), 'data', 'leads.json');
const SERVICE_ACCOUNT_EMAIL = 'ga4-analytics-reporter@lead-generation-tool-79c91.iam.gserviceaccount.com';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(keyFilePath) {
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`Service account key not found at ${keyFilePath}`);
  }
  const key = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  signer.end();
  const signature = signer.sign(key.private_key);
  const encodedSignature = base64UrlEncode(signature);

  const jwt = `${signatureInput}.${encodedSignature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function runGA4Report(token, requestBody) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.error?.message || `HTTP ${res.status}`;
    const errorStatus = data?.error?.status || 'UNKNOWN';
    const err = new Error(`GA4 API error: ${errorMsg}`);
    err.status = res.status;
    err.code = errorStatus;
    throw err;
  }
  return data;
}

function loadLeadsSummary() {
  try {
    if (!fs.existsSync(LEADS_PATH)) return { totalLeads: 0, pipelineValue: 0, leads: [] };
    const raw = fs.readFileSync(LEADS_PATH, 'utf8');
    const leads = JSON.parse(raw);
    const validLeads = leads.filter(l => !l.isSpam);
    let pipeline = 0;
    for (const lead of validLeads) {
      if (lead.estimatedTotal) {
        const val = parseFloat(String(lead.estimatedTotal).replace(/[^0-9.]/g, ''));
        if (!isNaN(val)) pipeline += val;
      }
    }
    return {
      totalLeads: validLeads.length,
      pipelineValue: Math.round(pipeline),
      recentLeads: validLeads.slice(0, 5)
    };
  } catch {
    return { totalLeads: 0, pipelineValue: 0, leads: [] };
  }
}

export async function fetchFullAnalytics({ sendPushAlert = false } = {}) {
  console.log(`[GA4 ENGINE] Initializing analytics run for Property ID: ${PROPERTY_ID}...`);
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const leadsSummary = loadLeadsSummary();
  const token = await getAccessToken(KEY_PATH);
  console.log('[GA4 ENGINE] Scoped OAuth token successfully minted.');

  // 1. Core KPIs (Last 7 Days vs Prior 7 Days)
  console.log('[GA4 ENGINE] Querying KPI overview...');
  const kpiData = await runGA4Report(token, {
    dateRanges: [
      { startDate: '7daysAgo', endDate: 'today', name: 'current_period' },
      { startDate: '14daysAgo', endDate: '8daysAgo', name: 'previous_period' }
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' }
    ]
  });

  // 2. Traffic Acquisition Channels & AI Assistants (ChatGPT)
  console.log('[GA4 ENGINE] Querying Acquisition Channels & AI Citations...');
  const channelData = await runGA4Report(token, {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'sessionDefaultChannelGroup' },
      { name: 'sessionSourceMedium' }
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' }
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20
  });

  // 3. Top Visited Pages
  console.log('[GA4 ENGINE] Querying Top Content & Pages...');
  const pageData = await runGA4Report(token, {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'pageTitle' },
      { name: 'pagePath' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'userEngagementDuration' }
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20
  });

  // 4. Geographic Distribution (Metro Atlanta & US)
  console.log('[GA4 ENGINE] Querying Geographic distribution...');
  const geoData = await runGA4Report(token, {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'city' },
      { name: 'region' },
      { name: 'country' }
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' }
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20
  });

  // Save live raw snapshot
  const nowIso = new Date().toISOString();
  const rawSnapshot = {
    retrievedAt: nowIso,
    propertyId: PROPERTY_ID,
    kpis: kpiData,
    channels: channelData,
    topPages: pageData,
    geo: geoData
  };

  const liveSnapshotPath = path.join(OUTPUT_DIR, 'snapshot-live.json');
  fs.writeFileSync(liveSnapshotPath, JSON.stringify(rawSnapshot, null, 2), 'utf8');
  console.log(`[GA4 ENGINE] Saved live snapshot to ${liveSnapshotPath}`);

  // Format KPI metrics
  const kpiRows = kpiData.rows || [];
  let curUsers = 0, prevUsers = 0;
  let curSessions = 0, prevSessions = 0;
  let curViews = 0, prevViews = 0;
  let avgDuration = 0;

  if (kpiRows.length > 0) {
    // Current period row
    const curMetricValues = kpiRows[0]?.metricValues || [];
    curUsers = parseInt(curMetricValues[0]?.value || '0', 10);
    curSessions = parseInt(curMetricValues[1]?.value || '0', 10);
    curViews = parseInt(curMetricValues[2]?.value || '0', 10);
    avgDuration = Math.round(parseFloat(curMetricValues[3]?.value || '0'));

    if (kpiRows.length > 1) {
      const prevMetricValues = kpiRows[1]?.metricValues || [];
      prevUsers = parseInt(prevMetricValues[0]?.value || '0', 10);
      prevSessions = parseInt(prevMetricValues[1]?.value || '0', 10);
      prevViews = parseInt(prevMetricValues[2]?.value || '0', 10);
    }
  }

  const calcGrowth = (curr, prev) => {
    if (!prev || prev === 0) return '+100%';
    const pct = (((curr - prev) / prev) * 100).toFixed(1);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  // Format Channels
  const channelRows = channelData.rows || [];
  const channelLines = channelRows.map(row => {
    const group = row.dimensionValues?.[0]?.value || 'Unknown';
    const sourceMedium = row.dimensionValues?.[1]?.value || '';
    const sessions = row.metricValues?.[0]?.value || '0';
    const users = row.metricValues?.[1]?.value || '0';
    const isAi = sourceMedium.toLowerCase().includes('chatgpt') || sourceMedium.toLowerCase().includes('ai');
    const badge = isAi ? ' [AI Search Engine Citation]' : '';
    return `- **${group}** (${sourceMedium}${badge}): **${sessions} sessions**, ${users} active users`;
  });

  // Format Pages
  const pageRows = pageData.rows || [];
  const pageLines = pageRows.slice(0, 10).map((row, idx) => {
    const title = row.dimensionValues?.[0]?.value || 'Untitled';
    const pPath = row.dimensionValues?.[1]?.value || '/';
    const views = row.metricValues?.[0]?.value || '0';
    const users = row.metricValues?.[1]?.value || '0';
    return `${idx + 1}. **${title}** (\`${pPath}\`): **${views} views**, ${users} users`;
  });

  // Format Geo
  const geoRows = geoData.rows || [];
  const geoLines = geoRows.slice(0, 10).map(row => {
    const city = row.dimensionValues?.[0]?.value || '(not set)';
    const region = row.dimensionValues?.[1]?.value || '';
    const country = row.dimensionValues?.[2]?.value || '';
    const sessions = row.metricValues?.[1]?.value || '0';
    return `- **${city}${region ? ', ' + region : ''}** (${country}): **${sessions} sessions**`;
  });

  const generatedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const briefing = [
    `# Executive Analytics Briefing | Foresight Home Inspections`,
    `**Reporting Timestamp**: ${generatedAt} (EST)`,
    `**Property ID**: ${PROPERTY_ID} (foresight home inspections - GA4)`,
    `**Live Stream Connection**: 100% OPERATIONAL (Direct Google Analytics Data API)`,
    ``,
    `---`,
    ``,
    `## 1. Executive Performance Metrics (Last 7 Days vs Prior Period)`,
    `- **Active Users**: **${curUsers} users** (${calcGrowth(curUsers, prevUsers)} vs prior 7 days)`,
    `- **Total Sessions**: **${curSessions} sessions** (${calcGrowth(curSessions, prevSessions)} vs prior 7 days)`,
    `- **Screen Page Views**: **${curViews} views** (${calcGrowth(curViews, prevViews)} vs prior 7 days)`,
    `- **Average Session Duration**: **${avgDuration} seconds**`,
    `- **Verified Lead Inbound Pipeline**: **$${leadsSummary.pipelineValue.toLocaleString()}** across **${leadsSummary.totalLeads} qualified inquiries**`,
    ``,
    `---`,
    ``,
    `## 2. Real-Time Acquisition Channels & AI Citations (Last 28 Days)`,
    channelLines.length > 0 ? channelLines.join('\n') : `No channel data recorded yet.`,
    ``,
    `---`,
    ``,
    `## 3. Top Visited Surfaces & High-Intent Routes`,
    pageLines.length > 0 ? pageLines.join('\n') : `No page data recorded yet.`,
    ``,
    `---`,
    ``,
    `## 4. Top Geographic Demand Hubs`,
    geoLines.length > 0 ? geoLines.join('\n') : `No geo data recorded yet.`,
    ``,
    `---`,
    ``,
    `## 5. System Health & Autonomous Monitoring`,
    `The dedicated service account (\`${SERVICE_ACCOUNT_EMAIL}\`) is actively synchronized. Scheduled background runs will automatically update this briefing every Monday at 9:00 AM EST.`
  ].join('\n');

  const reportFile = path.join(OUTPUT_DIR, 'executive-analytics-briefing.md');
  fs.writeFileSync(reportFile, briefing, 'utf8');
  console.log(`[GA4 ENGINE] Live executive report written to ${reportFile}`);

  if (sendPushAlert) {
    try {
      const pushTitle = `LIVE GA4 TRAFFIC: ${curUsers} USERS (${curSessions} SESSIONS)`;
      const pushBody = [
        'Live Foresight GA4 Synchronization:',
        `Users: ${curUsers} (${calcGrowth(curUsers, prevUsers)})`,
        `Sessions: ${curSessions}`,
        `Page Views: ${curViews}`,
        `Pipeline: $${leadsSummary.pipelineValue.toLocaleString()} (${leadsSummary.totalLeads} leads)`
      ].join('\n');

      await fetch('https://ntfy.sh/fores-antigravity-alerts-77', {
        method: 'POST',
        headers: {
          'Title': pushTitle,
          'Priority': 'default',
          'Tags': 'chart_with_upwards_trend,bar_chart,satellite',
          'Click': 'https://www.fhinspectionsatl.com/dashboard',
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: Buffer.from(pushBody, 'utf8')
      });
      console.log('[GA4 ENGINE] Smartphone push notification sent to ntfy.sh/fores-antigravity-alerts-77');
    } catch (pushErr) {
      console.warn('[GA4 ENGINE] Push notification warning:', pushErr.message);
    }
  }

  return {
    success: true,
    curUsers,
    curSessions,
    curViews,
    avgDuration,
    leadsSummary
  };
}

if (process.argv[1] && process.argv[1].endsWith('fetch-ga4-analytics.mjs')) {
  fetchFullAnalytics({ sendPushAlert: process.argv.includes('--push') })
    .then(res => {
      console.log('[GA4 ENGINE] Live run completed successfully.');
      process.exit(0);
    })
    .catch(err => {
      console.error('[GA4 ENGINE] Live run failed:', err);
      process.exit(1);
    });
}
