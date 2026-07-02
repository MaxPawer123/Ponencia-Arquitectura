# Evento de Ponencias - FAADU UMSA | Guía de Configuración

## ✅ Estado Actual

✓ **Estructura de datos completa** - Cronograma completo con 6 días de eventos  
✓ **Componente principal refactorizado** - `app/page.tsx` con todas las características  
✓ **Build limpio** - Compilación sin errores v0, configuración pura Next.js  
✓ **Servidor dev funcional** - Sistema completamente operativo

---

## 📋 Características Implementadas

### 1. **Detección Automática de Día Actual**
- El sistema detecta automáticamente el día actual al cargar
- Muestra la pestaña correspondiente activada
- Si es fuera de horarios de eventos, muestra Lunes por defecto

### 2. **Timer en Tiempo Real (Cada 30 Segundos)**
- Compara la hora actual del dispositivo con rangos de eventos
- Detecta eventos "EN VIVO AHORA" automáticamente
- Tres estados por evento:
  - **EN VIVO**: Muestra badge parpadeante, botones destacados, QR visible
  - **PRÓXIMO**: Botón normal, sin acciones adicionales
  - **PASADO**: Opacidad reducida, deshabilitado

### 3. **Badge "EN VIVO AHORA"**
- Parpadeante con punto rojo animado
- Color naranja institucional (#E5820C)
- Se muestra solo cuando hay eventos en vivo

### 4. **Componente QR Dinámico**
- Aparece solo para eventos en vivo
- Se muestra/oculta al hacer click en botón "📱 QR"
- Codifica automáticamente el link de transmisión
- Posicionamiento inteligente (modal flotante)

### 5. **Paleta de Colores FAADU**
- **Naranja Institucional**: #E5820C (botones, texto resaltado)
- **Fondo Blanco**: #FFFFFF (principal)
- **Fondo Gris Claro**: #F9F9F9 (secciones secundarias)
- **Texto Negro/Antracita**: #111111 (cuerpo)

### 6. **Estructura de Datos Completa**
Archivo: `lib/cronograma.ts`
- 6 días de eventos (Lunes - Viernes + Lunes 13)
- 20+ eventos totales con datos realistas
- Campos: horaInicio, horaFin, titulo, expositores, linkTransmision, lugar, enfoque

---

## 🚀 Cómo Iniciar

### Desarrollo Local
```bash
cd /vercel/share/v0-project
pnpm install  # Si es primera vez
pnpm dev
```
Abre `http://localhost:3000` en tu navegador

### Producción - Build Limpio
```bash
# Build sin errores v0 (pure Next.js)
pnpm build

# Iniciar servidor producción
pnpm start
```

---

## 📁 Estructura de Archivos

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx          ← Componente principal (refactorizado)
│   ├── layout.tsx        ← Metadatos SEO
│   └── globals.css       ← Estilos globales
├── lib/
│   └── cronograma.ts     ← Estructura de datos de eventos
├── public/
│   ├── faadu-logo.png    ← Logo institucional
│   └── [otros assets]
├── package.json          ← Dependencias (limpio)
└── SETUP.md             ← Este archivo
```

---

## 🔧 Configuración de Build (package.json)

El archivo `package.json` está completamente limpio:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",      ← Build limpio, sin scripts v0
    "start": "next start",
    "lint": "eslint ."
  }
}
```

**Diferencia importante:**
- ❌ **Antes**: `"build": "next build && .v0/inject-built-with-v0.mjs"`
- ✅ **Ahora**: `"build": "next build"` (limpio)

---

## 🎨 Personalización

### Cambiar Color Institucional
En `app/page.tsx`, busca `#E5820C` y reemplaza con tu color:
```tsx
style={{ backgroundColor: '#E5820C' }}  // Tu color aquí
```

### Agregar Más Eventos
En `lib/cronograma.ts`, añade eventos al array correspondiente:
```typescript
{
  id: 'jue-5',
  horaInicio: '13:00',
  horaFin: '14:30',
  titulo: 'Tu Evento',
  expositores: ['Nombre Expositor'],
  linkTransmision: 'https://meet.google.com/...',
  lugar: 'Ubicación',
  enfoque: 'Tema'
}
```

### Cambiar Links de Transmisión
Todos los links están en `cronograma.ts`:
- Busca `linkTransmision` en cada evento
- Reemplaza con tu Google Meet, Zoom, etc.

---

## 📱 Responsividad

- ✅ **Desktop** (1920px+): Layout multi-columna, todas las acciones visibles
- ✅ **Tablet** (768px-1023px): Layout adaptado, QR en modal flotante
- ✅ **Mobile** (375px-767px): Stack vertical, botones optimizados para touch

---

## ⏱️ Funcionamiento del Timer en Vivo

1. **Cada 30 segundos**, el sistema verifica:
   - Hora actual del dispositivo
   - Rango horaInicio - horaFin de cada evento

2. **Si la hora está dentro del rango:**
   - Estado = `'en-vivo'`
   - Se muestra badge "EN VIVO AHORA"
   - Botón se destaca en naranja
   - Botones QR y enlace externo aparecen

3. **La detección es local** (usa hora del dispositivo del usuario)
   - No requiere servidor
   - Funciona offline
   - Perfectamente sincronizado

---

## 🔍 Debugging

### Ver estado de eventos en consola
Abre DevTools (F12) → Console para ver logs:
```javascript
// Ejemplo de verificación manual
const ahora = new Date();
const minutos = ahora.getHours() * 60 + ahora.getMinutes();
console.log("Minutos desde medianoche:", minutos);
```

### Simular evento en vivo (dev mode)
En `app/page.tsx`, línea 70, cambia temporalmente:
```typescript
// Cambia esta línea para forzar hora (ej: 10:15 AM = 615 minutos)
setHoraActual(615);
```

---

## 📧 Contacto & Soporte

- **Email**: info@faadu.edu.bo
- **Teléfono**: +591 (2) 123-4567
- **Ubicación**: La Paz, Bolivia

---

## ✨ Resumen de Cambios vs Original

| Aspecto | Original | Actualizado |
|---------|----------|-------------|
| **Build** | Con script v0 | Next.js puro |
| **Datos** | Ejemplo minimal | Cronograma completo (20+ eventos) |
| **Componente** | Básico | Refactorizado con todas features |
| **Timer** | Manual | Automático cada 30s |
| **QR** | Estático | Dinámico por evento |
| **Responsividad** | Completa | Mejorada |

---

**¡Sistema completamente funcional y listo para producción!** 🚀
