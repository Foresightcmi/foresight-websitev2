import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

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
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err) {
    console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
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

    console.log(`💰 [STRIPE WEBHOOK] Payment received: $${amountTotal} from ${clientName} (${clientEmail}) for ${serviceType}`);

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
      const pushTitle = `💰 $${amountTotal} PAID: ${clientName} (4-Hr Audit)`;
      const pushLines = [
        `💵 STRIPE PAYMENT CONFIRMED: $${amountTotal}`,
        `Service: ${serviceType === 'outside-report-audit' ? '$99 Due Diligence Report Audit' : 'Inspection Deposit'}`,
        `Client: ${clientName}`,
        `Phone: ${clientPhone}`,
        `Email: ${clientEmail}`,
        `Property: ${propertyAddress}`,
        reportLink ? `Report: ${reportLink}` : '',
        notes ? `Notes: ${notes}` : '',
        `⏱️ 4-Hour Delivery Clock Started!`
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
    const emailPass = process.env.EMAIL_PASSWORD;
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
          subject: `💰 [PAID $${amountTotal}] Due Diligence Audit Order - ${clientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #10B981; border-radius: 8px; background: #ffffff; max-width: 650px;">
              <div style="background: #10B981; color: #ffffff; padding: 12px 16px; border-radius: 6px 6px 0 0; margin: -24px -24px 20px -24px;">
                <h2 style="margin: 0; font-size: 1.25rem;">💰 Payment Confirmed • $${amountTotal}</h2>
                <p style="margin: 4px 0 0; font-size: 0.85rem; opacity: 0.95;">Stripe Checkout Session: ${session.id}</p>
              </div>
              <p>A new <strong>$99 Standalone Due Diligence Repair Cost Audit</strong> has been paid on Stripe. The 4-hour SLA delivery clock has started.</p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Client Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${clientName}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${clientPhone}">${clientPhone}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${clientEmail}">${clientEmail}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Property Address:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${propertyAddress}</td></tr>
                ${reportLink ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Report Link:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${reportLink}" target="_blank">${reportLink}</a></td></tr>` : ''}
                ${notes ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Client Notes:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${notes}</td></tr>` : ''}
              </table>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; font-size: 0.85rem; color: #64748B;">
                Next Step: Cross-reference findings with RSMeans 2026 data and formulate the GAR Form F404 amendment exhibit for client delivery.
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
