'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function HomeVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div 
      style={{ 
        maxWidth: '400px', 
        width: '100%', 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.03)', 
        padding: '0.85rem', 
        borderRadius: '20px', 
        border: '2px solid rgba(212,175,55,0.4)', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden', 
          borderRadius: '14px', 
          background: '#000000', 
          aspectRatio: '9/16' 
        }}
      >
        {isPlaying ? (
          <video
            autoPlay
            controls
            playsInline
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block', 
              borderRadius: '14px' 
            }}
          >
            <source src="/videos/foresight-home-systems.mp4" type="video/mp4" />
            <track kind="captions" srcLang="en" label="English" default />
            Your browser does not support the video tag.
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label="Play Atlanta Home Systems Field Audit Video"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <Image
              src="/images/home-systems-poster.webp"
              alt="Certified Master Inspector Christopher Boykin evaluating Atlanta home systems"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />

            {/* Gradient Overlay for Contrast */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 50%, rgba(15,23,42,0.65) 100%)',
                zIndex: 1,
              }}
            />

            {/* Top Pill Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: 'var(--color-gold)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                zIndex: 2,
                backdropFilter: 'blur(4px)',
              }}
            >
              🎥 CMI® Field Demonstration
            </div>

            {/* Pulsing Gold Play Button */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  paddingLeft: '4px',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.5)',
                  transition: 'transform 0.2s ease',
                }}
              >
                ▶
              </div>
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                Watch Field Audit (1:19)
              </span>
            </div>

            {/* Bottom Duration / SOP Note */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                color: '#CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              <span>⏱ 1 Min 19 Sec</span>
              <span>1080p HD Audio</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
