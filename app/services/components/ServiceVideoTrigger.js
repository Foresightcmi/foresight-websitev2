'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ServiceVideoModal = dynamic(() => import('./ServiceVideoModal'), { ssr: false });

export default function ServiceVideoTrigger({
  briefing,
  label = '45-Sec Video Briefing',
  style = {},
  variant = 'compact'
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!briefing) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="service-video-trigger-btn"
        aria-label={`Watch ${briefing.duration || '45-second'} video briefing for ${briefing.title}`}
        style={{
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.55)',
          color: '#1E293B',
          padding: variant === 'compact' ? '0.55rem 1rem' : '0.75rem 1.25rem',
          fontSize: variant === 'compact' ? '0.88rem' : '0.95rem',
          fontWeight: 700,
          borderRadius: 'var(--radius-md)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15)',
          ...style
        }}
      >
        <span>{label}</span>
      </button>

      {isOpen && (
        <ServiceVideoModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          briefing={briefing}
        />
      )}
    </>
  );
}
