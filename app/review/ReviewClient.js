'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GooglePreferredSource from '../components/GooglePreferredSource';

export default function ReviewClient() {
  const [copiedType, setCopiedType] = useState(null);
  const [showInspectorTool, setShowInspectorTool] = useState(false);
  const [dispatchMode, setDispatchMode] = useState('previous'); // 'previous' | 'sameday'

  // Dynamic Inspector Dispatch State
  const [clientName, setClientName] = useState('John & Claire');
  const [clientPhone, setClientPhone] = useState('404-555-0199');
  const [clientEmail, setClientEmail] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('4829 River Valley Manor');

  const directGoogleReviewUrl = "https://g.page/r/CaK5MZOz_FBtEBM/review";
  const shortReviewUrl = "https://www.fhinspectionsatl.com/review";

  const firstName = (clientName || 'Valued Client').split(' ')[0];
  const address = propertyAddress || 'your property';

  // Dynamic 5-Star SMS Templates
  const previousClientSms = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! It was an absolute honor inspecting your home at ${address}. As an independent Atlanta local business, our reputation is built on 5-star reviews from valued clients like you. Could you please take 30 seconds to give us a 5-star review on Google? ⭐ Tap here for instant access: ${directGoogleReviewUrl} - It means the world to our team! Thank you so much! Christopher Boykin, CMI® (678) 480-2110`;

  const sameDaySms = `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections here! Thank you for trusting our two-inspector team on ${address} today! Your digital CRL report is ready. As an Atlanta local family business, our reputation is built on 5-star client experiences. If our thoroughness and thermal scan gave you peace of mind, could you take 30 seconds to share a 5-star review on Google? ⭐ Tap here for instant access: ${directGoogleReviewUrl} - Christopher Boykin, CMI® (678) 480-2110`;

  const activeSms = dispatchMode === 'previous' ? previousClientSms : sameDaySms;

  // Dynamic 5-Star Email Templates
  const previousClientEmailSubject = `Checking in on ${address} + Quick Favor for Christopher Boykin ⭐⭐⭐⭐⭐`;
  const previousClientEmailBody = `Dear ${clientName || 'Valued Client'},\n\nI hope you and your family are settling in wonderfully at ${address}!\n\nChristopher Boykin here, founder of Foresight Home Inspections. It was a true pleasure inspecting your home during your due diligence.\n\nAs an independent, Georgia-certified small business, 5-star Google reviews from previous clients are the lifeblood of our company—they are how local Atlanta homebuyers know they can trust our two-inspector team to protect their investment.\n\nIf you had a great experience with our inspection thoroughness, FLIR thermal scans, and detailed report, would you take 30 seconds to leave us a 5-star review on Google?\n\n⭐⭐⭐⭐⭐ Tap here to leave your 5-Star Review:\n${directGoogleReviewUrl}\n\nIf there is anything you ever need regarding home maintenance, contractor recommendations, or building questions, my direct cell is always open to you at (678) 480-2110.\n\nWith sincere gratitude,\n\nChristopher Boykin, CMI®\nCertified Master Inspector\nForesight Home Inspections LLC\nPhone: (678) 480-2110\nWebsite: https://www.fhinspectionsatl.com`;

  const sameDayEmailSubject = `Your Inspection Report + Quick Favor for Christopher Boykin ⭐⭐⭐⭐⭐`;
  const sameDayEmailBody = `Dear ${clientName || 'Valued Client'},\n\nThank you for trusting Foresight Home Inspections to evaluate ${address} today. Our mission is to give you complete clarity and peace of mind during your home buying journey.\n\nYour complete digital inspection report and FLIR thermal photos are now ready.\n\nAs a locally-owned Atlanta business, 5-star Google reviews from valued clients mean the world to our inspection team. If you appreciated our two-inspector thoroughness, detailed walkthrough, and $10,000 warranty protection, could you take 30 seconds to leave us a 5-star review on Google?\n\n⭐⭐⭐⭐⭐ Tap here to leave your 5-Star Review:\n${directGoogleReviewUrl}\n\nPlease don't hesitate to reach out if you have any questions about your report or contractor repair priorities.\n\nWarm regards,\n\nChristopher Boykin, CMI®\nCertified Master Inspector\nForesight Home Inspections LLC\nPhone: (678) 480-2110\nWebsite: https://www.fhinspectionsatl.com`;

  const activeEmailSubject = dispatchMode === 'previous' ? previousClientEmailSubject : sameDayEmailSubject;
  const activeEmailBody = dispatchMode === 'previous' ? previousClientEmailBody : sameDayEmailBody;

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

  const handleSendSMS = () => {
    const cleanPhone = (clientPhone || '').replace(/[^0-9]/g, '');
    window.location.href = `sms:${cleanPhone}?body=${encodeURIComponent(activeSms)}`;
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${clientEmail || ''}?subject=${encodeURIComponent(activeEmailSubject)}&body=${encodeURIComponent(activeEmailBody)}`;
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
          maxWidth: '760px',
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
              fontFamily: "'Outfit', sans-serif"
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
            We appreciate your trust! Your 5-star Google review helps Metro Atlanta homebuyers discover a thorough, CMI-led dual inspector team.
          </p>
        </div>

        {/* Primary Google Review CTA */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a
            href={directGoogleReviewUrl}
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
              maxWidth: '420px',
            }}
          >
            <span>⭐⭐⭐⭐⭐</span> Leave a 5-Star Google Review
          </a>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
            Takes under 30 seconds • Opens directly to Google Review dialog
          </div>
        </div>

        {/* Helpful Details Box */}
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
            <span>💡</span> Helpful Details to Mention in Your 5-Star Review:
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
                Having two certified inspectors on-site for thoroughness and half the inspection time.
              </p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>🔍 FLIR Thermal &amp; Drone Tech:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Infrared thermal imaging, electrical panel scan, and aerial drone roof findings.
              </p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>🏆 Christopher Boykin, CMI®:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Clear explanations, honest communication, and patient walkthrough answers.
              </p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>📍 Atlanta Suburb &amp; CRL Report:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Mentioning your neighborhood and how the same-day report helped during negotiations.
              </p>
            </div>
          </div>
        </div>

        {/* 1-Tap Client Review Dispatch App (For Christopher Boykin) */}
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
              background: '#0F172A',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              borderRadius: '0.5rem',
              padding: '0.65rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}
          >
            <span>📱</span> {showInspectorTool ? 'Hide Review Dispatch App' : 'Open Foresight 5-Star Review Dispatch App'}
          </button>

          {showInspectorTool && (
            <div
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #334155'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Foresight Client Review Dispatcher
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>
                    1-Tap dispatch via native SMS &amp; Email to previous and recent clients
                  </p>
                </div>

                {/* Target Mode Toggle */}
                <div style={{ display: 'inline-flex', background: '#1E293B', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('previous')}
                    style={{
                      background: dispatchMode === 'previous' ? '#D4AF37' : 'transparent',
                      color: dispatchMode === 'previous' ? '#0F172A' : '#94A3B8',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    Previous Clients
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('sameday')}
                    style={{
                      background: dispatchMode === 'sameday' ? '#D4AF37' : 'transparent',
                      color: dispatchMode === 'sameday' ? '#0F172A' : '#94A3B8',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    Today's Inspection
                  </button>
                </div>
              </div>

              {/* Client Info Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John & Claire Vance"
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #475569', borderRadius: '6px', padding: '6px 10px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Client Phone (for 1-Tap SMS)</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 404-555-0199"
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #475569', borderRadius: '6px', padding: '6px 10px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Property Address Inspected</label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. 4829 River Valley Manor, Atlanta GA"
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #475569', borderRadius: '6px', padding: '6px 10px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Direct Review Link Indicator */}
              <div style={{ background: '#1E293B', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Direct Google 5-Star Link Embedded in Messages:
                </span>
                <a
                  href={directGoogleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Test 5-Star Link &rarr;
                </a>
              </div>

              {/* SMS Dispatch Section */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📱</span> SMS Message Preview (5-Star Request Expressed)
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleSendSMS}
                      style={{
                        background: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      📲 1-Tap Send SMS
                    </button>
                    <button
                      onClick={() => copyToClipboard(activeSms, 'sms')}
                      style={{
                        background: copiedType === 'sms' ? '#22C55E' : '#334155',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedType === 'sms' ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#1E293B',
                    padding: '0.85rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: '#E2E8F0',
                    fontFamily: 'monospace',
                    border: '1px solid #334155'
                  }}
                >
                  {activeSms}
                </div>
              </div>

              {/* Email Dispatch Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>✉️</span> Email Subject &amp; Body Preview
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleSendEmail}
                      style={{
                        background: '#3B82F6',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      ✉️ 1-Tap Send Email
                    </button>
                    <button
                      onClick={() => copyToClipboard(activeEmailBody, 'email')}
                      style={{
                        background: copiedType === 'email' ? '#22C55E' : '#334155',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedType === 'email' ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#1E293B',
                    padding: '0.85rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: '#E2E8F0',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-line',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    border: '1px solid #334155'
                  }}
                >
                  <strong>Subject: {activeEmailSubject}</strong>
                  {'\n\n'}
                  {activeEmailBody}
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
