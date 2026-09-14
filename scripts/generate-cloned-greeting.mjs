import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

async function generateGreeting() {
  console.log('Generating Chris Greeting with Cloned Voice...');
  const client = await Client.connect('mrfakename/E2-F5-TTS');

  const refAudioPath = path.resolve('public/audio/voice_reference_clean.wav');
  const refAudioBuffer = fs.readFileSync(refAudioPath);
  const refAudioBlob = new Blob([refAudioBuffer], { type: 'audio/wav' });

  const refText = 'Hello. This is a sample of my voice for cloning in Home Inspection AI Studio.';
  const genText = "Hello! I am Chris Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. What inspection or home systems questions can I answer for you today?";

  const result = await client.predict('/predict', {
    ref_audio: refAudioBlob,
    ref_text: refText,
    gen_text: genText,
    remove_silence: true
  });

  if (result?.data?.[0]?.url) {
    const audioUrl = result.data[0].url;
    const res = await fetch(audioUrl);
    const arrayBuffer = await res.arrayBuffer();
    const outputPath = path.resolve('public/audio/chris-cloned-greeting.wav');
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log('SUCCESS: Saved cloned greeting to:', outputPath);
  }
}

generateGreeting().catch(err => console.error('Error:', err));
