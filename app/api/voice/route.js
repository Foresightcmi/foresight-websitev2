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

// Studio-Grade Neural Voice Synthesis via EdgeTTS (en-US-ChristopherNeural)
async function synthesizeHumanVoice(text) {
  try {
    const { EdgeTTS } = await import('edge-tts-universal');
    const cleanText = (text || '')
      .replace(/[*#_~`\[\]()<>]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\$([0-9,]+)/g, '$1 dollars')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return null;

    const tts = new EdgeTTS(cleanText, 'en-US-ChristopherNeural', {
      rate: '+0%',
      pitch: '-2Hz'
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

// Christopher Boykin Expert InterNACHI Knowledge Engine (100% Reliable Fallback)
function generateChristopherKnowledgeResponse(userText) {
  const text = (userText || '').toLowerCase();
  const matchesAny = (keywords) => keywords.some(k => new RegExp(`\\b${k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(text));

  if (matchesAny(['two', 'team', 'dual', 'inspectors', 'pair', 'solo'])) {
    return "Why do we send two certified inspectors on every single job? Most companies dispatch a lone inspector who spends four to five exhausting hours on site. Fatigue sets in, and critical defects get missed. At Foresight, we send a dual-inspector team on every single inspection: a lead Certified Master Inspector plus another certified professional inspector. One inspects the roof, exterior, and mechanicals while the other thoroughly checks interior circuits, plumbing fixtures, and attic spaces. You get double the scrutiny in half the time, giving you the strongest due diligence defense in Georgia.";
  }

  if (matchesAny(['warranty', '10000', '10,000', 'guarantee', 'protection'])) {
    return "Every full home inspection with Foresight comes with our complimentary ten thousand dollar Master Protection Warranty with a zero-dollar deductible. This policy protects you after closing on mechanical systems, heating and cooling, plumbing, structural components, major appliances, roofs, and mold. While discount solo operators offer zero warranty, we back our Certified Master Inspector findings with real financial protection for complete peace of mind.";
  }

  if (matchesAny(['thermal', 'flir', 'infrared', 'drone', 'drones', 'camera'])) {
    return "We include advanced FLIR infrared thermal imaging and high-resolution aerial drone roof scans standard on every single full inspection at zero extra charge. Solo inspectors routinely charge an extra 75 to 150 dollars for thermal cameras or mark steep roofs as Not Inspected. We use thermal imaging to detect hidden wall moisture and hot breaker panels, and aerial drones to inspect every single roof shingle safely and thoroughly.";
  }

  if (matchesAny(['sop', 'internachi', 'standard', 'standards', 'code of ethics'])) {
    return "We strictly adhere to and exceed the comprehensive InterNACHI Standards of Practice, covering all ten core home systems: roof, exterior, basement, foundation and crawlspace structure, heating, cooling, plumbing, electrical, fireplace, attic insulation and ventilation, and interior doors and windows. Every finding is structured in our clear 3-step diagnostic format: Observation, What This Could Mean, and Recommendation.";
  }

  if (matchesAny(['compare', 'competitor', 'competitors', 'franchise', 'franchises', 'best', 'choice', 'why foresight'])) {
    return "Here is why Metro Atlanta buyers choose Foresight over national franchises and discount solo operators: National franchises charge 450 to 575 dollars or more to cover corporate royalties and dispatch random junior hourly techs. Solo discount operators charge 325 to 400 dollars, but working alone for four hours leads to fatigue, they carry zero warranty, and missing an 8,000 dollar hidden roof leak wipes out any small upfront saving. Foresight gives you two certified inspectors, our ten thousand dollar warranty, and free FLIR thermal and drone scans starting at 345 dollars for single-family homes and 295 dollars for condos. It is objectively the best value and protection in Georgia.";
  }

  if (matchesAny(['report', 'reports', 'sample', 'crl', 'create request list', 'format', 'structure'])) {
    return "Our modern cloud inspection reports exceed InterNACHI standards and are delivered within 24 hours, often same day. Packed with high-resolution photos and video clips, we write in plain English with our 3-step format: Observation, What This Could Mean, and Recommendation. Best of all, our interactive Create Request List lets you and your agent check defect items to generate official repair amendment addenda in seconds. Armed with this proof, buyers routinely win thousands of dollars in seller credits or upfront repairs!";
  }

  if (matchesAny(['radon'])) {
    return "Radon is an invisible, odorless radioactive gas released from Georgia granite soils. We recommend professional 48-hour continuous electronic monitoring at our flat 200 dollar rate. Under InterNACHI standards: Observation: Radon levels above the EPA action limit of 4.0 picoCuries per liter. What This Could Mean: Severe long-term respiratory health hazard. Recommendation: Certified radon mitigation contractor. Finding radon gives you the leverage to require the seller to install a 1,500 to 2,500 dollar mitigation system on their dime before closing!";
  }

  if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation'])) {
    return "Georgia is prime territory for subterranean termites, which can chew through structural floor joists and studs silently. We conduct a complete wood-destroying organism inspection at our 110 dollar bundled rate and provide the Official Georgia Wood Infestation Report. Observation: Active mud tubes. What This Could Mean: Active structural wood damage. Recommendation: Licensed pest control operator. This check saves you thousands in catastrophic framing repairs.";
  }

  if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
    return "A swimming pool is a wonderful luxury, but faulty pumps, heaters, or underwater lighting can cost 3,000 to 5,000 dollars to replace or create severe shock hazards. We offer a comprehensive Pool and Spa safety inspection at a 300 dollar flat rate. Observation: Pool light GFCI breaker fails to trip. What This Could Mean: Direct electrocution risk to swimmers. Recommendation: Licensed electrical contractor. Our pool inspection gives you the leverage to get seller repair credits before closing!";
  }

  if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
    return "Replacing a collapsed underground sewer line or fixing tree root intrusion costs 8,000 to 15,000 dollars out of pocket. Our high-definition Sewer Scope Camera inspection at a 425 dollar flat rate runs a specialized optic camera from your cleanout all the way to the municipal main, verifying the pipe is free of root intrusion, belly dips, or cracked clay. A vital check for homes over 25 years old!";
  }

  if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term'])) {
    return "Metro Atlanta counties, including DeKalb, Fulton, Gwinnett, and Cobb, enforce strict Short-Term Rental safety regulations for Airbnb and Vrbo hosts. We offer our STR Compliance Assist inspection at 355 dollars flat rate to verify smoke and carbon monoxide alarms, fire extinguishers, safe egress routes, and posted local agent signage before you submit your application.";
  }

  if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge', 'moving'])) {
    return "We make transactions seamless! For Realtors: Foresight carries active electronic SUPRA key access for secure lockbox entry, so agents don't have to drive out or wait around on site—we handle entry independently! For Buyers: All clients get free lifetime access to Utilities Plus, a premier Utility Concierge that sets up power, water, gas, fiber internet, and security in one quick call at the best available market rates!";
  }

  if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
    return "We believe in 100 percent transparent pricing based on square footage. Standard buyer home inspections start at 345 dollars, or 295 dollars for condos. Specialized add-ons include Termite and WDO for 110 dollars, 48-Hour Continuous Radon Gas for 200 dollars, Pool and Spa for 300 dollars, Sewer Scope Camera for 425 dollars, and STR Compliance Assist for 355 dollars. Both FLIR thermal imaging and aerial drone roof scans are included free standard on every job!";
  }

  return "Houses are complex systems, and what happens in the attic affects the basement. The absolute best way to protect your investment and save money is to have our Certified Master Inspector-led two person inspection team physically audit the home. We include FLIR thermal imaging, aerial drone scans, and our complimentary ten thousand dollar warranty on every job. Armed with our 24-hour Create Request List report, our clients routinely save thousands of dollars in closing credits or upfront seller repairs! What specific system or address can I help you evaluate today?";
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
        const speechResponse = `For a ${quoteResult.sqft.toLocaleString()} square foot ${quoteResult.propertyType === 'condo' ? 'condo' : 'home'}${quoteResult.foundation === 'crawlspace' ? ' with a crawlspace' : quoteResult.foundation === 'basement' ? ' with a basement' : ''}, your comprehensive inspection with our two-person Certified Master Inspector team is ${quoteResult.total} dollars.${quoteResult.addonBreakdown.length > 0 ? ` That includes ${quoteResult.addonBreakdown.map(a => `${a.name} for ${a.price} dollars`).join(' and ')}.` : ''} Both thermal imaging and aerial drone scans are included at zero extra charge. Would you like me to reserve a date for you on our schedule?`;

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
      const speechResponse = `Wonderful, ${clientName}! I have initiated your appointment booking for your inspection. Our office team will follow up directly at ${clientPhone} to finalize the exact arrival time and access details. Remember that Sunday is by appointment only. We look forward to protecting your investment!`;

      const audio = await synthesizeHumanVoice(speechResponse);
      return NextResponse.json({
        response: speechResponse,
        audio,
        action: 'scheduled',
        booking: bookingArgs
      });
    }

    // Try Gemini API if key is available
    const apiKey = process.env.GEMINI_API_KEY;
    let replyText = '';

    if (apiKey) {
      try {
        const systemInstruction = `You are Christopher Boykin, founder and Lead Inspector at Foresight Home Inspections in Metro Atlanta, Georgia. Certified Master Inspector (CMI). Answer naturally, authoritatively, warmly, and consultatively. Do NOT use any asterisks (*) or markdown formatting in your responses.`;
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const recentMessages = messages.slice(-8).map(msg => ({
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
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
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

    // If Gemini was unavailable or quota depleted, use Christopher Boykin Knowledge Engine
    if (!replyText || replyText.trim().length === 0) {
      replyText = generateChristopherKnowledgeResponse(lastUserMessage);
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
    const fallbackText = "Houses are complex systems, and I want to make sure you get the right advice. If you have any questions about foundations, roofs, radon, our two-inspector standard, or our ten thousand dollar warranty, ask me or call us at 678-480-2110!";
    const audio = await synthesizeHumanVoice(fallbackText);
    return NextResponse.json({
      response: fallbackText,
      audio,
      action: 'fallback'
    }, { status: 200 });
  }
}
