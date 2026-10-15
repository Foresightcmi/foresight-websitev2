'use client';

import { useState } from 'react';

export default function SampleReportPreview() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #CBD5E1', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#0F172A' }}>
      <div style={{ background: '#1E293B', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          <span style={{ color: '#94A3B8', fontSize: '0.85rem', marginLeft: '0.75rem', fontFamily: 'monospace' }}>
            Foresight Official Digital Inspection Report Viewer (220+ Photos &amp; Thermal Scans)
          </span>
        </div>
        <a
          href="/sample-report/index.html"
          target="_blank"
          rel="nofollow noopener noreferrer"
          style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
        >
          Open Full Screen in New Window ↗
        </a>
      </div>

      {isLoaded ? (
        <iframe
          src="/sample-report/index.html"
          title="Foresight Home Inspections Official Sample Report"
          style={{
            width: '100%',
            height: '680px',
            border: 'none',
            display: 'block',
            backgroundColor: '#ffffff',
          }}
        />
      ) : (
        <div
          style={{
            minHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.45)', color: 'var(--color-gold)', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Interactive Digital Report Sandbox
          </div>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', maxWidth: '640px' }}>
            Explore an Authentic 220-Photo Metro Atlanta Inspection Report
          </h3>
          <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '620px', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Navigate real structural, roof, electrical, HVAC, plumbing, and infrared thermal imaging findings organized by severity with clear repair recommendations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="btn btn-primary"
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Launch Interactive Report Preview &rarr;
            </button>
            <a
              href="/sample-report/index.html"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="btn btn-outline"
              style={{ padding: '0.9rem 1.75rem', fontSize: '1rem', fontWeight: 700, borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
            >
              Open Full Screen Report ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
