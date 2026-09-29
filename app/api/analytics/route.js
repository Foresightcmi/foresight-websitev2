import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET() {
  try {
    const ga4Path = path.join(process.cwd(), 'data', 'analytics', 'snapshot-live.json');
    const gscPath = path.join(process.cwd(), 'data', 'analytics', 'gsc-snapshot-latest.json');
    const leadsPath = path.join(process.cwd(), 'data', 'leads.json');

    const ga4 = fs.existsSync(ga4Path) ? JSON.parse(fs.readFileSync(ga4Path, 'utf8')) : null;
    const gsc = fs.existsSync(gscPath) ? JSON.parse(fs.readFileSync(gscPath, 'utf8')) : null;
    const leads = fs.existsSync(leadsPath) ? JSON.parse(fs.readFileSync(leadsPath, 'utf8')) : [];

    return NextResponse.json({
      success: true,
      ga4,
      gsc,
      leads,
      refreshedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const cwd = process.cwd();
    // Run GA4 and GSC telemetry sync scripts in parallel or sequence
    const cmd = 'node scripts/fetch-ga4-analytics.mjs && node scripts/fetch-gsc-analytics.mjs';
    const { stdout, stderr } = await execPromise(cmd, { cwd });

    const ga4Path = path.join(cwd, 'data', 'analytics', 'snapshot-live.json');
    const gscPath = path.join(cwd, 'data', 'analytics', 'gsc-snapshot-latest.json');
    const leadsPath = path.join(cwd, 'data', 'leads.json');

    const ga4 = fs.existsSync(ga4Path) ? JSON.parse(fs.readFileSync(ga4Path, 'utf8')) : null;
    const gsc = fs.existsSync(gscPath) ? JSON.parse(fs.readFileSync(gscPath, 'utf8')) : null;
    const leads = fs.existsSync(leadsPath) ? JSON.parse(fs.readFileSync(leadsPath, 'utf8')) : [];

    return NextResponse.json({
      success: true,
      output: stdout,
      ga4,
      gsc,
      leads,
      refreshedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics sync execution error:', error);
    // Even if execution had an issue, fallback to returning current cached files
    try {
      const cwd = process.cwd();
      const ga4Path = path.join(cwd, 'data', 'analytics', 'snapshot-live.json');
      const gscPath = path.join(cwd, 'data', 'analytics', 'gsc-snapshot-latest.json');
      const leadsPath = path.join(cwd, 'data', 'leads.json');
      const ga4 = fs.existsSync(ga4Path) ? JSON.parse(fs.readFileSync(ga4Path, 'utf8')) : null;
      const gsc = fs.existsSync(gscPath) ? JSON.parse(fs.readFileSync(gscPath, 'utf8')) : null;
      const leads = fs.existsSync(leadsPath) ? JSON.parse(fs.readFileSync(leadsPath, 'utf8')) : [];
      return NextResponse.json({
        success: false,
        error: error.message,
        ga4,
        gsc,
        leads,
        fallback: true
      });
    } catch (e) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}
