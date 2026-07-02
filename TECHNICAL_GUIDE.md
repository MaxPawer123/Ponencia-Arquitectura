# Guía Técnica - Evento de Ponencias FAADU UMSA

## 🏗️ Arquitectura Técnica

### Stack Utilizado
- **Framework**: Next.js 16.2.6 (App Router)
- **Lenguaje**: TypeScript 5.7.3
- **Estilos**: Tailwind CSS 4.2.0
- **QR**: qrcode.react 4.2.0
- **Runtime**: React 19

### Flujo de Datos

```
┌─────────────────────────────────────────┐
│   lib/cronograma.ts                     │
│   (Estructura de Datos)                 │
│   - cronogramaEventos: CronogramaEventos│
│   - Evento interface                    │
│   - Funciones auxiliares                │
└──────────────┬──────────────────────────┘
               │ import
               ▼
┌──────────────────────────────────────────┐
│   app/page.tsx (Client Component)        │
│   'use client'                           │
│   ├─ State Management                   │
│   │  ├─ diaActual: string               │
│   │  ├─ horaActual: number              │
│   │  ├─ eventosConEstado: Event[]       │
│   │  └─ qrAbierto: string | null        │
│   │                                      │
│   ├─ useEffect 1: Detección de día     │
│   │  └─ new Date().getDay()             │
│   │                                      │
│   ├─ useEffect 2: Timer (30s)          │
│   │  ├─ Compara hora actual             │
│   │  ├─ Calcula estado eventos          │
│   │  └─ setInterval(30000)              │
│   │                                      │
│   └─ Renderizado Condicional            │
│      ├─ Tabs de días                    │
│      ├─ EventoCard[] con estado         │
│      └─ QR Modal dinámico                │
└──────────────────────────────────────────┘
```

---

## 📊 Estructura de Datos

### `lib/cronograma.ts`

#### Interface: `Evento`
```typescript
interface Evento {
  id: string                  // Identificador único (ej: 'lun-1')
  horaInicio: string          // Formato 24h: "08:00"
  horaFin: string             // Formato 24h: "09:30"
  titulo: string              // Título de la ponencia
  expositores: string[]       // Array de nombres
  linkTransmision: string     // URL de Google Meet/Zoom
  lugar?: string              // Ubicación física
  enfoque?: string            // Categoría del evento
}
```

#### Interface: `EventoConEstado` (Client)
```typescript
interface EventoConEstado extends Evento {
  estado: 'en-vivo' | 'proximo' | 'pasado' | 'receso'
}
```

#### Object: `cronogramaEventos`
```typescript
const cronogramaEventos: CronogramaEventos = {
  lunes: [
    { id: 'lun-1', ... },
    { id: 'lun-2', ... },
    // ... 5 eventos
  ],
  martes: [ ... ],
  miercoles: [ ... ],
  jueves: [ ... ],
  viernes: [ ... ],
  lunes13: [ ... ]
}
```

---

## ⏰ Lógica de Timer en Tiempo Real

### Algoritmo de Detección de Estado

```typescript
const actualizarTiempo = () => {
  // 1. Obtener hora actual
  const ahora = new Date()
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()
  
  // 2. Por cada evento del día actual
  const eventosActualizados = eventos.map((evento) => {
    // 3. Convertir horas a minutos
    const horaInicio = convertirHoraAMinutos('08:00') // = 480
    const horaFin = convertirHoraAMinutos('10:00')    // = 600
    
    // 4. Comparar con hora actual
    if (minutos >= horaInicio && minutos < horaFin) {
      estado = evento.expositores.length === 0 ? 'receso' : 'en-vivo'
    } else if (minutos >= horaFin) {
      estado = 'pasado'
    } else {
      estado = 'proximo'
    }
    
    return { ...evento, estado }
  })
}

// 5. Ejecutar cada 30 segundos
setInterval(actualizarTiempo, 30000)
```

### Función Auxiliar: `convertirHoraAMinutos`

```typescript
export const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}

// Ejemplos:
// "09:00" → 540
// "12:30" → 750
// "17:15" → 1035
```

---

## 🎨 Sistema de Estilos

### Tema de Color

```css
/* Naranja Institucional */
--orange: #E5820C

/* Grises */
--white: #FFFFFF
--light-gray: #F9F9F9
--gray-200: #E5E5E5
--gray-600: #666666
--dark-text: #111111

/* Estados */
--success: Verde (no usado)
--error: Rojo (no usado)
```

### Aplicación Condicional de Estilos

#### Evento En Vivo
```tsx
esEnVivo && {
  borderColor: '#E5820C',
  backgroundColor: '#FFF5E6',
  boxShadow: '0 20px 25px -5px rgba(229, 130, 12, 0.2)'
}
```

#### Evento Pasado
```tsx
esPasado && {
  borderColor: '#E5E5E5',
  backgroundColor: '#F3F4F6',
  opacity: 0.6
}
```

#### Evento Próximo
```tsx
DEFAULT: {
  borderColor: '#E5E5E5',
  backgroundColor: '#FFFFFF',
  hoverShadow: true
}
```

---

## 🔄 Flujo de Estado (React Hooks)

### 1. `useEffect` - Detección de Día
```typescript
useEffect(() => {
  const hoy = new Date().getDay()  // 0-6 (0=domingo)
  
  // Mapear a nombre de día
  let diaSeleccionado = 'lunes'
  if (hoy === 1) diaSeleccionado = 'lunes'
  else if (hoy === 2) diaSeleccionado = 'martes'
  // ... etc
  
  setDiaActual(diaSeleccionado)
}, []) // Ejecutar solo al montar
```

### 2. `useEffect` - Timer de 30 Segundos
```typescript
useEffect(() => {
  // 1. Actualizar hora y calcular estados
  const actualizarTiempo = () => {
    const ahora = new Date()
    const minutos = ahora.getHours() * 60 + ahora.getMinutes()
    setHoraActual(minutos)
    
    // 2. Calcular estado de eventos
    const eventosDelDia = cronogramaEventos[diaActual] || []
    const eventosActualizados = eventosDelDia.map((evento) => {
      // ... lógica de estado
      return { ...evento, estado }
    })
    
    setEventosConEstado(eventosActualizados)
  }
  
  // 3. Ejecutar inmediatamente
  actualizarTiempo()
  
  // 4. Ejecutar cada 30 segundos
  const intervalo = setInterval(actualizarTiempo, 30000)
  
  // 5. Limpiar al desmontar
  return () => clearInterval(intervalo)
}, [diaActual]) // Ejecutar cuando cambia el día
```

### 3. Cambio de Día
```typescript
const handleDiaClick = (dia) => {
  setDiaActual(dia)        // Cambiar día
  setQrAbierto(null)       // Cerrar QR modal
  // useEffect se ejecuta automáticamente
}
```

---

## 🎬 Componente EventoCard

### Props
```typescript
interface EventoCardProps {
  evento: EventoConEstado
  qrAbierto: string | null
  onQrToggle: (id: string | null) => void
}
```

### Renderizado Condicional

#### Badge "EN VIVO"
```tsx
{esEnVivo && (
  <div style={{ backgroundColor: '#E5820C' }}>
    <span className="animate-pulse">●</span>
    <span>EN VIVO AHORA</span>
  </div>
)}
```

#### Botones de Acción
```tsx
{!esReceso && tieneExpo && (
  <>
    {/* Botón Entrar */}
    <a href={evento.linkTransmision}>
      {esEnVivo ? 'Entrar Ahora' : esPasado ? 'Finalizado' : 'Entrar'}
    </a>
    
    {/* QR Modal - Solo en vivo */}
    {esEnVivo && (
      <button onClick={() => onQrToggle(evento.id)}>
        📱 QR
      </button>
    )}
  </>
)}
```

---

## 📱 Layout Responsivo

### Breakpoints Tailwind
```css
/* Mobile-first */
- base: 0px (default)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

### Grid Layouts
```tsx
// Desktop
lg:grid-cols-[100px_1fr_auto]

// Tablet
md:grid-cols-2

// Mobile
grid (single column)
```

---

## 🔐 Seguridad & Performance

### Seguridad
- ✅ Links usando `target="_blank"` y `rel="noopener noreferrer"`
- ✅ No hay eval() o innerHTML inseguro
- ✅ Datos estáticos (no conectado a BD)
- ✅ CORS-safe con qrcode.react

### Performance
- ✅ Timer solo se ejecuta cada 30s (no en cada render)
- ✅ useEffect cleanup previene memory leaks
- ✅ Renderizado condicional (no renderiza QR innecesariamente)
- ✅ Image optimization con Next.js `<Image>`
- ✅ Lazy loading de componentes

### Bundle Size
- React: ~42KB
- Next.js: ~70KB
- Tailwind CSS: ~15KB (purged)
- qrcode.react: ~45KB
- **Total**: ~170KB (gzipped: ~50KB)

---

## 🧪 Pruebas Manuales

### Caso 1: Detección de Día Actual
**Pasos:**
1. Abre la app
2. Verifica que la pestaña del día actual esté seleccionada

**Esperado:**
- ✅ Pestaña correcta destaca en naranja

### Caso 2: Timer en Vivo
**Pasos:**
1. Modifica hora en sistema a 10:15 AM (durante un evento)
2. Recarga página
3. Espera 30 segundos

**Esperado:**
- ✅ Evento muestra "EN VIVO AHORA" con badge parpadeante
- ✅ Botón "Entrar Ahora" en naranja

### Caso 3: QR Modal
**Pasos:**
1. Simula evento en vivo
2. Hace click en botón "📱 QR"

**Esperado:**
- ✅ Aparece modal con código QR
- ✅ Escanear QR abre link de evento

### Caso 4: Responsividad
**Pasos:**
1. Abre en desktop (1920px)
2. Redimensiona a tablet (768px)
3. Redimensiona a mobile (375px)

**Esperado:**
- ✅ Layout se adapta correctamente
- ✅ Botones legibles en todas resoluciones

---

## 📚 Referencias

### Next.js 16 App Router
- https://nextjs.org/docs

### React 19 Hooks
- https://react.dev/reference/react

### Tailwind CSS 4
- https://tailwindcss.com/docs

### QRCode React
- https://github.com/davidcreate/react-qr-code

---

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Conectar repo a Vercel
# Auto-deploy en push
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Traditional Server
```bash
pnpm build
pnpm start  # En puerto 3000
```

---

**Documentación técnica completa ✓**
