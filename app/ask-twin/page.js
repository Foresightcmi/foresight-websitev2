'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import VoiceAgentModal from '../components/VoiceAgentModal';

export default function AskTwin() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "I'm Foresight AI, your home inspection and maintenance advisor. What's on your mind today? Let's talk houses!"
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

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    
    // Helper to check if user text contains any of the keywords with proper word boundaries
    const matchesAny = (keywords) => {
      return keywords.some(keyword => {
        const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        return regex.test(text);
      });
    };

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
    } else if (matchesAny(['report', 'reports', 'sample', 'crl', 'create request list', 'format', 'structure'])) {
      response = "Our modern cloud inspection reports exceed InterNACHI standards and are delivered within 24 hours (often same day). Packed with high-resolution photos and video clips, we write in plain English with our 3-step format: 🔍 Observation, 💡 What This Could Mean, and 🛠️ Recommendation. Best of all, our interactive Create Request List (CRL) lets you and your agent check defect items to generate official repair amendment addenda in seconds. Armed with this proof, buyers routinely win thousands of dollars in seller credits or upfront repairs!";
    } else if (matchesAny(['radon'])) {
      response = "Radon is an invisible, odorless radioactive gas released from Georgia granite soils. We recommend professional 48-hour continuous electronic monitoring ($200 flat rate). 🔍 Observation: Radon levels above 4.0 pCi/L. 💡 What This Could Mean: Severe long-term respiratory health hazard. 🛠️ Recommendation: Certified radon mitigation contractor. Finding radon gives you the leverage to require the seller to install a $1,500 to $2,500 mitigation system on their dime before closing!";
    } else if (matchesAny(['termite', 'termites', 'bug', 'bugs', 'pest', 'wdo', 'infestation'])) {
      response = "Georgia is prime territory for subterranean termites, which can chew through structural floor joists and studs silently. We conduct a complete wood-destroying organism inspection ($110+ bundled rate) and provide the Official Georgia Wood Infestation Report. 🔍 Observation: Active mud tubes. 💡 What This Could Mean: Active structural wood damage. 🛠️ Recommendation: Licensed pest control operator. This check saves you thousands in catastrophic framing repairs.";
    } else if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
      response = "A swimming pool is a wonderful luxury, but faulty pumps, heaters, or underwater lighting can cost $3,000 to $5,000 to replace or create severe shock hazards. We offer a comprehensive Pool & Spa safety inspection ($300 flat rate). 🔍 Observation: Pool light GFCI breaker fails to trip. 💡 What This Could Mean: Direct electrocution risk to swimmers. 🛠️ Recommendation: Licensed electrical contractor. Our pool inspection gives you the leverage to get seller repair credits before closing!";
    } else if (matchesAny(['sewer', 'sewer scope', 'drain line', 'pipe camera'])) {
      response = "Replacing a collapsed underground sewer line or fixing tree root intrusion costs $8,000 to $15,000 out of pocket. Our high-definition Sewer Scope Camera inspection ($425 flat rate) runs a specialized optic camera from your cleanout all the way to the municipal main, verifying the pipe is free of root intrusion, belly dips, or cracked clay. A vital check for homes over 25 years old!";
    } else if (matchesAny(['warranty', 'warranties', '11-month', '11 month'])) {
      response = "Our 11-Month Warranty Inspection ($350+) gives you an independent builder-ready punch list before your 1-year builder coverage expires. 🔍 Observation: Settled grading causing water to pool against foundation walls. 💡 What This Could Mean: Crawlspace moisture and foundation shift. 🛠️ Recommendation: Builder grading correction under warranty. Forces the builder to fix defects on their dime, saving you thousands!";
    } else if (matchesAny(['new home', 'new homes', 'new construction', 'new build', 'new builds', 'builder', 'builders', 'pre-drywall', 'construction'])) {
      response = "Never skip an inspection on a new build! City code inspectors spend only 10 to 15 minutes on site, and subcontractors work fast. We regularly find uninsulated attics, disconnected HVAC ducts, and improper grading hidden behind fresh drywall. 🔍 Observation: Disconnected HVAC supply duct in attic. 💡 What This Could Mean: Cooling your attic and skyrocketing energy bills. 🛠️ Recommendation: Builder HVAC repair before closing.";
    } else if (matchesAny(['roof', 'roofs', 'shingle', 'shingles', 'chimney', 'gutter', 'gutters', 'attic', 'soffit', 'fascia'])) {
      response = "Your roof is your home's first line of defense. Under InterNACHI standards, we check every shingle, valley, flashing point, and plumbing boot. For steep or high roofs, we deploy our high-resolution aerial camera drone at no extra charge. 🔍 Observation: Cracked rubber boot on a plumbing vent pipe. 💡 What This Could Mean: Rainwater runs down the pipe into the attic, rotting sheathing and staining drywall. 🛠️ Recommendation: Licensed roofing contractor repair.";
    } else if (matchesAny(['foundation', 'foundations', 'crack', 'cracks', 'basement', 'crawlspace', 'settle', 'settling', 'grading'])) {
      response = "Foundation issues can be costly, but catching them early gives you massive negotiation leverage. 🔍 Observation: Stair-step structural cracks in exterior masonry with active moisture seepage. 💡 What This Could Mean: Foundation settlement from Georgia red clay soil pressure. 🛠️ Recommendation: Qualified structural engineer evaluation. Negotiate seller repairs or heavy price credits before closing!";
    } else if (matchesAny(['hvac', 'ac', 'a/c', 'furnace', 'heat', 'heating', 'cooling', 'condensate'])) {
      response = "HVAC replacement easily costs $7,000 to $12,000. 🔍 Observation: Full condensate overflow pan in the attic. 💡 What This Could Mean: Clogged primary drain line risking attic ceiling collapse. 🛠️ Recommendation: Licensed HVAC technician. We use thermal imaging to check temperature splits and ensure systems are heating and cooling properly!";
    } else if (matchesAny(['electrical', 'panel', 'wire', 'wiring', 'breaker', 'breakers', 'electric'])) {
      response = "Electrical defects are the primary cause of residential house fires. We inspect panel wiring, overcurrent breakers, and run infrared thermal checks on breakers at zero extra charge. 🔍 Observation: Double-tapped circuit breakers. 💡 What This Could Mean: Overheating and direct house fire hazard. 🛠️ Recommendation: Licensed electrician. Safety defects are mandatory seller repair items!";
    } else if (matchesAny(['plumbing', 'pipe', 'pipes', 'water', 'leak', 'leaks', 'drain', 'drains', 'sink', 'toilet', 'faucet', 'shower'])) {
      response = "Water is a home's number one enemy. We run water at every fixture and use electronic moisture meters and FLIR thermal cameras. 🔍 Observation: Active hidden moisture behind the shower wall. 💡 What This Could Mean: Hidden pipe leak rotting structural wall studs and causing mold. 🛠️ Recommendation: Licensed plumber. Finding hidden leaks saves thousands before closing!";
    } else if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term', 'municipality', 'county', 'ordinance'])) {
      response = "Metro Atlanta counties (including DeKalb, Fulton, Gwinnett, and Cobb) enforce strict Short-Term Rental (STR) safety regulations for Airbnb and Vrbo hosts. We offer our STR Compliance Assist inspection ($355 flat rate, or $595 for complete compliance package) to verify smoke/CO alarms, fire extinguishers, safe egress routes, and posted local agent signage before you submit your application.";
    } else if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge', 'moving'])) {
      response = "We make transactions seamless! For Realtors: Foresight carries active electronic SUPRA key access for secure lockbox entry, so agents don't have to drive out or wait around on site—we handle entry independently! For Buyers: All clients get free lifetime access to Utilities Plus, a premier Utility Concierge that sets up power, water, gas, fiber internet, and security in one quick call at the best available market rates!";
    } else if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
      response = "We believe in 100% transparent pricing based on square footage. Standard buyer home inspections start at $345 ($295 for condos). Specialized add-ons: Termite/WDO ($110+), 48-Hour Continuous Radon Gas ($200), Pool & Spa ($300), Sewer Scope Camera ($425), STR Compliance Assist ($355). Surcharges apply for older homes ($50 for 25-49 yrs, $95 for 50+ yrs) and foundations ($85 crawlspace, $75 basement). Both FLIR thermal imaging and aerial drone roof scans are included free standard on every job!";
    } else {
      response = "Houses are complex systems, and what happens in the attic affects the basement. The absolute best way to protect your investment and save money is to have our Certified Master Inspector-led two person inspection team physically audit the home. We include FLIR thermal imaging, aerial drone scans, and our complimentary $10,000 warranty on every job. Armed with our 24-hour CRL report, our clients routinely save thousands of dollars in closing credits or seller repairs!";
    }

    return response;
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

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.response) {
        // Strip any raw asterisks (*) from the AI response to keep plain text perfectly clean in the pre-wrap container
        const sanitizedContent = data.response.replace(/\*/g, '');
        setMessages(prev => [...prev, { role: 'ai', content: sanitizedContent }]);
        setIsTyping(false);
      } else {
        throw new Error('No response field in API data');
      }
    } catch (error) {
      console.warn('Foresight AI chat API call failed. Falling back to local database. Error:', error);
      // Simulate natural thinking delay for fallback
      setTimeout(() => {
        const aiResponseText = generateAIResponse(userMessage.content);
        // Strip any raw asterisks (*) from the fallback response to keep plain text perfectly clean
        const sanitizedFallback = aiResponseText.replace(/\*/g, '');
        setMessages(prev => [...prev, { role: 'ai', content: sanitizedFallback }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <section className="bg-dark" style={{ 
      padding: '2.5rem 0', 
      minHeight: 'calc(100vh - 120px)', 
      background: 'radial-gradient(ellipse at top, rgba(211, 47, 47, 0.15), rgba(17, 24, 39, 1))',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ maxWidth: '950px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ 
            background: 'rgba(211, 47, 47, 0.1)', 
            border: '1px solid rgba(211, 47, 47, 0.3)', 
            color: '#f87171', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            padding: '0.4rem 1rem', 
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            InterNACHI Standard Interactive Guide
          </span>
          <h1 style={{ 
            color: 'var(--color-white)',
            background: 'linear-gradient(135deg, #ffffff 0%, #fca5a5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3rem',
            marginBottom: '0.5rem'
          }}>
            Ask Foresight AI
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Seasoned expert answers on roofing, foundations, termites, radon, and pool systems, with full 3-step InterNACHI breakdown.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
                color: '#0F172A',
                border: 'none',
                padding: '0.8rem 1.8rem',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
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
                padding: '0.8rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            >
              Instant Fee Calculator
            </Link>
          </div>
        </div>

        <div className="glass-dark chat-box-container" style={{ 
          borderRadius: 'var(--radius-xl)', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '1.25rem 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.08)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(10, 15, 30, 0.6)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src="/images/Christopher_Boykin.jpg" 
                  alt="Christopher Boykin" 
                  style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-red)' }} 
                />
                <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: '#10b981', border: '2px solid #111827', borderRadius: '50%' }}></div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ color: 'var(--color-white)', fontSize: '1.2rem', margin: 0 }}>Christopher Boykin</h3>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                    color: '#ffffff', 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    Certified Master Inspector
                  </span>
                </div>
                <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.825rem', margin: '0.1rem 0 0 0' }}>
                  Foresight AI Twin &bull; <span style={{ color: '#10b981', fontWeight: 600 }}>Active & Ready</span>
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="header-badges">
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
              >
                <span>🎙️</span>
                <span>Voice Call</span>
              </button>
              <img src="/cmi_logo.png" alt="Certified Master Inspector" style={{ height: '40px', opacity: 0.9 }} />
              <img src="/cpi_logo.png" alt="Certified Professional Inspector" style={{ height: '40px', opacity: 0.9 }} />
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '1.75rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.2), rgba(17, 24, 39, 0.4))'
            }}
          >
            {messages.map((msg, index) => {
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                    <div style={{ 
                       maxWidth: msg.role === 'user' ? '70%' : '85%', 
                       padding: '1.15rem 1.4rem', 
                       borderRadius: 'var(--radius-lg)', 
                       background: msg.role === 'user' 
                         ? 'linear-gradient(135deg, var(--color-red) 0%, #991b1b 100%)' 
                         : 'rgba(255,255,255,0.03)',
                       color: 'var(--color-white)',
                       border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                       borderBottomRightRadius: msg.role === 'user' ? '4px' : 'var(--radius-lg)',
                       borderBottomLeftRadius: msg.role === 'ai' ? '4px' : 'var(--radius-lg)',
                       lineHeight: '1.65',
                       whiteSpace: 'pre-wrap',
                       boxShadow: msg.role === 'user' 
                         ? '0 10px 20px -5px rgba(211, 47, 47, 0.3)' 
                         : '0 10px 20px -5px rgba(0, 0, 0, 0.2)'
                    }}>
                      {msg.content}
                      
                      {msg.role === 'ai' && (
                        <div style={{ 
                           marginTop: '1.25rem', 
                           paddingTop: '1.25rem', 
                           borderTop: '1px solid rgba(255,255,255,0.08)', 
                           display: 'flex', 
                           gap: '0.75rem',
                           flexWrap: 'wrap'
                        }}>
                          <Link href="/quote" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            Get Instant Quote & Schedule
                          </Link>
                          <Link href="/services" className="btn btn-outline" style={{ 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.85rem', 
                            border: '1px solid rgba(255,255,255,0.15)', 
                            color: 'var(--color-white) !important',
                            background: 'rgba(255,255,255,0.02)'
                          }}>
                            Explore Our Services
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.03)', display: 'flex', gap: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--color-gray-mid)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--color-gray-mid)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--color-gray-mid)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ 
            padding: '1.25rem 1.5rem', 
            borderTop: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(10, 15, 30, 0.6)',
            backdropFilter: 'blur(10px)'
          }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about foundations, roofs, termites, pool safety, or new builds..." 
                style={{ 
                  flex: 1, 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(255,255,255,0.12)', 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }} 
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-red)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(211, 47, 47, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Send
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-gray-mid)', marginTop: '0.75rem' }}>
              Foresight AI is an educational twin of Certified Master Inspector Christopher Boykin. Definite system checks require an on-site audit.
            </p>
          </div>
        </div>
      </div>

      {/* Full Voice Agent Overlay Modal */}
      <VoiceAgentModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .chat-box-container {
          height: 600px;
          max-height: calc(100vh - 350px);
          min-height: 480px;
        }
        @media (max-width: 768px) {
          .chat-box-container {
            height: calc(100vh - 300px) !important;
            max-height: 500px !important;
            min-height: 380px !important;
          }
          .header-badges img {
            display: none !important;
          }
        }
      `}} />
    </section>
  );
}
