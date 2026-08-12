'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        e.target.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="slogan-heading">
            &ldquo;Hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <h1 style={{ color: 'var(--color-white)' }}>Contact Foresight</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
            We're ready to provide you with the comprehensive service and peace of mind you deserve.
          </p>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div style={{ background: 'var(--color-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '3rem', borderLeft: '4px solid var(--color-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Ready to Book Online?</h2>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0 }}>Skip the forms and phone calls—schedule your Certified Master Inspector-led dual home inspection instantly using our automated system.</p>
            </div>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              📅 Schedule Your Inspection Online
            </a>
          </div>

          <div className="grid grid-2" style={{ gap: '4rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Direct Contact Information</h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.125rem', color: 'var(--color-gray-dark)' }}>
                Prefer to speak with us directly? Reach out by phone, email, or schedule instantly online.
              </p>
              
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-red)' }}>Phone</h3>
                <a href="tel:678-480-2110" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', display: 'block', marginBottom: '0.75rem' }}>
                  📞 678-480-2110
                </a>
                <a href="tel:678-480-2110" className="btn btn-outline" style={{ display: 'inline-block', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                  Tap to Call Now
                </a>
              </div>
              
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-red)' }}>Email</h3>
                <a href="mailto:inspect@foresightcmi.com" style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                  ✉️ inspect@foresightcmi.com
                </a>
              </div>
              
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>Business Hours</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Mon, Tue, Thu, Fri, Sat: 8:00 AM – 8:00 PM</li>
                  <li style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Wednesday: 8:00 AM – 7:00 PM</li>
                  <li style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Sunday: By Appointment Only</li>
                  <li style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)', marginTop: '0.5rem' }}>⚡ 24/7 Online Self-Scheduling Always Available</li>
                </ul>
              </div>

              <div className="card" style={{ background: 'var(--color-dark)', color: 'var(--color-white)', textAlign: 'center', padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Need an Instant Price Quote?</h3>
                <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Calculate exact inspection fees based on square footage, age, and location in seconds.</p>
                <Link href="/quote" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                  ⚡ Calculate Instant Price Quote
                </Link>
              </div>
            </div>

            <div className="card card-premium">
              <h2 style={{ marginBottom: '1.5rem' }}>Send Us a Message</h2>
              {submitStatus === 'success' ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-red-dark)' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>Message Sent!</h3>
                  <p>Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setSubmitStatus(null)} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label" htmlFor="name">Full Name *</label>
                    <input type="text" id="name" name="name" className="form-control" placeholder="e.g. Jane Doe" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" className="form-control" placeholder="(678) 000-0000" />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="email">Email Address *</label>
                      <input type="email" id="email" name="email" className="form-control" placeholder="jane@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="address">Property Address / City (Optional)</label>
                    <input type="text" id="address" name="address" className="form-control" placeholder="e.g. 123 Main St, Atlanta, GA" />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="message">Message / Inspection Questions *</label>
                    <textarea id="message" name="message" className="form-control" rows="4" placeholder="Tell us about the property, square footage, or any specific questions..." required></textarea>
                  </div>
                  {submitStatus === 'error' && (
                    <p style={{ color: 'var(--color-red)', fontWeight: 500 }}>There was an error sending your message. Please try again or call us directly.</p>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Sending...' : '✉️ Send Message'}
                  </button>
                </form>
              )}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                 <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Want an instant AI answer?</p>
                 <Link href="/ask-twin" style={{ color: 'var(--color-red)', fontWeight: 600 }}>Chat with our Certified Master Inspector AI Twin →</Link>
              </div>
            </div>
          </div>

          {/* Google Maps Embed & Location Details — Critical for Local Pack Ranking */}
          <div style={{ marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Our Headquarters & Service Territory</h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
                Based in Lithonia, GA — proudly dispatching dual-inspector teams across 163+ cities in Metro Atlanta every day.
              </p>
            </div>
            
            <div className="card" style={{ padding: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-gray-light)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'stretch' }}>
                <div style={{ flex: '1 1 450px', minHeight: '380px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <iframe
                    src="https://maps.google.com/maps?q=Atlanta,%20GA&t=&z=10&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '380px', width: '100%' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Foresight Home Inspections Service Area"
                  ></iframe>
                </div>

                <div style={{ flex: '1 1 320px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'inline-block', background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.825rem', marginBottom: '1rem' }}>
                      📍 HEADQUARTERS & DISPATCH
                    </div>
                    <h3 style={{ color: 'var(--color-dark)', marginBottom: '0.75rem', fontSize: '1.4rem' }}>Foresight Home Inspections, LLC</h3>
                    <address style={{ fontStyle: 'normal', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--color-gray-dark)' }}>
                      <strong style={{ color: 'var(--color-dark)' }}>Serving Metro Atlanta</strong><br />
                      and surrounding areas<br /><br />
                      <a href="tel:678-480-2110" style={{ fontWeight: 700, color: 'var(--color-red)', fontSize: '1.15rem', display: 'inline-block', marginBottom: '0.25rem' }}>
                        📞 678-480-2110
                      </a><br />
                      <a href="mailto:inspect@foresightcmi.com" style={{ color: 'var(--color-dark)', fontWeight: 500 }}>
                        ✉️ inspect@foresightcmi.com
                      </a>
                    </address>
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', fontSize: '0.925rem', borderLeft: '4px solid var(--color-red)' }}>
                    <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '0.35rem' }}>⏰ Business Hours:</strong>
                    <div style={{ lineHeight: 1.6, color: 'var(--color-gray-dark)' }}>
                      Mon, Tue, Thu, Fri, Sat: <strong>8:00 AM – 8:00 PM</strong><br />
                      Wednesday: <strong>8:00 AM – 7:00 PM</strong><br />
                      Sunday: <strong>By Appointment Only</strong>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-red)', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>
                      ⚡ 24/7 Online Self-Scheduling Always Active
                    </span>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Atlanta+GA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ flex: '1 1 180px', padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.925rem' }}
                    >
                      📍 Open in Google Maps
                    </a>
                    <Link
                      href="/service-areas"
                      className="btn btn-outline"
                      style={{ flex: '1 1 140px', padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.925rem' }}
                    >
                      🏙️ Service Areas
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section for Contact Page */}
          <div style={{ marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            
            <details style={{ marginBottom: '1rem', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                How quickly can I schedule an inspection?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                In most cases, Foresight can schedule your inspection within 24–48 hours of booking. During peak season (spring and summer), we recommend booking 3–5 days in advance. You can schedule instantly through our online booking system or call us directly at 678-480-2110.
              </p>
            </details>

            <details style={{ marginBottom: '1rem', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                What areas does Foresight Home Inspections serve?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                Foresight Home Inspections serves over 163 cities across Metro Atlanta and the state of Georgia, including Atlanta, Sandy Springs, Alpharetta, Johns Creek, Roswell, Marietta, Decatur, Lawrenceville, Duluth, Suwanee, Peachtree City, McDonough, Covington, and many more. View our complete <Link href="/service-areas" style={{ color: 'var(--color-red)', fontWeight: 600 }}>service areas directory</Link>.
              </p>
            </details>

            <details style={{ marginBottom: '1rem', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                How long does a home inspection take?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                With two certified inspectors working simultaneously on every job, a typical Foresight inspection takes approximately 1.5 to 2.5 hours — significantly less than the 3 to 4 hours required by single-inspector companies, while providing more thorough coverage.
              </p>
            </details>

            <details style={{ marginBottom: '1rem', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Can I attend the inspection?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                Absolutely. We encourage all clients to attend the inspection. Our inspectors will walk you through key findings in real-time, explain what to look for, and answer any questions you have about the property. It is the best way to understand the condition of your potential home.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
