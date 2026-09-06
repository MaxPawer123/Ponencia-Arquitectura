import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Calendar, Clock, MapPin, X, Users, Plus, FileText } from 'lucide-react'

// Icono personalizado de Facebook para evitar problemas de versión en lucide-react
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// ─── Interfaces de TypeScript (Requeridas) ────────────────────────────────────

interface Ponencia {
  id: string
  titulo: string
  ponente: string
  hora: string        // "HH:MM - HH:MM"
  lugar: string
  // Campos extendidos para compatibilidad con la logica existente
  horaInicio: string
  horaFin: string
  expositores: string[]
  linkFacebook: string
}

interface DiaEvento {
  id: string
  fecha: string       // Nombre / etiqueta del dia, p.ej. "Lunes 06 de Julio"
  moderador: string
  ponencias: Ponencia[]
  // Campos extendidos para compatibilidad con la logica existente
  diaClave: string
  enfoque: string
  diaFecha: { year: number; month: number; date: number }
  coordinacion: {
    moderador: string
    secretarioActas: string
    coordinadorCRTP: string
    responsableAsistencia: string
  }
}

// ─── Datos Iniciales (convertidos a DiaEvento[]) ─────────────────────────────

const DATOS_INICIALES: DiaEvento[] = [
  {
    id: 'lunes',
    diaClave: 'lunes',
    fecha: 'Lunes 06 de Julio',
    enfoque: 'PERFIL - COMPETENCIAS',
    moderador: 'DR. ARQ. GONZALO EDGAR SALAZAR ANTEQUERA',
    diaFecha: { year: 2026, month: 6, date: 6 },
    coordinacion: {
      moderador: 'DR. ARQ. GONZALO EDGAR SALAZAR ANTEQUERA',
      secretarioActas: 'ING. FRANKLIN CUEVAS',
      coordinadorCRTP: 'ARQ. HUMBERTO CANDIA',
      responsableAsistencia: 'UNIV. ALEXANDER CALLISAYA / UNIV. JUAN RENGEL'
    },
    ponencias: []
  },
  {
    id: 'martes',
    diaClave: 'martes',
    fecha: 'Martes 07 de Julio',
    enfoque: 'TALLER - PROYECTO',
    moderador: 'DR. ARQ. JUAN CARLOS ARANIBAR DEL ALCAZAR',
    diaFecha: { year: 2026, month: 6, date: 7 },
    coordinacion: {
      moderador: 'DR. ARQ. JUAN CARLOS ARANIBAR DEL ALCAZAR',
      secretarioActas: 'ARQ. ZAZANDA SALCEDO',
      coordinadorCRTP: 'ARQ. PAOLA CARVALLO',
      responsableAsistencia: 'UNIV. ABRYL ALIAGA / UNIV. CARLA QUISPE'
    },
    ponencias: []
  },
  {
    id: 'miercoles',
    diaClave: 'miercoles',
    fecha: 'Miercoles 08 de Julio',
    enfoque: 'REFORMA CURRICULAR',
    moderador: 'UNIV. GEMA FRANCY OCHOA MOLLINEDO',
    diaFecha: { year: 2026, month: 6, date: 8 },
    coordinacion: {
      moderador: 'UNIV. GEMA FRANCY OCHOA MOLLINEDO',
      secretarioActas: 'ARQ. HADEE BASCOPE',
      coordinadorCRTP: 'ARQ. MANUEL ASCARRUNZ',
      responsableAsistencia: 'UNIV. DIANA CARRILLO / UNIV. ERAL LENZ'
    },
    ponencias: []
  },
  {
    id: 'jueves',
    diaClave: 'jueves',
    fecha: 'Jueves 09 de Julio',
    enfoque: 'URBANISMO Y TERRITORIO - HISTORIA',
    moderador: 'UNIV. ADRIANA ROSELLO AVENDANO',
    diaFecha: { year: 2026, month: 6, date: 9 },
    coordinacion: {
      moderador: 'UNIV. ADRIANA ROSELLO AVENDANO',
      secretarioActas: 'ARQ. RICARDO ALFARO',
      coordinadorCRTP: 'ARQ. SILVIA BUSTOS',
      responsableAsistencia: 'UNIV. CAMILA ENCINAS / UNIV. EYENIL RODRIGUEZ'
    },
    ponencias: []
  },
  {
    id: 'viernes',
    diaClave: 'viernes',
    fecha: 'Viernes 10 de Julio',
    enfoque: 'EXPRESION REPRESENTACION AI - HERRAMIENTAS DIGITALES - INVESTIGACION',
    moderador: 'ING. CRISTHOFFER TITO AGUILA GOMEZ',
    diaFecha: { year: 2026, month: 6, date: 10 },
    coordinacion: {
      moderador: 'ING. CRISTHOFFER TITO AGUILA GOMEZ',
      secretarioActas: 'ARQ. DANILO RAZNATOVIC',
      coordinadorCRTP: 'ING. GLORIA ISLAS',
      responsableAsistencia: 'UNIV. ITARAY GUTIERREZ / UNIV. FERNANDA TORRES'
    },
    ponencias: []
  },
  {
    id: 'lunes13',
    diaClave: 'lunes13',
    fecha: 'Lunes 13 de Julio',
    enfoque: 'PROPUESTAS DE MATERIAS CURRICULARES',
    moderador: 'M.SC. ARQ. LUIS RAUL C. PRADO RIOS',
    diaFecha: { year: 2026, month: 6, date: 13 },
    coordinacion: {
      moderador: 'M.SC. ARQ. LUIS RAUL C. PRADO RIOS',
      secretarioActas: 'MSC. ARQ. ZAZANDA SALCEDO GUTIERREZ',
      coordinadorCRTP: 'ARQ. HUMBERTO CANDIA',
      responsableAsistencia: 'UNIV. ALEXANDER CALLISAYA / UNIV. JUAN RENGEL'
    },
    ponencias: [
      {
        id: 'lun13-reg',
        titulo: 'Inscripciones y registro',
        ponente: '',
        hora: '09:00 - 09:30',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '09:00',
        horaFin: '09:30',
        expositores: [],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-39',
        titulo: 'Hacia un arquitecto con competencias legales y éticas: Propuesta de incorporación de legislación y práctica profesional como materia transdisciplinar en la Carrera de Arquitectura de la UMSA',
        ponente: 'M.Sc. Ing. Luz Mariela Choque Ayllón',
        hora: '09:30 - 10:00',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '09:30',
        horaFin: '10:00',
        expositores: ['M.Sc. Ing. Luz Mariela Choque Ayllón'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-40',
        titulo: 'PRESENTACIÓN DE PROPUESTA DE DISEÑO MICRO CURRICULAR DE LA MATERIA: ANALISÍS ESTRÚCTURAL 1 ED-303',
        ponente: 'MSc. Ing. Nicanor Polo Cruz',
        hora: '10:00 - 10:30',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '10:00',
        horaFin: '10:30',
        expositores: ['MSc. Ing. Nicanor Polo Cruz'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-41',
        titulo: 'PROPUESTA ACTUALIZADA DE PROGRAMA POR COMPETENCIAS, ASIGNATURA RAZONAMIENTO MATEMATICO',
        ponente: 'MsC. Arq. Roberto Moreira Cordova',
        hora: '10:30 - 11:00',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '10:30',
        horaFin: '11:00',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-42',
        titulo: 'PROPUESTA DE INCORPORACIÓN DE ASIGNATURA "PREPARACIÓN Y GESTIÓN DE PROYECTOS" Al regimen regular obligatorio de la malla regular de arquitectura',
        ponente: 'Mg. Victor Rolando Cansaya Cuchani',
        hora: '11:00 - 11:30',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '11:00',
        horaFin: '11:30',
        expositores: ['Mg. Victor Rolando Cansaya Cuchani'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-43',
        titulo: 'Propuesta de actualización de LA ENSEÑANZA DE LA MATEMÁTICA EN LA FORMACIÓN DE ARQUITECTOS',
        ponente: 'Arq. Jorge Alfredo de la Rocha Justiniano',
        hora: '11:30 - 12:00',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '11:30',
        horaFin: '12:00',
        expositores: ['Arq. Jorge Alfredo de la Rocha Justiniano'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-44',
        titulo: 'PROPUESTA PARA QUE LA MATERIA DE PATRIMONIO CULTURAL Y NATURAL SE CONSTITUYA EN MATERIA REGULAR OBLIGATORIA DE LA CARRERA DE ARQUITECTURA DE LA FAADU- UMSA',
        ponente: 'Arq. M.Sc. Luis Raul C. Prado Rios',
        hora: '12:00 - 12:30',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '12:00',
        horaFin: '12:30',
        expositores: ['Arq. M.Sc. Luis Raul C. Prado Rios'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-45',
        titulo: 'Asignatura Probabilidad y estadistica',
        ponente: 'PhD. Efrain Santalla Alejo',
        hora: '12:30 - 13:00',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '12:30',
        horaFin: '13:00',
        expositores: ['PhD. Efrain Santalla Alejo'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-46',
        titulo: 'El sistema de admisión como filtro hidráulico: propuesta de rediseño para la calidad académica y la reducción del estrés en la FAADU-UMSA',
        ponente: 'Univ. Chura Mamani Daniel',
        hora: '13:00 - 13:30',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '13:00',
        horaFin: '13:30',
        expositores: ['Univ. Chura Mamani Daniel'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-tit',
        titulo: ' DE PRIORIZACIÓN E INCENTIVACIÓN EN LA TITULACIÓN MEDIANTE TESIS y PROYECTOS DE GRADO DE MANERA INTERDISCIPLINAR y TRANSDISCIPLINAR.',
        ponente: 'Arq. M.Sc. Luis Raul C. Prado Rios',
        hora: '13:30 - 14:00',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '13:30',
        horaFin: '14:00',
        expositores: ['Arq. M.Sc. Luis Raul C. Prado Rios'],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-deb',
        titulo: 'Conclusiones y debate',
        ponente: '',
        hora: '14:00 - 14:30',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '14:00',
        horaFin: '14:30',
        expositores: [],
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-cie',
        titulo: 'Cierre / refrigerio',
        ponente: '',
        hora: '20:00 - 22:00',
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        horaInicio: '20:00',
        horaFin: '22:00',
        expositores: [],
        linkFacebook: 'https://www.facebook.com/share/17hytBFRf1/'
      }
    ]
  }
]

// Enlace al documento de la comision
const LINK_DOCUMENTO_COMISION = 'https://faadu.umsa.bo/carreras/arquitectura/comision-de-rediseno-curricular/'

// Convertir hora "HH:MM" a minutos de dia
const convertirHoraAMinutos = (hora: string): number => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

// Saber si hoy calendario coincide con la fecha del dia
const esElDiaDeHoy = (dia: DiaEvento, fecha: Date): boolean => {
  return (
    fecha.getFullYear() === dia.diaFecha.year &&
    fecha.getMonth() === dia.diaFecha.month &&
    fecha.getDate() === dia.diaFecha.date
  )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Page() {
  // Estado Principal Dinamico
  const [dias, setDias] = useState<DiaEvento[]>(DATOS_INICIALES)
  const [diaActualId, setDiaActualId] = useState<string>('lunes')
  const [fechaSistema, setFechaSistema] = useState<Date | null>(null)
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false)

  // Modales y Lightboxes
  const [modalConfig, setModalConfig] = useState<Ponencia | null>(null)
  const [activePonenciaId, setActivePonenciaId] = useState<string | null>(null)
  const [lastAlertedEventId, setLastAlertedEventId] = useState<string | null>(null)
  const [qrAmpliado, setQrAmpliado] = useState<string | null>(null)

  // Panel de administracion (visible/oculto) — abierto por defecto
  const [panelAbierto, setPanelAbierto] = useState(true)

  // Imagenes robustas fallbacks
  const [logoUmsaSrc, setLogoUmsaSrc] = useState('/Logo_Umsa.png')
  const [logoFaaduSrc, setLogoFaaduSrc] = useState('/faadu-logo.png')
  const [logoCrtpSrc, setLogoCrtpSrc] = useState('/logo_crtp.png')

  // Estado Formulario A: Crear Dia
  const [formDia, setFormDia] = useState({ fecha: '', moderador: '' })

  // Estado Formulario B: Crear Ponencia
  const [formPonencia, setFormPonencia] = useState({
    diaId: DATOS_INICIALES[0]?.id ?? '',
    titulo: '',
    ponente: '',
    hora: '',
    lugar: '',
  })

  // Tick del reloj en tiempo real
  useEffect(() => {
    setFechaSistema(new Date())
    const interval = setInterval(() => {
      setFechaSistema(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Sincronizacion automatica de dia al cargar (Ocurre solo una vez)
  useEffect(() => {
    if (!fechaSistema || hasInitialLoaded) return
    const hoyClave = dias.find((dia) => esElDiaDeHoy(dia, fechaSistema))
    if (hoyClave) {
      setDiaActualId(hoyClave.id)
    } else {
      setDiaActualId('lunes')
    }
    setHasInitialLoaded(true)
  }, [fechaSistema, hasInitialLoaded, dias])

  // Logica de alerta modal "En vivo" automatica
  useEffect(() => {
    if (!fechaSistema) return
    const diaDeHoy = dias.find((d) => esElDiaDeHoy(d, fechaSistema))
    if (!diaDeHoy) return

    const minutosActuales = fechaSistema.getHours() * 60 + fechaSistema.getMinutes()
    const ponenciaEnCurso = diaDeHoy.ponencias.find((p) => {
      if (p.expositores.length === 0) return false
      const inicio = convertirHoraAMinutos(p.horaInicio)
      const fin = convertirHoraAMinutos(p.horaFin)
      return minutosActuales >= inicio && minutosActuales < fin
    })

    if (ponenciaEnCurso) {
      if (ponenciaEnCurso.id !== activePonenciaId) {
        setActivePonenciaId(ponenciaEnCurso.id)
        if (diaActualId === diaDeHoy.id && ponenciaEnCurso.id !== lastAlertedEventId) {
          setModalConfig(ponenciaEnCurso)
          setLastAlertedEventId(ponenciaEnCurso.id)
        }
      }
    } else {
      setActivePonenciaId(null)
    }
  }, [fechaSistema, diaActualId, activePonenciaId, lastAlertedEventId, dias])

  // Helper estado de ponencia
  const obtenerEstadoPonencia = (ponencia: Ponencia, dia: DiaEvento): 'en-vivo' | 'proximo' | 'pasado' => {
    if (!fechaSistema) return 'proximo'
    const fechaHoySinHora = new Date(fechaSistema.getFullYear(), fechaSistema.getMonth(), fechaSistema.getDate())
    const fechaEvSinHora = new Date(dia.diaFecha.year, dia.diaFecha.month, dia.diaFecha.date)
    if (fechaHoySinHora.getTime() > fechaEvSinHora.getTime()) return 'pasado'
    if (fechaHoySinHora.getTime() < fechaEvSinHora.getTime()) return 'proximo'
    const minutosActuales = fechaSistema.getHours() * 60 + fechaSistema.getMinutes()
    const inicio = convertirHoraAMinutos(ponencia.horaInicio)
    const fin = convertirHoraAMinutos(ponencia.horaFin)
    if (minutosActuales < inicio) return 'proximo'
    if (minutosActuales >= fin) return 'pasado'
    return 'en-vivo'
  }

  // Formulario A: Agregar Dia de Evento
  const handleAgregarDia = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formDia.fecha.trim()) return
    const nuevoId = `dia-${Date.now()}`
    const nuevoDia: DiaEvento = {
      id: nuevoId,
      diaClave: nuevoId,
      fecha: formDia.fecha.trim(),
      moderador: formDia.moderador.trim(),
      enfoque: '',
      diaFecha: { year: 9999, month: 0, date: 1 },
      coordinacion: {
        moderador: formDia.moderador.trim(),
        secretarioActas: '',
        coordinadorCRTP: '',
        responsableAsistencia: ''
      },
      ponencias: []
    }
    setDias((prev) => [...prev, nuevoDia])
    setFormDia({ fecha: '', moderador: '' })
    setDiaActualId(nuevoId)
  }

  // Formulario B: Agregar Ponencia a un Dia
  const handleAgregarPonencia = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formPonencia.titulo.trim() || !formPonencia.diaId) return

    const partes = formPonencia.hora.split('-').map((s) => s.trim())
    const horaInicio = partes[0] ?? formPonencia.hora
    const horaFin = partes[1] ?? formPonencia.hora

    const nuevaPonencia: Ponencia = {
      id: `ponencia-${Date.now()}`,
      titulo: formPonencia.titulo.trim(),
      ponente: formPonencia.ponente.trim(),
      hora: formPonencia.hora.trim(),
      lugar: formPonencia.lugar.trim(),
      horaInicio,
      horaFin,
      expositores: formPonencia.ponente.trim() ? [formPonencia.ponente.trim()] : [],
      linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
    }

    // Inmutabilidad: actualizar el array de ponencias del dia seleccionado
    setDias((prev) =>
      prev.map((dia) =>
        dia.id === formPonencia.diaId
          ? { ...dia, ponencias: [...dia.ponencias, nuevaPonencia] }
          : dia
      )
    )

    setFormPonencia((prev) => ({ ...prev, titulo: '', ponente: '', hora: '', lugar: '' }))
  }

  // Dia seleccionado actualmente
  const diaSeleccionadoObj = dias.find((d) => d.id === diaActualId) ?? dias[0]

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* Header Institucional de Tres Columnas */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-6 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src={logoUmsaSrc}
              alt="Logo UMSA"
              className="h-24 object-contain transition-all duration-300 hover:scale-105"
              onError={() => setLogoUmsaSrc('/Logo_Umsa.png')}
            />
          </div>

          <div className="text-center space-y-1">
            <span className="block text-xs font-bold text-slate-400 tracking-widest uppercase">
              Universidad Mayor de San Andres
            </span>
            <span className="block text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Facultad de Arquitectura, Artes, Diseno y Urbanismo
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              Jornadas de Rediseno de la Malla Curricular de la Carrera de Arquitectura
            </h1>
            <p className="text-sm text-amber-600 font-medium italic mt-1">
              Hacia la nueva Curricula de la Carrera de Arquitectura por Competencias
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {fechaSistema && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                  <span>
                    Hoy:{' '}
                    <span className="font-semibold capitalize">
                      {fechaSistema.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </span>
                </div>
              )}

              <a
                href={LINK_DOCUMENTO_COMISION}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-xs font-bold text-amber-800 border border-amber-200 transition-colors shadow-xs cursor-pointer"
                title="Abrir Documento de Comision"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Comision de Rediseno Curricular</span>
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <img
              src={logoFaaduSrc}
              alt="Logo FAADU"
              className="h-24 object-contain transition-all duration-300 hover:scale-105"
              onError={() => setLogoFaaduSrc('/faadu-logo.png')}
            />
          </div>
        </div>
      </header>

      {/* Seccion Central */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Cronograma del Evento
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Seleccione un dia para explorar los horarios y ponencias virtuales
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Badge EN VIVO global */}
            {fechaSistema && (() => {
              const hoyD = dias.find((d) => esElDiaDeHoy(d, fechaSistema))
              const enVivoAhora = hoyD?.ponencias.some(
                (p) => obtenerEstadoPonencia(p, hoyD) === 'en-vivo' && p.expositores.length > 0
              )
              if (enVivoAhora) {
                return (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-xs tracking-wider animate-pulse shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                    <span>TRANSMISION EN VIVO AHORA</span>
                  </div>
                )
              }
              return null
            })()}

          </div>
        </div>

        {/* Panel de Administracion — siempre visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">

          {/* Formulario A: Crear Dia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Calendar className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm md:text-base tracking-tight text-slate-800">
                AGREGAR DIA DE EVENTO
              </h3>
            </div>
            <form id="form-agregar-dia" onSubmit={handleAgregarDia} className="space-y-3">
              <div>
                <label htmlFor="input-dia-fecha" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Fecha / Nombre del Dia *
                </label>
                <input
                  id="input-dia-fecha"
                  type="text"
                  required
                  placeholder="Ej: Martes 14 de Julio"
                  value={formDia.fecha}
                  onChange={(e) => setFormDia((prev) => ({ ...prev, fecha: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label htmlFor="input-dia-moderador" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Moderador
                </label>
                <input
                  id="input-dia-moderador"
                  type="text"
                  placeholder="Nombre completo del moderador"
                  value={formDia.moderador}
                  onChange={(e) => setFormDia((prev) => ({ ...prev, moderador: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                id="btn-submit-agregar-dia"
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Agregar Dia
              </button>
            </form>
          </div>

          {/* Formulario B: Crear Ponencia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Users className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm md:text-base tracking-tight text-slate-800">
                AGREGAR PONENCIA
              </h3>
            </div>
            <form id="form-agregar-ponencia" onSubmit={handleAgregarPonencia} className="space-y-3">
              <div>
                <label htmlFor="select-ponencia-dia" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Asignar al Dia *
                </label>
                <select
                  id="select-ponencia-dia"
                  required
                  value={formPonencia.diaId}
                  onChange={(e) => setFormPonencia((prev) => ({ ...prev, diaId: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                >
                  {dias.map((dia) => (
                    <option key={dia.id} value={dia.id}>
                      {dia.fecha}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="input-ponencia-titulo" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Titulo *
                </label>
                <input
                  id="input-ponencia-titulo"
                  type="text"
                  required
                  placeholder="Titulo de la ponencia"
                  value={formPonencia.titulo}
                  onChange={(e) => setFormPonencia((prev) => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="input-ponencia-ponente" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Ponente
                  </label>
                  <input
                    id="input-ponencia-ponente"
                    type="text"
                    placeholder="Nombre del ponente"
                    value={formPonencia.ponente}
                    onChange={(e) => setFormPonencia((prev) => ({ ...prev, ponente: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label htmlFor="input-ponencia-hora" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Hora
                  </label>
                  <input
                    id="input-ponencia-hora"
                    type="text"
                    placeholder="09:00 - 09:30"
                    value={formPonencia.hora}
                    onChange={(e) => setFormPonencia((prev) => ({ ...prev, hora: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="input-ponencia-lugar" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Lugar
                </label>
                <input
                  id="input-ponencia-lugar"
                  type="text"
                  placeholder="Ej: Auditorio Principal"
                  value={formPonencia.lugar}
                  onChange={(e) => setFormPonencia((prev) => ({ ...prev, lugar: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                id="btn-submit-agregar-ponencia"
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white font-bold text-sm tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Agregar Ponencia
              </button>
            </form>
          </div>
        </div>

        {/* Pestanas de Seleccion de Dias — doble .map() OUTER */}
        <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-2 rounded-xl shadow-xs border border-slate-200">
          {dias.map((dia) => {
            const isSelected = diaActualId === dia.id
            const esHoy = fechaSistema && esElDiaDeHoy(dia, fechaSistema)
            return (
              <button
                key={dia.id}
                id={`tab-dia-${dia.id}`}
                onClick={() => setDiaActualId(dia.id)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-xs md:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${isSelected
                  ? 'bg-amber-500 text-white shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-400'
                  } relative`}
              >
                {dia.fecha}
                {esHoy && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Detalle del enfoque del dia seleccionado */}
        {diaSeleccionadoObj.enfoque && (
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-xs uppercase tracking-widest font-extrabold text-amber-800">Enfoque Academico Diario</p>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{diaSeleccionadoObj.enfoque}</h3>
          </div>
        )}

        {/* Tarjetas de Ponencias del Dia — doble .map() INNER */}
        <div className="grid gap-4">
          {diaSeleccionadoObj.ponencias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-dashed border-slate-300 rounded-xl">
              <Plus className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-400 font-semibold text-sm">Aun no hay ponencias para este dia.</p>
              <p className="text-slate-400 text-xs mt-1">Usa el panel Agregar Contenido para anadir una.</p>
            </div>
          ) : (
            diaSeleccionadoObj.ponencias.map((ponencia) => {
              const estado = obtenerEstadoPonencia(ponencia, diaSeleccionadoObj)
              const esEnVivo = estado === 'en-vivo'
              const esPasado = estado === 'pasado'
              const tieneExpositores = ponencia.expositores.length > 0

              return (
                <div
                  key={ponencia.id}
                  className={`relative bg-white rounded-xl border p-5 md:p-6 transition-all duration-300 ${esEnVivo
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 shadow-md scale-[1.01]'
                    : esPasado
                      ? 'border-slate-200 bg-slate-50/50 opacity-75'
                      : 'border-slate-200 hover:shadow-md hover:border-slate-300'
                    }`}
                >
                  {/* Badge EN VIVO */}
                  {esEnVivo && tieneExpositores && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-[10px] tracking-widest uppercase shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      EN VIVO AHORA
                    </span>
                  )}

                  <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                    {/* Horario y Lugar */}
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-1.5 min-w-[150px]">
                      <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm md:text-base">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{ponencia.hora || `${ponencia.horaInicio} - ${ponencia.horaFin}`}</span>
                      </div>
                      {ponencia.lugar && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[180px] md:max-w-none">{ponencia.lugar}</span>
                        </div>
                      )}
                    </div>

                    {/* Detalle Ponencia */}
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                        {ponencia.titulo}
                      </h4>
                      {tieneExpositores && (
                        <p className="text-xs md:text-sm text-slate-500 font-medium">
                          {'\u{1F3A4}'} <span className="font-semibold text-slate-600">{ponencia.expositores.join(', ')}</span>
                        </p>
                      )}
                    </div>

                    {/* Acciones e interaccion QR */}
                    {tieneExpositores && (
                      <div className="flex items-center gap-3 pt-3 md:pt-0 w-full md:w-auto shrink-0 justify-end">
                        {esEnVivo ? (
                          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 shadow-xs w-full md:w-auto justify-between">
                            <a
                              href={ponencia.linkFacebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                            >
                              <FacebookIcon className="w-4 h-4 shrink-0" />
                              Entrar a Facebook Live
                            </a>
                            <div
                              className="bg-white p-1 rounded-md border border-blue-200 cursor-zoom-in hover:scale-105 transition-transform shrink-0"
                              title="Ampliar codigo QR"
                              onClick={() => setQrAmpliado(ponencia.linkFacebook)}
                            >
                              <QRCodeSVG value={ponencia.linkFacebook} size={42} level="M" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                            <a
                              href={esPasado ? undefined : ponencia.linkFacebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-4 py-2 rounded-md font-bold text-xs tracking-wide transition-all w-full md:w-auto text-center ${esPasado
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer'
                                }`}
                            >
                              {esPasado ? 'Finalizado' : 'Entrar'}
                            </a>
                            {!esPasado && (
                              <div
                                className="bg-white p-1 rounded-md border border-slate-200 cursor-zoom-in hover:scale-105 transition-transform shrink-0"
                                title="Ampliar codigo QR"
                                onClick={() => setQrAmpliado(ponencia.linkFacebook)}
                              >
                                <QRCodeSVG value={ponencia.linkFacebook} size={36} level="M" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Apartado Coordina y Modera Inferior */}
        <div className="bg-slate-100 rounded-xl border border-slate-200 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Users className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm md:text-base tracking-tight text-slate-800">
              EQUIPO DE COORDINACION NOCTURNA (20:00 - 21:00)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <tbody>
                <tr className="border-b border-slate-200/60">
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider w-[240px]">
                    MODERADOR
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.moderador || diaSeleccionadoObj.moderador || '-'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200/60">
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider">
                    SECRETARIO DE ACTAS
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.secretarioActas || '-'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200/60">
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider">
                    COORDINADOR CRTP
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.coordinadorCRTP || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider">
                    RESPONSABLE DE ASISTENCIA
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.responsableAsistencia || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal Emergente: Alerta de Transmision */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-600 to-amber-500 p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span className="text-xs font-black tracking-widest uppercase">ALERTA DE TRANSMISION EN VIVO</span>
              </div>
              <button
                onClick={() => setModalConfig(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <p className="text-xs text-amber-600 font-extrabold uppercase tracking-widest">PONENCIA EMPEZANDO</p>
                <h3 className="text-lg md:text-xl font-bold text-neutral-950 leading-snug">
                  {modalConfig.titulo}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs md:text-sm text-neutral-950 font-bold">
                    Fecha: <span className="font-extrabold">{diaSeleccionadoObj.fecha.split(' de ')[0]}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3 rounded-lg border border-slate-200">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs md:text-sm text-neutral-950 font-bold">
                    Horario: <span className="font-extrabold">{modalConfig.hora || `${modalConfig.horaInicio} - ${modalConfig.horaFin}`}</span>
                  </span>
                </div>
              </div>

              {modalConfig.expositores.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 block">Expositores Oficiales</span>
                  <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                    {modalConfig.expositores.join(', ')}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 w-full">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">CANAL OFICIAL</h4>
                  <p className="text-xs text-slate-400 truncate w-full max-w-[280px] sm:max-w-[160px] md:max-w-[220px]" title={modalConfig.linkFacebook}>
                    {modalConfig.linkFacebook}
                  </p>
                </div>
                <div className="w-full sm:w-auto shrink-0 flex justify-center">
                  <a
                    href={modalConfig.linkFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#1877F2] text-white px-4 py-2.5 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors shadow-md cursor-pointer whitespace-nowrap w-full sm:w-auto"
                  >
                    <FacebookIcon className="w-4 h-4 shrink-0" />
                    Ingresar a Facebook
                  </a>
                </div>
                <div className="shrink-0 flex justify-center">
                  <div
                    className="bg-white p-1 rounded-xl border border-slate-200 cursor-zoom-in hover:scale-105 transition-transform shadow-xs flex items-center justify-center w-14 h-14"
                    title="Ampliar codigo QR"
                    onClick={() => setQrAmpliado(modalConfig.linkFacebook)}
                  >
                    <QRCodeSVG value={modalConfig.linkFacebook} size={48} level="M" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setModalConfig(null)}
                className="bg-white text-slate-700 px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Descartar Alerta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox para QR Ampliado */}
      {qrAmpliado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out p-4"
          onClick={() => setQrAmpliado(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center border border-slate-200 max-w-sm w-full relative cursor-default animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrAmpliado(null)}
              className="absolute top-3 right-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
              title="Cerrar vista ampliada"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mt-3">
              <QRCodeSVG value={qrAmpliado} size={300} level="H" includeMargin={true} />
            </div>
            <p className="mt-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              Escanee para ingresar a la transmision
            </p>
          </div>
        </div>
      )}

      {/* Footer Institucional */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 md:px-8 mt-12 text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
              Centro de das Tecnologicos y Pedagogicos (CRTP)
            </h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl">
              Calle Heroes del Acre Nro. 1850 | Telefono: (591-2) 2491481 2484818-int 117 | Email:{' '}
              <a href="mailto:[EMAIL_ADDRESS]" className="text-amber-600 font-bold hover:underline transition-colors">
                faadu.crtp@umsa.bo
              </a>
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={logoCrtpSrc}
              alt="Logo CRTP"
              className="h-45 object-contain transition-all duration-300 hover:scale-105"
              onError={() => setLogoCrtpSrc('/logo_crtp.png')}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 text-center text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          2026 Facultaddasdas de Arquitectura, Artes, Diseno y Urbanismo (FAADU) - UMSA. Todos los derechos reservados.
        </div>
      </footer>

      {/* Boton flotante para el Documento de Comision */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={LINK_DOCUMENTO_COMISION}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-bold text-xs md:text-sm border border-amber-400 group cursor-pointer"
          title="Ver Documento de Comision"
        >
          <FileText className="w-4 h-4 md:w-5 md:h-5 animate-pulse group-hover:scale-110 transition-transform" />
          <span>Comision de Rediseno Curricular</span>
        </a>
      </div>
    </main>
  )
}
