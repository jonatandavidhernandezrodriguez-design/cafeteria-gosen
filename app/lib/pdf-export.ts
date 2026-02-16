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
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;
    
    // Función para dibujar rectángulo relleno
    const drawFilledRect = (x: number, y: number, width: number, height: number, color: [number, number, number]) => {
      doc.setFillColor(...color);
      doc.rect(x, y, width, height, 'F');
    };

    // Función para dibujar rectángulo con borde
    const drawBorderedRect = (x: number, y: number, width: number, height: number, borderColor: [number, number, number]) => {
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.rect(x, y, width, height);
    };
    
    // ========== ENCABEZADO CON FONDO AZUL ==========
    drawFilledRect(0, 0, pageWidth, yPos + 10, [37, 99, 235]);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CAFETERIA GOSEN', pageWidth / 2, 12, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Desde 2024', pageWidth / 2, 18, { align: 'center' });
    
    yPos = 35;
    
    // ========== INFORMACIÓN DEL RECIBO ==========
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
    
    // Caja gris para la info del recibo
    drawBorderedRect(margin, yPos - 2, contentWidth, 16, [180, 180, 180]);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos - 2, contentWidth, 16, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Recibo: ${receiptNumber}`, margin + 3, yPos + 2);
    doc.text(new Date().toLocaleDateString('es-CO'), margin + 3, yPos + 6);
    doc.text(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), margin + 3, yPos + 10);
    doc.text(`Cliente: ${receipt.customerName || 'CLIENTE'}`, margin + 3, yPos + 14);
    
    yPos += 20;
    
    // ========== TABLA DE ITEMS ==========
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
    
    // Encabezado de tabla
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, yPos - 5, contentWidth, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('PRODUCTO', margin + 2, yPos - 1);
    doc.text('CANT', pageWidth - margin - 35, yPos - 1);
    doc.text('UNITARIO', pageWidth - margin - 22, yPos - 1);
    doc.text('TOTAL', pageWidth - margin - 5, yPos - 1, { align: 'right' });
    
    yPos += 4;
    
    // Items
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    
    if (receipt.items && receipt.items.length > 0) {
      receipt.items.forEach((item: any, index: number) => {
        // Fondo alternado para legibilidad
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, yPos - 3, contentWidth, 5, 'F');
        }
        
        const itemName = item.product.name;
        const itemTotal = item.product.price * item.quantity;
        
        doc.text(itemName, margin + 2, yPos);
        doc.text(item.quantity.toString(), pageWidth - margin - 35, yPos);
        doc.text(`$${item.product.price.toLocaleString('es-CO')}`, pageWidth - margin - 22, yPos);
        doc.text(`$${itemTotal.toLocaleString('es-CO')}`, pageWidth - margin - 1, yPos, { align: 'right' });
        
        yPos += 5;
      });
    }
    
    // Línea separadora
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 4;
    
    // ========== TOTALES ==========
    // Fondo para totales
    drawFilledRect(margin, yPos - 2, contentWidth, 14, [237, 242, 255]);
    drawBorderedRect(margin, yPos - 2, contentWidth, 14, [37, 99, 235]);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL:', margin + 3, yPos + 3);
    doc.setTextColor(37, 99, 235);
    doc.text(`$${receipt.total.toLocaleString('es-CO')}`, pageWidth - margin - 3, yPos + 3, { align: 'right' });
    
    yPos += 16;
    
    // ========== MÉTODO DE PAGO ==========
    const paymentMethod = receipt.paymentMethod === 'cash' ? 'EFECTIVO' : 'NEQUI';
    drawFilledRect(margin, yPos, contentWidth, 8, [76, 175, 80]);
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Metodo de Pago: ${paymentMethod}`, pageWidth / 2, yPos + 5, { align: 'center' });
    
    yPos += 12;
    
    // ========== PIE DE PÁGINA ==========
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('COMPRA REALIZADA EXITOSAMENTE', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Gracias por tu compra', pageWidth / 2, yPos, { align: 'center' });
    doc.text('Vuelve pronto!', pageWidth / 2, yPos + 4, { align: 'center' });
    
    // Línea separadora final
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 8, pageWidth - margin, yPos + 8);
    
    // Información de impresión
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    
    // Descargar
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting receipt PDF:', error);
    alert('Error al exportar factura');
    return false;
  }
}
