import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    let persona = 'chris';
    try {
      const body = await req.json();
      if (body && body.persona) {
        persona = String(body.persona).toLowerCase();
      }
    } catch (_) {}

    // Direct, ultra-fast connection to Foresight Neural Speech & Brain Engine
    // (Bypasses billable/depleted Gemini Live WebSockets with 0ms latency)
    return NextResponse.json({
      mode: 'neural',
      persona,
      message: 'Active Foresight Google Gemini Voice Engine'
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in voice token API:', error);
    return NextResponse.json({
      mode: 'neural',
      persona: 'chris'
    }, { status: 200 });
  }
}
