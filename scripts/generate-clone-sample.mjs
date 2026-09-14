import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

async function testClone() {
  console.log('Connecting to F5-TTS on Hugging Face...');
  const client = await Client.connect('mrfakename/E2-F5-TTS');

  const refAudioPath = path.resolve('public/audio/voice_reference.wav');
  const refAudioBuffer = fs.readFileSync(refAudioPath);
  const refAudioBlob = new Blob([refAudioBuffer], { type: 'audio/wav' });

  const refText = 'Hello. This is a sample of my voice for cloning in Home Inspection AI Studio.';
  const genText = 'Welcome to Foresight Home Inspections! I am Chris Boykin, your Certified Master Inspector. We send two certified inspectors on every single job, giving you double the scrutiny in half the time.';

  console.log('Sending voice cloning request to F5-TTS...');
  const result = await client.predict('/predict', {
    ref_audio: refAudioBlob,
    ref_text: refText,
    gen_text: genText,
    remove_silence: true
  });

  console.log('Result received:', result);
  if (result?.data?.[0]?.url) {
    const audioUrl = result.data[0].url;
    console.log('Audio URL:', audioUrl);
    const res = await fetch(audioUrl);
    const arrayBuffer = await res.arrayBuffer();
    const outputPath = path.resolve('public/audio/chris-cloned-sample.wav');
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log('Saved cloned audio to:', outputPath);
  }
}

testClone().catch(err => console.error('Error:', err));
