'use client';

import { useEffect } from 'react';

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;
  
  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  
  // Push to dataLayer
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  // Call gtag if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export default function AnalyticsTracker() {
  useEffect(() => {
    // Expose trackEvent globally on window for lightweight client access
    window.trackEvent = trackEvent;

    const handleGlobalClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';

      // 1. Click to Call tracking
      if (href.startsWith('tel:')) {
        trackEvent('click_to_call', {
          event_category: 'engagement',
          event_label: href.replace('tel:', ''),
          phone_number: '678-480-2110',
          page_path: window.location.pathname,
        });
      }

      // 2. HomeGauge Schedule Clicks
      if (href.includes('schedulenow.homegauge.com') || href.includes('homegauge.com/schedule') || href.includes('homegauge.com/inspector')) {
        trackEvent('schedule_click', {
          event_category: 'conversion',
          event_label: href,
          target_url: href,
          page_path: window.location.pathname,
        });
      }

      // 3. Google Review Clicks
      if (href.includes('search.google.com/local/writereview') || href.includes('maps.google.com/?cid=10862078652033010531')) {
        trackEvent('google_review_click', {
          event_category: 'social_proof',
          platform: 'google',
          page_path: window.location.pathname,
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
}
