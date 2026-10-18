import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Clean PDF currency formatter without Unicode symbol conflicts
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

// 1. Export Calculation Result to Excel (.xlsx)
export const exportToolToExcel = (toolName, inputs = {}, results = {}, schedule = []) => {
  const wb = XLSX.utils.book_new();

  const summaryAoa = [
    ['PORTPULSE FINANCIAL TOOLS REPORT'],
    ['Tool Name', toolName],
    ['Generated On', new Date().toLocaleString('en-IN')],
    [],
    ['INPUT PARAMETERS'],
    ...Object.entries(inputs).map(([k, v]) => [k, typeof v === 'number' ? v : String(v)]),
    [],
    ['STEP-BY-STEP CALCULATION RESULTS'],
    ...Object.entries(results).map(([k, v]) => [k, typeof v === 'number' ? v : String(v)]),
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoa);
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Exports the FULL schedule (all 120 or 240+ months) to Excel without truncation
  if (schedule && schedule.length > 0) {
    const wsSchedule = XLSX.utils.json_to_sheet(schedule);
    XLSX.utils.book_append_sheet(wb, wsSchedule, 'Full Schedule');
  }

  XLSX.writeFile(wb, `${toolName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// 2. Export Calculation Result to Color PDF (.pdf)
export const exportToolToColorPDF = (toolName, inputs = {}, results = {}, schedule = [], steps = []) => {
  const doc = new jsPDF('portrait', 'pt', 'a4');

  // Top Sky/Cyan Accent Bar
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, 595, 6, 'F');

  // Header Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`PortPulse • ${toolName}`, 36, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Institutional Financial Engine   |   Generated: ${new Date().toLocaleString('en-IN')}`, 36, 58);

  // Key Results Highlight Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(36, 74, 523, 62, 6, 6, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(36, 74, 523, 62, 6, 6, 'D');

  const resultEntries = Object.entries(results).slice(0, 3);
  resultEntries.forEach(([k, v], idx) => {
    const xPos = 48 + idx * 175;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(k.toUpperCase(), xPos, 94);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);

    let displayVal = String(v);
    if (typeof v === 'number' && !String(k).toLowerCase().includes('rate') && !String(k).toLowerCase().includes('percent')) {
      displayVal = formatPdfINR(v, 2);
    } else {
      displayVal = displayVal.replace(/₹/g, 'Rs. ');
    }
    doc.text(displayVal, xPos, 116);
  });

  // Inputs & Assumptions Table
  const inputRows = Object.entries(inputs).map(([k, v]) => [
    k,
    String(v).replace(/₹/g, 'Rs. '),
  ]);

  autoTable(doc, {
    head: [['Input Parameter', 'Value']],
    body: inputRows,
    startY: 150,
    theme: 'grid',
    headStyles: {
      fillColor: [14, 116, 144],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 5.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 260 },
      1: { cellWidth: 263, halign: 'left' },
    },
    margin: { left: 36, right: 36 },
  });

  let currentY = doc.lastAutoTable?.finalY + 20 || 280;

  // Step-by-Step Formula Derivations
  if (steps && steps.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Mathematical Formula & Step-by-Step Derivation:', 36, currentY);
    currentY += 15;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);

    steps.forEach((step) => {
      const sanitizedStep = String(step).replace(/₹/g, 'Rs. ');
      doc.text(`• ${sanitizedStep}`, 42, currentY);
      currentY += 14;
    });
    currentY += 10;
  }

  // Full Schedule Table: Multi-page capable with repeated headers & page numbering
  if (schedule && schedule.length > 0) {
    const scheduleHeaders = Object.keys(schedule[0]);
    // NO SLICING: maps the entire schedule array (all 120 or 240+ months)
    const scheduleRows = schedule.map((row) =>
      Object.values(row).map((val) => {
        if (typeof val === 'number') {
          return val.toLocaleString('en-IN');
        }
        return String(val).replace(/₹/g, 'Rs. ');
      })
    );

    autoTable(doc, {
      head: [scheduleHeaders],
      body: scheduleRows,
      startY: currentY,
      theme: 'striped',
      showHead: 'everyPage', // Repeats the table header on every single page
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 4.5,
        halign: 'right',
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 65 },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 36, right: 36, bottom: 40 },
      didDrawPage: (data) => {
        // Page numbering footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.width - 70,
          doc.internal.pageSize.height - 15
        );
      },
    });
  }

  doc.save(`${toolName.replace(/\s+/g, '_')}_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
};