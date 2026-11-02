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
          <Image src="/images/Logopng.webp" alt="Foresight Home Inspections - Certified Master Inspector in Atlanta GA" width={68} height={58} sizes="68px" style={{ height: '58px', width: '68px', objectFit: 'contain' }} loading="eager" />
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
