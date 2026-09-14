import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

const clips = [
  {
    name: 'chris-goodbye',
    text: "Thank you for visiting Foresight Home Inspections! Have a great day, and we look forward to inspecting your home soon!"
  },
  {
    name: 'chris-sunday',
    text: "Foresight Home Inspections is open on Sunday strictly by advance appointment. While our standard inspection schedule runs Monday through Saturday from 8:00 AM to 8:00 PM, we are always glad to accommodate Sunday inspections booked in advance. What property address are you looking to have inspected?"
  },
  {
    name: 'chris-process',
    text: "We perform an exhaustive top-to-bottom evaluation following InterNACHI standards. We inspect the roof with 4K aerial drones, check attics, test electrical panels for fire hazards, evaluate plumbing for polybutylene, test HVAC temperature splits, and inspect foundations for red clay pressure. Plus, we include free FLIR thermal imaging to see inside walls. Because we send two certified inspectors, we finish in half the time and deliver your full digital report within 24 hours. What property are you looking to have evaluated?"
  },
  {
    name: 'chris-10am',
    text: "10:00 AM works out perfectly for our two-inspector team! I have that penciled in for you. What is the address of the property and your name so I can lock that in?"
  },
  {
    name: 'chris-9am',
    text: "9:00 AM works out great for our two-inspector team! I have that penciled in for you. What is the address of the property and your name so I can lock that in?"
  }
];

async function main() {
  console.log('Connecting to F5-TTS on Hugging Face...');
  const client = await Client.connect('mrfakename/E2-F5-TTS');

  const refAudioPath = path.resolve('public/audio/voice_reference_clean.wav');
  const refAudioBuffer = fs.readFileSync(refAudioPath);
  const refAudioBlob = new Blob([refAudioBuffer], { type: 'audio/wav' });
  const refText = 'Hello. This is a sample of my voice for cloning in Home Inspection AI Studio.';

  for (const clip of clips) {
    console.log(`Cloning ${clip.name}...`);
    try {
      const result = await client.predict('/predict', {
        ref_audio: refAudioBlob,
        ref_text: refText,
        gen_text: clip.text,
        remove_silence: true
      });

      if (result?.data?.[0]?.url) {
        const audioUrl = result.data[0].url;
        const res = await fetch(audioUrl);
        const arrayBuffer = await res.arrayBuffer();
        const wavPath = path.resolve(`public/audio/${clip.name}.wav`);
        fs.writeFileSync(wavPath, Buffer.from(arrayBuffer));
        console.log(`✓ Saved ${clip.name}.wav`);
      }
    } catch (err) {
      console.error(`Failed ${clip.name}:`, err.message);
    }
  }
  console.log('Batch voice cloning complete!');
}

main().catch(err => console.error('Error:', err));
