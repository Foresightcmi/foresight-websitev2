import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { recordLead } from '../../../lib/leads';
import { isStripeKeyConfigured } from '../../../lib/stripeFulfillment';

function resolveAllowedOrigin(rawOrigin) {
  if (!rawOrigin) return 'https://www.fhinspectionsatl.com';
  try {
    const parsed = new URL(rawOrigin);
    if (
      parsed.hostname === 'www.fhinspectionsatl.com' ||
      parsed.hostname === 'fhinspectionsatl.com' ||
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.endsWith('.vercel.app')
    ) {
      return parsed.origin;
    }
  } catch {
    // Fallback to canonical production domain
  }
  return 'https://www.fhinspectionsatl.com';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      serviceType = 'outside-report-audit',
      name = '',
      email = '',
      phone = '',
      address = '',
      reportLink = '',
      notes = '',
      amount = 99,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required to proceed to checkout.' }, { status: 400 });
    }

    const origin = resolveAllowedOrigin(req.headers.get('origin') || '');
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripeReady = isStripeKeyConfigured(stripeKey);

    // Log intake durably to Google Sheets + ntfy.sh + local leads.json
    await recordLead({
      name,
      phone,
      email,
      address,
      serviceType,
      estimatedTotal: '$99',
      message: `${reportLink ? `Report Link: ${reportLink} | ` : ''}${notes || 'Initiated $99 Outside Report Evaluation checkout'}`,
      source: stripeReady ? '$99 Evaluation Checkout Initiated' : '$99 Evaluation Request (Stripe Pending Setup)',
    }).catch((err) => console.warn('[CHECKOUT] Lead intake warning:', err.message));

    if (!stripeReady) {
      return NextResponse.json({
        setupMode: true,
        message: 'Your $99 Due Diligence Evaluation request has been logged! Stripe live billing is being finalized—our office has been alerted and will reach out to you immediately at ' + (phone || email) + '.',
        contactPhone: '678-480-2110',
        directEmail: 'inspect@foresightcmi.com',
      });
    }

    const stripe = new Stripe(stripeKey.trim());
    const isAudit = serviceType === 'outside-report-audit';
    const unitCents = Math.round((isAudit ? 99 : Math.max(99, Math.min(5000, Number(amount) || 99))) * 100);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isAudit ? 'Foresight 4-Hour Due Diligence Repair Cost Evaluation ($99)' : 'Foresight Home Inspection Service Deposit',
              description: isAudit
                ? 'Certified Master Inspector extraction of regional Metro Atlanta contractor repair costs and formatted Georgia Repair Amendment exhibit.'
                : 'Initial deposit for scheduled home inspection services with Foresight Home Inspections, LLC.',
              images: ['https://www.fhinspectionsatl.com/images/Logopng.png'],
            },
            unit_amount: unitCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      client_reference_id: `EVAL-${Date.now()}`,
      metadata: {
        client_name: String(name).slice(0, 450),
        client_email: String(email).slice(0, 450),
        client_phone: String(phone).slice(0, 100),
        property_address: String(address).slice(0, 450),
        report_link: String(reportLink).slice(0, 450),
        notes: String(notes).slice(0, 450),
        service_type: String(serviceType).slice(0, 100),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(serviceType)}`,
      cancel_url: `${origin}/checkout/cancel?service=${encodeURIComponent(serviceType)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate checkout session. Please call (678) 480-2110.' },
      { status: 500 }
    );
  }
}
