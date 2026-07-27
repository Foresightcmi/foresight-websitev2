'use client';
import QuoteClient from '../quote/QuoteClient';

export default function InstantQuoteWidget() {
  return <QuoteClient showValueComparison={false} />;
}
