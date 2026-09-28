import fs from 'fs';
import path from 'path';

/**
 * Autonomous Facebook Page Publisher
 * Uses Meta Graph API v21.0 to publish updates, photos, and links directly to Foresight's Facebook Page.
 * Runs autonomously with zero manual copy-pasting.
 */

const SECRETS_PATH = path.resolve(process.cwd(), 'secrets', 'meta-credentials.json');

export async function publishToFacebook({ message, link, imageUrl }) {
  if (!fs.existsSync(SECRETS_PATH)) {
    throw new Error(`Meta credentials file missing at: ${SECRETS_PATH}. Awaiting Page Access Token.`);
  }

  const { pageId, pageAccessToken } = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8'));

  if (!pageId || !pageAccessToken) {
    throw new Error('pageId or pageAccessToken missing in secrets/meta-credentials.json');
  }

  let endpoint = `https://graph.facebook.com/v21.0/${pageId}/feed`;
  let body = {
    message,
    access_token: pageAccessToken,
  };

  if (link) {
    body.link = link;
  }

  // If publishing with an image URL
  if (imageUrl) {
    endpoint = `https://graph.facebook.com/v21.0/${pageId}/photos`;
    body = {
      caption: message,
      url: imageUrl,
      access_token: pageAccessToken,
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`Meta Graph API Error: ${data.error.message} (Code: ${data.error.code})`);
  }

  const postId = data.id || data.post_id;
  const timestamp = new Date().toISOString();

  // Log successful publication to tracking ledger
  const logDir = path.resolve(process.cwd(), 'data', 'social-logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, 'facebook-published.json');
  let history = [];
  if (fs.existsSync(logFile)) {
    try { history = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch {}
  }

  history.push({
    postId,
    timestamp,
    messageSnippet: message.slice(0, 100) + '...',
    link,
    imageUrl,
  });

  fs.writeFileSync(logFile, JSON.stringify(history, null, 2), 'utf8');

  return {
    success: true,
    postId,
    timestamp,
  };
}

// Allow direct execution from command line / cron
if (process.argv[1]?.includes('publish-facebook.mjs')) {
  const sampleMessage = process.argv[2] || 'Foresight Home Inspections: Two certified inspectors on every job. Book online at https://www.fhinspectionsatl.com/quote';
  publishToFacebook({ message: sampleMessage })
    .then(res => console.log('Successfully published to Facebook:', res))
    .catch(err => console.error('Facebook Publish Error:', err.message));
}
