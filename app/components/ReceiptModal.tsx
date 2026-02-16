'use client';

import React, { useRef } from 'react';
import { formatCOP } from '@/app/lib/currency';
import { exportReceiptToPDF } from '@/app/lib/pdf-export';

interface CartItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface ReceiptModalProps {
  isOpen: boolean;
  total: number;
  paymentMethod: 'cash' | 'nequi';
  customerName: string;
  itemCount: number;
  items?: CartItem[];
  onClose: () => void;
}

export default function ReceiptModal({
  isOpen,
  total,
  paymentMethod,
  customerName,
  itemCount,
  items = [],
  onClose,
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const paymentMethodLabel = {
    cash: { label: 'EFECTIVO' },
    nequi: { label: 'NEQUI' },
  }[paymentMethod];

  const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        const html = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <title>Factura ${receiptNumber}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Courier New', monospace; background: white; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; text-align: center; color: #000; }
              .header { border-bottom: 2px dashed #999; padding-bottom: 15px; margin-bottom: 15px; }
              .title { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
              .subtitle { font-size: 11px; color: #666; }
              .info { font-size: 10px; border-bottom: 1px solid #999; padding-bottom: 10px; margin-bottom: 10px; }
              .items { border-bottom: 1px solid #999; padding-bottom: 10px; margin-bottom: 10px; }
              .item { font-size: 10px; text-align: left; margin-bottom: 5px; }
              .item-header { font-weight: bold; border-bottom: 1px dotted #999; padding-bottom: 3px; margin-bottom: 5px; }
              .item-name { margin-right: 5px; }
              .item-price { text-align: right; }
              .total { font-size: 12px; font-weight: bold; border-bottom: 2px dashed #999; padding: 10px 0; margin-bottom: 10px; }
              .payment { font-size: 11px; font-weight: bold; margin-bottom: 10px; }
              .footer { font-size: 9px; color: #666; border-top: 2px dashed #999; padding-top: 10px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="title">CAFETERIA GOSEN</div>
                <div class="subtitle">Desde 2024</div>
              </div>
              
              <div class="info">
                <div>Recibo: <strong>${receiptNumber}</strong></div>
                <div>${new Date().toLocaleDateString('es-CO')}</div>
                <div>${new Date().toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</div>
                <div style="margin-top: 5px;">Cliente: <strong>${customerName || 'CLIENTE'}</strong></div>
              </div>
              
              <div class="items">
                <div class="item-header">
                  <span>PRODUCTO</span>
                  <span style="float: right;">TOTAL</span>
                </div>
                ${items.map((item) => `
                  <div class="item">
                    <div>${item.product.name}</div>
                    <div style="color: #666; font-size: 9px;">${item.quantity}x ${formatCOP(item.product.price)}</div>
                    <div style="text-align: right; font-weight: bold;">${formatCOP(item.product.price * item.quantity)}</div>
                  </div>
                `).join('')}
              </div>
              
              <div class="total">
                TOTAL: ${formatCOP(total).toUpperCase()}
              </div>
              
              <div class="payment">
                Metodo de Pago: ${paymentMethodLabel.label}
              </div>
              
              <div class="footer">
                <div>COMPRA REALIZADA EXITOSAMENTE</div>
                <div style="margin-top: 5px;">Gracias por tu compra</div>
                <div style="margin-top: 3px;">Vuelve pronto!</div>
              </div>
            </div>
          </body>
          </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  const handleExportPDF = () => {
    const receipt = {
      customerName,
      paymentMethod,
      total,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity
      }))
    };
    exportReceiptToPDF(receipt, `factura-${receiptNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-auto">
        {/* Receipt Body - estilo ticket de caja */}
        <div ref={receiptRef} className="p-4 text-gray-900" style={{ fontSize: '10px', lineHeight: '1.2' }}>
          {/* Encabezado */}
          <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
            <p className="text-lg font-bold">CAFETERIA GOSEN</p>
            <p className="text-xs text-gray-600">Desde 2024</p>
          </div>

          {/* Información del Recibo */}
          <div className="text-center border-b border-gray-300 pb-3 mb-4 text-xs">
            <p>Recibo: <span className="font-bold">{receiptNumber}</span></p>
            <p>{new Date().toLocaleDateString('es-CO')}</p>
            <p>{new Date().toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}</p>
            <p className="mt-2">Cliente: <span className="font-bold">{customerName || 'CLIENTE'}</span></p>
          </div>

          {/* Detalles de Productos */}
          <div className="border-b border-gray-300 pb-3 mb-4">
            <div className="flex justify-between text-xs font-bold pb-2 border-b border-dotted border-gray-300">
              <span>PRODUCTO</span>
              <span className="text-right">TOTAL</span>
            </div>
            
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1">
                  <div className="flex-1">
                    <p>{item.product.name}</p>
                    <p className="text-gray-600">{item.quantity}x {formatCOP(item.product.price)}</p>
                  </div>
                  <p className="font-semibold text-right whitespace-nowrap ml-2">
                    {formatCOP(item.product.price * item.quantity)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-xs py-1 text-gray-600">
                {itemCount} artículo(s)
              </div>
            )}
          </div>

          {/* Total sin IVA */}
          <div className="space-y-2 pb-4 mb-4 border-b-2 border-dashed border-gray-400">
            <div className="flex justify-between text-xl font-bold pt-2">
              <span>TOTAL:</span>
              <span className="text-blue-600">{formatCOP(total)}</span>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="text-center bg-gray-50 p-3 rounded border-2 border-gray-200 mb-4">
            <p className="text-xs text-gray-600 mb-1">METODO DE PAGO</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-lg text-gray-900">{paymentMethodLabel.label}</span>
            </div>
          </div>

          {/* Pie de Página */}
          <div className="text-center text-xs text-gray-600 border-t-2 border-dashed border-gray-400 pt-3">
            <p>COMPRA REALIZADA EXITOSAMENTE</p>
            <p className="mt-2">Gracias por tu compra</p>
            <p className="mt-1">Vuelve pronto!</p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={handlePrint}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition duration-200"
            >
              Imprimir
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition duration-200"
            >
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
