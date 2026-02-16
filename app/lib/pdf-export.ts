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
    // Crear documento con tamaño de ticket térmico (80mm ancho, 280mm largo)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 280] // 80mm ancho, 280mm largo
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 5;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;
    
    // Funciones auxiliares
    const writeLine = (text: string, fontSize: number = 8, bold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('Helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += (fontSize / 2.5) * lines.length + 1;
    };
    
    const writeCenter = (text: string, fontSize: number = 8, bold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('Helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, pageWidth / 2, yPos, { align: 'center' });
      yPos += (fontSize / 2.5) * lines.length + 1;
    };
    
    const drawLine = (stroke: number = 0.5) => {
      doc.setLineWidth(stroke);
      doc.setDrawColor(0);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 3;
    };
    
    // Encabezado
    writeCenter('☕ CAFETERÍA GOSEN', 11, true);
    writeCenter('Desde 2024', 7);
    drawLine();
    
    // Información del recibo
    const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
    writeCenter(`Recibo: ${receiptNumber}`, 7);
    writeCenter(new Date().toLocaleDateString('es-CO'), 7);
    writeCenter(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), 7);
    writeCenter(`Cliente: ${receipt.customerName || 'CLIENTE'}`, 7);
    drawLine();
    
    // Items
    if (receipt.items && receipt.items.length > 0) {
      doc.setFontSize(7);
      doc.setFont('Helvetica', 'bold');
      doc.text('Producto', margin, yPos);
      doc.text('Cant', pageWidth - margin - 15, yPos);
      doc.text('Total', pageWidth - margin, yPos, { align: 'right' });
      yPos += 3;
      
      doc.setFont('Helvetica', 'normal');
      receipt.items.forEach((item: any) => {
        const itemName = item.product.name;
        const itemTotal = item.product.price * item.quantity;
        
        doc.setFontSize(7);
        const nameLines = doc.splitTextToSize(itemName, contentWidth - 20);
        doc.text(nameLines, margin, yPos);
        const nameHeight = nameLines.length * 2.5;
        
        doc.text(item.quantity.toString(), pageWidth - margin - 15, yPos);
        doc.text(`$${itemTotal.toLocaleString('es-CO')}`, pageWidth - margin, yPos, { align: 'right' });
        
        yPos += nameHeight + 1;
      });
    }
    
    drawLine();
    
    // Total
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text('TOTAL:', margin, yPos);
    doc.text(`$${receipt.total.toLocaleString('es-CO')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 5;
    
    // Método de pago
    drawLine();
    const paymentMethod = receipt.paymentMethod === 'cash' ? '💵 EFECTIVO' : '📱 NEQUI';
    writeCenter(paymentMethod, 8, true);
    drawLine();
    
    // Pie de página
    writeCenter('✅ COMPRA REALIZADA EXITOSAMENTE', 7);
    writeCenter('Gracias por tu compra', 7);
    writeCenter('¡Vuelve pronto!', 7);
    
    // Descargar
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting receipt PDF:', error);
    alert('❌ Error al exportar factura');
    return false;
  }
}
