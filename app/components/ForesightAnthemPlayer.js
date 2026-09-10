'use client';

import { useState, useRef, useEffect } from 'react';

export default function ForesightAnthemPlayer({ 
  variant = 'card',
  title = 'Foresight Home Inspections Theme Song',
  subtitle = '"Hindsight is Expensive. Call Foresight."'
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(179);
  const [showLyrics, setShowLyrics] = useState(false);
  const [activeTrack, setActiveTrack] = useState('full');

  const tracks = {
    'full': {
      name: 'Full Anthem (2:59)',
      src: '/audio/foresight-anthem.mp3',
      duration: 179
    },
    '30s': {
      name: '30s Radio Hook',
      src: '/audio/foresight-anthem-30s-hook.mp3',
      duration: 30
    },
    '15s': {
      name: '15s Ringtone & On-Hold',
      src: '/audio/foresight-anthem-15s-ringtone.mp3',
      duration: 15
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [activeTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Playback prevented:', err));
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const switchTrack = (key) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveTrack(key);
    setDuration(tracks[key].duration);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (variant === 'compact') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '50px',
        padding: '0.6rem 1.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.85rem',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        color: '#ffffff'
      }}>
        <audio ref={audioRef} src={tracks[activeTrack].src} preload="metadata" />
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause Foresight Anthem" : "Play Foresight Anthem"}
          style={{
            background: 'var(--color-gold)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 800
          }}
        >
          {isPlaying ? '?' : '?'}
        </button>
        <div style={{ fontSize: '0.9rem' }}>
          <strong style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.82rem' }}>
            {isPlaying ? '?? Now Playing' : '?? Official Anthem'}
          </strong>
          <span style={{ color: '#e2e8f0', fontSize: '0.82rem' }}>
            Hindsight is Expensive ({formatTime(currentTime)} / {formatTime(duration)})
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid rgba(212, 175, 55, 0.35)',
      borderRadius: '16px',
      padding: '2rem',
      color: '#ffffff',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <audio ref={audioRef} src={tracks[activeTrack].src} preload="metadata" />

      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #b8860b 100%)',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
            flexShrink: 0
          }}>
            ??
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 700 }}>
              Official Brand Anthem
            </span>
            <h3 style={{ margin: '0.2rem 0', color: '#ffffff', fontSize: '1.35rem', fontWeight: 800 }}>
              {title}
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
              {subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', padding: '0.3rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {Object.entries(tracks).map(([key, item]) => (
            <button
              key={key}
              onClick={() => switchTrack(key)}
              style={{
                background: activeTrack === key ? 'var(--color-gold)' : 'transparent',
                color: activeTrack === key ? '#0f172a' : '#cbd5e1',
                border: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-gold) 0%, #fef08a 100%)',
              color: '#0f172a',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 900,
              boxShadow: '0 4px 15px rgba(212,175,55,0.5)',
              flexShrink: 0,
              transition: 'transform 0.15s ease'
            }}
          >
            {isPlaying ? '?' : '?'}
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                accentColor: 'var(--color-gold)',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 35, 85].map((h, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: isPlaying ? `${h * 0.22}px` : '4px',
                  background: isPlaying ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
            <span style={{ marginLeft: '0.65rem', fontSize: '0.85rem', color: isPlaying ? 'var(--color-gold)' : '#94a3b8', fontWeight: 600 }}>
              {isPlaying ? 'Playing � Call 678-480-2110' : 'Click Play to listen'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#e2e8f0',
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {showLyrics ? '? Hide Lyrics' : '?? View Lyrics'}
            </button>
            <a
              href={tracks[activeTrack].src}
              download
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              ? Download
            </a>
          </div>
        </div>
      </div>

      {showLyrics && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          marginBottom: '1.5rem',
          lineHeight: 1.8,
          fontSize: '0.95rem',
          color: '#cbd5e1'
        }}>
          <h4 style={{ color: 'var(--color-gold)', margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700 }}>
            Official Lyrics &bull; Hindsight is Expensive (Call Foresight)
          </h4>
          <p style={{ margin: '0 0 1rem' }}>
            <em>[Verse 1]</em><br />
            Hindsight is expensive... call Foresight.<br />
            You worked so hard to buy this place, to give your heart a safe space.<br />
            Before you sign that line today, let me check beneath the frame.<br />
            No hidden water in the walls, no cracks where the burden falls.<br />
            Protect your peace and every dime, before you cross the finish line.
          </p>
          <p style={{ margin: '0 0 1rem', background: 'rgba(212, 175, 55, 0.1)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
            <strong style={{ color: 'var(--color-gold)' }}>[Chorus]</strong><br />
            Hindsight is expensive, Call Foresight!<br />
            <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>6-7-8, 4-8-0, 21-10!</strong><br />
            Protect your home before you sign, make sure your future stays bright!<br />
            <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>6-7-8, 4-8-0, 21-10!</strong>
          </p>
          <p style={{ margin: '0 0 1rem' }}>
            <em>[Verse 2]</em><br />
            A strong house needs a steady ground, where love and safety can be found.<br />
            We check the roof down to the base, so joy alone can fill your space.
          </p>
          <p style={{ margin: '0 0 1rem' }}>
            <em>[Bridge]</em><br />
            Don&apos;t let a secret ruin what you build, walk through the front door with no guilt.<br />
            We guard your heart and savings too, because your family deserves the truth.
          </p>
          <p style={{ margin: 0, fontStyle: 'italic', color: '#94a3b8' }}>
            [Outro: Call Foresight... 678-480-2110... We got you.]
          </p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Ready to protect your investment with Atlanta&apos;s premier two-inspector team?
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="tel:6784802110"
            className="btn btn-gold"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            ?? Call 678-480-2110
          </a>
          <a
            href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: '#dc2626',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            Schedule Inspection &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
