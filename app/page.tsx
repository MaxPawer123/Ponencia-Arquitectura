'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { cronogramaEventos, convertirHoraAMinutos } from '@/lib/cronograma'
import type { Evento } from '@/lib/cronograma'

type EstadoEvento = 'en-vivo' | 'proximo' | 'pasado' | 'receso'

interface EventoConEstado extends Evento {
  estado: EstadoEvento
}

const DIAS_SEMANA = ['jueves02', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'lunes13'] as const
const ETIQUETAS_DIAS = {
  jueves02: 'Jueves 02',
  lunes: 'Lunes 06',
  martes: 'Martes 07',
  miercoles: 'Miércoles 08',
  jueves: 'Jueves 09',
  viernes: 'Viernes 10',
  lunes13: 'Lunes 13'
}

// Configuración de fechas en el calendario 2026 para cada pestaña del cronograma
// Año: 2026, Mes: 6 (Julio en Javascript, 0-indexed)
const MAPA_FECHAS_DIAS: Record<string, { year: number; month: number; date: number }> = {
  jueves02: { year: 2026, month: 6, date: 2 },  // 2 de Julio de 2026 (HOY)
  lunes: { year: 2026, month: 6, date: 6 },     // 6 de Julio de 2026
  martes: { year: 2026, month: 6, date: 7 },    // 7 de Julio de 2026
  miercoles: { year: 2026, month: 6, date: 8 }, // 8 de Julio de 2026
  jueves: { year: 2026, month: 6, date: 9 },    // 9 de Julio de 2026
  viernes: { year: 2026, month: 6, date: 10 },  // 10 de Julio de 2026
  lunes13: { year: 2026, month: 6, date: 13 },  // 13 de Julio de 2026
}

// Helper para saber si una clave de día corresponde al día de un objeto Date
const esElDiaDeHoy = (diaKey: string, fecha: Date): boolean => {
  const config = MAPA_FECHAS_DIAS[diaKey]
  if (!config) return false
  return (
    fecha.getFullYear() === config.year &&
    fecha.getMonth() === config.month &&
    fecha.getDate() === config.date
  )
}

// Helper para calcular el estado de una ponencia basado en la fecha del sistema actual
const obtenerEstadoEvento = (
  evento: Evento,
  diaKey: string,
  fecha: Date
): EstadoEvento => {
  const config = MAPA_FECHAS_DIAS[diaKey]
  if (!config) return 'proximo'

  const fechaEvento = new Date(config.year, config.month, config.date, 0, 0, 0)
  const fechaHoySinHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0)

  if (fechaHoySinHora.getTime() > fechaEvento.getTime()) {
    return 'pasado'
  } else if (fechaHoySinHora.getTime() < fechaEvento.getTime()) {
    return 'proximo'
  } else {
    // Es el mismo día calendario
    const minutosActuales = fecha.getHours() * 60 + fecha.getMinutes()
    const inicio = convertirHoraAMinutos(evento.horaInicio)
    const fin = convertirHoraAMinutos(evento.horaFin)

    if (minutosActuales < inicio) {
      return 'proximo'
    } else if (minutosActuales >= fin) {
      return 'pasado'
    } else {
      // Dentro del rango de tiempo
      return evento.expositores.length === 0 ? 'receso' : 'en-vivo'
    }
  }
}

// Helper para formatear la fecha actual de forma amigable en la UI
const formatearFechaBella = (date: Date): string => {
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  return date.toLocaleDateString('es-ES', opciones)
}

interface ModalAlertConfig {
  tipo: 'inicio' | 'cambio'
  titulo: string
  tituloAnterior?: string
  linkTransmision: string
  id: string
  nombrePonencia: string
  expositores?: string[]
  lugar?: string
}

export default function Page() {
  const [diaActual, setDiaActual] = useState<typeof DIAS_SEMANA[number]>('lunes')
  const [fechaSistema, setFechaSistema] = useState<Date | null>(null)
  const [eventosConEstado, setEventosConEstado] = useState<EventoConEstado[]>([])
  const [qrAbierto, setQrAbierto] = useState<string | null>(null)

  // Estados del Modal
  const [modalConfig, setModalConfig] = useState<ModalAlertConfig | null>(null)
  const [activePonenciaId, setActivePonenciaId] = useState<string | null>(null)

  // Timer en tiempo real con la hora nativa del dispositivo
  useEffect(() => {
    setFechaSistema(new Date())

    const intervalo = setInterval(() => {
      setFechaSistema(new Date())
    }, 1000) // Actualización al segundo para respuestas dinámicas inmediatas

    return () => clearInterval(intervalo)
  }, [])

  // 1. Selección Inicial Automática de la Pestaña al cargar y sincronización
  useEffect(() => {
    if (!fechaSistema) return

    const hoy = DIAS_SEMANA.find((d) => esElDiaDeHoy(d, fechaSistema))
    if (hoy) {
      setDiaActual(hoy)
    } else {
      // Si hoy está fuera del rango del evento, por defecto selecciona el primer día (lunes)
      setDiaActual('lunes')
    }
  }, [fechaSistema])

  // 2. Cálculo estricto del estado de las ponencias en base al calendario real
  useEffect(() => {
    if (!fechaSistema) return

    const eventosDelDia = cronogramaEventos[diaActual] || []
    const eventosActualizados = eventosDelDia.map((evento) => {
      const estado = obtenerEstadoEvento(evento, diaActual, fechaSistema)
      return { ...evento, estado } as EventoConEstado
    })

    setEventosConEstado(eventosActualizados)
  }, [diaActual, fechaSistema])

  // 3. Monitorear ponencias "En Vivo" del día real para disparar el modal automáticamente
  useEffect(() => {
    if (!fechaSistema) return

    // Buscar qué día corresponde a hoy en el calendario
    const diaHoy = DIAS_SEMANA.find((d) => esElDiaDeHoy(d, fechaSistema))
    if (!diaHoy) {
      setActivePonenciaId(null)
      return
    }

    // El modal de alerta SOLO debe saltar si el usuario está posicionado en el día correcto del calendario real
    if (diaActual !== diaHoy) {
      return
    }

    const eventosHoy = cronogramaEventos[diaHoy] || []
    const minutosActuales = fechaSistema.getHours() * 60 + fechaSistema.getMinutes()

    // Buscar si hay una ponencia activa en este momento
    const ponenciaEnVivo = eventosHoy.find((evento) => {
      const inicio = convertirHoraAMinutos(evento.horaInicio)
      const fin = convertirHoraAMinutos(evento.horaFin)
      return minutosActuales >= inicio && minutosActuales < fin && evento.expositores.length > 0
    })

    const nuevoId = ponenciaEnVivo ? ponenciaEnVivo.id : null

    if (nuevoId !== activePonenciaId) {
      if (ponenciaEnVivo) {
        if (activePonenciaId === null) {
          // A. Inicio de una nueva ponencia desde estado sin ponencia activa
          setModalConfig({
            tipo: 'inicio',
            titulo: '¡El evento está comenzando!',
            linkTransmision: ponenciaEnVivo.linkTransmision,
            id: ponenciaEnVivo.id,
            nombrePonencia: ponenciaEnVivo.titulo,
            expositores: ponenciaEnVivo.expositores,
            lugar: ponenciaEnVivo.lugar
          })
        } else {
          // B. Cambio de bloque: finalizó una y empezó inmediatamente la siguiente
          const ponenciaAnterior = Object.values(cronogramaEventos)
            .flat()
            .find((e) => e.id === activePonenciaId)

          setModalConfig({
            tipo: 'cambio',
            titulo: 'La ponencia anterior ha finalizado. Ha comenzado:',
            tituloAnterior: ponenciaAnterior?.titulo,
            linkTransmision: ponenciaEnVivo.linkTransmision,
            id: ponenciaEnVivo.id,
            nombrePonencia: ponenciaEnVivo.titulo,
            expositores: ponenciaEnVivo.expositores,
            lugar: ponenciaEnVivo.lugar
          })
        }
      } else {
        // C. Expiración de ponencia sin relevo directo (receso o fin de la jornada)
        setModalConfig(null)
      }
      setActivePonenciaId(nuevoId)
    }
  }, [fechaSistema, diaActual, activePonenciaId])

  const tieneEnVivo = eventosConEstado.some((e) => e.estado === 'en-vivo')

  return (
    <main className="min-h-screen bg-white">
      {/* Estilos locales para animación de modales */}
      <style jsx global>{`
        @keyframes modalScaleUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-pop {
          animation: modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

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
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="font-semibold">📅 6 - 13 de Julio, 2026</span>
                  {fechaSistema && (
                    <span className="text-gray-400">
                      | Hoy: <span className="font-medium text-gray-700 capitalize">{formatearFechaBella(fechaSistema)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Badge EN VIVO */}
            {tieneEnVivo && (
              <div className="flex items-center gap-3 rounded-lg px-6 py-4 animate-pulse" style={{ backgroundColor: '#E5820C' }}>
                <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
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
          <p className="mb-8 text-gray-600 text-sm md:text-base">Selecciona un día para ver las ponencias programadas</p>

          {/* Tabs de días */}
          <div className="mb-8 flex flex-wrap gap-2 lg:gap-3">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia}
                onClick={() => {
                  setDiaActual(dia)
                  setQrAbierto(null)
                }}
                className={`rounded-lg px-4 py-2 font-semibold transition-all duration-200 lg:px-6 lg:py-3 cursor-pointer ${diaActual === dia
                  ? 'text-white shadow-md'
                  : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600'
                  }`}
                style={
                  diaActual === dia
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

      {/* Ventana Modal Emergente de Alerta de Transmisión */}
      {modalConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md animate-modal-pop rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Alerta de Transmisión
                  </span>
                </div>
                <button
                  onClick={() => setModalConfig(null)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
                  title="Cerrar modal"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {modalConfig.titulo}
                </h3>

                {modalConfig.tipo === 'cambio' && modalConfig.tituloAnterior && (
                  <p className="text-xs text-gray-500 italic">
                    Anterior: <span className="line-through">{modalConfig.tituloAnterior}</span>
                  </p>
                )}

                <div className="rounded-lg bg-orange-50/50 p-4 border border-orange-100">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">
                    {modalConfig.nombrePonencia}
                  </h4>
                  {modalConfig.expositores && modalConfig.expositores.length > 0 && (
                    <p className="mt-1.5 text-xs md:text-sm text-gray-600">
                      🎙️ {modalConfig.expositores.join(', ')}
                    </p>
                  )}
                  {modalConfig.lugar && (
                    <p className="mt-1 text-xs text-gray-500">
                      📍 {modalConfig.lugar}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setModalConfig(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Descartar
                </button>
                <a
                  href={modalConfig.linkTransmision}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setModalConfig(null)}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-95 active:brightness-90 transition-all cursor-pointer flex items-center gap-1.5"
                  style={{ backgroundColor: '#E5820C' }}
                >
                  Ir a la Transmisión
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <p>© 2026 Facultad de Arquitectura, Artes, Diseño y Urbanismo (FAADU) - UMSA. Todos los derechos reservados.</p>
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
      className={`relative rounded-lg border-2 p-6 transition-all duration-300 ${esEnVivo
        ? 'border-orange-600 bg-orange-50 shadow-lg'
        : esPasado
          ? 'border-gray-200 bg-gray-100 opacity-80'
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
      <div className="grid gap-4 lg:grid-cols-[130px_1fr_auto] lg:items-center">
        {/* Hora con alto contraste y visibilidad garantizada */}
        <div className="flex items-center justify-center lg:justify-start min-w-[110px]">
          <span
            className={`font-extrabold text-base lg:text-lg tracking-tight ${esEnVivo ? 'text-orange-600' : 'text-neutral-950'
              }`}
            style={esEnVivo ? { color: '#E5820C' } : {}}
          >
            {evento.horaInicio} - {evento.horaFin}
          </span>
        </div>

        {/* Título y Expositores */}
        <div className="flex flex-col gap-2 pt-4 lg:pt-0">
          <h3 className={`font-bold text-neutral-900 text-sm md:text-base ${esPasado ? 'text-neutral-700' : ''}`}>
            {evento.titulo}
          </h3>
          {tieneExpo && (
            <p className={`text-sm font-medium ${esPasado ? 'text-neutral-500' : 'text-neutral-600'}`}>
              {evento.expositores.join(', ')}
            </p>
          )}
          {evento.lugar && (
            <p className="text-xs text-neutral-500">
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
              className={`rounded px-4 py-2 font-bold text-sm text-white transition-all duration-200 cursor-pointer ${esEnVivo ? 'animate-pulse' : esPasado ? 'cursor-not-allowed opacity-50' : ''
                }`}
              style={esEnVivo ? { backgroundColor: '#E5820C' } : { backgroundColor: '#D4691A' }}
            >
              {esEnVivo ? 'Entrar Ahora' : esPasado ? 'Finalizado' : 'Entrar'}
            </a>

            {/* Botón QR */}
            {esEnVivo && (
              <button
                onClick={() => onQrToggle(qrAbierto === evento.id ? null : evento.id)}
                className="rounded border-2 px-3 py-2 font-semibold text-sm transition-all duration-200 cursor-pointer"
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
                className="flex items-center justify-center rounded px-3 py-2 transition-all duration-200 cursor-pointer"
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
