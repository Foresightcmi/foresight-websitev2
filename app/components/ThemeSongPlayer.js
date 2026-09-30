'use client';

import { useState, useRef, useCallback } from 'react';

export default function ThemeSongPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  const togglePlay = useCallback(() => {
    // 1. Pause all video elements across the entire page
    if (typeof document !== 'undefined') {
      document.querySelectorAll('video').forEach((video) => {
        if (!video.paused) {
          video.pause();
        }
      });
    }

    // 2. Pause the background audio player floating pill so they do not overlap
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('foresight_pause_bg_music'));
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (!audioSrc) {
      // Lazy-load audio source ONLY on explicit user click to prevent heavy 2.45MB payload on page load
      setAudioSrc('/audio/foresight-anthem.mp3');
      audio.src = '/audio/foresight-anthem.mp3';
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [audioSrc, isPlaying]);

  return (
    <div 
      style={{ 
        background: 'rgba(15, 23, 42, 0.85)', 
        border: '1.5px solid rgba(212, 175, 55, 0.35)', 
        borderRadius: '1rem', 
        padding: '1.25rem 1.5rem', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '640px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <audio 
        ref={audioRef}
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Foresight Anthem' : 'Play Foresight Anthem'}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isPlaying ? 'var(--color-gold)' : 'linear-gradient(135deg, #d4af37, #f3e5ab)',
              color: '#0f172a',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
              transition: 'transform 0.15s ease',
              flexShrink: 0
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div>
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem', letterSpacing: '0.02em' }}>
              Foresight Anthem &bull; &ldquo;Choose Foresight&rdquo;
            </div>
            <div style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
              <span>{isPlaying ? '🎵 Playing official audio track' : '🎧 Official Metro Atlanta Theme Song'}</span>
            </div>
          </div>
        </div>

        <a 
          href="/audio/foresight-anthem.mp3" 
          download="foresight-anthem.mp3" 
          style={{ 
            color: 'var(--color-gold)', 
            textDecoration: 'none', 
            fontWeight: 700, 
            fontSize: '0.85rem',
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            background: 'rgba(212, 175, 55, 0.08)'
          }}
        >
          ⬇️ Download MP3
        </a>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.82rem', color: '#CBD5E1', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
        <span>📞 Inspection Hotline: <strong style={{ color: '#FFFFFF' }}>678-480-2110</strong></span>
        <span>🛡️ Two Inspectors On Every Job</span>
        <span>⭐ Certified Master Inspector®</span>
      </div>
    </div>
  );
}
