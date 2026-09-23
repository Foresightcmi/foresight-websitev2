'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const AskForesightWidget = dynamic(
  () => import('./AskForesightWidget'),
  { ssr: false }
);

export default function WidgetWrapper() {
  // Floating chat box disabled per executive request
  return null;
}
