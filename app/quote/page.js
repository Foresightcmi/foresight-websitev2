'use client';
import { useState, useEffect } from 'react';

export default function Quote() {
  const [propertyType, setPropertyType] = useState('single-family'); // 'single-family', 'condo'
  const [serviceType, setServiceType] = useState('buyer'); // 'buyer', 'seller', 'new-construction', 'warranty'
  const [sqftRange, setSqftRange] = useState('');
  const [foundation, setFoundation] = useState('slab'); // 'slab', 'basement', 'crawlspace'
  const [ageTier, setAgeTier] = useState('under-50'); // 'under-50', 'over-50', '86+'
  
  const [addons, setAddons] = useState({
    radon: false,
    termite: false,
    pool: false,
    lowFlow: false,
    buildfax: false
  });

  // Reset square footage selection when property type or service type changes
  useEffect(() => {
    const ranges = getSqftRanges();
    if (ranges.length > 0) {
      setSqftRange(ranges[0].value);
    }
  }, [propertyType, serviceType]);

  // Available ranges depending on inputs
  const getSqftRanges = () => {
    if (propertyType === 'condo') {
      if (serviceType === 'seller') {
        return [
          { label: 'Up to 1,000 sq ft', value: 'condo-up-to-1000', price: 250 },
          { label: '1,001 - 1,800 sq ft', value: 'condo-1001-1800', price: 275 }
        ];
      } else {
        return [
          { label: 'Up to 1,000 sq ft', value: 'condo-up-to-1000', price: 295 },
          { label: '1,001 - 1,800 sq ft', value: 'condo-1001-1800', price: 325 }
        ];
      }
    }

    // Single family/townhome
    switch (serviceType) {
      case 'seller': // Pre-listing seller page 270+
        return [
          { label: 'Up to 2,000 sq ft', value: 'seller-up-to-2000', price: 365 },
          { label: '2,001 - 2,500 sq ft', value: 'seller-2001-2500', price: 385 },
          { label: '2,501 - 3,000 sq ft', value: 'seller-2501-3000', price: 415 },
          { label: '3,001 - 3,500 sq ft', value: 'seller-3001-3500', price: 435 },
          { label: '3,501 - 4,000 sq ft', value: 'seller-3501-4000', price: 465 },
          { label: '4,001 - 4,500 sq ft', value: 'seller-4001-4500', price: 485 },
          { label: '4,501 - 5,000 sq ft', value: 'seller-4501-5000', price: 515 },
          { label: 'Over 5,000 sq ft', value: 'custom-call', price: 'custom' }
        ];
      case 'new-construction': // New construction page 155+
        return [
          { label: 'Up to 1,800 sq ft', value: 'new-up-to-1800', price: 355 },
          { label: '1,801 - 2,500 sq ft', value: 'new-1801-2500', price: 385 },
          { label: '2,501 - 3,000 sq ft', value: 'new-2501-3000', price: 415 },
          { label: '3,001 - 3,500 sq ft', value: 'new-3001-3500', price: 445 },
          { label: '3,501 - 4,000 sq ft', value: 'new-3501-4000', price: 475 },
          { label: '4,001 - 4,500 sq ft', value: 'new-4001-4500', price: 505 },
          { label: '4,501 - 5,000 sq ft', value: 'new-4501-5000', price: 535 },
          { label: 'Over 5,000 sq ft', value: 'custom-call', price: 'custom' }
        ];
      case 'warranty': // 11-Month Warranty page 216+
        return [
          { label: 'Up to 2,000 sq ft', value: 'warranty-up-to-2000', price: 335 },
          { label: '2,001 - 2,500 sq ft', value: 'warranty-2001-2500', price: 365 },
          { label: '2,501 - 3,000 sq ft', value: 'warranty-2501-3000', price: 395 },
          { label: '3,001 - 3,500 sq ft', value: 'warranty-3001-3500', price: 425 },
          { label: '3,501 - 4,000 sq ft', value: 'warranty-3501-4000', price: 455 },
          { label: '4,001 - 4,500 sq ft', value: 'warranty-4001-4500', price: 485 },
          { label: '4,501 - 5,000 sq ft', value: 'warranty-4501-5000', price: 515 },
          { label: 'Over 5,000 sq ft', value: 'custom-call', price: 'custom' }
        ];
      case 'buyer':
      default: // Flyer pricing standard resale pre-purchase
        return [
          { label: 'Up to 1,000 sq ft', value: 'sf-up-to-1000', price: 345 },
          { label: '1,001 - 1,500 sq ft', value: 'sf-1001-1500', price: 375 },
          { label: '1,501 - 2,000 sq ft', value: 'sf-1501-2000', price: 425 },
          { label: '2,001 - 2,500 sq ft', value: 'sf-2001-2500', price: 475 },
          { label: '2,501 - 3,000 sq ft', value: 'sf-2501-3000', price: 525 },
          { label: '3,001 - 3,500 sq ft', value: 'sf-3001-3500', price: 575 },
          { label: '3,501 - 4,000 sq ft', value: 'sf-3501-4000', price: 625 },
          { label: '4,001 - 4,500 sq ft', value: 'sf-4001-4500', price: 675 },
          { label: '4,501 - 5,000 sq ft', value: 'sf-4501-5000', price: 775 },
          { label: '5,001+ sq ft', value: 'custom-call', price: 'custom' }
        ];
    }
  };

  // Calculations logic
  const calculateTotal = () => {
    const currentRanges = getSqftRanges();
    const selectedRange = currentRanges.find(r => r.value === sqftRange);
    
    if (!selectedRange) return { total: 0, isCustom: false };
    if (selectedRange.price === 'custom' || ageTier === '86+') {
      return { total: 'Custom Quote', isCustom: true };
    }

    let base = selectedRange.price;
    let extra = 0;

    // Foundation fee (only for single family)
    if (propertyType === 'single-family') {
      if (foundation === 'basement') extra += 50;
      if (foundation === 'crawlspace') extra += 25;
    }

    // Age fee
    if (ageTier === 'over-50') {
      extra += 50;
    }

    // Addons
    if (addons.radon) extra += 175; // Continuous monitor sub-contracted rate
    if (addons.pool) extra += 125;  // Pool/spa add-on
    if (addons.lowFlow) extra += 100; // DeKalb low flow compliance
    if (addons.buildfax) extra += 15; // Property permit report

    // Termite / WDO (based on foundation type in GA WDO regulations)
    if (addons.termite) {
      if (foundation === 'slab') extra += 100;
      else if (foundation === 'basement') extra += 125;
      else if (foundation === 'crawlspace') extra += 175;
      else extra += 100;
    }

    return { total: base + extra, isCustom: false };
  };

  const { total, isCustom } = calculateTotal();

  const handleAddonToggle = (addon) => {
    setAddons(prev => ({ ...prev, [addon]: !prev[addon] }));
  };

  return (
    <section className="section bg-gray-light">
      <div className="container">
        <div className="section-title">
          <h1>Foresight Pricing Estimator</h1>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0' }}>
            Instant, direct, and completely transparent quotes. Based directly on our registered local service fees.
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
              </select>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>3. Finished / Heated Size</h2>
            <div className="form-group">
              <label className="form-label">Total Heated Square Footage</label>
              <select 
                className="form-control"
                value={sqftRange}
                onChange={(e) => setSqftRange(e.target.value)}
              >
                {getSqftRanges().map((r, i) => (
                  <option key={i} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {propertyType === 'single-family' && (
              <>
                <h2 style={{ marginBottom: '1.5rem' }}>4. Foundation Details</h2>
                <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'slab'} onChange={() => setFoundation('slab')} />
                    Slab ($0)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'basement'} onChange={() => setFoundation('basement')} />
                    Unfinished/Partial Basement (+$50)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="foundation" checked={foundation === 'crawlspace'} onChange={() => setFoundation('crawlspace')} />
                    Crawlspace (+$25)
                  </label>
                </div>
              </>
            )}

            <h2 style={{ marginBottom: '1.5rem' }}>5. Age of Property</h2>
            <div className="form-group">
              <label className="form-label">Property Construction Age</label>
              <select 
                className="form-control"
                value={ageTier}
                onChange={(e) => setAgeTier(e.target.value)}
              >
                <option value="under-50">Under 50 Years Old (+$0)</option>
                <option value="over-50">Home Over 50 Years Old (+$50)</option>
                <option value="86+">Historic 86+ Years Old (Call for Price)</option>
              </select>
            </div>

            <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>6. Specialized Services & Add-ons</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={addons.radon} 
                  onChange={() => handleAddonToggle('radon')} 
                />
                <div>
                  <span style={{ fontWeight: 600, display: 'block' }}>Radon Gas Testing (+ $175)</span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Continuous 48-hour professional diagnostic monitoring.</span>
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
                    Termite & WDO Inspection (+ ${foundation === 'slab' ? 100 : foundation === 'basement' ? 125 : 175})
                  </span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>
                    Performed by a licensed professional partner. Generates Official Georgia Wood Infestation Report. Price adjusted based on foundation ({foundation}).
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
                  <span style={{ fontWeight: 600, display: 'block' }}>Pool & Spa Evaluation (+ $125)</span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-gray-dark)' }}>Comprehensive pumps, electrical, filters, and shell check.</span>
                </div>
              </label>

              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={addons.lowFlow} 
                  onChange={() => handleAddonToggle('lowFlow')} 
                />
                <div>
                  <span style={{ fontWeight: 600, display: 'block' }}>DeKalb Low-Flow Compliance Certification (+ $100)</span>
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
          </div>

          <div style={{ position: 'sticky', top: '120px' }}>
            <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'var(--color-white)', boxShadow: 'var(--shadow-xl)' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid var(--color-gray-dark)', paddingBottom: '1rem' }}>
                Estimated Pricing Summary
              </h3>
              
              <div style={{ fontSize: isCustom ? '2.5rem' : '4rem', fontWeight: 800, color: 'var(--color-red)', marginBottom: '0.5rem', lineHeight: 1 }}>
                {isCustom ? total : `$${total}`}
              </div>
              
              <p style={{ color: 'var(--color-gray)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                Calculated on real Atlanta area inspection schedules. No hidden booking charges.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-gray-mid)' }}>
                <li>✓ Two trained inspectors on site</li>
                <li>✓ Thermal infrared scan included</li>
                <li>✓ Digital summary with photos & video</li>
                <li>✓ Georgia-certified master level execution</li>
              </ul>
              
              <div style={{ background: 'rgba(211, 47, 47, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(211, 47, 47, 0.2)' }}>
                <p style={{ color: 'var(--color-white)', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4, textAlign: 'center' }}>
                  Don't just get a checklist—get <span style={{ color: 'var(--color-red)' }}>$10,000</span> in real legal and financial protection. Secure your home investment with Foresight Home Inspections.
                </p>
              </div>

              <a 
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary" 
                style={{ width: '100%', fontSize: '1.125rem', padding: '1rem' }}
              >
                {isCustom ? 'Request Custom Quote' : 'Book Online Instantly'}
              </a>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Need specialized consulting or WDO explanations?</p>
                <a href="/ask-twin" style={{ color: 'var(--color-red-light)', fontWeight: 600, fontSize: '0.95rem' }}>
                  Ask Foresight AI →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
