'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GooglePreferredSource from '../components/GooglePreferredSource';

export default function ReviewClient() {
  const [copiedType, setCopiedType] = useState(null);
  const [showInspectorTool, setShowInspectorTool] = useState(false);

  const googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJk_3KQe0H9YgRw8vLCvROjpY";

  const smsTemplate = `Hi [Name], Christopher Boykin with Foresight Home Inspections here! Thank you for trusting us with your home inspection today. Your full digital report has been delivered. If our two-inspector team and FLIR thermal scan gave you peace of mind, could you take 30 seconds to leave us a quick review on Google? It means the world to our local family business: https://www.fhinspectionsatl.com/review - Thank you!`;

  const emailTemplate = `Subject: Your Foresight Home Inspection Report + Quick Favor for Christopher

Hi [Name],

Thank you for choosing Foresight Home Inspections! Your comprehensive digital inspection report, thermal imaging photos, and Create-Request-List summary have been delivered.

As an independent, Georgia-certified small business, Google reviews are how local Atlanta homebuyers find an honest, thorough inspection team. If our two-inspector process, detailed walkthrough, and $10,000 warranty gave you confidence during your due diligence, we would be deeply grateful if you took 45 seconds to share your experience on Google:

👉 Leave a Google Review: https://www.fhinspectionsatl.com/review

Helpful details other buyers love hearing about:
• Our two-inspector team speed and thoroughness
• FLIR thermal imaging or crawlspace/roof findings
• How the report helped your purchase or repair negotiations

If you have any questions as you review the report, you can call me directly at 678-480-2110.

Warm regards,
Christopher Boykin, CMI®
Foresight Home Inspections, LLC
www.fhinspectionsatl.com | 678-480-2110`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'review_template_copied', {
        event_category: 'review_velocity',
        template_type: type,
      });
    }
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Image
            src="/images/Logopng.png"
            alt="Foresight Home Inspections Logo"
            width={180}
            height={60}
            style={{ objectFit: 'contain', margin: '0 auto' }}
            priority
          />
          <h1
            style={{
              color: '#0F172A',
              fontSize: '2.25rem',
              fontWeight: 800,
              marginTop: '1.25rem',
              marginBottom: '0.75rem',
              lineHeight: 1.2,
            }}
          >
            Thank You for Choosing Foresight!
          </h1>
          <p
            style={{
              color: '#475569',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            We appreciate your trust! Your honest review helps Metro Atlanta homebuyers discover a thorough, CMI-led dual inspection team.
          </p>
        </div>

        {/* Primary Google Review CTA */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              backgroundColor: '#D4AF37',
              color: '#0F172A',
              fontSize: '1.2rem',
              fontWeight: 800,
              padding: '1.1rem 2.25rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px -4px rgba(212, 175, 55, 0.45)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              width: '100%',
              maxWidth: '380px',
            }}
          >
            <span>⭐</span> Leave a 5-Star Google Review
          </Link>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
            Takes under 45 seconds • Opens directly to Google Maps
          </div>
        </div>

        {/* Keyword Thought Starters Box (SEO & AI Overview Engine) */}
        <div
          style={{
            backgroundColor: '#F1F5F9',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #E2E8F0',
          }}
        >
          <h2
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>💡</span> Helpful Details to Mention in Your Review:
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
            Specific details help other Atlanta families know what to expect and strengthen our local community presence:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>👥 Two-Inspector Team:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Having two certified inspectors on-site for thoroughness & half the inspection time.
              </p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>🔍 FLIR Thermal & Tech:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Infrared thermal imaging, crawlspace robot scans, or 4K drone roof inspection findings.
              </p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>🏆 Christopher Boykin, CMI®:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Clear explanations, honest communication, and patient answers during the walkthrough.
              </p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>📍 Your City & Due Diligence:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Mentioning your Atlanta suburb and how the same-day report helped during repair negotiations.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Review Platforms */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.75rem', fontWeight: 600 }}>
            Also Available On:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="https://www.homegauge.com/inspector/foresight-home-inspections"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                padding: '0.45rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              HomeGauge Verified
            </Link>
            <Link
              href="https://www.yelp.com/biz/foresight-home-inspections-lithonia"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                padding: '0.45rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Yelp Atlanta
            </Link>
          </div>
        </div>

        {/* Christopher's One-Click Post-Inspection Client Follow-Up Tool */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setShowInspectorTool(!showInspectorTool)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284C7',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              margin: '0 auto',
            }}
          >
            <span>📱</span> {showInspectorTool ? 'Hide Inspector Follow-Up Tool' : 'Inspector Tool: Quick Client Follow-Up Templates'}
          </button>

          {showInspectorTool && (
            <div
              style={{
                marginTop: '1rem',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '0.75rem',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Post-Inspection Review Invites (2-Hour Follow-Up)
                </span>
              </div>

              {/* SMS Template */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>📱 Quick SMS Template</span>
                  <button
                    onClick={() => copyToClipboard(smsTemplate, 'sms')}
                    style={{
                      background: copiedType === 'sms' ? '#22C55E' : '#D4AF37',
                      color: '#0F172A',
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedType === 'sms' ? '✅ Copied SMS!' : '📋 Copy SMS'}
                  </button>
                </div>
                <div
                  style={{
                    backgroundColor: '#1E293B',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: '#CBD5E1',
                    fontFamily: 'monospace',
                  }}
                >
                  {smsTemplate}
                </div>
              </div>

              {/* Email Template */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>✉️ Email Template</span>
                  <button
                    onClick={() => copyToClipboard(emailTemplate, 'email')}
                    style={{
                      background: copiedType === 'email' ? '#22C55E' : '#D4AF37',
                      color: '#0F172A',
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedType === 'email' ? '✅ Copied Email!' : '📋 Copy Email'}
                  </button>
                </div>
                <div
                  style={{
                    backgroundColor: '#1E293B',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: '#CBD5E1',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-line',
                    maxHeight: '140px',
                    overflowY: 'auto',
                  }}
                >
                  {emailTemplate}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Google Preferred Source Integration */}
        <div style={{ textAlign: 'left' }}>
          <GooglePreferredSource 
            customTitle="Make Foresight a Preferred Source on Google AI"
            customText="Already left a review? Click below to make Foresight a preferred source in your Google AI search results. You will always see our seasonal home maintenance advisories and Atlanta repair cost guides prioritized when you search."
          />
        </div>
      </div>
    </section>
  );
}
