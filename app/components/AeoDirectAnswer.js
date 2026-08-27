import React from 'react';

/**
 * AeoDirectAnswer Component
 * Optimized for Answer Engine Optimization (AEO) and Google AI Overviews (AIO).
 * Features a high-density, structured summary with semantic speakable markup.
 */
export default function AeoDirectAnswer({ 
  question, 
  answer, 
  keyFacts = [], 
  cmiNote = 'Evaluated and verified under Georgia InterNACHI Certified Master Inspector® Standards of Practice.'
}) {
  return (
    <div 
      className="card speakable-answer" 
      style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(15, 23, 42, 0.03) 100%)',
        border: '1px solid var(--color-gold)',
        borderLeft: '5px solid var(--color-gold)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        margin: '2rem 0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>💡</span>
        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          color: '#854d0e',
          background: 'rgba(212, 175, 55, 0.15)',
          padding: '0.2rem 0.6rem',
          borderRadius: '4px'
        }}>
          Direct Diagnostic Answer (AEO / Fast Answer)
        </span>
      </div>

      {question && (
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
          {question}
        </h3>
      )}

      <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-navy)', margin: '0 0 0.75rem', fontWeight: 500 }}>
        {answer}
      </p>

      {keyFacts && keyFacts.length > 0 && (
        <ul style={{ margin: '0.5rem 0 1rem', paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', lineHeight: 1.6 }}>
          {keyFacts.map((fact, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              {fact}
            </li>
          ))}
        </ul>
      )}

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        paddingTop: '0.75rem', 
        borderTop: '1px solid rgba(212, 175, 55, 0.25)', 
        fontSize: '0.8rem', 
        color: '#475569' 
      }}>
        <span>🛡️ <strong>Certified Authority:</strong> {cmiNote}</span>
        <span style={{ fontWeight: 600, color: '#854d0e' }}>Two-Inspector Team Standard</span>
      </div>
    </div>
  );
}
