'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const AskForesightWidget = dynamic(
  () => import('./AskForesightWidget'),
  { ssr: false }
);

export default function WidgetWrapper() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // If user explicitly triggers the live concierge consultation, load immediately
    const handleImmediateOpen = () => setShouldLoad(true);
    window.addEventListener('open_foresight_live_consultation', handleImmediateOpen, { once: true });

    // Otherwise, defer loading until after initial paint / first interaction
    const trigger = () => setShouldLoad(true);

    const interactionEvents = ['scroll', 'touchstart', 'mousemove', 'click'];
    const handleFirstInteraction = () => {
      trigger();
      interactionEvents.forEach(e => window.removeEventListener(e, handleFirstInteraction));
    };

    interactionEvents.forEach(e => window.addEventListener(e, handleFirstInteraction, { once: true, passive: true }));

    // Fallback: If no interaction occurs, load smoothly when idle after 3.5s
    let idleId;
    let timerId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        timerId = setTimeout(trigger, 3000);
      });
    } else {
      timerId = setTimeout(trigger, 4000);
    }

    return () => {
      window.removeEventListener('open_foresight_live_consultation', handleImmediateOpen);
      interactionEvents.forEach(e => window.removeEventListener(e, handleFirstInteraction));
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return null;
  }

  if (!shouldLoad) {
    return null;
  }

  return <AskForesightWidget />;
}
