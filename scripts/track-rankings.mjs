import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'ranking-history.json');
const DOMAIN = 'fhinspectionsatl.com';

const TARGET_KEYWORDS = [
  'Foresight Home Inspections',
  'Certified Master Inspector Christopher Boykin',
  'best home inspector Atlanta',
  'home inspector near me Atlanta',
  'home inspection Atlanta GA',
  'home inspection cost Atlanta',
  'same day home inspection Atlanta',
  'home inspection Lithonia GA',
  'home inspector Lithonia GA',
  'home inspection Decatur GA',
  'home inspection Sandy Springs GA',
  'home inspection Alpharetta GA',
  'home inspection Marietta GA',
  'sewer scope inspection Atlanta',
  'radon testing Atlanta GA',
  'pool and spa inspection Atlanta',
  'new construction inspection Atlanta',
  '11-month warranty inspection Atlanta'
];

async function checkRanking(query) {
  try {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!res.ok) return { query, rank: null, status: 'error' };

    const html = await res.text();
    let foundRank = null;
    let matchedUrl = null;

    const results = html.split('<div class="result__body');
    for (let i = 1; i < results.length; i++) {
      const block = results[i];
      if (block.includes(DOMAIN)) {
        foundRank = i;
        const hrefMatch = block.match(/href="([^"]*fhinspectionsatl\.com[^"]*)"/);
        matchedUrl = hrefMatch ? hrefMatch[1] : ('https://' + DOMAIN);
        break;
      }
    }

    return {
      query,
      rank: foundRank,
      url: matchedUrl,
      status: foundRank ? 'found' : 'not_in_top_30'
    };
  } catch (err) {
    return { query, rank: null, status: 'network_error' };
  }
}

async function main() {
  console.log('Foresight Rank & SERP Progression Tracker');
  console.log(`Checking target domain: ${DOMAIN} across ${TARGET_KEYWORDS.length} priority queries...\n`);

  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
      history = [];
    }
  }

  const previousSnapshot = history.length > 0 ? history[history.length - 1] : null;
  const currentSnapshot = {
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    results: []
  };

  console.log('| Target Query | Current Rank | Previous Rank | Progression Delta |');
  console.log('| :--- | :---: | :---: | :---: |');

  for (const query of TARGET_KEYWORDS) {
    const result = await checkRanking(query);
    const prevResult = previousSnapshot?.results?.find(r => r.query === query);
    const prevRank = prevResult?.rank || null;

    let delta = '—';
    if (result.rank && prevRank) {
      const diff = prevRank - result.rank;
      if (diff > 0) delta = `▲ +${diff} (Climbing)`;
      else if (diff < 0) delta = `▼ ${diff} (Sliding)`;
      else delta = '= (Steady)';
    } else if (result.rank && !prevRank) {
      delta = '⭐ NEW Entry';
    }

    currentSnapshot.results.push({
      query,
      rank: result.rank,
      url: result.url,
      prevRank,
      delta
    });

    const rankDisplay = result.rank ? `#${result.rank}` : 'Top 30+';
    const prevDisplay = prevRank ? `#${prevRank}` : '—';
    console.log(`| **${query}** | ${rankDisplay} | ${prevDisplay} | ${delta} |`);

    await new Promise(r => setTimeout(r, 1200));
  }

  history.push(currentSnapshot);
  if (history.length > 52) history = history.slice(-52);

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  console.log(`\nSaved snapshot to ${HISTORY_FILE}`);
}

main().catch(err => console.error('Tracker error:', err));
