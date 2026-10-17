'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function BackgroundAudioPlayer() {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const audioRef = useRef(null);
  const pausedByConciergeRef = useRef(false);
  const fadeTimerRef = useRef(null);

  // Target ambient volume (luxurious background presence without overwhelming speech)
  const TARGET_VOLUME = 0.20;

  // Clean fade helper
  const fadeVolume = useCallback((startVol, endVol, durationMs, onComplete) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    const steps = 15;
    const stepDuration = durationMs / steps;
    let currentStep = 0;
    audio.volume = Math.max(0, Math.min(1, startVol));

    fadeTimerRef.current = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      const newVol = startVol + (endVol - startVol) * ratio;
      audio.volume = Math.max(0, Math.min(1, newVol));

      if (currentStep >= steps) {
        clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
        if (onComplete) onComplete();
      }
    }, stepDuration);
  }, []);

  // Safe Play helper
  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Do not play on concierge or admin routes
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/concierge')) {
      return;
    }

    if (!audio.src || audio.src === window.location.href) {
      audio.src = '/audio/foresight-anthem.mp3';
    }

    audio.volume = 0.04;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          fadeVolume(0.04, TARGET_VOLUME, 450);
        })
        .catch((err) => {
          // Browser Autoplay Policy blocked unmuted playback without user gesture
          console.log('ℹ️ Ambient theme waiting for first user interaction:', err?.name || 'AutoplayPolicy');
          setupFirstGestureTrigger();
        });
    }
  }, [fadeVolume]);

  // Fallback: Autoplay as soon as visitor touches, scrolls, or clicks anything on the site
  const setupFirstGestureTrigger = useCallback(() => {
    const gestureEvents = ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'];

    const handleFirstGesture = () => {
      gestureEvents.forEach((evt) => window.removeEventListener(evt, handleFirstGesture));

      const isDismissedCheck = sessionStorage.getItem('foresight_bg_audio_dismissed') === 'true';
      const isPausedCheck = sessionStorage.getItem('foresight_bg_audio_paused') === 'true';
      const isConciergeActive = pausedByConciergeRef.current || (typeof window !== 'undefined' && window.location.pathname.startsWith('/concierge'));

      if (!isDismissedCheck && !isPausedCheck && !isConciergeActive) {
        const audio = audioRef.current;
        if (audio && audio.paused) {
          if (!audio.src || audio.src === window.location.href) {
            audio.src = '/audio/foresight-anthem.mp3';
          }
          audio.volume = 0.04;
          audio.play()
            .then(() => {
              setIsPlaying(true);
              fadeVolume(0.04, TARGET_VOLUME, 450);
            })
            .catch(() => {});
        }
      }
    };

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleFirstGesture, { once: true, passive: true });
    });
  }, [fadeVolume]);

  // Main lifecycle & Concierge Coordination
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check saved preferences
    if (sessionStorage.getItem('foresight_bg_audio_dismissed') === 'true') {
      setIsDismissed(true);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = '/audio/foresight-anthem.mp3';
    audio.loop = true;
    audio.preload = 'auto';

    // 1. Attempt immediate playback if not previously paused by visitor
    const userManuallyPaused = sessionStorage.getItem('foresight_bg_audio_paused') === 'true';
    const isConciergeRoute = window.location.pathname.startsWith('/concierge');

    if (!userManuallyPaused && !isConciergeRoute) {
      startPlayback();
    }

    // 2. CONCIERGE INTEGRATION: Instant pause when concierge opens or activates
    const handlePauseBgMusic = () => {
      if (audio && !audio.paused) {
        pausedByConciergeRef.current = true;
        fadeVolume(audio.volume, 0, 120, () => {
          audio.pause();
          setIsPlaying(false);
        });
      } else {
        pausedByConciergeRef.current = true;
      }
    };

    // 3. CONCIERGE INTEGRATION: Smooth resume when concierge closes
    const handleResumeBgMusic = () => {
      const isStillPaused = sessionStorage.getItem('foresight_bg_audio_paused') === 'true';
      const onConcierge = window.location.pathname.startsWith('/concierge');

      if (pausedByConciergeRef.current && !isStillPaused && !onConcierge && audio && audio.paused) {
        pausedByConciergeRef.current = false;
        audio.volume = 0.04;
        audio.play()
          .then(() => {
            setIsPlaying(true);
            fadeVolume(0.04, TARGET_VOLUME, 500);
          })
          .catch(() => {});
      } else {
        pausedByConciergeRef.current = false;
      }
    };

    // Listen to custom Foresight concierge coordination events
    window.addEventListener('foresight_pause_bg_music', handlePauseBgMusic);
    window.addEventListener('open_foresight_live_consultation', handlePauseBgMusic);
    window.addEventListener('foresight_resume_bg_music', handleResumeBgMusic);

    // 4. Global Media Conflict Prevention (Capture Phase)
    // If any video or other audio begins playing on the page (VSL, field video), pause background anthem
    const handleGlobalMediaPlay = (e) => {
      if (!e.target) return;
      if (e.target.tagName === 'VIDEO' || (e.target.tagName === 'AUDIO' && e.target !== audio)) {
        if (audio && !audio.paused) {
          pausedByConciergeRef.current = true;
          audio.pause();
          setIsPlaying(false);
        }
      }
    };

    // 5. Page Visibility: pause when tab is minimized or switched, resume when returning
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audio && !audio.paused) {
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        const isManuallyPaused = sessionStorage.getItem('foresight_bg_audio_paused') === 'true';
        const isDismissedNow = sessionStorage.getItem('foresight_bg_audio_dismissed') === 'true';
        const onConciergeNow = window.location.pathname.startsWith('/concierge');
        if (!isManuallyPaused && !isDismissedNow && !onConciergeNow && !pausedByConciergeRef.current) {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };

    document.addEventListener('play', handleGlobalMediaPlay, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('foresight_pause_bg_music', handlePauseBgMusic);
      window.removeEventListener('open_foresight_live_consultation', handlePauseBgMusic);
      window.removeEventListener('foresight_resume_bg_music', handleResumeBgMusic);
      document.removeEventListener('play', handleGlobalMediaPlay, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, [fadeVolume, startPlayback]);

  // Route protection: If navigated to /concierge, mute immediately
  useEffect(() => {
    const audio = audioRef.current;
    if (pathname && (pathname.startsWith('/concierge') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
      if (audio && !audio.paused) {
        audio.pause();
        setIsPlaying(false);
        pausedByConciergeRef.current = true;
      }
    } else if (pausedByConciergeRef.current) {
      // Navigated back from concierge
      const userPaused = sessionStorage.getItem('foresight_bg_audio_paused') === 'true';
      if (!userPaused && audio && audio.paused) {
        pausedByConciergeRef.current = false;
        audio.volume = 0.04;
        audio.play()
          .then(() => {
            setIsPlaying(true);
            fadeVolume(0.04, TARGET_VOLUME, 500);
          })
          .catch(() => {});
      }
    }
  }, [pathname, fadeVolume]);

  // User Interactive Controls
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      pausedByConciergeRef.current = false;
      sessionStorage.setItem('foresight_bg_audio_paused', 'true');
    } else {
      pausedByConciergeRef.current = false;
      sessionStorage.setItem('foresight_bg_audio_paused', 'false');
      if (!audio.src || audio.src === window.location.href) {
        audio.src = '/audio/foresight-anthem.mp3';
      }
      audio.volume = 0.04;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeVolume(0.04, TARGET_VOLUME, 400);
        })
        .catch((err) => {
          console.warn('Audio play interrupted:', err);
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

  // Do not render on administrative or dedicated concierge pages
  if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/concierge'))) {
    return null;
  }

  if (isDismissed) return null;

  return (
    <>
      <audio
        ref={audioRef}
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
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: isPlaying ? '1px solid rgba(212, 175, 55, 0.65)' : '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: isPlaying
            ? '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.35)'
            : '0 8px 20px -4px rgba(0, 0, 0, 0.45)',
          borderRadius: '9999px',
          padding: '6px 12px 6px 10px',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          userSelect: 'none',
          fontFamily: 'inherit',
          fontSize: '0.82rem',
        }}
        onClick={togglePlay}
        title={isPlaying ? 'Pause Foresight Theme' : 'Play Foresight Theme'}
      >
        {/* Play / Animated Equalizer Icon */}
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
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: isPlaying ? '#f8fafc' : '#cbd5e1' }}>
            {isPlaying ? 'Foresight Anthem' : 'Play Anthem'}
          </span>
          <span style={{ fontSize: '0.67rem', color: isPlaying ? 'var(--color-gold, #d4af37)' : '#94a3b8' }}>
            {isPlaying ? 'Official Theme Song' : 'Tap to Listen'}
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
            max-width: 155px !important;
          }
          .foresight-bg-music-pill span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      ` }} />
    </>
  );
}
