import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Calculation helper strictly adhering to Foresight pricing engine
function calculateQuoteDetails({ propertyType = 'single-family', serviceType = 'buyer', sqft = 2000, foundation = 'slab', ageTier = 'under-25', addons = {} }) {
  let base = 345;
  const parsedSqft = Number(sqft) || 2000;

  if (serviceType === 'str') {
    base = 355;
  } else if (propertyType === 'condo' || serviceType === 'condo') {
    if (parsedSqft <= 1000) base = 295;
    else base = 325;
  } else {
    if (parsedSqft <= 1000) base = 345;
    else if (parsedSqft <= 1500) base = 375;
    else if (parsedSqft <= 2000) base = 410;
    else if (parsedSqft <= 2500) base = 435;
    else if (parsedSqft <= 3000) base = 465;
    else if (parsedSqft <= 3500) base = 485;
    else if (parsedSqft <= 4000) base = 500;
    else if (parsedSqft <= 4500) base = 555;
    else if (parsedSqft <= 5000) base = 595;
    else base = 635;
  }

  let extra = 0;
  if (serviceType !== 'str') {
    if (ageTier === '25-49') extra += 50;
    else if (ageTier === 'over-50') extra += 95;
  }

  if (propertyType === 'single-family' && serviceType !== 'str') {
    if (foundation === 'crawlspace') extra += 85;
    if (foundation === 'basement') extra += 75;
  }

  const addonBreakdown = [];
  if (addons.radon) { extra += 200; addonBreakdown.push({ name: 'Radon Gas Testing', price: 200 }); }
  if (addons.termite) { extra += 110; addonBreakdown.push({ name: 'Termite / WDO Inspection', price: 110 }); }
  if (addons.pool) { extra += 300; addonBreakdown.push({ name: 'Pool & Spa Inspection', price: 300 }); }
  if (addons.sewer) { extra += 425; addonBreakdown.push({ name: 'Sewer Scope Camera', price: 425 }); }
  if (addons.lowFlow) { extra += 125; addonBreakdown.push({ name: 'DeKalb Low Flow Certification', price: 125 }); }
  if (addons.buildfax) { extra += 15; addonBreakdown.push({ name: 'Permit History Report', price: 15 }); }

  const total = base + extra;
  return {
    base,
    extra,
    total,
    addonBreakdown,
    sqft: parsedSqft,
    propertyType,
    foundation,
    ageTier
  };
}

// Lead & appointment persistence helper
async function persistBooking({ name, phone, email, address, preferredDate, addons = [], estimatedTotal, notes = '' }) {
  console.log('==========================================');
  console.log('🎙️ [VOICE AGENT] NEW APPOINTMENT SCHEDULED:');
  console.log(`👤 Client:    ${name}`);
  console.log(`📞 Phone:     ${phone}`);
  console.log(`✉️ Email:     ${email || 'Not provided'}`);
  console.log(`📍 Address:   ${address || 'Address pending verification'}`);
  console.log(`📅 Date:      ${preferredDate || 'Earliest available (Sunday appointment only)'}`);
  console.log(`🛠️ Addons:    ${Array.isArray(addons) ? addons.join(', ') : JSON.stringify(addons)}`);
  console.log(`💰 Est Total: $${estimatedTotal || 'TBD'}`);
  console.log('==========================================');

  // Forward to Google Apps Script Webhook (Google Sheets)
  const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (appsScriptUrl) {
    try {
      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule_voice_appointment',
          name,
          phone,
          email: email || '',
          address: address || '',
          preferredDate: preferredDate || '',
          addons: Array.isArray(addons) ? addons.join(', ') : '',
          estimatedTotal: estimatedTotal || '',
          notes,
          source: 'Voice Assistant'
        }),
      });
      console.log('[VOICE AGENT] Appointment saved to Google Sheets via Apps Script.');
    } catch (err) {
      console.error('[VOICE AGENT] Apps Script forwarding error:', err);
    }
  }

  // Send Email Notification to Christopher
  const emailPass = process.env.EMAIL_PASSWORD;
  if (emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'inspect@foresightcmi.com',
          pass: emailPass,
        },
      });

      const addonListHtml = Array.isArray(addons) && addons.length > 0
        ? `<ul>${addons.map(a => `<li>${a}</li>`).join('')}</ul>`
        : '<p>Standard Comprehensive Inspection</p>';

      await transporter.sendMail({
        from: 'inspect@foresightcmi.com',
        to: 'inspect@foresightcmi.com',
        subject: `🚨 [VOICE APPOINTMENT] Inspection Scheduled: ${name} - ${preferredDate || 'ASAP'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #b91c1c; border-radius: 8px; background: #ffffff;">
            <h2 style="color: #b91c1c; margin-top: 0;">🎙️ New Inspection Scheduled via Voice Agent</h2>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Inspection Address:</strong> ${address || 'Pending confirmation'}</p>
            <p><strong>Preferred Date:</strong> ${preferredDate || 'First available slot'}</p>
            <p><strong>Estimated Total:</strong> $${estimatedTotal || 'Pending exact square footage'}</p>
            <h3>Selected Add-ons / Scope:</h3>
            ${addonListHtml}
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 13px; color: #64748b;">This appointment was booked hands-free by the Foresight AI Voice Assistant. Sunday bookings require special scheduling approval.</p>
          </div>
        `
      });
      console.log('[VOICE AGENT] Dispatch email notification sent.');
    } catch (mailErr) {
      console.error('[VOICE AGENT] Dispatch email error:', mailErr);
    }
  }
}

// Studio-Grade Neural Voice Synthesis via EdgeTTS (en-US-JennyNeural)
async function synthesizeHumanVoice(text, voice = 'en-US-JennyNeural') {
  try {
    const { EdgeTTS } = await import('edge-tts-universal');
    const cleanText = (text || '')
      .replace(/[*#_~`\[\]()<>]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\$([0-9,]+)/g, '$1 dollars')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return null;

    const tts = new EdgeTTS(cleanText, voice, {
      rate: '+8%',
      pitch: '+0Hz'
    });
    const result = await tts.synthesize();
    if (result && result.audio) {
      const arrayBuffer = await result.audio.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return `data:audio/mp3;base64,${buffer.toString('base64')}`;
    }
  } catch (err) {
    console.error('[VOICE] Edge TTS synthesis error:', err);
  }
  return null;
}

function extractPhoneNumber(rawText) {
  if (!rawText) return null;
  // Direct digit match (e.g. 678-480-2110, (678) 480 2110, 6784802110)
  const directMatch = rawText.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (directMatch) return directMatch[1];

  // Convert spoken word numbers (e.g. "six seven eight...")
  const words = rawText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
  const wordMap = { zero: '0', oh: '0', one: '1', two: '2', to: '2', too: '2', three: '3', four: '4', for: '4', five: '5', six: '6', seven: '7', eight: '8', ate: '8', nine: '9' };
  let digits = '';
  for (const w of words) {
    if (wordMap[w] !== undefined) digits += wordMap[w];
    else if (/^\d+$/.test(w)) digits += w;
    else if (digits.length >= 10) break;
    else if (digits.length > 0) digits = '';
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return null;
}

// Dynamic LLM Brain Generation via Google Gemini (Real-Time Cognitive Listening)
async function generateWithGeminiBrain(messages, lastUserMessage, apiKey, currentQuote) {
  if (!apiKey) return null;

  const contents = (messages || []).slice(-8).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const systemInstruction = `You are Sarah, the warm, knowledgeable, and professional client concierge at Foresight Home Inspections in Metro Atlanta.
You are on a live, hands-free telephone call with a homebuyer, seller, or real estate agent.

CRITICAL RULES FOR NATURAL HUMAN CONVERSATION:
1. TRULY LISTEN AND ANSWER DIRECTLY: You must directly and specifically answer whatever question, concern, or comment the caller just made. Never ignore what they asked. Never give a generic canned pitch.
2. CONCISE & PUNCHY FOR TELEPHONE: Keep your answers to 2 to 3 natural conversational sentences (maximum 40 words). This is spoken telephone audio, so avoid long essays or lists.
3. DO NOT INTERROGATE THE CALLER: Do NOT end every response with a canned question like "What is the address or square footage?". Only ask a question if it naturally flows from what the caller asked. If they made a comment, compliment, or observation, acknowledge it warmly without demanding information.
4. FORESIGHT ADVANTAGES & INTERNACHI SOP:
   - Led by Certified Master Inspector Christopher Boykin (top 1% in North America).
   - Two-Inspector Team on every site: Lead CMI + certified inspector. Dual scrutiny in half the time (1.5 to 2.5 hours).
   - Complimentary $10,000 Master Protection Warranty with zero deductible.
   - Free FLIR thermal imaging & free 4K aerial drone roof scans.
   - InterNACHI SOP: We inspect roofing, electrical (testing for Federal Pacific/Zinsco/aluminum wiring), plumbing (polybutylene/TPR), HVAC, and foundations (Georgia red clay hydrostatic pressure).
5. PRICING & SCHEDULING:
   - Single-family homes start at $345, condos at $295.
   - Sunday is strictly by appointment only.
   - Standard time slots are morning (9am / 10am) and afternoon (1:30pm).
   - Add-ons: Radon ($200), Termite WDO ($110+), Sewer Scope ($425), Pool/Spa ($300), STR ($355).
6. ABSOLUTE CONTENT RULE: Write in 100% clean plain text. NEVER use asterisks (*) or markdown symbols under any circumstances.`;

  const models = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-flash-latest'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 120
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply && reply.trim()) {
          return reply.replace(/[*#_~]/g, '').trim();
        }
      }
    } catch (err) {
      console.warn(`[GEMINI VOICE] Model ${model} exception:`, err.message);
    }
  }
  return null;
}

// Sarah Natural Phone Concierge Knowledge & Dialogue Engine (Context-Aware, Non-Pushy Listening)
function generateSarahDialogueTurn(messages, lastUserMessage) {
  const history = messages || [];
  const text = (lastUserMessage || '').toLowerCase().trim();
  const lastAssistant = history.filter(m => m.role === 'assistant').pop()?.content || '';
  const prev = lastAssistant.toLowerCase();

  const matchesAny = (keywords) => keywords.some(k => new RegExp(`\\b${k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(text));

  // 0. Farewell / Hang up detection
  if (matchesAny(['bye', 'goodbye', 'hang up', 'end call', 'that is all', "that's all", 'have a good day', 'see you', 'thanks bye', 'thank you bye'])) {
    return {
      text: "Thank you so much for calling Foresight Home Inspections! Have a wonderful day, and we hope to inspect your home soon!",
      preAudio: '/audio/sarah-goodbye.mp3',
      action: 'end_call'
    };
  }

  // 1. Compliments, positive reactions, and gratitude (Acknowledge warmly WITHOUT pushing questions)
  if (matchesAny(['thank you', 'thanks', 'appreciate it', 'thank you so much', 'thanks for the info'])) {
    return {
      text: "You are very welcome! We are always here to help you make informed decisions about your home. Feel free to ask anything else whenever you are ready.",
      preAudio: null
    };
  }

  if (matchesAny(['sounds great', 'that sounds good', 'that sounds great', 'awesome', 'cool', 'nice', 'i like that', 'makes sense', 'good to know', 'great point'])) {
    return {
      text: "I am so glad to hear that! We take a lot of pride in doing things the right way and protecting our clients. What other questions can I answer for you about the home?",
      preAudio: null
    };
  }

  // 2. Technical InterNACHI SOP Questions (Truly Listening to Building Science)
  // Electrical & Panels
  if (matchesAny(['electrical', 'panel', 'breaker', 'breakers', 'wiring', 'fuse', 'fuses', 'aluminum', 'federal pacific', 'zinsco', 'gfci', 'afci'])) {
    return {
      text: "We thoroughly inspect the main service panel, breakers, and wiring methods! We specifically look out for fire-hazard panels like Federal Pacific Stab-Lok and Zinsco, test for ungrounded circuits, and check for single-strand aluminum wiring.",
      preAudio: null
    };
  }

  // Crawlspace, Foundation & Georgia Red Clay
  if (matchesAny(['crawlspace', 'crawl space', 'foundation', 'red clay', 'settling', 'settlement', 'crack', 'cracks', 'slab', 'pier', 'piers', 'joist', 'joists'])) {
    return {
      text: "Georgia red clay expands and contracts dramatically with rain, creating hydrostatic pressure that can crack foundation walls. In crawlspaces, we check piers, framing, subflooring, and ensure the vapor barrier is properly preventing moisture intrusion.",
      preAudio: null
    };
  }

  // Plumbing, Pipes & Water Heaters
  if (matchesAny(['plumbing', 'pipe', 'pipes', 'leak', 'leaks', 'polybutylene', 'copper', 'cast iron', 'water heater', 'tpr', 'shutoff'])) {
    return {
      text: "We test functional flow and drainage throughout the home, inspect the main shutoff, and check water heater TPR safety relief valves. We also specifically check for vulnerable polybutylene supply pipes and corroded cast iron drain lines.",
      preAudio: null
    };
  }

  // HVAC, Air Conditioning & Furnace
  if (matchesAny(['hvac', 'ac', 'air conditioning', 'furnace', 'heat', 'heating', 'duct', 'ducts', 'filter', 'filters', 'condensate'])) {
    return {
      text: "We test both the heating and cooling systems using normal operating controls, evaluate ductwork and filters, and inspect the secondary condensate overflow pan in the attic to make sure safety float switches are in place to prevent ceiling leaks.",
      preAudio: null
    };
  }

  // Mold, Moisture & Infrared Thermal Imaging
  if (matchesAny(['mold', 'moisture', 'humidity', 'damp', 'water intrusion', 'flir', 'thermal', 'infrared'])) {
    return {
      text: "We include complimentary FLIR infrared thermal imaging on every inspection. It detects subtle temperature differentials behind drywall and ceilings, catching hidden plumbing leaks, roof leaks, or insulation gaps before mold can spread.",
      preAudio: null
    };
  }

  // Attending the Walkthrough
  if (matchesAny(['attend', 'come along', 'be there', 'walkthrough', 'show up', 'can i come', 'can we come', 'meet on site'])) {
    return {
      text: "You and your agent are more than welcome to attend! Christopher loves having buyers on site during the summary walkthrough so he can show you all our findings firsthand and answer all your questions.",
      preAudio: null
    };
  }

  // Christopher's Credentials & Certified Master Inspector (CMI)
  if (matchesAny(['cmi', 'credentials', 'certified master', 'certification', 'license', 'licensed', 'who is christopher', 'experience'])) {
    return {
      text: "Christopher Boykin is a Certified Master Inspector, which is North America's highest professional designation, representing the top one to two percent of elite inspectors nationwide. You get peer-reviewed, master-level scrutiny on every job.",
      preAudio: null
    };
  }

  // 3. Time / Scheduling negotiation (e.g. "how about 10 o'clock instead?", "can we do 10?", "10 am", "tomorrow morning")
  const hasTimeIndicator = 
    text.includes('10 o') || text.includes('10:00') || text.includes('10am') || text.includes('10 am') || text.includes('10 o\'clock') ||
    text.includes('9 o') || text.includes('9:00') || text.includes('9am') || text.includes('9 am') ||
    text.includes('11 o') || text.includes('11:00') || text.includes('11am') || text.includes('11 am') ||
    text.includes('1pm') || text.includes('1:00') || text.includes('2pm') || text.includes('2:00') ||
    text.includes('afternoon') || text.includes('morning') ||
    /(?:how about|can we do|what about|could we do|is|prefer|rather|instead of|at|do you have)\s*(?:a\s*)?(?:1[0-2]|[1-9]|morning|afternoon)/i.test(text);

  const isScheduleContext = 
    prev.includes('slot') || prev.includes('schedule') || prev.includes('time') || prev.includes('date') || prev.includes('reserve') || prev.includes('appointment') ||
    text.includes('schedule') || text.includes('book') || text.includes('appointment') || text.includes('reserve');

  if (hasTimeIndicator || (isScheduleContext && /\b(1[0-2]|[1-9])\b/.test(text))) {
    // Check for Sunday
    if (text.includes('sunday')) {
      return {
        text: "We can definitely do that on Sunday! Just as a reminder, Sunday is by appointment only. What is the address of the home and your name so I can lock that in?",
        preAudio: '/audio/sarah-sunday.mp3'
      };
    }

    // 10 o'clock match
    if (text.includes('10')) {
      return {
        text: "10:00 AM works out perfectly for our two-inspector team! I have that penciled in for you. What is the address of the property and your name?",
        preAudio: '/audio/sarah-10am.mp3'
      };
    }

    // 9 o'clock match
    if (text.includes('9')) {
      return {
        text: "9:00 AM works out great for our two-inspector team! I have that penciled in for you. What is the address of the property and your name?",
        preAudio: '/audio/sarah-9am.mp3'
      };
    }

    // Afternoon match
    if (text.includes('afternoon') || text.includes('1pm') || text.includes('1:') || text.includes('2pm') || text.includes('2:')) {
      return {
        text: "An afternoon slot around 1:30 PM works out great for our two-inspector team! I have that penciled in for you. What is the address of the property and your name?",
        preAudio: '/audio/sarah-afternoon.mp3'
      };
    }

    const timeMatch = text.match(/\b(1[0-2]|[1-9])(?::([0-5][0-9]))?\s*(am|pm)?\b/i);
    const parsedTime = timeMatch ? `${timeMatch[1]}${timeMatch[2] ? `:${timeMatch[2]}` : ':00'} ${timeMatch[3] ? timeMatch[3].toUpperCase() : 'AM'}` : 'That time';
    return {
      text: `${parsedTime} works great for our two-inspector team! What is the address of the home and your name so I can hold that for you?`,
      preAudio: null
    };
  }

  // 4. Affirmative responses ("yes", "sure", "sounds good", "perfect", "let's do it")
  if (matchesAny(['yes', 'sure', 'yeah', 'yep', 'lets do it', "let's do it", 'that works', 'ok', 'okay', 'please'])) {
    if (prev.includes('schedule') || prev.includes('reserve') || prev.includes('date') || prev.includes('slot')) {
      return {
        text: "Awesome! Does a morning slot around 9:00 or 10:00 AM work better for you, or would you prefer afternoon? And what is the address of the home?",
        preAudio: '/audio/sarah-morning-afternoon.mp3'
      };
    }
  }

  // 5. Polite decline or browsing ("no", "not yet", "just looking", "just shopping")
  if (matchesAny(['no', 'nope', 'not yet', 'just looking', 'just shopping', 'just checking', 'not right now'])) {
    return {
      text: "No problem at all! Feel free to ask me anything about our ten thousand dollar warranty, pricing, or our two-inspector process whenever you are ready. What questions can I answer for you?",
      preAudio: '/audio/sarah-browsing.mp3'
    };
  }

  // 6. Address detection (e.g. "1816 South Deshon Road", "in Lithonia", "123 Main St", "in Alpharetta")
  const addressRegex = /\b(\d{1,5}\s+[A-Za-z0-9\s]+(?:road|rd|street|st|avenue|ave|drive|dr|lane|ln|way|blvd|circle|ct|court))\b/i;
  const cityRegex = /\b(?:in\s+)?(lithonia|atlanta|sandy springs|alpharetta|decatur|marietta|conyers|lawrenceville|duluth|roswell|smyrna|cumming|woodstock|kennesaw|buford|peachtree city|dunwoody|brookhaven|johns creek)\b/i;
  const addressFound = text.match(addressRegex) || text.match(cityRegex);

  if (addressFound && (prev.includes('address') || prev.includes('property') || text.includes('road') || text.includes('street') || text.includes('drive') || text.includes('ave'))) {
    return {
      text: "Got that property address down! What is your name and the best phone number so our office can send the confirmation and coordinate access?",
      preAudio: '/audio/sarah-address-confirm.mp3'
    };
  }

  // 7. Name introduction ("my name is ...", "i'm ...")
  const nameIntroMatch = text.match(/(?:my name is|name is|i am|this is|i'm|im)\s+([A-Za-z\s]+?)(?:,|\.|\s+and|\s+my|\s+phone|\s+at|$)/i);
  if (nameIntroMatch && !prev.includes('phone') && !text.includes('square')) {
    const clientName = nameIntroMatch[1].trim();
    return {
      text: `Great to meet you, ${clientName}! What's the best phone number for you, and what date or time would you prefer for your inspection?`,
      preAudio: null
    };
  }

  // 8. Signature Value Questions (Pre-Rendered Instant Audio)
  if (matchesAny(['two', 'team', 'dual', 'inspectors', 'pair', 'solo', 'why two'])) {
    return {
      text: "Most companies send one inspector who gets fatigued after four hours. We send two certified inspectors on every single job, led by Certified Master Inspector Christopher Boykin! You get double the scrutiny in half the time, plus our ten thousand dollar warranty.",
      preAudio: '/audio/sarah-why-two.mp3'
    };
  }

  // Warranty & Guarantee (Instant Audio)
  if (matchesAny(['warranty', '10000', '10,000', 'guarantee', 'protection'])) {
    return {
      text: "Every full inspection includes our complimentary ten thousand dollar Master Protection Warranty with zero deductible! It covers mechanical systems, structure, appliances, roofs, and mold after closing.",
      preAudio: '/audio/sarah-warranty.mp3'
    };
  }

  // Pricing (Instant Audio)
  if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
    return {
      text: "Our single-family inspections start at 345 dollars, and condos start at 295, based on square footage. That includes thermal imaging and aerial drone roof scans at no extra charge!",
      preAudio: '/audio/sarah-pricing.mp3'
    };
  }

  // Radon (Instant Audio)
  if (matchesAny(['radon'])) {
    return {
      text: "Radon is very common in Georgia granite bedrock. We run 48-hour continuous electronic monitoring for 200 dollars. If levels are elevated, we give you the leverage to have the seller install a mitigation system before closing!",
      preAudio: '/audio/sarah-radon.mp3'
    };
  }

  // Termite (Instant Audio)
  if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation'])) {
    return {
      text: "Georgia is prime termite country. We do complete wood-destroying organism inspections for 110 dollars bundled, and provide the official Georgia Wood Infestation Report.",
      preAudio: '/audio/sarah-termite.mp3'
    };
  }

  // Sewer Scope (Instant Audio)
  if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
    return {
      text: "Replacing a broken sewer line can cost eight to fifteen thousand dollars! Our high-definition camera inspects the main drain pipe all the way to the municipal connection for 425 dollars. It is especially recommended for homes over 25 years old.",
      preAudio: '/audio/sarah-sewer.mp3'
    };
  }

  if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
    return {
      text: "We inspect pool pumps, heaters, filtration, and safety GFCI breakers for 300 dollars flat. Catching pool issues early gives you great leverage to negotiate seller credits before closing.",
      preAudio: null
    };
  }

  if (matchesAny(['thermal', 'flir', 'infrared', 'drone', 'drones', 'camera'])) {
    return {
      text: "Yes, absolutely! We include FLIR infrared thermal imaging to catch hidden leaks and aerial drone roof scans standard on every single inspection for free.",
      preAudio: null
    };
  }

  if (matchesAny(['how long', 'duration', 'time take', 'hours'])) {
    return {
      text: "Because we send two certified inspectors on every single job instead of just one, we finish a complete, highly thorough inspection in just 1.5 to 2.5 hours, saving you half the time of exhausted solo inspectors!",
      preAudio: null
    };
  }

  if (matchesAny(['when report', 'report delivered', 'sample report', 'crl'])) {
    return {
      text: "Our detailed digital reports with HD photos, video clips, and our interactive Create Request List tool are delivered within 24 hours, and often the same day!",
      preAudio: null
    };
  }

  if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term'])) {
    return {
      text: "We offer complete Short-Term Rental safety compliance inspections for 355 dollars flat to ensure your Airbnb or Vrbo passes city and county guidelines with flying colors.",
      preAudio: null
    };
  }

  if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge'])) {
    return {
      text: "We make it super easy for real estate agents! We have active SUPRA key access so you don't have to wait around on site, plus all our buyers get free lifetime access to Utilities Plus concierge.",
      preAudio: null
    };
  }

  // Conversational Fallback: Genuinely acknowledging instead of interrogating
  return {
    text: "Whether it's evaluating structural stability, electrical safety, or crawlspace moisture, our Certified Master Inspector team is here to give you complete peace of mind. What specific questions or concerns do you have about the house?",
    preAudio: null
  };
}

export async function POST(request) {
  try {
    const { messages = [], currentQuote = null } = await request.json();
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    const lastUserTextLower = lastUserMessage.toLowerCase();

    // 1. Direct quote calculation intent (e.g., user mentions square footage)
    const sqftMatch = lastUserMessage.match(/(\b\d{3,5}\b)\s*(?:sq|square|sqft|ft)/i) || lastUserMessage.match(/(?:sqft|size|footage)\s*(?:is|of)?\s*(\b\d{3,5}\b)/i);
    if (sqftMatch && !lastUserTextLower.includes('schedule') && !lastUserTextLower.includes('book')) {
      const parsedSqft = parseInt(sqftMatch[1], 10);
      if (parsedSqft >= 400 && parsedSqft <= 20000) {
        const isCondo = lastUserTextLower.includes('condo');
        const isCrawl = lastUserTextLower.includes('crawl');
        const isBasement = lastUserTextLower.includes('basement');
        const isOlder = lastUserTextLower.includes('old') || lastUserTextLower.includes('historic') || lastUserTextLower.includes('197') || lastUserTextLower.includes('196');

        const quoteArgs = {
          propertyType: isCondo ? 'condo' : 'single-family',
          sqft: parsedSqft,
          foundation: isCrawl ? 'crawlspace' : isBasement ? 'basement' : 'slab',
          ageTier: isOlder ? '25-49' : 'under-25',
          addons: {
            radon: lastUserTextLower.includes('radon'),
            termite: lastUserTextLower.includes('termite') || lastUserTextLower.includes('wdo'),
            pool: lastUserTextLower.includes('pool'),
            sewer: lastUserTextLower.includes('sewer')
          }
        };

        const quoteResult = calculateQuoteDetails(quoteArgs);
        const speechResponse = `For a ${quoteResult.sqft.toLocaleString()} square foot ${quoteResult.propertyType === 'condo' ? 'condo' : 'home'}${quoteResult.foundation === 'crawlspace' ? ' with a crawlspace' : quoteResult.foundation === 'basement' ? ' with a basement' : ''}, your total is ${quoteResult.total} dollars with our two-person Certified Master Inspector team.${quoteResult.addonBreakdown.length > 0 ? ` That includes ${quoteResult.addonBreakdown.map(a => `${a.name} for ${a.price} dollars`).join(' and ')}.` : ''} That includes drone scans and thermal imaging for free. Would you like a morning slot around 9:00 or 10:00 AM, or afternoon?`;

        const audio = await synthesizeHumanVoice(speechResponse);
        return NextResponse.json({
          response: speechResponse,
          audio,
          action: 'quote_calculated',
          quote: quoteResult
        });
      }
    }

    // 2. Direct schedule appointment intent (when caller provides phone number)
    const clientPhone = extractPhoneNumber(lastUserMessage);
    if (clientPhone) {
      const nameMatch = lastUserMessage.match(/(?:my name is|name is|i am|this is|call me)\s+([A-Za-z\s]+?)(?:,|\.|\s+and|\s+my|\s+phone|\s+at|$)/i);
      const clientName = nameMatch ? nameMatch[1].trim() : 'Valued Client';

      const bookingArgs = {
        name: clientName,
        phone: clientPhone,
        email: '',
        address: lastUserMessage.replace(clientPhone, '').replace(clientName, '').trim(),
        preferredDate: 'Upcoming Window',
        addons: [],
        estimatedTotal: currentQuote?.total || null
      };

      await persistBooking(bookingArgs);
      const speechResponse = `Awesome! I have your inspection reservation initiated right now. Our team will follow up directly at ${clientPhone} to confirm arrival time and lockbox details. Remember that Sunday is by appointment only. We look forward to working with you!`;

      return NextResponse.json({
        response: speechResponse,
        audio: '/audio/sarah-booked.mp3',
        action: 'scheduled',
        booking: bookingArgs
      });
    }

    // 3. Dynamic Gemini LLM Brain (True Cognitive Listening & Real-Time Intelligence)
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const dynamicReply = await generateWithGeminiBrain(messages, lastUserMessage, apiKey, currentQuote);
        if (dynamicReply && dynamicReply.trim()) {
          const audio = await synthesizeHumanVoice(dynamicReply);
          return NextResponse.json({
            response: dynamicReply,
            audio,
            action: 'message'
          });
        }
      } catch (geminiErr) {
        console.warn('[VOICE] Gemini brain error, using rich dialogue engine:', geminiErr.message);
      }
    }

    // 4. Intelligent Context-Aware Dialogue Engine (Fallback if upstream API is depleted or offline)
    const turnResult = generateSarahDialogueTurn(messages, lastUserMessage);

    if (turnResult.preAudio) {
      return NextResponse.json({
        response: turnResult.text,
        audio: turnResult.preAudio,
        action: turnResult.action || 'message'
      });
    }

    // Synthesize response with Sarah's neural female voice
    const cleanReply = turnResult.text.replace(/\*/g, '').trim();
    const audio = await synthesizeHumanVoice(cleanReply);

    return NextResponse.json({
      response: cleanReply,
      audio,
      action: turnResult.action || 'message'
    });

  } catch (error) {
    console.error('Voice API Route Exception:', error);
    const fallbackText = "Thanks for calling Foresight Home Inspections! We're here to help you inspect with confidence. You can also reach our lead inspector Christopher directly at 678-480-2110. What can I help you with today?";
    const audio = await synthesizeHumanVoice(fallbackText);
    return NextResponse.json({
      response: fallbackText,
      audio,
      action: 'fallback'
    }, { status: 200 });
  }
}
