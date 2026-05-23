'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const AskForesightWidget = dynamic(
  () => import('./AskForesightWidget'),
  { ssr: false }
);

export default function WidgetWrapper() {
  const pathname = usePathname();
  
  // Exclude the floating widget on the full chatbot portal page as it is redundant
  if (pathname === '/ask-twin') {
    return null;
  }
  
  return <AskForesightWidget />;
}
