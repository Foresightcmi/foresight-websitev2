'use client';

import { useState, useRef } from 'react';

export default function FaqFilterInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const wrapRef = useRef(null);

  const handleFilter = (val) => {
    setSearchTerm(val);
    const root = wrapRef.current?.closest('.faq-search-container');
    if (!root) return;
    const q = val.trim().toLowerCase();
    const items = root.querySelectorAll('details.faq-item');
    let visibleCount = 0;
    items.forEach((el) => {
      const text = (el.textContent || '').toLowerCase();
      const match = !q || text.includes(q);
      el.style.display = match ? '' : 'none';
      if (match) {
        visibleCount++;
        el.open = Boolean(q);
      }
    });
    const emptyEl = root.querySelector('.faq-empty-state');
    if (emptyEl) {
      emptyEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  return (
    <div ref={wrapRef} style={{ marginBottom: '2rem', position: 'relative' }}>
      <input
        type="text"
        placeholder="Search questions (e.g. radon, warranty, price, termite, sewer, schedule)..."
        aria-label="Search frequently asked questions"
        value={searchTerm}
        onChange={(e) => handleFilter(e.target.value)}
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
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => handleFilter('')}
          aria-label="Clear search"
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
  );
}
