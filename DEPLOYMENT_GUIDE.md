# 🚀 Guía de Deployment a Vercel

## Estado Actual
El código está **listo para producción** en la rama `main` de GitHub.

---

## Paso 1: Verificar que Todo Esté en GitHub

```bash
# En tu carpeta del proyecto
git log --oneline -5
# Deberías ver los últimos commits

git status
# Debe mostrar "working tree clean"
```

**Commits esperados**:
- `2d0a611 - Add: Final session summary and completion report`
- `0fb8c4b - Add: Comprehensive testing and verification checklist`
- `8b729b8 - Fix: Improve print CSS, add CSV export, support data URLs`
- `ae378f4 - Fix: Remove stock field from product edit, handle images properly`

---

## Paso 2: Conectar a Vercel (Primera Vez)

1. Ir a [vercel.com](https://vercel.com)
2. Crear cuenta o iniciar sesión
3. Click en **"New Project"**
4. Conectar repositorio GitHub:
   - Click en **"Import Git Repository"**
   - Seleccionar: `jonatandavidhernandezrodriguez-design/cafeteria-gosen`
   - Click **"Import"**

### Configurar Proyecto:
- **Framework**: Selecciona **"Next.js"**
- **Root Directory**: Está bien por defecto
- Click **"Skip" o "Deploy"**

Espera a que compile... ✅ **Primera versión deployada!**

---

## Paso 3: Configurar Vercel KV (IMPORTANTE)

Sin esto, los datos se perderán al reiniciar Vercel (no persistentes).

### Opción A: Vercel KV (Recomendado)
1. En dashboard de Vercel, ve a tu proyecto
2. Click en **"Storage"** (o **"Integrations"**)
3. Click **"KV Database"** o **"Create KV"**
4. Selecciona región (ej: "Miami" para Latinoamérica)
5. Click **"Continue"**
6. Listo! Las variables de entorno (`KV_REST_API_URL`, etc.) se agregan automáticamente

### Opción B: Upstash (Alternativa - gratuita)
1. Ir a [upstash.com](https://upstash.com)
2. Crear base de datos Redis
3. Copiar credenciales:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. En Vercel Dashboard → Settings → Environment Variables
5. Agregar las dos variables

---

## Paso 4: Redeploy con Variables de Entorno

Después de configurar KV:

1. En Vercel Dashboard, ve a tu proyecto
2. Click en **"Deployments"**
3. Click en el botón **"Redeploy"** del último deployment
4. Click **"Redeploy"**

Espera a que recompile... ✅ **Ahora con persistencia!**

---

## Paso 5: Verificar Deployment

1. Vercel te da una URL (ej: `cafeteria-gosen.vercel.app`)
2. Abre en navegador: `https://tu-url.vercel.app`
3. Deberías ver la app funcionando

### Testing en Producción:
- [ ] Página home carga correctamente
- [ ] Dashboard de admin accesible
- [ ] Puedes crear productos
- [ ] Las ventas se guardan
- [ ] Historial de ventas está disponible

---

## Paso 6: Actualizar en el Futuro

Cada vez que hagas cambios y haces `git push`:

1. Vercel detecta automáticamente el push
2. Inicia build automático
3. Una vez completado, tu app se actualiza live

**No necesitas hacer nada más!** 🎉

---

## Troubleshooting

### El deployment falla (Build Error)

**Solución**: 
```bash
# En tu máquina local:
npm run build
# Si esto pasa, tienes un problema local que arreglar
# Si esto no pasa, es un problema de Vercel

# Envía los logs a Vercel → Deployments → Click en deployment fallido
```

### Los datos no persisten

**Causa**: No has configurado KV database
**Solución**: Ve a Paso 3 (arriba)

### App anda lenta en Vercel

**Causa**: Posiblemente imágenes muy grandes en base64
**Solución**: Usa imágenes más pequeñas o URLs de CDN externo

---

## Variables de Entorno Necesarias

Vercel debería auto-agregar estas al conectar KV:

```env
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

**Nota**: Si usas Upstash en lugar de Vercel KV:
```env
KV_REST_API_URL=https://upstash-url-here
KV_REST_API_TOKEN=your-token-here
```

El código automáticamente detecta cuál usar.

---

## Monitoreo y Logs

### Ver logs en vivo:
1. Vercel Dashboard → Proyecto → **"Logs"**
2. O usa: **"Real-time"** para monitoring

### Ver errores:
1. Vercel Dashboard → Deployments → Click en deployment
2. Busca sección **"Build Logs"** o **"Deployment Logs"**

---

## ¡Listo! 🎉

Tu app está deployed y lista para usar en producción.

**Próximos pasos opcionales**:
- [ ] Comprar dominio personalizado
- [ ] Configurar email para alertas
- [ ] Agregar más usuarios administrativos
- [ ] Hacer backup de datos

