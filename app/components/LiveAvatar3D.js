'use client';

import { useEffect, useRef, useState } from 'react';

export default function LiveAvatar3D({
  callState = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  persona = 'receptionist',   // 'receptionist' | 'chris' | 'jordan'
  analyserNode = null,
  onClick = () => {}
}) {
  const videoRef = useRef(null);
  const auraRef = useRef(null);
  const animFrameRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Audio reactivity via Web Audio analyserNode
  useEffect(() => {
    if (!analyserNode || (callState !== 'speaking' && callState !== 'listening')) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = 'scale(1)';
        auraRef.current.style.opacity = callState === 'speaking' ? '0.75' : callState === 'listening' ? '0.6' : '0.35';
      }
      return;
    }

    const bufferLength = analyserNode.frequencyBinCount || 32;
    const dataArray = new Uint8Array(bufferLength);

    const updatePulse = () => {
      analyserNode.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength; // 0 to 255
      const normalized = Math.min(1, avg / 128); // 0 to 1

      if (auraRef.current) {
        const scale = 1 + normalized * 0.18;
        const opacity = 0.4 + normalized * 0.55;
        auraRef.current.style.transform = `scale(${scale.toFixed(3)})`;
        auraRef.current.style.opacity = opacity.toFixed(2);
      }

      animFrameRef.current = requestAnimationFrame(updatePulse);
    };

    animFrameRef.current = requestAnimationFrame(updatePulse);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [analyserNode, callState]);

  // Video playback management during 'speaking' state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || persona !== 'chris' || videoError) return;

    if (callState === 'speaking') {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Avatar Video] Autoplay prevented, portrait remains active:', err);
        });
      }
    } else {
      video.pause();
    }
  }, [callState, persona, videoError]);

  const isSpeaking = callState === 'speaking';
  const isListening = callState === 'listening';
  const isThinking = callState === 'thinking';

  // State colors
  const primaryGlowColor = isSpeaking 
    ? '#D4AF37' // Foresight Gold
    : isListening 
    ? '#10b981' // Emerald
    : isThinking 
    ? '#f59e0b' // Amber
    : '#D4AF37';

  const isReceptionist = persona === 'receptionist' || persona === 'jordan';
  const avatarSrc = isReceptionist ? '/images/jordan-avatar.webp' : '/images/Christopher_Boykin.webp';
  const avatarFallbackSrc = isReceptionist ? '/images/jordan-avatar.jpg' : '/images/Christopher_Boykin.jpg';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '270px',
        height: '270px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      title={isListening ? 'Listening to you... Tap to pause' : isSpeaking ? `${isReceptionist ? 'Receptionist' : 'Christopher'} is speaking... Tap to interrupt` : `${isReceptionist ? 'Foresight Receptionist' : 'Christopher Boykin, CMI®'} • Tap to speak`}
      aria-label={`Interactive Live Avatar of ${isReceptionist ? 'Foresight Virtual Receptionist' : 'Christopher Boykin, Certified Master Inspector'}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {/* Dynamic Audio-Reactive Halo Aura Rings */}
      <div
        ref={auraRef}
        style={{
          position: 'absolute',
          inset: '-14px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isSpeaking ? 'rgba(212,175,55,0.45)' : isListening ? 'rgba(16,185,129,0.45)' : 'rgba(212,175,55,0.18)'} 0%, rgba(15,23,42,0) 70%)`,
          pointerEvents: 'none',
          transition: analyserNode ? 'none' : 'transform 0.4s ease, opacity 0.4s ease',
          willChange: 'transform, opacity',
          zIndex: 1
        }}
      />

      {/* Secondary Animated Ambient Ring */}
      <div
        style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '50%',
          border: `2px solid ${primaryGlowColor}`,
          opacity: isSpeaking || isListening ? 0.8 : 0.35,
          boxShadow: `0 0 24px ${primaryGlowColor}66, inset 0 0 16px ${primaryGlowColor}33`,
          pointerEvents: 'none',
          animation: isSpeaking 
            ? 'chrisAuraPulse 1.8s ease-in-out infinite' 
            : isListening 
            ? 'chrisListenPulse 2.2s ease-in-out infinite'
            : isThinking
            ? 'chrisThinkingSpin 3s linear infinite'
            : 'none',
          zIndex: 2
        }}
      />

      {/* Main Circular Portrait & Video Capsule */}
      <div
        style={{
          position: 'relative',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #D4AF37',
          background: 'linear-gradient(145deg, #1e293b 0%, #0b0f17 100%)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.8)',
          zIndex: 3,
          transform: 'translateZ(0)'
        }}
      >
        {/* Authentic High-Resolution Studio Portrait */}
        <picture>
          <source srcSet={avatarSrc} type="image/webp" />
          <img
            src={avatarFallbackSrc}
            alt={isReceptionist ? "Foresight Virtual Receptionist & Concierge representing Christopher Boykin, CMI®" : "Christopher Boykin - Founder & Lead Certified Master Inspector (CMI®)"}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: isReceptionist ? 'center top' : 'center 15%',
              display: 'block',
              transform: isSpeaking ? 'scale(1.02)' : 'scale(1.0)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
              filter: isThinking ? 'brightness(0.92) contrast(1.05)' : 'none'
            }}
          />
        </picture>

        {/* Photorealistic Office Video Loop - Activated during Christopher speaking */}
        {persona === 'chris' && !videoError && (
          <video
            ref={videoRef}
            src="/videos/chris-avatar-office-loop.mp4"
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
              opacity: isSpeaking && videoLoaded ? 1 : 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: 'none',
              zIndex: 4
            }}
          />
        )}

        {/* Subtle Vignette Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 55%, rgba(11,15,23,0.45) 100%)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      </div>

      {/* Official CMI® Gold Medallion Badge (Bottom-Right) */}
      <div
        title="InterNACHI Certified Master Inspector (CMI®) - North America's Highest Professional Inspection Credential"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '18px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          border: '2px solid #D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 4px 14px rgba(0,0,0,0.7), 0 0 10px rgba(212,175,55,0.4)',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
      >
        <img
          src="/images/cmi_logo.webp"
          alt="Certified Master Inspector"
          style={{ width: '28px', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Executive Status Pill Badge (Bottom-Center) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: isSpeaking 
            ? 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)'
            : isListening
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : isThinking
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'rgba(15, 23, 42, 0.92)',
          color: isSpeaking ? '#0F172A' : '#FFFFFF',
          border: '1.5px solid rgba(212, 175, 55, 0.5)',
          borderRadius: '9999px',
          padding: '4px 14px',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          zIndex: 10,
          boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <span
          style={{ 
            width: '7px', 
            height: '7px', 
            borderRadius: '50%', 
            background: isSpeaking ? '#0F172A' : isListening ? '#34D399' : '#D4AF37',
            boxShadow: `0 0 8px ${isSpeaking ? '#0F172A' : isListening ? '#34D399' : '#D4AF37'}`,
            animation: (isSpeaking || isListening) ? 'chrisDotPulse 1.2s ease-in-out infinite' : 'none'
          }} 
        />
        <span>
          {isSpeaking 
            ? (isReceptionist ? 'Receptionist Speaking' : 'Christopher Speaking') 
            : isListening 
            ? 'Listening... Speak' 
            : isThinking 
            ? (isReceptionist ? 'Checking Pricing & Info...' : 'Analyzing Atlanta Codes...') 
            : (isReceptionist ? 'Foresight Receptionist' : 'Christopher Boykin, CMI®')}
        </span>
      </div>

      {/* Global Embedded Keyframes for Fluid 60fps Micro-Animations */}
      <style jsx>{`
        @keyframes chrisAuraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.035);
            opacity: 0.95;
          }
        }
        @keyframes chrisListenPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.025);
            opacity: 0.85;
          }
        }
        @keyframes chrisThinkingSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes chrisDotPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
