'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const VoiceAgentModal = dynamic(() => import('./VoiceAgentModal'), {
  ssr: false,
});

export default function AskForesightWidget() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsVoiceOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open_foresight_live_consultation', handleOpen);
      return () => window.removeEventListener('open_foresight_live_consultation', handleOpen);
    }
  }, []);

  return (
    <>
      {/* Floating Action Button Group (LiveRep Concierge Avatar) */}
      {!isVoiceOpen && (
        <div className="ask-foresight-launcher-group">
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
                  <source srcSet="/images/Christopher_Boykin_thumb.webp" type="image/webp" />
                  <img 
                    src="/images/Christopher_Boykin_thumb.jpg" 
                    alt="Christopher Boykin CMI - Live Concierge Consultation" 
                    width={46}
                    height={46}
                    loading="lazy"
                    decoding="async"
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
      {isVoiceOpen && <VoiceAgentModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />}

      {/* Global CSS Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes balloonFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
        .ask-foresight-voice-launcher::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(16, 185, 129, 0.75);
          animation: pulseAvatarRing 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          pointer-events: none;
          will-change: transform, opacity;
        }
        @keyframes pulseAvatarRing {
          0% { transform: scale(0.96); opacity: 0.9; }
          70% { transform: scale(1.24); opacity: 0; }
          100% { transform: scale(1.24); opacity: 0; }
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
