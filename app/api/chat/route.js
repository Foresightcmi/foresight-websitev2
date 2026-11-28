import { NextResponse } from 'next/server';
import { CHRIS_SYSTEM_INSTRUCTION } from '../../../lib/chris-brain-prompt';
import { resolveGeminiPrimaryTextModel } from '../../../lib/gemini-model-resolver.mjs';
import { enforceApiSecurity, detectPromptInjection } from '../../../lib/apiSecurity.js';
import { CONCIERGE_TOOL_DECLARATIONS, executeConciergeTool, OCGA_ESTIMATE_NOTICE } from '../../../lib/conciergeTools.js';
import { emitAgentTrace } from '../../../lib/agentTraces.js';
import { detectAgentSource } from '../../../lib/agentAttribution.js';

const TOOL_AUGMENTED_SYSTEM_PROMPT = `${CHRIS_SYSTEM_INSTRUCTION}

DETERMINISTIC TOOL-CALLING MANDATE:
1. Whenever a visitor provides property square footage or asks for an exact price quote, ALWAYS call calculate_inspection_quote first and quote the exact returned dollar figure.
2. Whenever a visitor asks whether we serve a specific Georgia city or ZIP code, ALWAYS call check_metro_atlanta_coverage.
3. Whenever a visitor shares both their name and callback phone number to hold an inspection slot, ALWAYS call request_priority_inspection_slot.
4. NEVER invent flat dollar rates for auxiliary services (Sewer Scope, Radon, Termite/WDO, Pool & Spa, Mold/IAQ, STR Compliance, Unincorporated DeKalb Low-Flow); always direct auxiliary pricing to (678) 480-2110.
5. ${OCGA_ESTIMATE_NOTICE}`;

function textOrJsonReply(text, stream) {
  const clean = String(text || '').replace(/\*/g, '').trim();
  if (stream) {
    return new Response(clean, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
  return NextResponse.json({ response: clean });
}

export async function POST(request) {
  const sec = enforceApiSecurity(request, { routeKey: 'api-chat', maxRequests: 20, windowMs: 60_000 });
  if (!sec.ok) return sec.response;

  try {
    const body = await request.json();
    const { messages, stream = false } = body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages array provided.' }, { status: 400 });
    }

    const recentMessages = messages.slice(-6);
    const lastUserText = String([...recentMessages].reverse().find((m) => m.role === 'user')?.content || '').slice(0, 2000);
    const detectedAgent = detectAgentSource({
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || '',
    });

    const injection = detectPromptInjection(lastUserText);
    if (injection.blocked) {
      emitAgentTrace({ channel: 'chat', detectedAgent, sanitizedTopic: lastUserText, blockedReason: 'prompt_injection' });
      return textOrJsonReply(injection.safeReply, stream);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server. Gracefully falling back to local database.' },
        { status: 503 }
      );
    }

    const contents = recentMessages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.content || '').slice(0, 2000) }],
    }));

    const activeModel = await resolveGeminiPrimaryTextModel(apiKey);
    const isGemini4 = /^gemini-4/i.test(activeModel);
    const generationConfig = isGemini4
      ? { maxOutputTokens: 380, thinkingConfig: { thinkingLevel: 'LOW' } }
      : { temperature: 0.4, maxOutputTokens: 380 };
    const geminiPayload = {
      contents,
      tools: [{ functionDeclarations: CONCIERGE_TOOL_DECLARATIONS }],
      systemInstruction: { parts: [{ text: TOOL_AUGMENTED_SYSTEM_PROMPT }] },
      generationConfig,
    };

    const firstRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!firstRes.ok) {
      const errorText = await firstRes.text();
      console.error('Gemini API Error Response:', firstRes.status, errorText);
      return NextResponse.json(
        { error: `Gemini API returned status ${firstRes.status}. Gracefully falling back.` },
        { status: 502 }
      );
    }

    const firstData = await firstRes.json();
    const firstParts = firstData.candidates?.[0]?.content?.parts || [];
    const fnCallPart = firstParts.find((p) => p.functionCall);

    let finalText = '';
    let toolCalled = 'none';
    let toolArgs = {};
    let converted = false;

    if (fnCallPart?.functionCall) {
      const { name, args = {} } = fnCallPart.functionCall;
      toolCalled = name;
      toolArgs = args;
      converted = name === 'request_priority_inspection_slot';
      const toolOutput = await executeConciergeTool(name, args);

      const followUpContents = [
        ...contents,
        { role: 'model', parts: [{ functionCall: { name, args } }] },
        { role: 'user', parts: [{ functionResponse: { name, response: toolOutput } }] },
      ];

      const secondRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: followUpContents,
            systemInstruction: { parts: [{ text: TOOL_AUGMENTED_SYSTEM_PROMPT }] },
            generationConfig,
          }),
        }
      );

      if (secondRes.ok) {
        const secondData = await secondRes.json();
        finalText = (secondData.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
      }
      if (!finalText && toolOutput?.quote) {
        finalText = `For your ${toolOutput.quote.sqft.toLocaleString()} sq ft ${toolOutput.quote.propertyType}, your exact inspection fee is $${toolOutput.quote.total} with our Two-Inspector CMI team (including free infrared thermal and 4K drone roof scans, plus $35,000 combined protection). ${OCGA_ESTIMATE_NOTICE}`;
      }
    } else {
      finalText = firstParts.map((p) => p.text || '').join('');
    }

    if (!finalText) {
      return NextResponse.json({ error: 'Invalid response content structure from Gemini.' }, { status: 502 });
    }

    emitAgentTrace({
      channel: 'chat',
      detectedAgent,
      toolCalled,
      city: toolArgs.query || toolArgs.propertyAddress || '',
      sqft: toolArgs.sqft || null,
      serviceType: toolArgs.serviceType || '',
      converted,
      sanitizedTopic: lastUserText,
    });

    return textOrJsonReply(finalText, stream);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({ error: 'An unexpected internal server error occurred.' }, { status: 500 });
  }
}
