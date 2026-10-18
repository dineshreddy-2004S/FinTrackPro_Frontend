import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPercent } from './formatters';

// Clean PDF Rupee formatter: uses 'Rs.' because standard PDF Helvetica lacks
// the Unicode '₹' glyph, which triggers the superscript '¹' artifact.
const formatPdfINR = (val, decimals = 2) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const num = Number(val);
  const isNegative = num < 0;
  const absVal = Math.abs(num);
  const formatted = absVal.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${isNegative ? '-' : ''}Rs. ${formatted}`;
};

// 1. Export Clean Formatted Excel (.xlsx)
export const exportToExcel = (holdings = [], summary = {}, user = {}) => {
  if (!holdings.length) {
    alert('No holdings available to export.');
    return;
  }

  const dataRows = holdings.map((h) => ({
    'Symbol / Ticker': h.ticker,
    'Instrument Name': h.name,
    'Asset Class': h.assetClass,
    'Quantity': h.shares ?? '—',
    'Avg Buy Price (INR)': h.costBasis ? Number(h.costBasis.toFixed(2)) : '—',
    'Current Market Price (INR)': h.currentPrice ? Number(h.currentPrice.toFixed(2)) : '—',
    'Current Value (INR)': Number(h.marketValue.toFixed(2)),
    'Total Investment (INR)': Number(h.totalCost.toFixed(2)),
    'Unrealized P&L (INR)': Number(h.gainLossRupees.toFixed(2)),
    'Total Return (%)': Number(h.gainLossPercent.toFixed(2)),
    'Weight (%)': Number(h.weight.toFixed(2)),
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [],
      ['PORTFOLIO SUMMARY'],
      ['Total Portfolio Value (INR)', Number((summary.totalMarketValue || 0).toFixed(2))],
      ['Total Cost Basis (INR)', Number((summary.totalCostBasis || 0).toFixed(2))],
      ['Total Unrealized P&L (INR)', Number((summary.totalGainLossRupees || 0).toFixed(2))],
      ['Overall Return (%)', Number((summary.totalReturnPercent || 0).toFixed(2))],
      ['Investor Name', user?.name || 'Investor'],
      ['Generated On', new Date().toLocaleString('en-IN')],
    ],
    { origin: -1 }
  );

  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 26 },
    { wch: 16 },
    { wch: 10 },
    { wch: 18 },
    { wch: 24 },
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 16 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Portfolio Statement');
  XLSX.writeFile(workbook, `PortPulse_Statement_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// 2. Export Executive Color PDF Statement (.pdf)
export const exportToColorPDF = (holdings = [], summary = {}, user = {}) => {
  if (!holdings.length) {
    alert('No holdings available to export.');
    return;
  }

  const doc = new jsPDF('landscape', 'pt', 'a4');

  // Background Header Gradient Bar
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, 842, 6, 'F');

  // Title & Metadata
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PortPulse • Investment Statement', 36, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Investor: ${user?.name || 'Individual Portfolio'}   |   Email: ${user?.email || 'N/A'}`, 36, 58);
  doc.text(`Date of Statement: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 600, 58);

  // Portfolio Summary Highlights Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(36, 72, 770, 52, 6, 6, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(36, 72, 770, 52, 6, 6, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL MARKET VALUE', 50, 92);
  doc.text('TOTAL INVESTMENT', 240, 92);
  doc.text('UNREALIZED P&L', 430, 92);
  doc.text('TOTAL RETURN (%)', 630, 92);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatPdfINR(summary.totalMarketValue, 2), 50, 112);
  doc.text(formatPdfINR(summary.totalCostBasis, 2), 240, 112);

  const isProfit = (summary.totalGainLossRupees || 0) >= 0;
  if (isProfit) {
    doc.setTextColor(16, 185, 129);
    doc.text(`+${formatPdfINR(summary.totalGainLossRupees, 2)}`, 430, 112);
    doc.text(formatPercent(summary.totalReturnPercent, 2), 630, 112);
  } else {
    doc.setTextColor(239, 68, 68);
    doc.text(formatPdfINR(summary.totalGainLossRupees, 2), 430, 112);
    doc.text(formatPercent(summary.totalReturnPercent, 2), 630, 112);
  }

  // Holdings Table Columns
  const tableHeaders = [
    [
      'Symbol',
      'Instrument Name',
      'Asset Class',
      'Qty',
      'Avg Price',
      'LTP (CMP)',
      'Current Value',
      'Investment',
      'P&L (INR)',
      'Return (%)',
      'Weight (%)',
    ],
  ];

  const tableRows = holdings.map((h) => [
    h.ticker,
    h.name,
    h.assetClass,
    h.shares ?? '—',
    h.costBasis ? formatPdfINR(h.costBasis, 2) : '—',
    h.currentPrice ? formatPdfINR(h.currentPrice, 2) : '—',
    formatPdfINR(h.marketValue, 2),
    formatPdfINR(h.totalCost, 2),
    `${h.gainLossRupees >= 0 ? '+' : ''}${formatPdfINR(h.gainLossRupees, 2)}`,
    formatPercent(h.gainLossPercent, 2),
    `${Number(h.weight || 0).toFixed(2)}%`,
  ]);

  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: 140,
    theme: 'grid',
    showHead: 'everyPage',
    headStyles: {
      fillColor: [14, 116, 144],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 8,
      cellPadding: 6,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left', cellWidth: 70 },
      1: { halign: 'left', cellWidth: 140 },
      2: { halign: 'center', cellWidth: 75 },
      3: { halign: 'right', cellWidth: 45 },
      4: { halign: 'right', cellWidth: 65 },
      5: { halign: 'right', cellWidth: 65 },
      6: { halign: 'right', fontStyle: 'bold', cellWidth: 75 },
      7: { halign: 'right', cellWidth: 75 },
      8: { halign: 'right', fontStyle: 'bold', cellWidth: 75 },
      9: { halign: 'right', fontStyle: 'bold', cellWidth: 50 },
      10: { halign: 'right', cellWidth: 45 },
    },
    didParseCell: (cellData) => {
      if (cellData.section === 'body' && (cellData.column.index === 8 || cellData.column.index === 9)) {
        const text = cellData.cell.text[0] || '';
        if (text.startsWith('+')) {
          cellData.cell.styles.textColor = [16, 185, 129];
        } else if (text.startsWith('-')) {
          cellData.cell.styles.textColor = [239, 68, 68];
        }
      }
    },
    margin: { left: 36, right: 36, bottom: 40 },
    didDrawPage: (data) => {
      // Add page numbering on multi-page investment statements
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 15
      );
    },
  });

  const finalY = doc.lastAutoTable?.finalY || 500;
  if (finalY < 540) {
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('This statement is generated automatically by PortPulse Wealth Management for informational purposes.', 36, finalY + 24);
  }

  doc.save(`PortPulse_Color_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
};