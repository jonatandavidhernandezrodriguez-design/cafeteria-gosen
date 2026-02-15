'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from './ui/Container';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Menú', icon: '☕' },
    { href: '/cart', label: 'Carrito', icon: '🛒' },
    { href: '/orders', label: 'Pedidos', icon: '📋' },
    { href: '/dashboard/products', label: 'Productos', icon: '📦' },
    { href: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-soft">
      <Container className="flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
        >
          <span className="text-3xl">☕</span>
          <span className="hidden sm:inline">Cafetería</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>
      </Container>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-gray-50">
          <Container className="flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
