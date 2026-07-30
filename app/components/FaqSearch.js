'use client';
import { useState } from 'react';

export default function FaqSearch({ faqs }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="🔍 Search questions (e.g. radon, warranty, price, termite, sewer, schedule)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1.1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-gray-mid)',
            fontSize: '1.05rem',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-red)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-mid)'}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              position: 'absolute',
              right: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--color-gray)',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Accordions */}
      {filteredFaqs.length > 0 ? (
        filteredFaqs.map((faq, i) => (
          <details
            key={i}
            open={Boolean(searchTerm)}
            style={{
              border: '1px solid var(--color-gray-mid)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              padding: '1.25rem 1.5rem',
              background: 'white',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-dark)' }}>
              {faq.q}
            </summary>
            <div
              className="speakable-answer"
              style={{ marginTop: '0.85rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: faq.a }}
            />
          </details>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-gray-mid)' }}>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            No matching questions found for &quot;<strong>{searchTerm}</strong>&quot;.
          </p>
          <a href="tel:6784802110" className="btn btn-primary">
            📞 Call Us Directly: 678-480-2110
          </a>
        </div>
      )}
    </div>
  );
}
