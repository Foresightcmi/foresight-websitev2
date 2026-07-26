'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function InstantQuoteWidget() {
  const [propertyType, setPropertyType] = useState('single-family');
  const [squareFeet, setSquareFeet] = useState(2000);
  const [foundation, setFoundation] = useState('slab');
  const [includeRadon, setIncludeRadon] = useState(false);
  const [includeTermite, setIncludeTermite] = useState(false);
  const [includeSewer, setIncludeSewer] = useState(false);

  // Calculate estimated price
  const calculatePrice = () => {
    let base = 345;
    if (propertyType === 'condo') {
      base = 295;
    } else if (propertyType === 'multi-family') {
      base = 495;
    } else {
      // Single Family square footage scale
      if (squareFeet <= 1500) base = 345;
      else if (squareFeet <= 2500) base = 395;
      else if (squareFeet <= 3500) base = 445;
      else if (squareFeet <= 4500) base = 495;
      else base = 545;
    }

    // Foundation condition complexity fee ($75 per condition)
    let foundationFee = 0;
    if (foundation === 'crawlspace' || foundation === 'basement') foundationFee = 75;
    if (foundation === 'crawlspace-basement') foundationFee = 150;

    let addOns = 0;
    if (includeRadon) addOns += 200;
    if (includeTermite) addOns += 110;
    if (includeSewer) addOns += 425;

    return base + foundationFee + addOns;
  };

  const estimatedTotal = calculatePrice();

  return (
    <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge" style={{ background: 'var(--color-red)', color: 'white', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'inline-block' }}>
          ⚡ Instant Price Calculator
        </span>
        <h3 style={{ color: 'white', fontSize: '1.75rem', margin: 0 }}>
          Estimate Your Inspection Cost
        </h3>
        <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.975rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
          Transparent pricing with two certified inspectors &amp; $10,000 warranty included.
        </p>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Property Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-gray-mid)', marginBottom: '0.5rem', fontWeight: 600 }}>
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: '#1f2937', color: 'white', border: '1px solid #374151', fontSize: '1rem' }}
          >
            <option value="single-family">Single Family House</option>
            <option value="condo">Condo / Townhome</option>
            <option value="multi-family">Multi-Family Duplex/Triplex</option>
          </select>
        </div>

        {/* Square Footage Slider */}
        {propertyType !== 'condo' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-gray-mid)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Approx. Size: <strong style={{ color: 'white' }}>{squareFeet.toLocaleString()} sq ft</strong>
            </label>
            <input
              type="range"
              min="1000"
              max="5500"
              step="250"
              value={squareFeet}
              onChange={(e) => setSquareFeet(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-red)', height: '8px', cursor: 'pointer', marginTop: '0.5rem' }}
            />
          </div>
        )}
      </div>

      {/* Foundation Type */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-gray-mid)', marginBottom: '0.5rem', fontWeight: 600 }}>
          Foundation Type
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { id: 'slab', label: 'Slab on Grade' },
            { id: 'basement', label: 'Basement (+ $75)' },
            { id: 'crawlspace', label: 'Crawlspace (+ $75)' },
            { id: 'crawlspace-basement', label: 'Crawlspace & Basement (+ $150)' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFoundation(f.id)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: foundation === f.id ? '2px solid var(--color-red)' : '1px solid #374151',
                background: foundation === f.id ? 'var(--color-red)' : '#1f2937',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add-On Services */}
      <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#1f2937', borderRadius: 'var(--radius-md)', border: '1px solid #374151' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-gray-mid)', marginBottom: '0.75rem', fontWeight: 600 }}>
          Optional Add-On Diagnostics:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.95rem' }}>
            <input
              type="checkbox"
              checked={includeRadon}
              onChange={(e) => setIncludeRadon(e.target.checked)}
              style={{ accentColor: 'var(--color-red)', width: '18px', height: '18px' }}
            />
            <span>☢️ 48-Hour Radon Gas Testing (<strong>+$200</strong>)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.95rem' }}>
            <input
              type="checkbox"
              checked={includeTermite}
              onChange={(e) => setIncludeTermite(e.target.checked)}
              style={{ accentColor: 'var(--color-red)', width: '18px', height: '18px' }}
            />
            <span>🐜 Official Georgia Termite/WDO Report (<strong>+$110</strong>)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.95rem' }}>
            <input
              type="checkbox"
              checked={includeSewer}
              onChange={(e) => setIncludeSewer(e.target.checked)}
              style={{ accentColor: 'var(--color-red)', width: '18px', height: '18px' }}
            />
            <span>🚽 HD Sewer Scope Camera Inspection (<strong>+$425</strong>)</span>
          </label>
        </div>
      </div>

      {/* Result & CTA */}
      <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #374151' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-mid)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Estimated Total Price
        </span>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-red)', margin: '0.25rem 0 1rem 0', lineHeight: 1 }}>
          ${estimatedTotal.toLocaleString()}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-mid)', marginBottom: '1.5rem' }}>
          Includes 2 Certified Inspectors + FLIR Thermal Scan + $10,000 Elite Warranty ($0 Deductible).
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', flex: 1, minWidth: '200px' }}
          >
            📅 Lock In Schedule
          </a>
          <a
            href="tel:6784802110"
            className="btn btn-outline"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderColor: 'white', color: 'white', flex: 1, minWidth: '200px' }}
          >
            📞 Call 678-480-2110
          </a>
        </div>
      </div>
    </div>
  );
}
