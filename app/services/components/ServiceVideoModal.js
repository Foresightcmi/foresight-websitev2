'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function ServiceVideoModal({ isOpen, onClose, briefing }) {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body background scrolling & double scrollbars
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Pause any background audio
    document.querySelectorAll('audio').forEach((audio) => {
      if (!audio.paused) audio.pause();
    });
    window.dispatchEvent(new CustomEvent('foresight_pause_bg_music'));

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !briefing || !mounted) return null;

  const {
    title,
    duration = '45-Sec Briefing',
    tagline = 'Why Two Certified Inspectors On Every Job Protect Your Home & Investment',
    videoSrc = '/videos/foresight-home-systems.mp4',
    poster = '/images/home-systems-poster.webp',
    takeaways = [],
    scheduleUrl = 'https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule',
    quoteUrl = '/quote',
  } = briefing;

  const modalContent = (
    <div
      className="service-video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 17, 32, 0.94)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
        isolation: 'isolate',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="service-video-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(165deg, #0B1120 0%, #151F32 100%)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '1.25rem',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 65px -12px rgba(0, 0, 0, 0.85)',
          position: 'relative',
          color: '#FFFFFF',
          overflow: 'hidden',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
      >
        {/* Header Bar - Fixed Top (Zero Layout Shift) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.15rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.85)',
            flexShrink: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3
                  id="service-modal-title"
                  style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '-0.01em' }}
                >
                  {title}
                </h3>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.18)',
                    color: 'var(--color-gold)',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {duration}
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94A3B8' }}>
                {tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close service video briefing"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#E2E8F0',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Video Player Container - Fixed 16:9 Aspect Ratio (Immune to Hover Glitch) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            maxHeight: '400px',
            background: '#000000',
            overflow: 'hidden',
            flexShrink: 0,
            contain: 'paint'
          }}
        >
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            poster={poster}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: '#000000'
            }}
            onPlay={() => {
              if (typeof document !== 'undefined') {
                document.querySelectorAll('audio').forEach((a) => {
                  if (!a.paused) a.pause();
                });
              }
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('foresight_pause_bg_music'));
              }
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            <track kind="captions" srcLang="en" label="English" default />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content Body - Scrollable Area with Stable Gutter (No Layout Jitter) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 1.75rem',
            scrollbarGutter: 'stable',
            scrollbarWidth: 'thin'
          }}
        >
          {/* CMI Credential Byline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem'
            }}
          >
            <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>CMI</span>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Expert Field Briefing
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F8FAFC' }}>
                Presented by Lead Certified Master Inspector® Christopher Boykin
              </span>
            </div>
          </div>

          {/* Takeaways List */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-gold)' }}>★</span> What You Learn In This Briefing
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {takeaways.map((point, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    fontSize: '0.92rem',
                    color: '#E2E8F0',
                    lineHeight: 1.55
                  }}
                >
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '0.85rem',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1.25rem',
              alignItems: 'center'
            }}
          >
            <a
              href={scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              style={{
                flex: 1,
                minWidth: '220px',
                textAlign: 'center',
                padding: '0.9rem 1.5rem',
                fontSize: '0.98rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)'
              }}
            >
              Schedule This Inspection &rarr;
            </a>
            <Link
              href={quoteUrl}
              onClick={onClose}
              className="btn btn-outline"
              style={{
                flex: 1,
                minWidth: '200px',
                textAlign: 'center',
                padding: '0.9rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              Instant Fee Calculator &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
