'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import VoiceAgentModal from './VoiceAgentModal';
import { getChrisKnowledgeFallback } from '../../lib/chris-brain-prompt';

// Inline Glassmorphic Lead Capture Form for Widget
function WidgetLeadForm({ onSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        if (onSubmitted) onSubmitted(name, email);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        padding: '1rem 1.2rem',
        borderRadius: '8px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        background: 'rgba(16, 185, 129, 0.05)',
        width: '100%',
        margin: '0.4rem 0',
        backdropFilter: 'blur(5px)'
      }}>
        <h5 style={{ color: '#10b981', margin: '0 0 0.3rem 0', fontSize: '0.95rem', fontWeight: 600 }}>
          ✓ Request Received!
        </h5>
        <p style={{ color: 'white', margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
          Thank you, <strong>{name}</strong>! Part 1 of your checklist has been sent to <strong>{email}</strong>. 
          <br /><br />
          <em>"Hindsight is expensive; choose Foresight!"</em>
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.2rem',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(255, 255, 255, 0.03)',
      width: '100%',
      margin: '0.4rem 0',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(5px)'
    }}>
      <h5 style={{ color: 'white', margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 600 }}>
        Get the "Foresight vs. Hindsight" Checklist
      </h5>
      <p style={{ color: '#9ca3af', margin: '0 0 0.8rem 0', fontSize: '0.75rem', lineHeight: '1.4' }}>
        Hindsight is expensive; choose Foresight to secure your future.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Full Name *" 
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
        <div>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email Address *" 
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
        <div>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="Phone Number (Optional)" 
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
        {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>⚠️ {error}</p>}
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.6rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {loading ? 'Sending...' : 'Send Me the Checklist'}
        </button>
      </form>
    </div>
  );
}

export default function AskForesightWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isBalloonDismissed, setIsBalloonDismissed] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm Chris Boykin, founder and lead Certified Master Inspector at Foresight Home Inspections. \n\nWhat home system or inspection questions can I answer for you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef(null);

  const handleAcceptChecklist = () => {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: 'Yes, please send it!' },
      { role: 'ai', type: 'lead-form', content: 'Please fill out the form.' }
    ]);
  };

  const handleDeclineChecklist = () => {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: 'No, thank you.' },
      { role: 'ai', content: 'No problem at all! Let me know if you have any other questions about your home. Hindsight is expensive; choose Foresight to secure your future!' }
    ]);
  };

  const generateAIResponse = (userText) => {
    const baseResponse = getChrisKnowledgeFallback(userText);
    const checklistOffer = "\n\nBy the way, I have put together a Foresight vs. Hindsight checklist to help you avoid expensive home buying mistakes. Shall I send that to you?";
    return baseResponse + checklistOffer;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
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

      if (!response.ok) throw new Error(`API returned status ${response.status}`);

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/plain') && response.body) {
        // Prepare empty AI message slot to stream tokens directly into
        setMessages(prev => [...prev, { role: 'ai', content: '' }]);
        setIsTyping(false);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            accumulated += chunk;
            setMessages(prev => {
              const copy = [...prev];
              copy[copy.length - 1] = { role: 'ai', content: accumulated.replace(/\*/g, '') };
              return copy;
            });
          }
        }

        if (!accumulated.trim()) {
          const aiResponseText = generateAIResponse(userMessage.content);
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'ai', content: aiResponseText.replace(/\*/g, '') };
            return copy;
          });
        }
      } else {
        const data = await response.json();
        if (data.response) {
          setMessages(prev => [...prev, { role: 'ai', content: data.response.replace(/\*/g, '') }]);
          setIsTyping(false);
        } else {
          throw new Error('No response field in API data');
        }
      }
    } catch (error) {
      console.warn('Gemini chat API failed, using fallback database. Error:', error);
      const aiResponseText = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText.replace(/\*/g, '') }]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  return (
    <>
      {/* Floating Action Button Group (CueVue-style AI LiveRep Avatar Bubble + Speech Balloon + Chat) */}
      {!isOpen && !isVoiceOpen && (
        <div 
          className="ask-foresight-launcher-group"
          style={{
            position: 'fixed',
            zIndex: 9999,
            bottom: '24px',
            right: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Animated Speech Balloon Invitation */}
          {!isBalloonDismissed && (
            <div 
              className="liverep-speech-balloon"
              onClick={() => setIsVoiceOpen(true)}
              style={{
                position: 'absolute',
                bottom: '84px',
                right: '0',
                background: 'linear-gradient(135deg, rgba(20, 30, 48, 0.98) 0%, rgba(10, 17, 30, 0.98) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '16px',
                padding: '10px 14px',
                width: '270px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15)',
                color: '#ffffff',
                zIndex: 10000,
                cursor: 'pointer',
                animation: 'balloonFloat 3s ease-in-out infinite alternate',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9rem' }}>👋</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>
                    Christopher Boykin (CMI®)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBalloonDismissed(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0 2px'
                  }}
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                Hi! Tap to speak with me live. I can answer building science questions &amp; auto-calculate your instant quote.
              </p>
              <div style={{
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Tap to talk live (Hands-Free)
              </div>
              {/* Balloon tail pointer */}
              <div style={{
                position: 'absolute',
                bottom: '-7px',
                right: '30px',
                width: '12px',
                height: '12px',
                background: '#0a111e',
                borderRight: '1px solid rgba(212, 175, 55, 0.45)',
                borderBottom: '1px solid rgba(212, 175, 55, 0.45)',
                transform: 'rotate(45deg)'
              }} />
            </div>
          )}

          {/* Primary LiveRep Circular Avatar Launcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsVoiceOpen(true)}
              aria-label="Talk Live to Christopher Boykin Certified Master Inspector"
              className="ask-foresight-voice-launcher"
              style={{
                width: '66px',
                height: '66px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.5)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseAvatarRing 2.5s infinite',
                transition: 'transform 0.2s',
                outline: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/images/Christopher_Boykin.webp"
                aria-label="Christopher Boykin, Certified Master Inspector video avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none'
                }}
              >
                <source src="/videos/chris-avatar-office-loop.mp4" type="video/mp4" />
                <img
                  src="/images/Christopher_Boykin.webp"
                  alt="Christopher Boykin, Certified Master Inspector"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </video>
              {/* Green Live indicator badge */}
              <span style={{
                position: 'absolute',
                bottom: '-3px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#10b981',
                color: '#0F172A',
                fontSize: '0.58rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '8px',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff', animation: 'blink 1.2s infinite' }} />
                LIVE CMI®
              </span>
            </button>
          </div>

          {/* Secondary Chat Launcher */}
          <button 
            onClick={() => setIsOpen(true)}
            aria-label="Ask Foresight AI Digital Twin assistant"
            className="ask-foresight-launcher"
            style={{
              background: 'linear-gradient(135deg, #d32f2f 0%, #991b1b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.65rem 1.1rem',
              minHeight: '44px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(211, 47, 47, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.02em',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <span className="launcher-chat-text">Chat</span>
          </button>
        </div>
      )}

      {/* Expanded Glassmorphic Chat Drawer */}
      {isOpen && (
        <div 
          className="glass-chat-widget"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '550px',
            zIndex: 9999,
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            animation: 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(10, 15, 30, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <video 
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/images/Christopher_Boykin.webp"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #d32f2f', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} 
                >
                  <source src="/videos/chris-avatar-office-loop.mp4" type="video/mp4" />
                  <img 
                    src="/images/Christopher_Boykin.webp" 
                    alt="Christopher Boykin" 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #d32f2f', objectFit: 'cover' }} 
                  />
                </video>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#10b981', border: '1.5px solid #111827', borderRadius: '50%' }}></div>
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', margin: 0, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Christopher Boykin</h4>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '1px 0 0 0' }}>Certified Master Inspector</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsVoiceOpen(true);
                }}
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Switch to Hands-Free Live Voice Call"
              >
                <span>🎙️</span>
                <span>Voice</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Message List */}
          <div 
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.2), rgba(17, 24, 39, 0.4))'
            }}
          >
            {/* Top Voice Invitation Banner */}
            <div 
              onClick={() => {
                setIsOpen(false);
                setIsVoiceOpen(true);
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🎙️</span>
                <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>
                  Hands-Free Voice Consultation
                </span>
              </div>
              <span style={{
                background: '#D4AF37',
                color: '#0F172A',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                Talk Live
              </span>
            </div>

            {messages.map((msg, index) => {
              if (msg.type === 'lead-form') {
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'flex-start', margin: '0.3rem 0', width: '100%' }}>
                    <WidgetLeadForm onSubmitted={() => {}} />
                  </div>
                );
              }

              const isLastMessage = index === messages.length - 1;
              const containsChecklistOffer = msg.role === 'ai' && msg.content && 
                msg.content.includes('Foresight vs. Hindsight') && 
                msg.content.includes('Shall I send that to you?');

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                    <div style={{
                      maxWidth: msg.role === 'user' ? '75%' : '85%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #d32f2f 0%, #991b1b 100%)' 
                        : 'rgba(255,255,255,0.03)',
                      color: 'white',
                      border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                      borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(211, 47, 47, 0.2)' : 'none'
                    }}>
                      {msg.content}
                    </div>
                  </div>

                  {containsChecklistOffer && isLastMessage && (
                    <div style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      gap: '0.5rem',
                      alignSelf: 'flex-start',
                      marginLeft: '0.25rem'
                    }}>
                      <button 
                        onClick={handleAcceptChecklist}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}
                      >
                        👍 Yes, send it!
                      </button>
                      <button 
                        onClick={handleDeclineChecklist}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}
                      >
                        👎 No, thanks
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', gap: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="typing-dot" style={{ width: '6px', height: '6px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                  <div className="typing-dot" style={{ width: '6px', height: '6px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ width: '6px', height: '6px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(10, 15, 30, 0.6)'
          }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me home inspection questions..." 
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.85rem'
                }} 
              />
              <button 
                type="submit" 
                style={{
                  padding: '0 1rem',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Voice Agent Overlay Modal */}
      <VoiceAgentModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Global CSS Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
          0% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 0.95; }
        }
        @keyframes pulse-glow-gold {
          0% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.4); }
          50% { transform: scale(1.04); box-shadow: 0 14px 30px -5px rgba(212, 175, 55, 0.7); }
          100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.4); }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes balloonFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
        @keyframes pulseAvatarRing {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 10px 30px rgba(0, 0, 0, 0.5); }
          70% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0), 0 10px 30px rgba(0, 0, 0, 0.5); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0), 0 10px 30px rgba(0, 0, 0, 0.5); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .ask-foresight-launcher-group {
          bottom: 24px;
          right: 24px;
        }
        @media (max-width: 768px) {
          .ask-foresight-launcher-group {
            bottom: 68px !important;
            right: 12px !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
          }
          .ask-foresight-voice-launcher {
            width: 52px !important;
            height: 52px !important;
            padding: 2px !important;
          }
          .liverep-speech-balloon {
            width: 230px !important;
            bottom: 68px !important;
            right: 0 !important;
            padding: 8px 10px !important;
          }
          .ask-foresight-launcher {
            padding: 0 10px !important;
            min-height: 38px !important;
            height: 38px !important;
            border-radius: 9999px !important;
            font-size: 0.78rem !important;
          }
          .glass-chat-widget {
            width: calc(100vw - 20px) !important;
            max-width: 440px !important;
            height: calc(100vh - 88px) !important;
            max-height: 560px !important;
            bottom: 68px !important;
            right: 10px !important;
            left: 10px !important;
            margin: 0 auto !important;
            border-radius: 16px !important;
          }
        }
      `}} />
    </>
  );
}
