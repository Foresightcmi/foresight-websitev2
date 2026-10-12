'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header glass-header">
      <div className="container nav-container">
        <Link prefetch={false} href="/" className="logo">
          <Image src="/images/Logopng.webp" alt="Foresight Home Inspections - Certified Master Inspector in Atlanta GA" width={180} height={60} style={{ height: '58px', width: 'auto' }} priority />
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
              <li><Link prefetch={false} href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link prefetch={false} href="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
              <li><Link prefetch={false} href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
              <li><Link prefetch={false} href="/realtors" onClick={() => setMenuOpen(false)}>Realtors</Link></li>
              <li><Link prefetch={false} href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
              <li><Link prefetch={false} href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
              <li>
                <Link
                  prefetch={false}
                  href="/concierge"
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (typeof window !== 'undefined' && window.dispatchEvent) {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('open_foresight_live_consultation'));
                    }
                  }}
                  style={{
                    color: '#D4AF37',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  aria-label="Live Concierge Consultation with Christopher Boykin, Certified Master Inspector"
                  title="Live Concierge: Speak or Type with Christopher Boykin, CMI"
                >
                  Live Concierge
                </Link>
              </li>
              <li>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" onClick={() => setMenuOpen(false)}>
                  Schedule Online 24/7
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
