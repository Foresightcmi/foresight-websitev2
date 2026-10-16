export const dynamic = 'force-static';

export async function GET() {
  const SITE_URL = 'https://www.fhinspectionsatl.com';

  const videos = [
    {
      loc: `${SITE_URL}/videos/complete-home-systems-diagnostic`,
      title: 'Complete Home Systems Diagnostic Field Demonstration - Foresight Home Inspections',
      description: 'Lead Certified Master Inspector Christopher Boykin demonstrates our two-inspector diagnostic protocol across Metro Atlanta home systems, covering HVAC, 200A electrical service panels, structural crawlspaces, and infrared thermal imaging.',
      thumbnail: `${SITE_URL}/images/home-systems-poster.webp`,
      content: `${SITE_URL}/videos/foresight-home-systems.mp4`,
      player: `${SITE_URL}/videos/complete-home-systems-diagnostic`,
      duration: 79,
      date: '2026-09-13T22:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/new-construction-inspections`,
      title: 'New Construction Inspection in Metro Atlanta - Foresight Video Briefing',
      description: 'Independent third-party quality control collaborating with site superintendents across Phase 1 pre-drywall framing (from $275) and Phase 2 final move-in inspections (from $400) in Metro Atlanta.',
      thumbnail: `${SITE_URL}/images/services/new-construction-poster.webp`,
      content: `${SITE_URL}/videos/services/new-construction.mp4`,
      player: `${SITE_URL}/videos/new-construction-inspections`,
      duration: 30,
      date: '2026-10-11T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/11-month-warranty-inspection`,
      title: '11-Month Builder Warranty Inspection in Metro Atlanta - Foresight Video Briefing',
      description: 'Protect your new construction investment before your 1-year builder warranty expires (starting at $335). Itemized builder punch list identifying structural settlement, truss uplift, and duct leakage.',
      thumbnail: `${SITE_URL}/images/services/11-month-warranty-poster.webp`,
      content: `${SITE_URL}/videos/services/11-month-warranty.mp4`,
      player: `${SITE_URL}/videos/11-month-warranty-inspection`,
      duration: 40,
      date: '2026-10-12T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/pool-and-spa-inspections`,
      title: 'Swimming Pool & Spa Inspection in Metro Atlanta - Foresight Video Briefing',
      description: 'Comprehensive mechanical, plumbing, and electrical life-safety evaluation of swimming pools and spas ($300 flat rate). Multi-speed pumps, sand/DE filters, heaters, GFCI bonding, and barriers.',
      thumbnail: `${SITE_URL}/images/services/pool-and-spa-poster.webp`,
      content: `${SITE_URL}/videos/services/pool-and-spa.mp4`,
      player: `${SITE_URL}/videos/pool-and-spa-inspections`,
      duration: 40,
      date: '2026-10-11T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/sewer-scope-inspections`,
      title: 'Sewer Scope Lateral Camera Inspection in Metro Atlanta - Foresight Video Briefing',
      description: 'High-definition fiber-optic sewer lateral camera inspection from cleanout to city main ($450 flat rate). Detect root intrusions, low-pitch bellies, and cracked lines before closing.',
      thumbnail: `${SITE_URL}/images/services/sewer-scope-poster.webp`,
      content: `${SITE_URL}/videos/services/sewer-scope.mp4`,
      player: `${SITE_URL}/videos/sewer-scope-inspections`,
      duration: 36,
      date: '2026-10-11T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/termite-and-wdo-inspections`,
      title: 'Official Georgia Termite & WDO Inspection in Atlanta - Foresight Video Briefing',
      description: 'Official Georgia Wood Infestation Inspection Report for real estate closing and mortgage underwriting ($125 slab/basement; $165 crawlspace). Subterranean termites, wood-decay fungus, and beetles.',
      thumbnail: `${SITE_URL}/images/services/termite-inspection-poster.webp`,
      content: `${SITE_URL}/videos/services/termite-inspection.mp4`,
      player: `${SITE_URL}/videos/termite-and-wdo-inspections`,
      duration: 35,
      date: '2026-10-11T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/radon-gas-testing`,
      title: 'Continuous 48-Hour Electronic Radon Testing in Atlanta GA - Foresight Video Briefing',
      description: 'EPA-certified 48-hour continuous electronic active radon monitor placement for Georgia granite bedrock ($275 flat rate). Hourly pCi/L graph and official mitigation report.',
      thumbnail: `${SITE_URL}/images/services/radon-testing-poster.webp`,
      content: `${SITE_URL}/videos/services/radon-testing.mp4`,
      player: `${SITE_URL}/videos/radon-gas-testing`,
      duration: 30,
      date: '2026-10-11T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/mold-indoor-air-quality-testing`,
      title: 'Certified Spore Trap Mold & Indoor Air Quality Testing in Atlanta - Foresight Video Briefing',
      description: 'Calibrated spore trap air sampling and surface tape lifts analyzed by an accredited microbiology laboratory ($450 flat rate). Certified spore counts and toxigenic fungal identification.',
      thumbnail: `${SITE_URL}/images/services/mold-testing-poster.webp`,
      content: `${SITE_URL}/videos/services/mold-testing.mp4`,
      player: `${SITE_URL}/videos/mold-indoor-air-quality-testing`,
      duration: 39,
      date: '2026-10-12T00:00:00Z',
    },
    {
      loc: `${SITE_URL}/videos/short-term-rental-str-compliance-inspection`,
      title: 'Airbnb & STR Safety Compliance Inspection in Metro Atlanta - Foresight Video Briefing',
      description: 'Life-safety, mechanical load capacity, and municipal code compliance inspections for Metro Atlanta Airbnb and VRBO properties (starts at $395). Egress, smoke/CO alarms, and electrical panels.',
      thumbnail: `${SITE_URL}/images/services/short-term-rental-poster.webp`,
      content: `${SITE_URL}/videos/services/short-term-rental.mp4`,
      player: `${SITE_URL}/videos/short-term-rental-str-compliance-inspection`,
      duration: 31,
      date: '2026-10-12T00:00:00Z',
    }
  ];

  const escapeXml = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos.map(v => `  <url>
    <loc>${v.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${v.thumbnail}</video:thumbnail_loc>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description)}</video:description>
      <video:content_loc>${v.content}</video:content_loc>
      <video:player_loc>${v.player}</video:player_loc>
      <video:duration>${v.duration}</video:duration>
      <video:publication_date>${v.date}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="${SITE_URL}/about">Christopher Boykin</video:uploader>
    </video:video>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}
