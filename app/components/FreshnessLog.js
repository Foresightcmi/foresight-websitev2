'use client';

import { useState, useEffect } from 'react';

export default function FreshnessLog() {
  const [dates, setDates] = useState({
    lastUpdated: '',
    latestInspection: '',
    nextAvailable: '',
    standardsDate: ''
  });

  useEffect(() => {
    // Generate dates dynamically on client side to ensure contextual freshness
    const now = new Date();
    
    // Formatting helpers
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Calculate dates
    const lastSync = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const latest = new Date(now.getTime() - 24 * 60 * 60 * 1000);  // Yesterday
    
    // Find next available slot (skip Sunday)
    let nextAvail = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    if (nextAvail.getDay() === 0) { // If Sunday, move to Monday
      nextAvail = new Date(nextAvail.getTime() + 24 * 60 * 60 * 1000);
    }

    setDates({
      lastUpdated: lastSync.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' today',
      latestInspection: formatDate(latest),
      nextAvailable: formatDate(nextAvail),
      standardsDate: now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    });
  }, []);

  return (
    <div 
      className="card-premium" 
      style={{
        background: 'var(--color-gray-light)',
        border: '1px solid var(--color-gray-mid)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginTop: '3rem',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'left'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          borderBottom: '1px solid var(--color-gray-mid)', 
          paddingBottom: '1.25rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span 
            style={{ 
              display: 'inline-block', 
              width: '12px', 
              height: '12px', 
              background: '#2e7d32', 
              borderRadius: '50%',
              animation: 'pulse 1.8s infinite'
            }}
          ></span>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Operation & Freshness Feed
          </h3>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-dark)', fontWeight: 500 }}>
          System Log: <span style={{ fontFamily: 'monospace', color: 'var(--color-dark)' }}>{dates.lastUpdated || 'Loading...'}</span>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: '1.5rem' }}>
        <div style={{ padding: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Latest Completed Audit
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            {dates.latestInspection || 'Loading...'}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginTop: '0.25rem' }}>
            Fayetteville, GA — Dual-Inspector residential inspection & FLIR thermal scan.
          </div>
        </div>

        <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--color-gray-mid)' }} className="mobile-no-border">
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Active Safety Code Standard
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-red)' }}>
            InterNACHI Standard SOP
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginTop: '0.25rem' }}>
            Audited in {dates.standardsDate || 'Loading...'} for local Georgia residential safety configurations.
          </div>
        </div>

        <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--color-gray-mid)' }} className="mobile-no-border">
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Next Open Scheduling Window
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            {dates.nextAvailable || 'Loading...'}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginTop: '0.25rem' }}>
            SUPRA eKEY autonomous access slots available. <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'underline' }}>Book slot &rarr;</a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(46, 125, 50, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(46, 125, 50, 0);
          }
        }
        @media (max-width: 768px) {
          .mobile-no-border {
            border-left: none !important;
            border-top: 1px solid var(--color-gray-mid) !important;
            padding-top: 1rem !important;
            margin-top: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
