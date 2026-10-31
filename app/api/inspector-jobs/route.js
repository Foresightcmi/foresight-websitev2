import tls from 'node:tls';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SYNC_TOKEN = process.env.FORESIGHT_APK_SYNC_KEY || 'fhi-cmi-sync-2026';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-foresight-sync-key',
  'Cache-Control': 'no-store, no-cache, must-revalidate'
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function unescapeHtml(str) {
  return String(str || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

function decodeQuotedPrintable(raw) {
  return String(raw || '')
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function formatPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d.startsWith('1')) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return String(raw || '').trim();
}

const MONTH_MAP = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

function parseMonthDateToIso(dateStr) {
  const m = String(dateStr || '').trim().match(/^([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s+(202\d)$/i);
  if (m) {
    const mon = MONTH_MAP[m[1].toLowerCase()];
    const day = String(parseInt(m[2], 10)).padStart(2, '0');
    if (mon) return `${m[3]}-${mon}-${day}`;
  }
  return undefined;
}

function getEasternTodayIso() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

function normalizeAddressKey(addr) {
  return String(addr || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseHgNotifierEmail(rawEmail) {
  const decoded = decodeQuotedPrintable(rawEmail);
  const withoutStyle = decoded.replace(/<style[\s\S]*?<\/style>/gi, '');
  const lines = withoutStyle
    .replace(/<[^>]+>/g, '\n')
    .split(/\r?\n/)
    .map(l => unescapeHtml(l))
    .filter(Boolean);
  const text = lines.join('\n');

  const isCanceled = /Inspection\s*Canceled/i.test(text) || /Home\s*Inspection\s*Canceled!/i.test(text);
  const isScheduledOrChanged =
    isCanceled ||
    /Report\s*ID\s*:/i.test(text) ||
    /Inspection\s*Scheduled|Inspection\s*Changed|Online\s*Appointment\s*Requested/i.test(text);

  if (!isScheduledOrChanged) return null;
  if (/Invoice\s*Created/i.test(text) && !/Customer\(s\)/i.test(text)) return null;

  const reportIdMatch = text.match(/Report\s*ID\s*:\s*([A-Za-z0-9\-_]+)/i);
  const reportId = reportIdMatch ? reportIdMatch[1].trim() : '';

  const dtMatch = text.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+202\d)\s+(?:at\s+)?(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  const inspectionDate = dtMatch ? parseMonthDateToIso(dtMatch[1]) : undefined;
  const inspectionTime = dtMatch ? dtMatch[2].toUpperCase().replace(/\s+/g, ' ').trim() : '10:00 AM';

  const addrLineMatch = text.match(/\b(\d{1,6}\s+[^\r\n]+?),\s*([A-Za-z\s.]+?,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/);
  const propertyAddress = addrLineMatch ? addrLineMatch[1].trim() : '';
  const cityStateZip = addrLineMatch ? addrLineMatch[2].trim() : 'Metro Atlanta, GA';
  if (!propertyAddress) return null;

  const custMatch = text.match(/Customer\(s\)\s*\n\s*(?!Real\s*Estate|Service\b)([^\n]+)/i);
  const clientName = custMatch ? custMatch[1].replace(/\s*\([^)]*\)\s*/g, ' ').trim() : '';

  const agentMatch = text.match(/Real\s*Estate\s*Professional\(s\)\s*\n\s*(?!Service\b)([^\n]+)/i);
  let realtorName = '';
  if (agentMatch) {
    realtorName = agentMatch[1]
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/\s+-\s+/g, ' • ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const emails = Array.from(new Set(text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || []))
    .filter(e => !/homegauge\.com|foresightcmi\.com|fhinspectionsatl\.com|noreply/i.test(e));
  const clientEmail = emails[0] || '';
  const realtorEmail = emails[1] || '';

  const phones = (text.match(/(?:Mobile|Work|Home|Cell|Phone)\s*:\s*([0-9\-().\s]{10,17})/gi) || [])
    .map(m => formatPhone(m.replace(/^[^:]+:\s*/i, '')));
  const clientPhone = phones[0] || '';
  const agentPhone = phones[1] || '';

  const feeMatch =
    text.match(/Inspection\s*Total\s*:\s*\n?\s*\$\s*([\d,]+(?:\.\d{2})?)/i) ||
    text.match(/\$\s*([\d,]+(?:\.\d{2}))/);
  const inspectionFee = feeMatch ? parseFloat(feeMatch[1].replace(/,/g, '')) : undefined;

  const yearMatch = text.match(/Year\s*Built\s*:\s*(\d{4})/i);
  const yearBuilt = yearMatch ? parseInt(yearMatch[1], 10) : undefined;

  const sqftMatch = text.match(/Square\s*Footage\s*:\s*([\d,]+)/i);
  const squareFootage = sqftMatch ? parseInt(sqftMatch[1].replace(/,/g, ''), 10) : undefined;
  const servicesOrdered = ['home_inspection', 'infrared_thermal'];
  if (/11[\s\-]*MONTH\s*WARRANTY/i.test(text)) servicesOrdered.push('builder_warranty_11mo');
  if (/RADON/i.test(text)) servicesOrdered.push('radon_crm');
  if (/MOLD|SPORE|AIR\s*QUALITY/i.test(text)) servicesOrdered.push('mold_air_spore');
  if (/SEWER/i.test(text)) servicesOrdered.push('sewer_scope');
  if (/POOL|SPA/i.test(text)) servicesOrdered.push('pool_spa');

  const foundationType = /CRAWLSPACE/i.test(text) && !/Crawlspace\?\s*:\s*no/i.test(text)
    ? 'Crawlspace'
    : (/UNFINISHED\s*BASEMENT/i.test(text) && !/Unfinished\s*Basement\?\s*:\s*no/i.test(text) ? 'Basement' : 'Slab');

  const rooms = text.match(/Rooms\s*:\s*([^\n]+)/i)?.[1]?.trim() || '';
  const mls = text.match(/MLS\s*#\s*:\s*([^\n]+)/i)?.[1]?.trim() || '';
  const pets = text.match(/Pet\s*Instructions\s*:\s*([^\n]+)/i)?.[1]?.trim() || '';
  const occupied = text.match(/Property\s*Occupied\s*:\s*([^\n]+)/i)?.[1]?.trim() || '';
  const utilities = text.match(/Utilities\s*on\s*:\s*([^\n]+)/i)?.[1]?.trim() || '';

  const noteParts = [
    reportId ? `Report ID: ${reportId}` : '',
    rooms && !/^Privacy/i.test(rooms) ? `Rooms: ${rooms}` : '',
    mls && !/^Property/i.test(mls) ? `MLS #: ${mls}` : '',
    pets && !/^Year/i.test(pets) ? `Pets: ${pets}` : '',
    occupied && !/^Utilities/i.test(occupied) ? `Occupied: ${occupied}` : '',
    utilities && !/^Who/i.test(utilities) ? `Utilities: ${utilities}` : '',
    agentPhone ? `Agent Phone: ${agentPhone}` : ''
  ].filter(Boolean);

  const addrSlug = normalizeAddressKey(propertyAddress);
  return {
    id: `insp_hg_${addrSlug}`,
    addrKey: addrSlug,
    reportId,
    canceled: isCanceled,
    propertyAddress,
    cityStateZip,
    clientName,
    clientEmail,
    clientPhone,
    realtorName,
    realtorEmail,
    inspectionDate: inspectionDate || getEasternTodayIso(),
    inspectionTime,
    yearBuilt,
    squareFootage,
    foundationType,
    inspectionFee,
    dueDiligenceDays: 7,
    dueDiligenceNotes: noteParts.join(' • '),
    servicesOrdered,
    status: 'active'
  };
}

async function fetchRecentHgJobsFromImap(user, pass) {
  return new Promise((resolve) => {
    const socket = tls.connect(993, 'imap.gmail.com', { servername: 'imap.gmail.com', timeout: 11000 });
    let buffer = '';
    let step = 0;

    const finish = (jobs, canceledIds = []) => {
      try {
        socket.write('A99 LOGOUT\r\n');
        socket.end();
      } catch {
        // ignore close error
      }
      resolve({ jobs, canceledIds });
    };

    const timer = setTimeout(() => finish([]), 11000);

    socket.on('error', () => {
      clearTimeout(timer);
      resolve({ jobs: [], canceledIds: [] });
    });

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      if (step === 0 && buffer.includes('* OK')) {
        step = 1;
        buffer = '';
        socket.write(`A1 LOGIN "${user}" "${pass.replace(/\s+/g, '')}"\r\n`);
      } else if (step === 1 && buffer.includes('A1 OK')) {
        step = 2;
        buffer = '';
        socket.write('A2 SELECT INBOX\r\n');
      } else if (step === 2 && buffer.includes('A2 OK')) {
        step = 3;
        buffer = '';
        socket.write('A3 SEARCH FROM "noreply@HomeGauge.com"\r\n');
      } else if (step === 3 && (buffer.includes('A3 OK') || buffer.includes('A3 BAD') || buffer.includes('A3 NO'))) {
        const searchLine = buffer.match(/\*\s+SEARCH\s+([0-9\s]+)/i);
        const ids = searchLine ? searchLine[1].trim().split(/\s+/).filter(Boolean) : [];
        if (ids.length === 0) {
          clearTimeout(timer);
          return finish([]);
        }
        const recentIds = ids.slice(-30).join(',');
        step = 4;
        buffer = '';
        socket.write(`A4 FETCH ${recentIds} (BODY.PEEK[])\r\n`);
      } else if (step === 4 && (buffer.includes('A4 OK') || buffer.includes('A4 BAD') || buffer.includes('A4 NO'))) {
        clearTimeout(timer);
        const rawMessages = buffer.split(/\*\s+\d+\s+FETCH\s+\(/i).slice(1);
        const activeByAddr = new Map();
        const canceledSet = new Set();
        for (const rawMsg of rawMessages) {
          const parsed = parseHgNotifierEmail(rawMsg);
          if (!parsed || !parsed.propertyAddress) continue;
          if (parsed.canceled) {
            activeByAddr.delete(parsed.addrKey);
            canceledSet.add(parsed.id);
          } else {
            canceledSet.delete(parsed.id);
            const prev = activeByAddr.get(parsed.addrKey);
            activeByAddr.set(parsed.addrKey, {
              ...prev,
              ...Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== '' && v !== undefined))
            });
          }
        }
        const sortedJobs = Array.from(activeByAddr.values()).sort((a, b) =>
          (b.inspectionDate || '').localeCompare(a.inspectionDate || '')
        );
        return finish(sortedJobs, Array.from(canceledSet));
      }
    });
  });
}

export async function GET(request) {
  const url = new URL(request.url);
  const key = request.headers.get('x-foresight-sync-key') || url.searchParams.get('key');
  if (key !== SYNC_TOKEN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER || 'inspect@foresightcmi.com';
  const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || '';
  if (!emailPass) {
    return Response.json({ jobs: [], canceledIds: [], status: 'missing_credentials' }, { headers: CORS_HEADERS });
  }

  const { jobs, canceledIds } = await fetchRecentHgJobsFromImap(emailUser, emailPass);
  return Response.json(
    {
      syncedAt: new Date().toISOString(),
      count: jobs.length,
      canceledIds,
      jobs
    },
    { headers: CORS_HEADERS }
  );
}
