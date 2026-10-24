import { NextResponse } from 'next/server';
import {
  parseInspectionText,
  extractTextFromPdfBuffer,
  getRegionalMultiplier,
  computeConcession
} from '../../../lib/repairEngine';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let rawText = '';
    let purchasePrice = 450000;
    let zipCode = '30005';
    let loanType = 'conventional';
    let downPaymentPercent = 10;
    let strategy = 'balanced';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      const textParam = formData.get('rawText');

      purchasePrice = Number(formData.get('purchasePrice')) || purchasePrice;
      zipCode = String(formData.get('zipCode') || zipCode);
      loanType = String(formData.get('loanType') || loanType);
      downPaymentPercent = Number(formData.get('downPaymentPercent')) || downPaymentPercent;
      strategy = String(formData.get('strategy') || strategy);

      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        if (file.size && file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'File exceeds 10 MB maximum upload limit.' }, { status: 413 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = (file.name || '').toLowerCase();

        if (fileName.endsWith('.pdf')) {
          rawText = extractTextFromPdfBuffer(buffer);
          if (!rawText || rawText.length < 20) {
            return NextResponse.json(
              {
                error: 'Could not extract readable text from this PDF. It may be a scanned image-only document. Please paste the finding summaries or upload a text-accessible PDF.',
                code: 'UNREADABLE_PDF',
              },
              { status: 422 }
            );
          }
        } else {
          rawText = buffer.toString('utf-8');
        }
      } else if (typeof textParam === 'string') {
        rawText = textParam;
      }
    } else {
      const body = await req.json();
      rawText = body.rawText || '';
      purchasePrice = Number(body.purchasePrice) || purchasePrice;
      zipCode = String(body.zipCode || zipCode);
      loanType = String(body.loanType || loanType);
      downPaymentPercent = Number(body.downPaymentPercent) || downPaymentPercent;
      strategy = String(body.strategy || strategy);
    }

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { error: 'No inspection findings provided. Paste your findings or upload a file.', code: 'EMPTY_INPUT' },
        { status: 400 }
      );
    }

    rawText = String(rawText).slice(0, 250000);
    const defects = parseInspectionText(rawText, zipCode);
    const regional = getRegionalMultiplier(zipCode);

    if (defects.length === 0) {
      return NextResponse.json(
        {
          error: 'No actionable defects or hazards found in the provided text. Findings may reflect satisfactory conditions or routine maintenance.',
          code: 'NO_DEFECTS_FOUND',
          pricingIndex: regional,
          defects: [],
        },
        { status: 422 }
      );
    }

    const calc = computeConcession(defects, strategy, {
      purchasePrice,
      loanType,
      downPaymentPercent,
    });

    return NextResponse.json({
      success: true,
      defectsCount: defects.length,
      pricingIndex: regional,
      defects,
      calculations: calc,
    });
  } catch (error) {
    console.error('Inspection analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process inspection report' },
      { status: 500 }
    );
  }
}
