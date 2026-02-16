'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer, Card } from '@/app/components/ui';
import { getSales } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import ReceiptModal from '@/app/components/ReceiptModal';
import { exportSalesToPDF } from '@/app/lib/pdf-export';

interface SaleItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  subtotal: number;
}

interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  iva: number;
  total: number;
  profit?: number;
  paymentMethod: 'cash' | 'nequi';
  customerName?: string;
  status: 'completed';
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const fetchedSales = await getSales();
        setSales(fetchedSales.reverse());
      } catch (error) {
        console.error('Error loading sales:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setSelectedSale(null);
  };

  const handleExportPDF = () => {
    if (sales.length === 0) {
      alert('No hay ventas para exportar');
      return;
    }
    exportSalesToPDF(sales, `ventas-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportCSV = () => {
    if (sales.length === 0) {
      alert('No hay ventas para exportar');
      return;
    }

    // Create CSV header
    const headers = ['Fecha', 'Hora', 'Cliente', 'Metodo Pago', 'Items', 'Ganancia', 'Total'];
    
    // Create CSV rows
    const rows = sales.map(sale => {
      const date = new Date(sale.date);
      const dateStr = date.toLocaleDateString('es-CO');
      const timeStr = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const itemCount = sale.items.reduce((sum, item) => sum + item.quantity, 0);
      const profit = sale.profit ?? 0;
      
      return [
        dateStr,
        timeStr,
        sale.customerName || 'Sin nombre',
        sale.paymentMethod === 'cash' ? 'Efectivo' : 'Nequi',
        itemCount,
        profit.toString(),
        sale.total.toString(),
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ventas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <PageContainer
        title="Historial de Ventas"
        description="Consulta todas las ventas realizadas"
      >
        <div className="text-center py-12">
          <p>Cargando...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Historial de Ventas"
      description="Consulta todas las ventas realizadas y sus detalles"
    >
      {sales.length === 0 ? (
        <Card variant="elevated" padding="lg" className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin ventas registradas
          </h3>
          <p className="text-gray-600">
            Las ventas aparecerán aquí cuando procesés nuevas transacciones
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card variant="elevated" padding="md">
              <p className="text-sm text-gray-600">Total de Ventas</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCOP(sales.reduce((sum, s) => sum + s.total, 0))}
              </p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-sm text-gray-600">Total de Ganancias</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCOP(sales.reduce((sum, s) => sum + (s.profit ?? 0), 0))}
              </p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-sm text-gray-600">Transacciones</p>
              <p className="text-2xl font-bold text-purple-600">{sales.length}</p>
            </Card>
          </div>

          <div className="mb-6 flex gap-3">
            <button
              onClick={handleExportCSV}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition duration-200 inline-flex items-center gap-2"
            >
              📊 Descargar CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition duration-200 inline-flex items-center gap-2"
            >
              📄 Descargar PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Artículos
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">
                    Ganancia
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(sale.date).toLocaleDateString('es-CO')}
                      <br />
                      <span className="text-xs text-gray-600">
                        {new Date(sale.date).toLocaleTimeString('es-CO')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {sale.customerName || 'Sin nombre'}
                      <br />
                      <span className="text-xs text-gray-600">
                        {sale.paymentMethod === 'cash' ? '💵 Efectivo' : '📱 Nequi'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)} artículos
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                      {formatCOP(sale.profit ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                      {formatCOP(sale.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewReceipt(sale)}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                      >
                        📄 Ver Factura
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSale && (
        <ReceiptModal
          isOpen={showReceipt}
          total={selectedSale.total}
          paymentMethod={selectedSale.paymentMethod}
          customerName={selectedSale.customerName || 'Cliente'}
          itemCount={selectedSale.items.reduce((sum, item) => sum + item.quantity, 0)}
          items={selectedSale.items.map((item) => ({
            product: {
              name: item.name,
              price: item.price,
            },
            quantity: item.quantity,
          }))}
          onClose={handleCloseReceipt}
        />
      )}
    </PageContainer>
  );
}
