'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { cronogramaEventos, convertirHoraAMinutos } from '@/lib/cronograma'
import type { Evento } from '@/lib/cronograma'

// ============================================================================
// DEBUG MODE: Cambiar a true para simular una fecha/hora específica
// ============================================================================
const SIMULATE_LIVE_DATE = false
const SIMULATED_DATE = new Date(2025, 8, 10, 10, 45) // Viernes 10 Septiembre 10:45

// ============================================================================
// CONFIGURACIÓN DE FECHAS REALES DEL EVENTO (6-13 de Septiembre 2025)
// ============================================================================
const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'lunes13'] as const
const ETIQUETAS_DIAS = {
  lunes: 'Lunes 06',
  martes: 'Martes 07',
  miercoles: 'Miércoles 08',
  jueves: 'Jueves 09',
  viernes: 'Viernes 10',
  lunes13: 'Lunes 13'
}

// Fechas reales del evento (6-13 de Septiembre 2025)
// Nota: Mes 8 en JS = Septiembre (0-indexado)
const FECHA_EVENTO: Record<typeof DIAS_SEMANA[number], Date> = {
  lunes: new Date(2025, 8, 6),      // 6 septiembre
  martes: new Date(2025, 8, 7),     // 7 septiembre
  miercoles: new Date(2025, 8, 8),  // 8 septiembre
  jueves: new Date(2025, 8, 9),     // 9 septiembre
  viernes: new Date(2025, 8, 10),   // 10 septiembre
  lunes13: new Date(2025, 8, 13)    // 13 septiembre
}

type EstadoEvento = 'en-vivo' | 'proximo' | 'pasado' | 'receso'

interface EventoConEstado extends Evento {
  estado: EstadoEvento
}

/**
 * Compara dos fechas ignorando la hora (solo compara año, mes, día)
 */
function sonfechasIguales(fecha1: Date, fecha2: Date): boolean {
  return (
    fecha1.getFullYear() === fecha2.getFullYear() &&
    fecha1.getMonth() === fecha2.getMonth() &&
    fecha1.getDate() === fecha2.getDate()
  )
}

/**
 * Obtiene la fecha actual, considerando el modo de simulación para debug
 */
function getAhora(): Date {
  if (SIMULATE_LIVE_DATE) {
    console.log('[DEBUG] Usando fecha simulada:', SIMULATED_DATE.toLocaleString())
    return new Date(SIMULATED_DATE)
  }
  return new Date()
}

/**
 * Determina si el día seleccionado en la UI coincide con el día real del sistema
 */
function diaSeleccionadoEsHoy(
  diaSeleccionado: typeof DIAS_SEMANA[number],
  fechaActual: Date
): boolean {
  const fechaDiaSeleccionado = FECHA_EVENTO[diaSeleccionado]
  return sonfechasIguales(fechaActual, fechaDiaSeleccionado)
}

export default function Page() {
  // ========================================================================
  // ESTADO
  // ========================================================================
  const [diaSeleccionado, setDiaSeleccionado] = useState<typeof DIAS_SEMANA[number]>('lunes')
  const [horaActual, setHoraActual] = useState<number>(0)
  const [eventosConEstado, setEventosConEstado] = useState<EventoConEstado[]>([])
  const [qrAbierto, setQrAbierto] = useState<string | null>(null)
  const [activePonenciaId, setActivePonenciaId] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [fechaActual, setFechaActual] = useState<Date>(getAhora())

  // Refs para tracking de estado global (independiente del día seleccionado)
  const previousActivePonenciaRef = useRef<string | null>(null)
  const ultimaFechaValidadaRef = useRef<Date>(getAhora())

  // ========================================================================
  // EFECTO 1: Detectar qué día mostrar por defecto en la UI
  // ========================================================================
  useEffect(() => {
    const ahora = getAhora()
    let diaParaMostrar: typeof DIAS_SEMANA[number] = 'lunes'

    // Buscar cuál día del evento es hoy
    for (const dia of DIAS_SEMANA) {
      if (diaSeleccionadoEsHoy(dia, ahora)) {
        diaParaMostrar = dia
        break
      }
    }

    setDiaSeleccionado(diaParaMostrar)
  }, [])

  // ========================================================================
  // EFECTO 2: Timer en tiempo real que actualiza CADA SEGUNDO
  // Responsable de:
  // - Validar qué evento está EN VIVO en tiempo real
  // - Mostrar modal cuando comienza un evento
  // - Actualizar hora en la UI
  // ========================================================================
  useEffect(() => {
    const actualizarTiempoReal = () => {
      const ahora = getAhora()
      const minutos = ahora.getHours() * 60 + ahora.getMinutes()

      setFechaActual(ahora)
      setHoraActual(minutos)

      // ====================================================================
      // VALIDACIÓN ESTRICTA DE "EN VIVO": 3 CONDICIONES SIMULTÁNEAS
      // ====================================================================
      // 1. El día real del sistema debe coincidir con una fecha del evento
      // 2. Ese día real debe tener eventos en el cronograma
      // 3. La hora actual debe estar dentro del rango horaInicio-horaFin
      // ====================================================================

      let eventoActivoEnElSistema: EventoConEstado | null = null

      // Buscar el día que coincide con hoy
      for (const dia of DIAS_SEMANA) {
        if (diaSeleccionadoEsHoy(dia, ahora)) {
          // El día del sistema coincide con este día del evento
          const eventosDelDiaReal = cronogramaEventos[dia] || []

          for (const evento of eventosDelDiaReal) {
            const horaInicio = convertirHoraAMinutos(evento.horaInicio)
            const horaFin = convertirHoraAMinutos(evento.horaFin)

            // Solo si la hora está en el rango Y hay expositores
            if (minutos >= horaInicio && minutos < horaFin && evento.expositores.length > 0) {
              eventoActivoEnElSistema = { ...evento, estado: 'en-vivo' } as EventoConEstado
              break
            }
          }
          break
        }
      }

      // ====================================================================
      // LÓGICA DE MODALES: Detectar transiciones de eventos
      // ====================================================================
      if (
        eventoActivoEnElSistema &&
        eventoActivoEnElSistema.id !== previousActivePonenciaRef.current
      ) {
        // Un nuevo evento comenzó
        setActivePonenciaId(eventoActivoEnElSistema.id)
        setMostrarModal(true)
        previousActivePonenciaRef.current = eventoActivoEnElSistema.id
      } else if (!eventoActivoEnElSistema && previousActivePonenciaRef.current) {
        // El evento que estaba activo terminó
        previousActivePonenciaRef.current = null
        setActivePonenciaId(null)
      }

      ultimaFechaValidadaRef.current = ahora
    }

    actualizarTiempoReal()
    const intervalo = setInterval(actualizarTiempoReal, 1000) // Cada 1 segundo para máxima precisión
    return () => clearInterval(intervalo)
  }, [])

  // ========================================================================
  // EFECTO 3: Actualizar eventos mostrados en la UI cuando cambia el día
  // seleccionado o la hora. IMPORTANTE: La lógica de "EN VIVO" solo aplica
  // si el día seleccionado es HOY, de lo contrario todos serán "próximo/pasado"
  // ========================================================================
  useEffect(() => {
    const ahora = getAhora()
    const minutos = ahora.getHours() * 60 + ahora.getMinutes()

    const eventosDelDia = cronogramaEventos[diaSeleccionado] || []
    const eventosActualizados = eventosDelDia.map((evento) => {
      const horaInicio = convertirHoraAMinutos(evento.horaInicio)
      const horaFin = convertirHoraAMinutos(evento.horaFin)

      let estado: EstadoEvento = 'proximo'

      // CRÍTICO: Solo mostrar "EN VIVO" si el día seleccionado es HOY
      const diaSeleccionadoEsHoy = diaSeleccionadoEsHoy(diaSeleccionado, ahora)

      if (diaSeleccionadoEsHoy && minutos >= horaInicio && minutos < horaFin) {
        // El día seleccionado es hoy Y la hora está en rango
        estado = evento.expositores.length === 0 ? 'receso' : 'en-vivo'
      } else if (diaSeleccionadoEsHoy && minutos >= horaFin) {
        // El día seleccionado es hoy Y la hora ya pasó
        estado = 'pasado'
      } else if (!diaSeleccionadoEsHoy) {
        // El día seleccionado NO es hoy, determinar si es futuro o pasado
        const fechaDiaSeleccionado = FECHA_EVENTO[diaSeleccionado]
        const esAnteriorAHoy = fechaDiaSeleccionado < ahora
        estado = esAnteriorAHoy ? 'pasado' : 'proximo'
      }

      return { ...evento, estado } as EventoConEstado
    })

    setEventosConEstado(eventosActualizados)
  }, [diaSeleccionado, horaActual])

  // ========================================================================
  // CÁLCULOS
  // ========================================================================
  const tieneEnVivo = eventosConEstado.some((e) => e.estado === 'en-vivo')
  const eventoModalActual = activePonenciaId
    ? eventosConEstado.find((e) => e.id === activePonenciaId)
    : null

  return (
    <main className="min-h-screen bg-white">
      {/* Modal Alerta de Ponencia EN VIVO */}
      {mostrarModal && eventoModalActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="w-full max-w-md rounded-lg border-2 border-gray-200 bg-white p-8 shadow-2xl">
            {/* Indicador EN VIVO */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
              <span className="font-bold text-gray-900">EN VIVO AHORA</span>
            </div>

            {/* Contenido */}
            <div className="mb-6 text-center">
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                {previousActivePonenciaRef.current === eventoModalActual.id
                  ? '¡El evento está comenzando!'
                  : 'Ha comenzado una nueva ponencia'}
              </h2>
              <p className="mb-2 font-semibold text-gray-700">
                {eventoModalActual.titulo}
              </p>
              <p className="text-sm text-gray-600">
                {eventoModalActual.horaInicio} - {eventoModalActual.horaFin}
              </p>
              {eventoModalActual.expositores.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Expositores:</strong> {eventoModalActual.expositores.join(', ')}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                Recordarme después
              </button>
              <a
                href={eventoModalActual.linkTransmision}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#E5820C' }}
              >
                Ir a la Transmisión
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-gradient-to-r from-white via-orange-50 to-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo y Título */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <Image
                    src="/faadu-logo.png"
                    alt="FAADU UMSA"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                    Evento de Ponencias
                  </h1>
                  <p className="text-lg font-semibold" style={{ color: '#E5820C' }}>
                    Arquitectura 2026
                  </p>
                </div>
              </div>

              {/* Información del evento */}
              <div className="space-y-2">
                <p className="text-gray-700">
                  Encuentro académico integral sobre arquitectura, urbanismo, patrimonio e innovación
                  digital en la disciplina arquitectónica.
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">📅 8 - 13 de Septiembre, 2025</span>
                </div>
              </div>
            </div>

            {/* Badge EN VIVO */}
            {tieneEnVivo && (
              <div className="flex items-center gap-3 rounded-lg px-6 py-4" style={{ backgroundColor: '#E5820C' }}>
                <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
                <span className="font-bold text-white">EN VIVO AHORA</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 lg:text-4xl">
            Cronograma del Evento
          </h2>
          <p className="mb-8 text-gray-600">Selecciona un día para ver las ponencias programadas</p>

          {/* Tabs de días */}
          <div className="mb-8 flex flex-wrap gap-2 lg:gap-3">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia}
                onClick={() => {
                  setDiaSeleccionado(dia)
                  setQrAbierto(null)
                }}
                className={`rounded-lg px-4 py-2 font-semibold transition-all duration-200 lg:px-6 lg:py-3 ${
                  diaSeleccionado === dia
                    ? 'text-white'
                    : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600'
                }`}
                style={
                  diaSeleccionado === dia
                    ? { backgroundColor: '#E5820C' }
                    : {}
                }
              >
                {ETIQUETAS_DIAS[dia]}
              </button>
            ))}
          </div>

          {/* Eventos del día */}
          <div className="space-y-3">
            {eventosConEstado.length > 0 ? (
              eventosConEstado.map((evento) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  qrAbierto={qrAbierto}
                  onQrToggle={setQrAbierto}
                />
              ))
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="text-gray-500">No hay eventos programados para este día.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-bold text-gray-900">Sobre el Evento</h3>
              <p className="text-sm text-gray-600">
                Evento de Ponencias organizado por la Facultad de Arquitectura, Artes, Diseño y Urbanismo - UMSA.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-gray-900">Contacto</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Email: info@faadu.edu.bo</li>
                <li>Teléfono: +591 (2) 123-4567</li>
                <li>La Paz, Bolivia</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-gray-900">Síguenos</h3>
              <div className="flex gap-4">
                <a href="#" className="transition-colors" style={{ color: '#E5820C' }}>
                  Facebook
                </a>
                <a href="#" className="transition-colors" style={{ color: '#E5820C' }}>
                  Instagram
                </a>
                <a href="#" className="transition-colors" style={{ color: '#E5820C' }}>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Facultad de Arquitectura, Artes, Diseño y Urbanismo (FAADU) - UMSA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

interface EventoCardProps {
  evento: EventoConEstado
  qrAbierto: string | null
  onQrToggle: (id: string | null) => void
}

function EventoCard({ evento, qrAbierto, onQrToggle }: EventoCardProps) {
  const esEnVivo = evento.estado === 'en-vivo'
  const esReceso = evento.estado === 'receso'
  const esPasado = evento.estado === 'pasado'
  const tieneExpo = evento.expositores.length > 0

  return (
    <div
      className={`relative rounded-lg border-2 p-6 transition-all duration-300 ${
        esEnVivo
          ? 'border-orange-600 bg-orange-50 shadow-lg'
          : esPasado
            ? 'border-gray-200 bg-gray-100 opacity-60'
            : 'border-gray-200 bg-white hover:shadow-md'
      } ${esReceso ? 'border-dashed' : ''}`}
      style={esEnVivo ? { borderColor: '#E5820C', backgroundColor: '#FFF5E6' } : {}}
    >
      {/* Badge EN VIVO */}
      {esEnVivo && (
        <div
          className="absolute -top-3 left-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
          style={{ backgroundColor: '#E5820C' }}
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
          <span className="text-xs font-bold text-white lg:text-sm">EN VIVO AHORA</span>
        </div>
      )}

      {/* Contenido */}
      <div className="grid gap-4 lg:grid-cols-[100px_1fr_auto] lg:items-center">
        {/* Hora */}
        <div className="flex items-center justify-center lg:justify-start">
          <span
            className={`font-bold ${
              esEnVivo ? '' : esPasado ? 'text-gray-500' : ''
            }`}
            style={esEnVivo ? { color: '#E5820C' } : {}}
          >
            {evento.horaInicio} - {evento.horaFin}
          </span>
        </div>

        {/* Título y Expositores */}
        <div className="flex flex-col gap-2 pt-4 lg:pt-0">
          <h3 className={`font-bold text-gray-900 ${esPasado ? 'text-gray-600' : ''}`}>
            {evento.titulo}
          </h3>
          {tieneExpo && (
            <p className={`text-sm ${esPasado ? 'text-gray-500' : 'text-gray-600'}`}>
              {evento.expositores.join(', ')}
            </p>
          )}
          {evento.lugar && (
            <p className={`text-xs ${esPasado ? 'text-gray-500' : 'text-gray-500'}`}>
              📍 {evento.lugar}
            </p>
          )}
        </div>

        {/* Acciones */}
        {!esReceso && tieneExpo && (
          <div className="flex gap-2 pt-4 lg:pt-0">
            {/* Botón Entrar */}
            <a
              href={evento.linkTransmision}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded px-4 py-2 font-semibold text-white transition-all duration-200 ${
                esEnVivo ? 'animate-pulse' : esPasado ? 'cursor-not-allowed opacity-50' : ''
              }`}
              style={esEnVivo ? { backgroundColor: '#E5820C' } : { backgroundColor: '#D4691A' }}
            >
              {esEnVivo ? 'Entrar Ahora' : esPasado ? 'Finalizado' : 'Entrar'}
            </a>

            {/* Botón QR */}
            {esEnVivo && (
              <button
                onClick={() => onQrToggle(qrAbierto === evento.id ? null : evento.id)}
                className="rounded border-2 px-3 py-2 font-semibold transition-all duration-200"
                style={{
                  borderColor: '#E5820C',
                  color: '#E5820C',
                  backgroundColor: 'white'
                }}
                title="Ver Código QR"
              >
                📱 QR
              </button>
            )}

            {/* Icono enlace externo */}
            {esEnVivo && (
              <a
                href={evento.linkTransmision}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded px-3 py-2 transition-all duration-200"
                style={{ color: '#E5820C' }}
                title="Abrir enlace"
              >
                🔗
              </a>
            )}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrAbierto === evento.id && esEnVivo && (
        <div className="absolute bottom-16 right-0 z-50 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-xl lg:bottom-auto lg:top-full lg:mt-2">
          <QRCodeSVG
            value={evento.linkTransmision}
            size={120}
            level="H"
            includeMargin={true}
          />
          <p className="mt-2 text-center text-xs font-semibold text-gray-600">Escanea para entrar</p>
        </div>
      )}
    </div>
  )
}
