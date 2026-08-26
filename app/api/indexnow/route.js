import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'foresighthomeinspections2026';
const HOST = 'www.fhinspectionsatl.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const urlList = body.urls || [
      `https://${HOST}`,
      `https://${HOST}/services`,
      `https://${HOST}/about`,
      `https://${HOST}/realtors`,
      `https://${HOST}/ai-fact-sheet`,
      `https://${HOST}/service-areas`,
      `https://${HOST}/blog`
    ];

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: Array.isArray(urlList) ? urlList : [urlList]
    };

    // Ping Bing IndexNow endpoint
    const bingResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    }).catch(err => ({ ok: false, status: 500, error: err.message }));

    return NextResponse.json({
      success: true,
      message: 'IndexNow instant search engine ping submitted successfully',
      urlsSubmitted: payload.urlList.length,
      bingStatus: bingResponse.status || 200,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'IndexNow API Ready',
    host: HOST,
    keyLocation: KEY_LOCATION,
    usage: 'POST { urls: ["https://www.fhinspectionsatl.com/service-areas/sandy-springs"] } to instantly submit URLs to search engines.'
  });
}
