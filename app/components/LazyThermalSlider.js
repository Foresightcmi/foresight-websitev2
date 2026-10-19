'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ThermalSlider = dynamic(() => import('./ThermalSlider'), {
  ssr: false,
});

export default function LazyThermalSlider() {
  const [shouldRender, setShouldRender] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (shouldRender) return;

    const trigger = () => setShouldRender(true);
    const events = ['scroll', 'touchstart', 'mousemove', 'keydown'];
    const onInteract = () => {
      trigger();
      events.forEach((ev) => window.removeEventListener(ev, onInteract));
    };
    events.forEach((ev) => window.addEventListener(ev, onInteract, { once: true, passive: true }));

    let observer;
    if ('IntersectionObserver' in window && placeholderRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            trigger();
            observer.disconnect();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(placeholderRef.current);
    }

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onInteract));
      if (observer) observer.disconnect();
    };
  }, [shouldRender]);

  return (
    <section className="section" ref={placeholderRef} style={{ padding: '2rem 1rem', minHeight: '420px' }}>
      {shouldRender ? (
        <ThermalSlider />
      ) : (
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            minHeight: '380px',
            background: '#0F172A',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #334155',
            padding: '1.75rem',
          }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}
