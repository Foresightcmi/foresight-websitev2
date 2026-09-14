import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        mode: 'fallback',
        error: 'GEMINI_API_KEY is not configured on the server.'
      }, { status: 500 });
    }

    const now = Date.now();
    const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(now + 2 * 60 * 1000).toISOString();

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uses: 1,
        expireTime,
        newSessionExpireTime
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Error minting Gemini Live ephemeral token:', res.status, errText);
      return NextResponse.json({
        mode: 'fallback',
        error: `Ephemeral token generation failed (${res.status}): ${errText}`
      }, { status: 502 });
    }

    const tokenData = await res.json();
    const tokenName = tokenData.name;
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(tokenName)}`;

    return NextResponse.json({
      mode: 'live',
      wsUrl,
      model: 'models/gemini-2.5-flash-native-audio-latest',
      voice: 'Fenrir',
      tokenName
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in voice token API:', error);
    return NextResponse.json({
      mode: 'fallback',
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
