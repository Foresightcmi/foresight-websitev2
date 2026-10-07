import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const KEY_PATH = path.resolve(process.cwd(), 'secrets', 'ga4-key.json');
const OUTPUT_DIR = path.resolve(process.cwd(), 'data', 'analytics');
const SERVICE_ACCOUNT_EMAIL = 'ga4-analytics-reporter@lead-generation-tool-79c91.iam.gserviceaccount.com';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(keyFilePath, scopes) {
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`Service account key not found at ${keyFilePath}`);
  }
  const key = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: key.client_email,
    scope: scopes.join(' '),
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

export async function fetchGSCAnalytics() {
  console.log('[GSC ENGINE] Initializing Search Console synchronization...');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const token = await getAccessToken(KEY_PATH, ['https://www.googleapis.com/auth/webmasters.readonly']);
  console.log('[GSC ENGINE] Scoped OAuth token minted successfully.');

  // 1. List sites to identify verified property
  const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const sitesData = await sitesRes.json();
  const siteEntries = sitesData.siteEntry || [];

  if (siteEntries.length === 0) {
    console.log('[GSC ENGINE] No verified site property found yet for service account.');
    console.log(`[GSC ENGINE] Please add '${SERVICE_ACCOUNT_EMAIL}' in Google Search Console Settings > Users and permissions.`);
    return {
      success: false,
      isLive: false,
      reason: 'USER_PERMISSION_PENDING',
      serviceAccountEmail: SERVICE_ACCOUNT_EMAIL
    };
  }

  // Pick first site
  const siteUrl = siteEntries[0].siteUrl;
  console.log(`[GSC ENGINE] Found verified property: ${siteUrl}`);

  // Calculate 28-day window (Search Console data usually has a 2-3 day lag)
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() - 3);
  const start = new Date(today);
  start.setDate(start.getDate() - 31);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const startDateStr = formatDate(start);
  const endDateStr = formatDate(end);

  // 2. Query Search Analytics for Top Queries
  const queryUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const queryRes = await fetch(queryUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate: startDateStr,
      endDate: endDateStr,
      dimensions: ['query'],
      rowLimit: 5000
    })
  });

  const queryData = await queryRes.json();

  // 3. Query Top Pages
  const pageRes = await fetch(queryUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate: startDateStr,
      endDate: endDateStr,
      dimensions: ['page'],
      rowLimit: 500
    })
  });

  const pageData = await pageRes.json();

  // Save raw snapshot
  const rawSnapshot = {
    retrievedAt: new Date().toISOString(),
    siteUrl,
    dateRange: { startDate: startDateStr, endDate: endDateStr },
    queries: queryData.rows || [],
    pages: pageData.rows || []
  };

  const gscSnapshotPath = path.join(OUTPUT_DIR, 'gsc-snapshot-latest.json');
  fs.writeFileSync(gscSnapshotPath, JSON.stringify(rawSnapshot, null, 2), 'utf8');
  console.log(`[GSC ENGINE] Saved raw GSC snapshot to ${gscSnapshotPath}`);

  // Format executive briefing
  const generatedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const queryRows = queryData.rows || [];
  const topQueriesLines = queryRows.slice(0, 15).map((row, idx) => {
    const q = row.keys[0];
    const clicks = row.clicks;
    const impressions = row.impressions;
    const ctr = (row.ctr * 100).toFixed(1);
    const pos = row.position.toFixed(1);
    return `${idx + 1}. **"${q}"** - ${clicks} clicks, ${impressions} impressions, CTR: ${ctr}%, Avg Position: ${pos}`;
  });

  // Striking distance opportunities (Position 4.0 to 18.0 with highest impressions)
  const strikingDistance = queryRows
    .filter(r => r.position >= 4.0 && r.position <= 20.0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .map((row, idx) => {
      const q = row.keys[0];
      const imp = row.impressions;
      const pos = row.position.toFixed(1);
      return `${idx + 1}. **"${q}"** (Avg Pos: ${pos}, Impressions: ${imp}) - High-priority on-page optimization target`;
    });

  const briefing = [
    `# Executive Google Search Console Briefing | Foresight Home Inspections`,
    `**Reporting Timestamp**: ${generatedAt} (EST)`,
    `**Verified Property**: ${siteUrl}`,
    `**Window**: ${startDateStr} to ${endDateStr}`,
    ``,
    `---`,
    ``,
    `## 1. Top Search Queries Driving Clicks & Visibility`,
    topQueriesLines.length > 0 ? topQueriesLines.join('\n') : `No query data returned for this window.`,
    ``,
    `---`,
    ``,
    `## 2. Striking Distance Opportunities (Page 1-2 Quick Wins)`,
    strikingDistance.length > 0
      ? strikingDistance.join('\n')
      : `No striking distance keywords detected in this sample.`,
    ``,
    `---`,
    ``,
    `## 3. Autonomous Action Plan`,
    `- Use striking distance queries to adjust title tags, H1/H2 headings, and internal links.`,
    `- Identify queries with high impressions but low CTR to test high-converting title hooks.`
  ].join('\n');

  const reportPath = path.join(OUTPUT_DIR, 'executive-gsc-briefing.md');
  fs.writeFileSync(reportPath, briefing, 'utf8');
  console.log(`[GSC ENGINE] Executive GSC briefing generated at ${reportPath}`);

  return {
    success: true,
    isLive: true,
    siteUrl,
    queriesCount: queryRows.length
  };
}

if (process.argv[1] && process.argv[1].endsWith('fetch-gsc-analytics.mjs')) {
  fetchGSCAnalytics()
    .then(res => {
      console.log('[GSC ENGINE] Run finished:', res.isLive ? 'LIVE DATA RETRIEVED' : 'AWAITING USER PERMISSION');
      process.exit(0);
    })
    .catch(err => {
      console.error('[GSC ENGINE] Fatal error:', err);
      process.exit(1);
    });
}
