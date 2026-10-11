'use client';

import { useRef, useState } from 'react';

const CHAPTERS = [
  { time: 0, label: '0:00 - Introduction & Two-Inspector Standard' },
  { time: 15, label: '0:15 - Mechanical & HVAC Air Distribution' },
  { time: 35, label: '0:35 - Electrical Panel & Infrared Thermal Diagnostics' },
  { time: 55, label: '0:55 - Crawlspace & Structural Foundations' },
  { time: 70, label: '1:10 - Same-Day Digital Reports & Guarantee' },
];

export default function WatchVideoPlayer() {
  const videoRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const seekTo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      setActiveChapter(seconds);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '840px', margin: '0 auto' }}>
      {/* Video Container */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          background: '#000000',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85)',
          border: '1px solid rgba(212, 175, 55, 0.4)'
        }}
      >
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster="/images/home-systems-poster.webp"
          style={{ 
            width: '100%', 
            maxHeight: '75vh', 
            aspectRatio: '9/16',
            maxHeight: '620px',
            display: 'block', 
            margin: '0 auto',
            objectFit: 'contain',
            background: '#090D16'
          }}
          onTimeUpdate={() => {
            if (videoRef.current) {
              const cur = videoRef.current.currentTime;
              const curChapter = [...CHAPTERS].reverse().find(c => cur >= c.time);
              if (curChapter && curChapter.time !== activeChapter) {
                setActiveChapter(curChapter.time);
              }
            }
          }}
        >
          <source src="/videos/foresight-home-systems.mp4" type="video/mp4" />
          <track kind="captions" srcLang="en" label="English" default />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Interactive Key Moments / Chapters */}
      <div 
        style={{ 
          marginTop: '1.5rem', 
          background: 'rgba(15, 23, 42, 0.75)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '12px', 
          padding: '1.25rem' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ⏱ Interactive Key Moments (Jump to System)
          </span>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Total Runtime: 1:19
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {CHAPTERS.map((chap) => {
            const isSelected = activeChapter === chap.time;
            return (
              <button
                key={chap.time}
                type="button"
                onClick={() => seekTo(chap.time)}
                style={{
                  background: isSelected ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#0F172A' : '#E2E8F0',
                  border: isSelected ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                ▶ {chap.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
