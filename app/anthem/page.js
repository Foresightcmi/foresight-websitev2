import Link from 'next/link';
import Script from 'next/script';
import ForesightAnthemPlayer from '../components/ForesightAnthemPlayer';

export const metadata = {
  title: 'The Foresight Anthem | Hindsight is Expensive, Call Foresight',
  description: 'Listen to the official Foresight Home Inspections anthem: "Hindsight is Expensive, Call Foresight (678-480-2110)". Two certified inspectors, $10,000 warranty, and 48-hour scheduling across Metro Atlanta.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/anthem',
  },
  openGraph: {
    title: 'The Foresight Anthem: Hindsight is Expensive, Call Foresight',
    description: 'The official commercial theme song of Foresight Home Inspections. Protect your peace and every dime before you cross the finish line. Call 678-480-2110.',
    url: 'https://www.fhinspectionsatl.com/anthem',
    type: 'music.song',
  },
};

export default function AnthemPage() {
  const audioSchema = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    "name": "The Foresight Anthem (Hindsight is Expensive, Call Foresight)",
    "description": "The official commercial theme song and brand anthem for Foresight Home Inspections, LLC in Metro Atlanta, GA.",
    "contentUrl": "https://www.fhinspectionsatl.com/audio/foresight-anthem.mp3",
    "encodingFormat": "audio/mpeg",
    "duration": "PT2M59S",
    "inLanguage": "en-US",
    "author": {
      "@type": "Organization",
      "name": "Foresight Home Inspections, LLC",
      "url": "https://www.fhinspectionsatl.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Foresight Home Inspections, LLC",
      "url": "https://www.fhinspectionsatl.com"
    },
    "transcript": "Hindsight is expensive... call Foresight. You worked so hard to buy this place, to give your heart a safe space. Before you sign that line today, let me check beneath the frame. No hidden water in the walls, no cracks where the burden falls. Protect your peace and every dime, before you cross the finish line. Hindsight is expensive, Call Foresight! 6-7-8, 4-8-0, 21-10! Protect your home before you sign, make sure your future stays bright! 6-7-8, 4-8-0, 21-10! A strong house needs a steady ground, where love and safety can be found. We check the roof down to the base, so joy alone can fill your space. Don't let a secret ruin what you build, walk through the front door with no guilt. We guard your heart and savings too, because your family deserves the truth. Call Foresight... 678-480-2110... We got you."
  };

  return (
    <>
      <Script
        id="anthem-audio-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(audioSchema) }}
      />

      <section style={{
        background: 'linear-gradient(180deg, #0b1120 0%, #0f172a 50%, #1e293b 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem 6rem',
        minHeight: '85vh',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: 'var(--color-gold)',
              padding: '0.45rem 1.25rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              ?? Official Brand Sonic Identity
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '1rem',
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              &ldquo;Hindsight is Expensive.<br />
              <span style={{ color: 'var(--color-gold)' }}>Call Foresight.&rdquo;</span>
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#cbd5e1',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              The official commercial anthem for Foresight Home Inspections. Turn up your speakers and listen to the song protecting Atlanta homebuyers across our 50-mile footprint.
            </p>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
            <ForesightAnthemPlayer 
              title="Hindsight is Expensive (Call Foresight)"
              subtitle="Official Theme Song � Featuring the 678-480-2110 Hotline"
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2.5rem',
            marginBottom: '3rem'
          }}>
            <h2 style={{ color: 'var(--color-gold)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
              Why We Made This Anthem
            </h2>
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              In real estate, discovering hidden defects <em>after</em> closing is devastating. An undisclosed structural settlement, a compromised electrical panel, or rotted subflooring in a crawlspace can cost a new homeowner $10,000 to $40,000 out of pocket. 
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              <strong>Hindsight is expensive.</strong> That is why Certified Master Inspector� Christopher Boykin created the <strong>Two-Inspector Standard</strong>: placing two certified inspectors on every single job, deploying FLIR thermal imaging and drone aerial scans, delivering digital PDF reports in under 24 hours, and backing every buyer with an included <strong>$10,000 Elite Master Warranty ($0 deductible)</strong>.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>
              When you are under contract in Metro Atlanta, memorize the hook: <strong>678-480-2110</strong>.
            </p>
          </div>

          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '2.25rem',
            marginBottom: '3rem'
          }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Download Audio Assets &amp; Ringtones
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Free high-definition MP3 audio files for Atlanta real estate agents, podcasts, and homeowner on-hold audio.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ color: 'var(--color-gold)', margin: '0 0 0.25rem', fontSize: '1rem' }}>Full Anthem (2:59)</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 0.85rem' }}>High-definition full vocal ballad with chorus and bridge.</p>
                <a href="/audio/foresight-anthem.mp3" download className="btn btn-outline-light" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', width: '100%', textAlign: 'center' }}>
                  ? Download Full MP3 (2.8 MB)
                </a>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ color: 'var(--color-gold)', margin: '0 0 0.25rem', fontSize: '1rem' }}>30s Radio &amp; Podcast Hook</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 0.85rem' }}>Fast commercial cut with the 678-480-2110 hook.</p>
                <a href="/audio/foresight-anthem-30s-hook.mp3" download className="btn btn-outline-light" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', width: '100%', textAlign: 'center' }}>
                  ? Download 30s Hook (470 KB)
                </a>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ color: 'var(--color-gold)', margin: '0 0 0.25rem', fontSize: '1rem' }}>15s Ringtone &amp; On-Hold</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 0.85rem' }}>Short earworm chorus cut for mobile ringtones.</p>
                <a href="/audio/foresight-anthem-15s-ringtone.mp3" download className="btn btn-outline-light" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', width: '100%', textAlign: 'center' }}>
                  ? Download 15s Cut (235 KB)
                </a>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #b8860b 100%)',
            color: '#0f172a',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(212,175,55,0.3)'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', color: '#0f172a' }}>
              Don&apos;t Rely on Hindsight. Call Foresight.
            </h3>
            <p style={{ fontSize: '1.15rem', color: '#1e293b', maxWidth: '650px', margin: '0 auto 2rem', lineHeight: 1.6, fontWeight: 600 }}>
              Lock in your inspection with Christopher Boykin, CMI and our signature two-inspector team across 87+ Metro Atlanta cities.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="tel:6784802110"
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                ?? Call 678-480-2110
              </a>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  border: '2px solid #0f172a'
                }}
              >
                Schedule Inspection Online &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
