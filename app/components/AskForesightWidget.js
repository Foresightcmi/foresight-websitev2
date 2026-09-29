'use client';

import { useState, useEffect } from 'react';
import VoiceAgentModal from './VoiceAgentModal';

export default function AskForesightWidget() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isBalloonDismissed, setIsBalloonDismissed] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsVoiceOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open_foresight_live_consultation', handleOpen);
      return () => window.removeEventListener('open_foresight_live_consultation', handleOpen);
    }
  }, []);

  return (
    <>
      {/* Floating Action Button Group (LiveRep Concierge Avatar + Speech Balloon) */}
      {!isVoiceOpen && (
        <div 
          className="ask-foresight-launcher-group"
          style={{
            position: 'fixed',
            zIndex: 9999,
            bottom: '24px',
            right: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Animated Speech Balloon Invitation */}
          {!isBalloonDismissed && (
            <div 
              className="liverep-speech-balloon"
              onClick={() => setIsVoiceOpen(true)}
              style={{
                position: 'absolute',
                bottom: '84px',
                right: '0',
                background: 'linear-gradient(135deg, rgba(20, 30, 48, 0.98) 0%, rgba(10, 17, 30, 0.98) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '16px',
                padding: '10px 14px',
                width: '275px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15)',
                color: '#ffffff',
                zIndex: 10000,
                cursor: 'pointer',
                animation: 'balloonFloat 3s ease-in-out infinite alternate',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9rem' }}>👋</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>
                    Christopher Boykin (CMI®)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBalloonDismissed(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0 2px'
                  }}
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                Hi! Tap to speak or type. I&apos;m Christopher Boykin—welcome to your <strong>Live Concierge Consultation</strong> for instant quotes &amp; building science answers.
              </p>
              <div style={{
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                🎙️ Speak or 💬 Type • Live 24/7
              </div>
              {/* Balloon tail pointer */}
              <div style={{
                position: 'absolute',
                bottom: '-7px',
                right: '30px',
                width: '12px',
                height: '12px',
                background: '#0a111e',
                borderRight: '1px solid rgba(212, 175, 55, 0.45)',
                borderBottom: '1px solid rgba(212, 175, 55, 0.45)',
                transform: 'rotate(45deg)'
              }} />
            </div>
          )}

          {/* Primary LiveRep Circular Avatar Launcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsVoiceOpen(true)}
              aria-label="Live Concierge Consultation with Christopher Boykin, Certified Master Inspector"
              className="ask-foresight-voice-launcher"
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B89528 100%)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.5)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseAvatarRing 2.5s infinite',
                transition: 'transform 0.2s',
                outline: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#0F172A'
                }}
              >
                <picture>
                  <source srcSet="/images/Christopher_Boykin.webp" type="image/webp" />
                  <img 
                    src="/images/Christopher_Boykin.jpg" 
                    alt="Christopher Boykin CMI - Live Concierge Consultation" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </picture>
              </div>
              {/* Green Live indicator badge */}
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#10b981',
                color: '#0F172A',
                fontSize: '0.58rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '8px',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff', animation: 'blink 1.2s infinite' }} />
                LIVE CONCIERGE
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Voice & Text Concierge Overlay Modal */}
      <VoiceAgentModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Global CSS Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes balloonFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
        @keyframes pulseAvatarRing {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 10px 30px rgba(0, 0, 0, 0.5); }
          70% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0), 0 10px 30px rgba(0, 0, 0, 0.5); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0), 0 10px 30px rgba(0, 0, 0, 0.5); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .ask-foresight-launcher-group {
          bottom: 24px;
          right: 24px;
        }
        @media (max-width: 768px) {
          .ask-foresight-launcher-group {
            bottom: 68px !important;
            right: 12px !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
          }
          .ask-foresight-voice-launcher {
            width: 54px !important;
            height: 54px !important;
            padding: 2px !important;
          }
          .liverep-speech-balloon {
            width: 235px !important;
            bottom: 68px !important;
            right: 0 !important;
            padding: 8px 10px !important;
          }
        }
      `}} />
    </>
  );
}
