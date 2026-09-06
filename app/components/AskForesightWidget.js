'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import VoiceAgentModal from './VoiceAgentModal';

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
    
    if (matchesAny(['two', 'team', 'dual', 'inspectors', 'pair'])) {
      response = "Why do we send two certified inspectors on every job? Most inspection companies send a single solo inspector who spends 4 to 5 exhausting hours on site. Fatigue sets in, and critical defects get missed. At Foresight, we send a dual-inspector team on every single inspection: a lead Certified Master Inspector (CMI) plus another certified professional inspector. One inspects the roof, exterior, and mechanicals while the other thoroughly checks interior circuits, plumbing fixtures, and attic spaces. You get double the scrutiny in half the time (1.5 to 2.5 hours), giving you the most thorough due diligence defense in Georgia.";
    } else if (matchesAny(['warranty', '10000', '10,000', 'guarantee', 'protection'])) {
      response = "Every full home inspection with Foresight includes our complimentary $10,000 Master Protection Warranty with a zero-dollar deductible. This policy protects you after closing on mechanical systems (heating, cooling, plumbing), structural components, major appliances, roofs, and mold. While solo operators offer zero warranty, we back our Certified Master Inspector findings with real financial protection for complete peace of mind.";
    } else if (matchesAny(['thermal', 'flir', 'infrared', 'drone', 'drones', 'camera'])) {
      response = "We include advanced FLIR infrared thermal imaging and high-resolution aerial drone roof scans standard on every full inspection at zero extra charge. Solo inspectors routinely charge an extra $75 to $150 for thermal cameras or mark steep roofs as 'Not Inspected'. We use thermal imaging to detect hidden wall moisture and hot breaker panels, and aerial drones to inspect every single roof shingle safely and thoroughly.";
    } else if (matchesAny(['sop', 'internachi', 'standard', 'standards', 'code of ethics'])) {
      response = "We strictly adhere to and exceed the comprehensive InterNACHI Standards of Practice (SOP), covering all 10 core home systems: roof, exterior, basement/foundation/crawlspace structure, heating, cooling, plumbing, electrical, fireplace, attic/insulation/ventilation, and interior doors/windows. Every finding is structured in our clear 3-step diagnostic format: Observation, What This Could Mean, and Recommendation.";
    } else if (matchesAny(['compare', 'competitor', 'competitors', 'franchise', 'franchises', 'solo', 'best', 'choice', 'why foresight'])) {
      response = "Here is why Metro Atlanta buyers choose Foresight over national franchises and solo discount operators: National franchises charge $450 to $575+ to cover corporate royalties and dispatch random junior hourly techs. Solo discount operators charge $325 to $400, but working alone for 4 hours leads to fatigue, they carry zero warranty, and missing an $8,000 hidden roof leak wipes out any small upfront saving. Foresight gives you two certified inspectors, our $10,000 warranty, and free FLIR thermal/drone scans starting at $345 for single-family homes and $295 for condos. It is the best value and protection in Georgia.";
    } else if (matchesAny(['report', 'reports', 'sample', 'crl', 'create request list'])) {
      response = "Our modern cloud inspection reports exceed InterNACHI standards and are delivered within 24 hours (often same day). Packed with high-resolution photos and video clips, we write in plain English with our 3-step format: 🔍 Observation, 💡 What This Could Mean, and 🛠️ Recommendation. Best of all, our interactive Create Request List (CRL) lets you and your agent check defect items to generate official repair amendment addenda in seconds. Armed with this proof, buyers routinely win thousands of dollars in seller credits or upfront repairs!";
    } else if (matchesAny(['radon'])) {
      response = "Radon is an invisible, odorless radioactive gas released from Georgia granite soils. We recommend professional 48-hour continuous electronic monitoring ($200 flat rate). 🔍 Observation: Radon levels above 4.0 pCi/L. 💡 What This Could Mean: Severe long-term respiratory health hazard. 🛠️ Recommendation: Certified radon mitigation contractor. Finding radon gives you the leverage to require the seller to install a $1,500 to $2,500 mitigation system on their dime before closing!";
    } else if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo'])) {
      response = "Georgia is prime territory for subterranean termites, which can chew through structural floor joists and studs silently. We conduct a complete wood-destroying organism inspection ($110+ bundled rate) and provide the Official Georgia Wood Infestation Report. 🔍 Observation: Active mud tubes. 💡 What This Could Mean: Active structural wood damage. 🛠️ Recommendation: Licensed pest control operator. This check saves you thousands in catastrophic framing repairs.";
    } else if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
      response = "A swimming pool is a wonderful luxury, but faulty pumps, heaters, or underwater lighting can cost $3,000 to $5,000 to replace or create severe shock hazards. We offer a comprehensive Pool & Spa safety inspection ($300 flat rate). 🔍 Observation: Pool light GFCI breaker fails to trip. 💡 What This Could Mean: Direct electrocution risk to swimmers. 🛠️ Recommendation: Licensed electrical contractor. Our pool inspection gives you the leverage to get seller repair credits before closing!";
    } else if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
      response = "Replacing a collapsed underground sewer line or fixing tree root intrusion costs $8,000 to $15,000 out of pocket. Our high-definition Sewer Scope Camera inspection ($425 flat rate) runs a specialized optic camera from your cleanout all the way to the municipal main, verifying the pipe is free of root intrusion, belly dips, or cracked clay. A vital check for homes over 25 years old!";
    } else if (matchesAny(['warranty', '11-month'])) {
      response = "Our 11-Month Warranty Inspection ($350+) gives you an independent builder-ready punch list before your 1-year builder coverage expires. 🔍 Observation: Settled grading causing water to pool against foundation walls. 💡 What This Could Mean: Crawlspace moisture and foundation shift. 🛠️ Recommendation: Builder grading correction under warranty. Forces the builder to fix defects on their dime, saving you thousands!";
    } else if (matchesAny(['new home', 'new construction', 'builder'])) {
      response = "Never skip an inspection on a new build! City code inspectors spend only 10 to 15 minutes on site, and subcontractors work fast. We regularly find uninsulated attics, disconnected HVAC ducts, and improper grading hidden behind fresh drywall. 🔍 Observation: Disconnected HVAC supply duct in attic. 💡 What This Could Mean: Cooling your attic and skyrocketing energy bills. 🛠️ Recommendation: Builder HVAC repair before closing.";
    } else if (matchesAny(['foundation', 'crack', 'basement', 'crawlspace'])) {
      response = "Foundation issues can be costly, but catching them early gives you massive negotiation leverage. 🔍 Observation: Stair-step structural cracks in exterior masonry. 💡 What This Could Mean: Foundation settlement from Georgia soil pressure. 🛠️ Recommendation: Qualified structural engineer evaluation. Negotiate seller repairs or heavy price credits before closing!";
    } else if (matchesAny(['hvac', 'ac', 'furnace', 'heat'])) {
      response = "HVAC replacement easily costs $7,000 to $12,000. 🔍 Observation: Full condensate overflow pan in the attic. 💡 What This Could Mean: Clogged primary drain line risking attic ceiling collapse. 🛠️ Recommendation: Licensed HVAC technician. We use thermal imaging to check temperature splits and ensure systems are heating and cooling properly!";
    } else if (matchesAny(['electrical', 'panel', 'breaker'])) {
      response = "Electrical defects are the primary cause of residential house fires. We inspect panel wiring, overcurrent breakers, and run infrared thermal checks on breakers at zero extra charge. 🔍 Observation: Double-tapped circuit breakers. 💡 What This Could Mean: Overheating and direct house fire hazard. 🛠️ Recommendation: Licensed electrician. Safety defects are mandatory seller repair items!";
    } else if (matchesAny(['plumbing', 'pipe', 'leak', 'sink'])) {
      response = "Water is a home's number one enemy. We run water at every fixture and use electronic moisture meters and FLIR thermal cameras. 🔍 Observation: Active hidden moisture behind the shower wall. 💡 What This Could Mean: Hidden pipe leak rotting structural wall studs and causing mold. 🛠️ Recommendation: Licensed plumber. Finding hidden leaks saves thousands before closing!";
    } else if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term'])) {
      response = "Metro Atlanta counties (including DeKalb, Fulton, Gwinnett, and Cobb) enforce strict Short-Term Rental (STR) safety regulations for Airbnb and Vrbo hosts. We offer our STR Compliance Assist inspection ($355 flat rate, or $595 for complete compliance package) to verify smoke/CO alarms, fire extinguishers, safe egress routes, and posted local agent signage before you submit your application.";
    } else if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge', 'moving'])) {
      response = "We make transactions seamless! For Realtors: Foresight carries active electronic SUPRA key access for secure lockbox entry, so agents don't have to drive out or wait around on site—we handle entry independently! For Buyers: All clients get free lifetime access to Utilities Plus, a premier Utility Concierge that sets up power, water, gas, fiber internet, and security in one quick call at the best available market rates!";
    } else if (matchesAny(['price', 'pricing', 'cost', 'quote', 'how much'])) {
      response = "We believe in 100% transparent pricing based on square footage. Standard buyer home inspections start at $345 ($295 for condos). Specialized add-ons: Termite/WDO ($110+), 48-Hour Continuous Radon Gas ($200), Pool & Spa ($300), Sewer Scope Camera ($425), STR Compliance Assist ($355). Surcharges apply for older homes ($50 for 25-49 yrs, $95 for 50+ yrs) and foundations ($85 crawlspace, $75 basement). Both FLIR thermal imaging and aerial drone roof scans are included free standard on every job!";
    } else {
      response = "Houses are complex systems, and what happens in the attic affects the basement. The absolute best way to protect your investment and save money is to have our Certified Master Inspector-led two person inspection team physically audit the home. We include FLIR thermal imaging, aerial drone scans, and our complimentary $10,000 warranty on every job. Armed with our 24-hour CRL report, our clients routinely save thousands of dollars in closing credits or seller repairs!";
    }

    const checklistOffer = "\n\nBy the way, I have put together a Foresight vs. Hindsight checklist to help you avoid expensive home buying mistakes. Shall I send that to you?";
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
      {/* Floating Action Button Group */}
      {!isOpen && (
        <div 
          className="ask-foresight-launcher-group"
          style={{
            position: 'fixed',
            zIndex: 9999,
            bottom: '24px',
            right: '24px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          {/* Primary Voice Agent Launcher */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            aria-label="Talk Live to Christopher Boykin Certified Master Inspector"
            className="ask-foresight-voice-launcher"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
              color: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '9999px',
              padding: '0.85rem 1.4rem',
              minHeight: '48px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.5), 0 0 0 1px rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.02em',
              transition: 'transform 0.2s',
              animation: 'pulse-glow-gold 3s infinite',
              willChange: 'transform, opacity'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🎙️</span>
            <span>Talk Live (Voice)</span>
          </button>

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
              padding: '0.85rem 1.3rem',
              minHeight: '48px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(211, 47, 47, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.02em',
              transition: 'transform 0.2s',
              willChange: 'transform, opacity'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>💬</span>
            <span>Chat</span>
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
        .ask-foresight-launcher-group {
          bottom: 24px;
          right: 24px;
        }
        @media (max-width: 768px) {
          .ask-foresight-launcher-group {
            bottom: 84px !important;
            right: 16px !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            gap: 8px !important;
          }
          .ask-foresight-voice-launcher {
            padding: 0.7rem 1.1rem !important;
            font-size: 0.85rem !important;
            min-height: 42px !important;
          }
          .ask-foresight-launcher {
            padding: 0.7rem 1.1rem !important;
            font-size: 0.85rem !important;
            min-height: 42px !important;
          }
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
