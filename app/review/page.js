import ReviewClient from './ReviewClient';

export const metadata = {
  title: 'Leave a Review | Foresight Home Inspections Atlanta',
  description: 'Share your home inspection experience with Foresight Home Inspections. Your feedback helps Metro Atlanta homebuyers find a trusted, thorough inspection team.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/review',
  },
  openGraph: {
    title: 'Leave a Review | Foresight Home Inspections Atlanta',
    description: 'Share your home inspection experience with Foresight Home Inspections in Metro Atlanta.',
    url: 'https://www.fhinspectionsatl.com/review',
  },
};

export default function ReviewPage() {
  return <ReviewClient />;
}
