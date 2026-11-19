'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labelMap = {
  'services': 'Services',
  'service-areas': 'Service Areas',
  'counties': 'Counties',
  'blog': 'Blog & Guides',
  'about': 'About Us',
  'contact': 'Contact',
  'quote': 'Instant Quote',
  'realtors': 'Realtors VIP',
  'samples': 'Sample Reports',
  'compare': 'Comparison Guides',
  'defects': 'Defect Guides',
  'free-utility-setup': 'Free Utility Setup',
  'review': 'Leave a Review',
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Service',
  'dekalb-county-compliance': 'DeKalb County Compliance',
  'atlanta-str-compliance': 'Atlanta STR Compliance',
  'south-fulton-rental-compliance': 'South Fulton Rental Compliance',
  'municipal-rehab-inspections': 'Municipal Rehab Inspections',
  'radon-testing': 'Radon Testing',
  'sewer-scope-inspection': 'Sewer Scope Inspection',
  'pool-inspection': 'Pool & Spa Inspection',
  'pool-spa-inspection': 'Pool & Spa Inspection',
  'termite-inspection': 'Termite & WDO Inspection',
  'termite-wdo-inspection': 'Termite & WDO Inspection',
  'new-construction-inspection': 'New Construction Inspection',
  'pre-listing-inspection': 'Pre-Listing Inspection',
  'buyer-inspection': 'Buyer Home Inspection',
  'home-buyer-inspection': 'Buyer Home Inspection',
  'commercial-property-inspection': 'Commercial Property Inspection',
  'pre-drywall-inspection': 'Pre-Drywall Inspection',
  '11-month-warranty-inspection': '11-Month Warranty Inspection',
  'mold-testing': 'Mold & Air Quality Testing',
  'str-short-term-rental-inspection': 'STR Inspection',
  'repair-credit-calculator': 'Repair Credit Calculator',
  'homebuyer-red-flags': 'Homebuyer Red Flags',
  'homeowner-care': 'Homeowner Care',
  'due-diligence': 'Due Diligence Guarantee',
  'list-of-3': 'Metro Atlanta Buyer Scorecard',
  'christopher-boykin': 'Christopher Boykin, CMI',
  'risk-scanner': 'Property Risk Scanner'
};

const STANDALONE_SERVICE_AREA_SLUGS = new Set([
  '/service-areas/counties',
  '/service-areas/atlanta-str-compliance',
  '/service-areas/dekalb-county-compliance',
  '/service-areas/south-fulton-rental-compliance',
]);

function hasPageLevelBreadcrumbs(pathname) {
  if (
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/neighborhoods') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/repair-credit-calculator') ||
    pathname.startsWith('/defects/') ||
    pathname.startsWith('/faq/') ||
    pathname.startsWith('/service-areas/counties/')
  ) {
    return true;
  }
  if (pathname.startsWith('/service-areas/') && !STANDALONE_SERVICE_AREA_SLUGS.has(pathname)) {
    return true;
  }
  return false;
}

function formatLabel(slug) {
  if (labelMap[slug]) return labelMap[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumbs({ items }) {
  const pathname = usePathname();

  let breadcrumbItems = items;
  if (!breadcrumbItems) {
    if (!pathname || pathname === '/') return null;
    if (hasPageLevelBreadcrumbs(pathname)) return null;

    const segments = pathname.split('/').filter(Boolean);
    breadcrumbItems = [{ label: 'Home', href: '/' }];

    let currentHref = '';
    segments.forEach((segment) => {
      currentHref += `/${segment}`;
      breadcrumbItems.push({
        label: formatLabel(segment),
        href: currentHref
      });
    });
  }

  if (!breadcrumbItems || breadcrumbItems.length === 0) return null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://www.fhinspectionsatl.com${item.href === '/' ? '' : item.href}`
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
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {index > 0 && <span style={{ color: 'var(--color-gray-mid)' }}>/</span>}
                {isLast ? (
                  <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{item.label}</span>
                ) : (
                  <Link prefetch={false} href={item.href} style={{ color: 'var(--color-red)', textDecoration: 'none' }}>
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
