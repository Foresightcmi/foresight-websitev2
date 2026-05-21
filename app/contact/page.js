'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
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
          <div style={{
            display: 'inline-block',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.6rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '1rem',
            letterSpacing: '0.03em',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.15)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}>
            🎯 &quot;Because hindsight is expensive... Choose Foresight!&quot;
          </div>
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
                Prefer to speak with us directly? You can reach us by phone or email during our business hours.
              </p>
              
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>Phone</h3>
                <a href="tel:678-480-2110" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                  678-480-2110
                </a>
              </div>
              
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>Email</h3>
                <a href="mailto:plsinspectnow@gmail.com" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                  plsinspectnow@gmail.com
                </a>
              </div>
              
              <div className="card">
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>Business Hours</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Monday – Saturday: 8:00 AM – 8:00 PM</li>
                  <li style={{ color: 'var(--color-gray)' }}>(Thursday until 7:00 PM)</li>
                </ul>
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
                    <label className="form-label" htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" className="form-control" required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" className="form-control" />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" className="form-control" required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea id="message" name="message" className="form-control" rows="5" required></textarea>
                  </div>
                  {submitStatus === 'error' && (
                    <p style={{ color: 'var(--color-red)', fontWeight: 500 }}>There was an error sending your message. Please try again or call us directly.</p>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                 <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Want an instant answer?</p>
                 <Link href="/ask-twin" style={{ color: 'var(--color-red)', fontWeight: 600 }}>Chat with our Digital Twin →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
