'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ERA_PROFILES = {
  'pre-1975': {
    label: 'Pre-1975 Historic / Vintage',
    risks: 'Cast iron sewer decay, galvanized water lines, ungrounded 2-prong electrical, potential asbestos/lead, and historic foundation settlement.',
    highPriorityAddons: ['Sewer Scope ($450)', 'Radon Testing ($250)', 'Termite WDO ($125+)']
  },
  '1978-1995': {
    label: '1978–1995 High-Liability Era',
    risks: 'Polybutylene (PB2110) plumbing pipe micro-fractures, Federal Pacific / Zinsco circuit breaker failure, and unsealed EIFS synthetic stucco moisture rot.',
    highPriorityAddons: ['Infrared Thermal Scan (Included Free)', 'Sewer Scope ($450)', 'HVAC Load Audit']
  },
  '1996-2015': {
    label: '1996–2015 Rapid Suburban Expansion',
    risks: 'Aging 15–20 yr architectural shingles, aging original HVAC compressors (R-22 phased out), vented crawlspace fungal growth, and deck ledger flashing leaks.',
    highPriorityAddons: ['Crawlspace Fungal Audit', 'HVAC Thermal Delta-T', 'Termite Clearance ($125+)']
  },
  '2016-present': {
    label: '2016–Present Modern & New Builds',
    risks: 'Rushed subcontractor framing, missing attic energy baffles, unsealed roof penetrations, crushed underground sewer laterals from grading, and HVAC duct disconnects.',
    highPriorityAddons: ['Pre-Drywall ($275+)', '11-Month Warranty ($335+)', 'Sewer Scope ($450)']
  }
};

export default function BlogRiskScannerWidget() {
  const [selectedEra, setSelectedEra] = useState('1978-1995');
  const profile = ERA_PROFILES[selectedEra];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      color: '#FFFFFF',
      borderRadius: 'var(--radius-lg, 12px)',
      padding: '2rem',
      margin: '3rem 0',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{
            fontSize: '0.75rem',
            background: 'rgba(212, 175, 55, 0.2)',
            color: 'var(--color-gold, #D4AF37)',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Interactive Due Diligence Tool
          </span>
          <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 800, margin: '0.5rem 0 0.25rem' }}>
            Instant Georgia Property Risk &amp; Era Scanner
          </h3>
          <p style={{ color: '#CBD5E1', fontSize: '0.925rem', margin: 0 }}>
            Select the approximate build year of the property you are evaluating to reveal critical regional hidden defect liabilities:
          </p>
        </div>
      </div>

      {/* Era Selector Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {Object.keys(ERA_PROFILES).map((eraKey) => (
          <button
            key={eraKey}
            type="button"
            onClick={() => setSelectedEra(eraKey)}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedEra === eraKey ? '2px solid var(--color-gold, #D4AF37)' : '1px solid #334155',
              background: selectedEra === eraKey ? 'rgba(212, 175, 55, 0.15)' : '#1E293B',
              color: selectedEra === eraKey ? 'var(--color-gold, #D4AF37)' : '#E2E8F0',
              transition: 'all 0.2s ease'
            }}
          >
            {eraKey === 'pre-1975' ? 'Pre-1975' : eraKey === '1978-1995' ? '1978–1995' : eraKey === '1996-2015' ? '1996–2015' : '2016–Now'}
          </button>
        ))}
      </div>

      {/* Dynamic Results Card */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-gold, #D4AF37)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          {profile.label} Diagnostic Profile
        </div>
        <p style={{ margin: '0 0 1rem 0', color: '#F1F5F9', fontSize: '0.95rem', lineHeight: 1.6 }}>
          <strong>Key Due Diligence Red Flags:</strong> {profile.risks}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#CBD5E1' }}>
          <strong style={{ color: '#FFFFFF' }}>Recommended Specialized Audits:</strong>
          {profile.highPriorityAddons.map((addon, idx) => (
            <span key={idx} style={{
              background: '#334155',
              color: '#F8FAFC',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {addon}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
          Need comprehensive Georgia contract due diligence planning?
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/risk-scanner" className="btn btn-outline-light" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Full Property Risk Scanner &rarr;
          </Link>
          <Link href="/due-diligence" className="btn btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Due Diligence Calculator &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
