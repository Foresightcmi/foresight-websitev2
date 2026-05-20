import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// Dynamically generate routes at build time for high performance SEO
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cities = JSON.parse(fileContents);
  
  return cities.map((city) => ({
    city: city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cities = JSON.parse(fileContents);
  
  const cityNameParam = resolvedParams.city;
  const cityData = cities.find(c => c['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-') === cityNameParam) || { 'City Name': resolvedParams.city.replace(/-/g, ' '), County: 'Georgia' };
  
  return {
    title: `Best Home Inspector in ${cityData['City Name']}, GA | Foresight Home Inspections`,
    description: `Need a certified home inspector in ${cityData['City Name']}, GA? Foresight Home Inspections provides premium, dual-inspector services led by a Certified Master Inspector (CMI) for ultimate peace of mind.`,
    keywords: [`Home Inspector ${cityData['City Name']}`, `Best home inspection ${cityData['City Name']} GA`, `Certified Master Inspector ${cityData.County} County`],
  };
}

export default async function CityPage({ params }) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cities = JSON.parse(fileContents);
  
  const cityNameParam = resolvedParams.city;
  const cityData = cities.find(c => c['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-') === cityNameParam) || { 'City Name': resolvedParams.city.replace(/-/g, ' '), County: 'Georgia' };
  
  // Localized JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Home Inspection",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "678-480-2110"
    },
    "areaServed": {
      "@type": "City",
      "name": cityData['City Name'],
      "containedInPlace": {
        "@type": "State",
        "name": "Georgia"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero" style={{ padding: '6rem 0' }}>
        <div className="container hero-content">
          <h1 style={{ marginBottom: '1rem' }}>
            Top-Rated Home Inspection in<br />
            <span style={{ color: 'var(--color-red)' }}>{cityData['City Name']}, GA</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Serving all of {cityData.County} County. When you're buying a home in {cityData['City Name']}, you need the absolute best. We provide two certified inspectors on every job for unrivaled accuracy.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/quote" className="btn btn-primary">Get an Instant Quote</Link>
            <a href="tel:6784802110" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>Call 678-480-2110</a>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-dark), #1f2937)', color: 'white' }}>
        <div className="container">
          <div className="section-title">
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-red)' }}>$10,000</span> Peace of Mind Protection
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem' }}>
              Because Christopher Boykin is a Certified Master Inspector®, you receive the maximum Elite MASTER level warranty plan that ordinary inspectors simply cannot offer.
            </p>
          </div>
          
          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Elite Terms
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>90 Days from closing or 120 Days from inspection (whichever comes first).</p>
            </div>
            
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Total Coverage
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>$10,000 Aggregate Coverage Limit with exactly $0 Deductible.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Appliances
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for Major Kitchen Appliances (NO age limits). Washer/Dryer fully included.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Structural
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 coverage for structural components of the home.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Mechanicals
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 coverage for Major Mechanicals (HVAC, Electrical, Plumbing).</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Additional Protection
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for Mold Remediation and $1,000 for Roof Leak Protection.</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.125rem', marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Getting an inspection isn't just smart—it saves you from financial disasters and gives realtors a powerful tool to negotiate thousands off the asking price.
            </p>
            <Link href="/quote" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Secure Your $10,000 Protection Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div className="card card-premium">
              <h2>Why {cityData['City Name']} Homebuyers Trust Us</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Houses in {cityData['City Name']} vary from new constructions to historic properties. A standard walkthrough isn't enough. A lead Certified Master Inspector of InterNACHI will be on site along with another certified inspector, bringing thermal imaging and drone technology to every inspection and ensuring your investment is perfectly sound.
              </p>
              <ul className="cms-content" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> Detailed PDF report within 24 hours
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> Fully licensed & insured in Georgia
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> Radon, Sewer Scope, & Mold Add-ons
                </li>
              </ul>
            </div>
            <div>
               <img src="/images/hero.jpg" alt={`${cityData['City Name']} Home Inspection`} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
            </div>
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Have questions about a home in {cityData['City Name']}?</h2>
          <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>Chat with Foresight AI, trained on InterNACHI standards.</p>
          <Link href="/ask-twin" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Ask Foresight AI</Link>
        </div>
      </section>
    </>
  );
}
