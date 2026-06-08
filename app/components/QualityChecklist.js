'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QualityChecklist() {
  const checklistItems = [
    {
      id: 'cmi',
      label: 'Lead Inspector is a Certified Master Inspector® (CMI)',
      description: 'The highest designation in North America, representing the top 2% of elite, audit-verified inspectors.',
      foresight: '✅ YES (Christopher Boykin is a credentialed CMI®)',
      others: '❌ NO (Often rookie or uncertified solo operators)'
    },
    {
      id: 'dual',
      label: 'Two Certified Inspectors On-Site Working in Unison',
      description: 'Double the eyes, double the thoroughness. One focuses on systems/exterior, one on interior/details.',
      foresight: '✅ YES (Two Person Inspection Team certified team physically on every job)',
      others: '❌ NO (Solo dispatch model where one person rushes the job)'
    },
    {
      id: 'thermal',
      label: 'Complimentary FLIR Thermal Imaging Scan Included',
      description: 'Infrared scanning of panels, walls, and ceilings to locate active hidden water leaks and fire hazards.',
      foresight: '✅ YES (Included on every inspection at $0 cost)',
      others: '❌ NO (Charged as a $150–$250 paid add-on, or not offered)'
    },
    {
      id: 'warranty',
      label: 'Complimentary $10,000 Master Protection Warranty',
      description: '$0 deductible coverage for major appliances, structure, mechanicals (HVAC/plumbing), roofs, and mold.',
      foresight: '✅ YES (Elite Master-level $10,000 policy included free)',
      others: '❌ NO (Zero warranty protection, or heavily restricted plans)'
    },
    {
      id: 'concierge',
      label: 'Free White-Glove Utility Setup (Utilities Plus)',
      description: 'A single, high-touch concierge phone call to connect power, water, gas, fiber internet, and home security.',
      foresight: '✅ YES (Complimentary VIP access to Utilities Plus)',
      others: '❌ NO (Client must coordinate and call individual utilities themselves)'
    },
    {
      id: 'supra',
      label: 'Active SUPRA Key Access for Secure Lockbox Entry',
      description: 'Inspectors carry active MLS eKEYs, saving real estate agents time-consuming coordination and long drives.',
      foresight: '✅ YES (Active SUPRA entry carried by our team)',
      others: '❌ NO (Realtor or homeowner must physically open the door)'
    },
    {
      id: 'drone',
      label: 'High-Resolution Aerial Drone Scan for Steep Roofs',
      description: 'Specialized camera drones scan steep, tall, or delicate roofs that other inspectors mark as "inaccessible".',
      foresight: '✅ YES (Drone imaging included for all inaccessible structures)',
      others: '❌ NO (Roof is marked "Not Inspected" if steep or wet)'
    },
    {
      id: 'crl',
      label: '24-Hour Digital Report with Create Request List (CRL™)',
      description: 'Allows agents and buyers to click items directly inside the report to generate standard repair amendments in minutes.',
      foresight: '✅ YES (Interactive HomeGauge CRL™ reports delivered within 24hr)',
      others: '❌ NO (Static PDF reports requiring manual copying and pasting)'
    }
  ];

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="section bg-white" style={{ padding: '6rem 0' }}>
      {/* CSS Styles for Print Mode */}
      <style jsx global>{`
        .only-print {
          display: none;
        }
        @media print {
          /* Hide everything except the print-checklist container */
          body * {
            visibility: hidden;
          }
          #print-checklist-area, #print-checklist-area * {
            visibility: visible;
          }
          #print-checklist-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .only-print {
            display: block !important;
          }
          .print-border {
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            padding: 1.5rem !important;
            margin-bottom: 1rem !important;
            page-break-inside: avoid;
            background: white !important;
          }
          .badge {
            border: 1px solid #000 !important;
            color: black !important;
            background: transparent !important;
          }
          h1, h2, h3 {
            color: black !important;
          }
          a {
            color: black !important;
            text-decoration: underline !important;
          }
        }
      `}</style>

      <div className="container" id="print-checklist-area" style={{ maxWidth: '1000px' }}>
        {/* Header Block */}
        <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
          <span className="badge" style={{ marginBottom: '1rem', background: 'var(--color-red-light)', color: 'var(--color-red)' }}>Consumer Protection Tool</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Home Inspector Quality Checklist</h2>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '750px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Not all home inspectors are created equal. Many bargain-hunters choose cheaper, uncertified inspectors only to discover thousands in hidden defects later. Use this interactive vetting tool to compare inspectors side-by-side when shopping around.
          </p>
        </div>

        {/* Printable/Downloadable Callout */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-gray-light)', padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', border: '1px solid var(--color-gray-mid)' }}>
          <div style={{ flex: 1, marginRight: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>📋 Vetting Checklist Worksheet</h3>
            <p style={{ margin: 0, color: 'var(--color-gray-dark)', fontSize: '0.95rem' }}>Print this sheet to physically verify credentials, or check items off online as you make calls.</p>
          </div>
          <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
            🖨️ Print / Download Vetting PDF
          </button>
        </div>

        {/* The Grid / Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {checklistItems.map((item) => (
            <div 
              key={item.id} 
              className="print-border"
              style={{ 
                background: checkedItems[item.id] ? 'var(--color-red-light)' : 'var(--color-gray-light)',
                border: checkedItems[item.id] ? '1px solid rgba(211,47,47,0.3)' : '1px solid rgba(0,0,0,0.06)',
                borderRadius: 'var(--radius-lg)', 
                padding: '2rem',
                transition: 'all 0.2s ease-in-out',
                boxShadow: checkedItems[item.id] ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                {/* Interactive Checkbox */}
                <div className="no-print" style={{ marginTop: '0.25rem' }}>
                  <input 
                    type="checkbox" 
                    id={`check-${item.id}`}
                    checked={!!checkedItems[item.id]} 
                    onChange={() => toggleCheck(item.id)}
                    style={{ 
                      width: '1.5rem', 
                      height: '1.5rem', 
                      accentColor: 'var(--color-red)', 
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  />
                </div>
                
                {/* Checklist Content */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <label 
                    htmlFor={`check-${item.id}`} 
                    className="no-print"
                    style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 700, 
                      color: 'var(--color-dark)', 
                      cursor: 'pointer',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {item.label}
                  </label>
                  {/* Static label for Print mode */}
                  <h3 className="only-print" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    [ ] {item.label}
                  </h3>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Vetting Columns */}
              <div 
                style={{ 
                  marginTop: '1.5rem', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '1rem',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  paddingTop: '1.25rem'
                }}
              >
                {/* Foresight Column */}
                <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(211,47,47,0.15)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-red)', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                    🛡️ FORESIGHT STANDARDS
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-dark)' }}>{item.foresight}</strong>
                </div>

                {/* Other/Cheap Inspectors Column */}
                <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-gray-dark)', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                    ⚖️ CHEAP / OTHER INSPECTORS
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)' }}>{item.others}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Block */}
        <div className="no-print" style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'var(--color-dark)', color: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          <h3 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Ready for the Elite Standard of Home Inspection?</h3>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Don&apos;t risk your life savings or peace of mind on uncertified discount inspectors. Armed with this checklist, you can see why thousands of Georgia buyers choose Foresight!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              📅 Book CMI-Led Inspection Now
            </a>
            <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              💰 Calculate Instant Price Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
