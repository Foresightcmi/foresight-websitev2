import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const pythonScript = path.join(ROOT_DIR, 'scripts', 'parse_gsc_xlsx.py');

console.log('🚀 Executing Google Search Console 3-Month Official Ingestion Engine...');
try {
  const output = execSync(`python "${pythonScript}"`, { cwd: ROOT_DIR, encoding: 'utf-8' });
  console.log(output);
  console.log('✅ GSC 3-Month Export successfully ingested into data/analytics/gsc-3month-official-export.json');
} catch (err) {
  console.error('❌ Error executing GSC ingestion:', err.message);
  process.exit(1);
}
