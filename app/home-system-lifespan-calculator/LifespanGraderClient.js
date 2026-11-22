'use client';

import { useState } from 'react';
import Link from 'next/link';

const SYSTEMS = [
  { id: 'roof', label: 'Architectural Asphalt Roof', gaLifeYears: 18, replaceRange: [7500, 14200] },
  { id: 'hvac', label: 'Central Heat Pump / AC Condenser', gaLifeYears: 14, replaceRange: [5800, 11500] },
  { id: 'wh', label: 'Tank Water Heater', gaLifeYears: 10, replaceRange: [1450, 2900] },
  { id: 'panel', label: 'Main Electrical Service Panel', gaLifeYears: 35, replaceRange: [1800, 3800] }
];

export default function LifespanGraderClient() {
  const [ages, setAges] = useState({ roof: 14, hvac: 12, wh: 9, panel: 25 });
  const [plumbingType, setPlumbingType] = useState('copper_pex');

  const rows = SYSTEMS.map((sys) => {
    const age = Number(ages[sys.id] || 0);
    const pct = Math.min(100, Math.round((age / sys.gaLifeYears) * 100));
    const nearEnd = age >= sys.gaLifeYears - 2;
    return { ...sys, age, pct, nearEnd };
  });

  const flagged = rows.filter((r) => r.nearEnd);
  const polyFlag = plumbingType === 'polybutylene' || plumbingType === 'galvanized';
  const minExposure = flagged.reduce((s, r) => s + r.replaceRange[0], 0) + (polyFlag ? 4500 : 0);
  const maxExposure = flagged.reduce((s, r) => s + r.replaceRange[1], 0) + (polyFlag ? 12000 : 0);

  return (
    <section
      aria-label="Interactive Georgia Home System Lifespan Calculator"
      style={{ background: '#111827', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '14px', padding: '24px', color: '#f9fafb', marginBottom: '32px' }}
    >
      <h2 style={{ fontSize: '1.35rem', marginBottom: '8px', color: '#D4AF37' }}>
        Interactive Georgia Climate System Lifespan Grader
      </h2>
      <p style={{ fontSize: '0.95rem', color: '#d1d5db', marginBottom: '20px' }}>
        Move each slider to match the property disclosure or data-plate age. Georgia summer attic heat and red-clay humidity shorten national averages by 15% to 25%.
      </p>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
        {rows.map((r) => (
          <div key={r.id} style={{ background: '#1f2937', padding: '14px', borderRadius: '10px' }}>
            <label htmlFor={`age-${r.id}`} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '6px' }}>
              <span>{r.label}</span>
              <span style={{ color: r.nearEnd ? '#f87171' : '#34d399' }}>
                {r.age} yrs (GA avg life: {r.gaLifeYears} yrs)
              </span>
            </label>
            <input
              id={`age-${r.id}`}
              type="range"
              min="0"
              max="45"
              value={r.age}
              onChange={(e) => setAges((prev) => ({ ...prev, [r.id]: Number(e.target.value) }))}
              style={{ width: '100%', minHeight: '44px', cursor: 'pointer' }}
            />
          </div>
        ))}

        <div style={{ background: '#1f2937', padding: '14px', borderRadius: '10px' }}>
          <label htmlFor="plumbing-material" style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            Supply Plumbing Material
          </label>
          <select
            id="plumbing-material"
            value={plumbingType}
            onChange={(e) => setPlumbingType(e.target.value)}
            style={{ width: '100%', minHeight: '44px', borderRadius: '8px', padding: '8px 12px', background: '#111827', color: '#f9fafb', border: '1px solid #374151' }}
          >
            <option value="copper_pex">Copper or Cross-Linked PEX</option>
            <option value="polybutylene">Polybutylene Grey Pipe (1978–1995)</option>
            <option value="galvanized">Threaded Galvanized Steel (Pre-1970)</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#0f172a', borderLeft: '4px solid #D4AF37', padding: '16px', borderRadius: '8px' }}>
        <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>
          Estimated Near-Term Capital &amp; Seller Credit Exposure:{' '}
          <span style={{ color: '#D4AF37' }}>
            {minExposure > 0 ? `$${minExposure.toLocaleString()} – $${maxExposure.toLocaleString()}` : '$0 Immediate End-of-Life Systems Flagged'}
          </span>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '14px' }}>
          Compare against a Single-Family Home Inspection (From $345; Condos From $295; Pre-Drywall From $275; New Construction From $400; Auxiliary Diagnostics Call for Quote) with two certified inspectors and calibrated infrared thermal imaging included.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/quote" style={{ background: '#D4AF37', color: '#111827', fontWeight: 700, padding: '12px 18px', borderRadius: '8px', textDecoration: 'none' }}>
            Get Instant Inspection Quote
          </Link>
          <Link href="/repair-credit-calculator" style={{ border: '1px solid #D4AF37', color: '#D4AF37', fontWeight: 600, padding: '12px 18px', borderRadius: '8px', textDecoration: 'none' }}>
            Model Georgia Repair Amendment Credit
          </Link>
        </div>
      </div>
    </section>
  );
}
