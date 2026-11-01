import { NextResponse } from 'next/server';
import { recordLead } from '../../../lib/leads';
import { detectAgentSource } from '../../../lib/agentAttribution';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      email,
      phone,
      address,
      realtorAgent,
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
      honeypot,
      _hp,
      source,
      attributionChannel,
      howFound,
    } = data;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'Name and either email or phone are required.' },
        { status: 400 }
      );
    }

    const detectedChannel = attributionChannel || detectAgentSource({
      referrer: request.headers.get('referer') || '',
      userAgent: request.headers.get('user-agent') || '',
      selfReported: howFound || '',
    });
    const selfTag = howFound && detectedChannel && !detectedChannel.includes(howFound)
      ? ` | Reported: ${howFound}`
      : '';
    const baseSource = source || 'Quote Calculator';
    const enrichedSource = detectedChannel && !baseSource.includes(detectedChannel)
      ? `${baseSource} [Via: ${detectedChannel}${selfTag}]`
      : (howFound ? `${baseSource} [Reported: ${howFound}]` : baseSource);

    const result = await recordLead({
      name,
      phone,
      email,
      address,
      realtorAgent: realtorAgent || '',
      sqft,
      propertyType,
      serviceType,
      foundation,
      ageTier,
      preferredDate,
      addons,
      estimatedTotal,
      message: message || notes || '',
      honeypot: honeypot || _hp || '',
      source: enrichedSource,
    });

    return NextResponse.json({
      success: true,
      message: 'Inspection request received! Our office will contact you within 20 minutes with your official appointment confirmation and inspection agreements to sign.',
      leadId: result.leadId,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in lead capture API route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
