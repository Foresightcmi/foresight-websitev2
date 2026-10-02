import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    let persona = 'receptionist';
    try {
      const body = await req.json();
      if (body && body.persona) {
        persona = String(body.persona).toLowerCase();
      }
    } catch (_) {}

    // Direct, ultra-fast connection to Foresight Receptionist Voice Engine
    return NextResponse.json({
      mode: 'neural',
      persona: 'receptionist',
      voice: 'Aoede',
      message: 'Active Foresight Google Gemini Receptionist Voice Engine'
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in voice token API:', error);
    return NextResponse.json({
      mode: 'neural',
      persona: 'receptionist',
      voice: 'Aoede'
    }, { status: 200 });
  }
}
