'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function VoiceAgentModal({ isOpen, onClose }) {
  const [callState, setCallState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [interimUserText, setInterimUserText] = useState('');
  const [micError, setMicError] = useState(null);
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content: "Welcome to Foresight Home Inspections! This is Sarah, your client concierge. How can I help you explore our services today? Feel free to ask about our two-inspector standard, $10,000 warranty, instant pricing, or getting on our schedule!"
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [typedInput, setTypedInput] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [engineMode, setEngineMode] = useState('detecting'); // 'live' | 'neural'
  const [liveWsConnected, setLiveWsConnected] = useState(false);

  const [isHandsFree, setIsHandsFree] = useState(true);
  const isHandsFreeRef = useRef(true);
  const isOpenRef = useRef(isOpen);
  const isMutedRef = useRef(isMuted);

  const liveWsRef = useRef(null);
  const audioInputCtxRef = useRef(null);
  const audioOutputCtxRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const processorRef = useRef(null);
  const scheduledAudioTimeRef = useRef(0);
  const activePcmSourcesRef = useRef([]);
  const isModelTurnActiveRef = useRef(false);
  const speakingEndTimerRef = useRef(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const conversationLogRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const greetingTimerRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const callStateRef = useRef(callState);
  const handleStartListeningRef = useRef(null);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    isHandsFreeRef.current = isHandsFree;
  }, [isHandsFree]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    handleStartListeningRef.current = handleStartListening;
  });

  // Master audio halt: instantly stops all audio playback across HTML5 Audio, Gemini Live PCM, and Web Speech
  const haltSpeech = useCallback(() => {
    if (greetingTimerRef.current) {
      clearTimeout(greetingTimerRef.current);
      greetingTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speakingEndTimerRef.current) {
      clearTimeout(speakingEndTimerRef.current);
      speakingEndTimerRef.current = null;
    }

    // 1. Stop and clear HTML5 Audio element
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
      } catch (_) {}
      audioRef.current = null;
    }

    // 2. Stop all Gemini Live PCM buffer sources
    if (activePcmSourcesRef.current && activePcmSourcesRef.current.length > 0) {
      for (const src of activePcmSourcesRef.current) {
        try { src.stop(); } catch (_) {}
      }
      activePcmSourcesRef.current = [];
    }
    scheduledAudioTimeRef.current = 0;

    // 3. Cancel browser Web Speech Synthesis
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch (_) {}
    }

    isSpeakingRef.current = false;
    isModelTurnActiveRef.current = false;
  }, []);

  // Initialize Audio & Speech Recognition support
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      haltSpeech();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, [haltSpeech]);

  // Play studio-grade human neural voice (en-US-JennyNeural)
  const playNeuralAudio = useCallback((audioSrc, onEnded) => {
    if (isMutedRef.current || !audioSrc) {
      setCallState('idle');
      if (onEnded) onEnded();
      return;
    }

    try {
      haltSpeech();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.onplay = () => {
        isSpeakingRef.current = true;
        setCallState('speaking');
      };

      audio.onended = () => {
        audioRef.current = null;
        // Acoustic decay window before unmuting or starting recognition
        setTimeout(() => {
          isSpeakingRef.current = false;
          if (onEnded) {
            onEnded();
          } else {
            if (!isOpenRef.current) return;
            setCallState('listening');
            if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
              return;
            }
            if (isHandsFreeRef.current && handleStartListeningRef.current) {
              handleStartListeningRef.current();
            }
          }
        }, 350);
      };

      audio.onerror = (e) => {
        console.warn('Neural audio playback error:', e);
        isSpeakingRef.current = false;
        audioRef.current = null;
        setCallState('idle');
        if (onEnded) onEnded();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Audio autoplay prevented by browser policy (user tap required):', err);
          isSpeakingRef.current = false;
          audioRef.current = null;
          setCallState('idle');
          if (onEnded) onEnded();
        });
      }
    } catch (err) {
      console.warn('Could not play neural audio:', err);
      isSpeakingRef.current = false;
      audioRef.current = null;
      setCallState('idle');
      if (onEnded) onEnded();
    }
  }, [haltSpeech]);

  // Fallback voice speak function (Natural Female)
  const speakTextFallback = useCallback((text) => {
    if (!synthRef.current || isMuted) return;

    synthRef.current.cancel();
    const cleanText = text.replace(/[*#_~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('Jenny') || 
       v.name.includes('Ava') || 
       v.name.includes('Natural') || 
       v.name.includes('Zira') || 
       v.name.includes('Samantha') || 
       v.name.includes('Google US English')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setCallState('speaking');
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setCallState('idle');
      if (isHandsFreeRef.current && isOpenRef.current && handleStartListeningRef.current) {
        setTimeout(() => {
          if (isOpenRef.current && callStateRef.current === 'idle') {
            handleStartListeningRef.current();
          }
        }, 350);
      }
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setCallState('idle');
    };

    synthRef.current.speak(utterance);
  }, [isMuted]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Live 24kHz PCM Audio Stream Player (Jitter-buffered gapless queue)
  const playLivePcmChunk = useCallback((base64Data) => {
    if (isMutedRef.current || !base64Data) return;
    try {
      // Ensure HTML5 audio greeting/fallback is stopped so they never overlap
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
        } catch (_) {}
        audioRef.current = null;
      }
      if (synthRef.current) {
        try { synthRef.current.cancel(); } catch (_) {}
      }

      if (!audioOutputCtxRef.current || audioOutputCtxRef.current.state === 'closed') {
        audioOutputCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioOutputCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      // 80ms jitter buffer ensures smooth gapless playback between WebSocket chunk deliveries
      if (scheduledAudioTimeRef.current < now) {
        scheduledAudioTimeRef.current = now + 0.08;
      }

      source.start(scheduledAudioTimeRef.current);
      scheduledAudioTimeRef.current += buffer.duration;
      activePcmSourcesRef.current.push(source);

      // Lock speaking state - do not re-render React repeatedly if already speaking
      isSpeakingRef.current = true;
      isModelTurnActiveRef.current = true;
      if (callStateRef.current !== 'speaking') {
        setCallState('speaking');
      }

      // Clear any pending transition back to listening since new audio has arrived
      if (speakingEndTimerRef.current) {
        clearTimeout(speakingEndTimerRef.current);
        speakingEndTimerRef.current = null;
      }

      source.onended = () => {
        const idx = activePcmSourcesRef.current.indexOf(source);
        if (idx > -1) activePcmSourcesRef.current.splice(idx, 1);

        // Transition back to listening ONLY when:
        // 1. Model generation is complete
        // 2. All active audio buffer sources have finished playing
        // 3. 350ms acoustic room decay margin has elapsed
        if (!isModelTurnActiveRef.current && activePcmSourcesRef.current.length === 0) {
          const remainingMs = Math.max(0, (scheduledAudioTimeRef.current - ctx.currentTime) * 1000);
          if (speakingEndTimerRef.current) clearTimeout(speakingEndTimerRef.current);
          speakingEndTimerRef.current = setTimeout(() => {
            if (activePcmSourcesRef.current.length === 0 && !isModelTurnActiveRef.current) {
              isSpeakingRef.current = false;
              setCallState('listening');
            }
          }, remainingMs + 350);
        }
      };
    } catch (err) {
      console.warn('Live PCM chunk playback warning:', err);
    }
  }, []);

  // Instant interruption / barge-in cancellation
  const interruptLiveAudio = useCallback(() => {
    haltSpeech();
  }, [haltSpeech]);

  // Teardown Live session cleanly
  const stopLiveSession = useCallback(() => {
    haltSpeech();
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch (_) {}
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (_) {}
      mediaStreamRef.current = null;
    }
    if (audioInputCtxRef.current) {
      try { audioInputCtxRef.current.close(); } catch (_) {}
      audioInputCtxRef.current = null;
    }
    if (audioOutputCtxRef.current) {
      try { audioOutputCtxRef.current.close(); } catch (_) {}
      audioOutputCtxRef.current = null;
    }
    if (liveWsRef.current) {
      try { liveWsRef.current.close(); } catch (_) {}
      liveWsRef.current = null;
    }
    setLiveWsConnected(false);
  }, [haltSpeech]);

  // Stream raw 16kHz PCM audio from browser microphone to Gemini Live
  const startLiveMicStream = useCallback(async (ws) => {
    try {
      if (mediaStreamRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      audioInputCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        // Drop mic audio if muted or Sarah is currently speaking or turn is active or speaker audio is echoing!
        const outCtx = audioOutputCtxRef.current;
        const isSpeakerAudioPlaying = outCtx && (scheduledAudioTimeRef.current > outCtx.currentTime + 0.35);
        if (
          !ws || 
          ws.readyState !== WebSocket.OPEN || 
          isMutedRef.current || 
          isSpeakingRef.current || 
          isModelTurnActiveRef.current || 
          isSpeakerAudioPlaying
        ) {
          return;
        }

        const float32 = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        let binary = '';
        const bytes = new Uint8Array(int16.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        try {
          ws.send(JSON.stringify({
            realtimeInput: {
              audio: {
                data: base64,
                mimeType: 'audio/pcm;rate=16000'
              }
            }
          }));
        } catch (_) {}
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      if (!isSpeakingRef.current) {
        setCallState('listening');
      }
    } catch (err) {
      console.warn('Microphone streaming permission or init error:', err);
      setEngineMode('neural');
    }
  }, []);

  // Handshake with Gemini Live WebSocket via ephemeral token
  const initLiveConnection = useCallback(async () => {
    if (liveWsRef.current && (liveWsRef.current.readyState === WebSocket.OPEN || liveWsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const res = await fetch('/api/voice/token', { method: 'POST' });
      const data = await res.json();

      if (data.mode !== 'live' || !data.wsUrl) {
        console.log('Gemini Live session unavailable (falling back to Neural Concierge):', data.error || data.message);
        setEngineMode('neural');
        return;
      }

      const ws = new WebSocket(data.wsUrl);
      liveWsRef.current = ws;

      ws.onopen = () => {
        console.log('Gemini Live WebSocket open. Sending setup handshake...');
        const livePrompt = `You are Sarah, the warm, knowledgeable, and professional client concierge at Foresight Home Inspections in Metro Atlanta. You are speaking live with a visitor browsing the Foresight Home Inspections website. Welcome them warmly, invite them to explore our services, ask questions about our two-inspector process or pricing, and help them engage further. Never refer to this conversation as a phone call. Answer questions directly, naturally, and concisely (maximum 35 words). Truly listen to their building science concerns (InterNACHI SOP, electrical panels, crawlspaces, polybutylene, Georgia red clay, HVAC). Mention Foresight advantages: Two-inspector team, $10,000 warranty, free thermal FLIR & aerial drone scans, CMI Christopher Boykin. Single-family starts at $345, condos at $295. Specialty services like Pool ($300), Termite ($110), Radon ($200), and Sewer Scope ($425) are coordinated alongside our primary inspection. Never say that we contract out or use third parties; simply explain that specialty services require specific schedule coordination so our office confirms the exact window within 2 hours. Never use markdown asterisks.`;
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-3.1-flash-live-preview",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede"
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: livePrompt }]
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {}
          }
        }));
      };

      ws.onmessage = async (evt) => {
        try {
          const rawText = typeof evt.data === 'string' ? evt.data : (evt.data instanceof Blob ? await evt.data.text() : String(evt.data));
          const msg = JSON.parse(rawText);
          if (msg.setupComplete) {
            console.log('Gemini Live setup complete! Connecting microphone stream...');
            setLiveWsConnected(true);
            setEngineMode('live');
            startLiveMicStream(ws);
          }

          if (msg.serverContent) {
            // Turn completed by Gemini Live
            if (msg.serverContent.generationComplete || msg.serverContent.turnComplete) {
              isModelTurnActiveRef.current = false;
              const outCtx = audioOutputCtxRef.current;
              const remainingMs = outCtx ? Math.max(0, (scheduledAudioTimeRef.current - outCtx.currentTime) * 1000) : 0;
              if (speakingEndTimerRef.current) clearTimeout(speakingEndTimerRef.current);
              speakingEndTimerRef.current = setTimeout(() => {
                if (activePcmSourcesRef.current.length === 0 && !isModelTurnActiveRef.current) {
                  isSpeakingRef.current = false;
                  setCallState('listening');
                }
              }, remainingMs + 350);
            }

            if (msg.serverContent.interrupted) {
              console.log('Gemini Live interrupted by user speech!');
              haltSpeech();
              isModelTurnActiveRef.current = false;
              setCallState('listening');
            }

            if (msg.serverContent.modelTurn?.parts) {
              isModelTurnActiveRef.current = true;
              isSpeakingRef.current = true;
              if (callStateRef.current !== 'speaking') {
                setCallState('speaking');
              }

              for (const part of msg.serverContent.modelTurn.parts) {
                if (part.inlineData?.data && part.inlineData?.mimeType?.startsWith('audio/pcm')) {
                  playLivePcmChunk(part.inlineData.data);
                }
                if (part.text) {
                  setHistory(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'assistant' && last.live) {
                      return [...prev.slice(0, -1), { role: 'assistant', content: last.content + part.text, live: true }];
                    }
                    return [...prev, { role: 'assistant', content: part.text, live: true }];
                  });
                }
              }
            }
          }
        } catch (e) {
          console.warn('Error parsing Live message:', e);
        }
      };

      ws.onclose = (evt) => {
        console.log('Gemini Live WebSocket closed (code:', evt.code, 'reason:', evt.reason, '). Engaging Neural Fallback.');
        setLiveWsConnected(false);
        setEngineMode('neural');
      };

      ws.onerror = (err) => {
        console.warn('Gemini Live WebSocket error, using Neural Fallback:', err);
        setLiveWsConnected(false);
        setEngineMode('neural');
      };

    } catch (err) {
      console.warn('Could not initialize Gemini Live session:', err);
      setEngineMode('neural');
    }
  }, [startLiveMicStream, playLivePcmChunk, haltSpeech]);

  // Auto-scroll transcript container
  useEffect(() => {
    if (conversationLogRef.current) {
      conversationLogRef.current.scrollTop = conversationLogRef.current.scrollHeight;
    }
  }, [history, interimUserText, callState]);

  // Manage modal open/close lifecycle, greeting lock, and teardown
  useEffect(() => {
    if (isOpen) {
      setCallState('idle');
      setMicError(null);

      // Guard: EXACTLY ONE greeting per modal opening session
      if (!hasGreetedRef.current) {
        hasGreetedRef.current = true;
        haltSpeech();

        // 1. Establish Gemini Live connection in parallel
        initLiveConnection();

        // 2. Play introductory greeting audio exactly once
        greetingTimerRef.current = setTimeout(() => {
          if (isOpenRef.current) {
            playNeuralAudio('/audio/sarah-greeting.mp3', () => {
              // When greeting ends cleanly:
              setTimeout(() => {
                if (!isOpenRef.current) return;
                setCallState('listening');
                if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
                  return; // Live mic processor will now stream visitor voice
                }
                if (isHandsFreeRef.current && handleStartListeningRef.current) {
                  handleStartListeningRef.current();
                }
              }, 250);
            });
          }
        }, 150);
      }
    } else {
      // Modal closed: reset greeting guard and stop all live sessions and audio
      hasGreetedRef.current = false;
      haltSpeech();
      stopLiveSession();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    }
  }, [isOpen, haltSpeech, initLiveConnection, playNeuralAudio, stopLiveSession]);

  // Instant barge-in / toggle helper: interrupts Sarah immediately when speaking, or toggles listen
  const handleToggleOrInterrupt = () => {
    if (callState === 'speaking') {
      haltSpeech();
      handleStartListening();
    } else if (callState === 'listening') {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  // Start speech recognition with instant visual feedback and error recovery
  const handleStartListening = () => {
    // If Sarah is currently speaking or generating, never start listening
    if (isSpeakingRef.current || isModelTurnActiveRef.current) {
      return;
    }

    // 1. Instantly stop ongoing audio
    haltSpeech();

    // 2. Instant visual state update (<0ms delay)
    setCallState('listening');
    setMicError(null);
    setInterimUserText('');

    // If Gemini Live is connected, it handles user voice natively via PCM stream. Do NOT run browser SpeechRecognition!
    if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    // Optional haptic tap on mobile
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(40); } catch (_) {}
    }

    // 3. Browser speech recognition check (Neural fallback mode only)
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not available in this browser. Please type below or tap any question!');
      setCallState('idle');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      // Fresh instance every time ensures zero state-locking
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setCallState('listening');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        const cleanInterim = currentTranscript.trim();
        setInterimUserText(cleanInterim);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        if (event.results[0].isFinal) {
          const finalSpeech = cleanInterim;
          if (finalSpeech) {
            try { recognition.stop(); } catch (_) {}
            handleSendQuery(finalSpeech);
          }
        } else if (cleanInterim.length > 2) {
          // Fast conversational silence detection: submit after 850ms of quiet
          silenceTimerRef.current = setTimeout(() => {
            if (callStateRef.current === 'listening') {
              try { recognition.stop(); } catch (_) {}
              handleSendQuery(cleanInterim);
            }
          }, 850);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone access blocked. Click the lock icon in your browser address bar to allow mic access, or type your question below.');
        } else if (event.error !== 'no-speech') {
          setMicError(`Microphone note: ${event.error}. You can also type or tap any question.`);
        }
        setCallState('idle');
      };

      recognition.onend = () => {
        setCallState(prev => (prev === 'listening' ? 'idle' : prev));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
      setMicError('Could not open microphone. Please allow permissions or type below.');
      setCallState('idle');
    }
  };

  // Stop speech recognition (sends current speech immediately if spoken)
  const handleStopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    if (interimUserText && interimUserText.trim().length > 1) {
      handleSendQuery(interimUserText.trim());
    } else {
      setCallState('idle');
    }
  };

  // Send query to voice API route and play humanized neural response
  const handleSendQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    haltSpeech();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    setMicError(null);

    const userMessage = { role: 'user', content: queryText.trim() };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInterimUserText('');
    setCallState('thinking');

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          currentQuote: calculatedQuote
        })
      });

      const data = await res.json();
      const aiReply = (data.response || "I hear you loud and clear. Let's discuss that further!").replace(/\*/g, '');

      setHistory(prev => [...prev, { role: 'assistant', content: aiReply }]);

      if (data.action === 'quote_calculated' && data.quote) {
        setCalculatedQuote(data.quote);
      }

      if (data.action === 'scheduled' && data.booking) {
        setBookingData(data.booking);
      }

      // Play human neural audio from server, or fallback to browser speech
      if (data.audio) {
        playNeuralAudio(data.audio);
      } else {
        speakTextFallback(aiReply);
      }

      if (data.action === 'end_call') {
        setTimeout(() => {
          if (isOpenRef.current) {
            onClose();
          }
        }, 4500);
      }

    } catch (err) {
      console.error('Voice Assistant Query Error:', err);
      const fallbackReply = "Houses are complex systems, and I want to make sure you get the right advice. If you need an immediate quote or want to book our two-inspector team, call us directly at 678-480-2110!";
      setHistory(prev => [...prev, { role: 'assistant', content: fallbackReply }]);
      speakTextFallback(fallbackReply);
      setCallState('idle');
    }
  };

  // Toggle Addon helper
  const handleToggleAddon = (addonKey, label, price) => {
    const exists = selectedAddons.some(a => a.key === addonKey);
    let updated;
    if (exists) {
      updated = selectedAddons.filter(a => a.key !== addonKey);
    } else {
      updated = [...selectedAddons, { key: addonKey, label, price }];
    }
    setSelectedAddons(updated);

    // Speak update
    const prompt = exists 
      ? `Remove ${label} from my inspection estimate.`
      : `Add ${label} for $${price} to my inspection estimate.`;
    handleSendQuery(prompt);
  };

  // Parse InterNACHI Diagnosis structure from text for visual highlight
  const parseInternachi = (text) => {
    const obsMatch = text.match(/Observation:\s*([^\n]+(?:\n[^\n]+)?)/i);
    const meanMatch = text.match(/What This Could Mean:\s*([^\n]+(?:\n[^\n]+)?)/i);
    const recMatch = text.match(/Recommendation:\s*([^\n]+(?:\n[^\n]+)?)/i);

    if (obsMatch || meanMatch || recMatch) {
      return {
        observation: obsMatch ? obsMatch[1].trim() : null,
        meaning: meanMatch ? meanMatch[1].trim() : null,
        recommendation: recMatch ? recMatch[1].trim() : null,
      };
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="voice-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div 
        className="voice-modal-container"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(165deg, rgba(20, 30, 48, 0.95) 0%, rgba(10, 17, 30, 0.98) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #9B2C2C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #D4AF37',
                  fontSize: '1.4rem',
                  boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)'
                }}
              >
                👩‍💼
              </div>
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                backgroundColor: callState === 'listening' ? '#10b981' : callState === 'speaking' ? '#ef4444' : '#D4AF37',
                borderRadius: '50%',
                border: '2px solid #0F172A',
                boxShadow: '0 0 8px currentColor'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                  Sarah
                </h3>
                <span style={{
                  background: liveWsConnected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                  color: liveWsConnected ? '#38bdf8' : '#D4AF37',
                  border: `1px solid ${liveWsConnected ? 'rgba(56, 189, 248, 0.4)' : 'rgba(212, 175, 55, 0.4)'}`,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {liveWsConnected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                  )}
                  {liveWsConnected ? 'Gemini Live 3.1' : 'Client Concierge'}
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                Foresight Voice Concierge &bull; 
                <span style={{ color: callState === 'speaking' ? '#ef4444' : callState === 'listening' ? '#10b981' : '#D4AF37', marginLeft: '5px', fontWeight: 600 }}>
                  {callState === 'speaking' ? 'Speaking...' : callState === 'listening' ? 'Listening...' : callState === 'thinking' ? 'Checking...' : 'Ready'}
                </span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsHandsFree(!isHandsFree)}
              aria-label={isHandsFree ? 'Switch to Push-to-Talk' : 'Switch to Hands-Free Mode'}
              style={{
                background: isHandsFree ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${isHandsFree ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                color: isHandsFree ? '#34d399' : '#94A3B8',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Toggle Hands-Free Voice mode"
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isHandsFree ? '#10b981' : '#64748b',
                boxShadow: isHandsFree ? '0 0 8px #10b981' : 'none'
              }} />
              {isHandsFree ? 'Hands-Free Voice' : 'Push-to-Talk'}
            </button>

            <button
              onClick={() => {
                if (!isMuted && synthRef.current) synthRef.current.cancel();
                setIsMuted(!isMuted);
              }}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              style={{
                background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: isMuted ? '#ef4444' : '#ffffff',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            <button
              onClick={onClose}
              aria-label="End Conversation"
              style={{
                background: '#dc2626',
                border: 'none',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
              onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
            >
              ✕ Exit
            </button>
          </div>
        </div>

        {/* Central Voice Orb & Sound Visualizer */}
        <div style={{
          padding: '1.5rem 1rem 0.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)'
        }}>
          {/* Animated Pulsing Sound Orb */}
          <button 
            type="button"
            onClick={handleToggleOrInterrupt}
            aria-label={callState === 'listening' ? 'Stop listening' : callState === 'speaking' ? 'Interrupt Sarah' : 'Tap to speak with Sarah'}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              touchAction: 'manipulation',
              background: callState === 'listening'
                ? 'radial-gradient(circle, #10b981 0%, #047857 100%)'
                : callState === 'speaking'
                ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                : callState === 'thinking'
                ? 'radial-gradient(circle, #D4AF37 0%, #B89528 100%)'
                : 'radial-gradient(circle, #D4AF37 20%, #742A2A 100%)',
              boxShadow: callState === 'listening'
                ? '0 0 35px rgba(16, 185, 129, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.4)'
                : callState === 'speaking'
                ? '0 0 45px rgba(239, 68, 68, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.4)'
                : '0 0 25px rgba(212, 175, 55, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: callState === 'speaking' 
                ? 'pulseVoiceSpeaking 1.2s infinite' 
                : callState === 'listening' 
                ? 'pulseVoiceListening 1.4s infinite' 
                : 'pulseVoiceIdle 3s infinite',
              position: 'relative'
            }}
            title={callState === 'listening' ? 'Listening... Tap to finish' : callState === 'speaking' ? 'Sarah speaking... Tap to interrupt' : 'Tap to speak'}
          >
            <span style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
              {callState === 'speaking' ? '🗣️' : callState === 'listening' ? '🎙️' : callState === 'thinking' ? '⏳' : '🎙️'}
            </span>
          </button>

          <p style={{
            marginTop: '12px',
            fontSize: '0.85rem',
            color: callState === 'listening' ? '#34d399' : callState === 'speaking' ? '#f87171' : '#D4AF37',
            fontWeight: 600,
            letterSpacing: '0.02em',
            textAlign: 'center'
          }}>
            {callState === 'listening'
              ? '🟢 Listening... Speak naturally (Hands-Free Call)'
              : callState === 'speaking'
              ? '🗣️ Sarah is speaking (tap orb to interrupt)'
              : callState === 'thinking'
              ? 'Checking schedule & options with Foresight...'
              : 'Tap orb or speak to begin'}
          </p>

          {/* Microphone Permission Warning / Helper Banner */}
          {micError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#fca5a5',
              fontSize: '0.8rem',
              maxWidth: '92%',
              textAlign: 'center',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              animation: 'fadeIn 0.2s ease'
            }}>
              <span>⚠️ {micError}</span>
              <button 
                type="button"
                onClick={() => setMicError(null)}
                aria-label="Dismiss message"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  padding: '2px 6px'
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Realtime Interim User Speech Preview */}
          {interimUserText && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '6px 14px',
              color: '#a7f3d0',
              fontSize: '0.85rem',
              maxWidth: '90%',
              textAlign: 'center',
              marginTop: '6px'
            }}>
              "{interimUserText}"
            </div>
          )}
        </div>

        {/* Scrollable Transcript & Interactive Action Cards */}
        <div 
          ref={conversationLogRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(0, 0, 0, 0.15)',
            minHeight: '220px'
          }}
        >
          {history.map((msg, index) => {
            const isUser = msg.role === 'user';
            const internachi = !isUser ? parseInternachi(msg.content) : null;

            return (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div style={{
                  maxWidth: isUser ? '80%' : '90%',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '16px',
                  background: isUser 
                    ? 'linear-gradient(135deg, #9B2C2C 0%, #742A2A 100%)' 
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  borderBottomRightRadius: isUser ? '4px' : '16px',
                  borderBottomLeftRadius: isUser ? '16px' : '4px',
                  boxShadow: isUser ? '0 4px 15px rgba(155, 44, 44, 0.3)' : 'none'
                }}>
                  {msg.content}
                </div>

                {/* Structured InterNACHI Diagnostic Card if detected */}
                {internachi && (
                  <div style={{
                    marginTop: '8px',
                    width: '90%',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🛡️ InterNACHI Standard Diagnostic Finding
                      </span>
                    </div>

                    {internachi.observation && (
                      <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                        <strong style={{ color: '#60a5fa' }}>🔍 Observation:</strong> {internachi.observation}
                      </div>
                    )}
                    {internachi.meaning && (
                      <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                        <strong style={{ color: '#f59e0b' }}>💡 What This Could Mean:</strong> {internachi.meaning}
                      </div>
                    )}
                    {internachi.recommendation && (
                      <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                        <strong style={{ color: '#10b981' }}>🛠️ Recommendation:</strong> {internachi.recommendation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Interactive Booking Confirmation Card */}
          {bookingData && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '16px 20px',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#34d399', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ✓ Inspection Request Logged!
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: '#0F172A', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  Pending Office Confirmation
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                Thank you, <strong>{bookingData.name}</strong>! We have logged your tentative inspection request. Our office will contact you at <strong>{bookingData.phone}</strong> within 2 hours to confirm inspector arrival time, property access, and coordinate any requested specialty add-ons (Pool, Termite, Radon, Sewer Scope).
              </p>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <div>📍 <strong>Address:</strong> {bookingData.address || 'Pending confirmation'}</div>
                <div>📅 <strong>Requested Window:</strong> {bookingData.preferredDate || 'Upcoming Window'} (Sunday by appt only)</div>
                {bookingData.estimatedTotal && <div>💰 <strong>Estimated Total:</strong> ${bookingData.estimatedTotal}</div>}
              </div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <a 
                  href="tel:6784802110" 
                  style={{
                    background: '#10b981',
                    color: '#0F172A',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📞 Call Christopher (678) 480-2110
                </a>
              </div>
            </div>
          )}

          {/* Real-time Calculated Quote Card */}
          {calculatedQuote && !bookingData && (
            <div style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '14px',
              padding: '14px 18px',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem' }}>
                  📊 Inspection Estimate Summary
                </span>
                <span style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>
                  ${calculatedQuote.total}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '4px 0 8px 0' }}>
                Based on {calculatedQuote.sqft.toLocaleString()} sq ft {calculatedQuote.propertyType}. Includes two-inspector team, aerial drone, and infrared thermal imaging.
              </p>
              <button
                onClick={() => handleSendQuery(`I would like to reserve my inspection for $${calculatedQuote.total}. My name is `)}
                style={{
                  background: '#D4AF37',
                  color: '#0F172A',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                Schedule This Inspection Now
              </button>
            </div>
          )}
        </div>

        {/* Value Perks Exploration Bar */}
        <div style={{
          padding: '6px 1.25rem',
          background: 'rgba(212, 175, 55, 0.05)',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          alignItems: 'center'
        }}>
          <span style={{ color: '#D4AF37', fontSize: '0.72rem', whiteSpace: 'nowrap', fontWeight: 700 }}>
            Why Foresight:
          </span>
          <button
            onClick={() => handleSendQuery("Why do you send two certified inspectors on every inspection?")}
            style={{
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            👥 2-Inspector Standard
          </button>
          <button
            onClick={() => handleSendQuery("What is covered under your complimentary $10,000 Master Protection Warranty?")}
            style={{
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            🛡️ $10k Warranty
          </button>
          <button
            onClick={() => handleSendQuery("Do you include infrared thermal imaging and aerial drone scans?")}
            style={{
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            📷 Free FLIR &amp; Drones
          </button>
          <button
            onClick={() => handleSendQuery("How does your InterNACHI inspection report help me negotiate seller repairs or closing credits?")}
            style={{
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            💰 Negotiation Leverage
          </button>
          <button
            onClick={() => handleSendQuery("What are the official InterNACHI Standards of Practice that you inspect?")}
            style={{
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            📋 InterNACHI SOP
          </button>
        </div>

        {/* 1-Tap Addon Upsell Bar */}
        <div style={{
          padding: '8px 1.25rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          alignItems: 'center'
        }}>
          <span style={{ color: '#94A3B8', fontSize: '0.75rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
            Quick Add-ons:
          </span>
          <button
            onClick={() => handleToggleAddon('radon', 'Radon Gas Testing', 200)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedAddons.some(a => a.key === 'radon') ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: selectedAddons.some(a => a.key === 'radon') ? '#0F172A' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            + Radon ($200)
          </button>
          <button
            onClick={() => handleToggleAddon('termite', 'Termite / WDO Inspection', 110)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedAddons.some(a => a.key === 'termite') ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: selectedAddons.some(a => a.key === 'termite') ? '#0F172A' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            + Termite / WDO ($110+)
          </button>
          <button
            onClick={() => handleToggleAddon('sewer', 'Sewer Scope Camera Inspection', 425)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedAddons.some(a => a.key === 'sewer') ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: selectedAddons.some(a => a.key === 'sewer') ? '#0F172A' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            + Sewer Scope ($425)
          </button>
          <button
            onClick={() => handleToggleAddon('pool', 'Pool and Spa Inspection', 300)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedAddons.some(a => a.key === 'pool') ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: selectedAddons.some(a => a.key === 'pool') ? '#0F172A' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            + Pool/Spa ($300)
          </button>
          <button
            onClick={() => handleToggleAddon('str', 'Short-Term Rental STR Safety Audit', 355)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedAddons.some(a => a.key === 'str') ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: selectedAddons.some(a => a.key === 'str') ? '#0F172A' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            + STR Assist ($355)
          </button>
        </div>

        {/* Bottom Hands-Free & Text Input Bar */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 15, 30, 0.8)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          {/* Microphone Push-to-Talk / Interrupt Button */}
          <button
            type="button"
            onClick={handleToggleOrInterrupt}
            aria-label={callState === 'listening' ? 'Stop listening' : callState === 'speaking' ? 'Interrupt Sarah' : 'Start speaking with Sarah'}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              background: callState === 'listening' ? '#10b981' : callState === 'speaking' ? '#ef4444' : '#9B2C2C',
              color: '#ffffff',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: callState === 'listening' ? '0 0 15px rgba(16, 185, 129, 0.4)' : callState === 'speaking' ? '0 0 15px rgba(239, 68, 68, 0.5)' : '0 4px 12px rgba(155, 44, 44, 0.3)',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            title={callState === 'listening' ? 'Listening... tap to stop' : callState === 'speaking' ? 'Speaking... tap to interrupt' : 'Tap to speak'}
          >
            {callState === 'listening' ? '⏹' : callState === 'speaking' ? '✋' : '🎙️'}
          </button>

          {/* Text input fallback */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (typedInput.trim()) {
                handleSendQuery(typedInput);
                setTypedInput('');
              }
            }}
            style={{ display: 'flex', flex: 1, gap: '8px' }}
          >
            <input 
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Or type your question or address..."
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              style={{
                padding: '0 16px',
                borderRadius: '10px',
                border: 'none',
                background: typedInput.trim() ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)',
                color: typedInput.trim() ? '#0F172A' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: typedInput.trim() ? 'pointer' : 'default',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Send
            </button>
          </form>

          {/* End Conversation Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="End Conversation"
            title="End conversation"
            style={{
              height: '46px',
              padding: '0 12px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
          >
            ✕ End
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulseVoiceSpeaking {
          0% { transform: scale(1); box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 50px rgba(239, 68, 68, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); }
        }
        @keyframes pulseVoiceListening {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 40px rgba(16, 185, 129, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
        }
        @keyframes pulseVoiceIdle {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @media (max-width: 640px) {
          .voice-modal-container {
            max-height: 95vh !important;
            border-radius: 16px !important;
          }
        }
      `}} />
    </div>
  );
}
