import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const city = request.headers.get('x-vercel-ip-city') || 'Atlanta';
  const region = request.headers.get('x-vercel-ip-country-region') || 'GA';
  const country = request.headers.get('x-vercel-ip-country') || 'US';

  return NextResponse.json({
    city,
    region,
    country,
    success: true,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
