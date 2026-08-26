import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FinanceRecord, PerformanceRecord, User, ClosingCase, Recruit, MeetingSchedule, TrainingModule, Contest } from '../types';

export const generateFinancePDF = (
  financeRecords: FinanceRecord[],
  totalIncome: number,
  totalExpense: number,
  currentUser: User,
  startDate?: string,
  endDate?: string
) => {
  const doc = new jsPDF();
  const netProfit = totalIncome - totalExpense;

  // Header Banner
  doc.setFillColor(237, 27, 46); // Red
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('REINASTA Agency', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Laporan Keuangan & Kas Agency (Konvensional & Syariah)', 14, 22);

  // Metadata
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN EKSEKUTIF KEUANGAN', 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Dicetak Oleh : ${currentUser.name} (${currentUser.role.toUpperCase()})`, 14, 45);
  doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 50);
  if (startDate || endDate) {
    doc.text(`Periode Filter : ${startDate || 'Awal'} s/d ${endDate || 'Hari Ini'}`, 14, 55);
  }

  // Summary Box
  const startYBox = startDate || endDate ? 60 : 55;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, startYBox, 182, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // Green
  doc.text(`Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}`, 20, startYBox + 8);

  doc.setTextColor(185, 28, 28); // Red
  doc.text(`Total Pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}`, 20, startYBox + 16);

  doc.setTextColor(netProfit >= 0 ? 22 : 185, netProfit >= 0 ? 101 : 28, netProfit >= 0 ? 52 : 28);
  doc.text(`Surplus / Laba Bersih: Rp ${netProfit.toLocaleString('id-ID')}`, 110, startYBox + 12);

  // Table Data
  const tableData = financeRecords.map((item, index) => [
    (index + 1).toString(),
    item.date,
    item.receiptNumber,
    item.type === 'Income' ? 'Pemasukan' : 'Pengeluaran',
    item.category,
    item.description,
    `Rp ${item.amount.toLocaleString('id-ID')}`
  ]);

  autoTable(doc, {
    startY: startYBox + 30,
    head: [['No', 'Tanggal', 'No. Kwitansi', 'Tipe', 'Kategori', 'Keterangan', 'Jumlah (IDR)']],
    body: tableData,
    headStyles: {
      fillColor: [237, 27, 46],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 22 },
      2: { cellWidth: 28 },
      3: { cellWidth: 22 },
      4: { cellWidth: 32 },
      5: { cellWidth: 42 },
      6: { cellWidth: 26, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Footer Signatures
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  if (finalY < 250) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    doc.text('Dibuat Oleh,', 25, finalY);
    doc.text('Dewi Lestari', 25, finalY + 22);
    doc.text('Sekretaris Agency', 25, finalY + 27);

    doc.text('Disetujui Oleh,', 140, finalY);
    doc.text('Budi Santoso, CFP', 140, finalY + 22);
    doc.text('Agency Owner / Director', 140, finalY + 27);
  }

  doc.save(`Laporan_Keuangan_Reinasta_Agency_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const generatePerformancePDF = (
  performanceList: PerformanceRecord[],
  periodLabel: string,
  currentUser: User
) => {
  const doc = new jsPDF();

  // Header Banner - Text Only "REINASTA Agency"
  doc.setFillColor(237, 27, 46);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('REINASTA Agency', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Laporan Analisa & Evaluasi Performa Penjualan - Periode: ${periodLabel}`, 14, 22);

  // Metadata
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN EVALUASI PERFORMA PENJUALAN', 14, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Dicetak Oleh : ${currentUser.name} (${currentUser.role.toUpperCase()})`, 14, 42);
  doc.text(`Tanggal Export : ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 47);

  // Group performance list by Unit
  const unitMap = new Map<string, PerformanceRecord[]>();
  performanceList.forEach((p) => {
    const unit = p.unitName || 'Tanpa Unit';
    if (!unitMap.has(unit)) {
      unitMap.set(unit, []);
    }
    unitMap.get(unit)!.push(p);
  });

  // Calculate unit total API and sort units descending by total API
  const sortedUnits = Array.from(unitMap.entries())
    .map(([unitName, records]) => {
      const unitTotalApi = records.reduce((sum, item) => sum + item.totalApi, 0);
      // Sort agents within unit descending by totalApi
      const sortedRecords = [...records].sort((a, b) => b.totalApi - a.totalApi);
      return { unitName, unitTotalApi, records: sortedRecords };
    })
    .sort((a, b) => b.unitTotalApi - a.unitTotalApi);

  // Build table data with unit section headers
  const tableData: any[] = [];
  let itemCounter = 1;

  sortedUnits.forEach((group) => {
    // Add Unit Section Header Row
    tableData.push([
      {
        content: `KELOMPOK UNIT: ${group.unitName.toUpperCase()}  |  Total API Unit: Rp ${group.unitTotalApi.toLocaleString('id-ID')} (${(group.unitTotalApi / 1000000).toFixed(1)} Jt)`,
        colSpan: 9,
        styles: {
          fillColor: [241, 245, 249],
          textColor: [185, 28, 28],
          fontStyle: 'bold',
          fontSize: 8.5,
          halign: 'left',
        },
      },
    ]);

    // Add agent rows under this unit sorted descending by totalApi
    group.records.forEach((p) => {
      tableData.push([
        itemCounter.toString(),
        p.agentName,
        p.pruCode,
        p.unitName,
        `Rp ${(p.totalApi / 1000000).toFixed(1)} Jt`,
        `Rp ${(p.apiSyariah / 1000000).toFixed(1)} Jt`,
        p.caseCount.toString(),
        `${p.persistencyRate}%`,
        p.clubLevel,
      ]);
      itemCounter++;
    });
  });

  autoTable(doc, {
    startY: 52,
    head: [['No', 'Nama Agen', 'PruCode', 'Unit', 'Total API', 'API Syariah', 'Kasus', 'Persistency', 'Klub']],
    body: tableData,
    headStyles: {
      fillColor: [237, 27, 46],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 32 },
      2: { cellWidth: 22 },
      3: { cellWidth: 26 },
      4: { cellWidth: 26, halign: 'right' },
      5: { cellWidth: 26, halign: 'right' },
      6: { cellWidth: 14, halign: 'center' },
      7: { cellWidth: 20, halign: 'center' },
      8: { cellWidth: 12, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [250, 252, 255],
    },
  });

  doc.save(`Laporan_Analisa_Evaluasi_Performa_Penjualan_REINASTA_Agency_${periodLabel.replace(/\s+/g, '_')}.pdf`);
};

export const generateDashboardSummaryPDF = (
  currentUser: User,
  cases: ClosingCase[],
  recruits: Recruit[],
  performance: PerformanceRecord[],
  meetings: MeetingSchedule[],
  finance?: FinanceRecord[],
  modules?: TrainingModule[],
  contests?: Contest[],
  allUsers?: User[]
) => {
  const doc = new jsPDF();
  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate high level metrics
  const totalApi = cases.reduce((sum, c) => sum + c.annualPremium, 0);
  const totalApiSyariah = cases.filter((c) => c.productType === 'syariah').reduce((sum, c) => sum + c.annualPremium, 0);
  const totalApiKonvensional = totalApi - totalApiSyariah;
  const syariahPercent = totalApi > 0 ? Math.round((totalApiSyariah / totalApi) * 100) : 0;
  const issuedCases = cases.filter((c) => c.stage === 'Issued & Paid').length;
  const pendingCases = cases.filter((c) => c.stage === 'Underwriting / Medical' || c.stage === 'SPAJ Submitted').length;

  let totalIncome = 0;
  let totalExpense = 0;
  if (finance) {
    totalIncome = finance.filter((f) => f.type === 'Income').reduce((s, f) => s + f.amount, 0);
    totalExpense = finance.filter((f) => f.type === 'Expense').reduce((s, f) => s + f.amount, 0);
  }
  const netSurplus = totalIncome - totalExpense;

  // Inactive agents calculation (>30 days since last closing)
  const nowTime = new Date().getTime();
  const inactiveAgentsList: Array<{ name: string; pruCode: string; unit: string; daysInactive: number; phone: string }> = [];

  if (allUsers) {
    const agents = allUsers.filter((u) => u.role === 'agent' || u.role === 'unit_manager');
    agents.forEach((ag) => {
      const agentCases = cases.filter((c) => c.agentId === ag.id);
      let latestDate = new Date(ag.joinDate || '2025-01-01').getTime();
      agentCases.forEach((c) => {
        const dStr = c.issuedDate || c.submittedDate;
        if (dStr) {
          const t = new Date(dStr).getTime();
          if (t > latestDate) latestDate = t;
        }
      });
      const daysDiff = Math.floor((nowTime - latestDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > 30) {
        inactiveAgentsList.push({
          name: ag.name,
          pruCode: ag.pruCode || '-',
          unit: ag.unitName || '-',
          daysInactive: daysDiff,
          phone: ag.phone || '-'
        });
      }
    });
  }

  // Header Banner
  doc.setFillColor(237, 27, 46); // Prudential Red
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('REINASTA AGENCY - EXECUTIVE SUMMARY REPORT', 14, 15);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Rangkuman Komprehensif Sistem Informasi Agensi Prudential Indonesia', 14, 23);

  // Metadata Block
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMASI LAPORAN & OTORISASI', 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Otorisator/Pencetak : ${currentUser.name} (${currentUser.role.toUpperCase()})`, 14, 44);
  doc.text(`PruCode / Unit     : ${currentUser.pruCode || 'HEADQUARTERS'} - ${currentUser.unitName || 'Reinasta Agency'}`, 14, 49);
  doc.text(`Waktu Cetak         : ${currentDateStr}`, 14, 54);

  // Summary Metrics Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 58, 182, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28); // Red
  doc.text(`TOTAL PRODUCTION API (YTD): Rp ${totalApi.toLocaleString('id-ID')} (${(totalApi / 1000000).toFixed(1)} Jt)`, 20, 66);

  doc.setTextColor(16, 118, 66); // Green
  doc.text(`Porsi Syariah: Rp ${totalApiSyariah.toLocaleString('id-ID')} (${syariahPercent}%)  |  Konvensional: Rp ${totalApiKonvensional.toLocaleString('id-ID')}`, 20, 73);

  doc.setTextColor(30, 41, 59);
  doc.text(`Status SPAJ & Closing: ${issuedCases} Polis Issued  |  ${pendingCases} Underwriting/Medical`, 20, 80);
  doc.text(`Pipeline Rekrutmen: ${recruits.length} Calon Agen  |  Kas/Keuangan Agency: Surplus Rp ${netSurplus.toLocaleString('id-ID')}`, 20, 87);

  // Table 1: Performance Ranking
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('1. EVALUASI PERFORMA & PRODUKSI AGEN (YTD 2026)', 14, 103);

  const perfTableData = performance.map((p, idx) => [
    (idx + 1).toString(),
    p.agentName,
    p.pruCode,
    p.unitName,
    `Rp ${(p.totalApi / 1000000).toFixed(1)} Jt`,
    `Rp ${(p.apiSyariah / 1000000).toFixed(1)} Jt`,
    p.caseCount.toString(),
    `${p.persistencyRate}%`,
    p.clubLevel
  ]);

  autoTable(doc, {
    startY: 106,
    head: [['No', 'Nama Agen', 'PruCode', 'Unit Team', 'Total API', 'Syariah API', 'Kasus', 'Persistency', 'Klub']],
    body: perfTableData,
    headStyles: { fillColor: [237, 27, 46], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 32 },
      2: { cellWidth: 20 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24, halign: 'right' },
      5: { cellWidth: 24, halign: 'right' },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 18, halign: 'center' },
      8: { cellWidth: 16, halign: 'center' }
    },
    alternateRowStyles: { fillColor: [250, 252, 255] }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // Table 2: Inactive Agents Alert (>30 Days)
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Amber
  doc.text('2. PERINGATAN DINI AGENT INAKTIF (> 30 HARI TANPA CLOSING)', 14, currentY);

  const inactiveTableData =
    inactiveAgentsList.length === 0
      ? [['1', 'Tidak ada agen yang inaktif > 30 hari. Seluruh agen produktif!', '-', '-', '-', '0 Hari', 'NORMAL']]
      : inactiveAgentsList.map((ag, idx) => [
          (idx + 1).toString(),
          ag.name,
          ag.pruCode,
          ag.unit,
          ag.phone,
          `${ag.daysInactive} Hari`,
          'PERLU COACHING'
        ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['No', 'Nama Agen Inaktif', 'PruCode', 'Unit Team', 'No. Telepon', 'Durasi Inaktif', 'Status Action']],
    body: inactiveTableData,
    headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 38 },
      2: { cellWidth: 22 },
      3: { cellWidth: 34 },
      4: { cellWidth: 28 },
      5: { cellWidth: 24, halign: 'center' },
      6: { cellWidth: 26, halign: 'center' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Table 3: Recruitment Pipeline Summary
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // Blue
  doc.text('3. PIPELINE REKRUTMEN AGEN BARU', 14, currentY);

  const recruitTableData = recruits.map((r, idx) => [
    (idx + 1).toString(),
    r.name,
    r.sponsorAgentName,
    r.unitName,
    r.stage,
    r.aaliScore ? `${r.aaliScore}/100` : '-',
    r.targetAppointDate
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['No', 'Nama Calon Agen', 'Sponsor / Leader', 'Unit', 'Tahapan / Stage', 'Nilai AALI', 'Target Appoint']],
    body: recruitTableData,
    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 36 },
      2: { cellWidth: 34 },
      3: { cellWidth: 32 },
      4: { cellWidth: 32 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 20, halign: 'center' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Footer Signatures
  if (currentY > 235) {
    doc.addPage();
    currentY = 30;
  }

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  doc.text('Disiapkan Oleh,', 25, currentY);
  doc.text('Dewi Lestari', 25, currentY + 18);
  doc.text('Sekretaris & Administrator Agency', 25, currentY + 23);

  doc.text('Disetujui & Disahkan Oleh,', 135, currentY);
  doc.text('Budi Santoso, CFP', 135, currentY + 18);
  doc.text('Agency Owner / Director', 135, currentY + 23);

  doc.save(`Summary_Laporan_Agensi_Reinasta_${new Date().toISOString().slice(0, 10)}.pdf`);
};

