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

// Sarah Natural Phone Concierge Knowledge Engine (Instantaneous, Human & Conversational)
function generateSarahConversationalResponse(userText) {
  const text = (userText || '').toLowerCase();
  const matchesAny = (keywords) => keywords.some(k => new RegExp(`\\b${k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(text));

  if (matchesAny(['two', 'team', 'dual', 'inspectors', 'pair', 'solo'])) {
    return {
      text: "Most companies send one inspector who gets fatigued after four hours. We send two certified inspectors on every single job, led by Certified Master Inspector Christopher Boykin! You get double the scrutiny in half the time, plus our ten thousand dollar warranty. What type of home are you buying?",
      preAudio: '/audio/sarah-why-two.mp3'
    };
  }

  if (matchesAny(['warranty', '10000', '10,000', 'guarantee', 'protection'])) {
    return {
      text: "Every full inspection includes our complimentary ten thousand dollar Master Protection Warranty with zero deductible! It covers mechanical systems, structure, appliances, roofs, and mold after closing. Would you like me to check our schedule for your inspection date?",
      preAudio: '/audio/sarah-warranty.mp3'
    };
  }

  if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
    return {
      text: "Our single-family inspections start at 345 dollars, and condos start at 295, based on square footage. That includes thermal imaging and aerial drone roof scans at no extra charge! About how many square feet is the house?",
      preAudio: '/audio/sarah-pricing.mp3'
    };
  }

  if (matchesAny(['radon'])) {
    return {
      text: "Radon is very common in Georgia granite bedrock. We run 48-hour continuous electronic monitoring for 200 dollars. If levels are elevated, we give you the leverage to have the seller install a mitigation system before closing! Should we add radon testing for you?",
      preAudio: '/audio/sarah-radon.mp3'
    };
  }

  if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation'])) {
    return {
      text: "Georgia is prime termite country. We do complete wood-destroying organism inspections for 110 dollars bundled, and provide the official Georgia Wood Infestation Report. Would you like me to include termite on your estimate?",
      preAudio: '/audio/sarah-termite.mp3'
    };
  }

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

  return {
    text: "Thanks for asking! At Foresight, our two-inspector team led by Certified Master Inspector Christopher Boykin protects your investment with thermal imaging, drone scans, and our ten thousand dollar warranty. What's the address or square footage of the property?",
    preAudio: null
  };
}

export async function POST(request) {
  try {
    const { messages = [], currentQuote = null } = await request.json();
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    const lastUserTextLower = lastUserMessage.toLowerCase();

    // Direct quote calculation intent (e.g., user mentions square footage)
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
        const speechResponse = `For a ${quoteResult.sqft.toLocaleString()} square foot ${quoteResult.propertyType === 'condo' ? 'condo' : 'home'}${quoteResult.foundation === 'crawlspace' ? ' with a crawlspace' : quoteResult.foundation === 'basement' ? ' with a basement' : ''}, your total is ${quoteResult.total} dollars with our two-person Certified Master Inspector team.${quoteResult.addonBreakdown.length > 0 ? ` That includes ${quoteResult.addonBreakdown.map(a => `${a.name} for ${a.price} dollars`).join(' and ')}.` : ''} That includes drone scans and thermal imaging for free. Would you like me to get you on the schedule?`;

        const audio = await synthesizeHumanVoice(speechResponse);
        return NextResponse.json({
          response: speechResponse,
          audio,
          action: 'quote_calculated',
          quote: quoteResult
        });
      }
    }

    // Direct schedule appointment intent (e.g. user provides phone or name)
    const phoneMatch = lastUserMessage.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch && (lastUserTextLower.includes('schedule') || lastUserTextLower.includes('book') || lastUserTextLower.includes('reserve') || lastUserTextLower.includes('name is') || lastUserTextLower.includes('my name'))) {
      const nameMatch = lastUserMessage.match(/(?:my name is|name is|i am|this is)\s+([A-Za-z\s]+?)(?:,|\.|\s+and|\s+my|\s+phone|\s+at|$)/i);
      const clientName = nameMatch ? nameMatch[1].trim() : 'Valued Client';
      const clientPhone = phoneMatch[1];

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
      const speechResponse = `Awesome, ${clientName}! I've got your inspection reservation initiated right now. Our team will follow up directly at ${clientPhone} to confirm arrival time and lockbox details. Remember that Sunday is by appointment only. We look forward to working with you!`;

      const audio = await synthesizeHumanVoice(speechResponse);
      return NextResponse.json({
        response: speechResponse,
        audio,
        action: 'scheduled',
        booking: bookingArgs
      });
    }

    // Check pre-rendered fast match
    const fastKnowledge = generateSarahConversationalResponse(lastUserMessage);
    if (fastKnowledge.preAudio) {
      return NextResponse.json({
        response: fastKnowledge.text,
        audio: fastKnowledge.preAudio,
        action: 'message'
      });
    }

    // Try Gemini API if key is available for dynamic conversation
    const apiKey = process.env.GEMINI_API_KEY;
    let replyText = '';

    if (apiKey) {
      try {
        const systemInstruction = `You are Sarah, the friendly, articulate customer concierge and phone receptionist at Foresight Home Inspections in Metro Atlanta, Georgia.
You are speaking live on a phone call with a client.
Rules:
1. Speak in a warm, natural, human conversational tone (like an energetic, helpful concierge answering the phone).
2. Keep your answers brief (2 to 3 sentences maximum per turn). Never give long monologues or lists.
3. Highlight Foresight advantages: two certified inspectors on every job led by Christopher Boykin (Certified Master Inspector), complimentary $10,000 Master Protection Warranty with $0 deductible, free FLIR infrared thermal imaging and aerial drone scans.
4. Pricing: Single-family starts at $345, condos at $295. Add-ons: Radon $200, Termite/WDO $110+, Pool $300, Sewer Scope $425, STR $355.
5. Sunday is by appointment only.
6. Always conclude with a natural, friendly conversational question.
7. Do NOT use any asterisks (*) or markdown formatting.`;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const recentMessages = messages.slice(-6).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content.replace(/\*/g, '') }]
        }));

        if (recentMessages.length === 0) {
          recentMessages.push({ role: 'user', parts: [{ text: lastUserMessage || 'Hello' }] });
        }

        const geminiRes = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: recentMessages,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
          })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (geminiErr) {
        console.warn('[VOICE] Gemini upstream call bypassed:', geminiErr.message);
      }
    }

    // If Gemini was unavailable or quota depleted, use Sarah conversational response
    if (!replyText || replyText.trim().length === 0) {
      replyText = fastKnowledge.text;
    }

    // Clean text and synthesize neural human audio
    replyText = replyText.replace(/\*/g, '').trim();
    const audio = await synthesizeHumanVoice(replyText);

    return NextResponse.json({
      response: replyText,
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
