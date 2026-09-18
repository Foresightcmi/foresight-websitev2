'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export default function ThermalSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(Math.round(percentage));
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const triggerGtag = (label) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'thermal_slider_interaction', {
        event_category: 'interactive_widget',
        event_label: label,
      });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', background: '#0F172A', borderRadius: 'var(--radius-lg)', border: '1px solid #334155', padding: '1.75rem', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', fontSize: '0.8rem', padding: '0.25rem 0.75rem', marginBottom: '0.35rem', display: 'inline-block' }}>
            🔬 Interactive Diagnostic Comparison
          </span>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            Visual Daylight vs. FLIR® Infrared Thermal Scan
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', background: '#1E293B', padding: '0.25rem', borderRadius: '50px', border: '1px solid #334155' }}>
          <button
            type="button"
            onClick={() => { setSliderPosition(0); triggerGtag('view_visual_only'); }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: sliderPosition === 0 ? 'var(--color-gold)' : 'transparent',
              color: sliderPosition === 0 ? '#0F172A' : '#94A3B8',
              transition: 'all 0.2s'
            }}
          >
            👁️ Visual
          </button>
          <button
            type="button"
            onClick={() => { setSliderPosition(50); triggerGtag('view_split_50'); }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: sliderPosition > 0 && sliderPosition < 100 ? 'var(--color-gold)' : 'transparent',
              color: sliderPosition > 0 && sliderPosition < 100 ? '#0F172A' : '#94A3B8',
              transition: 'all 0.2s'
            }}
          >
            🌗 50/50 Split
          </button>
          <button
            type="button"
            onClick={() => { setSliderPosition(100); triggerGtag('view_flir_only'); }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: sliderPosition === 100 ? 'var(--color-gold)' : 'transparent',
              color: sliderPosition === 100 ? '#0F172A' : '#94A3B8',
              transition: 'all 0.2s'
            }}
          >
            🔥 FLIR Thermal
          </button>
        </div>
      </div>

      {/* Interactive Image Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          maxHeight: '480px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          cursor: 'ew-resize',
          userSelect: 'none',
          border: '1px solid #475569'
        }}
      >
        {/* Background Image: FLIR Infrared Thermal */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="/images/thermal-ceiling.webp"
            alt="FLIR Thermal Infrared scan of ceiling showing cold water leak anomaly"
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.9)', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            🔥 FLIR® INFRARED (ACTIVE LEAK)
          </div>
        </div>

        {/* Foreground Image: Visual Daylight (Clipped by slider position) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${sliderPosition}%`,
            overflow: 'hidden',
            borderRight: '2px solid var(--color-gold)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, width: containerRef.current ? containerRef.current.clientWidth : '100%', height: '100%' }}>
            <Image
              src="/images/visual-ceiling.webp"
              alt="Visual camera photograph of ceiling showing no obvious water damage"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em', border: '1px solid #475569' }}>
            👁️ VISUAL (LOOKS PERFECTLY DRY)
          </div>
        </div>

        {/* Slider Handle Grip */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${sliderPosition}%`,
            transform: 'translate(-50%, -50%)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--color-gold)',
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            fontSize: '1rem',
            fontWeight: 800
          }}
        >
          ⇄
        </div>
      </div>

      {/* Range Slider Track for Keyboard/Touch Accessibility */}
      <div style={{ marginTop: '1rem' }}>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => {
            setSliderPosition(Number(e.target.value));
            triggerGtag('slider_scrub');
          }}
          aria-label="Drag slider to compare visual daylight view and FLIR thermal infrared scan"
          style={{
            width: '100%',
            accentColor: 'var(--color-gold)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.78rem', marginTop: '0.25rem' }}>
          <span>← Drag Left for FLIR Thermal Infrared</span>
          <span>Drag Right for Visual Daylight View →</span>
        </div>
      </div>

      {/* Forensic Diagnostics Telemetry Grid */}
      <div style={{ marginTop: '1.25rem', background: '#030712', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid #1E293B', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div>
          <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Drywall Surface Temp</span>
          <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>72.4°F (Ambient)</strong>
        </div>
        <div>
          <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Thermal Anomaly ΔT</span>
          <strong style={{ color: '#60A5FA', fontSize: '1rem' }}>63.8°F (-8.6°F Delta)</strong>
        </div>
        <div>
          <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Wood Moisture Equiv (WME)</span>
          <strong style={{ color: '#F87171', fontSize: '1rem' }}>24.2% (Active Fungal Risk)</strong>
        </div>
        <div>
          <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Foresight Action</span>
          <strong style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}>Flagged on GAR F404</strong>
        </div>
      </div>

      <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.85rem', marginBottom: 0, textAlign: 'center' }}>
        ⚡ <strong>Included Free:</strong> While other Atlanta inspection firms charge $75–$150 extra for thermal scans or omit them entirely, Foresight includes full FLIR® infrared audits on every full home inspection.
      </p>
    </div>
  );
}
