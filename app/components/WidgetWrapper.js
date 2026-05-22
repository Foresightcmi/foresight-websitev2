'use client';
import dynamic from 'next/dynamic';

const AskForesightWidget = dynamic(
  () => import('./AskForesightWidget'),
  { ssr: false }
);

export default function WidgetWrapper() {
  return <AskForesightWidget />;
}
