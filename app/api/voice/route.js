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

// Sarah Natural Phone Concierge Knowledge & Dialogue Engine (Instantaneous & Context-Aware)
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

  // 1. Time / Scheduling negotiation (e.g. "how about 10 o'clock instead?", "can we do 10?", "10 am", "tomorrow morning")
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

    // Other specific time
    const timeMatch = text.match(/\b(1[0-2]|[1-9])(?::([0-5][0-9]))?\s*(am|pm)?\b/i);
    const parsedTime = timeMatch ? `${timeMatch[1]}${timeMatch[2] ? `:${timeMatch[2]}` : ':00'} ${timeMatch[3] ? timeMatch[3].toUpperCase() : 'AM'}` : 'That time';
    return {
      text: `${parsedTime} works great for our two-inspector team! I have that slot held for you. What is the address of the home and your name?`,
      preAudio: null
    };
  }

  // 2. Affirmative responses ("yes", "sure", "sounds good", "perfect", "let's do it")
  if (matchesAny(['yes', 'sure', 'yeah', 'yep', 'sounds good', 'perfect', 'lets do it', "let's do it", 'that works', 'ok', 'okay', 'please'])) {
    if (prev.includes('schedule') || prev.includes('reserve') || prev.includes('date') || prev.includes('slot')) {
      return {
        text: "Awesome! Does a morning slot around 9:00 or 10:00 AM work better for you, or would you prefer afternoon? And what is the address of the home?",
        preAudio: '/audio/sarah-morning-afternoon.mp3'
      };
    }
  }

  // 3. Polite decline or browsing ("no", "not yet", "just looking", "just shopping")
  if (matchesAny(['no', 'nope', 'not yet', 'just looking', 'just shopping', 'just checking', 'not right now'])) {
    return {
      text: "No problem at all! Feel free to ask me anything about our ten thousand dollar warranty, pricing, or our two-inspector process whenever you are ready. What questions can I answer for you?",
      preAudio: '/audio/sarah-browsing.mp3'
    };
  }

  // 4. Address detection (e.g. "1816 South Deshon Road", "in Lithonia", "123 Main St", "in Alpharetta")
  const addressRegex = /\b(\d{1,5}\s+[A-Za-z0-9\s]+(?:road|rd|street|st|avenue|ave|drive|dr|lane|ln|way|blvd|circle|ct|court))\b/i;
  const cityRegex = /\b(?:in\s+)?(lithonia|atlanta|sandy springs|alpharetta|decatur|marietta|conyers|lawrenceville|duluth|roswell|smyrna|cumming|woodstock|kennesaw|buford|peachtree city|dunwoody|brookhaven|johns creek)\b/i;
  const addressFound = text.match(addressRegex) || text.match(cityRegex);

  if (addressFound && (prev.includes('address') || prev.includes('property') || text.includes('road') || text.includes('street') || text.includes('drive') || text.includes('ave'))) {
    const rawAddress = addressFound[0].trim();
    return {
      text: "Got that property address down! What is your name and the best phone number so our office can send the confirmation and coordinate access?",
      preAudio: '/audio/sarah-address-confirm.mp3'
    };
  }

  // 5. Name introduction ("my name is ...", "i'm ...")
  const nameIntroMatch = text.match(/(?:my name is|name is|i am|this is|i'm|im)\s+([A-Za-z\s]+?)(?:,|\.|\s+and|\s+my|\s+phone|\s+at|$)/i);
  if (nameIntroMatch && !prev.includes('phone') && !text.includes('square')) {
    const clientName = nameIntroMatch[1].trim();
    return {
      text: `Great to meet you, ${clientName}! What's the best phone number for you, and what date or time would you prefer for your inspection?`,
      preAudio: null
    };
  }

  // 6. Signature Value Questions (Pre-Rendered Instant Audio)
  if (matchesAny(['two', 'team', 'dual', 'inspectors', 'pair', 'solo'])) {
    return {
      text: "Most companies send one inspector who gets fatigued after four hours. We send two certified inspectors on every single job, led by Certified Master Inspector Christopher Boykin! You get double the scrutiny in half the time, plus our ten thousand dollar warranty. What type of home are you buying?",
      preAudio: '/audio/sarah-why-two.mp3'
    };
  }

  // Warranty & Guarantee (Instant Audio)
  if (matchesAny(['warranty', '10000', '10,000', 'guarantee', 'protection'])) {
    return {
      text: "Every full inspection includes our complimentary ten thousand dollar Master Protection Warranty with zero deductible! It covers mechanical systems, structure, appliances, roofs, and mold after closing. Would you like me to check our schedule for your inspection date?",
      preAudio: '/audio/sarah-warranty.mp3'
    };
  }

  // Pricing (Instant Audio)
  if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
    return {
      text: "Our single-family inspections start at 345 dollars, and condos start at 295, based on square footage. That includes thermal imaging and aerial drone roof scans at no extra charge! About how many square feet is the house?",
      preAudio: '/audio/sarah-pricing.mp3'
    };
  }

  // Radon (Instant Audio)
  if (matchesAny(['radon'])) {
    return {
      text: "Radon is very common in Georgia granite bedrock. We run 48-hour continuous electronic monitoring for 200 dollars. If levels are elevated, we give you the leverage to have the seller install a mitigation system before closing! Should we add radon testing for you?",
      preAudio: '/audio/sarah-radon.mp3'
    };
  }

  // Termite (Instant Audio)
  if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation'])) {
    return {
      text: "Georgia is prime termite country. We do complete wood-destroying organism inspections for 110 dollars bundled, and provide the official Georgia Wood Infestation Report. Would you like me to include termite on your estimate?",
      preAudio: '/audio/sarah-termite.mp3'
    };
  }

  // Sewer Scope (Instant Audio)
  if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
    return {
      text: "Replacing a broken sewer line can cost eight to fifteen thousand dollars! Our high-definition camera inspects the main drain pipe all the way to the municipal connection for 425 dollars. It is especially recommended for homes over 25 years old. What year was the home built?",
      preAudio: '/audio/sarah-sewer.mp3'
    };
  }

  if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
    return {
      text: "We inspect pool pumps, heaters, filtration, and safety GFCI breakers for 300 dollars flat. Catching pool issues early gives you great leverage to negotiate seller credits before closing. Does the home have a pool or hot tub?",
      preAudio: null
    };
  }

  if (matchesAny(['thermal', 'flir', 'infrared', 'drone', 'drones', 'camera'])) {
    return {
      text: "Yes, absolutely! We include FLIR infrared thermal imaging to catch hidden leaks and aerial drone roof scans standard on every single inspection for free. What area or neighborhood is the home in?",
      preAudio: null
    };
  }

  if (matchesAny(['how long', 'duration', 'time take', 'hours'])) {
    return {
      text: "Because we send two certified inspectors on every single job instead of just one, we finish a complete, highly thorough inspection in just 1.5 to 2.5 hours, saving you half the time of exhausted solo inspectors! What size is the home?",
      preAudio: null
    };
  }

  if (matchesAny(['when report', 'report delivered', 'sample report', 'crl'])) {
    return {
      text: "Our detailed digital reports with HD photos, video clips, and our interactive Create Request List tool are delivered within 24 hours, and often the same day! Would you like me to reserve a date for your inspection?",
      preAudio: null
    };
  }

  if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term'])) {
    return {
      text: "We offer complete Short-Term Rental safety compliance inspections for 355 dollars flat to ensure your Airbnb or Vrbo passes city and county guidelines with flying colors. Are you setting up a rental in Metro Atlanta?",
      preAudio: null
    };
  }

  if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge'])) {
    return {
      text: "We make it super easy for real estate agents! We have active SUPRA key access so you don't have to wait around on site, plus all our buyers get free lifetime access to Utilities Plus concierge. Can I get the property address for your client?",
      preAudio: null
    };
  }

  // General default fallback
  return {
    text: "Thanks for asking! At Foresight, our two-inspector team led by Certified Master Inspector Christopher Boykin protects your investment with thermal imaging, drone scans, and our ten thousand dollar warranty. What is the address or square footage of the property?",
    preAudio: '/audio/sarah-general-fallback.mp3'
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

    // 3. Multi-turn dialogue routing (handles 10 o'clock, appointments, addresses, value queries)
    const turnResult = generateSarahDialogueTurn(messages, lastUserMessage);

    if (turnResult.preAudio) {
      return NextResponse.json({
        response: turnResult.text,
        audio: turnResult.preAudio,
        action: 'message'
      });
    }

    // Synthesize response with Sarah's neural female voice
    const cleanReply = turnResult.text.replace(/\*/g, '').trim();
    const audio = await synthesizeHumanVoice(cleanReply);

    return NextResponse.json({
      response: cleanReply,
      audio,
      action: 'message'
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
