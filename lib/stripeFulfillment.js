import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';

const fulfilledSessionIds = globalThis.__foresightFulfilledStripeSessions || new Set();
globalThis.__foresightFulfilledStripeSessions = fulfilledSessionIds;

export function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isStripeKeyConfigured(rawKey) {
  const key = String(rawKey || '').trim();
  if (!key || /placeholder|your_|replace_me|example/i.test(key)) return false;
  return /^(sk|rk)_(live|test)_[A-Za-z0-9]{16,}$/.test(key);
}

const EMAIL_TRI_LOGO_HEADER = `
  <div style="margin: -24px -24px 0 -24px; border-radius: 6px 6px 0 0; overflow: hidden;">
    <div style="background-color:#ffffff;border-bottom:2px solid #d4af37;padding:14px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="middle" style="padding-right:12px;">
            <img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="70" style="display:block;height:70px;width:auto;border:0;filter:none;" />
          </td>
          <td valign="middle" align="right" style="white-space:nowrap;">
            <img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;margin-right:8px;" />
            <img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;" />
          </td>
        </tr>
      </table>
    </div>
    <div style="background-color:#0f172a;border-bottom:3px solid #d4af37;padding:7px 20px;font-size:11px;font-weight:700;color:#d4af37;letter-spacing:0.5px;">
      CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTERNACHI CPI (#NACHI18051119) &bull; TWO-INSPECTOR TEAM
    </div>
  </div>
`;

export async function fulfillPaidStripeSession(session, triggerSource = 'webhook') {
  if (!session || !session.id || session.payment_status !== 'paid') {
    return { fulfilled: false, alreadyProcessed: false };
  }
  if (fulfilledSessionIds.has(session.id)) {
    return { fulfilled: true, alreadyProcessed: true };
  }

  const metadata = session.metadata || {};
  const clientName = metadata.client_name || session.customer_details?.name || 'Valued Client';
  const clientEmail = session.customer_email || metadata.client_email || session.customer_details?.email || '';
  const clientPhone = metadata.client_phone || session.customer_details?.phone || '';
  const propertyAddress = metadata.property_address || 'Address on file';
  const reportLink = metadata.report_link || '';
  const notes = metadata.notes || '';
  const amountTotal = ((session.amount_total || 9900) / 100).toFixed(2);
  const serviceType = metadata.service_type || 'outside-report-audit';

  // 1. Check & update local data/leads.json when writable
  try {
    const leadsPath = path.join(process.cwd(), 'data', 'leads.json');
    let leads = [];
    if (fs.existsSync(leadsPath)) {
      leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
      if (!Array.isArray(leads)) leads = [];
    }
    if (leads.some((l) => l.stripeSessionId === session.id && l.status === 'paid')) {
      fulfilledSessionIds.add(session.id);
      return { fulfilled: true, alreadyProcessed: true };
    }
    const existing = leads.find(
      (l) => l.status !== 'paid' && ((clientEmail && l.email === clientEmail) || l.address === propertyAddress)
    );
    if (existing) {
      existing.status = 'paid';
      existing.paidAt = new Date().toISOString();
      existing.stripeSessionId = session.id;
      existing.amountPaid = amountTotal;
    } else {
      leads.unshift({
        id: `eval_${Date.now()}`,
        date: new Date().toISOString(),
        serviceType,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        address: propertyAddress,
        reportLink,
        notes,
        status: 'paid',
        paidAt: new Date().toISOString(),
        stripeSessionId: session.id,
        amountPaid: amountTotal,
      });
    }
    fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
  } catch (dbErr) {
    console.warn('[STRIPE FULFILLMENT] Local leads.json skipped:', dbErr.message);
  }

  fulfilledSessionIds.add(session.id);

  // 2. Persist paid order to Google Sheets via Apps Script (100% Vercel serverless durable)
  const appsScriptUrl =
    process.env.APPS_SCRIPT_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbyfxYncwB7xTqMJJHe1v5_70VNfV9BjNkH__92Ni2v5RMn83JrDjHRqpM6mT5Bs0x62lg/exec';
  try {
    await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'capture_lead',
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        address: propertyAddress,
        serviceType,
        estimatedTotal: `$${amountTotal} PAID`,
        source: `Stripe Paid Order (${triggerSource})`,
        notes: `[STRIPE PAID $${amountTotal}] Session: ${session.id} | Property: ${propertyAddress} | Report: ${reportLink || 'Uploaded/Notes'} | Notes: ${notes || 'None'}`,
      }),
    });
  } catch (gsErr) {
    console.warn('[STRIPE FULFILLMENT] Apps Script sync warning:', gsErr.message);
  }

  // 3. Urgent Smartphone Push Alert via ntfy.sh
  try {
    const cleanTitle = `$${amountTotal} PAID: ${String(clientName).replace(/[^\x20-\x7E]/g, '').trim()} (4-Hr Evaluation)`;
    const pushBody = [
      `STRIPE PAYMENT CONFIRMED: $${amountTotal}`,
      `Service: ${serviceType === 'outside-report-audit' ? '$99 Due Diligence Report Evaluation' : 'Inspection Deposit'}`,
      `Client: ${clientName}`,
      `Phone: ${clientPhone}`,
      `Email: ${clientEmail}`,
      `Property: ${propertyAddress}`,
      reportLink ? `Report Link: ${reportLink}` : '',
      notes ? `Notes: ${notes}` : '',
      `4-Hour Delivery Clock Started!`,
    ].filter(Boolean).join('\n');

    await fetch('https://ntfy.sh/fores-antigravity-alerts-77', {
      method: 'POST',
      headers: {
        Title: cleanTitle,
        Priority: 'urgent',
        Tags: 'moneybag,alarm_clock,star',
        Click: 'https://www.fhinspectionsatl.com/dashboard',
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: Buffer.from(pushBody, 'utf8'),
    });
  } catch (pushErr) {
    console.warn('[STRIPE FULFILLMENT] ntfy push warning:', pushErr.message);
  }

  // 4. Office Dispatch Email + Branded Client Receipt Email
  const emailPass = process.env.EMAIL_PASSWORD; // ggignore
  if (emailPass) {
    try {
      const senderUser = process.env.EMAIL_USER || 'inspect@foresightcmi.com'; // ggignore
      const officeRecipients = process.env.OFFICE_NOTIFICATION_EMAILS || 'inspect@foresightcmi.com, plsinspectnow@gmail.com';
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: senderUser, pass: emailPass } });
      const safeName = escapeHtml(clientName);
      const safePhone = escapeHtml(clientPhone);
      const safeEmail = escapeHtml(clientEmail);
      const safeAddress = escapeHtml(propertyAddress);
      const safeLink = escapeHtml(reportLink);
      const safeNotes = escapeHtml(notes);
      const successUrl = `https://www.fhinspectionsatl.com/checkout/success?session_id=${encodeURIComponent(session.id)}&service=${encodeURIComponent(serviceType)}`;

      await transporter.sendMail({
        from: senderUser,
        to: officeRecipients,
        subject: `[PAID $${amountTotal}] Due Diligence Evaluation Order - ${clientName}`,
        html: `<div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #10B981; border-radius: 8px; background: #ffffff; max-width: 650px;">${EMAIL_TRI_LOGO_HEADER}<div style="background: #10B981; color: #ffffff; padding: 12px 16px; margin: 0 -24px 20px -24px;"><h2 style="margin: 0; font-size: 1.25rem;">Payment Confirmed &bull; $${amountTotal}</h2><p style="margin: 4px 0 0; font-size: 0.85rem;">Stripe Session: ${escapeHtml(session.id)}</p></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;"><tr><td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Client:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeName}</td></tr><tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${safePhone}">${safePhone}</a></td></tr><tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr><tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Property:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeAddress}</td></tr>${safeLink ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Report URL:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${safeLink}">${safeLink}</a></td></tr>` : ''}${safeNotes ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Notes:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeNotes}</td></tr>` : ''}</table></div>`,
      });

      if (clientEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        await transporter.sendMail({
          from: `"Foresight Home Inspections" <${senderUser}>`,
          to: clientEmail,
          subject: `Order Confirmed ($${amountTotal}) - Foresight Due Diligence Evaluation`,
          html: `<div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #D4AF37; border-radius: 8px; background: #ffffff; max-width: 650px; color: #0f172a;">${EMAIL_TRI_LOGO_HEADER}<h2 style="margin: 20px 0 8px; color: #0f172a;">Thank You, ${safeName} — Your Order Is Confirmed</h2><p style="font-size: 14px; line-height: 1.6; color: #334155;">We have received your <strong>$${amountTotal}</strong> payment for the <strong>4-Hour Due Diligence Repair Cost Evaluation</strong> on <strong>${safeAddress}</strong>.</p><p style="font-size: 14px; line-height: 1.6; color: #334155;"><a href="${successUrl}" style="display:inline-block;background:#D4AF37;color:#0f172a;font-weight:700;padding:10px 18px;border-radius:6px;text-decoration:none;">View Your Confirmed Order &amp; Instant Downloads</a></p><p style="font-size: 13px; color: #475569; line-height: 1.5;">Need to share additional report files or have an urgent contingency deadline? Reply directly to this email or call/text Certified Master Inspector Christopher Boykin at <strong>(678) 480-2110</strong>.</p></div>`,
        });
      }
    } catch (emailErr) {
      console.error('[STRIPE FULFILLMENT] Email dispatch error:', emailErr.message);
    }
  }

  return { fulfilled: true, alreadyProcessed: false };
}
