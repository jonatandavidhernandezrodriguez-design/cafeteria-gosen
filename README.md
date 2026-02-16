# ☕ Gosen Cafeteria - Sistema POS & Admin Dashboard

Una plataforma moderna de **Punto de Venta (POS)** y **Panel Administrativo** para **Gosen Cafeteria**, construida con **Next.js 16**, **TypeScript** y **Tailwind CSS v4**.

## 🎯 Características Principales

### 👥 Para Clientes
- ✨ **Menú Digital**: Visualización elegante de productos por categoría
- 🛒 **Carrito de Compras**: Gestión intuitiva de pedidos
- 📱 **Diseño Responsive**: Totalmente optimizado para mobile, tablet y desktop

### ⚙️ Para Administrador  
- 📊 **Dashboard Principal**: Estadísticas en tiempo real de ventas y ganancias
- 📦 **Gestión de Productos**: 
  - Crear, editar y desactivar productos
  - Soporte para imágenes (base64 o URL)
  - Gestión de categorías y stock
- 💳 **Sistema de Ventas**: 
  - Interfaz intuitiva para registrar transacciones
  - Soporte para múltiples métodos de pago (Efectivo, Nequi)
  - Cálculo automático de ganancias
- 👤 **Gestión de Clientes**: 
  - Historial completo de compras por cliente
  - Información de contacto
- 📈 **Reportes y Análisis**: 
  - Historial de ventas detallado
  - Exportación a CSV
  - Análisis de ganancias por período
- 🖨️ **Facturas de Venta**: 
  - Modal de recibo elegante
  - Impresión directa de facturas
  - Recibos con información completa de la transacción
- 🔐 **Control de Acceso**: Protección con PIN administrativo (24h localStorage)

## ✅ Estado Actual

**🟢 COMPLETO Y FUNCIONAL** - Todas las bugs corregidas, listo para producción.

### Última Sesión de Bugfixes
Fecha: Hoy

Problemas arreglados:
- ✅ **Impresión de Facturas**: CSS print completamente reescrito
- ✅ **Imágenes de Productos**: DataURL support agregado en Next.js config
- ✅ **Exportación a CSV**: Nuevo feature implementado en Reportes
- ✅ **Edición de Productos**: TypeScript error corregido
- ✅ **Desactivación de Productos**: Funcionalidad verificada
- ✅ **Historial de Clientes**: Búsqueda mejorada con case-insensitive matching

**Ver detalle completo**: [RESUMEN_SESSION.md](RESUMEN_SESSION.md)

## 🚀 Empezar Rápidamente

### Opción 1: Ejecución Local (Desarrollo)

```bash
# 1. Clonar repositorio
git clone git@github.com:jonatandavidhernandezrodriguez-design/cafeteria-gosen.git
cd cafeteria-gosen

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

**Guía detallada**: [LOCAL_SETUP.md](LOCAL_SETUP.md)

### Opción 2: Desplegar en Vercel (Producción)

```bash
# Los cambios en 'main' se despliegan automáticamente
git push origin main
```

**Instrucciones completas**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Opción 3: Verificación de Funcionalidades

```bash
# Ver checklist de testing
cat TESTING_CHECKLIST.md
```

## 🔐 Pin Administrativo

**PIN por defecto**: `1234`

El PIN es requerido para:
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Cambiar estado de productos (activo/inactivo)

**Duración**: Se almacena por 24 horas en localStorage automáticamente.

## 📁 Estructura del Proyecto

```
cafeteria-gosen/
├── app/
│   ├── components/
│   │   ├── ui/                     # Componentes base reutilizables
│   │   ├── Header.tsx              # Navegación principal
│   │   ├── Footer.tsx              # Pie de página
│   │   ├── MenuItem.tsx            # Tarjeta de producto (menú público)
│   │   ├── ProductCard.tsx         # Tarjeta de producto (admin)
│   │   ├── ProductForm.tsx         # Formulario crear/editar producto
│   │   ├── ReceiptModal.tsx        # Modal de factura/recibo
│   │   └── Sidebar.tsx             # Menú lateral del dashboard
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard principal
│   │   ├── products/               # Gestión de productos
│   │   │   ├── page.tsx            # Listado de productos
│   │   │   ├── new/page.tsx        # Crear producto
│   │   │   └── [id]/edit/page.tsx  # Editar producto
│   │   ├── customers/              # Gestión de clientes
│   │   │   ├── page.tsx            # Listado de clientes
│   │   │   └── [id]/page.tsx       # Detalle y historial del cliente
│   │   ├── sales/                  # Crear ventas
│   │   │   └── page.tsx            # Interfaz de punto de venta
│   │   ├── reports/                # Reportes y exportación
│   │   │   └── page.tsx            # Historial de ventas + CSV
│   │   ├── cashbox/                # Caja registradora
│   │   └── menu/                   # Menú público
│   ├── api/
│   │   ├── productos/route.ts      # CRUD de productos
│   │   ├── clientes/route.ts       # CRUD de clientes
│   │   ├── ventas/route.ts         # CRUD de ventas
│   │   └── caja/route.ts           # Métodos de pago
│   ├── lib/
│   │   ├── store.ts                # Lógica de datos (SQL-like queries)
│   │   ├── storage.ts              # Abstracción JSON/Vercel KV
│   │   ├── currency.ts             # Formateo de moneda colombiana (COP)
│   │   ├── auth-utils.ts           # Validación de PIN con expiración
│   │   └── menu-data.ts            # Datos de ejemplo
│   ├── types/
│   │   └── menu.ts                 # Tipos TypeScript compartidos
│   ├── layout.tsx                  # Layout principal
│   ├── page.tsx                    # Página home
│   ├── globals.css                 # Estilos globales + print media queries
│   └── favicon.ico
├── data/                           # Almacenamiento local (JSON)
│   ├── productos.json
│   ├── clientes.json
│   ├── ventas.json
│   └── caja.json
├── public/                         # Assets públicos
├── package.json                    # Dependencias e scripts
├── tsconfig.json                   # Configuración TypeScript
├── next.config.ts                  # Configuración Next.js (unoptimized images)
├── tailwind.config.ts              # Tema Tailwind personalizado
├── README.md                       # Este archivo
├── LOCAL_SETUP.md                  # Guía de setup local
├── DEPLOYMENT_GUIDE.md             # Guía de deployment a Vercel
├── TESTING_CHECKLIST.md            # Checklist de testing
├── RESUMEN_SESSION.md              # Resumen de sesión de bugfixes
└── .gitignore
```

## 📊 Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| Runtime | React | 19.0.0 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 4.0.x |
| Build Tool | Turbopack | Integrado |
| Linting | ESLint | Latest |

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilación para producción
npm run build

# Iniciar servidor de producción (post-build)
npm start

# Verificar errores de linting
npm run lint

# Verificar errores de TypeScript
npm run type-check
```

## 💾 Almacenamiento de Datos

### Modo Local (Desarrollo)
- Datos guardados en carpeta `/data/` como archivos JSON
- Perfectos para desarrollo y testing
- No requiere base de datos externa

### Modo Vercel KV (Producción)
- Automáticamente activado cuando `KV_REST_API_URL` está configurado
- Datos persistentes en Redis
- No se pierden entre deployments
- Requiere configuración manual en Vercel dashboard

**El código detecta automáticamente cuál usar** mediante variable de entorno.

## 🔌 API Endpoints

### Productos
- `GET /api/productos` - Obtener todos los productos
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos` - Actualizar producto
- `DELETE /api/productos` - Eliminar producto

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `POST /api/clientes` - Crear nuevo cliente
- `DELETE /api/clientes` - Eliminar cliente

### Ventas
- `GET /api/ventas` - Obtener todas las ventas
- `POST /api/ventas` - Registrar nueva venta
- `PUT /api/ventas` - Actualizar venta

### Caja
- `GET /api/caja` - Información de la caja (métodos de pago)

## 📋 Flujos Principales

### 1. Crear un Producto
- Ir a: Dashboard → Productos → Nuevo Producto
- Ingresar: nombre, precio, costo, categoría, descripción
- (Opcional) Cargar imagen del producto
- Guardar
- Aparece en listado de productos

### 2. Realizar una Venta
- Ir a: Dashboard → Ventas
- Seleccionar productos y cantidades
- Ver subtotal actualizado automáticamente
- Elegir método de pago (Efectivo/Nequi)
- Ingresar nombre del cliente
- Click "Cerrar Venta"
- Se abre modal de recibo automáticamente
- (Opcional) Imprimir factura

### 3. Ver Reportes
- Ir a: Dashboard → Reportes
- Ver tabla de todas las transacciones
- Click en "Ver Factura" para detalles de venta
- Click en "📥 Descargar CSV" para exportar datos

### 4. Historial de Cliente
- Ir a: Dashboard → Clientes
- Seleccionar cliente de la lista
- Ver todas sus compras con fecha, método de pago, items y total

## 🖨️ Funcionalidad de Impresión

Las facturas se imprimen con estilos especiales definidos en `@media print`:

- Solo muestra el contenido de la factura
- Oculta botones y elementos de navegación
- Preserva colores y bordes para legibilidad
- Optimizado para recibos de 80mm o impresoras estándar

## 🧪 Testing

Para verificar que todo funciona:

```bash
# Ver checklist completo
cat TESTING_CHECKLIST.md

# O ejecutar tests manuales:
npm run dev
# Luego visita http://localhost:3000/dashboard/products
# E intenta crear un producto de prueba
```

## 🚨 Conocidos Problemas & Soluciones

| Problema | Causa | Solución |
|---------|-------|---------|
| Puerto 3000 ocupado | Otro proceso usando puerto | `killall node` o reinicia computadora |
| Build falla | TypeScript error | Ejecuta `npm run build` localmente para ver detalles |
| Datos no se guardan | Carpeta `/data/` no existe | Crea carpeta manualmente |
| Imágenes no muestran | Formato incorrecto | Usa JPEG/PNG o Data URLs válidos |
| Print sale en blanco | CSS print conflictivo | Já arreglado en esta sesión ✅ |

## 📞 Soporte Rápido

1. Revisa [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) para guía de testing
2. Revisa [LOCAL_SETUP.md](LOCAL_SETUP.md) para setup local
3. Revisa [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) para Vercel
4. Abre DevTools (F12) en navegador → Pestaña "Console" para errores

## 📝 Configuración Tailwind

El proyecto usa Tailwind CSS v4 con tema personalizado:

```js
// tailwind.config.ts
module.exports = {
  theme: {
    colors: {
      primary: '#6B4F3A',     // Marrón Café
      accent: '#7BAE7F',      // Verde Suave
      beige: '#F5E6D3',       // Crema
      // ... más colores
    }
  }
}
```

## ✨ Mejoras Futuras (Roadmap)

- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] Sistema de autenticación de usuarios
- [ ] Múltiples usuarios administradores
- [ ] Integración de pasarela de pago (Stripe/PayPal)
- [ ] Notificaciones en tiempo real
- [ ] Sistema de inventario automático
- [ ] Reportes más avanzados (gráficos, análisis)
- [ ] Modo oscuro (dark mode)
- [ ] Sincronización con WhatsApp para pedidos
- [ ] App móvil (React Native)

## 🎨 Paleta de Colores

```
Marrón Café (Primary):    #6B4F3A
Verde Suave (Accent):     #7BAE7F
Crema/Beige:              #F5E6D3
Gris Neutral:             #F3F4F6
Blanco:                   #FFFFFF
```

Todos los colores están configurados en `tailwind.config.ts` y optimizados para accesibilidad.

## 📄 Licencia

Proyecto propietario de Gosen Cafeteria. Todos los derechos reservados.

---

**Desarrollado con ❤️ usando Next.js 16, TypeScript y Tailwind CSS v4**

**Última actualización**: 2024 (Sesión de bugfixes completada)

para más información, revisa los documentos:
- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Cómo ejecutar localmente
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Cómo desplegar en Vercel  
- [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Cómo testear todas las funcionalidades
- [RESUMEN_SESSION.md](RESUMEN_SESSION.md) - Detalles de bugfixes realizados

