import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Read HF_TOKEN from .env.local
let hfToken = process.env.HF_TOKEN;
if (!hfToken && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const hfMatch = envContent.match(/HF_TOKEN=(.+)/);
  if (hfMatch) hfToken = hfMatch[1].trim();
}

console.log('🔑 HF_TOKEN configured:', hfToken ? `${hfToken.substring(0, 8)}...` : 'None (unauthenticated)');

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
  },
  {
    name: 'chris-afternoon',
    text: "An afternoon slot around 1:30 PM works out great for our two-inspector team! I have that penciled in for you. What is the address of the property and your name so I can lock that in?"
  },
  {
    name: 'chris-morning-afternoon',
    text: "Awesome! Does a morning slot around 9:00 or 10:00 AM work better for you, or would you prefer afternoon? What is the address of the home so I can hold that for you?"
  },
  {
    name: 'chris-decline-addon',
    text: "Understood, no problem at all! We will keep your inspection focused strictly on your core evaluation with our two-inspector team. What date or time window works best for you?"
  },
  {
    name: 'chris-browsing',
    text: "No problem at all! Feel free to ask me anything about our up to 35,000 dollar warranty protection, pricing, or our two-inspector process whenever you are ready. What questions can I answer for you?"
  },
  {
    name: 'chris-payment-policy',
    text: "To solidify all appointments on our master calendar, a 50 percent deposit along with the signed inspection agreements are completed after our office sends your appointment confirmation. The remaining 50 percent balance is due after our on-site walkthrough before your official report is released. Would you like me to hold our next available window for you?"
  },
  {
    name: 'chris-address-confirm',
    text: "Got that property address down! What is your name and the best phone number so our office can send the confirmation and coordinate access?"
  },
  {
    name: 'chris-upsell-sewer',
    text: "Because older homes frequently have clay or cast iron sewer lines vulnerable to root intrusion or bellies, we often suggest our high-definition sewer scope camera for 450 dollars. Would you like us to include that, or keep it strictly to the standard home inspection?"
  },
  {
    name: 'chris-upsell-radon',
    text: "Since the property features a crawlspace or basement and Georgia has high granite bedrock, we frequently recommend our 48-hour continuous radon monitor test for 250 dollars. Would you like to add that to your estimate, or keep it as is?"
  },
  {
    name: 'chris-upsell-termite',
    text: "Because Georgia is in the termite belt and most lenders require an official clearance letter, we can bundle your official Georgia termite letter starting at 125 dollars. Would you like that included, or do you already have that covered?"
  }
];

async function main() {
  console.log('Connecting to F5-TTS on Hugging Face with user auth...');
  const client = await Client.connect('mrfakename/E2-F5-TTS', hfToken ? { token: hfToken } : {});
  console.log('✓ Successfully connected to F5-TTS Space!');

  const refAudioPath = path.resolve('public/audio/voice_reference_clean.wav');
  const refAudioBuffer = fs.readFileSync(refAudioPath);
  const refAudioBlob = new Blob([refAudioBuffer], { type: 'audio/wav' });
  const refText = 'Hello. This is a sample of my voice for cloning in Home Inspection AI Studio.';

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const mp3Path = path.resolve(`public/audio/${clip.name}.mp3`);

    console.log(`\n[${i + 1}/${clips.length}] 🎙️ Cloning ${clip.name}...`);
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
        console.log(`  ✓ Generated WAV (${(arrayBuffer.byteLength / 1024).toFixed(1)} KB)`);

        // Convert WAV to MP3 using ffmpeg
        execSync(`ffmpeg -y -i "${wavPath}" -b:a 128k "${mp3Path}"`, { stdio: 'ignore' });
        console.log(`  ✓ Converted & overwrote MP3 in user's cloned voice: ${clip.name}.mp3 (${(fs.statSync(mp3Path).size / 1024).toFixed(1)} KB)`);
        
        // Clean up temporary WAV
        if (fs.existsSync(wavPath)) {
          fs.unlinkSync(wavPath);
        }
      } else {
        console.warn(`  ⚠️ No audio URL in response for ${clip.name}`);
      }

      // 4-second polite delay between generation calls
      await new Promise(res => setTimeout(res, 4000));
    } catch (err) {
      console.error(`  ❌ Failed ${clip.name}:`, err.message);
      console.log('  Waiting 15 seconds before continuing...');
      await new Promise(res => setTimeout(res, 15000));
    }
  }
  console.log('\n🎉 Authentic voice batch cloning complete!');
}

main().catch(err => console.error('Fatal Error:', err));

