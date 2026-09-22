'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { calculateQuoteDetails } from '../../lib/pricing';
import { CHRIS_SYSTEM_INSTRUCTION, JORDAN_SYSTEM_INSTRUCTION, getChrisKnowledgeFallback } from '../../lib/chris-brain-prompt';

export default function VoiceAgentModal({ isOpen, onClose }) {
  const [callState, setCallState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [interimUserText, setInterimUserText] = useState('');
  const [micError, setMicError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [typedInput, setTypedInput] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [engineMode, setEngineMode] = useState('neural'); // 'live' | 'neural'
  const [liveWsConnected, setLiveWsConnected] = useState(false);
  const [persona, setPersona] = useState('chris'); // 'chris' (Master Inspector) | 'jordan' (Sales Concierge)
  const personaRef = useRef('chris');

  const [liveLeadForm, setLiveLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    sqft: '',
    propertyType: 'single-family',
    foundation: 'slab',
    addons: [],
    preferredDate: '',
    estimatedTotal: null
  });
  const liveLeadFormRef = useRef(liveLeadForm);
  const [activeHighlightField, setActiveHighlightField] = useState(null);
  const [leadSubmitStatus, setLeadSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'submitted' | 'error'
  const [formSubmissionMessage, setFormSubmissionMessage] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(true);

  useEffect(() => {
    liveLeadFormRef.current = liveLeadForm;
  }, [liveLeadForm]);

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
  const isInterruptedRef = useRef(false);

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
    if (typeof window !== 'undefined') {
      if (isOpen) {
        window.dispatchEvent(new CustomEvent('foresight_pause_bg_music'));
      } else {
        window.dispatchEvent(new CustomEvent('foresight_resume_bg_music'));
      }
    }
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

  // Play studio-grade human neural voice (en-US-GuyNeural)
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

  // Fallback voice speak function (Natural Authoritative Male)
  const speakTextFallback = useCallback((text) => {
    if (!synthRef.current || isMuted) return;

    synthRef.current.cancel();
    const cleanText = text.replace(/[*#_~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('David') || 
       v.name.includes('Guy') || 
       v.name.includes('Christopher') || 
       v.name.includes('Mark') || 
       v.name.includes('George') ||
       v.name.includes('Google US English Male') ||
       v.name.includes('Microsoft David')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || (!v.name.toLowerCase().includes('female') && !v.name.toLowerCase().includes('zira') && !v.name.toLowerCase().includes('jenny')))) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

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
    if (isMutedRef.current || !base64Data || isInterruptedRef.current) return;
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
      if (audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch (_) {}
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      let consecutiveSpeechFrames = 0;

      processor.onaudioprocess = (e) => {
        if (!ws || ws.readyState !== WebSocket.OPEN || isMutedRef.current) {
          return;
        }

        const float32 = e.inputBuffer.getChannelData(0);

        // VAD RMS calculation
        let sum = 0;
        for (let i = 0; i < float32.length; i++) {
          sum += float32[i] * float32[i];
        }
        const rms = Math.sqrt(sum / float32.length);

        // While assistant is speaking, client-side barge-in detection:
        if (isSpeakingRef.current) {
          if (rms >= 0.012) {
            consecutiveSpeechFrames++;
            if (consecutiveSpeechFrames >= 2) {
              console.log('[Live Barge-In] User interrupted agent. Halting local audio immediately!');
              haltSpeech();
              isInterruptedRef.current = true;
              setCallState('listening');
            }
          } else {
            consecutiveSpeechFrames = 0;
            return; // Suppress quiet room noise while agent is speaking
          }
        } else {
          consecutiveSpeechFrames = 0;
        }

        // Convert Float32 to 16-bit linear PCM (little-endian)
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

      // Connect source to processor, then processor to silenceGain (gain=0) -> prevents microphone acoustic feedback!
      const silenceGain = audioCtx.createGain();
      silenceGain.gain.value = 0.0;
      source.connect(processor);
      processor.connect(silenceGain);
      silenceGain.connect(audioCtx.destination);

      if (!isSpeakingRef.current) {
        setCallState('listening');
      }
    } catch (err) {
      console.warn('Microphone streaming permission or init error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone access was denied. Tap the lock icon in your address bar to allow microphone access, or type your question below.');
      } else {
        setMicError('Microphone could not be opened. You can still type your questions or tap any topic below!');
      }
      setEngineMode('neural');
    }
  }, [haltSpeech]);

  // Autonomous Lead Submission Engine (1-click or voice-triggered)
  const handleAutoSubmitLead = useCallback(async (customFormData = null) => {
    const data = customFormData || liveLeadFormRef.current;
    if (!data.name && !data.phone && !data.email && !data.address) {
      console.log('Skipping lead submit: no contact or property info available yet.');
      return;
    }

    setLeadSubmitStatus('submitting');
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name || 'Website Live Voice Client',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          sqft: data.sqft ? parseInt(data.sqft, 10) : null,
          propertyType: data.propertyType || 'single-family',
          serviceType: 'Full Comprehensive Inspection (2 Inspectors)',
          addons: data.addons || [],
          estimatedTotal: data.estimatedTotal || (calculatedQuote ? calculatedQuote.total : 345),
          preferredDate: data.preferredDate || 'Upcoming Window',
          message: `Captured live by Foresight AI LiveRep (${personaRef.current === 'chris' ? 'Chris Boykin CMI' : 'Jordan Concierge'})`,
          source: 'AI LiveRep Voice Widget'
        })
      });

      const json = await res.json();
      if (json.success) {
        setLeadSubmitStatus('submitted');
        setFormSubmissionMessage(json.message || 'Inspection request received! Christopher Boykin will reach out within 20 minutes.');
        
        // Notify live AI model turns
        if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
          try {
            liveWsRef.current.send(JSON.stringify({
              realtimeInput: {
                text: `[SYSTEM NOTIFICATION: The user just submitted their inspection request via the live request card on screen! Acknowledge enthusiastically that Christopher Boykin's office has received it and will follow up within 20 minutes to solidify agreements and confirm their appointment date.]`
              }
            }));
          } catch (_) {}
        } else {
          speakTextFallback("Your inspection request has been solidified! Christopher's office will reach out within 20 minutes to confirm agreements.");
        }
      } else {
        setLeadSubmitStatus('error');
        setFormSubmissionMessage(json.message || 'Could not submit. Call 678-480-2110 directly.');
      }
    } catch (err) {
      console.error('Lead submit error:', err);
      setLeadSubmitStatus('error');
      setFormSubmissionMessage('Network issue. Call Christopher at 678-480-2110 to lock in your date.');
    }
  }, [calculatedQuote, speakTextFallback]);

  // Real-time NLP Entity Extractor for autonomous form auto-filling
  const extractEntitiesFromText = useCallback((text) => {
    if (!text || typeof text !== 'string') return;
    const clean = text.trim();
    if (clean.length < 3) return;

    let changed = false;
    let detectedField = null;

    setLiveLeadForm(prev => {
      const next = { ...prev };

      // 1. Phone number extraction
      const phoneMatch = clean.match(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/);
      if (phoneMatch && !next.phone) {
        const digits = phoneMatch[0].replace(/\D/g, '');
        if (digits.length >= 10) {
          const formatted = digits.length === 11 && digits.startsWith('1')
            ? `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`
            : `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
          next.phone = formatted;
          changed = true;
          detectedField = 'phone';
        }
      }

      // 2. Email extraction
      const emailMatch = clean.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch && !next.email) {
        next.email = emailMatch[1].toLowerCase();
        changed = true;
        detectedField = 'email';
      }

      // 3. Square footage extraction
      const sqftMatch = clean.match(/(\b[1-9]\d{2,4}\b)\s*(?:sq|square|sf|sqft|ft)/i) || clean.match(/(?:about|around|is|it's|its)?\s*(\b[1-9]\d{2,4}\b)\s*square\s*feet/i);
      if (sqftMatch) {
        const parsedSqft = parseInt(sqftMatch[1].replace(/,/g, ''), 10);
        if (parsedSqft >= 400 && parsedSqft <= 25000 && next.sqft !== parsedSqft) {
          next.sqft = parsedSqft;
          changed = true;
          detectedField = 'sqft';
          const q = calculateQuoteDetails({
            sqft: parsedSqft,
            propertyType: next.propertyType || 'single-family',
            foundation: next.foundation || 'slab',
            ageTier: 'under-25',
            addons: (next.addons || []).reduce((acc, a) => { acc[a] = true; return acc; }, {})
          });
          next.estimatedTotal = q.total;
          setCalculatedQuote(q);
        }
      }

      // 4. Address or Metro Atlanta city
      const atlCities = [
        'Alpharetta', 'Atlanta', 'Marietta', 'Roswell', 'Decatur', 'Sandy Springs',
        'Johns Creek', 'Milton', 'Cumming', 'Duluth', 'Lawrenceville', 'Suwanee',
        'Smyrna', 'Kennesaw', 'Woodstock', 'Canton', 'Dunwoody', 'Brookhaven',
        'Buford', 'Peachtree City', 'Fayetteville', 'Newnan', 'Norcross', 'Tucker',
        'Chamblee', 'Doraville', 'Lilburn', 'Snellville', 'Acworth', 'Cartersville',
        'Stone Mountain', 'Conyers', 'Covington', 'McDonough', 'Stockbridge'
      ];
      const addressMatch = clean.match(/\b\d{1,5}\s+[A-Za-z0-9\s.,]+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Lane|Ln|Way|Boulevard|Blvd|Court|Ct|Circle|Cir|Place|Pl|Trail|Trl|Pkwy|Parkway)\b/i);
      if (addressMatch) {
        next.address = addressMatch[0].trim();
        changed = true;
        detectedField = 'address';
      } else if (!next.address) {
        for (const city of atlCities) {
          const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
          if (cityRegex.test(clean)) {
            next.address = `${city}, GA`;
            changed = true;
            detectedField = 'address';
            break;
          }
        }
      }

      // 5. Client name extraction
      const nameMatch = clean.match(/(?:my name is|i am|i'm|this is|call me)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
      if (nameMatch && !next.name) {
        const candidate = nameMatch[1].trim();
        if (!['interested', 'looking', 'buying', 'selling', 'calling', 'inquiring', 'here', 'ready'].includes(candidate.toLowerCase())) {
          next.name = candidate;
          changed = true;
          detectedField = 'name';
        }
      }

      // 6. Addon recognition
      const currentAddons = new Set(next.addons || []);
      let addonUpdated = false;
      if (/sewer\s*scope/i.test(clean) && !currentAddons.has('sewer')) {
        currentAddons.add('sewer');
        addonUpdated = true;
        detectedField = 'addons';
      }
      if (/radon/i.test(clean) && !currentAddons.has('radon')) {
        currentAddons.add('radon');
        addonUpdated = true;
        detectedField = 'addons';
      }
      if (/termite|wdo/i.test(clean) && !currentAddons.has('termite')) {
        currentAddons.add('termite');
        addonUpdated = true;
        detectedField = 'addons';
      }
      if (/pool/i.test(clean) && !currentAddons.has('pool')) {
        currentAddons.add('pool');
        addonUpdated = true;
        detectedField = 'addons';
      }
      if (/low\s*flow/i.test(clean) && !currentAddons.has('lowFlow')) {
        currentAddons.add('lowFlow');
        addonUpdated = true;
        detectedField = 'addons';
      }
      if (addonUpdated) {
        next.addons = Array.from(currentAddons);
        changed = true;
        const q = calculateQuoteDetails({
          sqft: next.sqft || 2000,
          propertyType: next.propertyType || 'single-family',
          foundation: next.foundation || 'slab',
          ageTier: 'under-25',
          addons: next.addons.reduce((acc, a) => { acc[a] = true; return acc; }, {})
        });
        next.estimatedTotal = q.total;
        setCalculatedQuote(q);
      }

      // 7. Preferred Date / Window
      const dateMatch = clean.match(/(?:on|for|this|next)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|this weekend|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?\b)/i);
      if (dateMatch && !next.preferredDate) {
        next.preferredDate = dateMatch[0].trim();
        changed = true;
        detectedField = 'preferredDate';
      }

      if (changed && detectedField) {
        setActiveHighlightField(detectedField);
        setTimeout(() => setActiveHighlightField(null), 2500);
      }

      return changed ? next : prev;
    });

    // Check for voice-triggered submission phrase
    if (/(?:book it|submit it|lock it in|schedule it|reserve it|confirm appointment|confirm inspection|send request)/i.test(clean)) {
      handleAutoSubmitLead();
    }
  }, [handleAutoSubmitLead]);

  // Handshake with Gemini Live WebSocket via ephemeral token
  const initLiveConnection = useCallback(async (targetPersona = null) => {
    if (liveWsRef.current && (liveWsRef.current.readyState === WebSocket.OPEN || liveWsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const currentPersona = targetPersona || personaRef.current || 'chris';

    try {
      const res = await fetch('/api/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: currentPersona })
      });
      const data = await res.json();

      if (data.mode !== 'live' || !data.wsUrl) {
        console.log('Gemini Live session unavailable (falling back to Neural Concierge):', data.error || data.message);
        setEngineMode('neural');
        const greetingText = currentPersona === 'chris'
          ? "Hello! I am Chris Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. What inspection or home systems questions can I answer for you today?"
          : "Hello! I am Jordan, client experience concierge at Foresight Home Inspections. We send two certified inspectors on every job with free thermal imaging. How can I help you check pricing or secure an inspection date today?";
        setHistory([{
          role: 'assistant',
          content: greetingText
        }]);
        setCallState('speaking');
        playNeuralAudio(currentPersona === 'chris' ? '/audio/chris-cloned-greeting.mp3' : null, () => {
          if (isOpenRef.current && isHandsFreeRef.current && handleStartListeningRef.current) {
            handleStartListeningRef.current();
          }
        });
        return;
      }

      const ws = new WebSocket(data.wsUrl);
      liveWsRef.current = ws;

      ws.onopen = () => {
        console.log(`Gemini 3.1 Live WebSocket open for persona: ${currentPersona}. Sending setup handshake...`);
        const livePrompt = currentPersona === 'chris' ? CHRIS_SYSTEM_INSTRUCTION : JORDAN_SYSTEM_INSTRUCTION;

        const liveTools = [{
          functionDeclarations: [
            {
              name: "calculate_quote",
              description: "Calculates official Foresight inspection fee, itemized breakdown, and buyer leverage.",
              parameters: {
                type: "OBJECT",
                properties: {
                  sqft: { type: "INTEGER", description: "Exact square footage of the home" },
                  property_type: { type: "STRING", enum: ["single-family", "condo"], description: "Type of property" },
                  foundation: { type: "STRING", enum: ["slab", "crawlspace", "basement"], description: "Foundation type" },
                  age_tier: { type: "STRING", enum: ["under-25", "25-49", "over-50"], description: "Age of the home" },
                  addons: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                    description: "Addon services: radon ($250), sewer ($450), termite ($125/$165), pool ($275), lowFlow ($100), str ($595)"
                  }
                },
                required: ["sqft"]
              }
            },
            {
              name: "book_inspection",
              description: "Records tentative inspection booking into CRM and queues official confirmation.",
              parameters: {
                type: "OBJECT",
                properties: {
                  client_name: { type: "STRING", description: "Client full name" },
                  phone: { type: "STRING", description: "Client phone number" },
                  email: { type: "STRING", description: "Client email address" },
                  property_address: { type: "STRING", description: "Property address" },
                  preferred_date: { type: "STRING", description: "Requested inspection date or window" },
                  estimated_total: { type: "NUMBER", description: "Estimated total inspection fee" }
                },
                required: ["client_name", "phone"]
              }
            }
          ]
        }];

        ws.send(JSON.stringify({
          setup: {
            model: data.model || "models/gemini-3.1-flash-live-preview",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: data.voice || (currentPersona === 'chris' ? "Charon" : "Aoede")
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: livePrompt }]
            },
            tools: liveTools,
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
            console.log('Gemini 3.1 Live setup complete! Connecting microphone stream...');
            setLiveWsConnected(true);
            setEngineMode('live');
            startLiveMicStream(ws);

            const greetingPrompt = currentPersona === 'chris'
              ? "The client just opened the voice console on our website. Greet them warmly and concisely as Chris Boykin, Certified Master Inspector from Foresight Home Inspections in Atlanta in 1 spoken sentence, and ask what inspection questions you can answer for them today."
              : "The client just opened the voice console on our website. Greet them warmly and enthusiastically as Jordan from Foresight Home Inspections in Atlanta in 1 short spoken sentence, and ask about their property or preferred inspection date.";

            ws.send(JSON.stringify({
              clientContent: {
                turns: [{
                  role: 'user',
                  parts: [{
                    text: greetingPrompt
                  }]
                }],
                turnComplete: true
              }
            }));
          }

          if (msg.serverContent) {
            // Turn completed by Gemini Live
            if (msg.serverContent.generationComplete || msg.serverContent.turnComplete) {
              isModelTurnActiveRef.current = false;
              isInterruptedRef.current = false;
              setHistory(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant' && last.streaming) {
                  return [...prev.slice(0, -1), { ...last, streaming: false }];
                }
                return prev;
              });
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
              isInterruptedRef.current = true;
              haltSpeech();
              isModelTurnActiveRef.current = false;
              setCallState('listening');
            }

            // Real-time spoken transcript from Gemini
            if (msg.serverContent.outputTranscription?.text) {
              const streamedText = msg.serverContent.outputTranscription.text.replace(/\*/g, '');
              setHistory(prev => {
                if (prev.length === 1 && (prev[0].isPlaceholder || prev[0].isConnecting || (prev[0].role === 'assistant' && !prev[0].live))) {
                  return [{ role: 'assistant', content: streamedText, streaming: true, live: true }];
                }
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant' && last.streaming) {
                  return [...prev.slice(0, -1), { ...last, content: last.content + streamedText }];
                }
                return [...prev, { role: 'assistant', content: streamedText, streaming: true, live: true }];
              });
            }

            // Low latency interim transcription preview while user is speaking
            if (msg.serverContent.interimInputTranscription?.text) {
              setInterimUserText(msg.serverContent.interimInputTranscription.text);
              extractEntitiesFromText(msg.serverContent.interimInputTranscription.text);
            }

            // Real-time finalized speech-to-text transcript of user speech
            if (msg.serverContent.inputTranscription?.text) {
              const userSpokenText = msg.serverContent.inputTranscription.text;
              setInterimUserText('');
              extractEntitiesFromText(userSpokenText);
              setHistory(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'user' && last.streaming) {
                  return [...prev.slice(0, -1), { ...last, content: userSpokenText, streaming: false }];
                }
                return [...prev, { role: 'user', content: userSpokenText, streaming: false, live: true }];
              });
              setCallState('thinking');
            }

            if (msg.serverContent.modelTurn?.parts) {
              isInterruptedRef.current = false;
              isModelTurnActiveRef.current = true;
              isSpeakingRef.current = true;
              if (callStateRef.current !== 'speaking') {
                setCallState('speaking');
              }
              setHistory(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'user' && last.streaming) {
                  return [...prev.slice(0, -1), { ...last, streaming: false }];
                }
                return prev;
              });

              for (const part of msg.serverContent.modelTurn.parts) {
                if (part.inlineData?.data && part.inlineData?.mimeType?.startsWith('audio/pcm')) {
                  playLivePcmChunk(part.inlineData.data);
                }

                // Handle tool / function calls from Gemini Live
                if (part.functionCall) {
                  const { name, args, id } = part.functionCall;
                  console.log('[Gemini Live Tool Call]', name, args);
                  let toolResult = {};
                  if (name === 'calculate_quote') {
                    const q = calculateQuoteDetails({
                      sqft: args.sqft,
                      propertyType: args.property_type || 'single-family',
                      foundation: args.foundation || 'slab',
                      ageTier: args.age_tier || 'under-25',
                      addons: (args.addons || []).reduce((acc, a) => { acc[a] = true; return acc; }, {})
                    });
                    setCalculatedQuote(q);
                    setLiveLeadForm(prev => ({
                      ...prev,
                      sqft: args.sqft || prev.sqft,
                      propertyType: args.property_type || prev.propertyType,
                      foundation: args.foundation || prev.foundation,
                      addons: args.addons || prev.addons,
                      estimatedTotal: q.total
                    }));
                    setActiveHighlightField('sqft');
                    setTimeout(() => setActiveHighlightField(null), 2500);
                    toolResult = {
                      total: q.total,
                      base: q.base,
                      extra: q.extra,
                      deposit: q.deposit,
                      balanceDue: q.balanceDue,
                      addonBreakdown: q.addonBreakdown,
                      summary: `Calculated total fee is $${q.total} with two certified inspectors. 50% deposit to solidify ($${q.deposit}) due after office confirmation.`
                    };
                  } else if (name === 'book_inspection') {
                    const bData = {
                      name: args.client_name,
                      phone: args.phone,
                      email: args.email || '',
                      address: args.property_address || '',
                      preferredDate: args.preferred_date || 'Upcoming Window',
                      estimatedTotal: args.estimated_total || (calculatedQuote ? calculatedQuote.total : null)
                    };
                    setBookingData(bData);
                    setLiveLeadForm(prev => ({
                      ...prev,
                      name: args.client_name || prev.name,
                      phone: args.phone || prev.phone,
                      email: args.email || prev.email,
                      address: args.property_address || prev.address,
                      preferredDate: args.preferred_date || prev.preferredDate,
                      estimatedTotal: args.estimated_total || prev.estimatedTotal
                    }));
                    setActiveHighlightField('name');
                    setTimeout(() => setActiveHighlightField(null), 2500);
                    toolResult = {
                      status: 'logged',
                      message: `Inspection request logged for ${args.client_name} (${args.phone}). Office confirmation and agreements queued.`
                    };
                  }

                  try {
                    ws.send(JSON.stringify({
                      toolResponse: {
                        functionResponses: [{
                          response: { output: toolResult },
                          id
                        }]
                      }
                    }));
                  } catch (toolErr) {
                    console.warn('Failed to send toolResponse over Live WebSocket:', toolErr);
                  }
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
        setHistory(prev => {
          if (prev.length === 0) {
            return [{
              role: 'assistant',
              content: currentPersona === 'chris'
                ? "Hello! I'm Chris Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. What inspection or home systems questions can I answer for you today?"
                : "Hello! I'm Jordan, client concierge at Foresight Home Inspections. How can I help you check instant pricing or book your inspection?"
            }];
          }
          return prev;
        });
        setCallState('idle');
      };

      ws.onerror = (err) => {
        console.warn('Gemini Live WebSocket error, using Neural Fallback:', err);
        setLiveWsConnected(false);
        setEngineMode('neural');
        setHistory(prev => {
          if (prev.length === 0) {
            return [{
              role: 'assistant',
              content: currentPersona === 'chris'
                ? "Hello! I'm Chris Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. What inspection or home systems questions can I answer for you today?"
                : "Hello! I'm Jordan, client concierge at Foresight Home Inspections. How can I help you check instant pricing or book your inspection?"
            }];
          }
          return prev;
        });
        setCallState('idle');
      };

    } catch (err) {
      console.warn('Could not initialize Gemini Live session:', err);
      setEngineMode('neural');
      const greetingText = currentPersona === 'chris'
        ? "Hello! I am Chris Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. What inspection or home systems questions can I answer for you today?"
        : "Hello! I am Jordan, client experience concierge at Foresight Home Inspections. How can I help you check pricing or schedule today?";
      setHistory(prev => {
        if (prev.length === 0) {
          return [{
            role: 'assistant',
            content: greetingText
          }];
        }
        return prev;
      });
      setCallState('speaking');
      playNeuralAudio(currentPersona === 'chris' ? '/audio/chris-cloned-greeting.mp3' : null, () => {
        if (isOpenRef.current && isHandsFreeRef.current && handleStartListeningRef.current) {
          handleStartListeningRef.current();
        }
      });
    }
  }, [startLiveMicStream, playLivePcmChunk, haltSpeech, playNeuralAudio, calculatedQuote]);

  // Persona switcher between Jordan (Concierge) and Chris (Master Inspector)
  const switchPersona = useCallback((newPersona) => {
    if (newPersona === personaRef.current) return;
    setPersona(newPersona);
    personaRef.current = newPersona;
    stopLiveSession();
    setHistory([]);
    setInterimUserText('');
    setCalculatedQuote(null);
    setBookingData(null);
    setCallState('thinking');
    initLiveConnection(newPersona);
  }, [stopLiveSession, initLiveConnection]);

  // Auto-scroll transcript container
  useEffect(() => {
    if (conversationLogRef.current) {
      conversationLogRef.current.scrollTop = conversationLogRef.current.scrollHeight;
    }
  }, [history, interimUserText, callState]);

  // Manage modal open/close lifecycle, greeting lock, and teardown
  useEffect(() => {
    if (isOpen) {
      if (!hasGreetedRef.current) {
        hasGreetedRef.current = true;
        haltSpeech();
        setBookingData(null);
        setCalculatedQuote(null);
        setInterimUserText('');
        setMicError(null);
        setHistory([]);
        setCallState('thinking');

        // Resume AudioContext instances on user interaction click
        if (audioOutputCtxRef.current && audioOutputCtxRef.current.state === 'suspended') {
          try { audioOutputCtxRef.current.resume(); } catch (_) {}
        }
        if (audioInputCtxRef.current && audioInputCtxRef.current.state === 'suspended') {
          try { audioInputCtxRef.current.resume(); } catch (_) {}
        }

        // Initialize Gemini Live WebSocket as primary conversational engine
        initLiveConnection();
      }
    } else {
      // Modal closed: reset greeting guard and stop all live sessions and audio
      hasGreetedRef.current = false;
      setHistory([]);
      if (greetingTimerRef.current) {
        clearTimeout(greetingTimerRef.current);
        greetingTimerRef.current = null;
      }
      haltSpeech();
      stopLiveSession();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    }

    return () => {
      if (greetingTimerRef.current) {
        clearTimeout(greetingTimerRef.current);
        greetingTimerRef.current = null;
      }
    };
  }, [isOpen, haltSpeech, playNeuralAudio, stopLiveSession, initLiveConnection]);

  // Instant barge-in / toggle helper: interrupts Chris immediately when speaking, or toggles listen
  const handleToggleOrInterrupt = () => {
    if (audioInputCtxRef.current && audioInputCtxRef.current.state === 'suspended') {
      try { audioInputCtxRef.current.resume(); } catch (_) {}
    }
    if (audioOutputCtxRef.current && audioOutputCtxRef.current.state === 'suspended') {
      try { audioOutputCtxRef.current.resume(); } catch (_) {}
    }

    if (callState === 'speaking') {
      haltSpeech();
      isInterruptedRef.current = true;
      setCallState('listening');
    } else if (callState === 'listening') {
      if (engineMode === 'live') {
        setCallState('idle');
      } else {
        handleStopListening();
      }
    } else {
      setCallState('listening');
      if (engineMode !== 'live') {
        handleStartListening();
      }
    }
  };

  // Start speech recognition with instant visual feedback and error recovery
  const handleStartListening = () => {
    // 1. Instantly stop ongoing audio
    haltSpeech();
    setCallState('listening');
    setMicError(null);
    setInterimUserText('');

    if (audioInputCtxRef.current && audioInputCtxRef.current.state === 'suspended') {
      try { audioInputCtxRef.current.resume(); } catch (_) {}
    }

    // Optional haptic tap on mobile
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(40); } catch (_) {}
    }

    // In Gemini Live mode, microphone streams raw 16kHz PCM continuously over WebSocket
    // Browser SpeechRecognition is strictly for Neural fallback mode
    if (engineMode === 'live') {
      return;
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
        extractEntitiesFromText(cleanInterim);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        if (event.results[0].isFinal) {
          const finalSpeech = cleanInterim;
          if (finalSpeech) {
            try { recognition.stop(); } catch (_) {}
            extractEntitiesFromText(finalSpeech);
            handleSendQuery(finalSpeech);
          }
        } else if (cleanInterim.length > 2) {
          // Fast conversational silence detection: submit after 850ms of quiet
          silenceTimerRef.current = setTimeout(() => {
            if (callStateRef.current === 'listening') {
              try { recognition.stop(); } catch (_) {}
              extractEntitiesFromText(cleanInterim);
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

    extractEntitiesFromText(queryText.trim());

    const userMessage = { role: 'user', content: queryText.trim(), live: true };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInterimUserText('');
    setCallState('thinking');

    // If Gemini Live is connected, stream text directly over the WebSocket for spoken native response!
    if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
      try {
        liveWsRef.current.send(JSON.stringify({
          realtimeInput: {
            text: queryText.trim()
          }
        }));
        return;
      } catch (wsErr) {
        console.warn('Live WebSocket text dispatch failed, falling back to HTTP:', wsErr);
      }
    }

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          currentQuote: calculatedQuote,
          persona: personaRef.current
        })
      });

      const data = await res.json();
      const aiReply = (data.response || "I hear you loud and clear. Let's discuss that further!").replace(/\*/g, '');

      setHistory(prev => [...prev, { role: 'assistant', content: aiReply }]);

      if (data.action === 'quote_calculated' && data.quote) {
        setCalculatedQuote(data.quote);
        setLiveLeadForm(prev => ({
          ...prev,
          sqft: data.quote.sqft || prev.sqft,
          estimatedTotal: data.quote.total
        }));
      }

      if (data.action === 'scheduled' && data.booking) {
        setBookingData(data.booking);
        setLiveLeadForm(prev => ({
          ...prev,
          name: data.booking.name || prev.name,
          phone: data.booking.phone || prev.phone,
          email: data.booking.email || prev.email,
          address: data.booking.address || prev.address,
          preferredDate: data.booking.preferredDate || prev.preferredDate,
          estimatedTotal: data.booking.estimatedTotal || prev.estimatedTotal
        }));
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
                  overflow: 'hidden',
                  boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)'
                }}
              >
                <img 
                  src={persona === 'chris' ? '/images/Christopher_Boykin.webp' : '/images/cmi_logo.webp'} 
                  alt={persona === 'chris' ? 'Christopher Boykin, Certified Master Inspector' : 'Jordan Concierge'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                  {persona === 'chris' ? 'Chris' : 'Jordan'}
                </h3>
                <span style={{
                  background: persona === 'chris' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: persona === 'chris' ? '#D4AF37' : '#34d399',
                  border: `1px solid ${persona === 'chris' ? 'rgba(212, 175, 55, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
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
                  {persona === 'chris' ? 'Certified Master Inspector' : 'Sales Concierge'}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  {liveWsConnected ? 'Gemini 3.1 Live' : '🎙️ Authentic Cloned Voice'}
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                {persona === 'chris' ? 'Founder & Certified Master Inspector' : 'Client Experience Specialist'} &bull; 
                <span style={{ color: callState === 'speaking' ? '#ef4444' : callState === 'listening' ? '#10b981' : '#D4AF37', marginLeft: '5px', fontWeight: 600 }}>
                  {callState === 'speaking' ? 'Speaking...' : callState === 'listening' ? 'Listening...' : callState === 'thinking' ? 'Checking...' : 'Ready'}
                </span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Persona Switcher */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid rgba(212, 175, 55, 0.35)'
            }}>
              <button
                type="button"
                onClick={() => switchPersona('jordan')}
                aria-label="Switch to Jordan Concierge"
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: persona === 'jordan' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                  color: persona === 'jordan' ? '#ffffff' : '#94A3B8',
                  transition: 'all 0.2s'
                }}
              >
                🎙️ Jordan
              </button>
              <button
                type="button"
                onClick={() => switchPersona('chris')}
                aria-label="Switch to Chris Master Inspector"
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: persona === 'chris' ? 'linear-gradient(135deg, #D4AF37, #9B2C2C)' : 'transparent',
                  color: persona === 'chris' ? '#ffffff' : '#94A3B8',
                  transition: 'all 0.2s'
                }}
              >
                🏗️ Chris
              </button>
            </div>
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

        {/* Visual LiveRep Avatar & Sound Visualizer (Christopher Boykin, Certified Master Inspector®) */}
        <div style={{
          padding: '1.25rem 1rem 0.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.12) 0%, transparent 70%)'
        }}>
          {/* Animated Audio-Reactive LiveRep Avatar */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              onClick={handleToggleOrInterrupt}
              aria-label={callState === 'listening' ? 'Stop listening' : callState === 'speaking' ? `Interrupt ${persona === 'chris' ? 'Chris' : 'Jordan'}` : `Tap to speak with ${persona === 'chris' ? 'Chris' : 'Jordan'}`}
              style={{
                width: '104px',
                height: '104px',
                borderRadius: '50%',
                border: callState === 'listening' 
                  ? '3px solid #10b981' 
                  : callState === 'speaking' 
                  ? '3px solid #D4AF37' 
                  : '3px solid rgba(212, 175, 55, 0.45)',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                touchAction: 'manipulation',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                boxShadow: callState === 'listening'
                  ? '0 0 35px rgba(16, 185, 129, 0.6), 0 0 70px rgba(16, 185, 129, 0.25)'
                  : callState === 'speaking'
                  ? '0 0 40px rgba(212, 175, 55, 0.65), 0 0 75px rgba(239, 68, 68, 0.3)'
                  : '0 0 25px rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: callState === 'speaking' 
                  ? 'pulseVoiceSpeaking 1.2s infinite' 
                  : callState === 'listening' 
                  ? 'pulseVoiceListening 1.4s infinite' 
                  : 'pulseVoiceIdle 3s infinite',
                position: 'relative',
                padding: '3px',
                overflow: 'hidden'
              }}
              title={callState === 'listening' ? 'Listening... Tap to finish' : callState === 'speaking' ? `${persona === 'chris' ? 'Chris' : 'Jordan'} is speaking... Tap to interrupt` : 'Tap to speak'}
            >
              <img 
                src={persona === 'chris' ? '/images/Christopher_Boykin.webp' : '/images/cmi_logo.webp'} 
                alt={persona === 'chris' ? 'Christopher Boykin, Certified Master Inspector' : 'Jordan Concierge'}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  filter: callState === 'speaking' ? 'brightness(1.05)' : 'none'
                }}
              />
            </button>

            {/* Certified Master Inspector® Badge Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '2px solid #0F172A',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="/images/cmi_logo.webp" 
                alt="Certified Master Inspector" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Equalizer Sound Waveform Bars */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            height: '24px',
            marginTop: '10px'
          }}>
            {[35, 70, 50, 95, 60, 100, 75, 85, 45, 90, 65, 40].map((h, i) => (
              <span
                key={i}
                style={{
                  width: '3px',
                  borderRadius: '2px',
                  background: callState === 'speaking'
                    ? 'linear-gradient(to top, #D4AF37, #ef4444)'
                    : callState === 'listening'
                    ? 'linear-gradient(to top, #059669, #34d399)'
                    : 'rgba(212, 175, 55, 0.35)',
                  height: (callState === 'speaking' || callState === 'listening')
                    ? `${Math.max(5, Math.round(h * (callState === 'speaking' ? 0.9 : 0.6)))}px`
                    : '4px',
                  animation: (callState === 'speaking' || callState === 'listening')
                    ? `waveBar 0.75s ease-in-out infinite alternate ${i * 0.05}s`
                    : 'none',
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
          </div>

          <p style={{
            marginTop: '8px',
            fontSize: '0.85rem',
            color: callState === 'listening' ? '#34d399' : callState === 'speaking' ? '#fcd34d' : '#D4AF37',
            fontWeight: 700,
            letterSpacing: '0.01em',
            textAlign: 'center'
          }}>
            {callState === 'listening'
              ? '🟢 Listening to you... Speak naturally (Hands-Free Call)'
              : callState === 'speaking'
              ? `🗣️ ${persona === 'chris' ? 'Chris Boykin (CMI®)' : 'Jordan'} is speaking... (tap to interrupt)`
              : callState === 'thinking'
              ? '⚡ Analyzing Atlanta building code & pricing...'
              : 'Tap Christopher or speak naturally to begin'}
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

        {/* Autonomous Live Self-Filling Request Card ("The Magic Form") */}
        <div style={{
          margin: '0.4rem 1rem 0.6rem 1rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          position: 'relative'
        }}>
          {/* Card Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isFormExpanded ? '8px' : '0px',
            borderBottom: isFormExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            paddingBottom: isFormExpanded ? '6px' : '0px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem' }}>📋</span>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}>
                Live Inspection Request Card
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Auto-Filling by Voice
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!isFormExpanded && (
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700 }}>
                  Est: ${calculatedQuote ? calculatedQuote.total : (liveLeadForm.estimatedTotal || 345)}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  padding: '2px 8px',
                  fontWeight: 600
                }}
              >
                {isFormExpanded ? '▲ Minimize' : '▼ Expand'}
              </button>
            </div>
          </div>

          {isFormExpanded && (
            <>
              {/* Form Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                gap: '8px',
                marginBottom: '8px'
              }}>
                {/* Client Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                    Your Name {activeHighlightField === 'name' && <span style={{ color: '#34d399', fontWeight: 800 }}>✨ Voice auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    value={liveLeadForm.name}
                    onChange={(e) => setLiveLeadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Speak or type name..."
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: activeHighlightField === 'name' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: activeHighlightField === 'name' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                    Phone Number {activeHighlightField === 'phone' && <span style={{ color: '#34d399', fontWeight: 800 }}>✨ Voice auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    value={liveLeadForm.phone}
                    onChange={(e) => setLiveLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. (404) 555-0199"
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: activeHighlightField === 'phone' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: activeHighlightField === 'phone' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                    Email Address {activeHighlightField === 'email' && <span style={{ color: '#34d399', fontWeight: 800 }}>✨ Voice auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    value={liveLeadForm.email}
                    onChange={(e) => setLiveLeadForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. buyer@gmail.com"
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: activeHighlightField === 'email' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: activeHighlightField === 'email' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Property Address / City */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                    Property Address / City {activeHighlightField === 'address' && <span style={{ color: '#34d399', fontWeight: 800 }}>✨ Voice auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    value={liveLeadForm.address}
                    onChange={(e) => setLiveLeadForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. Alpharetta, GA"
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: activeHighlightField === 'address' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: activeHighlightField === 'address' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Square Footage */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                    Square Footage {activeHighlightField === 'sqft' && <span style={{ color: '#34d399', fontWeight: 800 }}>✨ Voice auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    value={liveLeadForm.sqft || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLiveLeadForm(prev => ({ ...prev, sqft: val }));
                      const parsed = parseInt(val, 10);
                      if (parsed >= 400 && parsed <= 25000) {
                        const q = calculateQuoteDetails({
                          sqft: parsed,
                          propertyType: liveLeadForm.propertyType,
                          foundation: liveLeadForm.foundation,
                          ageTier: 'under-25',
                          addons: (liveLeadForm.addons || []).reduce((acc, a) => { acc[a] = true; return acc; }, {})
                        });
                        setCalculatedQuote(q);
                      }
                    }}
                    placeholder="e.g. 2,400 sq ft"
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: activeHighlightField === 'sqft' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: activeHighlightField === 'sqft' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                    Preferred Date {activeHighlightField === 'preferredDate' && <span style={{ color: '#34d399', fontWeight: 800 }}>✨ Voice auto-filled</span>}
                  </label>
                  <input
                    type="text"
                    value={liveLeadForm.preferredDate}
                    onChange={(e) => setLiveLeadForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                    placeholder="e.g. Saturday morning"
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: activeHighlightField === 'preferredDate' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: activeHighlightField === 'preferredDate' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Addons Selection Chips */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                marginBottom: '8px',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>Add-ons:</span>
                {[
                  { key: 'sewer', label: 'Sewer Scope ($450)' },
                  { key: 'radon', label: 'Radon ($250)' },
                  { key: 'termite', label: 'Termite ($125+)' },
                  { key: 'pool', label: 'Pool/Spa ($275)' },
                  { key: 'lowFlow', label: 'DeKalb Low-Flow ($100)' }
                ].map(item => {
                  const isSelected = (liveLeadForm.addons || []).includes(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setLiveLeadForm(prev => {
                          const cur = prev.addons || [];
                          const nextAddons = isSelected ? cur.filter(k => k !== item.key) : [...cur, item.key];
                          const q = calculateQuoteDetails({
                            sqft: prev.sqft || 2000,
                            propertyType: prev.propertyType || 'single-family',
                            foundation: prev.foundation || 'slab',
                            ageTier: 'under-25',
                            addons: nextAddons.reduce((acc, a) => { acc[a] = true; return acc; }, {})
                          });
                          setCalculatedQuote(q);
                          return { ...prev, addons: nextAddons, estimatedTotal: q.total };
                        });
                      }}
                      style={{
                        padding: '2px 7px',
                        borderRadius: '10px',
                        border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#34d399' : '#cbd5e1',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fee & Solidification Banner */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '8px',
                padding: '6px 10px',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Fee:</span>
                    <span style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                      ${calculatedQuote ? calculatedQuote.total : (liveLeadForm.estimatedTotal || 345)}
                    </span>
                    <span style={{ fontSize: '0.62rem', background: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                      2-INSPECTOR TEAM INCLUDED
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.66rem', color: '#cbd5e1' }}>
                    🔒 50% Deposit to Solidify: <strong>${Math.round((calculatedQuote ? calculatedQuote.total : (liveLeadForm.estimatedTotal || 345)) / 2)}</strong> (due after confirmation) &bull; Balance upon completion: <strong>${(calculatedQuote ? calculatedQuote.total : (liveLeadForm.estimatedTotal || 345)) - Math.round((calculatedQuote ? calculatedQuote.total : (liveLeadForm.estimatedTotal || 345)) / 2)}</strong>
                  </p>
                </div>
              </div>

              {/* Submit Action or Status */}
              {leadSubmitStatus === 'submitted' ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#34d399',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div>
                    <strong>✅ Inspection Request Solidified!</strong>
                    <p style={{ margin: '2px 0 0 0', color: '#a7f3d0', fontSize: '0.7rem' }}>
                      {formSubmissionMessage || "Chris Boykin's office has received your request and will call within 20 minutes to confirm your slot."}
                    </p>
                  </div>
                  <a
                    href="tel:6784802110"
                    style={{
                      background: '#10b981',
                      color: '#0F172A',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📞 Call (678) 480-2110
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={leadSubmitStatus === 'submitting'}
                    onClick={() => handleAutoSubmitLead()}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                      transition: 'transform 0.15s',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <span>{leadSubmitStatus === 'submitting' ? '⏳' : '🔒'}</span>
                    <span>{leadSubmitStatus === 'submitting' ? 'Locking in Master Schedule...' : 'Lock In My Inspection Date & Request Callback'}</span>
                  </button>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    Or say <em>"Book it"</em>
                  </span>
                </div>
              )}
            </>
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
          {history.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '160px',
              color: '#94a3b8',
              textAlign: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid rgba(212, 175, 55, 0.25)',
                borderTopColor: '#D4AF37',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>
                Connecting with Christopher Boykin (Certified Master Inspector)...
              </p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                Ask anything about home systems, InterNACHI SOP, instant pricing, or scheduling
              </p>
            </div>
          ) : (
            history.map((msg, index) => {
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
          }))}

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
                Thank you, <strong>{bookingData.name}</strong>! We have logged your tentative inspection request. Our office will contact you at <strong>{bookingData.phone}</strong> within 20 minutes with your official appointment confirmation and inspection agreements to sign. To solidify your appointment on our master calendar, the 50% deposit along with your signed agreements are submitted after receiving our confirmation. The remaining balance is paid after on-site completion before your report is released.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <div>📍 <strong>Address:</strong> {bookingData.address || 'Pending confirmation'}</div>
                <div>📅 <strong>Requested Window:</strong> {bookingData.preferredDate || 'Upcoming Window'} (Sunday by appt only)</div>
                {bookingData.estimatedTotal && (
                  <div>
                    💰 <strong>Total:</strong> ${bookingData.estimatedTotal} &nbsp;|&nbsp; 
                    <span style={{ color: '#D4AF37' }}>50% Deposit to Solidify: ${Math.round(bookingData.estimatedTotal / 2)} (with signed agreement)</span> &nbsp;|&nbsp; 
                    <span>Balance upon completion: ${bookingData.estimatedTotal - Math.round(bookingData.estimatedTotal / 2)}</span>
                  </div>
                )}
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
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '4px 0 6px 0' }}>
                Based on {calculatedQuote.sqft.toLocaleString()} sq ft {calculatedQuote.propertyType}. Includes two-inspector team, aerial drone, and infrared thermal imaging.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px', fontSize: '0.75rem' }}>
                <span style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#fef08a', padding: '3px 8px', borderRadius: '4px' }}>
                  🔒 50% Deposit to Solidify: <strong>${Math.round(calculatedQuote.total / 2)}</strong> (Due with signed agreements after confirmation)
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1', padding: '3px 8px', borderRadius: '4px' }}>
                  📋 Balance (Upon Completion): <strong>${calculatedQuote.total - Math.round(calculatedQuote.total / 2)}</strong> (Due before report release)
                </span>
              </div>
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
            onClick={() => handleSendQuery("What warranties are included? What is covered under your up to $35,000 warranty and InterNACHI Honor Guarantee?")}
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
            🛡️ Up to $35k Warranties
          </button>
          <button
            onClick={() => handleSendQuery("Can you send me your exclusive Foresight vs Hindsight Due Diligence Checklist?")}
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
            📋 Free Checklist
          </button>
          <button
            onClick={() => handleSendQuery("How does Foresight compare to national franchises and discount solo inspectors in Atlanta?")}
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
            ⚖️ vs Competitors
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
            onClick={() => handleToggleAddon('radon', '48-Hour Electronic Radon Testing', 250)}
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
            + Radon ($250)
          </button>
          <button
            onClick={() => handleToggleAddon('termite', 'Termite / WDO Inspection', 125)}
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
            + Termite / WDO ($125+)
          </button>
          <button
            onClick={() => handleToggleAddon('sewer', 'Sewer Scope Camera Inspection', 450)}
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
            + Sewer Scope ($450)
          </button>
          <button
            onClick={() => handleToggleAddon('pool', 'Pool and Spa Inspection', 275)}
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
            + Pool ($275)
          </button>
          <button
            onClick={() => handleToggleAddon('str', 'Short-Term Rental STR Safety Audit', 595)}
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
            + STR Compliance ($595)
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
            aria-label={callState === 'listening' ? 'Stop listening' : callState === 'speaking' ? 'Interrupt Chris' : 'Start speaking with Chris'}
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes waveBar {
          0% { height: 4px; }
          100% { height: 22px; }
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
