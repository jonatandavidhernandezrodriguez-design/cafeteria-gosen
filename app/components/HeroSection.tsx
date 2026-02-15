'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui';
import { useState } from 'react';

export function HeroSection() {
  const [logoLoaded, setLogoLoaded] = useState(false);
  return (
    <section className="min-h-[80vh] bg-white py-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contenido izquierdo */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              Sistema de gestión para <span className="text-blue-600">Cafetería Gosen</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Controla ventas, fiados, productos y ganancias en un solo lugar. 
              Todo lo que necesitas para administrar tu cafetería de forma eficiente.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/dashboard/products">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full sm:w-auto hover:scale-105 transition-transform duration-300"
                >
                  Empezar
                </Button>
              </Link>
              <Link href="#features">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                >
                  Ver funciones
                </Button>
              </Link>
            </div>
          </div>

          {/* Mockup derecha */}
          <div className="hidden md:flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300" />
              
              {/* Imagen del logo ocupando todo el recuadro */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                {!logoLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-8xl">
                    ☕
                  </div>
                )}
                <Image
                  src="/Logo.jpeg"
                  alt="Logo Cafetería Gosen"
                  fill
                  className="object-contain"
                  priority
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

HeroSection.displayName = 'HeroSection';
