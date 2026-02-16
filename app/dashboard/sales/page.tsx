'use client';

import React, { useState } from 'react';
import { PageContainer, Button, Card, Input } from '@/app/components/ui';
import { Product } from '@/app/types/menu';
import Image from 'next/image';
import { addSale, updateProductStock, recordProductSale, getOrCreateCustomer } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import ReceiptModal from '@/app/components/ReceiptModal';
import { useProducts } from '@/app/lib/useProducts';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Receipt {
  isOpen: boolean;
  total: number;
  paymentMethod: 'cash' | 'nequi';
  customerName: string;
  itemCount: number;
  items: CartItem[];
}

export default function SalesPage() {
  const { products } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'nequi'>('cash');
  const [receipt, setReceipt] = useState<Receipt>({
    isOpen: false,
    total: 0,
    paymentMethod: 'cash',
    customerName: '',
    itemCount: 0,
    items: [],
  });

  const filteredProducts = products.filter(
    (p) =>
      p.isActive &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = async (product: Product) => {
    const availableStock = product.stock ?? 0;
    
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const currentQuantityInCart = existing?.quantity ?? 0;
      
      if (currentQuantityInCart >= availableStock) {
        alert(`❌ No hay suficiente stock. Disponible: ${availableStock}`);
        return prev;
      }
      
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const prod = products.find((p) => p.id === productId);
      const availableStock = prod?.stock ?? 0;

      if (quantity > availableStock) {
        alert(`❌ No hay suficiente stock. Disponible: ${availableStock}`);
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalCost = cart.reduce(
    (sum, item) => sum + item.product.cost * item.quantity,
    0
  );

  const profit = totalPrice - totalCost;

  const completeSale = async () => {
    if (cart.length === 0) {
      alert('❌ Agrega productos al carrito');
      return;
    }

    if (!customerName.trim()) {
      alert('❌ Debes seleccionar un cliente antes de finalizar la venta');
      return;
    }

    // Crear objeto de venta
    const saleItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      cost: item.product.cost,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    // Descontar stock y registrar venta de productos
    let stockError = false;
    for (const item of cart) {
      const stockUpdated = await updateProductStock(item.product.id, item.quantity);
      if (!stockUpdated) {
        stockError = true;
        break;
      }
      await recordProductSale(item.product.id, item.quantity, item.product.price);
    }

    if (stockError) {
      alert('⚠️ Algunos productos no tienen stock suficiente');
      return;
    }

    // Crear/actualizar cliente
    const customer = await getOrCreateCustomer(customerName, undefined);

    // Calcular subtotal, IVA (19%), y ganancia
    const ivaAmount = parseFloat((totalPrice * 0.19).toFixed(2));
    const subtotalAmount = parseFloat((totalPrice - ivaAmount).toFixed(2));
    const profitAmount = parseFloat(profit.toFixed(2));

    // Guardar venta
    const sale = await addSale({
      items: saleItems,
      subtotal: subtotalAmount,
      iva: ivaAmount,
      total: totalPrice,
      profit: profitAmount,
      customerName: customerName || undefined,
      paymentMethod: paymentMethod,
      status: 'completed',
    });

    // Mostrar recibo modal
    setReceipt({
      isOpen: true,
      total: totalPrice,
      paymentMethod: paymentMethod,
      customerName: customerName,
      itemCount: cart.length,
      items: cart,
    });
  };

  const closeReceipt = () => {
    // Los productos se sincronizan automáticamente desde localStorage via el hook useProducts
    
    // Limpiar carrito y formulario
    setCart([]);
    setCustomerName('');
    setPaymentMethod('cash');
    setSearchTerm('');
    
    // Cerrar recibo
    setReceipt({
      isOpen: false,
      total: 0,
      paymentMethod: 'cash',
      customerName: '',
      itemCount: 0,
      items: [],
    });
  };

  return (
    <PageContainer
      title="Nueva Venta"
      description="Sistema POS - Procesar ventas y fiados"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos */}
        <div className="lg:col-span-2">
          {/* Búsqueda */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <Input
              label="Buscar Producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe el nombre del producto..."
            />
          </Card>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const stock = product.stock ?? 0;
              const inCartQty = cart.find((i) => i.product.id === product.id)?.quantity ?? 0;
              const canAdd = stock > inCartQty;

              return (
                <Card
                  key={product.id}
                  variant="elevated"
                  padding="md"
                  className={`hover:shadow-soft-lg transition-shadow ${canAdd ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                  onClick={() => canAdd && addToCart(product)}
                >
                  <div className="flex gap-3">
                    {/* Imagen */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-300 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-xs font-semibold">
                          <div className="w-full h-full bg-gray-200"></div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {product.name}
                      </h4>
                      <p className="text-xl font-bold text-primary-600 mt-1">
                        {formatCOP(product.price)}
                      </p>
                      <p className={`text-xs mt-1 font-semibold ${
                        stock <= 5 ? 'text-red-600' :
                        stock <= 10 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        Stock: {stock}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Carrito */}
        <div>
          <Card variant="elevated" padding="lg" className="sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Carrito de Ventas
            </h3>

            {/* Cliente */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cliente <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tipo de Pago */}
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Método de Pago
              </label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">💵 Efectivo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === 'nequi'}
                    onChange={() => setPaymentMethod('nequi')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">📱 Nequi</span>
                </label>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto border-t border-b border-gray-200 py-3">
              {cart.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">
                  Vacío - Selecciona productos
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-primary-600">
                        {formatCOP(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded bg-green-100 text-green-600 text-xs font-bold hover:bg-green-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-2 text-gray-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Totales */}
            <div className="space-y-2 mb-6 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {formatCOP(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ganancia:</span>
                <span className="font-semibold text-green-600">
                  {formatCOP(profit)}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-primary-600 text-3xl">
                  {formatCOP(totalPrice)}
                </span>
              </div>
            </div>

            {/* Botón Confirmar Pago */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={completeSale}
                disabled={cart.length === 0}
              >
                ✅ Confirmar Pago
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
              >
                🙅 Limpiar Carrito
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={receipt.isOpen}
        total={receipt.total}
        paymentMethod={receipt.paymentMethod}
        customerName={receipt.customerName}
        itemCount={receipt.itemCount}
        items={receipt.items}
        onClose={closeReceipt}
      />
    </PageContainer>
  );
}
