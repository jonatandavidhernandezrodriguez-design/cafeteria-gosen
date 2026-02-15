# ☕ Gosen Cafeteria - Plataforma Web Moderna

Una moderna y elegante plataforma web para **Gosen Cafeteria**, construida con **Next.js 15**, **TypeScript** y **Tailwind CSS**. Diseñada con un enfoque minimalista, moderno y warmth perfecto para una cafetería dentro de una iglesia.

## 🎯 Características Principales

- ✨ **Menú Digital Moderno**: Catálogo elegante con filtrado por categoría
- 🛒 **Sistema de Carrito**: Gestión intuitiva de pedidos con carrito flotante sticky
- 📋 **Historial de Pedidos**: Seguimiento completo del estado de tus pedidos
- ⚙️ **Panel Administrativo**: Dashboard completo con estadísticas y gestión de órdenes
- 📱 **Mobile First**: Totalmente responsive y optimizado para todos los dispositivos
- 🎨 **Diseño Minimalista**: UI/UX limpio y moderno con mucho espacio en blanco
- ♿ **Accesible**: Cumple con estándares básicos de accesibilidad (aria-labels, contraste)

## 🎨 Paleta de Colores Personalizada

**Gosen Cafeteria** utiliza una paleta de colores cálida y amigable:

- **Beige/Crema**: #F5E6D3 - Color primario, transmite calidez
- **Marrón Café**: #6B4F3A - Color de acentuación fuerte
- **Verde Suave**: #7BAE7F - Color de acento secundario
- **Blanco**: Fondo principal para máxima claridad
- **Tonos neutros**: Para tipografía y elementos secundarios

## 📁 Estructura del Proyecto Mejorada

```
app/
├── components/
│   ├── ui/                    # Componentes base reutilizables
│   │   ├── Button.tsx         # Botones con múltiples variantes
│   │   ├── Card.tsx           # Tarjetas con estilos consistentes
│   │   ├── Badge.tsx          # Insignias/etiquetas
│   │   ├── Container.tsx      # Contenedor con ancho máximo
│   │   ├── SectionContainer.tsx # Sección con padding y max-width
│   │   └── index.ts           # Export único para importaciones limpias
│   ├── Header.tsx             # Navbar moderno y sticky con mobile menu
│   ├── Footer.tsx             # Footer mejorado con información completa
│   └── MenuItem.tsx           # Card de producto refactorizado
├── lib/
│   └── menu-data.ts           # Datos de ejemplo del menú
├── types/
│   └── menu.ts                # Tipos TypeScript
├── admin/
│   └── page.tsx               # Dashboard administrativo mejorado
├── cart/
│   └── page.tsx               # Página de carrito refactorizada
├── orders/
│   └── page.tsx               # Historial de pedidos mejorado
├── layout.tsx                 # Layout con fuentes Inter y Poppins
├── page.tsx                   # Página de inicio con hero section
└── globals.css                # Estilos globales
```

## 🎨 Componentes UI Reutilizables

### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" icon="➕">
  Agregar al Carrito
</Button>
```

**Variantes**: `primary` | `secondary` | `outline` | `ghost`  
**Tamaños**: `sm` | `md` | `lg`

### Card
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" padding="md">
  Contenido de la tarjeta
</Card>
```

**Variantes**: `default` | `elevated` | `outlined`  
**Padding**: `none` | `sm` | `md` | `lg`

### Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Completado</Badge>
```

**Variantes**: `default` | `success` | `warning` | `error` | `info`

### Container & SectionContainer
```tsx
import { Container, SectionContainer } from '@/components/ui';

<SectionContainer maxWidth="xl" padding="lg">
  Contenido centrado
</SectionContainer>
```

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Stack Tecnológico

- **Next.js 15**: Framework React moderno con App Router
- **React 18+**: Librería UI
- **TypeScript**: Tipado estático completo
- **Tailwind CSS v4**: Utilidades CSS con configuración personalizada
- **Inter & Poppins**: Tipografías modernas de Google Fonts
- **ESLint**: Linting de código limpio

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar linting
npm run lint
```

## ✨ Mejoras Implementadas

### Diseño Visual
- ✅ Paleta de colores personalizada para Gosen Cafeteria
- ✅ Tipografías modernas (Inter para cuerpo, Poppins como alternativa)
- ✅ Sombras suaves y consistentes
- ✅ Bordes redondeados armoniosos
- ✅ Espaciado coherente en todo el proyecto

### Componentes
- ✅ Componentes UI reutilizables en `/components/ui`
- ✅ Button con múltiples variantes y estados
- ✅ Card con diferentes estilos
- ✅ Badge para estados y categorías
- ✅ Container y SectionContainer

### Header & Navegación
- ✅ Header sticky moderno
- ✅ Logo mejorado con emoji
- ✅ Menú responsive con hamburger mobile
- ✅ Enlaces con animaciones suaves
- ✅ Indicadores de hover con animación

### Footer
- ✅ Footer con información completa
- ✅ Secciones: Brand, Enlaces, Contacto, Horario
- ✅ Links de pie de página
- ✅ Año dinámico

### Páginas
- ✅ Home: Hero section + menú + carrito sticky
- ✅ Cart: Carrito refactorizado con resumen
- ✅ Orders: Historial de pedidos mejorado
- ✅ Admin: Dashboard con estadísticas y tabla de órdenes

### Accesibilidad
- ✅ Aria-labels en botones y controles
- ✅ Contraste de colores adecuado
- ✅ Menú mobile accesible

## 📝 Configuración Tailwind

Archivo `tailwind.config.ts` incluye:
- Colores personalizados (beige, coffee, sage)
- Fuentes Inter y Poppins
- Sombras suaves personalizadas
- Border-radius consistentes

## 🔄 Próximas Mejoras Recomendadas

- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] Sistema de autenticación de usuarios
- [ ] Carrito persistente (localStorage o sesión)
- [ ] Pasarela de pago (Stripe/PayPal)
- [ ] Notificaciones en tiempo real con Web Sockets
- [ ] Subida de imágenes de productos
- [ ] Sistema de reseñas y calificaciones
- [ ] Búsqueda y filtros avanzados
- [ ] Dashboard de usuario con historial
- [ ] Modo oscuro (opcional)

## 🤝 Guía de Desarrollo

### Crear un nuevo componente UI
```tsx
// app/components/ui/NewComponent.tsx
export function NewComponent() {
  return <div>Componente</div>;
}

// Exportar en app/components/ui/index.ts
export { NewComponent } from './NewComponent';
```

### Agregar una nueva página
```tsx
// app/nueva-seccion/page.tsx
import Header from '@/components/Header';
import { SectionContainer } from '@/components/ui';

export default function NewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SectionContainer>
        {/* Contenido */}
      </SectionContainer>
    </div>
  );
}
```

## 📄 Licencia

Este proyecto es de código abierto y disponible bajo la licencia MIT.

## 👨‍💻 Créditos

Proyecto creado para **Gosen Cafeteria** con enfoque en diseño moderno, limpio y accesible.

---

**Desarrollado con ❤️ usando Next.js 15, TypeScript y Tailwind CSS**
