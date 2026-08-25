import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter q' }, { status: 400 });
  }

  try {
    const encoded = encodeURIComponent(q);
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encoded}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`Google API responded with status ${res.status}`);
    }

    const data = await res.json();
    const suggestions = Array.isArray(data[1]) ? data[1] : [];

    return NextResponse.json({
      query: q,
      topSuggestions: suggestions.slice(0, 8),
      totalSuggestions: suggestions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      query: q,
      topSuggestions: [
        `${q} atlanta ga`,
        `${q} near me`,
        `best ${q} reviews`,
        `${q} cost atlanta`
      ],
      fallback: true,
      error: error.message
    });
  }
}
