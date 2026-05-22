import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone } = data;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // 1. Local Fallback Logging (for absolute resilience)
    console.log("==========================================");
    console.log("⚡ [FORESIGHT SYSTEM ENGINE] NEW LEAD CAPTURED:");
    console.log(`👤 Name:   ${name}`);
    console.log(`✉️ Email:  ${email}`);
    console.log(`📞 Phone:  ${phone || 'Not Provided'}`);
    console.log("==========================================");

    // 2. Forward to Google Apps Script Webhook (if configured)
    const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    
    if (appsScriptUrl) {
      console.log(`[FORESIGHT ENGINE] Forwarding lead data to Apps Script Webhook: ${appsScriptUrl}`);
      try {
        const response = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'capture_lead',
            name,
            email,
            phone: phone || ''
          }),
        });

        if (!response.ok) {
          console.warn(`[FORESIGHT ENGINE] Apps Script Webhook returned status: ${response.status}`);
        } else {
          console.log('[FORESIGHT ENGINE] Lead successfully forwarded to Google Sheets/Workspace!');
        }
      } catch (webhookError) {
        console.error('[FORESIGHT ENGINE] Failed to forward lead to Google Apps Script Webhook:', webhookError);
        // We do NOT fail the response to the user so the website UI remains functional and resilient!
      }
    } else {
      console.log('[FORESIGHT ENGINE] APPS_SCRIPT_WEBHOOK_URL is not set in env variables. Lead preserved in console logs.');
    }

    // Return success to the client
    return NextResponse.json({ success: true, message: 'Lead captured successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Error in lead capture API route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
