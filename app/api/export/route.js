import { NextResponse } from 'next/server';
import { computeConcession } from '../../../lib/repairEngine';

export async function POST(req) {
  try {
    const { format = 'csv', propertyInfo = {}, defects = [], strategy = 'balanced' } = await req.json();

    if (!Array.isArray(defects) || defects.length === 0) {
      return NextResponse.json({ error: 'No defects to export' }, { status: 400 });
    }

    const calc = computeConcession(defects, strategy, propertyInfo);
    const dateStr = new Date().toISOString().split('T')[0];
    const safeAddress = (propertyInfo.address || 'Inspection').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);

    if (format === 'csv') {
      const rows = [
        ['Item #', 'Category', 'Severity', 'Finding Title', 'Trade Specialist', 'Code Reference', 'Labor Hours', 'Labor Rate ($/hr)', 'Materials ($)', 'Permit ($)', 'Low ($)', 'Median ($)', 'High ($)', 'Included in Ask'],
      ];

      defects.forEach((d, idx) => {
        rows.push([
          String(idx + 1),
          `"${(d.category || '').replace(/"/g, '""')}"`,
          `"${(d.severity || '').replace(/"/g, '""')}"`,
          `"${(d.title || '').replace(/"/g, '""')}"`,
          `"${(d.tradeType || '').replace(/"/g, '""')}"`,
          `"${(d.codeRef || '').replace(/"/g, '""')}"`,
          String(d.laborHours || 0),
          String(d.laborRate || 0),
          String(d.materialCost || 0),
          String(d.permitCost || 0),
          String(d.costLow || 0),
          String(d.costMedian || 0),
          String(d.costHigh || 0),
          d.included !== false ? 'YES' : 'NO',
        ]);
      });

      rows.push([]);
      rows.push(['TOTALS (Active Items)', '', '', '', '', '', '', '', '', '', String(calc.totalLow), String(calc.totalMedian), String(calc.totalHigh), '']);

      const csvContent = rows.map((r) => r.join(',')).join('\r\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Foresight_Repair_Worksheet_${safeAddress}_${dateStr}.csv"`,
        },
      });
    }

    if (format === 'txt') {
      const fmt = (n) => `$${Math.round(n).toLocaleString()}`;
      const lines = [
        '================================================================================',
        'FORESIGHT HOME INSPECTIONS — DUE DILIGENCE REPAIR COST WORKSHEET & EXHIBIT',
        'Prepared by: Foresight Home Inspections, LLC | Certified Master Inspector (CMI®)',
        'Direct: (678) 480-2110 | Web: https://www.fhinspectionsatl.com',
        '================================================================================',
        '',
        `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        `Property Address: ${propertyInfo.address || 'N/A'}`,
        `Buyer(s): ${propertyInfo.buyerName || 'N/A'}`,
        `Seller(s): ${propertyInfo.sellerName || 'N/A'}`,
        `Purchase Price: ${fmt(propertyInfo.purchasePrice || 0)}`,
        `Loan Program: ${(propertyInfo.loanType || 'conventional').toUpperCase()} (${propertyInfo.downPaymentPercent || 10}% Down)`,
        '',
        '--------------------------------------------------------------------------------',
        'ITEMIZED DEFECT & TRADE REPAIR COST SCHEDULE',
        '--------------------------------------------------------------------------------',
      ];

      defects.filter((d) => d.included !== false).forEach((d, idx) => {
        lines.push(
          `${idx + 1}. [${d.category.toUpperCase()}] ${d.title}`,
          `   Severity: ${d.severity} | Trade: ${d.tradeType}`,
          `   Code Reference: ${d.codeRef}`,
          `   Cost Breakdown: ${d.laborHours} hrs @ $${d.laborRate}/hr + $${d.materialCost} materials + $${d.permitCost} permit`,
          `   Range: ${fmt(d.costLow)} (Low) | ${fmt(d.costMedian)} (Median) | ${fmt(d.costHigh)} (High)`,
          `   Remediation Basis: ${d.justification}`,
          ''
        );
      });

      lines.push(
        '--------------------------------------------------------------------------------',
        'CONCESSION SUMMARY & LENDER COMPLIANCE',
        '--------------------------------------------------------------------------------',
        `Active Defect Count: ${calc.totalDefectsCount}`,
        `Total Estimated Repair Range: ${fmt(calc.totalLow)} – ${fmt(calc.totalHigh)} (Median: ${fmt(calc.totalMedian)})`,
        `Lender Concession Guideline: ${calc.ruleLabel}`,
        `Max Allowable Seller Closing Credit: ${fmt(calc.maxLenderConcession)}`,
        `Recommended Closing Credit Ask: ${fmt(calc.recommendedCredit)}`,
        calc.excessPriceReduction > 0 ? `Excess Over Lender Cap (Price Reduction): ${fmt(calc.excessPriceReduction)}` : '',
        '',
        '--------------------------------------------------------------------------------',
        'SAMPLE Georgia repair amendment SPECIAL STIPULATION (FOR LICENSED AGENT DRAFTING)',
        '--------------------------------------------------------------------------------',
        calc.garF404Stipulation,
        '',
        '--------------------------------------------------------------------------------',
        'SAMPLE PLAIN-LANGUAGE REQUEST (FOR CLOSING ATTORNEY REVIEW)',
        '--------------------------------------------------------------------------------',
        calc.closingAttorneyDraft,
        '',
        '================================================================================',
        'DISCLAIMER: Foresight Home Inspections, LLC is an independent diagnostic property inspection',
        'firm and not a licensed general contractor, law firm, or real estate brokerage. Repair cost',
        'calculations reflect regional Metro Atlanta construction indices and trade averages for',
        'preliminary negotiation planning. Sample amendment wording must be formally reviewed, prepared,',
        'and submitted by the consumer\'s licensed Georgia Real Estate Broker or closing attorney on',
        'standard contract forms. All defect remediations should be independently quoted by licensed trades.',
        '================================================================================'
      );

      const txtContent = lines.filter((l) => l !== undefined).join('\r\n');

      return new NextResponse(txtContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="Foresight_Negotiation_Dossier_${safeAddress}_${dateStr}.txt"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to generate export file' }, { status: 500 });
  }
}
