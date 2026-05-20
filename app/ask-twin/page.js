'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AskTwin() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hey there! I'm Foresight AI, your premium home inspection assistant. I'm here to give you honest, thorough, and highly clear facts about home systems. What's on your mind today? Are we looking at a new roof, a foundation question, pool systems, or wanting to see how our clear reports are structured?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    let response = "";
    
    // Funnel logic mapping to InterNACHI standards & friendly expert persona
    if (text.includes('report') || text.includes('sample') || text.includes('format') || text.includes('structure') || text.includes('see')) {
      response = "Our reports are designed specifically to be clean, crystal-clear, and incredibly easy to read—especially for first-time buyers! We avoid confusing jargon. Every single finding in our report follows a simple 3-step structure:\n\n" +
                 "1. 🔍 **Observation**: We state exactly what we saw (e.g., 'The water heater's pressure relief valve is missing a discharge pipe').\n" +
                 "2. 💡 **What could this mean**: We explain the real-world risk or impact in plain terms (e.g., 'If the water heater overheats, it could release super-hot water directly onto someone standing nearby, causing severe burns').\n" +
                 "3. 🛠️ **Recommendations**: We specify exactly who needs to evaluate further and perform repairs as needed (e.g., 'Have a licensed plumbing contractor evaluate further and repair as needed').\n\n" +
                 "This way, you aren't just getting a scary checklist—you're getting total understanding so you can negotiate thousands off the home price. Would you like to book an inspection to get your own comprehensive report?";
    } else if (text.includes('roof') || text.includes('shingle') || text.includes('leak')) {
      response = "Ah, the roof! That's your home's main shield. A tiny crack in a shingle or a worn-out seal around a vent pipe can let water sneak right in. Because we use two certified inspectors on every job, we inspect the roof thoroughly (even using drones for high or steep roofs!).\n\n" +
                 "**Observation**: A worn vent boot seal.\n" +
                 "**What this could mean**: Rainwater can leak into your attic and rot the wood decking.\n" +
                 "**Recommendations**: Have a licensed roofing contractor evaluate further and repair as needed.\n\n" +
                 "Let's get your inspection scheduled so we can check your roof in person!";
    } else if (text.includes('foundation') || text.includes('crack') || text.includes('basement')) {
      response = "Foundation cracks can look scary, but don't panic. Many concrete cracks are just normal settling as a house stretches over time. Horizontal cracks or bulging walls are the ones that need quick attention.\n\n" +
                 "**Observation**: A minor hairline concrete crack.\n" +
                 "**What this could mean**: Likely normal settlement, but moisture could seep in over time.\n" +
                 "**Recommendations**: Have a qualified structural engineer or foundation contractor evaluate further and repair as needed.\n\n" +
                 "Only an on-site, dual-inspector look can give you the true picture of your foundation. Shall we book a time?";
    } else if (text.includes('hvac') || text.includes('ac') || text.includes('heat') || text.includes('furnace')) {
      response = "HVAC systems are like the lungs of your house. If the system is struggling or condensation is pooling, it might be working too hard. We check all accessible parts, test temperature splits, and ensure no carbon monoxide is leaking.\n\n" +
                 "**Observation**: Condensate drain line is clogged.\n" +
                 "**What this could mean**: Water could overflow, causing water damage to the ceiling or floor below.\n" +
                 "**Recommendations**: Have a licensed HVAC contractor evaluate further and repair as needed.\n\n" +
                 "Want to check our dynamic quote tool to see the price for your property?";
    } else if (text.includes('termite') || text.includes('wdo') || text.includes('bug') || text.includes('pest') || text.includes('infestation')) {
      response = "Wood-destroying bugs are silent destroyers. They can eat through your home's structural framing without you ever seeing them. We offer specialized termite (WDO) checks in partnership with licensed experts to give you an Official Georgia Wood Infestation Report. Price is tailored to the foundation: slab is $100, basement is $125, crawlspace is $175. It's a smart addition to keep your investment secure!";
    } else if (text.includes('pool') || text.includes('spa') || text.includes('swimming')) {
      response = "A pool is awesome to have, but it can turn into a financial nightmare if the pumps, heaters, or electrical components aren't safe. Our $125 pool add-on covers pumps, filtration lines, shell check, and safety boundaries to make sure it's completely safe and fun!";
    } else if (text.includes('price') || text.includes('cost') || text.includes('quote') || text.includes('how much')) {
      response = "We keep pricing 100% transparent! Standard resale home inspections start at $315, pre-listing pre-checks start at $365, new construction phase checks start at $355, and 11-month builder warranty audits start at $335. You can get an instant, exact quote adjusted for your specific size and age on our quote page!";
    } else {
      response = "That's an excellent question. Every single home has its own unique layout and condition. While I can share general advice, a true safety and value check requires a hands-on visual inspection. With two certified inspectors on every job, we make sure absolutely nothing gets missed. The best next step is to get an instant quote and get us on site!";
    }

    return response;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponseText = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section className="section bg-dark" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-white)' }}>Ask Foresight AI</h1>
          <p style={{ color: 'var(--color-gray-mid)' }}>Expert advice, 24/7. Rooted in InterNACHI Standards.</p>
        </div>

        <div className="glass-dark" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
          {/* Chat Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'relative' }}>
              <img src="/images/inspector_photo.jpg" alt="Christopher Boykin" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-red)' }} />
              <div style={{ position: 'absolute', bottom: '0', right: '0', width: '14px', height: '14px', background: '#10b981', border: '2px solid var(--color-dark)', borderRadius: '50%' }}></div>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-white)', fontSize: '1.125rem', marginBottom: '0.2rem' }}>Foresight AI Assistant</h3>
              <p style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Online & Ready</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '80%', 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-lg)', 
                  background: msg.role === 'user' ? 'var(--color-red)' : 'rgba(255,255,255,0.05)',
                  color: 'var(--color-white)',
                  border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : 'var(--radius-lg)',
                  borderBottomLeftRadius: msg.role === 'ai' ? '4px' : 'var(--radius-lg)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                  {msg.role === 'ai' && (msg.content.includes('quote') || msg.content.includes('estimator') || msg.content.includes('specialty')) && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem' }}>
                      <Link href="/quote" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Get Instant Quote
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '6px' }}>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--color-gray-mid)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--color-gray-mid)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--color-gray-mid)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about homes, roofs, termites, pools, or our report structure..." 
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  background: 'rgba(255,255,255,0.05)', 
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem'
                }} 
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>
                Send
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '0.75rem' }}>
              *This is Foresight AI, an educational tool. Definite assessments require an on-site visual check.
            </p>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}} />
    </section>
  );
}
