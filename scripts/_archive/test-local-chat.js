async function run() {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Say one sentence about homes.' }], stream: true })
  });
  
  if (!res.body) {
    console.error("NO BODY");
    return;
  }
  
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while(true) {
    const { done, value } = await reader.read();
    if(done) break;
    console.log("CHUNK:", decoder.decode(value));
  }
}
run();
