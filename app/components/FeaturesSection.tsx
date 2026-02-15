'use client';

import { Card } from '@/app/components/ui';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: '1',
    icon: '💰',
    title: 'Ventas Rápidas',
    description: 'Registra ventas al instante con una interfaz intuitiva. Soporta múltiples métodos de pago y genera recibos automáticamente.',
  },
  {
    id: '2',
    icon: '📝',
    title: 'Control de Fiados',
    description: 'Mantén un registro detallado de clientes con deuda. Recibe alertas de pagos pendientes y gestiona créditos fácilmente.',
  },
  {
    id: '3',
    icon: '📦',
    title: 'Gestión de Productos',
    description: 'Administra tu catálogo completo con imágenes, precios, costos e inventario. Actualiza en tiempo real desde cualquier dispositivo.',
  },
  {
    id: '4',
    icon: '📊',
    title: 'Reportes y Ganancias',
    description: 'Visualiza gráficos de ventas, márgenes de ganancia y análisis de productos. Descarga reportes en PDF o Excel.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Funcionalidades poderosas diseñadas para simplificar la gestión de tu cafetería.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.id}
              variant="elevated"
              padding="lg"
              className="flex flex-col items-start hover:shadow-soft-lg transition-shadow"
            >
              {/* Icono */}
              <div className="text-5xl mb-4">{feature.icon}</div>

              {/* Título */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Flecha accent */}
              <div className="mt-auto pt-4">
                <span className="text-blue-600 text-2xl">→</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

FeaturesSection.displayName = 'FeaturesSection';
