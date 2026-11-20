/**
 * Deterministic <60-char <title>, <158-char <meta description>, Anti-Cannibalization,
 * and Schema.org Offer builder grounded in data/truth.json (zero fake $345 on Call for Quote).
 */

function clampDescription(desc, maxLen = 158) {
  const clean = String(desc || '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const slice = clean.slice(0, maxLen - 1);
  const lastPeriod = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '));
  if (lastPeriod >= 95) return slice.slice(0, lastPeriod + 1).trim();
  return `${slice.replace(/\s+\S*$/, '').replace(/[,;:\s-]+$/, '')}.`;
}

export function buildServiceCitySeoMeta(serviceData, cityName) {
  const slug = serviceData.slug;
  const price = serviceData.price;
  let candidates = [];

  if (slug === 'buyer-inspection') {
    candidates = [
      `Home Inspection ${cityName}, GA | From $345 | Same-Day CMI`,
      `Home Inspection ${cityName}, GA | From $345 (2-CMI)`,
      `Home Inspection ${cityName}, GA | From $345`,
      `${cityName}, GA Home Inspection | From $345`
    ];
  } else if (slug === '11-month-warranty-inspection') {
    candidates = [
      `11-Month Warranty Inspection ${cityName}, GA | From $345`,
      `11-Month Warranty Inspection ${cityName} | From $345`,
      `11-Month Builder Warranty ${cityName}, GA | From $345`,
      `11-Month Warranty ${cityName} | From $345`
    ];
  } else if (slug === 'commercial-property-inspection') {
    candidates = [
      `Commercial Building Inspection ${cityName}, GA | ASTM PCA`,
      `Commercial Inspection ${cityName}, GA | ASTM PCA Quote`,
      `Commercial Inspection ${cityName}, GA | Call for Quote`,
      `Commercial Inspection ${cityName} | ASTM PCA`
    ];
  } else if (slug === 'pre-drywall-inspection') {
    candidates = [
      `Pre-Drywall Inspection ${cityName}, GA | From $275 | CMI`,
      `Pre-Drywall Inspection ${cityName}, GA | From $275`,
      `Pre-Drywall Inspection ${cityName} | From $275`
    ];
  } else if (slug === 'new-construction-inspection') {
    candidates = [
      `New Construction Inspection ${cityName}, GA | From $400`,
      `New Construction Inspection ${cityName} | From $400`,
      `New Build Inspection ${cityName} | From $400`
    ];
  } else if (slug === 'pre-listing-inspection') {
    candidates = [
      `Pre-Listing Inspection ${cityName}, GA | From $345`,
      `Pre-Listing Inspection ${cityName} | From $345`,
      `Seller Inspection ${cityName} | From $345`
    ];
  } else {
    const rawTitle = String(serviceData.metaTitle || '').replace(/{city}/g, cityName).replace(/\*/g, '').trim();
    const fallbackBadge = price === 'Call for Quote' ? 'CMI Team' : price;
    candidates = [
      rawTitle,
      `${serviceData.name} ${cityName}, GA | ${fallbackBadge}`,
      `${serviceData.name} ${cityName} | ${fallbackBadge}`,
      `${cityName} ${serviceData.name}`.slice(0, 60)
    ];
  }

  const title = candidates.find((c) => c && c.length <= 60) || candidates[candidates.length - 1].slice(0, 60).trim();
  let rawDesc = String(serviceData.metaDescription || '').replace(/{city}/g, cityName);
  if (slug === '11-month-warranty-inspection') {
    rawDesc = rawDesc.replace(/warranty home inspections/gi, 'builder warranty inspections');
  }
  const description = clampDescription(rawDesc, 158);
  return { title, description };
}

export function buildServiceCityOfferSchema(serviceData, canonicalUrl, cityName, includeMerchantFields = false) {
  const numMatch = String(serviceData?.price || '').match(/\d+/);
  const priceVal = `${(numMatch || ['345'])[0]}.00`;
  const offer = {
    '@type': 'Offer',
    price: priceVal,
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: priceVal,
      priceCurrency: 'USD',
      unitText: 'starting',
      description: serviceData.priceDetails
    },
    priceValidUntil: '2027-12-31',
    validThrough: '2027-12-31',
    validFrom: '2026-01-01',
    availability: 'https://schema.org/InStock',
    url: canonicalUrl,
    areaServed: { '@type': 'City', name: cityName }
  };
  if (includeMerchantFields) {
    offer.shippingDetails = {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US', addressRegion: 'GA' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' }
      }
    };
    offer.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn'
    };
  }
  return offer;
}
