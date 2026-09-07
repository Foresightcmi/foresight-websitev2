import { NextResponse } from 'next/server';
import { recordLead } from '../../../lib/leads';

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      name, 
      email, 
      phone, 
      address, 
      sqft, 
      propertyType, 
      serviceType, 
      foundation, 
      ageTier, 
      preferredDate, 
      addons, 
      estimatedTotal, 
      notes,
      message, 
      source 
    } = data;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'Name and either email or phone are required.' },
        { status: 400 }
      );
    }

    const result = await recordLead({
      name,
      phone,
      email,
      address,
      sqft,
      propertyType,
      serviceType,
      foundation,
      ageTier,
      preferredDate,
      addons,
      estimatedTotal,
      message: message || notes || '',
      source: source || 'Quote Calculator'
    });

    return NextResponse.json({
      success: true,
      message: 'Inspection request received! Our office will contact you within 20 minutes with your official appointment confirmation and inspection agreements to sign.',
      leadId: result.leadId
    }, { status: 200 });

  } catch (error) {
    console.error('Error in lead capture API route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
