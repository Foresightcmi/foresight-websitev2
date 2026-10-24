const fs = require('fs');

async function testGeminiStreamNewline() {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
  
  const contents = [
    { role: 'user', parts: [{ text: 'Say "hello\nworld" with a newline in the middle.' }] }
  ];

  const geminiRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  const reader = geminiRes.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    console.log("RAW STRINGIFIED:", JSON.stringify(chunk));
  }
}

testGeminiStreamNewline();
