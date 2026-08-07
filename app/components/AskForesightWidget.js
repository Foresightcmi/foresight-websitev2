'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

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
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Well hello there! I'm Foresight AI, your home inspection advisor. \n\nWhat home system questions can I answer for you today?"
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
    const text = userText.toLowerCase();
    const matchesAny = (keywords) => keywords.some(k => new RegExp(`\\b${k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(text));

    let response = "";
    
    if (matchesAny(['report', 'reports', 'sample'])) {
      response = "Our home inspection reports exceed InterNACHI standards. We write in plain English with high-resolution photos/video. We use a 3-step format: 🔍 Observation, 💡 What This Could Mean, and 🛠️ Recommendations. Getting a two person inspection team audit saves you thousands of dollars by giving you clear evidence to win closing credits or require seller repairs. Hindsight is expensive; choose Foresight!";
    } else if (matchesAny(['radon'])) {
      response = "Radon is an invisible radioactive gas from Georgia granite soils. We recommend professional continuous monitoring. 🔍 Observation: Radon above 4.0 pCi/L. 💡 What This Could Mean: Severe health hazard. 🛠️ Recommendation: Certified radon mitigation contractor. We routinely save clients thousands of dollars in negotiations by getting sellers to cover mitigation costs upfront!";
    } else if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest'])) {
      response = "Georgia is prime subterranean termite country. We conduct a thorough wood-destroying organism (WDO) inspection and supply the Official Georgia Wood Infestation Report. 🔍 Observation: Active mud tubes. 💡 What This Could Mean: Wood structural damage. 🛠️ Recommendation: Licensed pest operator. This check saves you massive structural repair costs down the road!";
    } else if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
      response = "A pool is a wonderful place to spend a hot Georgia summer, but it's also a major liability if something is wrong with the filtration or the electrical system. Water and electricity are a deadly mix, and pool pumps or heaters can be incredibly expensive to replace.\n\n" +
                 "Under InterNACHI guidelines, we check the pool structure, safety barriers (fencing and gates), pumps, filtration lines, heaters, and electrical GFCI safety.\n\n" +
                 "🔍 **Observation**: The pool light's GFCI breaker fails to trip when tested.\n" +
                 "💡 **What This Could Mean**: If a short circuit occurs in the pool light, swimmers face a direct risk of severe electrical shock.\n" +
                 "🛠️ **Recommendation**: Have a licensed electrical contractor replace the pool light GFCI protection immediately.\n\n" +
                 "A failing pool pump or leaking pool heater can easily cost $2,500 to $5,000 to replace. Having us perform a professional pool inspection is designed to save you more money in the long run. We regularly save our clients thousands of dollars by identifying these expensive defects early, allowing them to secure direct seller repair credits or require upfront repairs before closing. Let's get our two certified inspectors out there to check it for you!";
    } else if (matchesAny(['warranty', '11-month'])) {
      response = "Our 11-Month Warranty Inspection gives you a builder-ready punch list before your 1-year coverage expires. 🔍 Observation: settled grading. 💡 What This Could Mean: Foundation rot. 🛠️ Recommendation: Builder grading correction. Forces builders to fix things on *their* dime, saving you thousands!";
    } else if (matchesAny(['new home', 'new construction', 'builder'])) {
      response = "Mistakes happen fast on new builds and get hidden by drywall. We recommend a final inspection. 🔍 Observation: Disconnected HVAC duct. 💡 What This Could Mean: Skyrocketing energy bills. 🛠️ Recommendation: Builder HVAC correction. Secure repairs before closing!";
    } else if (matchesAny(['foundation', 'crack', 'basement', 'crawlspace'])) {
      response = "Foundation issues can cost a fortune, but catching them early gives you massive leverage. 🔍 Observation: Stair-step structural cracks. 💡 What This Could Mean: Foundation shift. 🛠️ Recommendation: Structural engineer evaluation. Negotiate seller repairs before closing!";
    } else if (matchesAny(['hvac', 'ac', 'furnace', 'heat'])) {
      response = "Heating and AC replacement can easily cost $6,000 to $10,000. 🔍 Observation: Full condensate drain pan. 💡 What This Could Mean: Ceiling collapse. 🛠️ Recommendation: Licensed HVAC tech. We use thermal imaging to spot active defects!";
    } else if (matchesAny(['electrical', 'panel', 'breaker'])) {
      response = "We inspect panel wiring and run infrared checks on breakers at no extra charge. 🔍 Observation: Double-tapped breakers. 💡 What This Could Mean: House fire hazard. 🛠️ Recommendation: Licensed electrician. Safety defects are major seller repair requirements!";
    } else if (matchesAny(['plumbing', 'pipe', 'leak', 'sink'])) {
      response = "Water is a home's worst enemy. We use electronic moisture tools and thermal imaging. 🔍 Observation: Hidden wall leak. 💡 What This Could Mean: Structural rot and mold. 🛠️ Recommendation: Licensed plumber. Spotting hidden leaks pays for the inspection fee many times over!";
    } else if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term', 'ordinance'])) {
      response = "Surrounding Atlanta counties require active Short-Term Rental (STR) compliance safety checks for Airbnb/Vrbo hosts. We offer standard safety compliance audits at a flat rate of $595 to verify smoke and CO detectors, fire extinguishers, exit route safety, and required entryway signage. Contact us for your specific county checklist!";
    } else if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge', 'moving'])) {
      response = "We make moves easy! For Realtors: Foresight carries active **SUPRA key access** for secure lockbox entry, so agents don't need to drive out or wait around on site—we handle entry independently! For Buyers: All our clients get free access to **Utilities Plus** (https://utilities-plus.com/our-services/), a premier Utility Concierge Service that gets power, gas, water, internet, and security systems set up fast, easy, and at the best market rates available, whether moving across town or the country!";
    } else if (matchesAny(['price', 'pricing', 'cost', 'quote'])) {
      response = "Standard buyer home inspections start at $345 ($295 for condos). Pre-listing seller inspections start at $365, 11-month builder warranty inspections start at $335, and new construction inspections start at $375. Specialized services: STR Compliance Inspection ($595 flat). Add-ons: Termite/WDO ($100 Crawlspace / $125 Slab), Radon ($250), Pool ($275), Sewer scope ($450), Mold Inspection w/ Lab ($450), Indoor Air Quality ($350). Surcharges: 25-50 yrs ($75), 50+ yrs Vintage/Historic ($125), Crawlspace ($50), Basement ($75). Drones and FLIR thermal imaging are included free standard on every job!";
    } else {
      response = "Houses are complex systems—what happens in the attic affects the basement. The absolute best way to save money and protect your investment is to get our two person inspection team team out for a physical, high-tech audit. We regularly save our clients thousands of dollars by providing clear evidence to negotiate seller credits or repairs. The inspection fee pays for itself!";
    }

    const checklistOffer = "\n\nBy the way, I’ve put together a \"Foresight vs. Hindsight\" checklist to help you avoid expensive mistakes. Shall I send that to you?";
    return response + checklistOffer;
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
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error(`API returned status ${response.status}`);

      const data = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
        setIsTyping(false);
      } else {
        throw new Error('No response field in API data');
      }
    } catch (error) {
      console.warn('Gemini chat API failed, using fallback database. Error:', error);
      setTimeout(() => {
        const aiResponseText = generateAIResponse(userMessage.content);
        setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);
        setIsTyping(false);
      }, 800);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #d32f2f 0%, #991b1b 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.85rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(211, 47, 47, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.02em',
            transition: 'transform 0.2s, box-shadow 0.2s',
            animation: 'pulse-glow 3s infinite'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>💬</span>
          <span>Ask Foresight AI</span>
        </button>
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
                <img 
                  src="/images/Christopher_Boykin.jpg" 
                  alt="Christopher Boykin" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #d32f2f', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#10b981', border: '1.5px solid #111827', borderRadius: '50%' }}></div>
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', margin: 0, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Christopher Boykin</h4>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '1px 0 0 0' }}>Certified Master Inspector</p>
              </div>
            </div>
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

      {/* Global CSS Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
          0% { box-shadow: 0 10px 25px -5px rgba(211, 47, 47, 0.4), 0 0 0 0px rgba(211, 47, 47, 0.4); }
          70% { box-shadow: 0 10px 25px -5px rgba(211, 47, 47, 0.4), 0 0 0 8px rgba(211, 47, 47, 0); }
          100% { box-shadow: 0 10px 25px -5px rgba(211, 47, 47, 0.4), 0 0 0 0px rgba(211, 47, 47, 0); }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @media (max-width: 480px) {
          .glass-chat-widget {
            width: calc(100% - 32px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}} />
    </>
  );
}
