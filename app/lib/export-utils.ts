import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Importing autoTable plugin for jsPDF
import autoTable from 'jspdf-autotable';

interface DebtorData {
  name: string;
  phoneNumber?: string;
  debt: number;
  lastSale?: string;
}

interface SaleData {
  date: string;
  items: string;
  total: number;
  paymentMethod: string;
  customer: string;
}

interface PaymentData {
  date: string;
  customer: string;
  amount: number;
  note: string;
}

interface DashboardStats {
  revenue: number;
  profit: number;
  itemsSold: number;
  creditPending: number;
  totalTransactions: number;
  date: string;
}

export const exportToCSV = (data: any[], filename: string) => {
  const csv = [
    Object.keys(data[0]),
    ...data.map((row) =>
      Object.values(row).map((v) => {
        const val = String(v || '');
        return `"${val.replace(/"/g, '""')}"`;
      })
    ),
  ]
    .map((arr) => arr.join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  XLSX.writeFile(workbook, filename);
};

/* ========== ESTADÍSTICAS DASHBOARD ========== */
export const exportStatisticsToPDF = (stats: DashboardStats) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Estadísticas del Día - Cafetería Gosen', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generado: ${stats.date}`, 14, 25);

  // Estadísticas principales
  const startY = 35;
  doc.setFontSize(11);
  doc.setTextColor(0);
  
  const statsText = [
    ['Ingresos Totales:', `$${stats.revenue.toLocaleString('es-CO')}`],
    ['Ganancias:', `$${stats.profit.toLocaleString('es-CO')}`],
    ['Items Vendidos:', `${stats.itemsSold} unidades`],
    ['Crédito Pendiente:', `$${stats.creditPending.toLocaleString('es-CO')}`],
    ['Total Transacciones:', `${stats.totalTransactions}`],
  ];

  let yOffset = startY;
  statsText.forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 14, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 100, yOffset);
    yOffset += 8;
  });

  doc.save('estadisticas_dia.pdf');
};

export const exportStatisticsToExcel = (stats: DashboardStats) => {
  const data = [
    ['ESTADÍSTICAS DEL DÍA - CAFETERÍA GOSEN'],
    [''],
    ['Generado:', stats.date],
    [''],
    ['Ingresos Totales', stats.revenue],
    ['Ganancias', stats.profit],
    ['Items Vendidos', stats.itemsSold],
    ['Crédito Pendiente', stats.creditPending],
    ['Total Transacciones', stats.totalTransactions],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 25 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');
  XLSX.writeFile(wb, 'estadisticas_dia.xlsx');
};

/* ========== DEUDORES ========== */
export const exportDebtorsToPDF = (debtors: DebtorData[], totalDebt: number) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Reporte de Deudores - Cafetería Gosen', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 14, 25);

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Total de Deudores: ${debtors.length}`, 14, 35);
  doc.text(`Deuda Total: $${totalDebt.toLocaleString('es-CO')}`, 14, 42);

  const tableData = debtors.map((d) => [
    d.name,
    d.phoneNumber || '-',
    `$${d.debt.toLocaleString('es-CO')}`,
    d.lastSale ? new Date(d.lastSale).toLocaleDateString('es-CO') : '-',
  ]);

  autoTable(doc, {
    head: [['Cliente', 'Teléfono', 'Deuda', 'Última Venta']],
    body: tableData,
    startY: 50,
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save('reporte_deudores.pdf');
};

export const exportDebtorsToExcel = (debtors: DebtorData[], totalDebt: number) => {
  const data = [
    ['REPORTE DE DEUDORES - CAFETERÍA GOSEN'],
    [''],
    ['Generado:', new Date().toLocaleDateString('es-CO')],
    ['Total de Deudores:', debtors.length],
    ['Deuda Total:', totalDebt],
    [''],
    ['Cliente', 'Teléfono', 'Deuda', 'Última Venta'],
    ...debtors.map((d) => [
      d.name,
      d.phoneNumber || '-',
      d.debt,
      d.lastSale ? new Date(d.lastSale).toLocaleDateString('es-CO') : '-',
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Deudores');
  XLSX.writeFile(wb, 'reporte_deudores.xlsx');
};

/* ========== HISTORIAL DE PAGOS ========== */
export const exportPaymentHistoryToPDF = (
  payments: PaymentData[],
  totalPaid: number
) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Historial de Pagos - Cafetería Gosen', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 14, 25);

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Total Pagado: $${totalPaid.toLocaleString('es-CO')}`, 14, 35);
  doc.text(`Número de Pagos: ${payments.length}`, 14, 42);

  const tableData = payments.map((p) => [
    new Date(p.date).toLocaleDateString('es-CO'),
    p.customer,
    `$${p.amount.toLocaleString('es-CO')}`,
    p.note || '-',
  ]);

  autoTable(doc, {
    head: [['Fecha', 'Cliente', 'Monto', 'Detalle']],
    body: tableData,
    startY: 50,
    headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save('historial_pagos.pdf');
};

export const exportPaymentHistoryToExcel = (
  payments: PaymentData[],
  totalPaid: number
) => {
  const data = [
    ['HISTORIAL DE PAGOS - CAFETERÍA GOSEN'],
    [''],
    ['Generado:', new Date().toLocaleDateString('es-CO')],
    ['Total Pagado:', totalPaid],
    ['Número de Pagos:', payments.length],
    [''],
    ['Fecha', 'Cliente', 'Monto', 'Detalle'],
    ...payments.map((p) => [
      new Date(p.date).toLocaleDateString('es-CO'),
      p.customer,
      p.amount,
      p.note || '-',
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pagos');
  XLSX.writeFile(wb, 'historial_pagos.xlsx');
};
