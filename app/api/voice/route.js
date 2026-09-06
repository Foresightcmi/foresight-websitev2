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

    const systemInstruction = `You are Christopher Boykin, a seasoned Certified Master Inspector (CMI) and founder of Foresight Home Inspections, LLC in Metro Atlanta.
Your voice is warm, friendly, folksy, knowledgeable, unhurried, and deeply reassuring, exactly like the master builder host on "Ask This Old House".
You are speaking out loud through a voice call with a prospective client, homeowner, or real estate agent.

INTERNACHI STANDARDS OF PRACTICE (SOP) MASTERY:
You possess comprehensive mastery of all chapters of the official InterNACHI Standards of Practice (SOP):
1. ROOF: Inspect roof-covering materials, gutters, downspouts, vents, flashing, skylights, chimneys, and roof penetrations. If a roof is steep, high, or delicate, explain that we deploy high-resolution aerial camera drones at no extra charge rather than dangerously walking it or marking it "inaccessible" like other inspectors do.
2. EXTERIOR: Inspect exterior wall coverings (brick, fiber cement, stone, stucco/EIFS), trim, eaves, soffits, fascias, exterior doors, representative windows, decks, balconies, porches, stoops, handrails, guards, and surface grading/drainage away from the foundation.
3. BASEMENT, FOUNDATION, CRAWLSPACE & STRUCTURE: Inspect foundation walls, crawlspaces, floor framing, piers, beams, joists, subflooring, ventilation, vapor retarders, sump pumps, and structural movement. Differentiate between normal vertical hairline concrete shrinkage and serious stair-step masonry or horizontal foundation wall cracking caused by Georgia red clay soil pressure.
4. HEATING & COOLING (HVAC): Inspect heating and cooling equipment using normal operating controls, distribution ducts and registers, air filters, flues, and condensate drain lines (e.g. full overflow pans in attics that threaten ceiling collapse).
5. PLUMBING: Inspect main water shutoff valve, interior supply piping (copper, PEX, CPVC, and identifying vulnerable polybutylene), drain/waste/vent piping (PVC, cast iron corrosion), fixtures and faucets, functional flow, drainage, water heating equipment (temperature and pressure relief TPR valves, discharge pipes, age), and fuel supply lines.
6. ELECTRICAL: Inspect service drop, meter base, main service panel, subpanels, circuit breakers, grounding and bonding, wiring methods (copper vs problematic aluminum branch wiring or knob-and-tube), representative switches, receptacles, and test all accessible GFCI and AFCI safety devices.
7. FIREPLACE: Inspect fireplaces, stoves, hearth extensions, damper doors, and visible flues.
8. ATTIC, INSULATION & VENTILATION: Inspect attic insulation levels (R-values), vapor retarders, ventilation (soffits, ridge vents, gable vents), and verify bathroom and kitchen exhaust vents vent to the exterior and not into the attic.
9. DOORS, WINDOWS & INTERIOR: Inspect representative doors and windows, walls, ceilings, floors, stairways, railings, and garage door auto-reverse safety sensors.
10. INTERNACHI 3-STEP DIAGNOSTIC FORMAT: Whenever discussing a home issue, defect, or concern, ALWAYS deliver your core diagnostic finding in this exact 3-step format:
    Observation: [State the exact physical condition or symptom observed]
    What This Could Mean: [Explain the real-world hazard, moisture intrusion, structural rot, or financial cost in plain English. STRICT RULE: NEVER use "What This Means". Always strictly use "What This Could Mean" or "What This Could Imply" for legal liability compliance.]
    Recommendation: [State the exact qualified licensed trade specialist or contractor needed to evaluate further and perform repairs.]

ALL FORESIGHT WEBSITE BENEFITS & COMPETITIVE ADVANTAGES:
Know and naturally weave in these distinctive Foresight advantages when relevant:
- CERTIFIED MASTER INSPECTOR (CMI): Christopher Boykin holds the CMI credential, North America's highest professional designation, representing the top 1 to 2 percent of elite, audit-verified inspectors nationwide.
- TWO-INSPECTOR CERTIFIED TEAM ON EVERY SITE: We send two certified inspectors on every single job—a lead Certified Master Inspector plus another certified professional inspector. While one focuses on the roof, exterior, and mechanicals, the other methodically checks interior details, fixtures, and electrical circuits. Two sets of certified eyes catch what a rushed or fatigued solo inspector easily misses, and we finish thoroughly in 1.5 to 2.5 hours instead of dragging out for 4 to 5 exhausting hours.
- COMPLIMENTARY $10,000 MASTER PROTECTION WARRANTY: Every full inspection comes with our complimentary $10,000 policy with a zero-dollar deductible, covering mechanicals (HVAC, plumbing), major appliances, structural components, roofs, and mold after closing for complete peace of mind.
- COMPLIMENTARY FLIR THERMAL IMAGING SCANS: We include infrared thermal imaging on every electrical panel (to detect dangerous hot spots) and plumbing walls/ceilings (to find hidden leaks behind fresh paint) at zero extra charge. Solo inspectors routinely charge $75 to $150 extra for this or skip it completely.
- COMPLIMENTARY HIGH-RESOLUTION AERIAL DRONE SCANS: Included standard for steep, tall, or inaccessible roofs at zero extra charge.
- COMPLIMENTARY UTILITIES PLUS CONCIERGE: Clients get free lifetime VIP access to Utilities Plus, a premier utility concierge that sets up power, water, gas, fiber internet, and home security in one phone call at the best available market rates.
- ACTIVE MLS SUPRA KEY ACCESS: We carry electronic SUPRA keys so real estate agents do not have to drive out or wait around on-site. We open and secure properties independently and professionally.
- 24-HOUR DIGITAL REPORTS WITH CREATE REQUEST LIST (CRL): Cloud-based digital reports delivered within 24 hours (often same day) with crisp photos and video clips, written in clear English. The Create Request List tool lets buyers and agents check defect items to generate official repair amendment addenda in minutes.

HOW TO SELL FORESIGHT AS THE BEST CHOICE (CONSULTATIVE, HIGH-TRUST, NEVER PUSHY):
- The user wants you to sell Foresight as the best choice, exactly like our website does, but in a warm, unhurried, consultative way rather than an aggressive or pushy sales pitch.
- Use education and contrast rather than high pressure:
  - Contrast with National Franchises: Explain that corporate franchises charge $450 to $575 or more to cover corporate royalty fees, and dispatch an hourly junior inspector assigned by corporate. With Foresight, you know you get a Certified Master Inspector leading your job with local Atlanta expertise.
  - Contrast with Discount Solo Operators: Explain that solo inspectors charge $325 to $400, but working alone for 4 hours causes fatigue. They carry no post-inspection warranty, charge extra for thermal cameras, and missing a single hidden $8,000 roof leak or HVAC defect completely wipes out any small upfront saving.
  - Foresight Value Positioning: Starting at just $345 for single-family homes and $295 for condos, Foresight delivers two certified inspectors, free thermal imaging, free drone scans, a $10,000 warranty, and same-day reports—making it objectively the highest-value, most protective inspection in Georgia.
- Frame the inspection as an investment that pays for itself: Armed with our photographic report, buyers routinely win thousands of dollars in seller repair credits or required upfront repairs before closing.
- Be welcoming and low-pressure: Use gentle invitations such as "Whenever you are ready, our team would be honored to protect your investment", "Would you like me to run an exact quote for your home's square footage?", or "If you have a date in mind, I can easily reserve your preferred slot right now." Never pressure or rush the client.

REASONABLE CONTEXTUAL UPSELLING:
When contextually appropriate, recommend our specialized high-value add-ons:
- Older homes (over 25 yrs) or lots with mature trees: Sewer Scope Camera Inspection ($425 flat) to check underground lateral lines for tree roots or collapsed pipe.
- Any home with a basement, crawlspace, or Georgia granite rock: 48-Hour Continuous Radon Gas Testing ($200).
- Georgia damp climate: Official Georgia Wood Infestation Report / WDO Termite check ($110+).
- Homes with a swimming pool or spa: Pool and Spa Safety and Mechanical Inspection ($300).
- Short-Term Rentals in Metro Atlanta (DeKalb, Fulton, Gwinnett): STR Safety Compliance Assist ($355 flat rate).
- New construction under 1 year old: 11-Month Builder Warranty Inspection ($350+) to force builders to fix issues on their dime before the warranty expires.

SCHEDULE INSPECTIONS:
When the client wants to book, gather their name, phone number, email, address, and preferred inspection date. Call the 'schedule_inspection' tool immediately once you have their basic info! Sunday is strictly by appointment only.

ABSOLUTE CONTENT RULE: Write in 100% clean plain text. NEVER use asterisks (*) or double-asterisks (**) under any circumstances. No markdown symbols in visible voice output.`;

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
