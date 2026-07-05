export interface Evento {
  id: string
  horaInicio: string
  horaFin: string
  titulo: string
  expositores: string[]
  linkFacebook: string
  lugar?: string
  enfoque?: string
  qrFacebook?: string
}

export interface CronogramaEventos {
  [dia: string]: Evento[]
}

export const cronogramaEventos: CronogramaEventos = {
  viernes03: {
    eventos: [
    {
      id: 'vier03-1',
      horaInicio: '14:00',
      horaFin: '15:00',
      titulo: 'Evento Prueba del RTP 1',
      expositores: ['Personal del CRTP'],
      linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633',
      lugar: 'Previos de CRTP',
      enfoque: 'SESIÓN DE PRUEBAS EN TIEMPO REAL - FAADU',
      qrFacebook: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.facebook.com/profile.php?id=100047802766633'
    },
    {
      id: 'vier03-2',
      horaInicio: '15:00',
      horaFin: '16:00',
      titulo: 'Evento Prueba del RTP 2',
      expositores: ['Personal del CRTP'],
      linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633',
      lugar: 'Previos de CRTP',
      enfoque: 'SESIÓN DE PRUEBAS EN TIEMPO REAL - FAADU',
      qrFacebook: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.facebook.com/profile.php?id=100047802766633'
    }
  ]
  },
  lunes: {
    eventos: [
    {
      id: 'lun-1',
      horaInicio: '10:30',
      horaFin: '11:00',
      titulo: 'Del Modelo Declarativo a la Operatividad Socioformativa: Propuesta del Perfil de Egreso y Profesional del Arquitecto FAADU-UMSA 2026 ante la Complejidad Territorial y Laboral del Siglo XXI',
      expositores: ['Fabiola Zaballa, Paola Carvallo, Silvia Bustos, Humberto Candia, Manuel Ascarrunz, Jahdiel Villafuerte, Leonor Cuevas.'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: '',
      enfoque: 'Apertura'
    },
    {
      id: 'lun-2',
      horaInicio: '11:00',
      horaFin: '11:30',
      titulo: 'EL PERFIL PROFESIONAL DEL ARQUITECTO EN LA FAADU-UMSA: Una reflexión crítica desde las demandas contemporáneas de la disciplina y la sociedad.',
      expositores: ['Arq. Ismael Carvajal Vogtschmidt'],
      linkFacebook: '',
      lugar: 'Sala virtual',
      enfoque: 'Perfil Profesional del Arquitecto'
    },
    {
      id: 'lun-3',
      horaInicio: '11:30',
      horaFin: '12:00',
      titulo: 'PROPUESTA CONTEMPORÁNEA DE COMPETENCIAS PARA LA FORMACIÓN PROFESIONAL EN ARQUITECTURA A partir del documento Competencias Plan de Estudios 2008 y de referentes institucionales, globales y latinoamericanos',
      expositores: ['MsC. Arq. Roberto Moreira Cordova'],
      linkFacebook: '',
      lugar: 'Sala Virtual'
    },
    {
      id: 'lun-4',
      horaInicio: '12:00',
      horaFin: '12:30',
      titulo: 'PERFIL DE EGRESO Y PERFIL PROFESIONAL EN EL PROCESO DE REDISEÑO CURRICULAR DE LA CARRERA DE ARQUITECTURA',
      expositores: ['MsC. Arq. Williams Terrazas'],
      linkFacebook: '',
      lugar: 'Sala Virtual',
      enfoque: 'Perfil de Egreso y Perfil Profesional '
    },
    {
      id: 'lun-5',
      horaInicio: '12:30',
      horaFin: '13:00',
      titulo: 'LÍDER CULTURAL: HACIA UN NUEVO  PERFIL DEL ARQUITECTO FAADU-UMSA',
      expositores: ['Ezequiel Callisaya Sanchez Alison Angeles Gutierrez Condori Yerly Marupa Colque Jhael Massiel Ramirez Aguilar'],
      linkFacebook: '',
      lugar: 'Sala Virtual',
      enfoque: 'Lider Cultural: Hacia un Nuevo Perfil del Arquitecto FAADU-UMSA'
    },
    {
      id: 'lun-6',
      horaInicio: '13:00',
      horaFin: '13:30',
      titulo: 'Conclusiones y debate',
      expositores: [''],
      linkFacebook: '',
      lugar: '',
      enfoque: ''
    },
    {
      id: 'lun-7',
      horaInicio: '13:00',
      horaFin: '13:30',
      titulo: 'Rediseño curricular en Artes Plasticas',
      expositores: ['Dr. Arq. Gonzalo Edgar Salazar Antequera - Moderador, Ing. Franklin Cuevas - SECRETARIO DE ACTAS'],
      linkFacebook: '',
      lugar: '',
      enfoque: ''
    }
  ],
    coordinacion: {
      moderador: 'Dr. Arq. Gonzalo Edgar Salazar Antequera',
      secretarioActas: 'Ing. Franklin Cuevas',
      coordinadorCRTP: 'Arq. Humberto Candia',
      responsableAsistencia: 'Univ. Alexander Callisaya / Univ. Juan Rengel'
    }
  },
  martes: {
    eventos: [
    {
      id: 'mar-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Taller Práctico: Metodología de Proyecto Arquitectónico',
      expositores: ['Arq. Taller 1', 'Arq. Taller 2'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Salas de Taller A y B',
      enfoque: 'Taller - Proyecto'
    },
    {
      id: 'mar-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkFacebook: '',
      lugar: 'Hall Central'
    },
    {
      id: 'mar-3',
      horaInicio: '10:45',
      horaFin: '12:00',
      titulo: 'Presentación de Proyectos Estudiantiles Destacados',
      expositores: ['Estudiantes FAADU', 'Jurado Evaluador'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Taller - Proyecto'
    },
    {
      id: 'mar-4',
      horaInicio: '12:00',
      horaFin: '13:00',
      titulo: 'Mesa Redonda: Desafíos del Proyecto Contemporáneo',
      expositores: ['Arq. Panelista 1', 'Arq. Panelista 2', 'Arq. Panelista 3'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Taller - Proyecto'
    }
  ],
    coordinacion: {
      moderador: 'Dr. Arq. Juan Carlos Aranibar del Alcazar',
      secretarioActas: 'Arq. Zazanda Salcedo',
      coordinadorCRTP: 'Arq. Paola Carvallo',
      responsableAsistencia: 'Univ. Abryl Aliaga / Univ. Carla Quispe'
    }
  },
  miercoles: {
    eventos: [
    {
      id: 'mie-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Reforma Curricular FAADU: Nuevos Paradigmas Educativos',
      expositores: ['Comisión Curricular FAADU'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Reforma Curricular'
    },
    {
      id: 'mie-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkFacebook: '',
      lugar: 'Hall Central'
    },
    {
      id: 'mie-3',
      horaInicio: '10:45',
      horaFin: '12:15',
      titulo: 'Ponencia: Transformación Digital en la Enseñanza de Arquitectura',
      expositores: ['Arq. Dr. Especialista TIC'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Reforma Curricular'
    },
    {
      id: 'mie-4',
      horaInicio: '12:15',
      horaFin: '13:15',
      titulo: 'Sesión de Retroalimentación: Comentarios y Propuestas',
      expositores: ['Participantes'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal'
    }
  ],
    coordinacion: {
      moderador: 'Univ. Gema Francy Ochoa Mollinedo',
      secretarioActas: 'Arq. Hadeé Bascopé',
      coordinadorCRTP: 'Arq. Manuel Ascarrunz',
      responsableAsistencia: 'Univ. Diana Carrillo / Univ. Eral Lenz'
    }
  },
  jueves: {
    eventos: [
    {
      id: 'jue-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Urbanismo y Territorio: Planificación en el Siglo XXI',
      expositores: ['Arq. Especialista Urbanismo'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Urbanismo y Territorio - Historia'
    },
    {
      id: 'jue-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkFacebook: '',
      lugar: 'Hall Central'
    },
    {
      id: 'jue-3',
      horaInicio: '10:45',
      horaFin: '12:00',
      titulo: 'Historia de la Arquitectura Local: Patrimonio e Identidad',
      expositores: ['Arq. Historiador', 'Investigador Académico'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Urbanismo y Territorio - Historia'
    },
    {
      id: 'jue-4',
      horaInicio: '12:00',
      horaFin: '13:35',
      titulo: 'Visita Virtual: Casos de Estudio Locales',
      expositores: ['Arq. Guía', 'Especialista en Patrimonio'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Virtual - Transmisión Especial'
    }
  ],
    coordinacion: {
      moderador: 'Univ. Adriana Rosello Avendaño',
      secretarioActas: 'Arq. Ricardo Alfaro',
      coordinadorCRTP: 'Arq. Silvia Bustos',
      responsableAsistencia: 'Univ. Camila Encinas / Univ. Eyenil Rodriguez'
    }
  },
  viernes: {
    eventos: [
    {
      id: 'vie-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Expresión y Representación: Herramientas Digitales Contemporáneas',
      expositores: ['Arq. Especialista Representación'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Expresión, Representación, IA'
    },
    {
      id: 'vie-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkFacebook: '',
      lugar: 'Hall Central'
    },
    {
      id: 'vie-3',
      horaInicio: '10:45',
      horaFin: '12:15',
      titulo: 'Inteligencia Artificial en Arquitectura: Aplicaciones y Futuro',
      expositores: ['Arq. Especialista IA', 'Investigador TIC'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Expresión, Representación, IA'
    },
    {
      id: 'vie-4',
      horaInicio: '12:15',
      horaFin: '13:30',
      titulo: 'Cierre y Reflexión Final',
      expositores: ['Coordinadores FAADU'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal'
    }
  ],
    coordinacion: {
      moderador: 'Ing. Cristhoffer Tito Aguila Gomez',
      secretarioActas: 'Arq. Danilo Raznatovic',
      coordinadorCRTP: 'Ing. Gloria Islas',
      responsableAsistencia: 'Univ. Itaray Gutierrez / Univ. Fernanda Torres'
    }
  },
  lunes13: {
    eventos: [
    {
      id: 'lun13-1',
      horaInicio: '09:00',
      horaFin: '10:30',
      titulo: 'Propuestas de Materias Curriculares Nuevas',
      expositores: ['Comisión Académica'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Propuestas de Materias Curriculares'
    },
    {
      id: 'lun13-2',
      horaInicio: '10:30',
      horaFin: '10:45',
      titulo: 'Receso',
      expositores: [],
      linkFacebook: '',
      lugar: 'Hall Central'
    },
    {
      id: 'lun13-3',
      horaInicio: '10:45',
      horaFin: '12:00',
      titulo: 'Votación y Aprobación de Propuestas',
      expositores: ['Consejo Académico'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal',
      enfoque: 'Propuestas de Materias Curriculares'
    },
    {
      id: 'lun13-4',
      horaInicio: '12:00',
      horaFin: '13:00',
      titulo: 'Clausura Oficial del Evento',
      expositores: ['Autoridades UMSA', 'FAADU'],
      linkFacebook: 'https://www.facebook.com/FAADU.UMSA/',
      lugar: 'Auditorio Principal'
    }
  ]
  }
}

// Convertir nombres de días a números ISO (0 = domingo, 1 = lunes, etc.)
export const diasSemana = {
  jueves02: 4,
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
