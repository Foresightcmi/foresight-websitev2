import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const resolvedParams = await context.params;
  const rawSlug = resolvedParams?.slug || '';
  const baseName = path.basename(decodeURIComponent(rawSlug)).trim();
  const normalizedBase = baseName.replace(/\s+/g, '-');
  const fileName = normalizedBase.endsWith('.html')
    ? normalizedBase
    : `${normalizedBase}.html`;

  // 1. Check local bundled public/dossiers directory first
  const localPath = path.join(process.cwd(), 'public', 'dossiers', fileName);
  if (fs.existsSync(localPath)) {
    const html = fs.readFileSync(localPath, 'utf8');
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  }

  // 2. Fallback: Fetch live from GitHub main branch (instant 0-second availability before Vercel rebuild finishes)
  const rawGithubUrl = `https://raw.githubusercontent.com/Foresightcmi/foresight-websitev2/main/public/dossiers/${encodeURIComponent(fileName)}`;
  try {
    const res = await fetch(rawGithubUrl, { cache: 'no-store' });
    if (res.ok) {
      const html = await res.text();
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
        },
      });
    }
  } catch (_) {
    // Fall through to 404
  }

  return NextResponse.redirect(new URL('/quote', request.url), 302);
}
