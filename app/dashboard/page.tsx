'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer, Button, Card } from '@/app/components/ui';
import Link from 'next/link';
import { getTodayRevenue, getTodayProfit, getTodayItemsSold, getSales } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import { obtenerClaveValida } from '@/app/lib/auth-utils';
import { exportStatisticsToPDF, exportStatisticsToExcel } from '@/app/lib/export-utils';
import PINVerification from '@/app/components/PINVerification';
import { useProducts } from '@/app/lib/useProducts';

export default function DashboardHome() {
  const { products } = useProducts();
  const [showStats, setShowStats] = useState(true);
  const [showPINModal, setShowPINModal] = useState(false);
  const [isPINVerified, setIsPINVerified] = useState(false);
  
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [itemsSold, setItemsSold] = useState(0);

  useEffect(() => {
    // Verificar si ya hay una clave válida desde localStorage
    const pinValido = obtenerClaveValida();
    setIsPINVerified(pinValido);
    setShowPINModal(!pinValido);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rev, prof, itemsSoldVal] = await Promise.all([
          getTodayRevenue(),
          getTodayProfit(),
          getTodayItemsSold(),
        ]);
        setRevenue(rev);
        setProfit(prof);
        setItemsSold(itemsSoldVal);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    // Cargar datos al montar
    loadData();
    
    // Recargar cada 3 segundos
    const interval = setInterval(loadData, 3000);
    
    // Listener para cambios en localStorage
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const todaySales = {
    count: 24,
    revenue: revenue,
    profit: profit,
    itemsSold: itemsSold,
    pendingDebt: 0,
  };

  // Calcular productos con stock bajo
  const lowStockProducts = products.filter(p => (p.stock ?? 0) <= 5);

  const handleExportStats = (format: 'pdf' | 'excel') => {
    if (!isPINVerified) {
      setShowPINModal(true);
      return;
    }

    const stats = {
      revenue: revenue,
      profit: profit,
      itemsSold: itemsSold,
      creditPending: 0,
      totalTransactions: 24,
      date: new Date().toLocaleDateString('es-CO'),
    };

    try {
      if (format === 'pdf') {
        exportStatisticsToPDF(stats);
      } else if (format === 'excel') {
        exportStatisticsToExcel(stats);
      }
    } catch (error) {
      console.error('Error exporting stats:', error);
      alert(`❌ Error al exportar: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  const handlePINSuccess = () => {
    setIsPINVerified(true);
    setShowPINModal(false);
  };

  return (
    <PageContainer
      title="Dashboard"
      description="Bienvenido a Cafetería Gosen - Panel de control"
    >
      {!isPINVerified ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      ) : (
      <>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ventas de Hoy */}
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                Ventas de Hoy
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCOP(todaySales.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {todaySales.count} transacciones
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </Card>

        {/* Ganancia de Hoy */}
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                Ganancia Neta
              </p>
              <p className="text-3xl font-bold text-green-600">
                {formatCOP(todaySales.profit)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {((todaySales.profit / todaySales.revenue) * 100).toFixed(0)}% margen
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </Card>

        {/* Productos Vendidos */}
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                Productos Vendidos
              </p>
              <p className="text-3xl font-bold text-primary-600">
                {todaySales.itemsSold}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                unidades hoy
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </Card>
      </div>

      {/* Botones de Exportación */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-900">Exportar Estadísticas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExportStats('pdf')}
              className="flex items-center justify-center gap-2"
            >
              📄 Estadísticas PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportStats('excel')}
              className="flex items-center justify-center gap-2"
            >
              📊 Estadísticas Excel
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Nueva Venta */}
        <Link href="/dashboard/sales" className="block">
          <Card variant="elevated" padding="lg" className="h-full hover:shadow-soft-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <span className="text-3xl">💳</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Nueva Venta</h3>
                <p className="text-sm text-gray-600">Procesar una nueva venta</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Card>
        </Link>

        {/* Gestionar Productos */}
        <Link href="/dashboard/products" className="block">
          <Card variant="elevated" padding="lg" className="h-full hover:shadow-soft-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
                <p className="text-sm text-gray-600">Gestional catálogo</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Productos con Stock Bajo</h3>
              <p className="text-sm text-gray-600">
                {lowStockProducts.length} producto(s) necesitan reabastecimiento
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock} unidades</p>
                </div>
                <Link href={`/dashboard/products/${product.id}/edit`}>
                  <Button variant="primary" size="sm">
                    Editar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}
      </>
      )}

      {/* PIN Verification Modal */}
      <PINVerification
        isOpen={showPINModal}
        title="Acceso Restringido"
        description="Ingresa el PIN administrativo para acceder al Dashboard"
        onSuccess={handlePINSuccess}
        onCancel={() => {
          setShowPINModal(false);
          window.history.back();
        }}
      />
    </PageContainer>
  );
}
