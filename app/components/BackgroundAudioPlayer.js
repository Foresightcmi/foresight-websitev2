'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export default function BackgroundAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const audioRef = useRef(null);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check if user explicitly paused during this session
    if (typeof window !== 'undefined') {
      const userPaused = sessionStorage.getItem('foresight_bg_audio_paused');
      if (userPaused === 'true') return;
    }

    audio.volume = 0.22;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was restricted by browser policy (e.g. Chrome / iOS Safari require gesture).
          // Listen to the very first user gesture anywhere on the page to start playing immediately.
          const unlockAndPlay = () => {
            const stillPaused = sessionStorage.getItem('foresight_bg_audio_paused');
            if (stillPaused !== 'true' && audio.paused) {
              audio.volume = 0.22;
              audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
            removeInteractionListeners();
          };

          const interactionEvents = ['click', 'touchstart', 'touchend', 'scroll', 'wheel', 'pointerdown', 'keydown'];
          const removeInteractionListeners = () => {
            interactionEvents.forEach(evt => window.removeEventListener(evt, unlockAndPlay));
          };

          interactionEvents.forEach(evt => {
            window.addEventListener(evt, unlockAndPlay, { once: true, passive: true });
          });
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('foresight_bg_audio_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
        return;
      }
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.22;

    // 1. Immediately attempt to play when site is opened
    attemptPlay();

    // 2. Listen to voice modal coordination events
    const handlePauseBgMusic = () => {
      if (audio && !audio.paused) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handleResumeBgMusic = () => {
      const userPaused = sessionStorage.getItem('foresight_bg_audio_paused');
      if (userPaused !== 'true' && audio && audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener('foresight_pause_bg_music', handlePauseBgMusic);
    window.addEventListener('foresight_resume_bg_music', handleResumeBgMusic);

    return () => {
      window.removeEventListener('foresight_pause_bg_music', handlePauseBgMusic);
      window.removeEventListener('foresight_resume_bg_music', handleResumeBgMusic);
    };
  }, [attemptPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      sessionStorage.setItem('foresight_bg_audio_paused', 'true');
    } else {
      audio.volume = 0.22;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          sessionStorage.setItem('foresight_bg_audio_paused', 'false');
        })
        .catch((err) => {
          console.warn('Audio play request interrupted:', err);
        });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    setIsDismissed(true);
    sessionStorage.setItem('foresight_bg_audio_dismissed', 'true');
    sessionStorage.setItem('foresight_bg_audio_paused', 'true');
  };

  if (isDismissed) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/foresight-anthem.mp3"
        preload="auto"
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div
        className="foresight-bg-music-pill"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9985,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isPlaying ? '1px solid rgba(212, 175, 55, 0.6)' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isPlaying
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.3)'
            : '0 8px 20px -4px rgba(0, 0, 0, 0.4)',
          borderRadius: '9999px',
          padding: '6px 12px 6px 10px',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          userSelect: 'none',
          fontFamily: 'inherit',
          fontSize: '0.82rem',
        }}
        onClick={togglePlay}
        title={isPlaying ? 'Pause Background Theme' : 'Play Background Theme'}
      >
        {/* Play / Equalizer Icon */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isPlaying ? 'linear-gradient(135deg, #d4af37, #f3e5ab)' : 'rgba(255, 255, 255, 0.12)',
            color: isPlaying ? '#0f172a' : '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
        >
          {isPlaying ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '12px' }}>
              <span className="eq-bar eq-bar-1" />
              <span className="eq-bar eq-bar-2" />
              <span className="eq-bar eq-bar-3" />
            </div>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '1px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        {/* Text Status */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, paddingRight: '4px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.8rem', color: isPlaying ? '#f8fafc' : '#cbd5e1' }}>
            {isPlaying ? 'Theme Song' : 'Play Theme'}
          </span>
          <span style={{ fontSize: '0.68rem', color: isPlaying ? 'var(--color-gold, #d4af37)' : '#94a3b8' }}>
            {isPlaying ? 'Playing Ambient' : 'Tap to Listen'}
          </span>
        </div>

        {/* Mute Button (When playing) */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{
              background: 'transparent',
              border: 'none',
              color: isMuted ? '#ef4444' : '#cbd5e1',
              padding: '2px 4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
            }}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        )}

        {/* Dismiss Pill Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss music player"
          title="Dismiss player"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            padding: '2px 4px',
            marginLeft: '2px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          &times;
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes eq-jump-1 {
          0%, 100% { height: 3px; }
          50% { height: 11px; }
        }
        @keyframes eq-jump-2 {
          0%, 100% { height: 10px; }
          50% { height: 4px; }
        }
        @keyframes eq-jump-3 {
          0%, 100% { height: 5px; }
          50% { height: 12px; }
        }
        .eq-bar {
          width: 2px;
          background: #0f172a;
          border-radius: 1px;
          display: inline-block;
        }
        .eq-bar-1 { animation: eq-jump-1 0.8s ease-in-out infinite; }
        .eq-bar-2 { animation: eq-jump-2 0.7s ease-in-out infinite; }
        .eq-bar-3 { animation: eq-jump-3 0.9s ease-in-out infinite; }

        @media (max-width: 768px) {
          .foresight-bg-music-pill {
            bottom: 68px !important;
            left: 10px !important;
            padding: 5px 8px 5px 8px !important;
            font-size: 0.72rem !important;
            max-width: 140px !important;
          }
          .foresight-bg-music-pill span {
            white-space: nowrap;
          }
        }
      ` }} />
    </>
  );
}
