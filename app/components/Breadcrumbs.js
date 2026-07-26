import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://www.fhinspectionsatl.com${item.href}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: '1.25rem', paddingBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-gray-dark)' }}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {index > 0 && <span style={{ color: 'var(--color-gray-mid)' }}>/</span>}
                {isLast ? (
                  <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{item.label}</span>
                ) : (
                  <Link href={item.href} style={{ color: 'var(--color-red)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
