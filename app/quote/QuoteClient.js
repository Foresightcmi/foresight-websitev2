'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ValueComparison = dynamic(() => import('../components/ValueComparison'), { ssr: true });
export default function QuoteClient({ showValueComparison = true }) {
  const [propertyType, setPropertyType] = useState('single-family'); // 'single-family', 'condo'
  const [serviceType, setServiceType] = useState('buyer'); // 'buyer', 'seller', 'new-construction', 'warranty', 'str'
  const [sqft, setSqft] = useState(2000);
  const [foundation, setFoundation] = useState('slab'); // 'slab', 'basement', 'crawlspace'
  const [ageTier, setAgeTier] = useState('under-50'); // 'under-50', 'over-50'
  
  const [addons, setAddons] = useState({
    radon: false,
    termite: false,
    pool: false,
    sewer: false,
    lowFlow: false,
    buildfax: false,
    airQuality: false,
    detachedBuilding: false,
    repairEstimates: false
  });
  const [discount, setDiscount] = useState('none'); // 'none', 'first-time', 'realtor', 'repeat'
  const [realtorLicense, setRealtorLicense] = useState('');
  const [realtorBrokerage, setRealtorBrokerage] = useState('');
  const [realtorValidationMsg, setRealtorValidationMsg] = useState('');

  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadAddress, setLeadAddress] = useState('');
  const [leadRealtor, setLeadRealtor] = useState('');
  const [leadPreferredDate, setLeadPreferredDate] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [leadHp, setLeadHp] = useState('');
  const [leadStatus, setLeadStatus] = useState('idle'); // idle, submitting, success, error
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [voucherName, setVoucherName] = useState('');
  const [voucherEmail, setVoucherEmail] = useState('');
  const [voucherStatus, setVoucherStatus] = useState('idle'); // idle, sending, sent, error
  const [upsellAdded, setUpsellAdded] = useState({}); // { repairEstimates: true, sewer: true, lowFlow: true }

  // Parse URL parameters for initial states
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const discountParam = params.get('discount');
      if (discountParam && ['first-time', 'repeat', 'realtor', 'promo'].includes(discountParam)) {
        setDiscount(discountParam);
      }
      const typeParam = params.get('type');
      const serviceParam = params.get('service');
      const sqftParam = params.get('sqft');
      const foundationParam = params.get('foundation');
      const radonParam = params.get('radon');
      const sewerParam = params.get('sewer');
      const termiteParam = params.get('termite');
      const poolParam = params.get('pool');

      if (serviceParam === 'str' || typeParam === 'str') {
        setServiceType('str');
      } else if (serviceParam && ['buyer', 'seller', 'new-construction', 'warranty', 'drywall'].includes(serviceParam)) {
        setServiceType(serviceParam);
      }

      if (typeParam === 'condo' || typeParam === 'single-family') {
        setPropertyType(typeParam);
      }

      if (sqftParam) {
        const parsedSq = parseInt(sqftParam, 10);
        if (!isNaN(parsedSq) && parsedSq > 0) setSqft(parsedSq);
      }

      if (foundationParam && ['slab', 'basement', 'crawlspace'].includes(foundationParam)) {
        setFoundation(foundationParam);
      }

      const estimatesParam = params.get('estimates') || params.get('repairEstimates');

      setAddons(prev => ({
        ...prev,
        radon: radonParam === 'true' ? true : prev.radon,
        sewer: sewerParam === 'true' ? true : prev.sewer,
        termite: termiteParam === 'true' ? true : prev.termite,
        pool: poolParam === 'true' ? true : prev.pool,
        repairEstimates: estimatesParam === 'true' ? true : prev.repairEstimates,
      }));
    }
  }, []);

  // Calculations logic
  const calculateTotal = () => {
    let base;
    const parsedSqft = Number(sqft) || 2000;

    if (serviceType === 'str') {
      base = 395; // SHORT-TERM RENTAL COMPLIANCE INSPECTION (Starts at $395.00)
    } else if (serviceType === 'drywall') {
      // PRE-DRYWALL/FRAMING INSPECTION $275.00 / $300.00
      base = parsedSqft <= 2500 ? 275 : 300;
    } else if (propertyType === 'condo') {
      // CONDOMINIUM INSPECTION: <=1000 $295, >1000 $325
      base = parsedSqft <= 1000 ? 295 : 325;
    } else if (serviceType === 'new-construction') {
      // FORESIGHT NEW CONSTRUCTION INSPECTION SERVICES
      if (parsedSqft <= 1800) base = 400;
      else if (parsedSqft <= 2500) base = 455;
      else if (parsedSqft <= 3000) base = 485;
      else if (parsedSqft <= 3500) base = 515;
      else if (parsedSqft <= 4000) base = 545;
      else if (parsedSqft <= 4500) base = 585;
      else if (parsedSqft <= 5000) base = 625;
      else if (parsedSqft <= 7000) base = 935;
      else base = 985;
    } else {
      // STANDARD SINGLE-FAMILY HOME INSPECTION SCHEDULE (Buyer, Pre-Listing Seller, 11-Month Warranty)
      if (parsedSqft <= 1000) base = 345;
      else if (parsedSqft <= 1500) base = 375;
      else if (parsedSqft <= 2000) base = 425;
      else if (parsedSqft <= 2500) base = 475;
      else if (parsedSqft <= 3000) base = 525;
      else if (parsedSqft <= 3500) base = 575;
      else if (parsedSqft <= 4000) base = 625;
      else if (parsedSqft <= 4500) base = 675;
      else if (parsedSqft <= 5000) base = 775;
      else if (parsedSqft <= 5500) base = 875;
      else base = 985;
    }
    
    let extra = 0;

    // Age Surcharge: HOMES OVER 50 YEARS OLD $75.00
    if (serviceType !== 'str' && ageTier === 'over-50') {
      extra += 75;
    }

    // Foundation Complexity Fees:
    // Crawlspace = +$75, Unfinished Basement = +$75
    if (propertyType === 'single-family' && serviceType !== 'str') {
      if (foundation === 'crawlspace') {
        extra += 75;
      }
      if (foundation === 'basement') {
        extra += 75;
      }
    }

    // Auxiliary / Specialty Add-ons are quoted directly by our office at (678) 480-2110

    // Promotional & Client Discounts (Strict $25 cap)
    if (discount === 'first-time') extra -= 25; // First-Time Homebuyer Discount ($25.00)
    if (discount === 'repeat') extra -= 25;     // Repeat Customer Loyalty Discount ($25.00)
    if (discount === 'realtor') extra -= 25;    // Verified Licensed Georgia Realtor Partner ($25.00)
    if (discount === 'promo') extra -= 25;      // Promotional / Referral Discount ($25.00)

    return { total: Math.max(0, base + extra), isCustom: false };
  };

  const { total, isCustom } = calculateTotal();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'quote_calculated', {
          event_category: 'quote_calculator',
          value: total,
          currency: 'USD',
          property_type: propertyType,
          service_type: serviceType,
          sqft: Number(sqft) || 2000,
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [total, propertyType, serviceType, sqft]);

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
    if (addons.repairEstimates) {
      minLeverage += 2000;
      maxLeverage += 5000;
    }
    if (addons.sewer) {
      minLeverage += 3000;
      maxLeverage += 8000;
    }
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

  const handleSaveVoucher = async (e) => {
    e.preventDefault();
    setVoucherStatus('sending');
    if (discount === 'none') {
      setDiscount('first-time');
    }
    const lockedPrice = discount === 'none' ? Math.max(0, total - 25) : total;
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: voucherName,
          email: voucherEmail,
          sqft,
          propertyType,
          serviceType,
          foundation,
          ageTier,
          estimatedTotal: lockedPrice,
          notes: `[Quote Calculator $25 Price-Lock Voucher Saved] Locked Estimate: $${lockedPrice} (${sqft} sq ft ${propertyType}, ${serviceType})`,
          source: 'Quote Calculator $25 Price Lock Voucher'
        })
      });
      if (res.ok) {
        setVoucherStatus('sent');
        if (!leadName) setLeadName(voucherName);
        if (!leadEmail) setLeadEmail(voucherEmail);
      } else {
        setVoucherStatus('error');
      }
    } catch (err) {
      setVoucherStatus('error');
    }
  };

  const handlePostSubmitUpsell = async (addonKey, addonLabel) => {
    setAddons(prev => ({ ...prev, [addonKey]: true }));
    setUpsellAdded(prev => ({ ...prev, [addonKey]: true }));
    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName || 'Valued Client',
          email: leadEmail,
          phone: leadPhone,
          address: leadAddress,
          sqft,
          propertyType,
          serviceType,
          foundation,
          ageTier,
          addons: [`1-CLICK POST-BOOKING UPGRADE: ${addonLabel}`],
          estimatedTotal: total,
          notes: `Client clicked 1-Click Post-Request Add-On Upgrade to attach ${addonLabel} to their tentative request for ${leadAddress || 'their property'}.`,
          source: 'Quote Post-Submission 1-Click Upsell'
        })
      });
    } catch (err) {
      console.error('Upsell update error:', err);
    }
  };

  const handleHoldSlot = async (e) => {
    e.preventDefault();
    setLeadStatus('submitting');
    try {
      if (discount === 'realtor') {
        const cleanLic = realtorLicense.trim().replace(/[^0-9]/g, '');
        if (!realtorLicense.trim() || cleanLic.length < 5 || !realtorBrokerage.trim()) {
          setRealtorValidationMsg('A valid Georgia Real Estate Commission (GREC) License # (minimum 5 digits) and Brokerage Name are required to claim the Realtor Partner Discount.');
          setLeadStatus('idle');
          const element = document.getElementById('grec-verification-section');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      const activeAddonNames = Object.keys(addons)
        .filter(k => addons[k])
        .map(k => {
          if (k === 'radon') return '48-Hour Radon Gas Test (Call for Quote)';
          if (k === 'pool') return 'Pool & Spa Inspection (Call for Quote)';
          if (k === 'sewer') return 'Sewer Scope Camera Inspection (Call for Quote)';
          if (k === 'termite') return foundation === 'crawlspace' ? 'Termite / WDO Crawlspace (Call for Quote)' : 'Termite / WDO Slab/Basement (Call for Quote)';
          if (k === 'lowFlow') return 'DeKalb Low-Flow Compliance Certificate (Call for Quote)';
          if (k === 'buildfax') return 'BuildFax Report (Call for Quote)';
          if (k === 'airQuality') return 'Indoor Air Quality & Mold Lab Testing (Call for Quote)';
          if (k === 'detachedBuilding') return 'Detached Building / Workshop Inspection (Call for Quote)';
          if (k === 'repairEstimates') return 'Contractor Repair Cost & Pricing Estimates (Call for Quote)';
          return k;
        });
      if (discount !== 'none') {
        const discountNames = {
          'first-time': 'First-Time Homebuyer Discount (-$25)',
          'repeat': 'Repeat Customer Loyalty Discount (-$25)',
          'realtor': `Verified Licensed Realtor Discount (-$25) [GREC #${realtorLicense.trim()} - ${realtorBrokerage.trim()}]`,
          'promo': 'Promotional / Partner Discount (-$25)'
        };
        activeAddonNames.push(discountNames[discount] || 'Promotional Discount (-$25)');
      }

      const formattedRealtor = leadRealtor
        ? `${leadRealtor}${realtorLicense ? ` (Agent Claim: GREC #${realtorLicense.trim()} - ${realtorBrokerage.trim()})` : ''}`
        : (realtorLicense ? `Verified Realtor Partner: GREC #${realtorLicense.trim()} - ${realtorBrokerage.trim()}` : '');

      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          address: leadAddress,
          realtorAgent: formattedRealtor,
          preferredDate: leadPreferredDate,
          sqft,
          propertyType,
          serviceType,
          foundation,
          ageTier,
          addons: activeAddonNames,
          estimatedTotal: total,
          notes: leadNotes,
          _hp: leadHp,
          source: 'Quote Calculator Online Booking'
        })
      });
      if (res.ok) {
        setLeadStatus('success');
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'quote_lead_generated', {
            event_category: 'conversion',
            value: total,
            currency: 'USD',
            service_type: serviceType,
            property_type: propertyType,
          });
        }
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
      <section className="section bg-gray-light" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <div className="container">
        <div className="section-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span className="badge" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#854d0e', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '0.35rem 1rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.82rem', display: 'inline-block', marginBottom: '0.75rem' }}>
            100% Transparent Flat-Rate Pricing &bull; Two Inspectors Included
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.65rem)', fontWeight: 800, margin: '0.25rem 0 0.5rem', color: 'var(--color-dark)' }}>
            Instant Home Inspection Fee Calculator
          </h1>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '650px', margin: '0.5rem auto 0', fontSize: '1rem', lineHeight: 1.5 }}>
            Calculate exact square-footage pricing in seconds. Every inspection includes two certified inspectors, complimentary thermal imaging, 4K drone scans, and up to $35,000 in warranty protection.
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
                {propertyType === 'single-family' && <option value="drywall">Pre-Drywall / Framing Inspection</option>}
                <option value="seller">Pre-Listing Seller Inspection</option>
                <option value="warranty">11-Month Warranty Inspection</option>
                <option value="str">Short-Term Rental (STR) Compliance Inspection</option>
              </select>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>3. Finished / Heated Size</h2>
            <div className="form-group">
              <label className="form-label">
                Total Heated Square Footage {Number(sqft) > 5500 && serviceType !== 'str' && <span style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.85rem' }}>(Luxury Estate Sizing — Transparent Online Estimate &amp; Booking Available)</span>}
              </label>
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
                <strong>Short-Term Rental (STR) Compliance Inspection:</strong>
                <p style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '0.825rem', color: 'var(--color-gray-dark)', lineHeight: 1.4 }}>
                  Surrounding Atlanta counties require strict compliance. Our service assists hosts by inspecting standard safety benchmarks (starts at $395):
                </p>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Smoke detector placement & functional testing (each level & sleeping area).</li>
                  <li>Carbon monoxide alarm placement & testing (minimum 1 per level).</li>
                  <li>Visible and accessible fire extinguisher safety checks (minimum 1 per level).</li>
                  <li>Emergency exit route and egress safety evaluations.</li>
                  <li>Posted local 24-hour agent contact & evacuation map signage checks.</li>
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
                    Unfinished/Partial Basement (+$75)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'crawlspace'} onChange={() => setFoundation('crawlspace')} />
                    Unfinished Crawlspace (+$75)
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
                  <option value="under-50">Under 50 Years Old ($0 Surcharge)</option>
                  <option value="over-50">50+ Years Old (Built before ~1975) {serviceType !== 'str' && '(+ $75 Vintage Home Surcharge)'}</option>
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
                ℹ️ <strong>Additional Complexity Fees:</strong> Per our official fee schedule, an additional <strong>$75 fee</strong> is added for an unfinished crawlspace inspection, and <strong>$75</strong> for an unfinished/partially finished basement inspection.
              </div>
            )}

            <>
              <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>6. Specialized Services & Add-ons</h2>
              
              <div style={{
                background: 'rgba(211, 47, 47, 0.04)',
                border: '1px solid rgba(211, 47, 47, 0.15)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--color-gray-dark)',
                lineHeight: 1.5
              }}>
                <strong>Specialty Service Scheduling &amp; Pricing:</strong> Specialized auxiliary inspections (Pool &amp; Spa, Termite/WDO, Radon Gas Testing, Sewer Scope, Mold/Air Quality, and Detached Structures) are coordinated alongside your main home inspection. Select any auxiliary services you would like to request below, or call our office directly at <a href="tel:678-480-2110" style={{ color: 'var(--color-red)', fontWeight: 700 }}>(678) 480-2110</a> for custom auxiliary pricing and scheduling.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="checkbox-container" style={{
                  background: addons.repairEstimates ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: addons.repairEstimates ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <input 
                    type="checkbox" 
                    checked={addons.repairEstimates} 
                    onChange={() => handleAddonToggle('repairEstimates')} 
                  />
                  <div>
                    <span style={{ fontWeight: 700, display: 'block', color: addons.repairEstimates ? '#fde047' : 'var(--color-white)' }}>
                      Contractor Repair Cost &amp; Pricing Estimate (Call Us for Quote)
                    </span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)', display: 'block', marginTop: '2px', lineHeight: 1.45 }}>
                      <strong>Optional Due Diligence Add-On:</strong> Detailed contractor labor and materials estimates for reported defects, formatted for Georgia repair amendment negotiation. <em>(Standard home inspections are diagnostic only per InterNACHI SOP; we do not provide repair estimates unless specifically requested).</em>
                    </span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.sewer} 
                    onChange={() => handleAddonToggle('sewer')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Sewer Scope Inspection (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>High-definition video camera inspection of the main sewer lateral to city connection or septic tank.</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.radon} 
                    onChange={() => handleAddonToggle('radon')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>48-Hour Radon Gas Test (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Continuous 48-hour electronic monitoring following strict EPA protocols.</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.pool} 
                    onChange={() => handleAddonToggle('pool')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Pool &amp; Spa Inspection (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Comprehensive pump, filter, heater, electrical bonding, and shell safety evaluation.</span>
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
                      Termite / WDO Inspection (Call Us for Quote)
                    </span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Official Georgia Wood Infestation Inspection Report (GAR compliant) performed by licensed partner.</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.airQuality} 
                    onChange={() => handleAddonToggle('airQuality')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Indoor Air Quality / Mold Lab Testing (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Baseline spore trap air samples + certified lab report (surface swabs or extra samples coordinated on site).</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.detachedBuilding} 
                    onChange={() => handleAddonToggle('detachedBuilding')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Detached Building / Workshop Inspection (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Inspection of separate workshop, storage garage, or detached structure.</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.lowFlow} 
                    onChange={() => handleAddonToggle('lowFlow')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>DeKalb Low-Flow Compliance Certification (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Mandatory signed Certificate of Compliance for pre-1993 DeKalb property transfers.</span>
                  </div>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={addons.buildfax} 
                    onChange={() => handleAddonToggle('buildfax')} 
                  />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>BuildFax Permit &amp; Improvement Report (Call Us for Quote)</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Detailed records of past building permits, additions, renovations, and aging systems.</span>
                  </div>
                </label>

              <h2 style={{ marginTop: '2.5rem', marginBottom: '1.25rem' }}>7. Available Client Discounts</h2>
              <div className="form-group">
                <label className="form-label">Apply an Eligible Promotional or Client Discount ($25 Max)</label>
                <select 
                  className="form-control"
                  value={discount}
                  onChange={(e) => {
                    setDiscount(e.target.value);
                    setRealtorValidationMsg('');
                  }}
                >
                  <option value="none">Standard Pricing ($0 Discount)</option>
                  <option value="first-time">First-Time Homebuyer Discount (-$25.00)</option>
                  <option value="repeat">Repeat Customer Loyalty Discount (-$25.00)</option>
                  <option value="realtor">Verified Licensed Georgia Realtor / Agent Partner (-$25.00)</option>
                  <option value="promo">Promotional / Partner Code (-$25.00)</option>
                </select>
              </div>

              {discount === 'realtor' && (
                <div id="grec-verification-section" style={{
                  marginTop: '1rem',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1.5px solid #d4af37',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <strong style={{ color: '#b45309', fontSize: '0.95rem' }}>
                        Georgia Real Estate Commission (GREC) Licensure Verification
                      </strong>
                    </div>
                    <a 
                      href="https://services.grec.state.ga.us/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ fontSize: '0.75rem', color: 'var(--color-red)', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      GREC Public Registry Lookup ↗
                    </a>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-dark)', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
                    Under Georgia real estate licensing standards and Foresight policy, agent partner concessions require proof of active licensure. All license numbers are cross-verified with the GREC database prior to dispatch.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--color-dark)' }}>
                        GREC License # (Required) *
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 412093 (5-7 digits)" 
                        value={realtorLicense} 
                        onChange={e => {
                          setRealtorLicense(e.target.value);
                          if (e.target.value.trim().length >= 5) setRealtorValidationMsg('');
                        }} 
                        className="form-control"
                        style={{ padding: '0.55rem', fontSize: '0.85rem', borderColor: realtorValidationMsg ? 'var(--color-red)' : undefined }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--color-dark)' }}>
                        Active Brokerage / Firm (Required) *
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Keller Williams Atlanta / Compass" 
                        value={realtorBrokerage} 
                        onChange={e => setRealtorBrokerage(e.target.value)} 
                        className="form-control"
                        style={{ padding: '0.55rem', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                  </div>
                  {realtorValidationMsg && (
                    <p style={{ color: 'var(--color-red)', fontSize: '0.75rem', margin: '0.5rem 0 0 0', fontWeight: 600 }}>
                      Notice: {realtorValidationMsg}
                    </p>
                  )}
                  {realtorLicense.trim().length >= 5 && realtorBrokerage.trim().length >= 2 && (
                    <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>
                      <span style={{ fontWeight: 700 }}>✓</span> Validated format &bull; GREC #{realtorLicense.trim()} queued for office registry verification.
                    </div>
                  )}
                </div>
              )}
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

              {!isCustom && typeof total === 'number' && (
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  marginBottom: '1rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ flex: 1, borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '0.5rem' }}>
                    <span style={{ color: 'var(--color-gray-mid)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>50% Deposit to Solidify:</span>
                    <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>${Math.round(total * 0.5)}</strong>
                    <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Due with signed agreement after office confirmation</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: 'var(--color-gray-mid)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>Final 50% (Upon Completion):</span>
                    <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>${total - Math.round(total * 0.5)}</strong>
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--color-gray-mid)', marginTop: '2px' }}>Due prior to report release</span>
                  </div>
                </div>
              )}
              
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
                      <span style={{ color: 'var(--color-white)', fontWeight: 600 }}>Two-Inspector Lead Team</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-white)' }}>Standard</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)' }}>
                      <strong>Two Inspectors = 2x Thorough:</strong> Completed in 2–2.5 hours instead of 4+ hours, saving you and your agent time.
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>High-Resolution Infrared Thermal Imaging</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$99</span> FREE
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>High-Resolution Aerial Drone Scan</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$125</span> FREE
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>$10,000 Elite Master Warranty Suite</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)', marginRight: '0.5rem', fontSize: '0.8rem' }}>$350</span> FREE
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-mid)' }}>Utilities Plus Concierge Setup</span>
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
                  $724 in premium diagnostic &amp; protection value included at no extra charge!
                </div>

                {(propertyType === 'single-family' && serviceType !== 'str' && (foundation === 'crawlspace' || foundation === 'basement')) || (serviceType !== 'str' && ageTier === 'over-50') ? (
                  <div style={{ marginTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                      Property Complexity:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {propertyType === 'single-family' && serviceType !== 'str' && foundation === 'crawlspace' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Unfinished Crawlspace Inspection</span>
                          <span>+$75</span>
                        </div>
                      )}
                      {propertyType === 'single-family' && serviceType !== 'str' && foundation === 'basement' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Unfinished / Partial Basement</span>
                          <span>+$75</span>
                        </div>
                      )}
                      {serviceType !== 'str' && ageTier === 'over-50' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Vintage Home (50+ Years Old)</span>
                          <span>+$75</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {Object.values(addons).some(Boolean) && (
                  <div style={{ marginTop: '1.25rem', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.85rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      Requested Auxiliary Add-Ons (Quoted by Office):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {addons.repairEstimates && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#fde047', fontWeight: 600 }}>
                          <span>Contractor Repair Cost Estimates</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.sewer && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Sewer Scope Camera Inspection</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.radon && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>48-Hour Radon Gas Testing</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.pool && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Pool &amp; Spa Inspection</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.termite && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Termite / WDO Clearance Letter</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.airQuality && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Mold &amp; Air Quality Lab Testing</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.detachedBuilding && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>Detached Building Inspection</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.lowFlow && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>DeKalb Low-Flow Compliance Certificate</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                      {addons.buildfax && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#FFFFFF' }}>
                          <span>BuildFax History Report</span>
                          <span>Call for Quote</span>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: '0.73rem', color: '#cbd5e1', margin: '0.6rem 0 0 0', lineHeight: 1.4 }}>
                      Our office will call you at <strong style={{ color: '#34d399' }}>(678) 480-2110</strong> to confirm pricing and scheduling for your selected auxiliary services.
                    </p>
                  </div>
                )}
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
                  Smart Investment & Savings
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
                      {serviceType === 'str' ? 'Starts at $395' : `$${leverage.min.toLocaleString()} - $${leverage.max.toLocaleString()}+`}
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

              {/* Primary Direct Action: Book / Request Inspection Online */}
              <div id="quote-request-form" style={{ marginTop: '1.25rem' }}>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: '1rem'
                }}>
                  {leadStatus === 'success' ? (
                    <div style={{ 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      border: '2px solid #10b981', 
                      borderRadius: 'var(--radius-sm)', 
                      padding: '1.5rem 1rem', 
                      textAlign: 'center', 
                      color: 'var(--color-white)' 
                    }}>
                      <div style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '1.5rem', fontWeight: 800 }}>✓</div>
                      <h4 style={{ color: '#34d399', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                        Tentative Request Received!
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.4, marginBottom: '1rem' }}>
                        Thank you, <strong>{leadName || 'Valued Client'}</strong>! We have logged your request for <strong>{leadAddress || 'your property'}</strong>.
                      </p>
                      <div style={{ 
                        background: 'rgba(0,0,0,0.4)', 
                        padding: '0.85rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        lineHeight: 1.45, 
                        textAlign: 'left',
                        color: '#cbd5e1',
                        marginBottom: '1rem'
                      }}>
                        <p style={{ color: '#fef08a', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
                          Next Steps (Pending Office Confirmation):
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <li><strong>Office Confirmation &amp; Agreements:</strong> Our office reviews county tax records and contacts you within 20 minutes with your official appointment confirmation and inspection agreements to sign.</li>
                          <li><strong>50% Deposit to Solidify:</strong> To solidify your appointment on our master calendar, the 50% deposit along with your signed inspection agreements are completed after our office sends your appointment confirmation. The remaining 50% balance is due upon inspection completion before report release.</li>
                          <li><strong>Specialty Service Coordination:</strong> Dedicated auxiliary services (Pool, Termite, Radon, Sewer) are coordinated alongside your primary inspection window.</li>
                          <li><strong>Sunday Inspection:</strong> Strictly by appointment only.</li>
                        </ul>
                      </div>
                      {(!addons.repairEstimates || !addons.sewer || !addons.lowFlow) && (
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))',
                          border: '1px solid var(--color-gold)',
                          borderRadius: '8px',
                          padding: '1rem',
                          marginBottom: '1rem',
                          textAlign: 'left'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                            ⚡ Optional 1-Click Due Diligence Upgrades (Attach to Your Request):
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                            Want to maximize your closing table leverage before our office finalizes your agreement? Click once to attach any of these high-leverage add-ons to your reservation:
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {!addons.repairEstimates && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                  <strong style={{ fontSize: '0.82rem', color: '#fde047', display: 'block' }}>Itemized Contractor Repair Cost Estimate</strong>
                                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Regional trade pricing + sample Georgia repair amendment wording for seller credit demands.</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handlePostSubmitUpsell('repairEstimates', 'Contractor Repair Cost & Pricing Estimates (Call for Quote)')}
                                  style={{ background: 'var(--color-gold)', color: '#0f172a', border: 'none', borderRadius: '4px', padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}
                                >
                                  + Request Quote
                                </button>
                              </div>
                            )}
                            {!addons.sewer && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                  <strong style={{ fontSize: '0.82rem', color: '#ffffff', display: 'block' }}>Fiber-Optic Sewer Scope Camera Inspection</strong>
                                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Detects hidden root intrusion, bellies, and crushed underground sewer laterals.</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handlePostSubmitUpsell('sewer', 'Sewer Scope Camera Inspection (Call for Quote)')}
                                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                                >
                                  + Request Quote
                                </button>
                              </div>
                            )}
                            {!addons.lowFlow && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                  <strong style={{ fontSize: '0.82rem', color: '#ffffff', display: 'block' }}>DeKalb County Low-Flow Plumbing Certificate</strong>
                                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Required for water service activation in unincorporated DeKalb County (we verify parcel applicability).</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handlePostSubmitUpsell('lowFlow', 'DeKalb Low-Flow Compliance Certificate (Call for Quote)')}
                                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                                >
                                  + Request Quote
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {Object.keys(upsellAdded).length > 0 && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #34d399', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: '#ecfdf5', marginBottom: '0.85rem', fontWeight: 700 }}>
                          ✓ Auxiliary service request attached! Our office will confirm pricing when we call you.
                        </div>
                      )}
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-mid)', margin: 0 }}>
                        Need immediate dispatch or tight 5-day due diligence hold? Call or text Christopher directly at <a href="tel:678-480-2110" style={{ color: '#34d399', fontWeight: 700 }}>678-480-2110</a>.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleHoldSlot} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                          Submit Online Inspection Request
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Lock In Price</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-gray-mid)', margin: 0, lineHeight: 1.35 }}>
                        Enter your details below to request your preferred window. To solidify all appointments on our calendar, the 50% deposit along with the signed inspection agreements are completed after our office sends your appointment confirmation. The remaining balance is due upon inspection completion before your report is released.
                      </p>

                      {/* Invisible Honeypot to trap automated bot crawlers */}
                      <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true">
                        <input type="text" name="_hp" tabIndex="-1" autoComplete="off" value={leadHp} onChange={e => setLeadHp(e.target.value)} />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Your Full Name (Required)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Alex Morgan" 
                          required 
                          value={leadName} 
                          onChange={e => setLeadName(e.target.value)} 
                          style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff' }} 
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Phone Number (Required)</label>
                          <input 
                            type="tel" 
                            placeholder="(678) 000-0000" 
                            required 
                            value={leadPhone} 
                            onChange={e => setLeadPhone(e.target.value)} 
                            style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff' }} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Email Address (Required)</label>
                          <input 
                            type="email" 
                            placeholder="alex@example.com" 
                            required 
                            value={leadEmail} 
                            onChange={e => setLeadEmail(e.target.value)} 
                            style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff' }} 
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Property Address / City (Required)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 123 Peachtree St, Atlanta, GA" 
                          required 
                          value={leadAddress} 
                          onChange={e => setLeadAddress(e.target.value)} 
                          style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff' }} 
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Referring Real Estate Agent &amp; Brokerage (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Austin Landers - Dorsey Alston (GREC #412093)" 
                          value={leadRealtor} 
                          onChange={e => setLeadRealtor(e.target.value)} 
                          style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff' }} 
                        />
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                          Agents: Include your GREC License # to unlock priority SUPRA lockbox privileges &amp; verified partner perks.
                        </span>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Preferred Inspection Date &amp; Window</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Tomorrow morning (9-10 AM) or Thursday afternoon" 
                          value={leadPreferredDate} 
                          onChange={e => setLeadPreferredDate(e.target.value)} 
                          style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff' }} 
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', display: 'block', marginBottom: '2px' }}>Special Instructions / Lockbox / Questions (Optional)</label>
                        <textarea 
                          rows="2"
                          placeholder="Any gate codes, SUPRA key access details, or questions..." 
                          value={leadNotes} 
                          onChange={e => setLeadNotes(e.target.value)} 
                          style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', background: 'rgba(0,0,0,0.3)', color: '#ffffff', resize: 'vertical' }} 
                        />
                      </div>

                      <div style={{ background: 'rgba(211,47,47,0.12)', padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(211,47,47,0.25)', fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.35 }}>
                        <strong>Tentative Slot Request:</strong> Our office reviews property records and contacts you within 20 minutes with your official appointment confirmation. Sunday is by appointment only.
                      </div>

                      <button 
                        type="submit" 
                        disabled={leadStatus === 'submitting'} 
                        className="btn btn-primary" 
                        style={{ padding: '0.85rem', fontSize: '1.05rem', fontWeight: 700, width: '100%', background: 'var(--color-red)' }}
                      >
                        {leadStatus === 'submitting' ? 'Submitting Request...' : `Submit Inspection Request ($${total})`}
                      </button>

                      {leadStatus === 'error' && (
                        <p style={{ color: '#fca5a5', fontSize: '0.825rem', margin: 0, textAlign: 'center' }}>
                          An error occurred while submitting. Please call us directly at 678-480-2110.
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Layer 5 Guestbook: Non-Ready Buyer Price-Lock & Checklist Capture */}
                {leadStatus !== 'success' && (
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px dashed rgba(212, 175, 55, 0.45)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1rem',
                    textAlign: 'left'
                  }}>
                    {voucherStatus === 'sent' ? (
                      <div>
                        <strong style={{ color: '#34d399', fontSize: '0.88rem', display: 'block', marginBottom: '0.25rem' }}>
                          ✓ $25 First-Time Buyer Voucher Applied! (Quote Locked at ${total})
                        </strong>
                        <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                          Your -$25 discount is now active above, and your 25-Point Atlanta Buyer Checklist is unlocked:
                        </p>
                        <a
                          href="/dossiers/atlanta-buyer-inspection-checklist.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--color-gold)', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'underline' }}
                        >
                          📄 Open &amp; Print 25-Point Buyer Inspection Checklist &rarr;
                        </a>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveVoucher}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <strong style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>
                            🎁 Still House Hunting? Lock In -$25 Off + Free Buyer Checklist
                          </strong>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-mid)', margin: '0 0 0.6rem 0', lineHeight: 1.35 }}>
                          Don&apos;t have an address or binding date yet? Enter your email to apply an instant <strong>$25 Voucher</strong> to this quote and unlock our printable 25-Point Atlanta Buyer Checklist.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            required
                            placeholder="Your First Name"
                            aria-label="Your First Name"
                            value={voucherName}
                            onChange={(e) => setVoucherName(e.target.value)}
                            style={{ padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.35)', color: '#ffffff', fontSize: '0.8rem', width: '100%' }}
                          />
                          <input
                            type="email"
                            required
                            placeholder="Your Email Address"
                            aria-label="Your Email Address"
                            value={voucherEmail}
                            onChange={(e) => setVoucherEmail(e.target.value)}
                            style={{ padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.35)', color: '#ffffff', fontSize: '0.8rem', width: '100%' }}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={voucherStatus === 'sending'}
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            borderRadius: '4px',
                            border: '1px solid var(--color-gold)',
                            background: 'rgba(212, 175, 55, 0.2)',
                            color: 'var(--color-gold)',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            cursor: voucherStatus === 'sending' ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {voucherStatus === 'sending' ? 'Applying Voucher...' : `Apply $25 Voucher & Unlock Checklist (Locks at $${discount === 'none' ? Math.max(0, total - 25) : total})`}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-mid)' }}>— OR SCHEDULE VIA HOMESCHEDULER —</span>
                </div>

                <a 
                  href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline" 
                  style={{ width: '100%', fontSize: '0.95rem', padding: '0.75rem', textAlign: 'center', display: 'block', borderColor: 'rgba(255,255,255,0.3)', color: 'var(--color-white)' }}
                >
                  Open 24/7 Automated Online Scheduler
                </a>
              </div>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Need specialized consulting or WDO explanations?
                </p>
                <a href="/concierge" style={{ color: 'var(--color-red-light)', fontWeight: 600, fontSize: '0.95rem' }}>
                  Live Concierge Consultation &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Why Inspection Pays for Itself & Value Guarantee */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          maxWidth: '1000px',
          margin: '3.5rem auto 0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#854d0e', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>ROI</div>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>
                Why a Foresight Inspection Pays for Itself
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                A professional physical inspection is engineered to save you thousands in unexpected repair costs. Our master-level reports identify hidden structural, electrical, and moisture issues upfront—providing you with clear, documented evidence to negotiate substantial seller repair credits or mandatory repairs before closing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Mobile Sticky Bottom Price Bar */}
    <div className="mobile-only-sticky-bar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99,
      background: 'var(--color-black)',
      borderTop: '2px solid var(--color-red)',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
    }}>
      <div>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-mid)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Est. Inspection Total</span>
        <strong style={{ fontSize: '1.35rem', color: 'var(--color-red)', fontWeight: 800 }}>
          ${total}
        </strong>
      </div>
      <a 
        href="#quote-request-form" 
        className="btn btn-primary" 
        style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 700 }}
      >
        Book / Request Online
      </a>
    </div>

    {showValueComparison && <ValueComparison />}
    </>
  );
}
