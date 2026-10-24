import fetch from 'node-fetch';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 [FORESIGHT QUALITY AUDIT] Production API Testing');
  console.log('====================================================');

  const routes = [
    { name: 'Voice Token (Chris)', url: 'https://www.fhinspectionsatl.com/api/voice/token', method: 'POST', body: { persona: 'chris' } },
    { name: 'Voice Token (Jordan)', url: 'https://www.fhinspectionsatl.com/api/voice/token', method: 'POST', body: { persona: 'jordan' } },
    { name: 'Gemini Chat API', url: 'https://www.fhinspectionsatl.com/api/chat', method: 'POST', body: { messages: [{ role: 'user', content: 'How much is an inspection?' }] } },
    { name: 'Voice Turn API (Chris)', url: 'https://www.fhinspectionsatl.com/api/voice', method: 'POST', body: { messages: [{ role: 'user', content: 'What is your warranty?' }], persona: 'chris' } },
    { name: 'Lead Capture API', url: 'https://www.fhinspectionsatl.com/api/lead-capture', method: 'POST', body: { name: 'Audit Inspector', email: 'audit@foresightcmi.com', phone: '678-480-2110' } },
    { name: 'MCP Server Endpoint', url: 'https://www.fhinspectionsatl.com/api/mcp', method: 'GET' }
  ];

  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    try {
      const t0 = Date.now();
      const opts = { method: r.method, headers: { 'Content-Type': 'application/json' } };
      if (r.body) opts.body = JSON.stringify(r.body);
      const res = await fetch(r.url, opts);
      const elapsed = Date.now() - t0;
      let bodyPreview = '';
      try {
        const json = await res.json();
        bodyPreview = JSON.stringify(json);
      } catch {
        bodyPreview = await res.text();
      }

      if (res.status >= 200 && res.status < 300) {
        console.log(`✅ [${res.status} OK] ${r.name} (${elapsed}ms)`);
        console.log(`   Response: ${bodyPreview.slice(0, 120)}...`);
        passed++;
      } else {
        console.warn(`⚠️ [${res.status} WARN] ${r.name} (${elapsed}ms) -> ${bodyPreview.slice(0, 150)}`);
        failed++;
      }
    } catch (e) {
      console.error(`❌ [FAIL] ${r.name} -> ${e.message}`);
      failed++;
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`Audit Summary: ${passed} passed, ${failed} failed out of ${routes.length} tests.`);
  console.log('----------------------------------------------------');
}

runTests();
