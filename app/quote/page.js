import QuoteClient from './QuoteClient';

export const metadata = {
  title: 'Home Inspection Quote | Atlanta Pricing Calculator',
  description: 'Get an instant, transparent home inspection quote from Foresight Home Inspections. Pricing based on square footage — includes two certified inspectors and $10,000 warranty. Serving Metro Atlanta.',
  alternates: { canonical: 'https://www.fhinspectionsatl.com/quote' },
  openGraph: {
    title: 'Instant Home Inspection Quote | Foresight Home Inspections',
    description: 'Transparent pricing. Two inspectors on every job. Get your instant quote based on property size.',
    url: 'https://www.fhinspectionsatl.com/quote',
  },
};

export default function QuotePage() {
  return <QuoteClient />;
}
