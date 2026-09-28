import fs from 'fs';
import path from 'path';

/**
 * Autonomous Social Webhook Dispatcher
 * Sends weekly high-converting social updates to a connected automation webhook (Zapier / Make).
 * The webhook instantly publishes the post to Foresight Home Inspections' Facebook & Instagram pages.
 */

const CONFIG_PATH = path.resolve(process.cwd(), 'secrets', 'social-webhook.json');

export async function dispatchSocialPost({ message, link, imageUrl }) {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Webhook config missing at ${CONFIG_PATH}. Please provide your Zapier/Make webhook URL.`);
  }

  const { webhookUrl } = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    throw new Error('Invalid webhookUrl in secrets/social-webhook.json');
  }

  const payload = {
    message,
    link: link || 'https://www.fhinspectionsatl.com/quote',
    imageUrl: imageUrl || '',
    timestamp: new Date().toISOString(),
    source: 'Foresight Autonomous Engine',
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webhook delivery failed (${response.status}): ${errorText}`);
  }

  const result = await response.json().catch(() => ({ status: 'delivered' }));

  // Log to tracking ledger
  const logDir = path.resolve(process.cwd(), 'data', 'social-logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, 'webhook-dispatched.json');
  let history = [];
  if (fs.existsSync(logFile)) {
    try { history = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch {}
  }

  history.push({
    timestamp: payload.timestamp,
    messageSnippet: message.slice(0, 100) + '...',
    link: payload.link,
    response: result,
  });

  fs.writeFileSync(logFile, JSON.stringify(history, null, 2), 'utf8');

  return {
    success: true,
    timestamp: payload.timestamp,
    result,
  };
}

// CLI Execution test
if (process.argv[1]?.includes('publish-social-webhook.mjs')) {
  const sampleMessage = process.argv[2] || 'Foresight Home Inspections: Two certified inspectors on every job. Book online at https://www.fhinspectionsatl.com/quote';
  dispatchSocialPost({ message: sampleMessage })
    .then(res => console.log('Successfully dispatched post via webhook:', res))
    .catch(err => console.error('Dispatch error:', err.message));
}
