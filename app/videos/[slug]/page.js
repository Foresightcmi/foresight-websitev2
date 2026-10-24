import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const dynamic = 'force-static';
export const dynamicParams = false;

export const SERVICE_VIDEOS = [
  {
    slug: 'new-construction-inspections',
    title: 'New Construction Inspection in Metro Atlanta — CMI® Video Briefing',
    shortTitle: 'New Construction Multi-Phase Inspections',
    description: 'Certified Master Inspector® Christopher Boykin explains how Foresight Home Inspections conducts independent Phase 1 Pre-Drywall (from $275) and Phase 2 Final Walkthrough (from $400) inspections across Metro Atlanta using a two-inspector team.',
    videoUrl: '/videos/services/new-construction.mp4',
    posterUrl: '/images/services/new-construction-poster.webp',
    durationIso: 'PT30S',
    durationSeconds: 30,
    durationDisplay: '0:30',
    uploadDate: '2026-10-11T00:00:00Z',
    serviceHref: '/services/new-construction-inspection',
    startingPrice: 'From $275 (Pre-Drywall) / From $400 (Final)',
    takeaways: [
      'Phase 1 Pre-Drywall Rough-In Inspection (from $275) evaluates load-bearing framing, shear walls, PEX plumbing manifolds, HVAC ductwork, and rough electrical wiring before insulation and drywall conceal defects.',
      'Phase 2 Final Walkthrough Inspection (from $400) deploys two certified inspectors with calibrated infrared thermal cameras and 4K aerial drones to verify full mechanical, roof, and structural completion prior to closing.',
      'Backed by our $10,000 Elite Master Inspection Warranty ($0 deductible) plus InterNACHI® $25,000 Honor Guarantee.'
    ]
  },
  {
    slug: '11-month-warranty-inspection',
    title: '11-Month Builder Warranty Inspection in Metro Atlanta — CMI® Video Briefing',
    shortTitle: '11-Month Builder Warranty Inspection',
    description: 'Watch how Foresight Home Inspections documents latent structural settlement, roof flashing separations, HVAC static pressure issues, and moisture intrusion during Month 10 or 11 so your builder repairs them before your 1-year warranty expires.',
    videoUrl: '/videos/services/11-month-warranty.mp4',
    posterUrl: '/images/services/11-month-warranty-poster.webp',
    durationIso: 'PT40S',
    durationSeconds: 40,
    durationDisplay: '0:40',
    uploadDate: '2026-10-12T00:00:00Z',
    serviceHref: '/services/11-month-warranty-inspection',
    startingPrice: 'From $335',
    takeaways: [
      'Performed during Month 10 or 11 of ownership (starting at $335) before the builder 1-year workmanship warranty expires.',
      'Includes two certified inspectors on site, calibrated infrared thermal imaging, and 4K aerial drone roof diagnostics at zero additional upsell.',
      'Delivers a photo-annotated, builder-ready repair punch list within 24 hours so homeowners can submit documented warranty claims on time.'
    ]
  },
  {
    slug: 'pool-and-spa-inspections',
    title: 'Swimming Pool & Spa Inspection in Metro Atlanta — CMI® Video Briefing',
    shortTitle: 'Swimming Pool & Spa Inspection',
    description: 'Certified Master Inspector® Christopher Boykin outlines Foresight Home Inspections’ mechanical, hydraulic, electrical bonding, and barrier safety evaluation for residential swimming pools and heated spas across Metro Atlanta.',
    videoUrl: '/videos/services/pool-and-spa.mp4',
    posterUrl: '/images/services/pool-and-spa-poster.webp',
    durationIso: 'PT40S',
    durationSeconds: 40,
    durationDisplay: '0:40',
    uploadDate: '2026-10-11T00:00:00Z',
    serviceHref: '/services/pool-inspection',
    startingPrice: '$300 Flat Rate',
    takeaways: [
      'Evaluates multi-speed circulation pumps, sand/cartridge/DE filtration housings, gas and heat-pump heaters, salt chlorine generators, and automated valves ($300 flat rate).',
      'Verifies NEC Article 680 equipotential electrical bonding, GFCI circuit protection, underwater luminaire safety, and child safety barrier compliance.',
      'Inspects plaster/pebble interior surfaces, coping stones, skimmer throats, and deck drainage gradients.'
    ]
  },
  {
    slug: 'sewer-scope-inspections',
    title: 'Sewer Scope Lateral Camera Inspection in Metro Atlanta — CMI® Video Briefing',
    shortTitle: 'Sewer Scope Lateral Camera Inspection',
    description: 'See how Foresight Home Inspections conducts fiber-optic HD video camera inspections of underground main sewer laterals from the house cleanout to the municipal tap across Metro Atlanta ($450 flat rate).',
    videoUrl: '/videos/services/sewer-scope.mp4',
    posterUrl: '/images/services/sewer-scope-poster.webp',
    durationIso: 'PT36S',
    durationSeconds: 36,
    durationDisplay: '0:36',
    uploadDate: '2026-10-11T00:00:00Z',
    serviceHref: '/services/sewer-scope-inspection',
    startingPrice: '$450 Flat Rate',
    takeaways: [
      'High-definition waterproof fiber-optic camera inspection from the main cleanout to the street tap or septic inlet ($450 flat rate).',
      'Identifies tree root intrusion, crushed Orangeburg or terracotta clay pipe, cast-iron channel rot, offset joints, and standing-water bellies.',
      'Prevents $6,500 to $18,000+ post-closing trenchless or excavated sewer line replacement surprises.'
    ]
  },
  {
    slug: 'termite-and-wdo-inspections',
    title: 'Official Georgia Termite & WDO Inspection in Atlanta — CMI® Video Briefing',
    shortTitle: 'Official Georgia Termite & WDO Inspection',
    description: 'Certified Master Inspector® Christopher Boykin details Official Georgia Wood Infestation Inspection Reports for subterranean termites, powderpost beetles, carpenter ants, and wood-decay fungi across Metro Atlanta.',
    videoUrl: '/videos/services/termite-inspection.mp4',
    posterUrl: '/images/services/termite-inspection-poster.webp',
    durationIso: 'PT35S',
    durationSeconds: 35,
    durationDisplay: '0:35',
    uploadDate: '2026-10-11T00:00:00Z',
    serviceHref: '/services/termite-inspection',
    startingPrice: '$125 ($165 Crawlspace)',
    takeaways: [
      'Provides the Official Georgia Wood Infestation Inspection Report required by mortgage lenders for VA, FHA, and conventional real estate closings ($125 slab/basement; $165 crawlspace).',
      'evaluates foundation stem walls, sill plates, rim joists, subfloor framing, and exterior earth-to-wood contact zones for Eastern Subterranean Termite mud tubes.',
      'Identifies active infestations, conducive moisture conditions, and structural wood-decay fungus.'
    ]
  },
  {
    slug: 'radon-gas-testing',
    title: 'Continuous 48-Hour Electronic Radon Testing in Atlanta GA — CMI® Video Briefing',
    shortTitle: '48-Hour Continuous Electronic Radon Testing',
    description: 'Learn why North Georgia’s granite bedrock places Fulton, DeKalb, Gwinnett, and Cobb counties in EPA Radon Zone 1, and how Foresight performs 48-hour continuous electronic radon monitoring ($250).',
    videoUrl: '/videos/services/radon-testing.mp4',
    posterUrl: '/images/services/radon-testing-poster.webp',
    durationIso: 'PT30S',
    durationSeconds: 30,
    durationDisplay: '0:30',
    uploadDate: '2026-10-11T00:00:00Z',
    serviceHref: '/services/radon-testing',
    startingPrice: '$275 Flat Rate',
    takeaways: [
      'Deploys calibrated continuous electronic radon monitors for a minimum 48-hour closed-building test period ($250 flat rate).',
      'Produces hour-by-hour pCi/L barometric and tamper-verified telemetry rather than delayed charcoal mail-in canisters.',
      'Identifies properties exceeding the 4.0 pCi/L EPA action threshold so buyers can negotiate sub-slab depressurization mitigation ($1,200–$1,800) prior to closing.'
    ]
  },
  {
    slug: 'mold-indoor-air-quality-testing',
    title: 'Certified Spore Trap Mold & Indoor Air Quality Testing in Atlanta — CMI® Video Briefing',
    shortTitle: 'Mold & Indoor Air Quality Testing',
    description: 'Certified Master Inspector® Christopher Boykin explains calibrated Zefon Bio-Pump spore trap air sampling, surface swab collection, and accredited laboratory microbiology analysis across Metro Atlanta ($450 flat rate).',
    videoUrl: '/videos/services/mold-testing.mp4',
    posterUrl: '/images/services/mold-testing-poster.webp',
    durationIso: 'PT39S',
    durationSeconds: 39,
    durationDisplay: '0:39',
    uploadDate: '2026-10-12T00:00:00Z',
    serviceHref: '/services/mold-testing',
    startingPrice: '$450 Flat Rate',
    takeaways: [
      'Combines calibrated volumetric air cassette sampling (15 liters/minute) with outdoor baseline control comparison and direct surface tape/swab sampling ($450 flat rate).',
      'Pairs biological sampling with non-invasive infrared thermography and pinless dielectric moisture metering to pinpoint the hidden water source feeding fungal growth.',
      'Delivers accredited laboratory genus-level spore counts (including Stachybotrys, Aspergillus/Penicillium, and Chaetomium).'
    ]
  },
  {
    slug: 'short-term-rental-str-compliance-inspection',
    title: 'Airbnb & Short-Term Rental (STR) Compliance Inspection in Atlanta — CMI® Video Briefing',
    shortTitle: 'Short-Term Rental (STR) Safety & Code Compliance',
    description: 'See how Foresight Home Inspections conducts municipal Short-Term Rental (STR) life-safety, egress, occupancy load, and electrical compliance inspections with a signed CMI® Affidavit (starts at $395).',
    videoUrl: '/videos/services/short-term-rental.mp4',
    posterUrl: '/images/services/short-term-rental-poster.webp',
    durationIso: 'PT31S',
    durationSeconds: 31,
    durationDisplay: '0:31',
    uploadDate: '2026-10-12T00:00:00Z',
    serviceHref: '/services',
    startingPrice: '$595 Flat Rate',
    takeaways: [
      'Complete municipal STR life-safety and building code evaluation for Atlanta, Fulton, DeKalb, and Metro Atlanta hosts (starts at $395).',
      'Verifies interconnected smoke and carbon monoxide alarms, bedroom emergency egress window dimensions, fire extinguisher mounting, GFCI/AFCI protection, and deck load safety.',
      'Includes a stamped Certified Master Inspector® (CMI®) Compliance Affidavit delivered within 24 hours.'
    ]
  }
];

export async function generateStaticParams() {
  return SERVICE_VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const video = SERVICE_VIDEOS.find((v) => v.slug === resolvedParams.slug);
  if (!video) return { title: 'Video Not Found' };

  const pageUrl = `${SITE_URL}/videos/${video.slug}`;

  return {
    title: `${video.shortTitle} Video | Foresight Home Inspections`,
    description: video.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: video.title,
      description: video.description,
      url: pageUrl,
      type: 'video.other',
      videos: [
        {
          url: `${SITE_URL}${video.videoUrl}`,
          width: 1280,
          height: 720,
          type: 'video/mp4',
        },
      ],
      images: [
        {
          url: `${SITE_URL}${video.posterUrl}`,
          width: 1200,
          height: 675,
          alt: video.title,
        },
      ],
    },
  };
}

export default async function ServiceVideoWatchPage({ params }) {
  const resolvedParams = await params;
  const video = SERVICE_VIDEOS.find((v) => v.slug === resolvedParams.slug);
  if (!video) notFound();

  const pageUrl = `${SITE_URL}/videos/${video.slug}`;

  const watchPageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoObject',
        '@id': `${pageUrl}#video`,
        name: video.title,
        description: video.description,
        thumbnailUrl: [`${SITE_URL}${video.posterUrl}`],
        uploadDate: video.uploadDate,
        duration: video.durationIso,
        contentUrl: `${SITE_URL}${video.videoUrl}`,
        embedUrl: pageUrl,
        inLanguage: 'en-US',
        author: {
          '@type': 'Person',
          name: 'Christopher Boykin',
          jobTitle: 'Certified Master Inspector® (CMI)',
          url: `${SITE_URL}/about`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Foresight Home Inspections, LLC',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/Logopng.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Videos', item: `${SITE_URL}/videos` },
          { '@type': 'ListItem', position: 3, name: video.shortTitle, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main style={{ background: '#090D16', color: '#F8FAFC', minHeight: '100vh', padding: '3.5rem 0 5rem' }}>
      <Script
        id={`video-watch-schema-${video.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(watchPageSchema) }}
      />

      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.25rem' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <Link href="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem', color: '#64748B' }}>/</span>
          <Link href="/videos" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Videos</Link>
          <span style={{ margin: '0 0.5rem', color: '#64748B' }}>/</span>
          <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{video.shortTitle}</span>
        </nav>

        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', borderRadius: '9999px', padding: '0.35rem 0.95rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            CMI® Field Video Briefing • {video.durationDisplay} • {video.startingPrice}
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, color: '#FFFFFF', margin: '0 0 0.85rem 0' }}>
            {video.title}
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
            {video.description}
          </p>
        </header>

        {/* Primary Dedicated Watch Page Video Player */}
        <section aria-label="Video Player" style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#000000',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              aspectRatio: '16/9',
            }}
          >
            <video
              controls
              playsInline
              preload="metadata"
              poster={video.posterUrl}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
                background: '#000000',
              }}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Key Diagnostic Takeaways */}
        <section
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.75rem',
            marginBottom: '2.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginTop: 0, marginBottom: '1rem' }}>
            Key Field Protocol &amp; Inspection Standards
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#E2E8F0', lineHeight: 1.7, display: 'grid', gap: '0.75rem' }}>
            {video.takeaways.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </section>

        {/* CTA Bar */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(15,23,42,0.9) 100%)',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '14px',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '0.65rem' }}>
            Book Your Two-Inspector Diagnostic Evaluation
          </h2>
          <p style={{ color: '#CBD5E1', marginBottom: '1.5rem', fontSize: '0.98rem' }}>
            Every standard inspection includes two certified inspectors, infrared thermal imaging, 4K drone roof scans, and up to $35,000 in combined warranty protection.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quote" className="btn btn-gold" style={{ padding: '0.85rem 1.85rem', fontWeight: 700 }}>
              Calculate Instant Quote &rarr;
            </Link>
            <Link href={video.serviceHref} className="btn btn-outline-light" style={{ padding: '0.85rem 1.85rem', fontWeight: 700 }}>
              View Full {video.shortTitle} Guide &rarr;
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
