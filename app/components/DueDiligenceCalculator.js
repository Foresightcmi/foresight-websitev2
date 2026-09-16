'use client';

import { useState, useMemo } from 'react';

export default function DueDiligenceCalculator() {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [bindingDate, setBindingDate] = useState(todayStr);
  const [dueDiligenceDays, setDueDiligenceDays] = useState(7);
  const [yearBuilt, setYearBuilt] = useState(1995);
  const [foundation, setFoundation] = useState('crawlspace');
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Calculate milestones
  const timeline = useMemo(() => {
    const base = new Date(bindingDate + 'T12:00:00');
    if (isNaN(base.getTime())) return null;

    const addDays = (d, count) => {
      const result = new Date(d);
      result.setDate(result.getDate() + count);
      return result;
    };

    const formatDate = (d) => {
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const day1Inspection = addDays(base, Math.min(2, Math.floor(dueDiligenceDays * 0.3)));
    const dayReport = addDays(day1Inspection, 1);
    const dayQuotes = addDays(base, Math.min(dueDiligenceDays - 2, Math.floor(dueDiligenceDays * 0.7)));
    const dayAmendment = addDays(base, Math.max(1, dueDiligenceDays - 1));
    const dayExpiration = addDays(base, dueDiligenceDays);

    return {
      binding: formatDate(base),
      inspectionTarget: formatDate(day1Inspection),
      reportTarget: formatDate(dayReport),
      specialistQuotes: formatDate(dayQuotes),
      amendmentDeadline: formatDate(dayAmendment),
      finalExpiration: formatDate(dayExpiration),
      rawExpiration: dayExpiration
    };
  }, [bindingDate, dueDiligenceDays]);

  // Risk profile calculation
  const risks = useMemo(() => {
    const list = [];
    const year = Number(yearBuilt) || 2000;

    if (year >= 1978 && year <= 1995) {
      list.push({
        title: 'Polybutylene Plumbing Hazard (1978 to 1995)',
        desc: 'Georgia homes built in this era frequently have blue/gray polybutylene supply pipes that degrade from chlorine and burst without warning. Requires strict visual evaluation of risers and main line.',
        severity: 'high'
      });
    }

    if (year < 1990) {
      list.push({
        title: 'Aging Cast Iron / Clay Sewer Line (25+ Years)',
        desc: 'Sewer laterals over 25 years old in Metro Atlanta red clay frequently experience tree root intrusion, bellies, or joint collapse. A $450 HD sewer scope camera inspection is strongly advised.',
        severity: 'medium'
      });
    }

    if (foundation === 'crawlspace' || foundation === 'basement') {
      list.push({
        title: 'Radon Gas & Red Clay Moisture Intrusion',
        desc: 'Metro Atlanta sits on the Georgia Piedmont granite belt, creating elevated radon levels in basements and crawlspaces. Red clay hydrostatic pressure can also cause foundation shear cracking.',
        severity: 'high'
      });
    }

    return list;
  }, [yearBuilt, foundation]);

  const embedCode = `<iframe src="https://www.fhinspectionsatl.com/due-diligence" width="100%" height="700" style="border:none;border-radius:12px;" title="Georgia Due Diligence Calculator"></iframe>\n<p style="font-size:12px;color:#666;">Source: <a href="https://www.fhinspectionsatl.com/due-diligence" target="_blank" rel="noopener">Foresight Home Inspections - Atlanta Certified Master Inspector</a></p>`;

  const handleCopyEmbed = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(embedCode).then(() => {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 3000);
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #111827 0%, #1F2937 100%)',
      borderRadius: '20px',
      padding: '2.5rem 2rem',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6), 0 0 25px rgba(212, 175, 55, 0.1)',
      color: '#ffffff',
      margin: '2rem 0'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{
          background: 'rgba(212, 175, 55, 0.15)',
          color: '#D4AF37',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          fontSize: '0.75rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          Interactive Linkable Tool
        </span>
        <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.75rem 0 0.5rem', color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
          Georgia Due Diligence &amp; Repair Timeline Calculator
        </h3>
        <p style={{ color: '#9CA3AF', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          Calculate your critical inspection, contractor quote, and GAR Amendment deadlines before your contingency clock expires.
        </p>
      </div>

      {/* Input Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        background: 'rgba(0,0,0,0.3)',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '2rem'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
            📅 Binding Agreement Date
          </label>
          <input
            type="date"
            value={bindingDate}
            onChange={(e) => setBindingDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#0F172A',
              color: '#ffffff',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
            ⏱️ Due Diligence Window
          </label>
          <select
            value={dueDiligenceDays}
            onChange={(e) => setDueDiligenceDays(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#0F172A',
              color: '#ffffff',
              fontSize: '0.95rem'
            }}
          >
            <option value={5}>5 Calendar Days (Rush Window)</option>
            <option value={7}>7 Calendar Days (Standard Metro Atlanta)</option>
            <option value={8}>8 Calendar Days</option>
            <option value={10}>10 Calendar Days (Extended Due Diligence)</option>
            <option value={14}>14 Calendar Days (Historic / Rural)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
            🏠 Approximate Year Built
          </label>
          <input
            type="number"
            min={1900}
            max={2026}
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#0F172A',
              color: '#ffffff',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
            🧱 Foundation Type
          </label>
          <select
            value={foundation}
            onChange={(e) => setFoundation(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#0F172A',
              color: '#ffffff',
              fontSize: '0.95rem'
            }}
          >
            <option value="crawlspace">Crawlspace (Red Clay Moisture Exposure)</option>
            <option value="basement">Basement (Hydrostatic Pressure / Radon)</option>
            <option value="slab">Slab on Grade</option>
          </select>
        </div>
      </div>

      {/* Calculated Strategic Timeline Milestones */}
      {timeline && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎯</span> Your Strategic GAR Contract Milestones
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Step 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '1.25rem 1rem',
              borderTop: '3px solid #3B82F6'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase' }}>
                Stage 1: Inspection
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {timeline.inspectionTarget}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                Target physical on-site evaluation with Foresight dual-inspector team.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '1.25rem 1rem',
              borderTop: '3px solid #10B981'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 700, textTransform: 'uppercase' }}>
                Stage 2: Report &amp; CRL
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {timeline.reportTarget}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                24-hour report delivered with 1-click Create Request List repair generator.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '1.25rem 1rem',
              borderTop: '3px solid #F59E0B'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 700, textTransform: 'uppercase' }}>
                Stage 3: Specialist Quotes
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {timeline.specialistQuotes}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                Collect licensed HVAC, roof, or structural contractor repair estimates.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '1.25rem 1rem',
              borderTop: '3px solid #EF4444'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 700, textTransform: 'uppercase' }}>
                Stage 4: GAR Amendment
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {timeline.amendmentDeadline}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                Submit Amendment to Address Concerns to seller agent for negotiation.
              </p>
            </div>

            {/* Step 5 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.25) 100%)',
              border: '2px solid #EF4444',
              borderRadius: '12px',
              padding: '1.25rem 1rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase' }}>
                ⚠️ Final Expiration
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                {timeline.finalExpiration}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#FCA5A5', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                Contingency ends strictly at 11:59 PM. Agreement must be finalized or terminated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Building Science Specific Risk Findings */}
      {risks.length > 0 && (
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem'
        }}>
          <h5 style={{ margin: '0 0 0.75rem 0', color: '#D4AF37', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔍 Building Science Risk Flags for This Property
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {risks.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.1rem' }}>{r.severity === 'high' ? '🚨' : '⚠️'}</span>
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>{r.title}: </strong>
                  <span style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: 1.4 }}>{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share / Backlink Embed Generator (Semrush Link Magnet Strategy) */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.08)',
        border: '1px dashed rgba(212, 175, 55, 0.4)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <strong style={{ color: '#D4AF37', fontSize: '0.95rem', display: 'block', marginBottom: '2px' }}>
            🔗 Realtors &amp; Real Estate Bloggers: Embed or Cite This Calculator
          </strong>
          <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
            Add this free Due Diligence calculator to your buyer guides or recommended vendor page. Includes automatic attribution backlink.
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyEmbed}
          style={{
            background: copiedEmbed ? '#10B981' : '#D4AF37',
            color: copiedEmbed ? '#ffffff' : '#0F172A',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          {copiedEmbed ? '✓ Embed Code Copied!' : '📋 Copy Embed / Citation Code'}
        </button>
      </div>
    </div>
  );
}
