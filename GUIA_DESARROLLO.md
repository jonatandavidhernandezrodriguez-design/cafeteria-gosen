# 🚀 Guía Rápida de Desarrollo - Gosen Cafeteria

## ⚡ Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Verificar linting
npm run lint
```

Servidor en: **http://localhost:3000**

---

## 📂 Estructura de Carpetas

```
app/
├── components/
│   ├── ui/              # ⭐ Componentes base (reutilizables)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Container.tsx
│   │   ├── SectionContainer.tsx
│   │   └── index.ts     # Export único
│   ├── Header.tsx       # Navbar sticky moderno
│   ├── Footer.tsx       # Footer con info
│   └── MenuItem.tsx     # Card de producto
├── lib/
│   └── menu-data.ts     # Datos de ejemplo
├── types/
│   └── menu.ts          # Types TypeScript
├── admin/               # Dashboard admin
├── cart/                # Página de carrito
├── orders/              # Historial de pedidos
├── page.tsx             # Home principal
├── layout.tsx           # Layout global
└── globals.css          # Estilos globales
```

---

## 🎨 Colores Disponibles

Use estos colores en cualquier componente:

```tsx
className="bg-beige-100"     // #F5E6D3 (primario claro)
className="text-coffee-900"  // #32221A (texto principal)
className="border-beige-200" // Bordes suaves
className="text-sage-600"    // #5B9E5F (acento)
```

### Escala Completa
- `beige-50` a `beige-200` (claros)
- `coffee-50` a `coffee-900` (oscuros)
- `sage-50` a `sage-800` (verdes)

---

## 💡 Ejemplos de Uso

### Crear un Botón
```tsx
import { Button } from '@/components/ui';

// Básico
<Button>Haz click</Button>

// Con variante y tamaño
<Button variant="primary" size="lg">
  Agregar al Carrito
</Button>

// Con ícono
<Button icon="🛒" variant="secondary">
  Comprar
</Button>

// Deshabilitado o cargando
<Button disabled>Deshabilitado</Button>
<Button isLoading>Cargando...</Button>
```

**Variantes**: `primary` | `secondary` | `outline` | `ghost`  
**Tamaños**: `sm` | `md` | `lg`

---

### Crear una Card
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" padding="md">
  <h3 className="text-lg font-bold">Título</h3>
  <p className="text-coffee-600">Contenido aquí</p>
</Card>
```

**Variantes**: `default` | `elevated` | `outlined`  
**Padding**: `none` | `sm` | `md` | `lg`

---

### Crear un Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Completado</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="error">Error</Badge>
```

**Variantes**: `default` | `success` | `warning` | `error` | `info`

---

### Estructura de Página
```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SectionContainer, Card, Button } from '@/components/ui';

export default function NewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <SectionContainer maxWidth="xl" padding="lg" className="flex-1">
        <h1 className="text-4xl font-bold text-coffee-900">Mi Página</h1>
        
        <Card variant="elevated" padding="md" className="mt-6">
          <p>Contenido principal</p>
        </Card>
        
        <Button variant="primary" className="mt-4">
          Acciona
        </Button>
      </SectionContainer>
      
      <Footer />
    </div>
  );
}
```

---

## 🎯 Tailwind CSS Tips

### Usar la Paleta Personalizada
```tsx
// Funciona directamente con los colores definidos
<div className="bg-beige-100 text-coffee-900 border border-beige-200">
  Contenido con colores de marca
</div>
```

### Sombras Suaves
```tsx
className="shadow-soft"      // Suave (2px 8px)
className="shadow-soft-md"   // Media (4px 12px)
className="shadow-soft-lg"   // Grande (8px 24px)
```

### Responsive
```tsx
// Mobile primero
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Ocultar/Mostrar
className="hidden md:flex"    // Oculto en móvil
className="md:hidden"         // Solo móvil
```

---

## 📱 Mobile First

Siempre piensa mobile primero:

```tsx
// ❌ Incorrecto
className="flex flex-col md:flex-row" // Desktop primero

// ✅ Correcto
className="flex flex-col md:flex-row"
// Esto es mobile por defecto, cambia en md
```

---

## 🔧 Agregar Nuevos Colores

Edita `tailwind.config.ts`:

```tsx
colors: {
  // ... colores existentes
  custom: {
    50: '#F0F0F0',
    100: '#E0E0E0',
    // ...
  }
}
```

Luego úsalos:
```tsx
className="bg-custom-100 text-custom-900"
```

---

## 📝 Agregar Nueva Página

1. Crea carpeta: `app/nueva-seccion/`
2. Crea archivo: `page.tsx`
3. Copia estructura base:

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SectionContainer, Button, Card } from '@/components/ui';

export default function NewSectionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <SectionContainer maxWidth="xl" padding="lg" className="flex-1">
        <h1 className="text-4xl font-bold text-coffee-900">Nueva Sección</h1>
        {/* Tu contenido aquí */}
      </SectionContainer>
      
      <Footer />
    </div>
  );
}
```

4. El navbar se actualizará automáticamente con la ruta

---

## 🎨 Crear Nuevo Componente UI

1. Crea `app/components/ui/MyComponent.tsx`:

```tsx
import React from 'react';

interface MyComponentProps {
  children: React.ReactNode;
  className?: string;
}

export function MyComponent({
  children,
  className = '',
}: MyComponentProps) {
  return (
    <div className={`text-coffee-900 ${className}`}>
      {children}
    </div>
  );
}

MyComponent.displayName = 'MyComponent';
```

2. Exporta en `app/components/ui/index.ts`:

```tsx
export { MyComponent } from './MyComponent';
```

3. Úsalo en cualquier lado:

```tsx
import { MyComponent } from '@/components/ui';

<MyComponent>Contenido</MyComponent>
```

---

## 🧪 Testing (Próximo Paso)

Instala testing tools:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

Crea test de componente:
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 🚀 Deploy en Vercel

```bash
# Vercel reconoce Next.js automáticamente
npm run build  # Verifica builds localmente

# Push a GitHub
git add .
git commit -m "Mejoras UI/UX Gosen Cafeteria"
git push origin main

# Vercel se deployará automáticamente
```

---

## 📊 Mejores Prácticas

✅ **DO**
- Usar componentes UI para consistencia
- Paleta de colores de marca
- Mobile-first sempre
- TypeScript completo
- Componentes pequeños y reutilizables

❌ **DON'T**
- CSS suelto (usa Tailwind)
- Colores hardcoded
- Desktop-first
- Ignorar tipos
- Componentes gigantes

---

## 🐛 Debugging

### Ver colores disponibles
```bash
# En navegador, abre DevTools
# Usa autocomplete de Tailwind para ver valores
```

### TypeScript errors
```bash
npm run build  # Muestra todos los errores de tipo
```

### Performance
```bash
npm run build  # Verifica tamaño del bundle
```

---

## 💾 Guardar Cambios

```bash
git add .
git commit -m "Descripción clara del cambio"
git push
```

**Mensajes útiles de commit**:
```
feat: Agregar nuevo componente Modal
fix: Corregir spacing en Card
refactor: Simplificar Button props
style: Actualizar paleta de colores
```

---

## 🎉 Útil

- **Tailwind Docs**: https://tailwindcss.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Colores Tailwind**: https://tailwindcss.com/docs/customizing-colors

---

## 📞 Soporte

Si tienes dudas:
1. Revisa este archivo
2. Consulta ejemplos en página existente
3. Verifica tailwind.config.ts para colores
4. Lee el README.md principal

---

**¡Feliz desarrollo! 🚀** ☕✨
