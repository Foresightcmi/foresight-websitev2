'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const BackgroundAudioPlayer = dynamic(
  () => import('./BackgroundAudioPlayer'),
  { ssr: false }
);

export default function WidgetWrapper() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldLoadWidgets, setShouldLoadWidgets] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const trigger = () => setShouldLoadWidgets(true);

    const interactionEvents = ['scroll', 'touchstart', 'mousemove', 'click'];
    const handleFirstInteraction = () => {
      trigger();
      interactionEvents.forEach(e => window.removeEventListener(e, handleFirstInteraction));
    };

    interactionEvents.forEach(e => window.addEventListener(e, handleFirstInteraction, { once: true, passive: true }));

    let idleId;
    let timerId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        timerId = setTimeout(trigger, 8500);
      });
    } else {
      timerId = setTimeout(trigger, 9500);
    }

    return () => {
      interactionEvents.forEach(e => window.removeEventListener(e, handleFirstInteraction));
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return null;
  }

  if (!isMounted || !shouldLoadWidgets) {
    return null;
  }

  return (
    <>
      <BackgroundAudioPlayer />
    </>
  );
}
