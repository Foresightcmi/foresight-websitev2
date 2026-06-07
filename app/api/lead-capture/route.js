import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // 3. Send Email Notification directly to inbox
    const emailPass = process.env.EMAIL_PASSWORD;
    if (emailPass) {
      console.log('[FORESIGHT ENGINE] Sending email notification...');
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'plsinspectnow@gmail.com',
            pass: emailPass,
          },
        });

        const mailOptions = {
          from: 'plsinspectnow@gmail.com',
          to: 'plsinspectnow@gmail.com', // Sending to yourself
          subject: '🚨 NEW QUOTE LEAD: Price Locked!',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #b91c1c;">New Quote Lead Captured</h2>
              <p style="font-size: 16px;"><strong>Name:</strong> ${name}</p>
              <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
              <p style="font-size: 16px;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 14px; color: #64748b;"><em>This lead locked in their price via the website Quote Calculator.</em></p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('[FORESIGHT ENGINE] Email notification sent successfully!');
      } catch (emailError) {
        console.error('[FORESIGHT ENGINE] Failed to send email notification:', emailError);
      }
    } else {
      console.log('[FORESIGHT ENGINE] EMAIL_PASSWORD is not set. Skipping email notification.');
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
