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
    // Crear documento en tamaño A4 estándar para mejor impresión
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;
    
    // Funciones auxiliares
    const writeLine = (text: string, fontSize: number = 9, bold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('Helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += (fontSize / 2.65) * lines.length + 2;
    };
    
    const writeCenter = (text: string, fontSize: number = 9, bold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('Helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, pageWidth / 2, yPos, { align: 'center' });
      yPos += (fontSize / 2.65) * lines.length + 2;
    };
    
    const drawLine = (stroke: number = 0.5) => {
      doc.setLineWidth(stroke);
      doc.setDrawColor(0, 0, 0);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;
    };
    
    // Encabezado
    writeCenter('CAFETERIA GOSEN', 16, true);
    writeCenter('Desde 2024', 8);
    yPos += 2;
    drawLine(0.8);
    
    // Información del recibo
    const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
    writeCenter(`Numero de Recibo: ${receiptNumber}`, 8);
    writeCenter(new Date().toLocaleDateString('es-CO'), 8);
    writeCenter(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), 8);
    
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`Cliente: ${receipt.customerName || 'CLIENTE'}`, margin, yPos);
    yPos += 4;
    drawLine();
    
    // Encabezado de tabla de items
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const colProduct = margin;
    const colQty = pageWidth - margin - 30;
    const colPrice = pageWidth - margin - 15;
    
    doc.text('PRODUCTO', colProduct, yPos);
    doc.text('CANT', colQty, yPos);
    doc.text('TOTAL', colPrice, yPos, { align: 'right' });
    yPos += 4;
    drawLine(0.3);
    
    // Items
    if (receipt.items && receipt.items.length > 0) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      
      receipt.items.forEach((item: any) => {
        const itemName = item.product.name;
        const itemTotal = item.product.price * item.quantity;
        
        const nameLines = doc.splitTextToSize(itemName, colQty - colProduct - 2);
        const lineHeight = nameLines.length;
        
        doc.text(nameLines, colProduct, yPos);
        doc.text(item.quantity.toString(), colQty, yPos);
        doc.text(`$${itemTotal.toLocaleString('es-CO')}`, colPrice, yPos, { align: 'right' });
        
        yPos += (lineHeight * 3.5) + 1;
      });
    }
    
    drawLine(0.6);
    
    // Resumen
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('SUBTOTAL:', margin, yPos);
    doc.text(`$${receipt.total.toLocaleString('es-CO')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 6;
    
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('TOTAL:', margin, yPos);
    doc.text(`$${receipt.total.toLocaleString('es-CO')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 7;
    
    drawLine(0.8);
    
    // Método de pago
    const paymentMethod = receipt.paymentMethod === 'cash' ? 'EFECTIVO' : 'NEQUI';
    writeCenter(`Forma de Pago: ${paymentMethod}`, 9, true);
    yPos += 2;
    drawLine();
    
    // Pie de página
    writeCenter('COMPRA REALIZADA EXITOSAMENTE', 8, true);
    writeCenter('Gracias por tu compra', 8);
    writeCenter('Vuelve pronto!', 8);
    yPos += 3;
    
    // Pie inferior
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${new Date().toString().slice(0, 21)}`, margin, pageHeight - 8);
    
    // Descargar
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting receipt PDF:', error);
    alert('Error al exportar factura');
    return false;
  }
}
