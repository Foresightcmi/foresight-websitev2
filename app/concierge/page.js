'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import VoiceAgentModal from '../components/VoiceAgentModal';
import { getChrisKnowledgeFallback } from '../../lib/chris-brain-prompt';

export default function ConciergePage() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I am Christopher Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. Welcome to your Live Concierge Consultation. Speak hands-free using the voice button above, or type your property questions or inspection details below—how can I protect your investment today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth');
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/plain') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let isFirstChunk = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            accumulated += chunk;
            if (isFirstChunk) {
              setIsTyping(false);
              setMessages(prev => [...prev, { role: 'ai', content: accumulated.replace(/\*/g, '') }]);
              isFirstChunk = false;
            } else {
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'ai', content: accumulated.replace(/\*/g, '') };
                return copy;
              });
            }
          }
        }

        if (isFirstChunk) {
          setIsTyping(false);
          const fallbackText = getChrisKnowledgeFallback(userMessage.content);
          setMessages(prev => [...prev, { role: 'ai', content: fallbackText.replace(/\*/g, '') }]);
        }
      } else {
        const data = await response.json();
        if (data.response) {
          const sanitizedContent = data.response.replace(/\*/g, '');
          setMessages(prev => [...prev, { role: 'ai', content: sanitizedContent }]);
          setIsTyping(false);
        } else {
          throw new Error('No response field in API data');
        }
      }
    } catch (error) {
      console.warn('Concierge chat API fallback. Error:', error);
      const fallbackText = getChrisKnowledgeFallback(userMessage.content);
      setMessages(prev => [...prev, { role: 'ai', content: fallbackText.replace(/\*/g, '') }]);
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    const fakeEvent = { preventDefault: () => {} };
    setTimeout(() => {
      handleSend(fakeEvent);
    }, 50);
  };

  return (
    <section className="bg-dark" style={{ 
      padding: '2.5rem 0 4rem 0', 
      minHeight: 'calc(100vh - 120px)', 
      background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12), rgba(15, 23, 42, 1))',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ maxWidth: '980px', width: '100%' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ 
            background: 'rgba(212, 175, 55, 0.12)', 
            border: '1px solid rgba(212, 175, 55, 0.35)', 
            color: '#D4AF37', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            padding: '0.4rem 1.1rem', 
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Certified Master Inspector® • Real-Time Due Diligence
          </span>
          <h1 style={{ 
            color: '#ffffff',
            background: 'linear-gradient(135deg, #ffffff 0%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            marginBottom: '0.5rem',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800
          }}>
            Live Concierge Consultation
          </h1>
          <p style={{ color: '#F1F5F9', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.65, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            Speak hands-free or type directly with <strong>Christopher Boykin</strong>, founder &amp; lead Certified Master Inspector®. Get instant quotes, Georgia building code answers, and priority inspection reservations.
          </p>

          {/* Dual Action Buttons */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
                color: '#0F172A',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                transition: 'transform 0.2s',
                fontFamily: "'Outfit', sans-serif"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
              <span style={{ fontSize: '1.3rem' }}>🎙️</span>
              <span>Launch Live Voice Consultation</span>
            </button>
            <Link
              href="/quote"
              className="btn btn-outline"
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontWeight: 600
              }}
            >
              Instant Fee Calculator →
            </Link>
          </div>
        </div>

        {/* Unified Interactive Concierge Console (Speak or Type) */}
        <div style={{ 
          borderRadius: '20px', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.2)',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '1.25rem 1.5rem', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(10, 15, 30, 0.8)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src="/images/Christopher_Boykin.jpg" 
                  alt="Christopher Boykin CMI" 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }} 
                />
                <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '13px', height: '13px', background: '#10b981', border: '2px solid #0F172A', borderRadius: '50%' }}></div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Christopher Boykin</h2>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)', 
                    color: '#0F172A', 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    Certified Master Inspector®
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
                  Live Concierge Consultation &bull; <span style={{ color: '#10b981', fontWeight: 600 }}>🎙️ Speak or 💬 Type</span>
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#D4AF37',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}
              >
                <span>🎙️</span>
                <span>Open Voice Console</span>
              </button>
              <img src="/cmi_logo.png" alt="Certified Master Inspector" style={{ height: '36px', opacity: 0.9 }} />
            </div>
          </div>

          {/* Quick-Prompt Question Chips */}
          <div style={{
            padding: '8px 1.25rem',
            background: 'rgba(212, 175, 55, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            alignItems: 'center'
          }}>
            <span style={{ color: '#D4AF37', fontSize: '0.72rem', whiteSpace: 'nowrap', fontWeight: 700 }}>
              Quick Answers:
            </span>
            {[
              { label: '👥 2-Inspector Standard', q: 'Why do you send two certified inspectors on every inspection?' },
              { label: '🛡️ Up to $35k Warranties', q: 'What warranties and guarantees are included with my inspection?' },
              { label: '📷 Free FLIR & Drones', q: 'Do you include infrared thermal imaging and aerial drone scans?' },
              { label: '💰 Negotiation Leverage', q: 'How does your 24-hour CRL report help me negotiate seller repairs?' },
              { label: '⚖️ vs Competitors', q: 'How does Foresight compare to national franchises and discount solo inspectors?' },
              { label: '📋 InterNACHI SOP', q: 'What are the official InterNACHI Standards of Practice that you inspect?' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(chip.q)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '16px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div 
            ref={chatContainerRef}
            style={{ 
              height: '380px', 
              overflowY: 'auto', 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(10, 15, 30, 0.8))'
            }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                  width: '100%' 
                }}
              >
                <div style={{ 
                  maxWidth: msg.role === 'user' ? '75%' : '88%', 
                  padding: '1rem 1.3rem', 
                  borderRadius: '16px', 
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #9B2C2C 0%, #742A2A 100%)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: msg.role === 'ai' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                  lineHeight: 1.6,
                  fontSize: '0.92rem',
                  whiteSpace: 'pre-wrap',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(155, 44, 44, 0.3)' : 'none'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', animation: 'bounce 1s infinite alternate' }} />
                <span>Christopher Boykin is reviewing building science records...</span>
              </div>
            )}
          </div>

          {/* Typing Form Bar */}
          <form 
            onSubmit={handleSend}
            style={{ 
              padding: '1rem 1.25rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
              background: 'rgba(10, 15, 30, 0.95)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              aria-label="Switch to Hands-Free Voice"
              title="Launch Live Voice Consultation"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
                color: '#0F172A',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              🎙️
            </button>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your property address, square footage, or question..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '0 20px',
                height: '44px',
                borderRadius: '10px',
                border: 'none',
                background: input.trim() ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)',
                color: input.trim() ? '#0F172A' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: input.trim() ? 'pointer' : 'default',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Send
            </button>
          </form>
        </div>

        {/* Trust Badges Bar */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>👥</div>
            <h3 style={{ color: '#ffffff', fontSize: '0.95rem', margin: '0 0 0.3rem 0', fontWeight: 700 }}>2-Inspector Standard</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Every inspection conducted by two certified inspectors for double scrutiny.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🛡️</div>
            <h3 style={{ color: '#ffffff', fontSize: '0.95rem', margin: '0 0 0.3rem 0', fontWeight: 700 }}>Up to $35k Warranties</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>$10,000 Elite Master ($0 ded.) + $25,000 InterNACHI Honor Guarantee.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📷</div>
            <h3 style={{ color: '#ffffff', fontSize: '0.95rem', margin: '0 0 0.3rem 0', fontWeight: 700 }}>Free FLIR &amp; Drone</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>High-res infrared thermal imaging and 4K aerial roof scans included free.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>⚡</div>
            <h3 style={{ color: '#ffffff', fontSize: '0.95rem', margin: '0 0 0.3rem 0', fontWeight: 700 }}>24-Hour Reports</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Create Request List (CRL) for fast, effortless seller repair negotiation addenda.</p>
          </div>
        </div>
      </div>

      {/* Voice Agent Modal for Live Audio Turns */}
      <VoiceAgentModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </section>
  );
}
