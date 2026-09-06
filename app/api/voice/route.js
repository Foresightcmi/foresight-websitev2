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

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = await request.json();
    const { messages = [], currentQuote = null } = body;

    const systemInstruction = `You are Christopher Boykin, a seasoned Certified Master Inspector and founder of Foresight Home Inspections, LLC in Metro Atlanta.
Your voice is warm, friendly, folksy, knowledgeable, and reassuring, exactly like the master builder host on "Ask This Old House".
You are speaking out loud through a voice call with a prospective client or homeowner.

KEY RULES OF SPEECH:
1. Speak naturally as in a phone call or hands-free voice consultation. Keep sentences punchy, conversational, and direct.
2. If the user describes a home defect or system concern, ALWAYS deliver your core diagnostic finding in the official 3-step InterNACHI format:
   Observation: [State the exact physical condition or symptom observed]
   What This Could Mean: [Explain the real hazard, moisture intrusion, or financial risk in plain English. STRICT: NEVER use "What This Means". Always use "What This Could Mean" or "What This Could Imply" for legal compliance.]
   Recommendation: [Recommend the exact licensed specialist or contractor needed to evaluate and repair.]
3. TWO-INSPECTOR ADVANTAGE: Emphasize that on every job, we deploy a two-person team—a lead Certified Master Inspector plus another certified inspector. Two sets of eyes catch what a solo inspector easily misses!
4. REASONABLE CONTEXTUAL UPSELLING:
   Whenever contextually appropriate, recommend our specialized high-value add-ons:
   - Older homes (over 25 yrs) or lots with mature trees: Recommend Sewer Scope Camera Inspection ($425 flat) to check for collapsed clay lines or root intrusion before closing.
   - Any basement or crawlspace, or granite rock areas in Metro Atlanta: Recommend 48-Hour Continuous Radon Gas Testing ($200).
   - Warm damp Georgia climate: Subterranean termites cause massive unseen framing damage. Recommend the Official Georgia Wood Infestation Report / WDO check ($110+).
   - Pools or Spas: Recommend our Pool & Spa safety and mechanical check ($300).
   - Short-Term Rentals (Airbnb/Vrbo) in DeKalb, Fulton, Gwinnett: Recommend our STR Safety Compliance Assist ($355 flat rate).
   - New construction under 1 year old: Recommend an 11-Month Builder Warranty Inspection ($350+) so builders repair issues on their dime before the warranty expires!
5. FINANCIAL LEVERAGE: Remind them that a professional inspection is the highest-ROI investment they will make. Uncovering defects early gives them the photographic proof to require the seller to perform upfront repairs or secure thousands of dollars in closing credits!
6. SCHEDULE INSPECTIONS: If the user is interested in getting their home inspected, getting on the schedule, or locking in a date, enthusiastically offer to book them right now. Gather their name, phone number, property address, and preferred inspection day. Call the 'schedule_inspection' tool immediately once you have their basic info! Sunday is strictly by appointment only.
7. ABSOLUTE CONTENT RULE: Write in 100% clean plain text. NEVER use asterisks (*) or double-asterisks (**) under any circumstances. No markdown symbols in visible voice output.`;

    // Function definitions for Gemini Tool Calling
    const tools = [
      {
        function_declarations: [
          {
            name: 'calculate_quote',
            description: 'Calculates the official transparent home inspection fee based on property square footage, age, foundation, and add-ons.',
            parameters: {
              type: 'OBJECT',
              properties: {
                propertyType: { type: 'STRING', enum: ['single-family', 'condo'] },
                serviceType: { type: 'STRING', enum: ['buyer', 'seller', 'new-construction', 'warranty', 'str'] },
                sqft: { type: 'NUMBER', description: 'Square footage of the home' },
                foundation: { type: 'STRING', enum: ['slab', 'crawlspace', 'basement'] },
                ageTier: { type: 'STRING', enum: ['under-25', '25-49', 'over-50'] },
                addons: {
                  type: 'OBJECT',
                  properties: {
                    radon: { type: 'BOOLEAN' },
                    termite: { type: 'BOOLEAN' },
                    pool: { type: 'BOOLEAN' },
                    sewer: { type: 'BOOLEAN' },
                    lowFlow: { type: 'BOOLEAN' },
                    buildfax: { type: 'BOOLEAN' }
                  }
                }
              },
              required: ['propertyType', 'sqft']
            }
          },
          {
            name: 'schedule_inspection',
            description: 'Books an inspection appointment for the client, records their contact details, and notifies Christopher Boykin to lock the slot.',
            parameters: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING', description: 'Client full name' },
                phone: { type: 'STRING', description: 'Client phone number' },
                email: { type: 'STRING', description: 'Client email address' },
                address: { type: 'STRING', description: 'Property address' },
                preferredDate: { type: 'STRING', description: 'Preferred date of inspection' },
                propertyType: { type: 'STRING', description: 'single-family or condo' },
                addons: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Add-ons selected' },
                estimatedTotal: { type: 'NUMBER', description: 'Estimated fee if known' },
                notes: { type: 'STRING', description: 'Special notes or concerns' }
              },
              required: ['name', 'phone']
            }
          }
        ]
      }
    ];

    // Fallback if no API key is provided
    if (!apiKey) {
      console.warn('GEMINI_API_KEY missing in environment. Using fallback voice logic.');
      return NextResponse.json({
        response: "Hello there! I'm Christopher Boykin with Foresight Home Inspections. Our live voice engine is currently operating in offline mode, but I can still help you estimate your quote or schedule your inspection! Give us a call directly at 678-480-2110 or tell me your property square footage.",
        action: 'message'
      });
    }

    // Format messages for Gemini API
    const recentMessages = messages.slice(-10);
    const contents = recentMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content.replace(/\*/g, '') }]
    }));

    // If user provided a message that wasn't in contents, add it
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello Christopher! What services do you recommend for an Atlanta home?' }]
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        tools,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini Voice API error:', errorText);
      return NextResponse.json({
        response: "I apologize, our connection dipped for a moment. But I am right here with you! Could you please repeat that, or let me know the square footage and address of the home you need inspected?",
        action: 'retry'
      }, { status: 200 });
    }

    const geminiData = await geminiRes.json();
    const candidate = geminiData.candidates?.[0]?.content?.parts?.[0];

    // Check if Gemini invoked a function call
    if (candidate && candidate.functionCall) {
      const { name, args } = candidate.functionCall;
      console.log(`[VOICE AGENT] Executing Tool: ${name}`, args);

      if (name === 'calculate_quote') {
        const quoteResult = calculateQuoteDetails(args);
        const speechResponse = `For a ${quoteResult.sqft.toLocaleString()} square foot ${quoteResult.propertyType === 'condo' ? 'condo' : 'home'}${quoteResult.foundation === 'crawlspace' ? ' with a crawlspace' : quoteResult.foundation === 'basement' ? ' with a basement' : ''}, your comprehensive inspection with our two-person Certified Master Inspector team is $${quoteResult.total}.${quoteResult.addonBreakdown.length > 0 ? ` That includes ${quoteResult.addonBreakdown.map(a => `${a.name} for $${a.price}`).join(' and ')}.` : ''} Both thermal imaging and aerial drone scans are included at zero extra charge. Would you like me to reserve a date for you on our schedule?`;

        return NextResponse.json({
          response: speechResponse.replace(/\*/g, ''),
          action: 'quote_calculated',
          quote: quoteResult
        });
      }

      if (name === 'schedule_inspection') {
        await persistBooking(args);
        const speechResponse = `Wonderful, ${args.name}! I have initiated your appointment booking for ${args.preferredDate || 'the upcoming available window'}${args.address ? ` at ${args.address}` : ''}. Our office team will follow up directly at ${args.phone} to finalize the exact arrival time. Remember that Sunday is by appointment only. We look forward to protecting your investment!`;

        return NextResponse.json({
          response: speechResponse.replace(/\*/g, ''),
          action: 'scheduled',
          booking: {
            name: args.name,
            phone: args.phone,
            email: args.email || '',
            address: args.address || '',
            preferredDate: args.preferredDate || 'Earliest Available',
            addons: args.addons || [],
            estimatedTotal: args.estimatedTotal || null
          }
        });
      }
    }

    // Standard text response
    let responseText = candidate?.text || "I am right here with you! How can Christopher Boykin and Foresight help with your home inspection today?";
    // Sanitize any asterisks
    responseText = responseText.replace(/\*/g, '').trim();

    return NextResponse.json({
      response: responseText,
      action: 'message'
    });

  } catch (error) {
    console.error('Voice API Route Exception:', error);
    return NextResponse.json({
      response: "Houses are complex systems, and I want to make sure you get the right advice. If you have any questions about foundations, roofs, radon, or booking our two-inspector team, let me know!",
      action: 'fallback'
    }, { status: 200 });
  }
}
