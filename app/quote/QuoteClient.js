'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ValueComparison = dynamic(() => import('../components/ValueComparison'), { ssr: true });
export default function QuoteClient({ showValueComparison = true }) {
  const [propertyType, setPropertyType] = useState('single-family'); // 'single-family', 'condo'
  const [serviceType, setServiceType] = useState('buyer'); // 'buyer', 'seller', 'new-construction', 'warranty', 'str'
  const [sqft, setSqft] = useState(2000);
  const [foundation, setFoundation] = useState('slab'); // 'slab', 'basement', 'crawlspace'
  const [ageTier, setAgeTier] = useState('under-25'); // 'under-25', '25-49', 'over-50'
  
  const [addons, setAddons] = useState({
    radon: false,
    termite: false,
    pool: false,
    sewer: false,
    lowFlow: false,
    buildfax: false
  });

  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadStatus, setLeadStatus] = useState('idle'); // idle, submitting, success, error
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Parse URL parameters for initial states
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      const serviceParam = params.get('service');
      if (serviceParam === 'str' || typeParam === 'str') {
        setServiceType('str');
      }
    }
  }, []);

  // Calculations logic
  const calculateTotal = () => {
    let base;
    
    if (serviceType === 'str') {
      base = 355; // Keep base for STR compliance
    } else if (serviceType === 'condo') {
      const parsedSqft = Number(sqft);
      if (parsedSqft <= 1000) base = 295;
      else base = 325; // 1001-1800
    } else {
      // Pre-Purchase Buyer Home Inspection tiered pricing from fee schedule
      const parsedSqft = Number(sqft);
      if (parsedSqft <= 1000) base = 345;
      else if (parsedSqft <= 1500) base = 375;
      else if (parsedSqft <= 2000) base = 410;
      else if (parsedSqft <= 2500) base = 435;
      else if (parsedSqft <= 3000) base = 465;
      else if (parsedSqft <= 3500) base = 485;
      else if (parsedSqft <= 4000) base = 500;
      else if (parsedSqft <= 4500) base = 555;
      else if (parsedSqft <= 5000) base = 595;
      else base = 635; // 5001-5500+
    }
    
    let extra = 0;

    // Flat Property Age Surcharges: Under 25 = +$0, 25-49 = +$50, 50+ = +$95
    // Bypassed for STR Compliance Assist safety audits to keep pricing flat
    if (serviceType !== 'str') {
      if (ageTier === '25-49') {
        extra += 50;
      } else if (ageTier === 'over-50') {
        extra += 95;
      }
    }

    // Additional Complexity Fees: $85 for crawlspace, $75 for unfinished/partial basement. These stack.
    if (propertyType === 'single-family' && serviceType !== 'str') {
      if (foundation === 'crawlspace') {
        extra += 85;
      }
      if (foundation === 'basement') {
        extra += 75;
      }
    }

    // Addons
    if (addons.radon) extra += 200; // Continuous monitor sub-contracted rate
    if (addons.pool) extra += 300;  // Pool/spa flat rate
    if (addons.sewer) extra += 425; // Sewer scope camera inspection
    if (addons.lowFlow) extra += 125; // DeKalb low flow compliance
    if (addons.buildfax) extra += 15; // Property permit report
    if (addons.termite) extra += 110; // Termite/WDO bundled rate

    return { total: base + extra, isCustom: false };
  };

  const { total, isCustom } = calculateTotal();

  // Calculate potential negotiation leverage dynamically based on inspection details
  const calculateNegotiatingLeverage = () => {
    let minLeverage = 2000;
    let maxLeverage = 6000;

    // Scale by size/price range using the 0.14 rate
    const multiplier = (Math.max(1000, Number(sqft)) * 0.14) / 350;
    minLeverage = Math.round(minLeverage * multiplier);
    maxLeverage = Math.round(maxLeverage * multiplier);

    // Scale by age tier
    if (ageTier === '25-49') {
      minLeverage += 1000;
      maxLeverage += 3000;
    } else if (ageTier === 'over-50') {
      minLeverage += 2000;
      maxLeverage += 6000;
    }

    // Adjust by service type
    if (serviceType === 'buyer') {
      minLeverage = Math.round(minLeverage * 1.25);
      maxLeverage = Math.round(maxLeverage * 1.35);
    } else if (serviceType === 'new-construction') {
      minLeverage = Math.round(minLeverage * 0.95);
      maxLeverage = Math.round(maxLeverage * 1.15);
    } else if (serviceType === 'warranty') {
      minLeverage = Math.round(minLeverage * 0.85);
      maxLeverage = Math.round(maxLeverage * 1.05);
    }

    // Adjust by add-ons
    if (addons.radon) {
      minLeverage += 1500;
      maxLeverage += 2500;
    }
    if (addons.pool) {
      minLeverage += 2000;
      maxLeverage += 6000;
    }
    if (addons.termite) {
      minLeverage += 800;
      maxLeverage += 3000;
    }

    // Round clean to nearest 100
    return {
      min: Math.max(1000, Math.round(minLeverage / 100) * 100),
      max: Math.max(3000, Math.round(maxLeverage / 100) * 100)
    };
  };

  const leverage = calculateNegotiatingLeverage();

  const handleAddonToggle = (addon) => {
    setAddons(prev => ({ ...prev, [addon]: !prev[addon] }));
  };

  const handleHoldSlot = async (e) => {
    e.preventDefault();
    setLeadStatus('submitting');
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: leadName, email: leadEmail, phone: leadPhone })
      });
      if (res.ok) {
        setLeadStatus('success');
      } else {
        setLeadStatus('error');
      }
    } catch (err) {
      setLeadStatus('error');
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "potentialAction": {
              "@type": "QuoteAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.fhinspectionsatl.com/quote?type={propertyType}&service={serviceType}",
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              },
              "result": {
                "@type": "PriceSpecification",
                "priceCurrency": "USD"
              }
            }
          })
        }}
      />
      <section className="section bg-gray-light">
      <div className="container">
        <div className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h2 className="slogan-heading-light">
            &ldquo;Hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <h1>Foresight Pricing Estimator</h1>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0' }}>
            Instant, direct, and completely transparent quotes. Based directly on our registered local service fees.
          </p>
        </div>

        <div style={{ 
          background: 'rgba(211, 47, 47, 0.03)', 
          border: '1px solid rgba(211, 47, 47, 0.12)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.25rem 2rem', 
          marginBottom: '3rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto 3rem',
          boxShadow: 'var(--shadow-sm)'
        }} className="savings-banner">
          <div style={{ fontSize: '2rem' }}>💡</div>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
            <strong>The Inspection Pays for Itself:</strong> Getting a professional physical inspection is designed to <strong>save you more money in the long run</strong>. We regularly save our clients thousands of dollars on their home purchases—either by forcing the seller/builder to make critical <strong>upfront repairs</strong> before you close, or by using our master-level report to negotiate substantial closing <strong>repair credits</strong>.<br /><br />
            <strong>⚡ 100% Instant Transparency:</strong> We believe in saving you time and stress. Unlike other companies that hide pricing behind manual, delayed &ldquo;quote request&rdquo; forms to capture your email, Foresight provides exact, instant flat-rate pricing based directly on our registered local service fees. Calculate your quote below and book online instantly!
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
          <div className="card">
            <h2 style={{ marginBottom: '2rem' }}>1. Property Type</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                className={`btn ${propertyType === 'single-family' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setPropertyType('single-family')}
              >
                Home / Townhouse
              </button>
              <button 
                className={`btn ${propertyType === 'condo' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setPropertyType('condo')}
              >
                Condo Unit
              </button>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>2. Inspection Service</h2>
            <div className="form-group">
              <select 
                className="form-control" 
                value={serviceType} 
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="buyer">Pre-Purchase Buyer Inspection (2 Inspectors)</option>
                {propertyType === 'single-family' && <option value="new-construction">New Construction Inspection</option>}
                <option value="seller">Pre-Listing Seller Inspection</option>
                <option value="warranty">11-Month Warranty Inspection</option>
                <option value="str">Short-Term Rental (STR) Compliance Assist</option>
              </select>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>3. Finished / Heated Size</h2>
            <div className="form-group">
              <label className="form-label">Total Heated Square Footage</label>
              <input 
                type="number"
                min="100"
                step="10"
                className="form-control"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                placeholder="e.g. 2000"
              />
            </div>

            {serviceType === 'str' && (
              <div style={{ 
                background: 'rgba(211, 47, 47, 0.03)', 
                border: '1px dashed rgba(211, 47, 47, 0.2)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem', 
                marginBottom: '2rem',
                fontSize: '0.875rem', 
                color: 'var(--color-gray-dark)', 
                lineHeight: 1.5 
              }}>
                <strong>📋 Short-Term Rental (STR) Compliance Assist:</strong>
                <p style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '0.825rem', color: 'var(--color-gray-dark)', lineHeight: 1.4 }}>
                  Surrounding Atlanta counties require strict compliance. While exact rules vary by county, our service assists hosts by inspecting standard safety benchmarks:
                </p>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Smoke detector placement & functional testing (each level & sleeping area).</li>
                  <li>Carbon monoxide alarm placement & testing (minimum 1 per level).</li>
                  <li>Visible and accessible fire extinguisher safety checks (minimum 1 per level).</li>
                  <li>Emergency exit route and egress safety evaluations.</li>
                  <li>Posted local 24-hour agent contact & evacuation map signage checks.</li>
                  <li>Pre-screening to help you identify county-specific application parameters.</li>
                </ul>
              </div>
            )}

            {propertyType === 'single-family' && (
              <>
                <h2 style={{ marginBottom: '1.5rem' }}>4. Foundation Details</h2>
                <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'slab'} onChange={() => setFoundation('slab')} />
                    Slab
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'basement'} onChange={() => setFoundation('basement')} />
                    Unfinished/Partial Basement *
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'crawlspace'} onChange={() => setFoundation('crawlspace')} />
                    Crawlspace *
                  </label>
                </div>
              </>
            )}

            <>
              <h2 style={{ marginBottom: '1.5rem' }}>5. Age of Property</h2>
              <div className="form-group">
                <label className="form-label">Property Construction Age</label>
                <select 
                  className="form-control"
                  value={ageTier}
                  onChange={(e) => setAgeTier(e.target.value)}
                >
                  <option value="under-25">Under 25 Years Old</option>
                  <option value="25-49">25 – 49 Years Old {serviceType !== 'str' && '(+ $50 Age Surcharge)'}</option>
                  <option value="over-50">50+ Years Old {serviceType !== 'str' && '(+ $95 Historical Surcharge)'}</option>
                </select>
              </div>
            </>

            {propertyType === 'single-family' && serviceType !== 'str' && (
              <div style={{ 
                background: 'rgba(211, 47, 47, 0.04)', 
                border: '1px dashed rgba(211, 47, 47, 0.15)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.75rem 1rem', 
                marginBottom: '2rem',
                fontSize: '0.825rem', 
                color: 'var(--color-gray-dark)', 
                lineHeight: 1.45 
              }}>
                ℹ️ <strong>* Additional Complexity Fees:</strong> An additional <strong>$85 fee</strong> is added for a crawlspace and <strong>$75</strong> for an unfinished/partial basement. These fees stack if both conditions are present.
              </div>
            )}

            <>
              <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>6. Specialized Services & Add-ons</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.radon} 
                    onChange={() => handleAddonToggle('radon')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Radon Gas Testing (+ $200+)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Continuous 48-hour professional electronic monitoring (when combined with a home inspection).</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.termite} 
                    onChange={() => handleAddonToggle('termite')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>
                      Termite & WDO Inspection (+ $110)
                    </span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>
                      Generates Official Georgia Wood Infestation Report ($110 bundled / $150 standalone).
                    </span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.pool} 
                    onChange={() => handleAddonToggle('pool')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Pool & Spa Evaluation (+ $300)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Comprehensive pumps, electrical, filters, and shell integrity check ($300 flat rate).</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.sewer} 
                    onChange={() => handleAddonToggle('sewer')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Sewer Scope Inspection (+ $425)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>High-definition camera inspection of the main sewer line to detect root intrusion or collapses.</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.lowFlow} 
                    onChange={() => handleAddonToggle('lowFlow')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>DeKalb Low-Flow Compliance Certification (+ $125)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Mandatory compliance check for DeKalb County property transfers (pre-1993 builds).</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.buildfax} 
                    onChange={() => handleAddonToggle('buildfax')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>BuildFax Permit & Improvement Report (+ $15)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Detailed records of past building permits, additions, and updates.</span>
                  </div>
                </label>
              </div>
            </>
          </div>

          <div style={{ position: 'sticky', top: '120px' }}>
            <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'var(--color-white)', boxShadow: 'var(--shadow-xl)' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-gray-dark)', paddingBottom: '1rem' }}>
                Guaranteed Base Price Summary
              </h3>
              
              <div style={{ fontSize: isCustom ? '1.8rem' : '4rem', fontWeight: 800, color: 'var(--color-red)', marginBottom: '0.5rem', lineHeight: 1 }}>
                {isCustom ? total : `$${total}`}
              </div>
              
              <p style={{ color: 'var(--color-gray)', marginBottom: '2rem', fontSize: '0.825rem', lineHeight: 1.4 }}>
                Calculated on real Atlanta area inspection schedules. Subject to verification of tax assessor records and property complexity upon booking.
              </p>

              <div style={{ borderBottom: '1px solid var(--color-gray-dark)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <h4 style={{ color: 'var(--color-white)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Elite Two Person Inspection Team Package Includes:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-white)', fontWeight: 600 }}>👥 Two Person Inspection Team</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-white)' }}>Standard</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)' }}>
                      ⚡ <strong>2 Inspectors = 2x Faster:</strong> Completed in 2–2.5 hours instead of 4+ hours, saving you and your agent time.
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>🔍 FLIR® Infrared Thermal Imaging</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$99</span> FREE
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>🛸 High-Resolution Aerial Drone Scan</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$125</span> FREE
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>🛡️ $10,000 Elite Master Warranty Suite</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$350</span> FREE
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>🔌 Utilities Plus Concierge Setup</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$150</span> FREE
                    </span>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.85rem', 
                  color: 'var(--color-white)', 
                  textAlign: 'center', 
                  background: 'rgba(211, 47, 47, 0.15)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  fontWeight: 600
                }}>
                  🎁 $724 in premium diagnostic & protection value included at no extra charge!
                </div>
              </div>
              
              <div style={{ background: 'rgba(211, 47, 47, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid rgba(211, 47, 47, 0.2)' }}>
                <p style={{ color: 'var(--color-white)', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4, textAlign: 'center' }}>
                  {serviceType === 'str' 
                    ? 'Verify your short-term rental compliance safety before county spot checks. Schedule online in seconds.' 
                    : "Don't just get a checklist—get $10,000 in real legal and financial protection. Secure your home investment with Foresight."}
                </p>
              </div>

              <div style={{ 
                background: 'rgba(16, 185, 129, 0.08)', 
                padding: '1.25rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.5rem', 
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <span style={{ 
                  color: '#34d399', 
                  fontSize: '0.85rem', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  lineHeight: 1
                }}>
                  💰 Smart Investment & Savings
                </span>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'rgba(16, 185, 129, 0.05)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed rgba(16, 185, 129, 0.2)',
                  margin: '0.25rem 0'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-mid)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      {serviceType === 'str' ? 'County Safety Compliance' : 'Negotiating Leverage'}
                    </span>
                    <strong style={{ fontSize: '1.4rem', color: '#34d399', letterSpacing: '-0.02em' }}>
                      {serviceType === 'str' ? 'Starts at $355' : `$${leverage.min.toLocaleString()} - $${leverage.max.toLocaleString()}+`}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-mid)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      {serviceType === 'str' ? 'Compliance Assist' : 'Est. Savings ROI'}
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: '#34d399' }}>
                      {serviceType === 'str' ? 'Avoid Shutdowns' : (typeof total === 'number' && total > 0 ? `${Math.round(((leverage.min - total) / total) * 100)}%` : '700%+')}
                    </strong>
                  </div>
                </div>

                <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.825rem', fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                  {serviceType === 'str' ? (
                    <span>
                      Foresight inspects key safety parameters including smoke alarms, carbon monoxide detectors, fire extinguishers, and exit routes, helping ensure you meet your local jurisdiction's rules.
                    </span>
                  ) : (
                    <span>
                      Getting us to perform your physical inspection is designed to <strong>save you more money in the long run</strong>. We regularly save our clients thousands of dollars by uncovering hidden defects, giving you the undeniable leverage to secure <strong>upfront repairs</strong> from the seller/builder on their dime, or win heavy <strong>repair credits</strong> at the closing table.
                    </span>
                  )}
                </p>
              </div>

              <a 
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary" 
                style={{ width: '100%', fontSize: '1.125rem', padding: '1rem', textAlign: 'center', display: 'block' }}
              >
                {isCustom 
                  ? '📞 Call 678-480-2110 for Custom Quote' 
                  : serviceType === 'new-construction'
                  ? '📅 Book New Construction Inspection Now'
                  : serviceType === 'seller'
                  ? '📅 Book Pre-Listing Inspection Now'
                  : serviceType === 'warranty'
                  ? '📅 Book Warranty Inspection Now'
                  : serviceType === 'str'
                  ? '📅 Book STR Compliance Assist Now'
                  : '📅 Book Home Inspection Online Now'}
              </a>
              
              <div style={{ marginTop: '1rem' }}>
                {!showLeadForm && !isCustom && (
                  <button onClick={() => setShowLeadForm(true)} className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--color-white)', color: 'var(--color-white)', fontSize: '1rem', padding: '0.75rem' }}>
                    🔒 Hold My Slot & Save This Price
                  </button>
                )}
                {showLeadForm && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '0.5rem' }}>
                    {leadStatus === 'success' ? (
                      <div style={{ color: '#34d399', fontSize: '0.9rem', textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>✅ Price Locked & Slot Held!</p>
                        <p style={{ color: 'var(--color-white)', lineHeight: 1.4 }}>We've received your request. Use the Book Online button above to finalize your schedule.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleHoldSlot} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                        <h4 style={{ color: 'var(--color-white)', fontSize: '0.95rem', margin: 0 }}>Secure Your Quote</h4>
                        <input type="text" placeholder="Your Name" required value={leadName} onChange={e => setLeadName(e.target.value)} style={{ padding: '0.6rem', borderRadius: '4px', border: 'none', width: '100%' }} />
                        <input type="email" placeholder="Your Email" required value={leadEmail} onChange={e => setLeadEmail(e.target.value)} style={{ padding: '0.6rem', borderRadius: '4px', border: 'none', width: '100%' }} />
                        <input type="tel" placeholder="Phone Number (Optional)" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} style={{ padding: '0.6rem', borderRadius: '4px', border: 'none', width: '100%' }} />
                        <button type="submit" disabled={leadStatus === 'submitting'} className="btn btn-primary" style={{ padding: '0.6rem', fontSize: '0.95rem', background: 'var(--color-red-dark)' }}>
                          {leadStatus === 'submitting' ? 'Saving...' : 'Lock In Price'}
                        </button>
                        {leadStatus === 'error' && <p style={{ color: '#fca5a5', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>An error occurred. Please try again.</p>}
                      </form>
                    )}
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Need specialized consulting or WDO explanations?
                </p>
                <a href="/ask-twin" style={{ color: 'var(--color-red-light)', fontWeight: 600, fontSize: '0.95rem' }}>
                  Ask Foresight AI →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {showValueComparison && <ValueComparison />}
    </>
  );
}
