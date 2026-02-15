'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SectionContainer } from '../components/ui/SectionContainer';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  trend?: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  time: string;
}

export default function AdminPage() {
  const stats: StatItem[] = [
    { label: 'Pedidos Hoy', value: '24', icon: '📋', trend: '+12%' },
    { label: 'Ingresos', value: '$1,250', icon: '💰', trend: '+8%' },
    { label: 'Productos', value: '8', icon: '☕', trend: 'Activos' },
    { label: 'Clientes', value: '156', icon: '👥', trend: '+24' },
  ];

  const recentOrders: RecentOrder[] = [
    { id: '001', customer: 'Juan Pérez', amount: 25.50, status: 'completed', time: 'hace 15 min' },
    { id: '002', customer: 'María García', amount: 18.99, status: 'ready', time: 'hace 32 min' },
    { id: '003', customer: 'Carlos López', amount: 32.45, status: 'preparing', time: 'hace 5 min' },
    { id: '004', customer: 'Ana Martínez', amount: 15.75, status: 'pending', time: 'hace 2 min' },
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coffee-900 mb-2">Panel Administrativo</h1>
          <p className="text-coffee-600">Gestiona tu cafetería y visualiza las estadísticas clave</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated" padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-coffee-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-coffee-900">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-xs text-sage-600 mt-2">
                      {stat.trend}
                    </p>
                  )}
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-coffee-900">Pedidos Recientes</h2>
            <Button variant="outline" size="sm" icon="🔄">
              Actualizar
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-beige-200">
                  <th className="text-left py-3 px-2 font-bold text-coffee-900">ID</th>
                  <th className="text-left py-3 px-2 font-bold text-coffee-900">Cliente</th>
                  <th className="text-left py-3 px-2 font-bold text-coffee-900">Monto</th>
                  <th className="text-left py-3 px-2 font-bold text-coffee-900">Estado</th>
                  <th className="text-left py-3 px-2 font-bold text-coffee-900">Tiempo</th>
                  <th className="text-left py-3 px-2 font-bold text-coffee-900">Acción</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`border-b border-beige-100 hover:bg-beige-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-beige-50'
                    }`}
                  >
                    <td className="py-3 px-2 font-semibold text-coffee-900">#{order.id}</td>
                    <td className="py-3 px-2 text-coffee-700">{order.customer}</td>
                    <td className="py-3 px-2 font-bold text-coffee-700">${order.amount.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <Badge variant={statusConfig[order.status].variant} size="sm">
                        {statusConfig[order.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-coffee-600">{order.time}</td>
                    <td className="py-3 px-2">
                      <button className="text-sage-600 hover:text-sage-700 font-medium text-sm transition-colors">
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </SectionContainer>

      <Footer />
    </div>
  );
}
