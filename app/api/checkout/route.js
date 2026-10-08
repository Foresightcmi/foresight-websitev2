import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

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
      amount = 99
    } = body;

    const origin = req.headers.get('origin') || 'https://www.fhinspectionsatl.com';

    // Log the audit intake lead locally for immediate dispatch
    try {
      const leadsPath = path.join(process.cwd(), 'data', 'leads.json');
      let leads = [];
      if (fs.existsSync(leadsPath)) {
        leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
      }
      leads.push({
        id: `audit_${Date.now()}`,
        date: new Date().toISOString(),
        serviceType,
        name,
        email,
        phone,
        address,
        reportLink,
        notes,
        status: 'pending_payment'
      });
      fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
    } catch (logErr) {
      console.error('Error logging audit intake lead:', logErr);
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      // Setup Mode: When Stripe key is awaiting configuration by the user
      return NextResponse.json({
        setupMode: true,
        message: 'Stripe keys are pending live activation. Your audit request has been registered and our office will contact you immediately.',
        contactPhone: '678-480-2110',
        directEmail: 'inspect@foresightcmi.com'
      });
    }

    const stripe = new Stripe(stripeKey);

    const isAudit = serviceType === 'outside-report-audit';
    const productName = isAudit
      ? 'Foresight 4-Hour Due Diligence Repair Cost Audit'
      : 'Foresight Home Inspection Service Deposit';

    const productDescription = isAudit
      ? 'Certified Master Inspector extraction of line-item contractor repair costs (RSMeans 2026 Metro Atlanta trade rates) and formatted GAR Form F404 amendment exhibit.'
      : 'Initial deposit for scheduled home inspection services with Foresight Home Inspections, LLC.';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
              images: ['https://www.fhinspectionsatl.com/images/Logopng.png'],
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      client_reference_id: `AUDIT-${Date.now()}`,
      metadata: {
        client_name: name,
        client_phone: phone,
        property_address: address,
        report_link: reportLink,
        notes: notes,
        service_type: serviceType,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(serviceType)}`,
      cancel_url: `${origin}/checkout/cancel?service=${encodeURIComponent(serviceType)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate checkout session' },
      { status: 500 }
    );
  }
}
