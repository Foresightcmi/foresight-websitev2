'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* 24/7 Top Banner — captures off-hours late-night search traffic */}
      <div className="top-banner" style={{
        background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontSize: '0.85rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ color: '#22C55E', fontSize: '0.7rem' }}>●</span>
          <strong style={{ color: '#D4AF37' }}>Book Online 24/7</strong>
          <span style={{ color: '#94A3B8' }}>—</span>
          <span>No waiting. Instant scheduling anytime.</span>
        </span>
        <span style={{ color: '#475569' }}>|</span>
        <a href="tel:6784802110" style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: 600 }}>
          📞 678-480-2110
        </a>
        <span style={{ color: '#475569' }}>|</span>
        <span style={{ color: '#94A3B8' }}>Serving Metro Atlanta &amp; 77+ Cities</span>
      </div>

      <header className="header" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div className="container nav-container">
          <Link href="/" className="logo">
            <Image src="/images/Logopng.png" alt="Foresight Home Inspections - Certified Master Inspector in Atlanta GA" width={300} height={180} style={{ height: '120px', width: 'auto' }} priority />
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
              <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
              <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
              <li><Link href="/realtors" onClick={() => setMenuOpen(false)}>Realtors</Link></li>
              <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
              <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
              <li><Link href="/quote" onClick={() => setMenuOpen(false)}>Get Quote</Link></li>
              <li><Link href="/ask-twin" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Ask Foresight AI</Link></li>
              <li>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" onClick={() => setMenuOpen(false)}>
                  Book Online 24/7
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
    </>
  );
}
