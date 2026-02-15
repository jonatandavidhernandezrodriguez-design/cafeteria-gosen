'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SectionContainer } from '../components/ui/SectionContainer';

export default function CartPage() {
  const cartItems = []; // Aquí iría la lógica global del carrito

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <SectionContainer maxWidth="xl" padding="lg" className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coffee-900 mb-2">Tu Carrito</h1>
          <p className="text-coffee-600">Revisa y confirma tu pedido antes de continuar</p>
        </div>

        {cartItems.length === 0 ? (
          <Card variant="outlined" padding="lg" className="text-center py-12">
            <div className="mb-4 text-5xl">🛒</div>
            <h2 className="text-2xl font-bold text-coffee-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-coffee-600 mb-6">Visita nuestro menú para agregar productos deliciosos</p>
            <Button variant="primary" icon="☕">
              Ir al Menú
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Aquí irían los items */}
            </div>

            {/* Summary */}
            <div>
              <Card variant="elevated" padding="lg" className="sticky top-20">
                <h2 className="text-xl font-bold text-coffee-900 mb-4">Resumen</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-coffee-700">
                    <span>Subtotal</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-coffee-700">
                    <span>Envío</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-coffee-700">
                    <span>Impuestos</span>
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="border-t border-coffee-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-coffee-900">Total:</span>
                    <span className="text-2xl font-bold text-coffee-700">$0.00</span>
                  </div>
                  <Button variant="primary" size="lg" className="w-full" icon="💳">
                    Proceder al Pago
                  </Button>
                </div>
                <Button variant="outline" size="md" className="w-full">
                  Continuar Comprando
                </Button>
              </Card>
            </div>
          </div>
        )}
      </SectionContainer>

      <Footer />
    </div>
  );
}
