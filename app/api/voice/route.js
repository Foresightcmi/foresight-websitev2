import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { recordLead } from '../../../lib/leads';

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
    else if (parsedSqft <= 5500) base = 635;
    else {
      const additionalChunks = Math.ceil((parsedSqft - 5500) / 500);
      base = 635 + (additionalChunks * 50);
    }
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
  console.log('🎙️ [VOICE AGENT] NEW APPOINTMENT REQUESTED:');
  console.log(`👤 Client:    ${name}`);
  console.log(`📞 Phone:     ${phone}`);
  console.log(`✉️ Email:     ${email || 'Not provided'}`);
  console.log(`📍 Address:   ${address || 'Address pending verification'}`);
  console.log(`📅 Date:      ${preferredDate || 'Earliest available (Sunday appointment only)'}`);
  console.log(`🛠️ Addons:    ${Array.isArray(addons) ? addons.join(', ') : JSON.stringify(addons)}`);
  console.log(`💰 Est Total: $${estimatedTotal || 'TBD'}`);
  console.log('==========================================');

  return await recordLead({
    name,
    phone,
    email: email || '',
    address: address || '',
    preferredDate: preferredDate || 'Upcoming Window',
    addons: Array.isArray(addons) ? addons : [],
    estimatedTotal: estimatedTotal || '',
    message: notes || 'Voice booking via Marcus AI Concierge',
    source: 'Voice Assistant (Marcus)'
  });
}

// Studio-Grade Neural Voice Synthesis via EdgeTTS (en-US-GuyNeural)
async function synthesizeHumanVoice(text, voice = 'en-US-GuyNeural') {
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

  const systemInstruction = `You are Marcus, the knowledgeable, warm, and authoritative senior client concierge at Foresight Home Inspections in Metro Atlanta.
You are speaking live with a visitor browsing Foresight's website. Welcome them warmly, invite them to explore our services, ask questions, and engage further. Never refer to this conversation as a phone call.

CRITICAL CONVERSATIONAL & SALES EXCELLENCE RULES:
1. TRULY LISTEN AND ANSWER DIRECTLY: You must directly, thoroughly, and specifically answer whatever question, concern, or comment the visitor just made. Never ignore what they asked. Never give a vague or evasive answer.
2. ACTIVE SALES ENCOURAGEMENT (MANDATORY): You are not just a passive textbook. In every single response, after answering the question with building science precision, bridge seamlessly to Foresight's advantages and actively encourage the client to take the next step (e.g., getting an exact square-footage quote, checking availability, or holding a morning or afternoon slot with zero upfront payment).
3. CONCISE & SPOKEN NATURAL AUDIO: Keep your answers to 2 to 3 punchy, conversational sentences (around 35 to 45 words). This is spoken audio, so avoid long essays, lists, or robotic recitations.
4. DEEP EXPERTISE IN HOME EVALUATION PROCESS (InterNACHI SOP):
   - Top-to-bottom comprehensive evaluation: roof (4K aerial drone scans for shingles, flashing, chimney crowns), attic (framing, insulation R-value, ventilation), electrical panels (testing for fire hazards like Federal Pacific Stab-Lok, Zinsco, and single-strand aluminum wiring; GFCI/AFCI safety), plumbing (testing functional flow, pressure, TPR valves, polybutylene supply lines, and cast iron drain wear), HVAC (testing heating and AC temperature split differentials, ductwork, and secondary overflow float switches to protect ceilings), and foundation/structure (Georgia red clay hydrostatic pressure, crawlspace moisture, piers, framing, and vapor barrier coverage).
   - Complimentary FLIR infrared thermal imaging standard on every inspection to detect hidden moisture, missing insulation, and electrical hotspots behind walls.
   - Two-Inspector Team on every site: Led by Certified Master Inspector Christopher Boykin (top 1% in North America) paired with a certified inspector. Dual sets of eyes deliver double the scrutiny in half the time (1.5 to 2.5 hours vs 4+ hours for solo inspectors).
   - Complimentary $10,000 Master Protection Warranty with zero deductible covering mechanical, structural, roof, and mold.
   - Full digital report delivered within 24 hours (often same-day) with HD photos, video clips, and the interactive Create Request List (CRL) tool for fast repair addendum negotiations with realtors.
5. COMPLETE PRICING & SCHEDULING KNOWLEDGE:
   - Single-family homes start at $345 (up to 1,000 sq ft), $375 (up to 1,500 sq ft), $410 (up to 2,000 sq ft), $435 (up to 2,500 sq ft), $465 (up to 3,000 sq ft), $485 (up to 3,500 sq ft), $500 (up to 4,000 sq ft), $555 (up to 4,500 sq ft), $595 (up to 5,000 sq ft), $635 (up to 5,500 sq ft), and $50 per 500 sq ft above 5,500.
   - Condos start at $295 (up to 1,000 sq ft) and $325 (1,001-1,800 sq ft).
   - Crawlspace complexity adds $85; basement adds $75.
   - Older homes: 25-49 years adds $50; 50+ years adds $95.
   - Add-ons: Radon Testing $200 (48-hr continuous monitor), Termite WDO $110 (official GA Wood Infestation Report), Pool & Spa $300, Sewer Scope Camera $425, STR Compliance $355, 11-Month Builder Warranty $350.
   - Any size home can be booked online. Online bookings are tentative requests; our office contacts the client within 2 hours to confirm inspector dispatch.
   - Standard inspection windows: 9:00 AM or 10:00 AM morning, and 1:30 PM afternoon.
   - SUNDAY RULE: Sunday inspections are strictly by appointment only.
   - SPECIALTY SERVICES: Auxiliary services (Radon, Termite, Pool, Sewer Scope) are coordinated alongside our primary inspection under Foresight's quality standard. Never mention third parties, subcontractors, or outsourcing.
6. ABSOLUTE CLEAN FORMATTING: Write in 100% clean plain English. NEVER use asterisks (*) or markdown symbols under any circumstances.`;

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

// Marcus Natural Senior Concierge Knowledge & Dialogue Engine (Authoritative, Knowledgeable & Proactively Encouraging)
function generateMarcusDialogueTurn(messages, lastUserMessage) {
  const history = messages || [];
  const text = (lastUserMessage || '').toLowerCase().trim();
  const lastAssistant = history.filter(m => m.role === 'assistant').pop()?.content || '';
  const prev = lastAssistant.toLowerCase();

  const matchesAny = (keywords) => keywords.some(k => new RegExp(`\\b${k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(text));

  // 0. Farewell / Hang up detection
  if (matchesAny(['bye', 'goodbye', 'hang up', 'end call', 'that is all', "that's all", 'have a good day', 'see you', 'thanks bye', 'thank you bye'])) {
    return {
      text: "Thank you so much for visiting Foresight Home Inspections! Have a wonderful day, and we hope to inspect your home soon!",
      preAudio: '/audio/marcus-goodbye.mp3',
      action: 'end_call'
    };
  }

  // 1. Compliments, positive reactions, and gratitude
  if (matchesAny(['thank you', 'thanks', 'appreciate it', 'thank you so much', 'thanks for the info'])) {
    return {
      text: "You are very welcome! We take tremendous pride in protecting our clients during due diligence. What date or time are you hoping to schedule your inspection for?",
      preAudio: null
    };
  }

  if (matchesAny(['sounds great', 'that sounds good', 'that sounds great', 'awesome', 'cool', 'nice', 'i like that', 'makes sense', 'good to know', 'great point'])) {
    return {
      text: "I am glad to hear that! Our two-inspector standard gives you an incredible advantage during negotiations. Shall I check our schedule availability for your property this week?",
      preAudio: null
    };
  }

  // 2. Comprehensive Home Evaluation Process (Top-to-Bottom InterNACHI SOP)
  if (matchesAny(['process', 'evaluate', 'evaluation', 'how do you inspect', 'how you inspect', 'what do you inspect', 'what is inspected', 'what do you check', 'sop', 'standard', 'steps', 'procedure', 'how does it work'])) {
    return {
      text: "We perform an exhaustive top-to-bottom evaluation following InterNACHI standards. We inspect the roof with 4K aerial drones, check attics, test electrical panels for fire hazards, evaluate plumbing for polybutylene, test HVAC temperature splits, and inspect foundations for red clay pressure. Plus, we include free FLIR thermal imaging to see inside walls. Because we send two certified inspectors, we finish in half the time and deliver your full digital report within 24 hours. What property are you looking to have evaluated?",
      preAudio: '/audio/marcus-process.mp3'
    };
  }

  // Electrical & Panels
  if (matchesAny(['electrical', 'panel', 'breaker', 'breakers', 'wiring', 'fuse', 'fuses', 'aluminum', 'federal pacific', 'zinsco', 'gfci', 'afci'])) {
    return {
      text: "We thoroughly inspect the main service panel, subpanels, and branch wiring! We specifically test for fire-hazard panels like Federal Pacific Stab-Lok and Zinsco, test for ungrounded circuits, and check for single-strand aluminum wiring. Our two-inspector team ensures nothing is missed, and every inspection includes our 10,000 dollar warranty. Would you like to schedule an inspection for your property?",
      preAudio: null
    };
  }

  // Crawlspace, Foundation & Georgia Red Clay
  if (matchesAny(['crawlspace', 'crawl space', 'foundation', 'red clay', 'settling', 'settlement', 'crack', 'cracks', 'slab', 'pier', 'piers', 'joist', 'joists'])) {
    return {
      text: "Georgia red clay expands and contracts dramatically with rain, creating immense hydrostatic pressure that cracks foundation walls. In crawlspaces, our team crawls the entire substructure to inspect piers, joists, subflooring, and moisture vapor barriers. We even use infrared thermal imaging to detect hidden leaks. Are you currently looking at a home with a crawlspace?",
      preAudio: null
    };
  }

  // Plumbing, Pipes & Water Heaters
  if (matchesAny(['plumbing', 'pipe', 'pipes', 'leak', 'leaks', 'polybutylene', 'copper', 'cast iron', 'water heater', 'tpr', 'shutoff'])) {
    return {
      text: "We test functional water flow and drainage throughout the home, inspect the main shutoff, and check water heater safety relief valves. We also specifically verify if vulnerable polybutylene pipes or corroded cast iron drain lines are present. With our two-inspector standard, you get double the scrutiny to protect your investment. Would you like to check our availability this week?",
      preAudio: null
    };
  }

  // HVAC, Air Conditioning & Furnace
  if (matchesAny(['hvac', 'ac', 'air conditioning', 'furnace', 'heat', 'heating', 'duct', 'ducts', 'filter', 'filters', 'condensate', 'delta-t', 'split'])) {
    return {
      text: "We test heating and air conditioning using operating controls, measure temperature split differentials, evaluate ductwork, and inspect attic emergency condensate pans and float switches to prevent ceiling collapses. Best of all, our two-inspector team provides a 24-hour report so you can negotiate repairs immediately. Can I help hold an inspection time for you?",
      preAudio: null
    };
  }

  // Mold, Moisture & Infrared Thermal Imaging
  if (matchesAny(['mold', 'moisture', 'humidity', 'damp', 'water intrusion', 'flir', 'thermal', 'infrared'])) {
    return {
      text: "We include complimentary FLIR infrared thermal imaging on every inspection. It catches temperature anomalies behind drywall, locating hidden plumbing leaks, roof intrusion, and missing insulation before mold can spread. That is part of why over ninety percent of top Atlanta agents recommend us. What date are you hoping to have your home inspected?",
      preAudio: null
    };
  }

  // Attending the Walkthrough
  if (matchesAny(['attend', 'come along', 'be there', 'walkthrough', 'show up', 'can i come', 'can we come', 'meet on site'])) {
    return {
      text: "You and your agent are warmly encouraged to attend! Christopher loves walking buyers through the home during the summary walkthrough to explain all findings firsthand, show you shutoffs, and answer every question. We deliver your full report within 24 hours. Would a morning or afternoon slot work best for your schedule?",
      preAudio: null
    };
  }

  // Christopher's Credentials & Certified Master Inspector (CMI)
  if (matchesAny(['cmi', 'credentials', 'certified master', 'certification', 'license', 'licensed', 'who is christopher', 'experience'])) {
    return {
      text: "Christopher Boykin is a Certified Master Inspector, representing the top one to two percent of elite inspectors in North America. Plus, we send two certified inspectors on every job and back your purchase with a complimentary 10,000 dollar warranty. You get unbeatable peace of mind. Would you like me to hold our next inspection opening for you?",
      preAudio: null
    };
  }

  // 3. Time / Scheduling negotiation
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
        text: "We can definitely accommodate you on Sunday! Just as a reminder, Sunday is strictly by appointment only. What is the address of the home and your name so our office can coordinate that for you?",
        preAudio: '/audio/marcus-sunday.mp3'
      };
    }

    // 10 o'clock match
    if (text.includes('10')) {
      return {
        text: "10:00 AM works out perfectly for our two-inspector team! I have that penciled in for you. What is the address of the property and your name so I can lock that in?",
        preAudio: '/audio/marcus-10am.mp3'
      };
    }

    // 9 o'clock match
    if (text.includes('9')) {
      return {
        text: "9:00 AM works out great for our two-inspector team! I have that penciled in for you. What is the address of the property and your name so I can lock that in?",
        preAudio: '/audio/marcus-9am.mp3'
      };
    }

    // Afternoon match
    if (text.includes('afternoon') || text.includes('1pm') || text.includes('1:') || text.includes('2pm') || text.includes('2:')) {
      return {
        text: "An afternoon slot around 1:30 PM works out great for our two-inspector team! I have that penciled in for you. What is the address of the property and your name so I can lock that in?",
        preAudio: '/audio/marcus-afternoon.mp3'
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
    if (prev.includes('schedule') || prev.includes('reserve') || prev.includes('date') || prev.includes('slot') || prev.includes('availability')) {
      return {
        text: "Awesome! Does a morning slot around 9:00 or 10:00 AM work better for you, or would you prefer afternoon? What is the address of the home so I can hold that for you?",
        preAudio: '/audio/marcus-morning-afternoon.mp3'
      };
    }
  }

  // 5. Polite decline or browsing ("no", "not yet", "just looking", "just shopping")
  if (matchesAny(['no', 'nope', 'not yet', 'just looking', 'just shopping', 'just checking', 'not right now'])) {
    return {
      text: "No problem at all! Feel free to ask me anything about our ten thousand dollar warranty, pricing, or our two-inspector process whenever you are ready. What questions can I answer for you?",
      preAudio: '/audio/marcus-browsing.mp3'
    };
  }

  // 6. Address detection
  const addressRegex = /\b(\d{1,5}\s+[A-Za-z0-9\s]+(?:road|rd|street|st|avenue|ave|drive|dr|lane|ln|way|blvd|circle|ct|court))\b/i;
  const cityRegex = /\b(?:in\s+)?(lithonia|atlanta|sandy springs|alpharetta|decatur|marietta|conyers|lawrenceville|duluth|roswell|smyrna|cumming|woodstock|kennesaw|buford|peachtree city|dunwoody|brookhaven|johns creek)\b/i;
  const addressFound = text.match(addressRegex) || text.match(cityRegex);

  if (addressFound && (prev.includes('address') || prev.includes('property') || text.includes('road') || text.includes('street') || text.includes('drive') || text.includes('ave'))) {
    return {
      text: "Got that property address down! What is your name and the best phone number so our office can send the confirmation and coordinate access?",
      preAudio: '/audio/marcus-address-confirm.mp3'
    };
  }

  // 7. Name introduction
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
      text: "Most discount companies send one inspector who gets exhausted after four hours and can easily miss hidden defects. We send two certified inspectors on every single job, led by Certified Master Inspector Christopher Boykin! You get double the scrutiny in half the time, plus our ten thousand dollar warranty. Would you like to check our availability for your inspection?",
      preAudio: '/audio/marcus-why-two.mp3'
    };
  }

  // Warranty & Guarantee (Instant Audio)
  if (matchesAny(['warranty', '10000', '10,000', 'guarantee', 'protection'])) {
    return {
      text: "Every full home inspection includes our complimentary ten thousand dollar Master Protection Warranty with zero deductible! It covers mechanical systems, structure, appliances, roofs, and mold after closing. Would you like to get your inspection scheduled with our team?",
      preAudio: '/audio/marcus-warranty.mp3'
    };
  }

  // Pricing (Instant Audio)
  if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
    return {
      text: "Our single-family home inspections start at 345 dollars for homes up to 1,500 square feet, 375 for up to 2,000, 405 for up to 2,500, and 440 for up to 3,000 square feet. That includes our two-inspector team, complimentary FLIR thermal imaging, drone scans, and our 10,000 dollar warranty. What is the approximate square footage of the home? I can give you your exact flat rate right now!",
      preAudio: '/audio/marcus-pricing.mp3'
    };
  }

  // Radon (Instant Audio)
  if (matchesAny(['radon'])) {
    return {
      text: "Radon is very common across Georgia's granite bedrock. We deploy 48-hour continuous electronic monitors following EPA protocols for 200 dollars, giving you the official evidence to negotiate seller credits before closing. Would you like us to bundle radon testing with your home inspection?",
      preAudio: null
    };
  }

  // Termite (Instant Audio)
  if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation'])) {
    return {
      text: "Georgia is notorious termite country. We provide complete wood-destroying organism inspections for 110 dollars bundled with your home inspection, delivering the official Georgia Wood Infestation Report for your lender. Can I add that to your inspection estimate?",
      preAudio: null
    };
  }

  // Sewer Scope (Instant Audio)
  if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
    return {
      text: "Replacing a collapsed sewer lateral can cost eight to fifteen thousand dollars! We perform high-definition camera sewer scopes for 425 dollars to inspect the underground line all the way to the municipal main. It is one of the smartest investments you can make during due diligence. Shall I reserve a slot for your sewer scope?",
      preAudio: null
    };
  }

  if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
    return {
      text: "We provide comprehensive pool and spa inspections for 300 dollars flat, evaluating pumps, heaters, shell integrity, filtration, and critical GFCI safety bonding. We coordinate this alongside your primary inspection so you have zero hassle. Would you like us to include pool inspection for the property?",
      preAudio: null
    };
  }

  if (matchesAny(['thermal', 'flir', 'infrared', 'drone', 'drones', 'camera'])) {
    return {
      text: "Yes, absolutely! We include FLIR infrared thermal imaging to catch hidden leaks behind walls and aerial drone roof scans standard on every single inspection for free. Would you like to reserve an inspection window with our team?",
      preAudio: null
    };
  }

  if (matchesAny(['how long', 'duration', 'time take', 'hours'])) {
    return {
      text: "Because we send two certified inspectors on every single job instead of just one, we finish a complete, highly thorough inspection in just 1.5 to 2.5 hours, saving you half the time of exhausted solo inspectors! Would a morning or afternoon time work best for you?",
      preAudio: null
    };
  }

  if (matchesAny(['when report', 'report delivered', 'sample report', 'crl'])) {
    return {
      text: "Our detailed digital reports with HD photos, video clips, and our interactive Create Request List tool are delivered within 24 hours, and often the same evening! That gives you maximum time for your due diligence. Shall we hold a date for your inspection?",
      preAudio: null
    };
  }

  if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term'])) {
    return {
      text: "We offer complete Short-Term Rental safety compliance inspections for 355 dollars flat to ensure your Airbnb or Vrbo passes city and county guidelines with flying colors. Can I get that scheduled for your rental?",
      preAudio: null
    };
  }

  if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge'])) {
    return {
      text: "We make it super easy for real estate agents! We have active SUPRA key access so you do not have to wait around on site, plus all our buyers get free lifetime access to Utilities Plus concierge. Would you like to schedule an inspection for your client?",
      preAudio: null
    };
  }

  // Conversational Fallback: Genuinely acknowledging with active encouragement
  return {
    text: "Whether it is evaluating structural stability, electrical safety, or crawlspace moisture, our Certified Master Inspector team is here to give you complete peace of mind. What is the square footage or address of the home? I would love to calculate your exact rate and hold a slot for you.",
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
      const speechResponse = `Awesome! I have your tentative inspection request logged. Our office team will follow up directly at ${clientPhone} within two hours to confirm inspector arrival time, access, and schedule any requested auxiliary specialists. Remember that Sunday is by appointment only. We look forward to speaking with you!`;

      const audio = await synthesizeHumanVoice(speechResponse);
      return NextResponse.json({
        response: speechResponse,
        audio,
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
    const turnResult = generateMarcusDialogueTurn(messages, lastUserMessage);

    if (turnResult.preAudio) {
      return NextResponse.json({
        response: turnResult.text,
        audio: turnResult.preAudio,
        action: turnResult.action || 'message'
      });
    }

    // Synthesize response with Marcus's neural male voice
    const cleanReply = turnResult.text.replace(/\*/g, '').trim();
    const audio = await synthesizeHumanVoice(cleanReply);

    return NextResponse.json({
      response: cleanReply,
      audio,
      action: turnResult.action || 'message'
    });

  } catch (error) {
    console.error('Voice API Route Exception:', error);
    const fallbackText = "Welcome to Foresight Home Inspections! This is Marcus, your senior client concierge. How can I help you protect your investment today? Feel free to ask about our two-inspector standard, $10,000 warranty, instant pricing, or getting on our schedule!";
    const audio = await synthesizeHumanVoice(fallbackText);
    return NextResponse.json({
      response: fallbackText,
      audio,
      action: 'fallback'
    }, { status: 200 });
  }
}
