'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const AskForesightWidget = dynamic(
  () => import('./AskForesightWidget'),
  { ssr: false }
);

export default function WidgetWrapper() {
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return null;
  }
  return <AskForesightWidget />;
}
