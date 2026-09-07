import { NextResponse } from 'next/server';
import { recordLead } from '../../../lib/leads';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, phone, email, address, preferredDate, message } = data;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'Name and either email or phone are required.' },
        { status: 400 }
      );
    }

    const result = await recordLead({
      name,
      phone: phone || '',
      email: email || '',
      address: address || '',
      preferredDate: preferredDate || '',
      message: message || '',
      source: 'Contact Page Form'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message received! Our office will contact you within 2 hours to confirm your inquiry.',
      leadId: result.leadId 
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ success: false, message: 'Failed to send message. Please call us directly at 678-480-2110.' }, { status: 500 });
  }
}
