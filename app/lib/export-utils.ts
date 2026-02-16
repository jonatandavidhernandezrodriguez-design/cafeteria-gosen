import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

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
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // ========== ENCABEZADO ==========
    // Fondo azul
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('Helvetica', 'bold');
    doc.text('● CAFETERÍA GOSEN', pageWidth / 2, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text('Reporte de Estadísticas Diarias', pageWidth / 2, 35, { align: 'center' });

    // ========== INFORMACIÓN DEL REPORTE ==========
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    const now = new Date();
    const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    doc.text(`Generado: ${stats.date} a las ${hora}`, margin, 60);

    // ========== CAJAS DE ESTADÍSTICAS ==========
    let yPos = 70;
    const boxHeight = 28;
    const boxWidth = (contentWidth - 5) / 2;

    // Función helper para dibujar cajas
    const drawStatBox = (x: number, y: number, label: string, value: string, bgColor: [number, number, number], icon: string) => {
      // Fondo de la caja
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(x, y, boxWidth, boxHeight, 'F');
      
      // Bordes
      doc.setDrawColor(bgColor[0] - 20, bgColor[1] - 20, bgColor[2] - 20);
      doc.setLineWidth(0.5);
      doc.rect(x, y, boxWidth, boxHeight);
      
      // Icono
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(icon, x + 5, y + 12);
      
      // Label (blanco)
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'normal');
      doc.text(label, x + 10, y + 10);
      
      // Valor (más grande y bold)
      doc.setFontSize(13);
      doc.setFont('Helvetica', 'bold');
      doc.text(value, x + 10, y + 20);
    };

    // Ingresos Totales - Verde
    drawStatBox(margin, yPos, 'Ingresos Totales', `$${stats.revenue.toLocaleString('es-CO')}`, [34, 197, 94], '◆');
    
    // Ganancias - Azul
    drawStatBox(margin + boxWidth + 5, yPos, 'Ganancias Netas', `$${stats.profit.toLocaleString('es-CO')}`, [37, 99, 235], '▲');
    
    yPos += boxHeight + 5;
    
    // Items Vendidos - Naranja
    drawStatBox(margin, yPos, 'Items Vendidos', `${stats.itemsSold} productos`, [245, 127, 23], '■');
    
    // Transacciones - Púrpura
    drawStatBox(margin + boxWidth + 5, yPos, 'Transacciones', `${stats.totalTransactions} ventas`, [139, 92, 246], '○');
    
    yPos += boxHeight + 15;

    // ========== TABLA DETALLADA ==========
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('Resumen Detallado', margin, yPos);
    
    yPos += 8;
    
    // Encabezado de tabla
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, yPos - 4, contentWidth, 6, 'F');
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Concepto', margin + 2, yPos);
    doc.text('Valor', margin + contentWidth - 30, yPos);
    
    yPos += 6;
    
    // Filas de datos
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    
    const rows = [
      ['◆ Ingresos Totales', `$${stats.revenue.toLocaleString('es-CO')}`],
      ['▲ Ganancias Netas', `$${stats.profit.toLocaleString('es-CO')}`],
      ['■ Items Vendidos', `${stats.itemsSold} unidades`],
      ['○ Total Transacciones', `${stats.totalTransactions} ventas`],
      ['◇ Crédito Pendiente', `$${stats.creditPending.toLocaleString('es-CO')}`],
    ];
    
    rows.forEach((row, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos - 3, contentWidth, 5, 'F');
      }
      
      doc.setTextColor(0, 0, 0);
      doc.text(row[0], margin + 2, yPos);
      doc.text(row[1], margin + contentWidth - 30, yPos, { align: 'right' });
      yPos += 6;
    });

    // ========== LÍNEA SEPARADORA ==========
    yPos += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, margin + contentWidth, yPos);

    // ========== PIE DEL DOCUMENTO ==========
    yPos = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('Helvetica', 'normal');
    doc.text('Este reporte fue generado automáticamente por Cafetería Gosen', pageWidth / 2, yPos, { align: 'center' });
    doc.text(`Para consultas o reportes, contacta al administrador`, pageWidth / 2, yPos + 5, { align: 'center' });

    // ========== NÚMERO DE PÁGINA ==========
    doc.setFontSize(7);
    doc.text(`Página 1 de 1`, pageWidth / 2, pageHeight - 5, { align: 'center' });

    doc.save('estadisticas_dia.pdf');
  } catch (error) {
    console.error('Error exporting stats to PDF:', error);
    throw error;
  }
};

export const exportStatisticsToExcel = (stats: DashboardStats) => {
  try {
    const data = [
      ['', '', '● CAFETERÍA GOSEN', ''],
      ['', '', 'REPORTE DE ESTADÍSTICAS DIARIAS', ''],
      [''],
      ['Generado:', stats.date, new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), ''],
      [''],
      ['ESTADÍSTICAS PRINCIPALES', '', '', ''],
      ['Concepto', 'Valor', 'Estado', ''],
      ['◆ Ingresos Totales', `$${stats.revenue.toLocaleString('es-CO')}`, '', ''],
      ['▲ Ganancias Netas', `$${stats.profit.toLocaleString('es-CO')}`, '', ''],
      ['■ Items Vendidos', `${stats.itemsSold} productos`, '', ''],
      ['○ Total Transacciones', `${stats.totalTransactions} ventas`, '', ''],
      ['◇ Crédito Pendiente', `$${stats.creditPending.toLocaleString('es-CO')}`, '', ''],
      [''],
      ['Porcentaje de Ganancias', `${((stats.profit / stats.revenue) * 100).toFixed(2)}%`, '', ''],
      ['Ticket Promedio', `$${(stats.revenue / stats.totalTransactions).toLocaleString('es-CO')}`, '', ''],
      ['Productos por Transacción', `${(stats.itemsSold / stats.totalTransactions).toFixed(2)} items`, '', ''],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Estilos - asignar anchos de columna
    ws['!cols'] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
    ];

    // Aplicar formato a las celdas importantes
    const boldCells = ['A1', 'A2', 'A6', 'A7'];
    boldCells.forEach((cell) => {
      if (ws[cell]) {
        ws[cell].s = { font: { bold: true, size: 12 } };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');
    XLSX.writeFile(wb, `estadisticas_${stats.date}.xlsx`);
  } catch (error) {
    console.error('Error exporting stats to Excel:', error);
    throw error;
  }
};

/* ========== DEUDORES ========== */
export const exportDebtorsToPDF = (debtors: DebtorData[], totalDebt: number) => {
  try {
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

    // Tabla simple sin autoTable
    let yOffset = 52;
    const colX = [14, 60, 100, 140];
    const headers = ['Cliente', 'Teléfono', 'Deuda', 'Última Venta'];
    
    doc.setFont('Helvetica', 'bold');
    doc.setFillColor(37, 99, 235);
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, i) => {
      doc.text(header, colX[i], yOffset);
    });
    
    yOffset += 8;
    doc.setTextColor(0);
    doc.setFont('Helvetica', 'normal');
    
    debtors.slice(0, 20).forEach((debtor) => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(debtor.name, colX[0], yOffset);
      doc.text(debtor.phoneNumber || '-', colX[1], yOffset);
      doc.text(`$${debtor.debt.toLocaleString('es-CO')}`, colX[2], yOffset);
      doc.text(debtor.lastSale ? new Date(debtor.lastSale).toLocaleDateString('es-CO') : '-', colX[3], yOffset);
      yOffset += 7;
    });

    doc.save('reporte_deudores.pdf');
  } catch (error) {
    console.error('Error exporting debtors to PDF:', error);
    throw error;
  }
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
  try {
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

    // Tabla simple sin autoTable
    let yOffset = 52;
    const colX = [14, 60, 110, 150];
    const headers = ['Fecha', 'Cliente', 'Monto', 'Detalle'];
    
    doc.setFont('Helvetica', 'bold');
    doc.setFillColor(34, 197, 94);
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, i) => {
      doc.text(header, colX[i], yOffset);
    });
    
    yOffset += 8;
    doc.setTextColor(0);
    doc.setFont('Helvetica', 'normal');
    
    payments.slice(0, 20).forEach((payment) => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(new Date(payment.date).toLocaleDateString('es-CO'), colX[0], yOffset);
      doc.text(payment.customer, colX[1], yOffset);
      doc.text(`$${payment.amount.toLocaleString('es-CO')}`, colX[2], yOffset);
      doc.text(payment.note || '-', colX[3], yOffset);
      yOffset += 7;
    });

    doc.save('historial_pagos.pdf');
  } catch (error) {
    console.error('Error exporting payment history to PDF:', error);
    throw error;
  }
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
