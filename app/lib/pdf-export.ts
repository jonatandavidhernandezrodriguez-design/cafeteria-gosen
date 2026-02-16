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
      format: [80, 250] // 80mm ancho, 250mm largo
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 4;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 6;
    
    // ========== ENCABEZADO ==========
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CAFETERIA GOSEN', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Desde 2024', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    // Línea separadora gruesa
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    // ========== INFORMACIÓN DEL RECIBO ==========
    const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Recibo: ${receiptNumber}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    
    doc.text(new Date().toLocaleDateString('es-CO'), pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    
    doc.text(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    const clientText = `Cliente: ${receipt.customerName || 'CLIENTE'}`;
    doc.text(clientText, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;
    
    // ========== ENCABEZADO TABLA ==========
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('PRODUCTO', margin + 1, yPos);
    doc.text('CANT', pageWidth - margin - 20, yPos);
    doc.text('PRECIO', pageWidth - margin - 12, yPos);
    yPos += 4;
    
    // Línea punteada
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;
    
    // ========== ITEMS ==========
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    
    if (receipt.items && receipt.items.length > 0) {
      receipt.items.forEach((item: any, index: number) => {
        const itemName = item.product.name;
        const itemTotal = item.product.price * item.quantity;
        
        // Nombre del producto
        doc.setFont('Helvetica', 'bold');
        const nameLines = doc.splitTextToSize(itemName, contentWidth - 4);
        doc.text(nameLines, margin + 1, yPos);
        yPos += (nameLines.length * 3.5) + 1;
        
        // Detalles
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        const detailText = `${item.quantity}x $${item.product.price.toLocaleString('es-CO')}`;
        doc.text(detailText, margin + 2, yPos);
        
        const totalText = `$${itemTotal.toLocaleString('es-CO')}`;
        doc.text(totalText, pageWidth - margin - 1, yPos, { align: 'right' });
        yPos += 4;
        
        // Línea separadora entre items
        if (index < receipt.items.length - 1) {
          doc.setLineWidth(0.2);
          doc.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 1;
        }
      });
    }
    
    yPos += 3;
    
    // Línea separadora gruesa
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    // ========== SUBTOTAL Y TOTAL ==========
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SUBTOTAL:', margin + 1, yPos);
    doc.text(`$${receipt.total.toLocaleString('es-CO')}`, pageWidth - margin - 1, yPos, { align: 'right' });
    yPos += 5;
    
    // TOTAL DESTACADO
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', margin + 1, yPos);
    doc.text(`$${receipt.total.toLocaleString('es-CO')}`, pageWidth - margin - 1, yPos, { align: 'right' });
    yPos += 7;
    
    // Línea separadora
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    // ========== MÉTODO DE PAGO ==========
    const paymentMethod = receipt.paymentMethod === 'cash' ? 'EFECTIVO' : 'NEQUI';
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`METODO DE PAGO`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(paymentMethod, pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    // ========== PIE DE PÁGINA ==========
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('COMPRA REALIZADA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('De forma exitosa', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    
    doc.setFontSize(7);
    doc.setTextColor(50, 50, 50);
    doc.text('Gracias por tu compra', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    
    doc.text('Vuelve pronto!', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    
    // Línea punteada final
    doc.setLineWidth(0.3);
    doc.setTextColor(0, 0, 0);
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
