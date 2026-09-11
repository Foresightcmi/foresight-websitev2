import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { recordLead } from '../../../lib/leads';

// Calculation helper strictly adhering to Foresight pricing engine
function calculateQuoteDetails({ propertyType = 'single-family', serviceType = 'buyer', sqft = 2000, foundation = 'slab', ageTier = 'under-50', addons = {} }) {
  let base = 345;
  const parsedSqft = Number(sqft) || 2000;

  if (serviceType === 'str') {
    base = 595;
  } else if (propertyType === 'condo' || serviceType === 'condo') {
    if (parsedSqft <= 1000) base = 295;
    else base = 325;
  } else {
    if (parsedSqft <= 1000) base = 345;
    else if (parsedSqft <= 1500) base = 375;
    else if (parsedSqft <= 2000) base = 425;
    else if (parsedSqft <= 2500) base = 475;
    else if (parsedSqft <= 3000) base = 525;
    else if (parsedSqft <= 3500) base = 575;
    else if (parsedSqft <= 4000) base = 625;
    else if (parsedSqft <= 4500) base = 675;
    else if (parsedSqft <= 5000) base = 775;
    else if (parsedSqft <= 5500) base = 875;
    else base = 985;
  }

  let extra = 0;
  if (serviceType !== 'str') {
    if (ageTier === 'over-50') extra += 75;
  }

  if (propertyType === 'single-family' && serviceType !== 'str') {
    if (foundation === 'crawlspace') extra += 75;
    if (foundation === 'basement') extra += 250;
  }

  const addonBreakdown = [];
  if (addons.radon) { extra += 250; addonBreakdown.push({ name: 'Radon Gas Testing', price: 250 }); }
  if (addons.termite) { 
    const termitePrice = foundation === 'crawlspace' ? 165 : 125;
    extra += termitePrice; 
    addonBreakdown.push({ name: 'Termite / WDO Inspection', price: termitePrice }); 
  }
  if (addons.pool) { extra += 275; addonBreakdown.push({ name: 'Pool & Spa Inspection', price: 275 }); }
  if (addons.sewer) { extra += 450; addonBreakdown.push({ name: 'Sewer Scope Camera', price: 450 }); }
  if (addons.lowFlow) { extra += 100; addonBreakdown.push({ name: 'DeKalb Low Flow Certification', price: 100 }); }
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

  const systemInstruction = `You are Marcus, the official Foresight AI home inspection and maintenance advisor and senior client concierge for Foresight Home Inspections, LLC in Metro Atlanta (Phone: 678-480-2110; Email: inspect@foresightcmi.com).
You represent Certified Master Inspector (CMI) Christopher Boykin and possess all the building science advisory, diagnostic, and consultative capabilities of the Foresight AI Advisor. Your voice and demeanor are warm, unhurried, friendly, folksy, knowledgeable, and deeply reassuring, similar to the master builder host on "Ask This Old House".
You are conversing live with a home buyer, seller, homeowner, or real estate agent browsing Foresight's website. Welcome them warmly, answer their questions with deep building science expertise, and help them understand building systems, schedule inspections, or check instant pricing. Never refer to this conversation as a phone call.

UNSHAKEABLE BUSINESS IDENTITY RULE:
You are exclusively the Foresight AI home inspection and maintenance advisor for Foresight Home Inspections, LLC. NEVER say you are an ungrounded AI or not connected to a particular business. NEVER ask what business the visitor is talking about. You represent Foresight Home Inspections proudly and completely.

CRITICAL SUNDAY & OPERATING HOURS POLICY:
- Foresight Home Inspections is OPEN ON SUNDAY STRICTLY BY APPOINTMENT ONLY!
- Standard operating schedule: Monday through Saturday, 8:00 AM to 8:00 PM.
- Sunday inspections: Strictly by advance appointment only.
- Whenever asked about Sunday ("are you open Sunday?", "Sunday hours", "weekend inspections"), immediately state: "Yes, Foresight Home Inspections is open on Sunday strictly by appointment only! While our standard schedule runs Monday through Saturday, we are always happy to accommodate Sunday inspections booked in advance. What property address are you looking to have inspected?"

INTERNACHI STANDARDS OF PRACTICE (SOP) & 3-STEP DIAGNOSTIC ADVISORY CAPABILITY:
You possess comprehensive knowledge of all 10 InterNACHI Standards of Practice (SOP) chapters:
1. ROOF: Roof covering materials, gutters, downspouts, flashings, skylights, chimneys, and roof penetrations. For steep or tall roofs, explain that we deploy high-resolution 4K aerial camera drones at zero extra cost.
2. EXTERIOR: Exterior wall coverings (brick, fiber cement, stone, stucco/EIFS), trim, eaves, soffits, fascias, exterior doors, windows, decks, balconies, porches, stoops, handrails, and grading/drainage.
3. BASEMENT, FOUNDATION, CRAWLSPACE & STRUCTURE: Foundation walls, crawlspaces, floor framing, piers, beams, joists, subflooring, ventilation, vapor retarders, sump pumps, and structural movement. Differentiate between normal vertical hairline concrete shrinkage and serious stair-step masonry or horizontal cracking from Georgia red clay soil hydrostatic pressure.
4. HEATING & COOLING (HVAC): Heating and cooling equipment, distribution ducts and registers, air filters, flues, temperature split differentials, and attic condensate overflow pans/float switches.
5. PLUMBING: Main water shutoff valve, interior supply piping (copper, PEX, CPVC, and identifying vulnerable polybutylene), drain/waste/vent piping (PVC, cast iron corrosion), functional flow, drainage, water heating equipment (temperature and pressure relief TPR valves, discharge pipes), and fuel supply lines.
6. ELECTRICAL: Service drop, meter base, main service panel, subpanels, circuit breakers (testing for fire hazards like Federal Pacific Stab-Lok, Zinsco, and single-strand aluminum branch wiring), switches, receptacles, and testing accessible GFCI and AFCI safety devices.
7. FIREPLACE: Fireplaces, stoves, hearth extensions, damper doors, and visible flues.
8. ATTIC, INSULATION & VENTILATION: Attic insulation levels (R-values), vapor retarders, ventilation, and verifying bath/kitchen exhausts vent to the exterior.
9. DOORS, WINDOWS & INTERIOR: Representative doors, windows, walls, ceilings, floors, stairways, railings, and garage door auto-reverse sensors.
10. INTERNACHI 3-STEP DIAGNOSTIC FORMAT: Whenever discussing a specific home issue, defect, or concern, deliver your core diagnostic finding in this exact 3-step format:
    - Observation: Clearly state the physical finding or symptom observed.
    - What This Could Mean: State the real-world risk, moisture hazard, structural rot, or financial cost in plain English. (STRICT RULE: NEVER say "What This Means". Always strictly say "What This Could Mean" or "What This Could Imply" for legal liability protection).
    - Recommendation: State the exact qualified licensed trade contractor needed to evaluate further and perform the repair.

CRITICAL CONVERSATIONAL & SALES EXCELLENCE RULES:
1. TRULY LISTEN AND ANSWER DIRECTLY: You must directly, thoroughly, and specifically answer whatever question, concern, or comment the visitor just made. Never ignore what they asked.
2. ACTIVE SALES ENCOURAGEMENT (MANDATORY): In every single response, after answering the question with building science precision, bridge seamlessly to Foresight's advantages and actively encourage the client to take the next step (e.g., getting an exact square-footage quote, checking date availability, or holding a morning or afternoon inspection slot).
3. APPOINTMENT SOLIDIFICATION POLICY (50% DEPOSIT & SIGNED AGREEMENTS AFTER CONFIRMATION):
   - To solidify all appointments on our master calendar, the 50% deposit along with the signed inspection agreements are completed AFTER our office sends the appointment confirmation.
   - The remaining 50% balance is due after on-site completion before the official inspection report is released.
   - Explain this policy whenever booking, scheduling, deposits, or next steps are discussed.
4. CIRCUMSTANTIAL & REASONABLE UPSELLS (NEVER PUSHY):
   - Older homes (pre-1990 / 25+ years old): Sewer Scope Camera ($450) to check for clay or cast iron collapse.
   - Homes with crawlspaces, basements, or in the Atlanta granite belt: 48-Hour Continuous Radon Gas Testing ($250).
   - Properties in Georgia / buyers with mortgages: Termite/WDO clearance letter ($125+).
   - Homes with pools or spas: Pool & Spa inspection ($275).
   - CRITICAL RULE — ALWAYS ACCEPT 'NO' GRACIOUSLY: Never be aggressive or pushy. If the customer declines or says 'no', ALWAYS accept graciously immediately without friction or rebuttal (e.g. 'Understood, no problem at all! We will keep your inspection focused strictly on your core evaluation'). Never repeat a declined recommendation.
5. CONCISE & SPOKEN NATURAL AUDIO: Keep your answers to 2 to 4 punchy, conversational sentences (around 35 to 55 words).
6. ALL DISTINCTIVE FORESIGHT WEBSITE BENEFITS & PRICING:
   - Two-Inspector certified team on every site (finishes in 1.5 to 2.5 hours vs 4+ hours for solo operators).
   - Complimentary $10,000 Master Protection Warranty with zero deductible.
   - Complimentary FLIR thermal imaging and 4K aerial drone scans standard on every inspection.
   - 24-hour digital reports with interactive Create Request List (CRL) tool.
   - Single-family homes start at $345, condos at $295. Add-ons: Pool $275, Termite WDO $125+, Radon $250, STR $595, Sewer Scope $450.
7. ABSOLUTE CLEAN FORMATTING: Write in 100% clean plain English. NEVER use asterisks (*) or markdown symbols under any circumstances.`;

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
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

  // 0a. Sunday Operating Hours & Schedule Check (Instant Priority)
  if (matchesAny(['sunday', 'sundays', 'open on sunday', 'open sunday', 'weekend', 'weekends', 'hours', 'operating hours', 'business hours', 'when are you open', 'what time are you open', 'are you open', 'what days are you open'])) {
    return {
      text: "Yes, Foresight Home Inspections is open on Sunday strictly by appointment only! While our standard inspection schedule runs Monday through Saturday from 8:00 AM to 8:00 PM, we are always happy to accommodate Sunday inspections by advance appointment. What property address are you looking to have inspected?",
      preAudio: '/audio/marcus-sunday.mp3'
    };
  }

  // 0b. Business Identity / Foresight AI Advisor Grounding
  if (matchesAny(['what business', 'which business', 'what company', 'who are you', 'who is this', 'what is this', 'what do you do', 'not connected', 'who is your boss'])) {
    return {
      text: "You have reached Foresight Home Inspections! I am Marcus, your Foresight AI home inspection and maintenance advisor. Led by Certified Master Inspector Christopher Boykin, our two-inspector team delivers Georgia's most thorough home evaluations, building science diagnostics, and instant quotes. What's on your mind today? Let's talk houses!",
      preAudio: null
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

  // 5. Gracious decline handler (Accepting "NO" graciously without being pushy)
  if (matchesAny(['no', 'nope', 'no thanks', 'pass', 'not yet', 'just looking', 'just shopping', 'just checking', 'not right now', 'dont need it', "don't need", 'skip it', 'leave it off', 'no thank you', 'just the basic', 'just the inspection', 'no addon', 'no add on', 'keep it basic'])) {
    if (prev.includes('radon') || prev.includes('termite') || prev.includes('sewer') || prev.includes('pool') || prev.includes('add') || prev.includes('upsell') || prev.includes('bundle') || prev.includes('suggest') || prev.includes('recommend') || prev.includes('camera') || prev.includes('scope')) {
      return {
        text: "Understood, no problem at all! We will keep your inspection focused strictly on your core evaluation with our two-inspector team. What date or time window works best for you?",
        preAudio: '/audio/marcus-decline-addon.mp3'
      };
    }
    return {
      text: "No problem at all! Feel free to ask me anything about our ten thousand dollar warranty, pricing, or our two-inspector process whenever you are ready. What questions can I answer for you?",
      preAudio: '/audio/marcus-browsing.mp3'
    };
  }

  // 5b. Payment Policy & Deposit Query (50% Deposit to Solidify)
  if (matchesAny(['deposit', 'down payment', 'payment policy', 'payment terms', 'when do i pay', 'how do i pay', 'pay upfront', '50 percent', 'half down', 'half upfront'])) {
    return {
      text: "To solidify all appointments on our master calendar, a 50 percent deposit is required upon booking, with the remaining 50 percent balance due after our on-site walkthrough before your official report is released. Would you like me to hold our next available window for you?",
      preAudio: '/audio/marcus-payment-policy.mp3'
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

  // Older Homes Contextual Sewer Scope Recommendation
  if (matchesAny(['older home', 'historic home', 'pre-1990', '1960', '1970', '1980', 'cast iron pipe', 'clay pipe', 'tree roots', 'root intrusion'])) {
    return {
      text: "Because older homes frequently have clay or cast iron sewer lines vulnerable to root intrusion or bellies, we often suggest our high-definition sewer scope camera for 450 dollars. Would you like us to include that, or keep it strictly to the standard home inspection?",
      preAudio: '/audio/marcus-upsell-sewer.mp3'
    };
  }

  // Radon (Contextual Upsell & Info)
  if (matchesAny(['radon'])) {
    return {
      text: "Since the property features a crawlspace or basement and Georgia has high granite bedrock, we frequently recommend our 48-hour continuous radon monitor test for 250 dollars. Would you like to add that to your estimate, or keep it as is?",
      preAudio: '/audio/marcus-upsell-radon.mp3'
    };
  }

  // Termite (Contextual Upsell & Info)
  if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation', 'wood destroying'])) {
    return {
      text: "Because Georgia is in the termite belt and most lenders require an official clearance letter, we can bundle your official Georgia termite letter starting at 125 dollars. Would you like that included, or do you already have that covered?",
      preAudio: '/audio/marcus-upsell-termite.mp3'
    };
  }

  // Sewer Scope (Instant Audio)
  if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
    return {
      text: "Replacing a collapsed sewer lateral can cost eight to fifteen thousand dollars! We perform high-definition camera sewer scopes for 450 dollars to inspect the underground line all the way to the municipal main. It is one of the smartest investments you can make during due diligence. Shall I reserve a slot for your sewer scope?",
      preAudio: null
    };
  }

  if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
    return {
      text: "We provide comprehensive pool and spa inspections for 275 dollars flat, evaluating pumps, heaters, shell integrity, filtration, and critical GFCI safety bonding. We coordinate this alongside your primary inspection so you have zero hassle. Would you like us to include pool inspection for the property?",
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

  // Roof & Attic Diagnostic Advice (InterNACHI SOP)
  if (matchesAny(['roof', 'roofs', 'shingle', 'shingles', 'chimney', 'gutter', 'gutters', 'attic', 'soffit', 'fascia'])) {
    return {
      text: "Your roof is your home's primary shield. Under InterNACHI standards, we check every shingle, flashing point, boot, and chimney. For steep or high roofs, we deploy high-resolution aerial drones at zero extra charge. We also crawl the attic to inspect insulation, ventilation, and roof decking. Would you like to check our availability for your inspection?",
      preAudio: null
    };
  }

  // 11-Month Builder Warranty & New Construction
  if (matchesAny(['new home', 'new homes', 'new construction', 'new build', 'builder', 'pre-drywall', '11-month', '11 month'])) {
    return {
      text: "Never skip an inspection on a new build! City code inspectors spend only minutes on site. Our 11-Month Warranty and New Construction inspections provide an independent, builder-ready punch list so your builder repairs defects on their dime before your warranty runs out. Can I help hold an inspection time for you?",
      preAudio: null
    };
  }

  // Payment Policy & 50% Deposit Solidification Intent
  if (matchesAny(['deposit', 'down payment', 'pay', 'payment', 'solidify', 'agreement', 'agreements', 'terms of payment', 'when do i pay', 'how do i pay', 'upfront'])) {
    return {
      text: "To solidify all appointments on our master calendar, a 50 percent deposit along with the signed inspection agreements are completed after our office sends your appointment confirmation. The remaining 50 percent balance is due after our on-site walkthrough before your official report is released. Would you like me to hold our next available window for you?",
      preAudio: '/audio/marcus-payment-policy.mp3'
    };
  }

  // Gracious Acceptance of "No" / Declining Add-ons (Zero Pushiness)
  if (matchesAny(['no thanks', 'no thank you', 'pass', 'just the basic', 'don\'t need it', 'do not need it', 'not right now', 'skip it', 'just the inspection', 'no addon', 'no add-on', 'decline', 'without that', 'leave that off'])) {
    return {
      text: "Understood, no problem at all! We will keep your inspection focused strictly on your core evaluation with our two-inspector team. What date or time window works best for you?",
      preAudio: '/audio/marcus-decline-addon.mp3'
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
        const deposit = Math.round(quoteResult.total / 2);
        const speechResponse = `For a ${quoteResult.sqft.toLocaleString()} square foot ${quoteResult.propertyType === 'condo' ? 'condo' : 'home'}${quoteResult.foundation === 'crawlspace' ? ' with a crawlspace' : quoteResult.foundation === 'basement' ? ' with a basement' : ''}, your total is ${quoteResult.total} dollars with our two-person Certified Master Inspector team.${quoteResult.addonBreakdown.length > 0 ? ` That includes ${quoteResult.addonBreakdown.map(a => `${a.name} for ${a.price} dollars`).join(' and ')}.` : ''} That includes drone roof scans and thermal imaging at no extra charge. To solidify your appointment on our master calendar, the 50 percent deposit of ${deposit} dollars along with your signed inspection agreements are completed after our office sends your appointment confirmation, and the remaining 50 percent balance is paid after on-site completion before your report is released. Would you prefer a morning or afternoon slot?`;

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
      const speechResponse = `Awesome! I have your inspection request logged. Our office team will follow up directly at ${clientPhone} within 20 minutes with your official appointment confirmation and inspection agreements to sign. To solidify your appointment on our master calendar, the 50 percent deposit along with your signed agreements are submitted after receiving our confirmation, and the remaining 50 percent balance is paid after on-site completion before your report is released. We look forward to working with you!`;

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
