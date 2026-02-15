# 📦 Dashboard de Productos - Guía de Uso

## 🚀 Acceso Rápido

**URL del Dashboard:** `http://localhost:3000/dashboard/products`

O simplemente haz clic en el botón **"Productos"** en la navegación (📦 icono).

---

## 📋 Pantalla Principal

### Vista General
La página principal del dashboard muestra:

1. **Estadísticas (arriba)**
   - Total de productos
   - Productos activos
   - Valor total del catálogo

2. **Controles de búsqueda**
   - Buscador por nombre
   - Filtro por categoría
   - Botón "Nuevo Producto"

3. **Grid de Productos**
   - Muestra todos los productos en grid
   - 4 columnas en desktop, 2 en tablet, 1 en mobile
   - Cada tarjeta muestra imagen, nombre, precio, y botones

---

## ➕ Crear un Nuevo Producto

### Paso 1: Haz clic en "Nuevo Producto"
```
En /dashboard/products → Botón "➕ Nuevo Producto"
```

### Paso 2: Completa el Formulario

**Campos obligatorios:**
- ✅ **Nombre** - Ej: "Café Americano"
- ✅ **Precio** - Ej: 3.50
- ✅ **Costo** - Ej: 1.20

**Campos opcionales:**
- 📝 Descripción - Ej: "Espresso clásico con agua caliente"
- 📂 Categoría - Elige: Café, Pasteles, Sándwiches, Bebidas
- 🖼️ URL de Imagen - Ej: https://example.com/imagen.jpg
- ✔️ Activo - Checkbox para estado

### Paso 3: Previsualización
- A la derecha ves el **preview en tiempo real**
- Se actualiza conforme escribes
- Muestra imagen, nombre, precio, margen

### Paso 4: Guardar
- Haz clic en **"Crear Producto"**
- Se redirige a la lista de productos

---

## ✏️ Editar un Producto

### Opción 1: Desde la Tarjeta
```
1. En el grid de productos
2. Haz clic en la tarjeta O en el botón "Editar"
```

### Opción 2: Directamente
```
URL: /dashboard/products/[id]/edit
Ej: /dashboard/products/1/edit
```

### Proceso de Edición
1. Se abre el formulario con los datos actuales
2. Edita los campos que necesites
3. La previsualización se actualiza en tiempo real
4. Haz clic en **"Actualizar Producto"**
5. Se recarga la lista de productos

---

## 🗑️ Eliminar un Producto

### Desde la Tarjeta
1. Haz clic en el botón **"Eliminar"**
2. Se abre un confirmación: *"¿Eliminar 'Nombre del Producto'?"*
3. Confirma para eliminar
4. El producto desaparece del listado

---

## 🔍 Buscar Productos

### Por Nombre
```
1. Haz clic en el campo "Buscar productos..."
2. Escribe el nombre (Ej: "Café")
3. El listado se filtra automáticamente
```

### Por Categoría
```
1. Abre el dropdown "Todas las categorías"
2. Selecciona: Café, Pasteles, Sándwiches o Bebidas
3. Se muestran solo productos de esa categoría
```

### Combinado
```
Puedes buscar por nombre Y seleccionar categoría
Los filtros trabajan juntos
```

---

## 💾 Estructura del Producto

Cada producto contiene:

| Campo | Tipo | Requerido | Ejemplo |
|-------|------|-----------|---------|
| `id` | string | ✅ | "1" |
| `name` | string | ✅ | "Café Americano" |
| `price` | number | ✅ | 3.50 |
| `cost` | number | ✅ | 1.20 |
| `imageUrl` | string | ❌ | "https://..." |
| `isActive` | boolean | ❌ | true |
| `description` | string | ❌ | "Espresso con agua" |
| `category` | string | ❌ | "coffee" |

---

## 📊 Cálculo de Margen

El dashboard calcula automáticamente:

```
Margen = ((Precio - Costo) / Precio) × 100%

Ejemplo:
Precio: $10
Costo: $4
Margen: ((10 - 4) / 10) × 100 = 60%
```

Se muestra en:
- ✅ Tarjeta del producto
- ✅ Previsualización al editar

---

## 🎨 Estados de Producto

### Prodcuto Activo
- Mostrado en el catálogo
- Disponible para ordenar
- Badge verde: "Activo"

### Producto Inactivo
- Oculto en el catálogo
- No se puede ordenar
- Badge gris: "Inactivo"

---

## 📱 En Móvil

El dashboard es **100% responsivo**:

| Pantalla | Comportamiento |
|----------|----------------|
| < 640px | 1 columna, stack vertical |
| 640-1024px | 2 columnas |
| > 1024px | 3-4 columnas |

---

## 🖼️ Imágenes

### Agregar Imagen
1. Obtén una URL completa de imagen
2. Pégala en el campo "URL de la Imagen"
3. La previsualización se actualiza automáticamente

### Formatos Soportados
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WebP
- ✅ GIF

### Fuentes de Imágenes
- Unsplash: https://unsplash.com
- Pexels: https://www.pexels.com
- Cloudinary: https://cloudinary.com (recomendado)
- Tu propio servidor

---

## ⚠️ Validaciones

El formulario valida:

| Campo | Regla | Error |
|-------|-------|-------|
| Nombre | No vacío | "El nombre es requerido" |
| Precio | > 0 | "El precio debe ser mayor a 0" |
| Costo | >= 0 | "El costo no puede ser negativo" |

---

## ⌨️ Atajos Útiles

| Acción | Atajo |
|--------|-------|
| Crear producto | Btn "➕ Nuevo" |
| Editar | Click tarjeta |
| Eliminar | Btn "Eliminar" |
| Buscar | Input buscar |
| Filtrar | Select categoría |

---

## 🔌 Próxima Integración API

Actualmente el dashboard trabaja con:
- ✅ Datos de ejemplo estáticos
- ✅ Interfaz completa funcional
- ❌ Persistencia en base de datos

**Próximos pasos:**
1. Conectar con backend API
2. Guardar en base de datos
3. Implementar autenticación
4. Upload de imágenes real

---

## 📞 Soporte

### Problemas Comunes

**P: No veo la imagen del producto**
R: Verifica que la URL sea válida y accesible desde internet

**P: El margen no calcula**
R: Asegúrate de ingresar números en precio y costo

**P: No puedo editar un producto**
R: Haz clic directamente en la tarjeta o en el botón "Editar"

**P: ¿Dónde veo el inventario?**
R: Está planificado para futuras versiones

---

## 🎯 Checklist para Empezar

- [ ] Abre http://localhost:3000/dashboard/products
- [ ] Revisa los productos de ejemplo
- [ ] Crea un nuevo producto
- [ ] Busca por nombre
- [ ] Filtra por categoría
- [ ] Edita un producto
- [ ] Prueba la previsualización
- [ ] Intenta eliminar (sin confirmar)

---

**¡Listo para gestionar tu catálogo! 🚀**

*Última actualización: Febrero 2026*
