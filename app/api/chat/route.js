import { NextResponse } from 'next/server';
import { CHRIS_SYSTEM_INSTRUCTION } from '../../../lib/chris-brain-prompt';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if the API key is configured
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server. Gracefully falling back to local database.' },
        { status: 503 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages array provided.' },
        { status: 400 }
      );
    }

    // Map roles to Gemini API roles: 'user' -> 'user', 'ai' -> 'model'
    // Keep only the last 10 messages to limit token usage and latency
    const recentMessages = messages.slice(-10);
    const contents = recentMessages.map((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      return {
        role,
        parts: [{ text: msg.content }]
      };
    });

    const systemInstruction = CHRIS_SYSTEM_INSTRUCTION;

    // Make the request to the Google Gemini API REST endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      return NextResponse.json(
        { error: `Gemini API returned status ${response.status}. Gracefully falling back.` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data));
      return NextResponse.json(
        { error: 'Invalid response content structure from Gemini.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: candidateText });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred.' },
      { status: 500 }
    );
  }
}
