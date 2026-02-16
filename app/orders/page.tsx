'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { SectionContainer } from '../components/ui/SectionContainer';
import { useState, useEffect } from 'react';
import { getSales } from '@/app/lib/store';

interface Sale {
  id: string;
  date: string;
  total: number;
  items: any[];
  status?: 'pending' | 'preparing' | 'ready' | 'completed';
}

export default function OrdersPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const allSales = await getSales();
        // Ordenar por fecha descendente (más recientes primero)
        const sorted = allSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSales(sorted);
      } catch (error) {
        console.error('Error loading sales:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSales();
    
    // Recargar cada 2 segundos
    const interval = setInterval(loadSales, 2000);
    
    // Listener para cambios en localStorage
    const handleStorageChange = () => {
      loadSales();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const statusConfig = {
    pending: { label: 'Pendiente', variant: 'warning' as const },
    preparing: { label: 'Preparando', variant: 'info' as const },
    ready: { label: 'Listo', variant: 'success' as const },
    completed: { label: 'Completado', variant: 'success' as const },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <SectionContainer maxWidth="xl" padding="lg" className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coffee-900 mb-2">Mis Pedidos</h1>
          <p className="text-coffee-600">Historial de tus pedidos y seguimiento</p>
        </div>

        {isLoading ? (
          <Card variant="outlined" padding="lg" className="text-center py-12">
            <p className="text-coffee-600">Cargando pedidos...</p>
          </Card>
        ) : sales.length === 0 ? (
          <Card variant="outlined" padding="lg" className="text-center py-12">
            <div className="mb-4 text-5xl">📋</div>
            <h2 className="text-2xl font-bold text-coffee-900 mb-2">No tienes pedidos aún</h2>
            <p className="text-coffee-600">Crea tu primer pedido visitando nuestro menú</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sales.map((order) => (
              <Card key={order.id} variant="elevated" padding="md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Order Info */}
                  <div>
                    <p className="text-sm text-coffee-600 mb-1">Pedido</p>
                    <p className="font-bold text-lg text-coffee-900">#{order.id}</p>
                    <p className="text-xs text-coffee-600 mt-1">
                      {new Date(order.date).toLocaleDateString('es-CO')}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-sm text-coffee-600 mb-1">Artículos</p>
                    <p className="font-bold text-coffee-900">
                      {order.items?.length ?? 0} items
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm text-coffee-600 mb-1">Total</p>
                    <p className="font-bold text-lg text-coffee-700">
                      ${order.total?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-col gap-2 md:items-end">
                    <Badge 
                      variant={statusConfig[order.status as keyof typeof statusConfig]?.variant || 'success'}
                    >
                      {statusConfig[order.status as keyof typeof statusConfig]?.label || 'Completado'}
                    </Badge>
                    <button className="text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors">
                      Ver detalles →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </SectionContainer>

      <Footer />
    </div>
  );
}
