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

    const body = await request.json();
    const { messages, stream = false } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages array provided.' },
        { status: 400 }
      );
    }

    // Map roles to Gemini API roles: 'user' -> 'user', 'ai' -> 'model', 'assistant' -> 'model'
    // Keep only the last 6 messages to keep context tight and speed maximum
    const recentMessages = messages.slice(-6);
    const contents = recentMessages.map((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      return {
        role,
        parts: [{ text: msg.content }]
      };
    });

    const systemInstruction = CHRIS_SYSTEM_INSTRUCTION;

    // If client requested streaming, stream plain text tokens with sub-second TTFT
    if (stream) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

      const geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350,
            thinkingConfig: {
              thinkingBudget: 0
            }
          }
        }),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error('Gemini Stream Error:', geminiRes.status, errText);
        return NextResponse.json(
          { error: `Gemini API returned status ${geminiRes.status}` },
          { status: 502 }
        );
      }

      // Stream clean plain-text tokens directly to client
      const streamInstance = new ReadableStream({
        async start(controller) {
          const reader = geminiRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop(); // preserve last incomplete line

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const jsonStr = line.slice(6).trim();
                  if (!jsonStr || jsonStr === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (chunkText) {
                      controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                  } catch (_) {}
                }
              }
            }
          } catch (err) {
            console.error('Error in streaming pipeline:', err);
          } finally {
            controller.close();
          }
        }
      });

      return new Response(streamInstance, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // Standard fast non-streaming response (with thinkingBudget: 0 for ~1s latency)
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
          maxOutputTokens: 350,
          thinkingConfig: {
            thinkingBudget: 0
          }
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
