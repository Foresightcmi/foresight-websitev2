import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    if (!webhookSecret || !sig) return NextResponse.json({ error: 'Missing Stripe webhook secret or signature' }, { status: 400 });
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (err) {
    console.error('Stripe Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const clientName = metadata.client_name || session.customer_details?.name || 'Valued Client';
    const clientEmail = session.customer_email || metadata.client_email || session.customer_details?.email || '';
    const clientPhone = metadata.client_phone || session.customer_details?.phone || '';
    const propertyAddress = metadata.property_address || 'Address on file';
    const reportLink = metadata.report_link || '';
    const notes = metadata.notes || '';
    const amountTotal = (session.amount_total / 100).toFixed(2);
    const serviceType = metadata.service_type || 'outside-report-audit';

    console.log(`[STRIPE WEBHOOK] Payment received: $${amountTotal} from ${clientName} (${clientEmail}) for ${serviceType}`);

    // 1. Update data/leads.json
    try {
      const leadsPath = path.join(process.cwd(), 'data', 'leads.json');
      if (fs.existsSync(leadsPath)) {
        const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
        let found = false;
        for (const lead of leads) {
          if (lead.email === clientEmail || (lead.phone && lead.phone === clientPhone) || lead.address === propertyAddress) {
            lead.status = 'paid';
            lead.paidAt = new Date().toISOString();
            lead.stripeSessionId = session.id;
            lead.amountPaid = amountTotal;
            found = true;
            break;
          }
        }
        if (!found) {
          leads.push({
            id: `audit_${Date.now()}`,
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
            amountPaid: amountTotal
          });
        }
        fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
      }
    } catch (dbErr) {
      console.error('[STRIPE WEBHOOK] Error updating leads.json:', dbErr.message);
    }

    // 2. Real-Time Push Notification via ntfy.sh ($0 Cost)
    try {
      const pushTitle = `$${amountTotal} PAID: ${clientName} (4-Hr Evaluation)`;
      const pushLines = [
        `STRIPE PAYMENT CONFIRMED: $${amountTotal}`,
        `Service: ${serviceType === 'outside-report-audit' ? '$99 Due Diligence report evaluation' : 'Inspection Deposit'}`,
        `Client: ${clientName}`,
        `Phone: ${clientPhone}`,
        `Email: ${clientEmail}`,
        `Property: ${propertyAddress}`,
        reportLink ? `Report: ${reportLink}` : '',
        notes ? `Notes: ${notes}` : '',
        `4-Hour Delivery Clock Started!`
      ].filter(Boolean).join('\n');

      await fetch('https://ntfy.sh/fores-antigravity-alerts-77', {
        method: 'POST',
        headers: {
          'Title': pushTitle,
          'Priority': 'urgent',
          'Tags': 'moneybag,alarm_clock,star',
          'Click': 'https://www.fhinspectionsatl.com/dashboard',
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: Buffer.from(pushLines, 'utf8')
      });
      console.log('[STRIPE WEBHOOK] Push alert sent via ntfy.sh');
    } catch (pushErr) {
      console.warn('[STRIPE WEBHOOK] ntfy push error:', pushErr.message);
    }

    // 3. Email Notification via Nodemailer
    const emailPass = process.env.EMAIL_PASSWORD; // ggignore
    if (emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'inspect@foresightcmi.com',
            pass: emailPass
          }
        });

        await transporter.sendMail({
          from: 'inspect@foresightcmi.com',
          to: 'inspect@foresightcmi.com, plsinspectnow@gmail.com',
          subject: `[PAID $${amountTotal}] Due Diligence Evaluation Order - ${clientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #10B981; border-radius: 8px; background: #ffffff; max-width: 650px;">
              <div style="margin: -24px -24px 0 -24px; border-radius: 6px 6px 0 0; overflow: hidden;"><div style="background-color:#0f172a;border-bottom:3px solid #d4af37;padding:16px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/logo_dark_mode.png" alt="Foresight Home Inspections" height="44" style="display:block;height:44px;width:auto;border:0;" /><div style="font-size:11px;font-weight:700;color:#d4af37;letter-spacing:0.5px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="46" width="46" style="display:inline-block;height:46px;width:46px;border:0;vertical-align:middle;margin-right:6px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="46" width="46" style="display:inline-block;height:46px;width:46px;border:0;vertical-align:middle;" /></td></tr></table></div></div>
              <div style="background: #10B981; color: #ffffff; padding: 12px 16px; margin: 0 -24px 20px -24px;">
                <h2 style="margin: 0; font-size: 1.25rem;">Payment Confirmed • $${amountTotal}</h2>
                <p style="margin: 4px 0 0; font-size: 0.85rem; opacity: 0.95;">Stripe Checkout Session: ${session.id}</p>
              </div>
              <p>A new <strong>Standalone Due Diligence Repair Cost Evaluation</strong> has been paid on Stripe. The 4-hour SLA delivery clock has started.</p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Client Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(clientName)}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${clientPhone}">${clientPhone}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${clientEmail}">${clientEmail}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Property Address:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(propertyAddress)}</td></tr>
                ${reportLink ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Report Link:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${reportLink}" target="_blank">${reportLink}</a></td></tr>` : ''}
                ${notes ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Client Notes:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(notes)}</td></tr>` : ''}
              </table>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; font-size: 0.85rem; color: #64748B;">
                Next Step: Cross-reference findings with regional contractor data and formulate the sample repair amendment exhibit for client delivery.
              </div>
            </div>
          `
        });
        console.log('[STRIPE WEBHOOK] Email notification sent to inspect@foresightcmi.com');
      } catch (emailErr) {
        console.error('[STRIPE WEBHOOK] Email error:', emailErr.message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
