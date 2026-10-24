const fs = require('fs');

async function testGeminiStream() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("NO API KEY");
    return;
  }
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
  
  const contents = [
    { role: 'user', parts: [{ text: 'Write a haiku about home inspections.' }] }
  ];

  const geminiRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }),
  });

  const reader = geminiRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;
    console.log("--- RAW CHUNK START ---");
    console.log(chunk);
    console.log("--- RAW CHUNK END ---");
  }
  
  console.log("FINAL BUFFER:");
  console.log(buffer);
}

testGeminiStream();
