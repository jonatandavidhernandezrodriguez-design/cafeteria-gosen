// PDF export utilities
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare global {
  interface jsPDF {
    autoTable?: any;
  }
}

export function exportSalesToPDF(sales: any[], filename: string = 'ventas.pdf') {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Título
    doc.setFontSize(16);
    doc.text('REPORTE DE VENTAS', pageWidth / 2, 15, { align: 'center' });
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, pageWidth / 2, 22, { align: 'center' });
    
    // Resumen
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit ?? 0), 0);
    
    doc.setFontSize(11);
    doc.text(`Total Ventas: $${totalSales.toLocaleString()}`, 14, 32);
    doc.text(`Total Ganancia: $${totalProfit.toLocaleString()}`, 14, 39);
    doc.text(`Transacciones: ${sales.length}`, 14, 46);
    
    // Tabla de ventas
    const columns = ['Fecha', 'Cliente', 'Total', 'Ganancia', 'Pago'];
    const data = sales.map(sale => [
      new Date(sale.date).toLocaleDateString('es-CO'),
      sale.customerName || 'Sin nombre',
      `$${sale.total.toLocaleString()}`,
      `$${(sale.profit ?? 0).toLocaleString()}`,
      sale.paymentMethod === 'cash' ? 'Efectivo' : 'Nequi'
    ]);
    
    (doc as any).autoTable({
      head: [columns],
      body: data,
      startY: 55,
      margin: { left: 14, right: 14 },
      didDrawPage: () => {
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        const currentPage = (doc as any).internal.getCurrentPageNumber();
        doc.setFontSize(8);
        doc.text(
          `Página ${currentPage} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });
    
    // Descargar
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('❌ Error al exportar PDF');
    return false;
  }
}

export function exportReceiptToPDF(receipt: any, filename: string = 'factura.pdf') {
  try {
    // Crear documento tipo ticket térmico (80mm de ancho es estándar)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // 80mm ancho, ajustable largo
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 3;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;
    
    // ========== ENCABEZADO ==========
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CAFETERIA GOSEN', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Desde 2024', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    
    // Línea punteada
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
    
    // ========== INFORMACIÓN DEL RECIBO ==========
    const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
    doc.setFontSize(7);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Recibo: ${receiptNumber}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    
    doc.text(new Date().toLocaleDateString('es-CO'), pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    
    doc.text(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    const clientText = `Cliente: ${receipt.customerName || 'CLIENTE'}`;
    doc.text(clientText, pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    
    // Línea separadora
    doc.setLineWidth(0.3);
    doc.line(margin, yPos - 1, pageWidth - margin, yPos - 1);
    yPos += 2;
    
    // ========== ITEMS ==========
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    
    if (receipt.items && receipt.items.length > 0) {
      receipt.items.forEach((item: any) => {
        const itemName = item.product.name;
        const itemTotal = item.product.price * item.quantity;
        
        // Nombre del producto
        const nameLines = doc.splitTextToSize(itemName, contentWidth - 8);
        doc.text(nameLines, margin + 1, yPos);
        yPos += (nameLines.length * 2.5);
        
        // Cantidad x Precio = Total
        const detailText = `${item.quantity}x $${item.product.price.toLocaleString('es-CO')} = $${itemTotal.toLocaleString('es-CO')}`;
        doc.text(detailText, margin + 1, yPos);
        yPos += 3;
      });
    }
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
    
    // ========== TOTAL ==========
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    const totalLines = doc.splitTextToSize(`TOTAL: $${receipt.total.toLocaleString('es-CO')}`, contentWidth - 2);
    doc.text(totalLines, pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    
    // Línea separadora
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
    
    // ========== MÉTODO DE PAGO ==========
    const paymentMethod = receipt.paymentMethod === 'cash' ? 'EFECTIVO' : 'NEQUI';
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Pago: ${paymentMethod}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    // ========== PIE DE PÁGINA ==========
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('COMPRA REALIZADA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Gracias por tu compra', pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    
    doc.text('Vuelve pronto!', pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    
    // Línea punteada final
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    // Descargar
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting receipt PDF:', error);
    alert('Error al exportar factura');
    return false;
  }
}
