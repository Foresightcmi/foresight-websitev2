'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  // Split paths and filter empty segments
  const segments = pathname.split('/').filter(Boolean);

  // Capitalize and format path segments for display
  const formatSegment = (segment) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Generate breadcrumb items array
  const breadcrumbItems = segments.map((segment, index) => {
    const url = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const name = formatSegment(segment);
    
    return { name, url, isLast };
  });

  // Include Home as the first item
  const allItems = [{ name: 'Home', url: '/', isLast: false }, ...breadcrumbItems];

  // Build JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://www.fhinspectionsatl.com${item.url}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="breadcrumb" style={{ background: 'var(--color-gray-light)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-gray-mid)', fontSize: '0.875rem' }}>
        <div className="container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', color: 'var(--color-gray-dark)' }}>
          {allItems.map((item, index) => (
            <span key={item.url} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {index > 0 && <span style={{ color: 'var(--color-gray)' }}>/</span>}
              {item.isLast ? (
                <span style={{ color: 'var(--color-dark)', fontWeight: 600 }} aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.url} style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 500 }} className="hover-red-dark">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </div>
      </nav>
    </>
  );
}
