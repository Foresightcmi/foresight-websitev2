'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AskTwin() {
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
    
    // Folksy, seasoned expert persona matching InterNACHI & residential construction standards
    if (matchesAny(['report', 'reports', 'sample', 'format', 'structure'])) {
      response = "Now, let's talk about home inspection reports. Many inspectors dump an 80-page PDF on you full of dense, scary technical jargon that leaves you feeling stressed. We don't believe in that. Our reports are clean, simple, and written in plain English, packed with high-resolution photos and video clips.\n\n" +
                 "To keep things perfectly clear and compliant with InterNACHI standards, every single finding follows a simple 3-step structure:\n\n" +
                 "1. 🔍 Observation: We state exactly what we observed (e.g., 'The master bathroom toilet is loose at the floor flange').\n" +
                 "2. 💡 What This Could Mean: We explain the real-world risk or impact in plain terms (e.g., 'Water can seep under the subfloor, rotting the wood framing and leading to structural sagging').\n" +
                 "3. 🛠️ Recommendations: We specify exactly who needs to fix it (e.g., 'Have a licensed plumbing contractor repair and reseal prior to closing').\n\n" +
                 "This clear layout makes it incredibly easy to show the seller exactly what needs attention. Getting us out there to perform a physical inspection is going to save you so much money in the long run. We regularly save our clients thousands of dollars by giving them the precise, undeniable evidence they need to either get the seller to perform upfront repairs before closing or win heavy repair credits at the closing table. The inspection fee itself is a tiny drop in the bucket compared to what you stand to save! Would you like to schedule an inspection with our dual-inspector team?";
    } else if (matchesAny(['radon'])) {
      response = "Let's talk about radon. It's a silent, invisible, completely odorless radioactive gas that comes from the natural breakdown of uranium in Georgia's granite soils. The EPA lists radon as the second leading cause of lung cancer in the United States, and they recommend testing for every home transaction.\n\n" +
                 "Under InterNACHI standards, we highly recommend testing. We use professional 48-hour continuous electronic monitors to track radon levels in the lowest livable area of the home.\n\n" +
                 "🔍 Observation: Radon levels measured above the EPA action limit of 4.0 pCi/L.\n" +
                 "💡 What This Could Mean: Prolonged exposure to elevated radon gas poses a severe long-term respiratory health risk to your family.\n" +
                 "🛠️ Recommendation: Have a certified radon mitigation contractor install a sub-slab depressurization system to safely vent the gas.\n\n" +
                 "Having us perform a radon test saves you serious money in the long run. If we find elevated radon levels, we routinely save our clients thousands of dollars by giving them the leverage to negotiate upfront repairs—requiring the seller to pay for and install the mitigation system upfront (which usually costs $1,500 - $2,500) or secure a direct closing credit so you don't pay a dime. Adding this test to your dual-inspector booking is a massive win for both your health and your wallet!";
    } else if (matchesAny(['termite', 'termites', 'wdo', 'bug', 'bugs', 'pest', 'pests', 'infestation'])) {
      response = "Georgia is prime country for termites. In our warm, damp climate, subterranean termites are highly active and can chew through structural wood studs silently for years without you ever knowing.\n\n" +
                 "At Foresight, we provide a thorough wood-destroying organism (WDO) inspection alongside our standard check. You'll get an Official Georgia Wood Infestation Report, which mortgage lenders often require anyway.\n\n" +
                 "🔍 Observation: Active subterranean termite mud tubes on the crawlspace foundation sill plate.\n" +
                 "💡 What This Could Mean: Termites are actively feeding on the floor joists, threatening the structural integrity of the home.\n" +
                 "🛠️ Recommendation: Have a licensed pest control operator treat the home and evaluate wood damage.\n\n" +
                 "Finding wood-destroying organisms early saves you from catastrophic out-of-pocket structural framing repairs down the road. Getting this inspection done is the ultimate way to save money in the long run. Armed with our official WDO report, we've saved our clients thousands of dollars in negotiations by either requiring the seller to perform upfront termite treatment and structural repairs before closing, or securing direct repair credits so you can have it handled after. It's a total no-brainer to add this WDO check to your dual-inspector booking!";
    } else if (matchesAny(['pool', 'pools', 'spa', 'spas', 'swimming'])) {
      response = "A pool is a wonderful place to spend a hot Georgia summer, but it's also a major liability if something is wrong with the filtration or the electrical system. Water and electricity are a deadly mix, and pool pumps or heaters can be incredibly expensive to replace.\n\n" +
                 "Under InterNACHI guidelines, we check the pool structure, safety barriers (fencing and gates), pumps, filtration lines, heaters, and electrical GFCI safety.\n\n" +
                 "🔍 Observation: The pool light's GFCI breaker fails to trip when tested.\n" +
                 "💡 What This Could Mean: If a short circuit occurs in the pool light, swimmers face a direct risk of severe electrical shock.\n" +
                 "🛠️ Recommendation: Have a licensed electrical contractor replace the pool light GFCI protection immediately.\n\n" +
                 "A failing pool pump or leaking pool heater can easily cost $2,500 to $5,000 to replace. Having us perform a professional pool inspection is designed to save you more money in the long run. We regularly save our clients thousands of dollars by identifying these expensive defects early, allowing them to secure direct seller repair credits or require upfront repairs before closing. Let's get our two certified inspectors out there to check it for you!";
    } else if (matchesAny(['warranty', 'warranties', '11-month', '11 month'])) {
      response = "If you bought a brand-new home within the last year, you're likely coming up on your 1-year builder's warranty expiration. Once that 12th month passes, you are on the hook for any defects the builder left behind!\n\n" +
                 "An 11-Month Warranty Inspection is a smart play. Under InterNACHI guidelines, we do a full structural and mechanical audit to create a builder-ready punch list of issues they must fix under warranty on their dime, not yours.\n\n" +
                 "🔍 Observation: Exterior grading has settled, causing water to pool against the foundation.\n" +
                 "💡 What This Could Mean: Water will eventually seep into your crawlspace or basement, causing structural rot.\n" +
                 "🛠️ Recommendation: Submit this finding to your builder to have them correct the grading under warranty.\n\n" +
                 "An independent 11-month warranty check is the single best way to save money in the long run on a new build. It forces the builder to handle all these repairs on their own dime before your warranty expires, saving you thousands of dollars in out-of-pocket structural and system repairs down the road. Let's get it scheduled before your warranty window closes forever!";
    } else if (matchesAny(['new home', 'new homes', 'new construction', 'new build', 'new builds', 'builder', 'builders', 'pre-drywall', 'construction'])) {
      response = "A brand-new home? Congratulations! But let me tell you a secret from a seasoned pro: never skip an inspection on a new build. I hear folks say, 'Why inspect it? It's brand new and the city code inspector signed off!' Well, city inspectors are overloaded—they might spend 15 minutes on a house. Subcontractors are working fast, and mistakes get covered up by fresh drywall.\n\n" +
                 "We regularly find major framing mistakes, uninsulated attics, HVAC ducts that aren't even hooked up, and grading sloping right back into the foundation. Under InterNACHI standards, we check everything.\n\n" +
                 "🔍 Observation: Main HVAC supply duct in the attic is disconnected from the distribution box.\n" +
                 "💡 What This Could Mean: You'll be paying to air-condition your attic, your system will work twice as hard, and your energy bills will skyrocket.\n" +
                 "🛠️ Recommendation: Have the builder's HVAC contractor reconnect the ductwork prior to closing.\n\n" +
                 "Having us perform an independent inspection on a new build starts at $350 and saves you more money in the long run than almost anything else. We've saved our clients thousands of dollars in out-of-pocket repairs by arming them with the report they need to force the builder to make upfront repairs on their dime before closing, rather than leaving you stuck with the bills later. Let's get our dual-inspector team out there for a Final Walkthrough inspection. Get an instant quote to secure your slot!";
    } else if (matchesAny(['roof', 'roofs', 'shingle', 'shingles', 'chimney', 'gutter', 'gutters', 'attic', 'soffit', 'fascia'])) {
      response = "Well, let's talk about that roof. It's your home's main shield, but it takes a beating from the Georgia sun and storms. A lot of folks think a roof is fine just because it isn't dripping onto their living room couch yet. But under InterNACHI standards, we look for the small stuff before it becomes a disaster—like cracked pipe boots, loose flashing around the chimney, or clogged gutters backing water under the shingles.\n\n" +
                 "When my partner and I go out, we fly high-resolution aerial drones to inspect every single shingle and valley from the safest, most detailed angles.\n\n" +
                 "🔍 Observation: Worn, cracked rubber boot on a plumbing vent pipe.\n" +
                 "💡 What This Could Mean: Rainwater creeps down the pipe, rotting the attic sheathing and ruining your drywall.\n" +
                 "🛠️ Recommendation: Have a licensed roofing contractor evaluate and repair as needed.\n\n" +
                 "A solid roof is a huge negotiation point. Getting us to perform a professional inspection will save you more money in the long run. If we find $5,000 or $10,000 in worn shingles or leaking valleys, we hand you the exact proof you need to either secure upfront repairs on the seller's dime or win heavy repair credits to cover the replacement cost. We've saved our clients thousands of dollars on their purchases. Let's get our dual-inspector team out there to check it. While we're at it, adding our termite check is a smart move!";
    } else if (matchesAny(['foundation', 'foundations', 'crack', 'cracks', 'basement', 'crawlspace', 'settle', 'settling', 'grading'])) {
      response = "Ah, foundation questions. That's the bones of the house! Concrete is almost guaranteed to do two things: get hard and crack. A hairline vertical crack is usually just normal concrete shrinkage. But if we see horizontal cracks, stair-step cracks in brickwork, or bowing walls, that's when we raise a flag.\n\n" +
                 "Under InterNACHI standards, we inspect the foundation, basement, crawlspace, and grading using high-powered lights and digital moisture meters to check for structural shift and hidden rot.\n\n" +
                 "🔍 Observation: A 1/4-inch stair-step crack in the foundation block wall with active moisture seepage.\n" +
                 "💡 What This Could Mean: Soil pressure is pushing against the wall, and improper grading is forcing water through the masonry, risking structural shifting.\n" +
                 "🛠️ Recommendation: Have a qualified structural engineer or foundation specialist evaluate further and repair.\n\n" +
                 "Foundation issues can cost a small fortune, but catching them early gives you massive leverage. Getting us to perform an inspection will save you serious money in the long run. We have literally saved our clients thousands of dollars in out-of-pocket structural fixes by arming them with the leverage to negotiate upfront seller repairs or structural price credits before closing. Let's get our team out there to inspect the home, and add our 48-hour continuous Radon Gas test!";
    } else if (matchesAny(['hvac', 'ac', 'a/c', 'furnace', 'heat', 'heating', 'cooling', 'condensate'])) {
      response = "HVAC systems are the heart and lungs of your home's comfort. Heating and cooling systems are complex, and in Georgia, they work hard. When we inspect them under InterNACHI standards, we check the temperature drop, inspect the furnace burners, look at duct connections, and make sure the condensate water is draining safely away.\n\n" +
                 "🔍 Observation: The AC condensate overflow drain pan in the attic is full of standing water.\n" +
                 "💡 What This Could Mean: The main drain is clogged. If the water overflows, it will rot your attic floor and collapse the ceiling drywall below.\n" +
                 "🛠️ Recommendation: Have a licensed HVAC technician clear the drain line and service the system.\n\n" +
                 "An old, worn-out AC system or cracked furnace heat exchanger can easily cost $6,000 to $10,000 to replace. Spotting these HVAC defects with our professional thermal imaging saves our clients thousands of dollars in out-of-pocket costs. It gives you the precise data needed to negotiate a brand-new system or substantial repair credits from the seller, saving you massive amounts of money in the long run. Let's get our dual-inspector team out today!";
    } else if (matchesAny(['electrical', 'panel', 'wire', 'wiring', 'breaker', 'breakers', 'electric'])) {
      response = "Electrical issues are the number one cause of residential house fires. A home's electrical panel and wiring are things you never want to take for granted. Under InterNACHI standards, we remove the panel cover to check for double-tapped breakers, overheating wires, aluminum branch wiring, and improper grounding.\n\n" +
                 "We also run FLIR thermal cameras on every electrical panel at no extra charge to see if breakers are running dangerously hot.\n\n" +
                 "🔍 Observation: Multiple double-tapped circuit breakers in the main electrical panel.\n" +
                 "💡 What This Could Mean: Overloading the breakers can cause arcing, melting wires, and poses a direct electrical fire hazard.\n" +
                 "🛠️ Recommendation: Have a licensed electrical contractor service the panel and correct the wiring.\n\n" +
                 "Electrical hazards are major safety defects that sellers are almost always forced to address. We routinely save our clients thousands of dollars in the long run by finding double-taps, non-compliant panels, or hot spots before they close. This gives you the leverage to require upfront electrical repairs by a licensed specialist or get substantial repair credits at the closing table. Let's get our dual-inspector team out there to check your panel!";
    } else if (matchesAny(['plumbing', 'pipe', 'pipes', 'water', 'leak', 'leaks', 'drain', 'drains', 'sink', 'toilet', 'faucet', 'shower'])) {
      response = "Plumbing issues are all about water—and water is the enemy of a house. A tiny drip behind a shower wall can cause thousands of dollars in hidden rot and toxic mold before you ever see a spot on the drywall.\n\n" +
                 "Under InterNACHI standards, we run water at every fixture, check for leaks, test water pressure, check water heater safety valves, and inspect visible drain pipes. We also bring electronic moisture detectors and thermal imaging on every job to find hidden leaks.\n\n" +
                 "🔍 Observation: Active moisture detected behind the master shower wall using infrared scanning.\n" +
                 "💡 What This Could Mean: A hidden pipe leak is actively rotting the framing studs and will lead to toxic mold growth if ignored.\n" +
                 "🛠️ Recommendation: Have a licensed plumbing contractor repair the leak and restore the drywall.\n\n" +
                 "Water damage is the costliest hazard in a home. Catching a hidden leak behind a shower wall using our high-tech moisture scanning means you can negotiate a $5,000 repair credit now, rather than facing that huge bill on your own dime later. We've saved our clients thousands of dollars by uncovering these hidden plumbing issues, allowing them to get upfront repairs or negotiated credits. An inspection saves you so much money in the long run and pays for itself many times over. Let's get our Certified Master Inspector-led team scheduled!";
    } else if (matchesAny(['str', 'airbnb', 'vrbo', 'dekalb', 'compliance', 'short term', 'short-term', 'municipality', 'county', 'ordinance'])) {
      response = "Well now, let's talk about short-term rentals—Airbnb, Vrbo, and all the rest. Local governments across Metro Atlanta are stepping up their game to keep things safe and orderly, with surrounding counties (including DeKalb, Fulton, Gwinnett, Cobb, and others) requiring active Short-Term Rental (STR) compliance inspections. We do have a specialized service to assist you, recognizing that every county has slightly different rules!\n\n" +
                 "### 🏡 Host Short-Term Rental (STR) Compliance Assist\n" +
                 "Our service helps hosts prepare their physical properties for local county requirements. While each county's exact list may vary, we assist by inspecting and verifying the standard safety systems that county regulators look for:\n\n" +
                 "1. 🛡️ Life-Safety Verification: Certified testing and placement checks of smoke detectors (minimum one per level and inside every sleeping area) and carbon monoxide alarms (minimum one per level).\n" +
                 "2. 🧯 Fire Safety Equipment: Checking for a visible, accessible fire extinguisher (at least one per level).\n" +
                 "3. 🚪 Emergency Egress: Detailed check of stairs, handrails, guards, and escape routes to guarantee safe emergency exits.\n" +
                 "4. 🪧 Local Contact & Evacuation Signage: Verifying that the mandatory local agent 24-hour contact details and building evacuation maps are posted visibly on-site.\n" +
                 "5. 🚫 Historic Exclusions: Checking for localized historic district restrictions, which can save you from losing non-refundable local filing fees if the property is prohibited.\n\n" +
                 "Pricing starts at our recommended base price of $355 (perfect for standard condos and single-family homes under 2,500 sq. ft.) and adjusts for larger estates.\n\n" +
                 "🔍 Observation: Smoke alarms in the second-floor bedrooms were missing, and the posted local 24-hour agent contact info was missing from the front entryway.\n" +
                 "💡 What This Could Mean: You face immediate rejection in the local county portal, loss of your non-refundable filing fees, or heavy fines for running an uncertified rental.\n" +
                 "🛠️ Recommendation: Have us run a complete dual-inspector compliance audit to verify every safety system and alarm placement before you submit your application.\n\n" +
                 "Since every county has slightly different requirements, contact us today for exact pricing tailored to your property's specific location!";
    } else if (matchesAny(['realtor', 'realtors', 'agent', 'agents', 'supra', 'utility', 'utilities', 'concierge', 'moving'])) {
      response = "Well, let's talk about added conveniences! My partner and I always strive to make the home buying and selling process as smooth and stress-free as possible for both buyers and their hard-working real estate agents. We've lined up two fantastic perks specifically for that:\n\n" +
                 "🔑 For Realtors: Active SUPRA Access\n" +
                 "For the convenience of Metro Atlanta real estate agents, we carry active SUPRA key access for secure lockbox entry. That means agents can skip the drive, avoid waiting around on site, and stay focused on their clients. We handle the opening and secure locking procedures independently and professionally.\n\n" +
                 "🔌 For Buyers: Free Utilities Plus Concierge\n" +
                 "Whether you are moving across town or across the country, all Foresight clients gain complimentary, lifetime access to our premier partner, Utilities Plus (https://utilities-plus.com/our-services/). This is a free, dedicated Utility Concierge Service that handles setting up all your utilities—water, gas, electricity, fiber internet, security systems—fast, easy, and at the absolute best market rates available! It saves you hours of sitting on hold and ensures you get the best deal.\n\n" +
                 "We love going the extra mile to save our clients time and money. Booking an inspection with our CMI-led dual-inspector team is the single best way to get complete peace of mind and simplify your move!";
    } else if (matchesAny(['price', 'prices', 'cost', 'costs', 'quote', 'quotes', 'fee', 'fees', 'pricing', 'how much'])) {
      response = "We believe in honest, transparent pricing based on the actual size and age of your home. Standard resale home inspections and pre-listing seller checks start at $420. 11-month builder warranty audits and new construction final phase walkthrough inspections start at $350.\n\n" +
                 "Here are our rates for specialized add-on services:\n" +
                 "- Short-Term Rental (STR) Compliance Assist: Starts at $355 based on property scale, location, and county rules.\n" +
                 "- Termite & WDO Inspection: $110 when bundled with a home inspection ($150 standalone).\n" +
                 "- Radon Gas Testing: $200+ when combined with a home inspection (using professional 48-hour continuous monitors).\n" +
                 "- Pool & Spa Inspection: $300 flat rate.\n" +
                 "- Sewer Scope Inspection: $400 to check the main lateral sewer line.\n\n" +
                 "Note: Additional complexity fees of $75 apply for each complexity condition present (being 50+ years old, having a crawlspace, or having an unfinished/partial basement). These fees are additive and stack per condition (e.g., a 50+ year old home on a crawlspace adds $150). Host Short-Term Rental (STR) compliance audits bypass these complexity fees entirely!\n\n" +
                 "Adding our high-tech tools (drones, thermal imaging) doesn't cost you a penny extra—it's included in every single package! You can get an exact, instant price tailored to your home on our quote page. Our clients find that the inspection fee is the absolute best money they spend on their purchase, saving them more money in the long run by routinely securing thousands of dollars in negotiations, whether through upfront repairs or closing credits. Let's get you on the schedule!";
    } else {
      response = "That is an excellent and highly specific home system question! As a Certified Master Inspector, I want to make sure you have the exact framework to evaluate this safely and professionally.\n\n" +
                 "When you are dealing with residential systems, they operate as a complete ecosystem—what is happening in one area can have severe, hidden effects elsewhere. Let's look at this through the standard professional InterNACHI 3-step diagnostic lens:\n\n" +
                 "🔍 Observation: Your specific concern requires checking physical indicators such as material age, visible signs of wear, moisture levels, correct clearances, and system installation standards (e.g., proper ventilation, drainage slope, structural spans, or electrical wiring securement).\n\n" +
                 "💡 What This Could Mean: Undetected defects in these systems frequently cause hidden moisture intrusion, active wood rot, high energy bills, or direct life-safety hazards (like electrical fires or shock) before you ever see symptoms in the living area.\n\n" +
                 "🛠️ Recommendation: Have our dual-inspector team perform a physical on-site audit of the property. We will inspect the exact issue using thermal imaging and moisture meters, and advise you if a licensed trade specialist (like a roofing, plumbing, electrical, or HVAC contractor) is required to service or repair the system.\n\n" +
                 "Getting us out there to do a professional physical inspection is the single best way to save you thousands of dollars in the long run. We regularly save our clients thousands of dollars by arming them with the pristine, photographic evidence they need to require upfront seller repairs or secure heavy price credits at the closing table. The inspection fee itself is a tiny drop in the bucket compared to what you stand to save. Let's get our Certified Master Inspector-led dual-inspector team out to check it for you!\n\n" +
                 "Why not hop over to our dynamic quote estimator and see how affordable complete peace of mind can be?";
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
              *Foresight AI is an educational twin of Certified Master Inspector Christopher Boykin. Definite system checks require an on-site audit.
            </p>
          </div>
        </div>
      </div>
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
          .header-badges {
            display: none !important;
          }
        }
      `}} />
    </section>
  );
}
