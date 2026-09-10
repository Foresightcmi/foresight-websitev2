import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        mode: 'fallback',
        error: 'MISSING_API_KEY',
        message: 'No GEMINI_API_KEY found. Falling back to high-speed neural engine.'
      },
      { status: 200 }
    );
  }

  try {
    const client = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1alpha'
    });

    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        liveConnectConstraints: {
          model: 'models/gemini-2.0-flash-exp',
          config: {
            responseModalities: ['AUDIO']
          }
        }
      }
    });

    const tokenName = token.name ? token.name.replace(/^auth_tokens\//, '') : '';

    return NextResponse.json({
      mode: 'live',
      token: tokenName,
      model: 'models/gemini-2.0-flash-exp',
      voiceName: 'Charon',
      wsUrl: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${tokenName}`
    });
  } catch (err) {
    console.error('Error generating Live API ephemeral token:', err);
    const errMsg = err?.message || String(err);

    // If prepayment credits are depleted or quota exceeded, advise fallback
    return NextResponse.json(
      {
        mode: 'fallback',
        error: errMsg.includes('prepayment') ? 'PREPAYMENT_DEPLETED' : 'TOKEN_CREATION_FAILED',
        message: errMsg
      },
      { status: 200 }
    );
  }
}
