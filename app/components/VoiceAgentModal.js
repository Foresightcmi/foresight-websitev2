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
      content: "Thanks for calling Foresight Home Inspections! This is Sarah, your client concierge. How can I help you today? Ask me about our two-inspector standard, $10,000 warranty, instant pricing, or getting on our schedule!"
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [typedInput, setTypedInput] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const conversationLogRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const callStateRef = useRef(callState);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  // Initialize Audio & Speech Recognition support
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Play studio-grade human neural voice (en-US-JennyNeural)
  const playNeuralAudio = useCallback((audioSrc) => {
    if (isMuted || !audioSrc) {
      setCallState('idle');
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.onplay = () => {
        isSpeakingRef.current = true;
        setCallState('speaking');
      };

      audio.onended = () => {
        isSpeakingRef.current = false;
        setCallState('idle');
      };

      audio.onerror = (e) => {
        console.warn('Neural audio playback error:', e);
        isSpeakingRef.current = false;
        setCallState('idle');
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Audio autoplay prevented by browser policy (user tap required):', err);
          isSpeakingRef.current = false;
          setCallState('idle');
        });
      }
    } catch (err) {
      console.warn('Could not play neural audio:', err);
      setCallState('idle');
    }
  }, [isMuted]);

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
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setCallState('idle');
    };

    synthRef.current.speak(utterance);
  }, [isMuted]);

  // Auto-scroll transcript container
  useEffect(() => {
    if (conversationLogRef.current) {
      conversationLogRef.current.scrollTop = conversationLogRef.current.scrollHeight;
    }
  }, [history, interimUserText, callState]);

  // Play Sarah's natural human greeting when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState('idle');
      setMicError(null);
      const timer = setTimeout(() => {
        playNeuralAudio('/audio/sarah-greeting.mp3');
      }, 300);
      return () => clearTimeout(timer);
    } else {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    }
  }, [isOpen, playNeuralAudio]);

  // Stop current speech or playback immediately
  const haltSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    isSpeakingRef.current = false;
  };

  // Start speech recognition with instant visual feedback and error recovery
  const handleStartListening = () => {
    // 1. Instantly stop ongoing audio
    haltSpeech();

    // 2. Instant visual state update (<0ms delay)
    setCallState('listening');
    setMicError(null);
    setInterimUserText('');

    // Optional haptic tap on mobile
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(40); } catch (_) {}
    }

    // 3. Browser speech recognition check
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
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Client Concierge
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                Foresight Phone Assistant &bull; 
                <span style={{ color: callState === 'speaking' ? '#ef4444' : callState === 'listening' ? '#10b981' : '#D4AF37', marginLeft: '5px', fontWeight: 600 }}>
                  {callState === 'speaking' ? 'Speaking...' : callState === 'listening' ? 'Listening...' : callState === 'thinking' ? 'Checking...' : 'Ready'}
                </span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isMuted ? '🔇 Muted' : '🔊 Audio On'}
            </button>

            <button
              onClick={onClose}
              aria-label="Close Voice Assistant"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: '#94A3B8',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              ✕
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
            onClick={callState === 'listening' ? handleStopListening : handleStartListening}
            aria-label={callState === 'listening' ? 'Stop listening' : 'Tap to speak with Sarah'}
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
            title={callState === 'listening' ? 'Click to Stop' : 'Click to Speak'}
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
              ? 'Listening... Speak naturally or tap orb when finished'
              : callState === 'speaking'
              ? "Sarah is speaking (tap orb to interrupt)"
              : callState === 'thinking'
              ? 'Connecting with Foresight...'
              : 'Tap the orb to speak with Sarah'}
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
                  ✓ Inspection Slot Reserved!
                </span>
                <span style={{ fontSize: '0.75rem', background: '#10b981', color: '#0F172A', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  Confirmed
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                Thank you, <strong>{bookingData.name}</strong>! Christopher Boykin and our two-inspector team have your requested inspection slot logged. Our office will call you at <strong>{bookingData.phone}</strong> to confirm access details.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <div>📍 <strong>Address:</strong> {bookingData.address || 'Address on file'}</div>
                <div>📅 <strong>Preferred Date:</strong> {bookingData.preferredDate || 'Earliest slot'} (Sunday by appt only)</div>
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
          {/* Microphone Push-to-Talk Button */}
          <button
            type="button"
            onClick={callState === 'listening' ? handleStopListening : handleStartListening}
            aria-label={callState === 'listening' ? 'Stop listening' : 'Start speaking with Christopher'}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              background: callState === 'listening' ? '#10b981' : '#9B2C2C',
              color: '#ffffff',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: callState === 'listening' ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(155, 44, 44, 0.3)',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            title={callState === 'listening' ? 'Listening... tap to stop' : 'Tap to speak'}
          >
            {callState === 'listening' ? '⏹' : '🎙️'}
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
