# localStorage Persistence Guide

## ¿Cómo Funciona?

Tu app POS ahora tiene **persistencia automática con localStorage**. Los productos se guardan localmente en el navegador y se sincronzan con la API.

### Sistema de Almacenamiento en Capas

```
Local State (React)
    ↓
localStorage (navegador)
    ↓
API Backend (/api/productos)
```

## Flujo Automático

### 1️⃣ Al iniciar la app
```
localStorage → Carga inmediata desde cache local
API → Se sincroniza en background
```

### 2️⃣ Al crear/editar/eliminar un producto
```
React State → Se actualiza al instante
localStorage → Se guarda automáticamente
API → Se envía al servidor
```

### 3️⃣ Sin conexión a Internet
```
localStorage mantiene los datos disponibles
API falla → Se usa el cache local
```

---

## Implementación Técnica

### Archivos Nuevos Creados

#### 1. `app/lib/useLocalStorage.ts`
Hook base para manejar localStorage de forma segura con Next.js (SSR compatible)

```typescript
const [value, setValue, isLoaded] = useLocalStorage('key', initialValue);
```

**Características:**
- ✅ Compatible con Server-Side Rendering (SSR)
- ✅ Maneja hidratación correctamente
- ✅ Soporte para tipos generics (`<T>`)
- ✅ Try/catch para errores de localStorage

---

#### 2. `app/lib/useProducts.ts`
Hook personalizado que **sincroniza productos entre localStorage y la API**

```typescript
const { products, setProducts, isLoading, isLoaded, error } = useProducts();
```

**Características:**
- ✅ Carga desde localStorage al instante (UX rápida)
- ✅ Sincroniza con la API en background
- ✅ Fallback a localStorage si la API falla
- ✅ Auto-guardado en localStorage cada vez que cambians `products`

---

### Cambios en `app/dashboard/products/page.tsx`

**Antes:**
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const loadProducts = async () => {
    const data = await getProducts(); // Esperaba la API
    setProducts(data);
  };
  loadProducts();
}, []);
```

**Ahora:**
```typescript
const { products, setProducts, isLoading: apiLoading, isLoaded } = useProducts();
// ✅ Productos disponibles al instante desde localStorage
// ✅ Se sincroniza con la API en background
// ✅ No hay flickering visual
```

---

## Cómo Usar

### Para cualquier página que necesite persistencia

```typescript
import { useProducts } from '@/app/lib/useProducts';

export default function MyComponent() {
  const { products, setProducts, isLoading, isLoaded } = useProducts();

  // Crear un producto
  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    // ✅ Se guarda automáticamente en localStorage
  };

  // Editar un producto
  const handleEditProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map(p => p.id === id ? { ...p, ...updates } : p)
    );
    // ✅ Se guarda automáticamente en localStorage
  };

  // Eliminar un producto
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    // ✅ Se guarda automáticamente en localStorage
  };

  return isLoaded ? (
    <div>
      {/* Tu contenido aquí */}
    </div>
  ) : (
    <div>Cargando productos...</div>
  );
}
```

---

## Para Usar localStorage en Otros Datos

```typescript
import { useLocalStorage } from '@/app/lib/useLocalStorage';

export default function MyComponent() {
  // Para un simple boolean
  const [isDarkMode, setIsDarkMode, isLoaded] = useLocalStorage('darkMode', false);

  // Para objetos complejos
  const [userSettings, setUserSettings, isLoaded] = useLocalStorage('settings', {
    theme: 'light',
    language: 'es'
  });

  // Para arrays
  const [favorites, setFavorites, isLoaded] = useLocalStorage<string[]>('favorites', []);

  return isLoaded ? (
    // Tu UI aquí
  ) : (
    <div>Cargando...</div>
  );
}
```

---

## Debugging localStorage

En la consola del navegador (F12):

```javascript
// Ver todo lo que se guardó
console.log(localStorage);

// Ver un valor específico
localStorage.getItem('cafeteria_productos');

// Limpiar productos guardados (útil para testing)
localStorage.removeItem('cafeteria_productos');

// Limpiar TODO
localStorage.clear();
```

---

## Comportamiento en Diferentes Escenarios

| Escenario | Comportamiento |
|-----------|---|
| **Primera visita** | Carga array vacío, espera API |
| **Visita siguiente (caché existe)** | Carga datos locales al instante |
| **Agregado de producto** | Aparece inmediatamente + se guarda |
| **Sin internet** | Usa datos de localStorage local |
| **API falla** | Continúa con datos cached |
| **Actualización de API exitosa** | Se sincroniza bidireccional |

---

## Límites de localStorage

- **Límite**: ~5-10MB por dominio (depende del navegador)
- **Durabilidad**: Permanente (hasta que el usuario limpie datos)
- **Acceso**: Solo el navegador (server NO puede acceder)

Para tu POS con ~1000 productos en base64:
- Si cada producto = ~50KB → ~50MB máximo
- localStorage sería insuficiente para muchas imágenes
- **Solución**: Guardar solo IDs/datos en localStorage, imágenes en servidor

---

## Mejoras Futuras

1. Agregar IndexedDB para más almacenamiento (~50MB+)
2. Sincronización bidireccional en tiempo real
3. Compresión de datos antes de guardar
4. Cache inteligente por categoría
5. Offline mode completo

---

## Preguntas Frecuentes

**P: ¿Se pierde localStorage si cierro el navegador?**
R: No. localStorage persiste entre sesiones. Solo se limpia si el usuario borra datos del navegador.

**P: ¿Puede haber conflicto entre localStorage y la API?**
R: No. Se prioriza la API. Si los datos difieren, la próxima carga desde API gana.

**P: ¿Funciona en incógnito/privado?**
R: Sí, pero solo para esa sesión. Se borra al cerrar la ventana.

**P: ¿Cómo sincronizo manualmente?**
R: Cada llamada a `setProducts()` se guarda automáticamente. Para forzar, llama a `loadProducts()` manualmente.
