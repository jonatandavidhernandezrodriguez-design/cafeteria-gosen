# 🏠 Instrucciones para Ejecutar Localmente

## ✅ Requisitos Previos

- **Node.js** v18+ (descargar de [nodejs.org](https://nodejs.org))
- **Git** instalado
- **Credenciales de GitHub** configuradas (SSH o token)

---

## 📦 Instalación y Setup

### 1. Clonar el Repositorio

```bash
# Opción A: Con SSH (recomendado)
git clone git@github.com:jonatandavidhernandezrodriguez-design/cafeteria-gosen.git

# Opción B: Con HTTPS
git clone https://github.com/jonatandavidhernandezrodriguez-design/cafeteria-gosen.git

# Navegar a la carpeta
cd cafeteria-gosen
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instala todas las librerías necesarias (Next.js, React, Tailwind, etc.)

---

## 🚀 Ejecutar en Desarrollo

```bash
npm run dev
```

**Espera el mensaje**:
```
✓ Ready in XXXms
- Local: http://localhost:3000
```

Abre en navegador: **http://localhost:3000**

---

## 🔐 PIN Administrativo

Para acceder a funciones protegidas (crear/editar/eliminar productos):

### Buscar el PIN:
```bash
# En la carpeta del proyecto, busca en el código:
grep -r "PIN\|1234\|password" app/lib/auth-utils.ts
```

**PIN por defecto**: `1234` (si existe)

### Usar el PIN:
1. Intenta acceder a "Crear Producto" o "Editar Producto"
2. Ingresa el PIN en el modal que aparece
3. Se guarda por 24 horas en localStorage

---

## 📁 Estructura de Carpetas

```
cafeteria-gosen/
├── app/
│   ├── components/        # Componentes React reutilizables
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ReceiptModal.tsx
│   │   └── ProductForm.tsx
│   ├── dashboard/         # Vistas administrativas
│   │   ├── products/      # Gestión de productos
│   │   ├── customers/     # Listado de clientes + historial
│   │   ├── sales/         # Crear nuevas ventas
│   │   ├── reports/       # Historial y CSV
│   │   └── page.tsx       # Dashboard principal
│   ├── api/               # Rutas API (backend)
│   │   ├── productos/
│   │   ├── clientes/
│   │   ├── ventas/
│   │   └── caja/
│   ├── lib/               # Funciones compartidas
│   │   ├── store.ts       # Lógica de datos
│   │   ├── storage.ts     # Abstracción JSON/KV
│   │   ├── currency.ts    # Formateo de moneda
│   │   └── auth-utils.ts  # Validación de PIN
│   ├── types/             # Tipos TypeScript
│   ├── styles/            # CSS global
│   └── globals.css        # Estilos globales + print
├── data/                  # Datos locales (JSON)
│   ├── productos.json
│   ├── clientes.json
│   ├── ventas.json
│   └── caja.json
├── public/                # Assets públicos (imágenes, etc.)
├── package.json           # Dependencias
├── tsconfig.json          # Configuración TypeScript
├── next.config.ts         # Configuración Next.js
└── README.md              # Documentación principal
```

---

## 📝 Flujos Principales

### Crear Producto
```
1. Dashboard → Productos → Nuevo Producto
2. Ingresa: nombre, precio, costo, categoría, descripción
3. (Opcional) Sube foto del producto
4. Click "Guardar"
5. Aparece en listado de productos
```

### Realizar Venta
```
1. Dashboard → Ventas
2. Selecciona productos y cantidades
3. Ver subtotal actualizado
4. Elige método de pago (Efectivo/Nequi)
5. Ingresa nombre del cliente
6. Click "Cerrar Venta"
7. Modal de recibo aparece automáticamente
8. (Opcional) Click "Imprimir" para factura física
```

### Ver Historial
```
1. Dashboard → Reportes (o Historial de Ventas)
2. Ver tabla con todas las transacciones
3. Click "Ver Factura" para detalles
4. Click "Descargar CSV" para exportar
```

### Ver Historial del Cliente
```
1. Dashboard → Clientes
2. Click en nombre del cliente
3. Ver todas sus compras con detalles (fecha, items, total)
```

---

## 🧪 Pruebas

### Verificar que Todo Funciona

```bash
# Compilar (detecta errores TypeScript)
npm run build

# Si falla, revisa los errores y corrígelos
# Si pasa, está listo para producción
```

### Ver listado de verificación
Ver archivo: **TESTING_CHECKLIST.md**

---

## 📊 Ver Datos Locales

Los datos se guardan en carpeta `/data/`:

```bash
# Ver productos
cat data/productos.json | npm install -g jq && jq .

# Ver ventas
cat data/ventas.json | jq .

# Ver clientes  
cat data/clientes.json | jq .
```

O simplemente abre los archivos con editor de texto.

---

## 🔄 Flujo de Desarrollo

### Hacer cambios:
1. Edita archivos en `/app/`
2. El dev server auto-recarga (hot reload)
3. Ve cambios inmediatamente en navegador

### Crear componente nuevo:
```bash
# Ejemplo: crear componente LoginForm
touch app/components/LoginForm.tsx

# Edita el archivo con tu lógica
# Importa en la página donde lo necesites
```

### Crear página nueva:
```bash
# Ejemplo: crear página /productos
mkdir app/productos
touch app/productos/page.tsx

# Edita page.tsx con tu contenido
# Automáticamente accesible en /productos
```

---

## 📦 Instalar Nuevas Librerías

```bash
npm install nombre-del-paquete
npm install --save-dev nombre-del-paquete-dev

# Luego haz commit:
git add package.json package-lock.json
git commit -m "Add: nombre-del-paquete"
```

---

## 🐛 Troubleshooting

### Puerto 3000 ocupado
```bash
# Windows PowerShell:
Get-Process -Name node | Stop-Process -Force

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

Luego: `npm run dev`

### Module not found error
```bash
# Limpia node_modules y reinstala:
rm -r node_modules
npm install
npm run dev
```

### TypeScript errors después de cambios
```bash
# Reinicia el dev server:
Ctrl+C para detener
npm run dev
```

### Datos no se guardan
- Verifica que carpeta `/data/` exista
- Asegúrate de no borrar archivos JSON accidentalmente
- En Vercel, necesitas KV configurado (ver DEPLOYMENT_GUIDE.md)

---

## 💡 Tips Útiles

### Ver componentes en aislamiento (Storybook)
```bash
# NO instalado aún, pero es posible agregar
npm install -D @storybook/nextjs
npx storybook init
```

### Debug en navegador
1. Abre DevTools (F12)
2. Pestaña "Console" para errores
3. Pestaña "Network" para ver requests a API

### Ver logs del servidor
El dev server muestra logs en la terminal:
```
GET /api/productos 200 in 5ms
PUT /api/productos 201 in 7ms
```

---

## 📞 Ayuda

Si algo no funciona:

1. Revisa **TESTING_CHECKLIST.md** para pasos de verificación
2. Revisa logs en terminal del dev server
3. Abre DevTools (F12) en navegador
4. Revisa archivo de estructura de carpetas arriba

---

## ✅ Checklist para Empezar

- [ ] Node.js instalado: `node --version`
- [ ] Repositorio clonado
- [ ] Dependencias instaladas: `npm install`
- [ ] Dev server ejecutándose: `npm run dev`
- [ ] Navegador abierto en http://localhost:3000
- [ ] Dashboard visible sin errores
- [ ] Puedo crear un producto (con PIN)
- [ ] Puedo ver el historial de ventas

¡Listo para comenzar! 🎉

