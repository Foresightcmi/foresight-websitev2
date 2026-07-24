'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header" style={{ backgroundColor: 'var(--color-white)' }}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <Image src="/images/Logopng.png" alt="Foresight Home Inspections - Certified Master Inspector in Atlanta GA" width={300} height={180} style={{ height: '140px', width: 'auto' }} priority />
          <span className="sr-only">Foresight Home Inspections</span>
        </Link>
        <button
          className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
        <nav aria-label="Main navigation">
          <ul className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
            <li>
              <a href="tel:678-480-2110" className="header-phone-link" onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'phone_call_click', {
                    event_category: 'conversion',
                    event_label: 'header_nav',
                    value: 1,
                  });
                }
                setMenuOpen(false);
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                678-480-2110
              </a>
            </li>
            <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link href="/realtors" onClick={() => setMenuOpen(false)}>Realtors</Link></li>
            <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
            <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
            <li><Link href="/quote" onClick={() => setMenuOpen(false)}>Get Quote</Link></li>
            <li><Link href="/ask-twin" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-red)', fontWeight: '600' }}>Ask Foresight AI</Link></li>
            <li>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Schedule Now
              </a>
            </li>
          </ul>
        </nav>
        {menuOpen && (
          <div
            className="nav-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}
