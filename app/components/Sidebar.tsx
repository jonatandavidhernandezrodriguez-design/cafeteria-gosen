'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: '💳',
      label: 'Nueva Venta',
      href: '/dashboard/sales',
    },
    {
      icon: '📦',
      label: 'Productos',
      href: '/dashboard/products',
    },
    {
      icon: '👥',
      label: 'Clientes',
      href: '/dashboard/customers',
    },
    {
      icon: '',
      label: 'Menú',
      href: '/dashboard/menu',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-soft overflow-y-auto z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">☕</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Cafetería</h1>
            <p className="text-xs text-blue-600 font-semibold">Gosen</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-soft-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          © 2026 Cafetería Gosen
        </p>
      </div>
    </aside>
  );
}
