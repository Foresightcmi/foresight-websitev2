import Script from 'next/script';
import RiskScannerClient from './RiskScannerClient';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Georgia Property Risk & Age Diagnostic Scanner | Atlanta Home Inspection',
  description: 'Interactive building science risk calculator for Metro Atlanta homes. Analyze hidden structural, plumbing, electrical, radon, and Georgia red clay crawlspace hazards by year built and county.',
  keywords: [
    'Georgia property risk calculator',
    'Atlanta home inspection risk scanner',
    'polybutylene pipe inspection Atlanta',
    'aluminum wiring home inspection Georgia',
    'FPE stab lok electrical panel hazard',
    'radon zone 1 counties Georgia',
    'Georgia red clay crawlspace moisture',
    'EIFS synthetic stucco inspection Atlanta',
    'home age defect checklist Georgia',
    'Certified Master Inspector property scanner'
  ],
  alternates: { canonical: `${SITE_URL}/risk-scanner` },
  openGraph: {
    title: 'Georgia Property Risk & Age Diagnostic Scanner | Foresight Home Inspections',
    description: 'Instant building science diagnostic audit. Enter year built, foundation, and county to uncover hidden electrical, plumbing, radon, and structural risks before closing.',
    url: `${SITE_URL}/risk-scanner`,
    type: 'website',
  },
};

const scannerFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: `${SITE_URL}/risk-scanner`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What hidden defects are most common in 1978 to 1995 homes in Metro Atlanta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Metro Atlanta subdivisions built between 1978 and 1995 are at extreme risk for polybutylene (Quest PB2110) supply pipes, which micro-fracture from municipal water chlorine and cause catastrophic ceiling and drywall flooding. Homes of this era also frequently contain Federal Pacific Electric (FPE) Stab-Lok or Zinsco electrical breaker panels, which fail to trip under overcurrent in up to 60% of independent tests, presenting a serious fire hazard.'
      },
    },
    {
      '@type': 'Question',
      name: 'Why do North Metro Atlanta homes require continuous electronic radon testing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The EPA designates Fulton, DeKalb, Gwinnett, Cobb, Cherokee, and Forsyth counties as Radon Zone 1, meaning the average indoor screening level exceeds 4.0 pCi/L. North Georgia sits directly atop the Piedmont granite belt, which naturally emits radioactive radon gas into crawlspaces and basements. Foresight deploys 48-hour continuous electronic monitors to measure hourly fluctuations accurately.'
      },
    },
    {
      '@type': 'Question',
      name: 'Why is Georgia red clay soil hazardous to home foundations and crawlspaces?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Georgia red clay has a very high plasticity index, expanding significantly when saturated and contracting during drought cycles. This exerts massive lateral hydrostatic pressure on foundation block walls, resulting in stair-step shear cracks. In unconditioned crawlspaces, red clay continuously evaporates ground moisture, elevating relative humidity above 70% and triggering wood-decay fungal rot on subfloors and floor joists.'
      },
    },
    {
      '@type': 'Question',
      name: 'What are the risks of buying a home with Synthetic Stucco (EIFS) in Georgia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Exterior Insulation and Finish Systems (EIFS) installed in Georgia between 1985 and 2000 are barrier systems that lack internal drainage planes. Over 85% of unsealed EIFS homes allow rainwater behind window headers, pipe penetrations, and roof kickouts. Because EIFS does not breathe, trapped moisture rots structural OSB sheathing and studs invisibly. Foresight utilizes infrared thermal imaging to locate thermal evaporative delta-T anomalies and moisture meters to pinpoint hidden decay.'
      },
    },
    {
      '@type': 'Question',
      name: 'How does Foresight evaluate newly constructed homes built in 2024 to 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Field data indicates that over 82% of structural framing alterations, improperly notched load-bearing headers, detached attic HVAC ducts, and unglued plumbing lines occur during new construction. Because county code officials spend only 10 to 15 minutes per site, Foresight dispatches two Certified Master Inspectors to conduct comprehensive multi-hour pre-drywall framing audits and pre-closing final inspections.'
      },
    },
  ],
};

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Georgia Property Risk & Age Diagnostic Scanner',
  applicationCategory: 'RealEstateApplication',
  operatingSystem: 'All',
  url: `${SITE_URL}/risk-scanner`,
  description: 'Interactive building science risk calculator analyzing historical era building codes, soil geology, radon zones, and defect vulnerabilities across 20 Metro Atlanta counties.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: {
    '@type': 'HomeAndConstructionBusiness',
    name: 'Foresight Home Inspections, LLC',
    telephone: '+1-678-480-2110',
    email: 'inspect@foresightcmi.com',
    url: SITE_URL,
  },
};

export default function RiskScannerPage() {
  return (
    <>
      <Script
        id="risk-scanner-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scannerFaqSchema) }}
      />
      <Script
        id="risk-scanner-app-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <RiskScannerClient />
    </>
  );
}
