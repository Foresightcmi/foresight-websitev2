'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VslModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="vsl-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="vsl-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0F172A',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '1.25rem',
          maxWidth: '720px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          color: '#FFFFFF'
        }}
      >
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(30, 41, 59, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎬</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
                The Foresight 60-Second Inspection Briefing
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
                Why Two Certified Inspectors On Every Job Save You Thousands
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close video briefing modal"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#94A3B8',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Video / Visual Container */}
        <div style={{ position: 'relative', width: '100%', background: '#000000', minHeight: '340px' }}>
          <video 
            controls 
            autoPlay 
            playsInline
            poster="/images/thermal-1.png"
            style={{ width: '100%', height: 'auto', maxHeight: '380px', display: 'block' }}
          >
            <source src="/videos/foresight-inspection-intro.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Core Direct-Response Bullets */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ color: '#D4AF37', fontSize: '1.1rem' }}>👥</span>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#FFFFFF', display: 'block' }}>Two Inspectors Every Job</strong>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>CMI leadership + partner speed and accuracy</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ color: '#34D399', fontSize: '1.1rem' }}>🔍</span>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#FFFFFF', display: 'block' }}>FLIR Infrared &amp; Drones</strong>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Catch hidden leaks &amp; roof defects</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ color: '#60A5FA', fontSize: '1.1rem' }}>🛡️</span>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#FFFFFF', display: 'block' }}>,000 Elite Warranty</strong>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}> deductible coverage for 90 days</span>
              </div>
            </div>
          </div>

          {/* Slogan & SER Trigger */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem', color: '#E2E8F0' }}>
              &ldquo;Because hindsight is expensive... <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>Choose Foresight!</span>&rdquo;
            </p>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.25rem', display: 'block' }}>
              Google &ldquo;Foresight Home Inspections&rdquo; to explore our 4.9-star verified client track record.
            </span>
          </div>

          {/* Fast Call to Action Buttons */}
          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-gold" 
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}
              onClick={onClose}
            >
              📅 Schedule Inspection Online
            </a>
            <a 
              href="tel:678-480-2110" 
              className="btn btn-outline-light" 
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 600, borderColor: '#D4AF37', color: '#D4AF37' }}
            >
              📞 Call 678-480-2110
            </a>
            <Link 
              prefetch={false} 
              href="/quote" 
              className="btn" 
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
              onClick={onClose}
            >
              📊 Instant Fee Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
