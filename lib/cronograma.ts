export interface Evento {
  id: string
  horaInicio: string
  horaFin: string
  titulo: string
  expositores: string[]
  linkTransmision: string
  lugar?: string
  enfoque?: string
}

export interface CronogramaEventos {
  [dia: string]: Evento[]
}

export const cronogramaEventos: CronogramaEventos = {
  lunes: [
    {
      id: 'lun-1',
      horaInicio: '08:00',
      horaFin: '08:30',
      titulo: 'Bienvenida Oficial - Inauguración del Evento de Ponencias',
      expositores: ['Directora FAADU', 'Coordinadores Académicos'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Apertura'
    },
    {
      id: 'lun-2',
      horaInicio: '08:30',
      horaFin: '10:00',
      titulo: 'Del Modelo Declarativo a la Operatividad Socioformativa: Propuesta del Perfil de Egreso y Profesional del Arquitecto FAADU-UMSA 2026',
      expositores: ['Arq. Dr. Fernando Córdoba', 'Arq. Marta Villanueva', 'Arq. Ramiro Castillo'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Perfil - Competencias'
    },
    {
      id: 'lun-3',
      horaInicio: '10:00',
      horaFin: '10:15',
      titulo: 'Receso',
      expositores: [],
      linkTransmision: '',
      lugar: 'Hall Central'
    },
    {
      id: 'lun-4',
      horaInicio: '10:15',
      horaFin: '11:30',
      titulo: 'Ponencia Especial: Arquitectura Sostenible y Diseño Contemporáneo',
      expositores: ['Arq. Especialista Internacional'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Perfil - Competencias'
    },
    {
      id: 'lun-5',
      horaInicio: '11:30',
      horaFin: '13:46',
      titulo: 'Preguntas y Respuestas',
      expositores: ['Panelistas'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal'
    }
  ],
  martes: [
    {
      id: 'mar-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Taller Práctico: Metodología de Proyecto Arquitectónico',
      expositores: ['Arq. Taller 1', 'Arq. Taller 2'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Salas de Taller A y B',
      enfoque: 'Taller - Proyecto'
    },
    {
      id: 'mar-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkTransmision: '',
      lugar: 'Hall Central'
    },
    {
      id: 'mar-3',
      horaInicio: '10:45',
      horaFin: '12:00',
      titulo: 'Presentación de Proyectos Estudiantiles Destacados',
      expositores: ['Estudiantes FAADU', 'Jurado Evaluador'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Taller - Proyecto'
    },
    {
      id: 'mar-4',
      horaInicio: '12:00',
      horaFin: '13:00',
      titulo: 'Mesa Redonda: Desafíos del Proyecto Contemporáneo',
      expositores: ['Arq. Panelista 1', 'Arq. Panelista 2', 'Arq. Panelista 3'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Taller - Proyecto'
    }
  ],
  miercoles: [
    {
      id: 'mie-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Reforma Curricular FAADU: Nuevos Paradigmas Educativos',
      expositores: ['Comisión Curricular FAADU'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Reforma Curricular'
    },
    {
      id: 'mie-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkTransmision: '',
      lugar: 'Hall Central'
    },
    {
      id: 'mie-3',
      horaInicio: '10:45',
      horaFin: '12:15',
      titulo: 'Ponencia: Transformación Digital en la Enseñanza de Arquitectura',
      expositores: ['Arq. Dr. Especialista TIC'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Reforma Curricular'
    },
    {
      id: 'mie-4',
      horaInicio: '12:15',
      horaFin: '13:15',
      titulo: 'Sesión de Retroalimentación: Comentarios y Propuestas',
      expositores: ['Participantes'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal'
    }
  ],
  jueves: [
    {
      id: 'jue-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Urbanismo y Territorio: Planificación en el Siglo XXI',
      expositores: ['Arq. Especialista Urbanismo'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Urbanismo y Territorio - Historia'
    },
    {
      id: 'jue-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkTransmision: '',
      lugar: 'Hall Central'
    },
    {
      id: 'jue-3',
      horaInicio: '10:45',
      horaFin: '12:00',
      titulo: 'Historia de la Arquitectura Local: Patrimonio e Identidad',
      expositores: ['Arq. Historiador', 'Investigador Académico'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Urbanismo y Territorio - Historia'
    },
    {
      id: 'jue-4',
      horaInicio: '12:00',
      horaFin: '13:35',
      titulo: 'Visita Virtual: Casos de Estudio Locales',
      expositores: ['Arq. Guía', 'Especialista en Patrimonio'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Virtual - Transmisión Especial'
    }
  ],
  viernes: [
    {
      id: 'vie-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Expresión y Representación: Herramientas Digitales Contemporáneas',
      expositores: ['Arq. Especialista Representación'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Expresión, Representación, IA'
    },
    {
      id: 'vie-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkTransmision: '',
      lugar: 'Hall Central'
    },
    {
      id: 'vie-3',
      horaInicio: '10:45',
      horaFin: '12:15',
      titulo: 'Inteligencia Artificial en Arquitectura: Aplicaciones y Futuro',
      expositores: ['Arq. Especialista IA', 'Investigador TIC'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Expresión, Representación, IA'
    },
    {
      id: 'vie-4',
      horaInicio: '12:15',
      horaFin: '13:30',
      titulo: 'Cierre y Reflexión Final',
      expositores: ['Coordinadores FAADU'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal'
    }
  ],
  lunes13: [
    {
      id: 'lun13-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Propuestas de Materias Curriculares Nuevas',
      expositores: ['Comisión Académica'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Propuestas de Materias Curriculares'
    },
    {
      id: 'lun13-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkTransmision: '',
      lugar: 'Hall Central'
    },
    {
      id: 'lun13-3',
      horaInicio: '10:45',
      horaFin: '12:00',
      titulo: 'Votación y Aprobación de Propuestas',
      expositores: ['Consejo Académico'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal',
      enfoque: 'Propuestas de Materias Curriculares'
    },
    {
      id: 'lun13-4',
      horaInicio: '12:00',
      horaFin: '13:00',
      titulo: 'Clausura Oficial del Evento',
      expositores: ['Autoridades UMSA', 'FAADU'],
      linkTransmision: 'https://meet.google.com/pzk-kmcj-rjk',
      lugar: 'Auditorio Principal'
    }
  ]
}

// Convertir nombres de días a números ISO (0 = domingo, 1 = lunes, etc.)
export const diasSemana = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  lunes13: 1 // Para propósitos de demostración (lunes 13)
}

// Función auxiliar para convertir hora "HH:MM" a minutos desde medianoche
export const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}
