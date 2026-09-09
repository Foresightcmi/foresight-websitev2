import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const rawCity = request.headers.get('x-vercel-ip-city');
  const rawRegion = request.headers.get('x-vercel-ip-country-region');
  const rawCountry = request.headers.get('x-vercel-ip-country');

  let city = 'Atlanta';
  let region = 'GA';
  let country = 'US';

  if (rawCity !== null) {
    try {
      city = decodeURIComponent(rawCity).trim();
    } catch {
      city = rawCity.replace(/%20/g, ' ').trim();
    }
  }

  if (rawRegion !== null) {
    region = rawRegion.toUpperCase().trim();
  }

  if (rawCountry !== null) {
    country = rawCountry.toUpperCase().trim();
  }

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
