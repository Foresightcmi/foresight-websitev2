'use client';

import { useRef, useCallback } from 'react';

export default function ThemeSongPlayer() {
  const audioRef = useRef(null);

  const handlePlay = useCallback(() => {
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
  }, []);

  return (
    <div 
      style={{ 
        background: 'rgba(15, 23, 42, 0.7)', 
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '1rem', 
        padding: '1.25rem 1.5rem', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <audio 
        ref={audioRef}
        controls 
        preload="metadata" 
        src="/audio/foresight-anthem.mp3" 
        onPlay={handlePlay}
        style={{ width: '100%', maxWidth: '600px', height: '48px', outline: 'none' }}
      >
        Your browser does not support the audio element.
      </audio>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', fontSize: '0.82rem', color: '#94A3B8', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span>📞 Inspection Hotline: <strong>678-480-2110</strong></span>
        <span>🛡️ Two Inspectors On Every Job</span>
        <a href="/audio/foresight-anthem.mp3" download="foresight-anthem.mp3" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          ⬇️ Download MP3
        </a>
      </div>
    </div>
  );
}
