'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const VslModal = dynamic(() => import('./VslModal'), { ssr: false });

export default function VslTriggerButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn vsl-trigger-btn"
        style={{
          background: 'rgba(212, 175, 55, 0.15)',
          border: '1px solid rgba(212, 175, 55, 0.6)',
          color: '#F8FAFC',
          padding: '1.1rem 2rem',
          fontSize: '1.05rem',
          fontWeight: 600,
          borderRadius: 'var(--radius-md)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease'
        }}
        aria-label="Watch 60-second video briefing about our dual inspection standard"
      >
        <span style={{ fontSize: '1.2rem', color: '#D4AF37' }}>▶️</span>
        <span>Watch 60-Sec Briefing</span>
      </button>

      {isOpen && <VslModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
