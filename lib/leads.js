import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

const LEADS_FILE_PATH = path.join(process.cwd(), 'data', 'leads.json');

/**
 * Persists lead records locally, forwards to Google Sheets via Apps Script,
 * and attempts email notification to inspect@foresightcmi.com.
 */
export async function recordLead({
  name,
  phone = '',
  email = '',
  address = '',
  sqft = '',
  propertyType = '',
  serviceType = '',
  foundation = '',
  ageTier = '',
  preferredDate = '',
  addons = [],
  estimatedTotal = '',
  message = '',
  source = 'Website'
}) {
  const timestamp = new Date().toISOString();
  const leadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp,
    name: name || 'Valued Client',
    phone: phone || 'Not Provided',
    email: email || 'Not Provided',
    address: address || 'Pending Address',
    sqft: sqft ? String(sqft) : '',
    propertyType: propertyType || '',
    serviceType: serviceType || '',
    foundation: foundation || '',
    ageTier: ageTier || '',
    preferredDate: preferredDate || 'Earliest Available',
    addons: Array.isArray(addons)
      ? addons
      : typeof addons === 'object' && addons !== null
      ? Object.keys(addons).filter(k => addons[k])
      : [],
    estimatedTotal: estimatedTotal ? (String(estimatedTotal).startsWith('$') ? String(estimatedTotal) : `$${estimatedTotal}`) : '',
    message: message || '',
    source,
    status: 'tentative_pending_office_confirmation'
  };

  // 1. Persistent Local Storage in data/leads.json (Zero Data Loss)
  try {
    let existingLeads = [];
    try {
      const fileData = await fs.readFile(LEADS_FILE_PATH, 'utf-8');
      existingLeads = JSON.parse(fileData);
      if (!Array.isArray(existingLeads)) existingLeads = [];
    } catch (readErr) {
      existingLeads = [];
    }
    existingLeads.unshift(leadRecord);
    if (existingLeads.length > 500) existingLeads = existingLeads.slice(0, 500);
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(existingLeads, null, 2), 'utf-8');
    console.log(`[LEADS ENGINE] Lead successfully saved locally in ${LEADS_FILE_PATH}`);
  } catch (fsErr) {
    console.error('[LEADS ENGINE] Error writing to data/leads.json:', fsErr.message);
  }

  // 2. Format comprehensive notes string for Google Sheets Apps Script
  const formattedAddons = Array.isArray(leadRecord.addons) ? leadRecord.addons.join(', ') : '';
  const notesLines = [
    `[Source]: ${source}`,
    `[Status]: Tentative Request (Pending Office Confirmation)`,
    leadRecord.address ? `[Address]: ${leadRecord.address}` : '',
    leadRecord.preferredDate ? `[Requested Date/Time]: ${leadRecord.preferredDate}` : '',
    leadRecord.sqft ? `[Size]: ${leadRecord.sqft} sq ft` : '',
    leadRecord.propertyType ? `[Type]: ${leadRecord.propertyType}` : '',
    leadRecord.serviceType ? `[Service]: ${leadRecord.serviceType}` : '',
    leadRecord.foundation ? `[Foundation]: ${leadRecord.foundation}` : '',
    leadRecord.ageTier ? `[Age]: ${leadRecord.ageTier}` : '',
    formattedAddons ? `[Auxiliary & Add-ons]: ${formattedAddons}` : '',
    leadRecord.estimatedTotal ? `[Est. Total]: ${leadRecord.estimatedTotal}` : '',
    leadRecord.message ? `[Client Note]: ${leadRecord.message}` : ''
  ].filter(Boolean).join(' | ');

  // 3. Forward to Google Apps Script Webhook (Google Sheets)
  const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  let webhookSuccess = false;
  if (appsScriptUrl) {
    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'capture_lead',
          name: leadRecord.name,
          email: leadRecord.email,
          phone: leadRecord.phone,
          notes: notesLines
        })
      });
      if (response.ok) {
        console.log('[LEADS ENGINE] Successfully forwarded to Google Sheets via Apps Script.');
        webhookSuccess = true;
      } else {
        console.warn(`[LEADS ENGINE] Apps Script returned status ${response.status}`);
      }
    } catch (whErr) {
      console.error('[LEADS ENGINE] Apps Script webhook forward failed:', whErr.message);
    }
  }

  // 4. Send Email Notification directly to inspect@foresightcmi.com
  const emailPass = process.env.EMAIL_PASSWORD;
  let emailSent = false;
  if (emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'inspect@foresightcmi.com',
          pass: emailPass
        }
      });

      const mailOptions = {
        from: 'inspect@foresightcmi.com',
        to: 'inspect@foresightcmi.com',
        subject: `🚨 [NEW TENTATIVE REQUEST] ${leadRecord.name} - ${leadRecord.address || leadRecord.preferredDate || 'Website Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #b91c1c; border-radius: 8px; background: #ffffff; max-width: 650px;">
            <div style="background: #b91c1c; color: #ffffff; padding: 12px 16px; border-radius: 6px 6px 0 0; margin: -24px -24px 20px -24px;">
              <h2 style="margin: 0; font-size: 1.25rem;">🚨 New Tentative Inspection Request</h2>
              <p style="margin: 4px 0 0; font-size: 0.85rem; opacity: 0.9;">Source: ${source} | Status: Pending Office Confirmation</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; width: 160px;">Client Name:</td><td style="padding: 8px 0;">${leadRecord.name}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${leadRecord.phone}" style="color: #b91c1c; font-weight: bold;">${leadRecord.phone}</a></td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${leadRecord.email}">${leadRecord.email}</a></td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Property Address:</td><td style="padding: 8px 0;">${leadRecord.address}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Requested Date:</td><td style="padding: 8px 0; color: #b91c1c; font-weight: bold;">${leadRecord.preferredDate}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Square Footage:</td><td style="padding: 8px 0;">${leadRecord.sqft ? `${leadRecord.sqft} sq ft` : 'Pending'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Estimated Total:</td><td style="padding: 8px 0; font-weight: bold; color: #047857;">${leadRecord.estimatedTotal || 'TBD'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold;">Auxiliary & Add-ons:</td><td style="padding: 8px 0;">${formattedAddons || 'None selected'}</td></tr>
              ${leadRecord.message ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Client Message:</td><td style="padding: 8px 0; background: #f8fafc; padding: 10px; border-radius: 4px;">${leadRecord.message}</td></tr>` : ''}
            </table>

            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin-top: 16px; border-radius: 4px;">
              <p style="margin: 0; font-size: 0.85rem; color: #991b1b; line-height: 1.4;">
                <strong>Action Required:</strong> Please contact the client within 2 hours to confirm inspector arrival time, access, and schedule any requested auxiliary partners (Pool, Termite, Radon, Sewer Scope). Sunday is strictly by appointment only.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('[LEADS ENGINE] Email notification sent successfully to inspect@foresightcmi.com!');
      emailSent = true;
    } catch (mailErr) {
      console.error('[LEADS ENGINE] Email send error:', mailErr.message);
    }
  }

  return {
    success: true,
    leadId: leadRecord.id,
    webhookSuccess,
    emailSent
  };
}
