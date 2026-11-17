import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillPaidStripeSession, isStripeKeyConfigured } from '../../../../lib/stripeFulfillment';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = (searchParams.get('session_id') || '').trim();

  if (!sessionId || !/^cs_(live|test)_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json(
      { paid: false, reason: 'Missing or invalid Stripe checkout session ID.' },
      { status: 400 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!isStripeKeyConfigured(stripeKey)) {
    return NextResponse.json(
      { paid: false, setupMode: true, reason: 'Stripe secret key is pending configuration.' },
      { status: 503 }
    );
  }

  try {
    const stripe = new Stripe(stripeKey.trim());
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid = session.payment_status === 'paid';

    if (isPaid) {
      await fulfillPaidStripeSession(session, 'redirect_verify');
    }

    const metadata = session.metadata || {};
    return NextResponse.json({
      paid: isPaid,
      sessionId: session.id,
      amountPaid: ((session.amount_total || 9900) / 100).toFixed(2),
      clientName: metadata.client_name || session.customer_details?.name || 'Valued Client',
      clientEmail: session.customer_email || metadata.client_email || session.customer_details?.email || '',
      propertyAddress: metadata.property_address || '',
      reportLink: metadata.report_link || '',
      serviceType: metadata.service_type || 'outside-report-audit',
    });
  } catch (err) {
    console.error('[CHECKOUT VERIFY] Stripe retrieve error:', err.message);
    return NextResponse.json(
      { paid: false, reason: 'Unable to verify checkout session.' },
      { status: 400 }
    );
  }
}
