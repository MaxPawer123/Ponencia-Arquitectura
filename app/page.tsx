'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { Calendar, Clock } from 'lucide-react'
import { cronogramaEventos, convertirHoraAMinutos } from '@/lib/cronograma'
import type { Evento } from '@/lib/cronograma'

type EstadoEvento = 'en-vivo' | 'proximo' | 'pasado' | 'receso'

interface EventoConEstado extends Evento {
  estado: EstadoEvento
}

const DIAS_SEMANA = ['viernes03', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'lunes13'] as const
const ETIQUETAS_DIAS = {
  viernes03: 'Viernes 03',
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
  viernes03: { year: 2026, month: 6, date: 3 },
  lunes: { year: 2026, month: 6, date: 6 },
  martes: { year: 2026, month: 6, date: 7 },
  miercoles: { year: 2026, month: 6, date: 8 },
  jueves: { year: 2026, month: 6, date: 9 },
  viernes: { year: 2026, month: 6, date: 10 },
  lunes13: { year: 2026, month: 6, date: 13 },
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

// Helper para obtener la fecha de forma dinámica en formato "[Día] [DD/MM/AAAA]"
const obtenerFechaFormateada = (diaKey: string): string => {
  const config = MAPA_FECHAS_DIAS[diaKey]
  if (!config) return ''
  const etiqueta = ETIQUETAS_DIAS[diaKey as keyof typeof ETIQUETAS_DIAS] || ''
  const diaNombre = etiqueta.split(' ')[0]
  const diaNum = String(config.date).padStart(2, '0')
  const mesNum = String(config.month + 1).padStart(2, '0')
  const añoNum = config.year
  return `${diaNombre} ${diaNum}/${mesNum}/${añoNum}`
}

interface ModalAlertConfig {
  tipo: 'inicio' | 'cambio'
  titulo: string
  tituloAnterior?: string
  linkFacebook: string
  id: string
  nombrePonencia: string
  expositores?: string[]
  lugar?: string
  horaInicio?: string
  horaFin?: string
  fechaFormateada: string
}

export default function Page() {
  const [diaActual, setDiaActual] = useState<typeof DIAS_SEMANA[number]>('viernes03')
  const [fechaSistema, setFechaSistema] = useState<Date | null>(null)
  const [eventosConEstado, setEventosConEstado] = useState<EventoConEstado[]>([])

  // Estados del Modal y del QR Expandido
  const [modalConfig, setModalConfig] = useState<ModalAlertConfig | null>(null)
  const [activePonenciaId, setActivePonenciaId] = useState<string | null>(null)
  const [qrAmpliado, setQrAmpliado] = useState<string | null>(null)

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
      // Fallback a viernes03 si hoy está fuera del rango del cronograma
      setDiaActual('viernes03')
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
      setModalConfig(null)
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
        const fechaFormateada = obtenerFechaFormateada(diaHoy)
        if (activePonenciaId === null) {
          // A. Inicio de una nueva ponencia desde estado sin ponencia activa
          setModalConfig({
            tipo: 'inicio',
            titulo: '¡El evento está comenzando!',
            linkFacebook: ponenciaEnVivo.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633',
            id: ponenciaEnVivo.id,
            nombrePonencia: ponenciaEnVivo.titulo,
            expositores: ponenciaEnVivo.expositores,
            lugar: ponenciaEnVivo.lugar,
            horaInicio: ponenciaEnVivo.horaInicio,
            horaFin: ponenciaEnVivo.horaFin,
            fechaFormateada: fechaFormateada
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
            linkFacebook: ponenciaEnVivo.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633',
            id: ponenciaEnVivo.id,
            nombrePonencia: ponenciaEnVivo.titulo,
            expositores: ponenciaEnVivo.expositores,
            lugar: ponenciaEnVivo.lugar,
            horaInicio: ponenciaEnVivo.horaInicio,
            horaFin: ponenciaEnVivo.horaFin,
            fechaFormateada: fechaFormateada
          })
        }
      } else {
        // C. Expiración de ponencia sin relevo directo (receso o fin de la jornada)
        setModalConfig(null)
      }
      setActivePonenciaId(nuevoId)
    }
  }, [fechaSistema, activePonenciaId])

  const tieneEnVivo = eventosConEstado.some((e) => e.estado === 'en-vivo')

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
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

      <div>
        {/* Header Institucional de Tres Columnas */}
        <header className="border-b-2 border-gray-200 bg-white py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center">
              {/* Columna Izquierda: Escudo UMSA */}
              <div className="flex justify-center md:justify-start shrink-0">
                <img
                  src="/Logo_Umsa.png"
                  alt="Logo UMSA"
                  className="h-24 object-contain"
                />
              </div>

              {/* Columna Central: Texto Centrado */}
              <div className="text-center flex flex-col justify-center space-y-1 md:px-4">
                <span className="text-xs tracking-wider text-gray-500 font-semibold uppercase">
                  Universidad Mayor de San Andrés
                </span>
                <span className="text-xs tracking-wider text-gray-500 font-semibold uppercase">
                  Facultad de Arquitectura, Artes, Diseño y Urbanismo
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 leading-tight">
                  Jornadas de Rediseño de la Malla Curricular de la Carrera de Arquitectura
                </h1>
                <p className="text-sm text-orange-600 font-medium italic">
                  Hacia la nueva Curricula de la Carrera de Arquitectura por Competencias
                </p>
                {fechaSistema && (
                  <div className="text-xs text-gray-400 mt-1">
                    Hoy: <span className="font-semibold text-gray-700 capitalize">{formatearFechaBella(fechaSistema)}</span>
                  </div>
                )}
              </div>

              {/* Columna Derecha: Isotipo FAADU */}
              <div className="flex justify-center md:justify-end shrink-0">
                <img
                  src="/faadu-logo.png"
                  alt="faadu-logo"
                  className="h-24 object-contain"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Bloques de la APP (Sección Central del Cronograma) */}
        <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  Cronograma del Evento
                </h2>
                <p className="text-gray-600 text-xs md:text-sm">
                  Selecciona un día para ver los bloques de ponencias programados
                </p>
              </div>

              {/* Badge EN VIVO global */}
              {tieneEnVivo && (
                <div className="flex items-center gap-3 rounded-lg px-5 py-2.5 animate-pulse bg-orange-600 max-w-fit">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-white"></span>
                  <span className="font-bold text-white text-xs sm:text-sm">EN VIVO AHORA</span>
                </div>
              )}
            </div>

            {/* Tabs de días */}
            <div className="mb-8 flex flex-wrap gap-2 lg:gap-3">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia}
                  onClick={() => {
                    setDiaActual(dia)
                    setModalConfig(null)
                  }}
                  className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 lg:px-6 lg:py-3 cursor-pointer ${diaActual === dia
                    ? 'text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600'
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
                    onQrClick={setQrAmpliado}
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
      </div>

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
              <div className="space-y-3.5">
                <h3 className="text-lg font-extrabold text-neutral-950 leading-tight">
                  {modalConfig.titulo}
                </h3>

                {modalConfig.tipo === 'cambio' && modalConfig.tituloAnterior && (
                  <p className="text-xs text-gray-500 italic">
                    Anterior: <span className="line-through">{modalConfig.tituloAnterior}</span>
                  </p>
                )}

                {/* Fila destacada justo debajo del título */}
                <div className="flex items-center gap-2 rounded-lg bg-orange-100/60 px-3.5 py-2.5 border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600 animate-pulse shrink-0" />
                  <span className="text-sm font-bold text-neutral-950">
                    Horario de Transmisión: <span className="font-extrabold text-black">{modalConfig.horaInicio} - {modalConfig.horaFin}</span>
                  </span>
                </div>

                {/* Caja color crema con orden jerárquico */}
                <div className="rounded-xl bg-[#FAF6F0] p-5 border border-amber-200/60 shadow-inner space-y-3">
                  {/* 1. Título de la Ponencia */}
                  <h4 className="text-base font-extrabold text-gray-900 leading-snug">
                    {modalConfig.nombrePonencia}
                  </h4>

                  {/* 2. 📅 Fecha: [Día] [DD/MM/AAAA] (Dinámico) */}
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs bg-amber-100/50 px-2.5 py-1 rounded-md w-fit border border-amber-200/50">
                    <Calendar className="h-3.5 w-3.5 text-amber-700" />
                    <span>Fecha: {modalConfig.fechaFormateada}</span>
                  </div>

                  {/* 3. 🕒 Horario */}
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs bg-amber-100/50 px-2.5 py-1 rounded-md w-fit border border-amber-200/50">
                    <Clock className="h-3.5 w-3.5 text-amber-700" />
                    <span>Horario: {modalConfig.horaInicio} - {modalConfig.horaFin}</span>
                  </div>

                  {/* 4. 🎙️ Expositores */}
                  {modalConfig.expositores && modalConfig.expositores.length > 0 && (
                    <div className="text-xs md:text-sm text-gray-600 flex items-start gap-1.5">
                      <span className="shrink-0 text-gray-500">🎙️</span>
                      <p>
                        <strong className="font-semibold text-gray-700">Expositores:</strong> {modalConfig.expositores.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* 5. 📍 Lugar / Auditorio */}
                  {modalConfig.lugar && (
                    <div className="text-xs text-gray-500 flex items-start gap-1.5">
                      <span className="shrink-0 text-gray-400">📍</span>
                      <p>
                        <strong className="font-semibold text-gray-600">Lugar:</strong> {modalConfig.lugar}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Exclusive Facebook Live Channel */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                {/* Facebook Live Option */}
                <div className="flex items-center justify-between gap-2.5 rounded-lg border border-blue-200 bg-blue-50/10 p-2.5 shadow-sm w-full sm:w-auto flex-1">
                  <div className="flex-1 min-w-0">
                    <a
                      href={modalConfig.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setModalConfig(null)}
                      className="w-full text-center rounded-lg px-3 py-2 text-xs font-bold text-white shadow-md hover:brightness-95 active:brightness-90 transition-all cursor-pointer block bg-[#1877F2]"
                    >
                      Entrar a Facebook Live
                    </a>
                  </div>
                  <div
                    className="shrink-0 flex items-center justify-center bg-white p-1 rounded-md border border-blue-200 hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                    title="Click para ampliar QR"
                    onClick={() => setQrAmpliado(modalConfig.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633')}
                  >
                    <QRCodeSVG
                      value={modalConfig.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633'}
                      size={48}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* Descartar Button */}
                <button
                  onClick={() => setModalConfig(null)}
                  className="w-full sm:w-auto rounded-lg border border-gray-200 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal para QR Ampliado */}
      {qrAmpliado && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-zoom-out p-4"
          onClick={() => setQrAmpliado(null)}
        >
          <div
            className="relative bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center border border-gray-100 max-w-sm w-full animate-modal-pop cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setQrAmpliado(null)}
              className="absolute top-3 right-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
              title="Cerrar vista ampliada"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* QR Content */}
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm mt-4">
              <QRCodeSVG
                value={qrAmpliado}
                size={300}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="mt-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              Escanea para entrar a la transmisión
            </p>
          </div>
        </div>
      )}

      {/* Footer Institucional de Dos Columnas */}
      <footer className="border-t-2 border-gray-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            {/* Columna Izquierda: Información CRTP */}
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-base font-extrabold text-neutral-900 uppercase tracking-tight">
                Centro de Recursos Tecnológicos y Pedagógicos
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
                Calle Héroes del Acre Nro. 1850 | Teléfono: (591-2) 2491481 2484818-int 117 | Email:{' '}
                <a href="mailto:faadu.crtp@umsa.bo" className="text-orange-600 font-semibold hover:underline">
                  faadu.crtp@umsa.bo
                </a>
              </p>
            </div>

            {/* Columna Derecha: Logo CRTP */}
            <div className="flex justify-center md:justify-end shrink-0">
              <img
                src="/logo_crtp.png"
                alt="Logo CRTP FAADU-UMSA"
                className="h-20 object-contain"
              />
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
            <p>© 2026 Facultad de Arquitectura, Artes, Diseño y Urbanismo (FAADU) - UMSA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

interface EventoCardProps {
  evento: EventoConEstado
  onQrClick: (url: string) => void
}

function EventoCard({ evento, onQrClick }: EventoCardProps) {
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
          <div className="flex items-center gap-3 pt-4 lg:pt-0">
            {esEnVivo ? (
              <div className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50/10 p-2 shadow-sm">
                <a
                  href={evento.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-95 active:brightness-90 transition-all cursor-pointer block bg-[#1877F2]"
                >
                  Entrar a Facebook Live
                </a>
                <div
                  className="shrink-0 flex items-center justify-center bg-white p-1 rounded border border-blue-200 hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                  title="Click para ampliar QR"
                  onClick={() => onQrClick(evento.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633')}
                >
                  {evento.qrFacebook ? (
                    <img
                      src={evento.qrFacebook}
                      alt="Código QR Facebook"
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <QRCodeSVG
                      value={evento.linkFacebook || 'https://www.facebook.com/profile.php?id=100047802766633'}
                      size={40}
                      level="M"
                      includeMargin={false}
                    />
                  )}
                </div>
              </div>
            ) : (
              <a
                href={evento.linkFacebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-lg px-4 py-2.5 font-bold text-sm text-white transition-all duration-200 cursor-pointer ${esPasado ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                onClick={(e) => {
                  if (esPasado || !evento.linkFacebook) e.preventDefault()
                }}
              >
                {esPasado ? 'Finalizado' : 'Entrar'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
