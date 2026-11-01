import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

let passed = 0;
let failed = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL: ${name} -> ${err.message}`);
    failed++;
  }
}

console.log('=== FORESIGHT AGENTIC AEO & IS-AGENTIC TDD SUITE ===');

await check('1. lib/leads.js allows Zillow/Redfin/Realtor/Maps URLs while blocking spam URLs', async () => {
  const { isSpamSubmission } = await import('../lib/leads.js');
  const zillow = isSpamSubmission({
    name: 'Jordan Taylor',
    phone: '678-555-0192',
    email: 'jordan@gmail.com',
    address: '412 Oakdale Rd NE, Atlanta, GA 30307',
    message: 'Listing link from Grok: https://www.zillow.com/homedetails/412-Oakdale-Rd-NE-Atlanta-GA-30307/12345_zpid/'
  });
  assert.equal(zillow.isSpam, false, `Zillow link was blocked: ${zillow.reason}`);

  const spamUrl = isSpamSubmission({
    name: 'Alex Promo',
    phone: '678-555-0192',
    email: 'alex@gmail.com',
    address: '123 Main St, Atlanta, GA',
    message: 'Check out our offer at https://cheap-directory-promo.xyz/deal'
  });
  assert.equal(spamUrl.isSpam, true, 'Unknown external promotional URL must still be blocked');
});

await check('2. lib/agentAttribution.js detects Grok, ChatGPT, Claude, Perplexity, Gemini & UTMs', async () => {
  const { detectAgentSource } = await import('../lib/agentAttribution.js');
  assert.match(detectAgentSource({ referrer: 'https://chatgpt.com/', search: '?utm_source=chatgpt.com' }), /ChatGPT/i);
  assert.match(detectAgentSource({ referrer: 'https://grok.com/chat/123', search: '' }), /Grok/i);
  assert.match(detectAgentSource({ referrer: 'https://claude.ai/chat', search: '' }), /Claude/i);
  assert.match(detectAgentSource({ referrer: 'https://www.perplexity.ai/', search: '' }), /Perplexity/i);
  assert.match(detectAgentSource({ referrer: 'https://gemini.google.com/', search: '' }), /Gemini/i);
});

await check('3. /api/mcp handles notifications/initialized (202), resources/list, resources/read & STR Call-for-Quote', async () => {
  const mcpManifest = JSON.parse(read('public/.well-known/mcp.json'));
  assert.equal(mcpManifest.capabilities.resources, true, 'mcp.json must declare capabilities.resources = true');
  const mcpCode = read('app/api/mcp/route.js');
  assert.ok(mcpCode.includes('notifications/initialized'), 'Missing notifications/initialized handler');
  assert.ok(mcpCode.includes('resources/list') && mcpCode.includes('resources/read'), 'Missing MCP resources handlers');
  assert.ok(!/if\s*\(\s*serviceType\s*===\s*['"]str['"]\s*\)\s*\{\s*base\s*=\s*395/.test(mcpCode), 'Legacy STR $395 still in /api/mcp');
});

await check('4. Markdown content negotiation route & Vary: Accept configured', async () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'app/api/markdown/[[...slug]]/route.js')), 'Missing app/api/markdown/[[...slug]]/route.js');
  const nextCfg = read('next.config.mjs');
  assert.ok(nextCfg.includes('text/markdown') && nextCfg.includes('/api/markdown'), 'Missing text/markdown rewrite in next.config.mjs');
});

await check('5. Zero legacy flat-rate auxiliary/STR/Pre-Listing prices in layout.js, page.js, QuoteClient.js & llms.txt', async () => {
  const layout = read('app/layout.js');
  const page = read('app/page.js');
  const quote = read('app/quote/QuoteClient.js');
  const llms = read('public/llms.txt');
  assert.ok(!layout.includes('"365.00"') && !layout.includes('"450.00"') && !layout.includes('"395.00"'), 'Legacy prices in app/layout.js hasOfferCatalog');
  assert.ok(!page.includes('starts at $450') && !page.includes('starting at $450') && !page.includes('($250)'), 'Legacy auxiliary prices in app/page.js FAQ schema');
  assert.ok(!quote.includes('base = 395') && !quote.includes('Starts at $395') && !quote.includes('starts at $395'), 'Legacy STR $395 in QuoteClient.js');
  assert.ok(!llms.includes('starting at $450') && !llms.includes('$100 flat') && !llms.includes('optional $99'), 'Legacy auxiliary prices in public/llms.txt');
});

await check('6. Agent instructions in llms.txt, WebMCP in QuoteClient, og:type, Organization contactPoint, GrokBot & foldable CSS', async () => {
  const llms = read('public/llms.txt');
  const page = read('app/page.js');
  const layout = read('app/layout.js');
  const quote = read('app/quote/QuoteClient.js');
  const robots = read('app/robots.js');
  const css = read('app/globals.css');
  assert.ok(/## When to Use/i.test(llms) && llms.includes('/api/mcp'), 'Missing When-to-Use / MCP section in llms.txt');
  assert.ok(page.includes("type: 'website'"), 'Missing og:type in app/page.js openGraph');
  assert.ok(layout.includes('"Organization"') && layout.includes('"contactPoint"'), 'Missing Organization + contactPoint in app/layout.js');
  assert.ok(quote.includes('modelContext'), 'Missing WebMCP navigator.modelContext registration in QuoteClient.js');
  assert.ok(robots.includes('GrokBot'), 'Missing GrokBot in app/robots.js');
  assert.ok(css.includes('920px') || css.includes('900px'), 'Missing foldable dual-screen 900-920px grid breakpoint in globals.css');
});

console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
