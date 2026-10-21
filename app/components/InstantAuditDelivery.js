'use client';

import { useEffect, useState } from 'react';

export default function InstantAuditDelivery() {
  const [auditData, setAuditData] = useState(null);
  const [copiedStip, setCopiedStip] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingTxt, setExportingTxt] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('foresight:last_audit:v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.defects && parsed.defects.length > 0) {
          setAuditData(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read audit data from localStorage:', e);
    }
  }, []);

  if (!auditData) return null;

  const { propertyInfo = {}, defects = [], calculations = {}, pricingIndex = {} } = auditData;
  const fmt = (n) => `$${Math.round(Number(n) || 0).toLocaleString()}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedStip(true);
    setTimeout(() => setCopiedStip(false), 2500);
  };

  const handleDownload = async (format) => {
    const isCsv = format === 'csv';
    if (isCsv) setExportingCsv(true);
    else setExportingTxt(true);

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          propertyInfo,
          defects,
          strategy: 'balanced',
        }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Foresight_Due_Diligence_${format.toUpperCase()}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Unable to generate file export. Please try printing or copying the stipulation directly.');
    } finally {
      if (isCsv) setExportingCsv(false);
      else setExportingTxt(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      border: '2px solid #D4AF37',
      borderRadius: '16px',
      padding: '1.75rem',
      textAlign: 'left',
      marginBottom: '2rem',
      boxShadow: '0 10px 35px rgba(212, 175, 55, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
            Instant Fulfillment Complete • Zero Waiting
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          Region: {pricingIndex.region || 'Metro Atlanta (×1.04)'}
        </span>
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
        Your Official Repair Cost Schedule &amp; GAR Exhibit
      </h2>
      <p style={{ fontSize: '0.85rem', color: '#CBD5E1', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
        Extracted directly from your inspection report. Cross-referenced against Georgia contractor trade labor averages and materials indices.
      </p>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Active Defects</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>{defects.length} Items</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Low Estimate</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>{fmt(calculations.totalLow)}</div>
        </div>
        <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
          <div style={{ fontSize: '0.7rem', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 800 }}>Median Demand</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#D4AF37', fontFamily: 'monospace' }}>{fmt(calculations.totalMedian)}</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>High Estimate</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F43F5E', fontFamily: 'monospace' }}>{fmt(calculations.totalHigh)}</div>
        </div>
      </div>

      {/* Itemized Table */}
      <div style={{
        maxHeight: '220px',
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        {defects.map((d, i) => (
          <div key={d.id || i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: i < defects.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            fontSize: '0.8rem'
          }}>
            <div style={{ maxWidth: '70%' }}>
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{i + 1}. {d.title}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{d.tradeType} • {d.severity}</div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 800, color: '#D4AF37', fontFamily: 'monospace' }}>
              {fmt(d.costMedian)}
            </div>
          </div>
        ))}
      </div>

      {/* Copy GAR Clause Box */}
      {calculations.garF404Stipulation && (
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase' }}>
              Repair Amendment Special Stipulation (For Your Realtor):
            </span>
            <button
              type="button"
              onClick={() => handleCopy(calculations.garF404Stipulation)}
              style={{
                background: '#D4AF37',
                color: '#0F172A',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {copiedStip ? '✓ Copied to Clipboard!' : 'Copy Clause'}
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#CBD5E1', fontStyle: 'italic', margin: 0, lineHeight: 1.45 }}>
            "{calculations.garF404Stipulation}"
          </p>
        </div>
      )}

      {/* Export Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => handleDownload('csv')}
          disabled={exportingCsv}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            color: '#34D399',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {exportingCsv ? 'Generating CSV...' : '📊 Download CSV Worksheet'}
        </button>
        <button
          type="button"
          onClick={() => handleDownload('txt')}
          disabled={exportingTxt}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38BDF8',
            color: '#38BDF8',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {exportingTxt ? 'Generating TXT...' : '📄 Download TXT Dossier'}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          🖨️ Print / Save PDF
        </button>
      </div>
    </div>
  );
}
