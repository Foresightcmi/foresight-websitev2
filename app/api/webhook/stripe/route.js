import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillPaidStripeSession, isStripeKeyConfigured } from '../../../../lib/stripeFulfillment';

export async function POST(req) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!isStripeKeyConfigured(stripeSecretKey)) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: 'Missing Stripe webhook secret or signature' }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey.trim());
  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret.trim());
  } catch (err) {
    console.error('Stripe Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    await fulfillPaidStripeSession(session, 'stripe_webhook');
  }

  return NextResponse.json({ received: true });
}
