'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui';

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 shadow-soft animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-blue-600 leading-tight">Cafetería</span>
            <span className="text-xs font-semibold text-gray-600 leading-tight">Gosen</span>
          </div>
        </Link>

        {/* Links + Button */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/dashboard/products" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Productos
            </Link>
            <Link 
              href="/dashboard/menu" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Menú
            </Link>
          </div>

          <Link href="/dashboard/products">
            <Button variant="primary" size="md">
              Entrar al sistema
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

LandingNavbar.displayName = 'LandingNavbar';

