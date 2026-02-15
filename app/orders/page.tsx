'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { SectionContainer } from '../components/ui/SectionContainer';

interface OrderItem {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total: number;
  items: number;
}

export default function OrdersPage() {
  const orders: OrderItem[] = [
    {
      id: '001',
      date: '2025-02-11',
      status: 'completed',
      total: 25.50,
      items: 3,
    },
    {
      id: '002',
      date: '2025-02-10',
      status: 'ready',
      total: 18.99,
      items: 2,
    },
    {
      id: '003',
      date: '2025-02-09',
      status: 'preparing',
      total: 32.45,
      items: 4,
    },
  ];

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

        {orders.length === 0 ? (
          <Card variant="outlined" padding="lg" className="text-center py-12">
            <div className="mb-4 text-5xl">📋</div>
            <h2 className="text-2xl font-bold text-coffee-900 mb-2">No tienes pedidos aún</h2>
            <p className="text-coffee-600">Crea tu primer pedido visitando nuestro menú</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} variant="elevated" padding="md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Order Info */}
                  <div>
                    <p className="text-sm text-coffee-600 mb-1">Pedido</p>
                    <p className="font-bold text-lg text-coffee-900">#{order.id}</p>
                    <p className="text-xs text-coffee-600 mt-1">{order.date}</p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-sm text-coffee-600 mb-1">Artículos</p>
                    <p className="font-bold text-coffee-900">{order.items} items</p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm text-coffee-600 mb-1">Total</p>
                    <p className="font-bold text-lg text-coffee-700">${order.total.toFixed(2)}</p>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-col gap-2 md:items-end">
                    <Badge variant={statusConfig[order.status].variant}>
                      {statusConfig[order.status].label}
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
