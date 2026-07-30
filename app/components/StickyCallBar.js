'use client';

export default function StickyCallBar() {
  return (
    <div className="sticky-call-bar">
      <a
        href="tel:678-480-2110"
        className="sticky-call-btn sticky-call-btn--call"
        onClick={() => {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'phone_call_click', {
              event_category: 'conversion',
              event_label: 'sticky_mobile_bar',
              value: 1,
            });
          }
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        Call Now
      </a>
      <a
        href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-call-btn sticky-call-btn--schedule"
        onClick={() => {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'schedule_click', {
              event_category: 'conversion',
              event_label: 'sticky_mobile_bar',
              value: 1,
            });
          }
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
        </svg>
        Book 24/7
      </a>
    </div>
  );
}
