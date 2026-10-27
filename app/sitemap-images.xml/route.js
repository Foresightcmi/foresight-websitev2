import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  const SITE_URL = 'https://www.fhinspectionsatl.com';
  const entries = [
    {
      loc: `${SITE_URL}`,
      images: [
        `${SITE_URL}/images/luxury-home.webp`,
        `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.webp`,
        `${SITE_URL}/images/cmi_logo.webp`,
        `${SITE_URL}/images/cpi_logo.webp`,
      ],
    },
    {
      loc: `${SITE_URL}/about`,
      images: [
        `${SITE_URL}/images/Christopher_Boykin.webp`,
        `${SITE_URL}/images/cmi_logo.webp`,
      ],
    },
    {
      loc: `${SITE_URL}/services/sewer-scope-inspection`,
      images: [
        `${SITE_URL}/images/sewer-scope.webp`,
        `${SITE_URL}/images/sewer-scope-2.webp`,
      ],
    },
    {
      loc: `${SITE_URL}/services/pool-inspection`,
      images: [`${SITE_URL}/images/pool-inspecting.webp`],
    },
    {
      loc: `${SITE_URL}/services/new-construction-inspection`,
      images: [
        `${SITE_URL}/images/drone-2.webp`,
        `${SITE_URL}/images/internachi_new_construction_inspector.webp`,
      ],
    },
    {
      loc: `${SITE_URL}/services/11-month-warranty-inspection`,
      images: [`${SITE_URL}/images/11-month-warranty-logo.webp`],
    },
    {
      loc: `${SITE_URL}/compare/thermal-imaging-vs-standard-visual-inspection`,
      images: [
        `${SITE_URL}/images/thermal-ceiling.webp`,
        `${SITE_URL}/images/visual-ceiling.webp`,
        `${SITE_URL}/images/thermal-1.webp`,
      ],
    },
  ];

  const defectsPath = path.join(process.cwd(), 'data', 'defects-pseo.json');
  if (fs.existsSync(defectsPath)) {
    const defects = JSON.parse(fs.readFileSync(defectsPath, 'utf8'));
    for (const d of defects) {
      if (d.image) {
        entries.push({
          loc: `${SITE_URL}/defects/${d.slug}`,
          images: [`${SITE_URL}${d.image}`],
        });
      }
    }
  }

  const xmlItems = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n${e.images
          .map((img) => `    <image:image>\n      <image:loc>${img}</image:loc>\n    </image:image>`)
          .join('\n')}\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${xmlItems}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
