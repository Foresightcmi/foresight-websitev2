'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Wait a tick for the DOM to be fully parsed
    setTimeout(() => {
      const article = document.querySelector('.blog-content');
      if (!article) return;

      const elements = Array.from(article.querySelectorAll('h2, h3'));
      const newHeadings = elements.map((elem) => {
        // If heading doesn't have an ID, generate one for jump links to work
        if (!elem.id) {
          elem.id = elem.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        
        return {
          id: elem.id,
          text: elem.innerText,
          level: Number(elem.tagName.substring(1))
        };
      });

      setHeadings(newHeadings);
    }, 100);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div style={{
      background: 'var(--color-gray-light)',
      padding: '1.5rem',
      borderRadius: 'var(--radius-md)',
      borderLeft: '4px solid var(--color-gold)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📋 Table of Contents
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map((heading, index) => (
          <li 
            key={index} 
            style={{ 
              marginBottom: '0.5rem',
              paddingLeft: heading.level === 3 ? '1.5rem' : '0'
            }}
          >
            <a 
              href={`#${heading.id}`}
              style={{
                color: 'var(--color-gray-dark)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                borderBottom: '1px dotted var(--color-gray-mid)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-red)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-dark)'}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
