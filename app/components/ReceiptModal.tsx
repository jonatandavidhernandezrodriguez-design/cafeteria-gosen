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
      const printWindow = window.open('', '', 'width=450,height=700');
      if (printWindow) {
        const html = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <title>Factura ${receiptNumber}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Courier New', monospace; 
                background: white; 
                padding: 8px;
                width: 80mm;
                margin: 0 auto;
                color: #000;
              }
              .receipt { 
                width: 100%; 
                text-align: center; 
                font-size: 11px;
              }
              .header { 
                border-bottom: 2px solid #000; 
                padding: 8px 0;
                margin-bottom: 8px; 
              }
              .title { 
                font-size: 16px; 
                font-weight: bold; 
                margin-bottom: 4px; 
              }
              .subtitle { 
                font-size: 10px; 
                color: #000; 
              }
              .info { 
                font-size: 8px; 
                border-bottom: 1px solid #000; 
                padding: 8px 0;
                margin-bottom: 8px; 
              }
              .info-line { margin-bottom: 3px; }
              .table-header {
                font-size: 8px;
                font-weight: bold;
                display: grid;
                grid-template-columns: 1fr 60px 60px;
                gap: 4px;
                border-bottom: 1px dotted #000;
                padding-bottom: 4px;
                margin-bottom: 6px;
              }
              .table-header span:last-child,
              .item-price { text-align: right; }
              .items { 
                text-align: left;
                border-bottom: 1px solid #000; 
                padding-bottom: 8px; 
                margin-bottom: 8px; 
              }
              .item { 
                font-size: 8px; 
                margin-bottom: 8px;
                border-bottom: 0.5px dotted #ccc;
                padding-bottom: 4px;
              }
              .item:last-child {
                border-bottom: none;
              }
              .item-name { 
                font-weight: bold;
                margin-bottom: 3px;
                word-wrap: break-word;
              }
              .item-detail { 
                font-size: 7px; 
                color: #333;
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 4px;
              }
              .item-qty { text-align: left; }
              .item-unit { text-align: center; }
              .item-subtotal { text-align: right; }
              .subtotal {
                font-size: 8px;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 8px;
                margin-bottom: 8px;
                padding-bottom: 6px;
                border-bottom: 0.5px solid #000;
              }
              .total { 
                font-size: 14px; 
                font-weight: bold; 
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 8px;
                margin-bottom: 10px;
                align-items: center;
              }
              .payment-section {
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                padding: 8px 0;
                margin: 8px 0;
              }
              .payment-label { 
                font-size: 8px; 
                font-weight: bold; 
                margin-bottom: 4px;
              }
              .payment-method { 
                font-size: 10px; 
                font-weight: bold;
              }
              .footer { 
                font-size: 8px;
                padding-top: 8px;
              }
              .footer-line { margin-bottom: 4px; }
              .footer-line.bold { font-weight: bold; }
              @media print { 
                body { padding: 0; width: 80mm; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="title">CAFETERIA GOSEN</div>
                <div class="subtitle">Desde 2024</div>
              </div>
              
              <div class="info">
                <div class="info-line">Recibo: <strong>${receiptNumber}</strong></div>
                <div class="info-line">${new Date().toLocaleDateString('es-CO')}</div>
                <div class="info-line">${new Date().toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</div>
                <div class="info-line" style="margin-top: 3px;">Cliente: <strong>${customerName || 'CLIENTE'}</strong></div>
              </div>
              
              <div class="table-header">
                <span>PRODUCTO</span>
                <span>CANT</span>
                <span>TOTAL</span>
              </div>
              
              <div class="items">
                ${items.map((item) => `
                  <div class="item">
                    <div class="item-name">${item.product.name}</div>
                    <div class="item-detail">
                      <span class="item-qty">${item.quantity}x</span>
                      <span class="item-unit">$${item.product.price.toLocaleString('es-CO')}</span>
                      <span class="item-subtotal">$${(item.product.price * item.quantity).toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="subtotal">
                <span>SUBTOTAL:</span>
                <span>$${total.toLocaleString('es-CO')}</span>
              </div>
              
              <div class="total">
                <span>TOTAL:</span>
                <span></span>
                <span>$${total.toLocaleString('es-CO')}</span>
              </div>
              
              <div class="payment-section">
                <div class="payment-label">METODO DE PAGO</div>
                <div class="payment-method">${paymentMethodLabel.label}</div>
              </div>
              
              <div class="footer">
                <div class="footer-line bold">COMPRA REALIZADA</div>
                <div class="footer-line">De forma exitosa</div>
                <div style="margin-top: 6px;">Gracias por tu compra</div>
                <div>Vuelve pronto!</div>
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
