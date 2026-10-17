'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const STR_REQUIREMENTS = [
  {
    id: 'smoke_co',
    category: 'Life Safety',
    title: 'Interconnected Smoke & Carbon Monoxide Alarms',
    description: 'Working interconnected smoke alarms in all bedrooms/hallways and CO alarms on each sleeping level (City of Atlanta Code Sec. 110).'
  },
  {
    id: 'fire_extinguisher',
    category: 'Fire Safety',
    title: 'Certified 2A:10B:C Fire Extinguisher on Each Level',
    description: 'Operational fire extinguisher mounted in visible, easily accessible locations with current inspection gauge tag.'
  },
  {
    id: 'egress',
    category: 'Emergency Egress',
    title: 'Unobstructed Egress Windows & Doors in Bedrooms',
    description: 'All designated guest bedrooms must meet minimum net clear opening standards without keyed locks or security bars.'
  },
  {
    id: 'electrical',
    category: 'Electrical Safety',
    title: 'GFCI Outlets & Covered Electrical Panels',
    description: 'Functional GFCI protection within 6ft of sinks/moisture, with zero open knockouts, double-taps, or exposed wiring.'
  },
  {
    id: 'hvac_water',
    category: 'Mechanical Capacity',
    title: 'Water Heater & HVAC Adequate Capacity for Max Occupancy',
    description: 'Reliable hot water output, unobstructed flue venting, and functional heating/cooling sized for permitted guest capacity.'
  },
  {
    id: 'evac_plan',
    category: 'Guest Compliance',
    title: 'Posted Emergency Evacuation Map & 24/7 Local Contact',
    description: 'Floor plan showing primary/secondary exits, fire extinguisher locations, and local emergency contact posted inside entryway.'
  }
];

export default function StrComplianceChecklist() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const total = STR_REQUIREMENTS.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const score = Math.round((completed / total) * 100);

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: 'var(--radius-lg, 12px)',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      margin: '2.5rem 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{
            fontSize: '0.8rem',
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--color-gold, #D4AF37)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Interactive Host Tool
          </span>
          <h3 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: 800, margin: '0.5rem 0 0.25rem' }}>
            City of Atlanta STR Permit Readiness Checklist
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>
            Self-check your property against City of Atlanta Chapter 110 short-term rental life-safety inspection criteria.
          </p>
        </div>

        <div style={{
          background: score === 100 ? '#ECFDF5' : score >= 60 ? '#FFFBEB' : '#FEF2F2',
          border: `1px solid ${score === 100 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}`,
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          textAlign: 'center',
          minWidth: '130px'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: score === 100 ? '#065F46' : score >= 60 ? '#92400E' : '#991B1B' }}>
            {score}%
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
            Readiness Score
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.75rem' }}>
        <div style={{
          background: score === 100 ? '#10B981' : 'linear-gradient(90deg, #F59E0B 0%, #D4AF37 100%)',
          width: `${score}%`,
          height: '100%',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Checkbox Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STR_REQUIREMENTS.map((req) => {
          const isDone = !!checkedItems[req.id];
          return (
            <div
              key={req.id}
              onClick={() => toggleItem(req.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: '8px',
                border: isDone ? '1px solid #10B981' : '1px solid #E2E8F0',
                background: isDone ? '#F0FDF4' : '#F8FAFC',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => {}}
                style={{ marginTop: '0.2rem', accentColor: '#10B981', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                  {req.category}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0.15rem 0' }}>
                  {req.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
                  {req.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic CTA Banner */}
      <div style={{
        background: '#0F172A',
        color: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h4 style={{ margin: 0, color: 'var(--color-gold, #D4AF37)', fontSize: '1.1rem', fontWeight: 700 }}>
            {score === 100 ? 'Property Appears Permit-Ready!' : 'Need Official Life-Safety Certification?'}
          </h4>
          <p style={{ margin: '0.35rem 0 0', color: '#CBD5E1', fontSize: '0.9rem', maxWidth: '550px' }}>
            City of Atlanta requires licensed third-party inspection documentation before issuing or renewing your STR operating license. Foresight provides flat-rate $595 certified life-safety inspections with 24-hour report delivery.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
          >
            Book $595 STR Inspection
          </a>
          <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
            Calculate Fees
          </Link>
        </div>
      </div>
    </div>
  );
}
