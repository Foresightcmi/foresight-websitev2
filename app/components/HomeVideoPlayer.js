'use client';

import { useRef, useCallback } from 'react';

export default function HomeVideoPlayer() {
  const videoRef = useRef(null);

  const stopAllAudio = useCallback(() => {
    // 1. Immediately pause all HTML5 audio elements on the page
    if (typeof document !== 'undefined') {
      document.querySelectorAll('audio').forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
        }
      });
    }

    // 2. Dispatch custom event to notify BackgroundAudioPlayer to update its state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('foresight_pause_bg_music'));
    }
  }, []);

  const handlePlay = () => {
    stopAllAudio();
  };

  const handleClick = () => {
    stopAllAudio();
  };

  return (
    <div 
      onClick={handleClick}
      style={{ 
        maxWidth: '400px', 
        width: '100%', 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.03)', 
        padding: '0.85rem', 
        borderRadius: '20px', 
        border: '2px solid rgba(212,175,55,0.4)', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
        cursor: 'pointer'
      }}
    >
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '14px', background: '#000000', aspectRatio: '9/16' }}>
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster="/images/home-systems-poster.webp"
          onPlay={handlePlay}
          onClick={handleClick}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '14px' }}
        >
          <source src="/videos/foresight-home-systems.mp4" type="video/mp4" />
          <track kind="captions" srcLang="en" label="English" default />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
