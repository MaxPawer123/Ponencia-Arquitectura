'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Calendar, Clock, MapPin, X, Users, Award, Shield, CheckCircle, ArrowRight, FileText } from 'lucide-react'

// Icono personalizado de Facebook para evitar problemas de versión en lucide-react
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// Interfaces de Datos
interface Evento {
  id: string
  horaInicio: string
  horaFin: string
  titulo: string
  expositores: string[]
  lugar: string
  linkFacebook: string
  enfoque?: string
}

interface Coordinacion {
  moderador: string
  secretarioActas: string
  coordinadorCRTP: string
  responsableAsistencia: string
}

interface DiaCronograma {
  diaClave: string
  etiqueta: string
  enfoque: string
  fecha: { year: number; month: number; date: number }
  eventos: Evento[]
  coordinacion: Coordinacion
}

// 1. Estructura de Datos e Inyección del Cronograma Oficial Completo
const CRONOGRAMA_OFICIAL: Record<string, DiaCronograma> = {
  lunes: {
    diaClave: 'lunes',
    etiqueta: 'Lunes 06 de Julio',
    enfoque: 'PERFIL - COMPETENCIAS',
    fecha: { year: 2026, month: 6, date: 6 },
    eventos: [
      {
        id: 'lun-reg',
        horaInicio: '09:00',
        horaFin: '09:30',
        titulo: 'Inscripciones y registro',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-auth',
        horaInicio: '09:30',
        horaFin: '10:00',
        titulo: 'Intervención de autoridades de la FAADU',
        expositores: ['Autoridades FAADU'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-acad',
        horaInicio: '10:00',
        horaFin: '10:30',
        titulo: 'Comisión academica',
        expositores: ['Comisión Académica'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-1',
        horaInicio: '10:30',
        horaFin: '11:00',
        titulo: 'Del Modelo Declarativo a la Operatividad Socioformativa: Propuesta del Perfil de Egreso y Profesional del Arquitecto FAADU-UMSA 2026 ante la Complejidad Territorial y Laboral del Siglo XXI',
        expositores: ['Fabiola Zaballa', 'Paola Carvallo', 'Silvia Bustos', 'Humberto Candia', 'Manuel Ascarrunz', 'Jahdiel Villafuerte', 'Leonor Cuevas'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-2',
        horaInicio: '11:00',
        horaFin: '11:30',
        titulo: 'EL PERFIL PROFESIONAL DEL ARQUITECTO EN LA FAADU-UMSA: Una reflexión crítica desde las demandas contemporáneas de la disciplina y la sociedad.',
        expositores: ['Arq. Ismael Carvajal Vogtschmidt'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-3',
        horaInicio: '11:30',
        horaFin: '12:00',
        titulo: 'PROPUESTA CONTEMPORÁNEA DE COMPETENCIAS PARA LA FORMACIÓN PROFESIONAL EN ARQUITECTURA A partir del documento Competencias Plan de Estudios 2008 y de referentes institucionales, globales y latinoamericanos',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-4',
        horaInicio: '12:00',
        horaFin: '12:30',
        titulo: 'PERFIL DE EGRESO Y PERFIL PROFESIONAL EN EL PROCESO DE REDISEÑO CURRICULAR DE LA CARRERA DE ARQUITECTURA',
        expositores: ['MsC. Arq. Williams Terrazas'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-5',
        horaInicio: '12:30',
        horaFin: '13:00',
        titulo: 'LÍDER CULTURAL: HACIA UN NUEVO PERFIL DEL ARQUITECTO FAADU – UMSA',
        expositores: ['Arq. Salomon Espejo Quispe'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-6',
        horaInicio: '13:00',
        horaFin: '13:30',
        titulo: 'OPORTUNIDADES LABORALES PARA ARQUITECTOS EN EL SECTOR PUBLICO BOLIVIANO',
        expositores: ['Ezequiel Callisaya Sanchez', 'Alison Angeles Gutierrez Condori', 'Yerly Marupa Colque', 'Jhael Massiel Ramirez Aguilar'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-deb',
        horaInicio: '13:30',
        horaFin: '14:00',
        titulo: 'Conclusiones y debate',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'lun-noc',
        horaInicio: '20:00',
        horaFin: '21:00',
        titulo: 'Rediseño curricular en Artes Plasticas',
        expositores: ['Docentes e Invitados FAADU'],
        lugar: 'Exposicion virtual FACEBOOK LIVE - FAADU UMSA',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      }
    ],
    coordinacion: {
      moderador: 'DR. ARQ. GONZALO EDGAR SALAZAR ANTEQUERA',
      secretarioActas: 'ING. FRANKLIN CUEVAS',
      coordinadorCRTP: 'ARQ. HUMBERTO CANDIA',
      responsableAsistencia: 'UNIV. ALEXANDER CALLISAYA / UNIV. JUAN RENGEL'
    }
  },
  martes: {
    diaClave: 'martes',
    etiqueta: 'Martes 07 de Julio',
    enfoque: 'TALLER - PROYECTO',
    fecha: { year: 2026, month: 6, date: 7 },
    eventos: [
      {
        id: 'mar-reg',
        horaInicio: '09:00',
        horaFin: '09:30',
        titulo: 'Inscripciones y registro',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-7',
        horaInicio: '09:30',
        horaFin: '10:00',
        titulo: 'PROPUESTA DE FORTALECIMIENTO DEL TALLER VERTICAL',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-8',
        horaInicio: '10:00',
        horaFin: '10:30',
        titulo: 'EQUIPAMIENTOS DEMANDADOS VS EQUIPAMIENTOS PROYECTADOS',
        expositores: ['Derick Yura chuquimia', 'Evelin Maya Callisaya', 'Vargas Grover Eduardo Gutierrez Mamani', 'Melany Carolay Mendoza Gutierrez', 'Ruth Ramos Villa'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-9',
        horaInicio: '10:30',
        horaFin: '11:00',
        titulo: 'ESTRATEGIAS DE ARTICULACIÓN E INTEGRACIÓN ENTRE LAS ÁREAS DE CONOCIMIENTO DE TALLER DE PROYECTOS Y EDIFICACIONES',
        expositores: ['Arq. Gustavo Arce Valdivia'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-10',
        horaInicio: '11:00',
        horaFin: '11:30',
        titulo: 'PROYECTO, PROYECTUALIDAD Y TALLER',
        expositores: ['Arq. Guillermo Vladimir Muñoz Marquez'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-11',
        horaInicio: '11:30',
        horaFin: '12:00',
        titulo: 'PROPUESTA DE CREACIÓN DEL TALLER DE URBANISMO',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-12',
        horaInicio: '12:00',
        horaFin: '12:30',
        titulo: 'PROPUESTA PARA LA CREACIÓN DEL LABORATORIO DE TERRITORIO Y PROYECTO (LAB T-P) Mediante la investigación situada, la vinculación social y la praxis transformadora',
        expositores: ['Arq. Gianni Renzo Borja Godoy'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-13',
        horaInicio: '12:30',
        horaFin: '13:00',
        titulo: 'REGLAMENTO DE EVALUACIÓN DOCENTE DE LA CARRERA DE ARQUITECTURA',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-14',
        horaInicio: '13:00',
        horaFin: '13:30',
        titulo: 'GESTOR DE PROYECTOS, INNOVACIÓN Y VINCULACIÓN',
        expositores: ['MsC. Arq. David Antonio Vila Fonseca'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-deb',
        horaInicio: '13:30',
        horaFin: '14:00',
        titulo: 'Conclusiones y debate',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/profile.php?id=100047802766633'
      },
      {
        id: 'mar-noc',
        horaInicio: '20:00',
        horaFin: '21:00',
        titulo: 'EL SISTEMA DE LAS PRÁCTICAS Hacia una nueva educación en Arquitectura. FAADU UMSA',
        expositores: ['Arq. Carlos Villagómez'],
        lugar: 'Exposicion virtual Facebook Live - FAADU UMSA',
        linkFacebook: 'https://www.facebook.com/share/1Y9mPKTwNA/'
      }
    ],
    coordinacion: {
      moderador: 'DR. ARQ. JUAN CARLOS ARANIBAR DEL ALCAZAR',
      secretarioActas: 'ARQ. ZAZANDA SALCEDO',
      coordinadorCRTP: 'ARQ. PAOLA CARVALLO',
      responsableAsistencia: 'UNIV. ABRYL ALIAGA / UNIV. CARLA QUISPE'
    }
  },
  miercoles: {
    diaClave: 'miercoles',
    etiqueta: 'Miércoles 08 de Julio',
    enfoque: 'REFORMA CURRICULAR',
    fecha: { year: 2026, month: 6, date: 8 },
    eventos: [
      {
        id: 'mie-reg',
        horaInicio: '09:00',
        horaFin: '09:30',
        titulo: 'Inscripciones y registro',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-15',
        horaInicio: '09:30',
        horaFin: '10:00',
        titulo: 'REDISEÑO CURRICULAR : FORMANDO AL ARQUITECTO DEL FUTURO EN LA UMSA',
        expositores: ['PhD. Ing. Carlos Fernandez Mariño'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-16',
        horaInicio: '10:00',
        horaFin: '10:30',
        titulo: 'Rediseño Curricular de la Carrera de Arquitectura FAADU–UMSA: Un Modelo Integrado de Formación por Competencias con Enfoque Territorial, Tecnológico e Investigativo',
        expositores: ['Arq. Haydee Bascope Guzmán', 'Arq. Franklin Cuevas Moya', 'MSc. Arq. Zazanda Salcedo Gutierrez', 'Arq. Ricardo Alfaro', 'MSc. Arq. Danilo Raznatovic'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-17',
        horaInicio: '10:30',
        horaFin: '11:00',
        titulo: 'EL ARQUITECTO Y LOS DESAFÍOS EN PROYECTOS DE INVERSIÓN PÚBLICA CONSTRUYENDO EL PERFIL PROFESIONAL Y PERFIL DE EGRESO',
        expositores: ['M.Sc. Ing. Gloria Isla Llanos'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-18',
        horaInicio: '11:00',
        horaFin: '11:30',
        titulo: 'PROPUESTA DE OPTIMIZACIÓN EN EL ACCESO AL POSTGRADO DESDE EL GRADO EN LA CARRERA DE ARQUITECTURA FAADU-UMSA MODELO APLICADO A LA Maestría en Patrimonio Cultural (Su aplicación puede ampliarse a otras Maestrías)',
        expositores: ['Arq. M.Sc. Luis Raul C. Prado Rios'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-19',
        horaInicio: '11:30',
        horaFin: '12:00',
        titulo: 'EL PLANO DEL PROFESIONAL CONTEMPORANEO Diseñando competencias transversales para sobrevivir a la obsolescencia técnica',
        expositores: ['M.Sc. Arq. Heidi Mendoza Barrau'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-20',
        horaInicio: '12:00',
        horaFin: '12:30',
        titulo: 'PROPUESTA RECTORA DE LA REFORMA CURRICULAR Ejes estrategicos',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-21',
        horaInicio: '12:30',
        horaFin: '13:00',
        titulo: 'EPISTEMOLOGÍA DEL HÁBITAT Y LA INNOVACIÓN CURRICULAR: HACIA UN PERFIL PROFESIONAL DE LA ARQUITECTURA EN BOLIVIA 2027',
        expositores: ['Univ. Orlando Baltazar Quispe Roman'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-22',
        horaInicio: '13:00',
        horaFin: '13:30',
        titulo: 'DEL GESTO AL CRITERIO: FORMACIÓN ACADEMICA Y CONSTRUCCION DEL JUICIO ARQUITECTONICO EN LA ENSEÑANZA DEL PROYECTO',
        expositores: ['Univ. Juan Sebastian Garcia Fuentes'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-deb',
        horaInicio: '13:30',
        horaFin: '14:00',
        titulo: 'Conclusiones y debate',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1ET3chX6Xd/'
      },
      {
        id: 'mie-noc',
        horaInicio: '20:00',
        horaFin: '21:00',
        titulo: 'Curricula flexible y la maestria terminal',
        expositores: ['MSc. Arq. Mario Ibañez Ibañez'],
        lugar: 'Exposicion virtual FACEBOOK LIVE - FAADU UMSA',
        linkFacebook: 'https://www.facebook.com/share/1914CUAd9R/'
      }
    ],
    coordinacion: {
      moderador: 'UNIV. GEMA FRANCY OCHOA MOLLINEDO',
      secretarioActas: 'ARQ. HADEÉ BASCOPÉ',
      coordinadorCRTP: 'ARQ. MANUEL ASCARRUNZ',
      responsableAsistencia: 'UNIV. DIANA CARRILLO / UNIV. ERAL LENZ'
    }
  },
  jueves: {
    diaClave: 'jueves',
    etiqueta: 'Jueves 09 de Julio',
    enfoque: 'URBANISMO Y TERRITORIO - HISTORIA',
    fecha: { year: 2026, month: 6, date: 9 },
    eventos: [
      {
        id: 'jue-reg',
        horaInicio: '09:00',
        horaFin: '09:30',
        titulo: 'Inscripciones y registro',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-23',
        horaInicio: '09:30',
        horaFin: '10:00',
        titulo: 'PROYECTOS URBANOS ESTRATÉGICOS PARA LA TRANSFORMACIÓN TERRITORIAL DE LA PAZ 2026 - 2031: HACIA UN MODELO DE CIUDAD RESILIENTE, POLICÉNTRICA Y SOSTENIBLE',
        expositores: ['Univ. Suseth Camila Mejía Arroyo', 'Univ. José Manuel Peralta Villanueva', 'Docente: Mg Sc.Arq. José María L. Vargas Aliaga'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-24',
        horaInicio: '10:00',
        horaFin: '10:30',
        titulo: '¿Qué problemas estamos enseñando a resolver? Análisis territorial de los proyectos de grado de Arquitectura UMSA (2020-2024) como insumo para el rediseño curricular',
        expositores: ['Calle Nina, Maribel Lizeth', 'Castro Pinedo, Adriana', 'Iriarte Valles, Franklin Rolando', 'Huanca Poma, Evelin', 'Manrique Sanjines, Maria Fernanda', 'Ocaña Flores, Alessandro Daniel', 'Quino Aduviri, Sheyla Mariel', 'MSc. Arq. Ximena Cecilia León Villarroel'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-25',
        horaInicio: '10:30',
        horaFin: '11:00',
        titulo: 'CREACIÓN DE LA CARRERA DE URBANISMO Y AREA METROPOLITANA COMO RESPUESTA AL PROCESO DE CAMBIO DE CURRICULA ACADEMICA FAADU',
        expositores: ['PhD. Arq. Jorge Sainz Cardona'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-26',
        horaInicio: '11:00',
        horaFin: '11:30',
        titulo: 'ÁREAS DISCIPLINARES DEMANDADAS VS. ÁREAS DISCIPLINARES DESARROLLADAS',
        expositores: ['Perales Quisbert Keyti Yanine', 'Limachi Choque Eidan Josué', 'Cuentas Encinas Santiago'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-27',
        horaInicio: '11:30',
        horaFin: '12:00',
        titulo: 'INTERACCIÓN SOCIAL Y EXTENSIÓN UNIVERSITARIA EN LA CARRERA DE ARQUITECTURA FAADU – UMSA Propuesta para el Rediseño Curricular por Competencias 2027: Fundamentos históricos, contexto comparado y modelo operativo',
        expositores: ['Univ. Orlando Baltazar Quispe Román'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-28',
        horaInicio: '12:00',
        horaFin: '12:30',
        titulo: 'Ecologías de aprendizaje e interdependencia: una propuesta para el rediseño curricular de arquitectura',
        expositores: ['MsC. Arq. Vania Susana Calle Quispe'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-29',
        horaInicio: '12:30',
        horaFin: '13:00',
        titulo: 'Desconexión entre formación académica y demanda estatal de infraestructura en Bolivia',
        expositores: ['Avril Mayli Castro Castillo', 'Naira Estefani Mita Pajsi', 'Max Antony Tarqui Apaza'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-30',
        horaInicio: '13:00',
        horaFin: '13:30',
        titulo: 'Historia como generador de pensamiento crítico Postura Académica para el Sub Ámbito de Historia',
        expositores: ['Bascopé Haydeé', 'Calsina Rosario', 'Candia Humberto', 'Carvallo Paola', 'Escalante Javier', 'Espinoza Walter', 'Mendoza Heidi', 'Prado Luis'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-deb',
        horaInicio: '13:30',
        horaFin: '14:00',
        titulo: 'Conclusiones y debate',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1EYTAm9pc1/'
      },
      {
        id: 'jue-noc',
        horaInicio: '20:00',
        horaFin: '22:00',
        titulo: 'Inteligencia artificial aplicada a la carrera de arquitectura',
        expositores: ['MSc. Lic. Sergio Álvarez Molina'],
        lugar: 'Exposicion virtual - Facebook Live - FAADU UMSA',
        linkFacebook: 'https://www.facebook.com/share/188H1pGiP9/'
      }
    ],
    coordinacion: {
      moderador: 'UNIV. ADRIANA ROSELLO AVENDAÑO',
      secretarioActas: 'ARQ. RICARDO ALFARO',
      coordinadorCRTP: 'ARQ. SILVIA BUSTOS',
      responsableAsistencia: 'UNIV. CAMILA ENCINAS / UNIV. EYENIL RODRIGUEZ'
    }
  },
  viernes: {
    diaClave: 'viernes',
    etiqueta: 'Viernes 10 de Julio',
    enfoque: 'EXPRESION REPRESENTACION AI - HERRAMIENTAS DIGITALES - INVESTIGACIÓN',
    fecha: { year: 2026, month: 6, date: 10 },
    eventos: [
      {
        id: 'vie-reg',
        horaInicio: '09:00',
        horaFin: '09:30',
        titulo: 'Inscripciones y registro',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-31',
        horaInicio: '09:30',
        horaFin: '10:00',
        titulo: 'La Filosofía en la Enseñanza de la Arquitectura: Heidegger, Foucault y el Pensamiento Crítico del Espacio',
        expositores: ['Arq. Jorge E. Bolaños Medrano'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-32',
        horaInicio: '10:00',
        horaFin: '10:30',
        titulo: 'LA REPRESENTACIÓN Y EXPRESIÓN GRÁFICA COMO BASE DEL DESARROLLO DE COMPETENCIAS EN EL NUEVO CURRÍCULO DE ARQUITECTURA',
        expositores: ['MSc. Arq. Esdenka Araoz Acosta'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-33',
        horaInicio: '10:30',
        horaFin: '11:00',
        titulo: 'PROPUESTA DE LA IMPLEMENTACIÓN DE LA METODOLOGIA BIM EN EL CURRICULO DE LA CARRERA DE ARQUITECTURA FAADU',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-34',
        horaInicio: '11:00',
        horaFin: '11:30',
        titulo: 'Propuesta de incorporación de una Malla Curricular BIM en la Carrera de Arquitectura FAADU-UMSA como estrategia de innovación curricular, transformación digital y fortalecimiento del perfil profesional',
        expositores: ['Ing. Ramiro Mauricio Chaira Delgado'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-35',
        horaInicio: '11:30',
        horaFin: '12:00',
        titulo: 'Una mirada hacia la investigación',
        expositores: ['Arq. M.Sc. Belen Alvarado Mollinedo'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-36',
        horaInicio: '12:00',
        horaFin: '12:30',
        titulo: 'La investigación como eje transversal del rediseño curricular: De la asignatura aislada al sistema de investigación formativa',
        expositores: ['M.Sc. Ing. Luz Mariela Choque Ayllón'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-37',
        horaInicio: '12:30',
        horaFin: '13:00',
        titulo: 'Propuesta de programa por competencias Metodología de la Investigación Arquitectónica y Proyectual Carrera de Arquitectura - FAADU - Universidad Mayor de San Andrés',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-38',
        horaInicio: '13:00',
        horaFin: '13:30',
        titulo: 'INSTALACIONES ESPECIALES Y TECNOLOGIAS DE INNOVACIÓN',
        expositores: ['Ing. Ruben Juan Rocha Aguilar'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-deb',
        horaInicio: '13:30',
        horaFin: '14:00',
        titulo: 'Conclusiones y debate',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1Bjkag4uwA/'
      },
      {
        id: 'vie-noc',
        horaInicio: '20:00',
        horaFin: '21:00',
        titulo: 'RE ensamblar la teoria de la forma',
        expositores: ['Arq. Augusto Yépez'],
        lugar: 'Exposicion virtual - Facebook Live - FAADU UMSA',
        linkFacebook: 'https://www.facebook.com/share/1L75yS79Jk/'
      }
    ],
    coordinacion: {
      moderador: 'ING. CRISTHOFFER TITO AGUILA GOMEZ',
      secretarioActas: 'ARQ. DANILO RAZNATOVIC',
      coordinadorCRTP: 'ING. GLORIA ISLAS',
      responsableAsistencia: 'UNIV. ITARAY GUTIERREZ / UNIV. FERNANDA TORRES'
    }
  },
  lunes13: {
    diaClave: 'lunes13',
    etiqueta: 'Lunes 13 de Julio',
    enfoque: 'PROPUESTAS DE MATERIAS CURRICULARES',
    fecha: { year: 2026, month: 6, date: 13 },
    eventos: [
      {
        id: 'lun13-reg',
        horaInicio: '09:00',
        horaFin: '09:30',
        titulo: 'Inscripciones y registro',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: ' https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-39',
        horaInicio: '09:30',
        horaFin: '10:00',
        titulo: 'Hacia un arquitecto con competencias legales y éticas: Propuesta de incorporación de legislación y práctica profesional como materia transdisciplinar en la Carrera de Arquitectura de la UMSA',
        expositores: ['M.Sc. Ing. Luz Mariela Choque Ayllón'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-40',
        horaInicio: '10:00',
        horaFin: '10:30',
        titulo: 'PRESENTACIÓN DE PROPUESTA DE DISEÑO MICRO CURRICULAR DE LA MATERIA: ANALISÍS ESTRÚCTURAL 1 ED-303',
        expositores: ['MSc. Ing. Nicanor Polo Cruz'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-41',
        horaInicio: '10:30',
        horaFin: '11:00',
        titulo: 'PROPUESTA ACTUALIZADA DE PROGRAMA POR COMPETENCIAS, ASIGNATURA RAZONAMIENTO MATEMATICO',
        expositores: ['MsC. Arq. Roberto Moreira Cordova'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-42',
        horaInicio: '11:00',
        horaFin: '11:30',
        titulo: 'PROPUESTA DE INCORPORACIÓN DE ASIGNATURA "PREPARACIÓN Y GESTIÓN DE PROYECTOS" Al regimen regular obligatorio de la malla regular de arquitectura',
        expositores: ['Mg. Victor Rolando Cansaya Cuchani'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-43',
        horaInicio: '11:30',
        horaFin: '12:00',
        titulo: 'Propuesta de actualización de LA ENSEÑANZA DE LA MATEMÁTICA EN LA FORMACIÓN DE ARQUITECTOS',
        expositores: ['Arq. Jorge Alfredo de la Rocha Justiniano'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-44',
        horaInicio: '12:00',
        horaFin: '12:30',
        titulo: 'PROPUESTA PARA QUE LA MATERIA DE PATRIMONIO CULTURAL Y NATURAL SE CONSTITUYA EN MATERIA REGULAR OBLIGATORIA DE LA CARRERA DE ARQUITECTURA DE LA FAADU- UMSA',
        expositores: ['Arq. M.Sc. Luis Raul C. Prado Rios'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-45',
        horaInicio: '12:30',
        horaFin: '13:00',
        titulo: 'Asignatura Probabilidad y estadistica',
        expositores: ['PhD. Efrain Santalla Alejo'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-46',
        horaInicio: '13:00',
        horaFin: '13:30',
        titulo: 'El sistema de admisión como filtro hidráulico: propuesta de rediseño para la calidad académica y la reducción del estrés en la FAADU-UMSA',
        expositores: ['Univ. Chura Mamani Daniel'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-tit',
        horaInicio: '13:30',
        horaFin: '14:00',
        titulo: 'PROPUESTA DE PRIORIZACIÓN E INCENTIVACIÓN EN LA TITULACIÓN MEDIANTE TESIS y PROYECTOS DE GRADO DE MANERA INTERDISCIPLINAR y TRANSDISCIPLINAR.',
        expositores: ['Arq. M.Sc. Luis Raul C. Prado Rios'],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-deb',
        horaInicio: '14:00',
        horaFin: '14:30',
        titulo: 'Conclusiones y debate',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/share/1JvVtTY2KM/'
      },
      {
        id: 'lun13-cie',
        horaInicio: '14:30',
        horaFin: '15:00',
        titulo: 'Cierre / refrigerio',
        expositores: [],
        lugar: 'Auditorio Principal / Capilla de la Facultad',
        linkFacebook: 'https://www.facebook.com/100047802766633/videos/1737173773946746'
      }
    ],
    coordinacion: {
      moderador: 'M.SC. ARQ. HEIDI MENDOZA BARRAU',
      secretarioActas: 'MSC. ARQ. RICARDO ALFARO',
      coordinadorCRTP: 'ARQ. FABIOLA ZABALLA',
      responsableAsistencia: 'UNIV. ALEXANDER CALLISAYA / UNIV. JUAN RANGEL'
    }
  }
}

// Enlace al documento de la comisión (puedes cambiar esta URL por el enlace real de Drive, PDF, etc.)
const LINK_DOCUMENTO_COMISION = 'https://faadu.umsa.bo/carreras/arquitectura/comision-de-rediseno-curricular/'

// Convertir hora "HH:MM" a minutos de día
const convertirHoraAMinutos = (hora: string): number => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

// Saber si hoy calendario coincide con la clave
const esElDiaDeHoy = (dia: DiaCronograma, fecha: Date): boolean => {
  return (
    fecha.getFullYear() === dia.fecha.year &&
    fecha.getMonth() === dia.fecha.month &&
    fecha.getDate() === dia.fecha.date
  )
}

export default function Page() {
  const [diaActual, setDiaActual] = useState<string>('lunes')
  const [fechaSistema, setFechaSistema] = useState<Date | null>(null)
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false)

  // Modales y Lightboxes
  const [modalConfig, setModalConfig] = useState<Evento | null>(null)
  const [activePonenciaId, setActivePonenciaId] = useState<string | null>(null)
  const [lastAlertedEventId, setLastAlertedEventId] = useState<string | null>(null)
  const [qrAmpliado, setQrAmpliado] = useState<string | null>(null)

  // Imagenes robustas fallbacks state
  const [logoUmsaSrc, setLogoUmsaSrc] = useState('/Logo_Umsa.png')
  const [logoFaaduSrc, setLogoFaaduSrc] = useState('/faadu-logo.png')
  const [logoCrtpSrc, setLogoCrtpSrc] = useState('/logo_crtp.png')

  // Tick del reloj en tiempo real
  useEffect(() => {
    setFechaSistema(new Date())
    const interval = setInterval(() => {
      setFechaSistema(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Sincronización automática de día al cargar (Ocurre sólo una vez)
  useEffect(() => {
    if (!fechaSistema || hasInitialLoaded) return

    const hoyClave = Object.values(CRONOGRAMA_OFICIAL).find((dia) => esElDiaDeHoy(dia, fechaSistema))
    if (hoyClave) {
      setDiaActual(hoyClave.diaClave)
    } else {
      setDiaActual('lunes') // Fallback al primer día oficial
    }
    setHasInitialLoaded(true)
  }, [fechaSistema, hasInitialLoaded])

  // Lógica de alerta modal "En vivo" automática
  // Ocurre sólo cuando la hora del reloj del sistema cambia de rango de un bloque en el día actual del evento
  useEffect(() => {
    if (!fechaSistema) return

    // Buscar si hoy calendario es el día de hoy
    const diaDeHoy = Object.values(CRONOGRAMA_OFICIAL).find((d) => esElDiaDeHoy(d, fechaSistema))
    if (!diaDeHoy) return

    const minutosActuales = fechaSistema.getHours() * 60 + fechaSistema.getMinutes()
    const ponenciaEnCurso = diaDeHoy.eventos.find((e) => {
      // Filtrar recesos / inscripciones sin expositores
      if (e.expositores.length === 0) return false
      const inicio = convertirHoraAMinutos(e.horaInicio)
      const fin = convertirHoraAMinutos(e.horaFin)
      return minutosActuales >= inicio && minutosActuales < fin
    })

    if (ponenciaEnCurso) {
      if (ponenciaEnCurso.id !== activePonenciaId) {
        setActivePonenciaId(ponenciaEnCurso.id)
        // Disparar modal si el usuario está visualizando este día y no se ha alertado ya para este id
        if (diaActual === diaDeHoy.diaClave && ponenciaEnCurso.id !== lastAlertedEventId) {
          setModalConfig(ponenciaEnCurso)
          setLastAlertedEventId(ponenciaEnCurso.id)
        }
      }
    } else {
      setActivePonenciaId(null)
    }
  }, [fechaSistema, diaActual, activePonenciaId, lastAlertedEventId])

  // Helpers para obtener estado de una ponencia
  const obtenerEstadoPonencia = (evento: Evento, dia: DiaCronograma): 'en-vivo' | 'proximo' | 'pasado' => {
    if (!fechaSistema) return 'proximo'

    const fechaHoySinHora = new Date(fechaSistema.getFullYear(), fechaSistema.getMonth(), fechaSistema.getDate())
    const fechaEvSinHora = new Date(dia.fecha.year, dia.fecha.month, dia.fecha.date)

    if (fechaHoySinHora.getTime() > fechaEvSinHora.getTime()) {
      return 'pasado'
    } else if (fechaHoySinHora.getTime() < fechaEvSinHora.getTime()) {
      return 'proximo'
    } else {
      // Mismo día
      const minutosActuales = fechaSistema.getHours() * 60 + fechaSistema.getMinutes()
      const inicio = convertirHoraAMinutos(evento.horaInicio)
      const fin = convertirHoraAMinutos(evento.horaFin)

      if (minutosActuales < inicio) {
        return 'proximo'
      } else if (minutosActuales >= fin) {
        return 'pasado'
      } else {
        return 'en-vivo'
      }
    }
  }

  const diaSeleccionadoObj = CRONOGRAMA_OFICIAL[diaActual]

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header Institucional de Tres Columnas */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-6 items-center">
          {/* Columna Izquierda: Escudo UMSA */}
          <div className="flex justify-center md:justify-start">
            <img
              src={logoUmsaSrc}
              alt="Logo UMSA"
              className="h-24 object-contain transition-all duration-300 hover:scale-105"
              onError={() => setLogoUmsaSrc('/Logo_Umsa.png')}
            />
          </div>

          {/* Columna Central: Texto Centrado */}
          <div className="text-center space-y-1">
            <span className="block text-xs font-bold text-slate-400 tracking-widest uppercase">
              Universidad Mayor de San Andrés
            </span>
            <span className="block text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Facultad de Arquitectura, Artes, Diseño y Urbanismo
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              Jornadas de Rediseño de la Malla Curricular de la Carrera de Arquitectura
            </h1>
            <p className="text-sm text-amber-600 font-medium italic mt-1">
              Hacia la nueva Currícula de la Carrera de Arquitectura por Competencias
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
                title="Abrir Documento de Comisión"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Comisión de Rediseño Curricular</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Imagen FAADU */}
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

      {/* Sección Central (Bloques de la APP) */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Cronograma del Evento
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Seleccione un día para explorar los horarios y ponencias virtuales
            </p>
          </div>

          {/* Badge EN VIVO global si hay alguna ponencia en vivo actualmente en el día de hoy */}
          {fechaSistema && (
            (() => {
              const hoyD = Object.values(CRONOGRAMA_OFICIAL).find((d) => esElDiaDeHoy(d, fechaSistema))
              const enVivoAhora = hoyD?.eventos.some((e) => obtenerEstadoPonencia(e, hoyD) === 'en-vivo' && e.expositores.length > 0)
              if (enVivoAhora) {
                return (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-xs tracking-wider animate-pulse shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                    <span>TRANSMISIÓN EN VIVO AHORA</span>
                  </div>
                )
              }
              return null
            })()
          )}
        </div>

        {/* Pestañas de Selección de Días */}
        <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-2 rounded-xl shadow-xs border border-slate-200">
          {Object.values(CRONOGRAMA_OFICIAL).map((dia) => {
            const isSelected = diaActual === dia.diaClave
            const esHoy = fechaSistema && esElDiaDeHoy(dia, fechaSistema)

            return (
              <button
                key={dia.diaClave}
                onClick={() => setDiaActual(dia.diaClave)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-xs md:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${isSelected
                  ? 'bg-amber-500 text-white shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-400'
                  } relative`}
              >
                {dia.etiqueta}
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

        {/* Detalle del enfoque del día seleccionado */}
        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-xs uppercase tracking-widest font-extrabold text-amber-800">Enfoque Académico Diario</p>
          <h3 className="text-base font-black text-slate-900 mt-0.5">{diaSeleccionadoObj.enfoque}</h3>
        </div>

        {/* Tarjetas de Ponencias del Día */}
        <div className="grid gap-4">
          {diaSeleccionadoObj.eventos.map((evento) => {
            const estado = obtenerEstadoPonencia(evento, diaSeleccionadoObj)
            const esEnVivo = estado === 'en-vivo'
            const esPasado = estado === 'pasado'
            const tieneExpositores = evento.expositores.length > 0

            return (
              <div
                key={evento.id}
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
                    🔴 EN VIVO AHORA
                  </span>
                )}

                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                  {/* Horario y Lugar */}
                  <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-1.5 min-w-[150px]">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm md:text-base">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{evento.horaInicio} - {evento.horaFin}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[180px] md:max-w-none">{evento.lugar}</span>
                    </div>
                  </div>

                  {/* Detalle Ponencia */}
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                      {evento.titulo}
                    </h4>
                    {tieneExpositores && (
                      <p className="text-xs md:text-sm text-slate-500 font-medium">
                        🎙️ <span className="font-semibold text-slate-600">{evento.expositores.join(', ')}</span>
                      </p>
                    )}
                  </div>

                  {/* Acciones e interacción QR */}
                  {tieneExpositores && (
                    <div className="flex items-center gap-3 pt-3 md:pt-0 w-full md:w-auto shrink-0 justify-end">
                      {esEnVivo ? (
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 shadow-xs w-full md:w-auto justify-between">
                          <a
                            href={evento.linkFacebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                          >
                            <FacebookIcon className="w-4 h-4 shrink-0" />
                            Entrar a Facebook Live
                          </a>
                          <div
                            className="bg-white p-1 rounded-md border border-blue-200 cursor-zoom-in hover:scale-105 transition-transform shrink-0"
                            title="Ampliar código QR"
                            onClick={() => setQrAmpliado(evento.linkFacebook)}
                          >
                            <QRCodeSVG value={evento.linkFacebook} size={42} level="M" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                          <a
                            href={esPasado ? undefined : evento.linkFacebook}
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
                              title="Ampliar código QR"
                              onClick={() => setQrAmpliado(evento.linkFacebook)}
                            >
                              <QRCodeSVG value={evento.linkFacebook} size={36} level="M" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Apartado "Coordina y Modera" Inferior */}
        <div className="bg-slate-100 rounded-xl border border-slate-200 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Users className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm md:text-base tracking-tight text-slate-800">
              EQUIPO DE COORDINACIÓN NOCTURNA (20:00 - 21:00)
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
                    {diaSeleccionadoObj.coordinacion.moderador}
                  </td>
                </tr>
                <tr className="border-b border-slate-200/60">
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider">
                    SECRETARIO DE ACTAS
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.secretarioActas}
                  </td>
                </tr>
                <tr className="border-b border-slate-200/60">
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider">
                    COORDINADOR CRTP
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.coordinadorCRTP}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-slate-500 uppercase tracking-wider">
                    RESPONSABLE DE ASISTENCIA
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {diaSeleccionadoObj.coordinacion.responsableAsistencia}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ventana Modal Emergente: Alerta de Transmisión */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera Modal */}
            <div className="bg-gradient-to-r from-red-600 to-amber-500 p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span className="text-xs font-black tracking-widest uppercase">ALERTA DE TRANSMISIÓN EN VIVO</span>
              </div>
              <button
                onClick={() => setModalConfig(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <p className="text-xs text-amber-600 font-extrabold uppercase tracking-widest">PONENCIA EMPEZANDO</p>
                <h3 className="text-lg md:text-xl font-bold text-neutral-950 leading-snug">
                  {modalConfig.titulo}
                </h3>
              </div>

              {/* Informaciones de Tiempo y Fecha en Alto Contraste */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs md:text-sm text-neutral-950 font-bold">
                    Fecha: <span className="font-extrabold">{diaSeleccionadoObj.etiqueta.split(' de ')[0]}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3 rounded-lg border border-slate-200">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs md:text-sm text-neutral-950 font-bold">
                    Horario: <span className="font-extrabold">{modalConfig.horaInicio} - {modalConfig.horaFin}</span>
                  </span>
                </div>
              </div>

              {/* Caja de detalles de los expositores */}
              {modalConfig.expositores.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 block">Expositores Oficiales</span>
                  <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                    {modalConfig.expositores.join(', ')}
                  </p>
                </div>
              )}

              {/* Enlace y QR */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 w-full">
                {/* Lado Izquierdo */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">CANAL OFICIAL</h4>
                  <p className="text-xs text-slate-400 truncate w-full max-w-[280px] sm:max-w-[160px] md:max-w-[220px]" title={modalConfig.linkFacebook}>
                    {modalConfig.linkFacebook}
                  </p>
                </div>

                {/* Centro / Lado Derecho (Botón) */}
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

                {/* Extremo Derecho (Código QR) */}
                <div className="shrink-0 flex justify-center">
                  <div
                    className="bg-white p-1 rounded-xl border border-slate-200 cursor-zoom-in hover:scale-105 transition-transform shadow-xs flex items-center justify-center w-14 h-14"
                    title="Ampliar código QR"
                    onClick={() => setQrAmpliado(modalConfig.linkFacebook)}
                  >
                    <QRCodeSVG value={modalConfig.linkFacebook} size={48} level="M" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
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
            {/* Botón cerrar */}
            <button
              onClick={() => setQrAmpliado(null)}
              className="absolute top-3 right-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
              title="Cerrar vista ampliada"
            >
              <X className="h-5 w-5" />
            </button>

            {/* QR Content */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mt-3">
              <QRCodeSVG value={qrAmpliado} size={300} level="H" includeMargin={true} />
            </div>

            <p className="mt-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              Escanee para ingresar a la transmisión
            </p>
          </div>
        </div>
      )}

      {/* Footer Institucional de Dos Columnas */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 md:px-8 mt-12 text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          {/* Columna Izquierda: Datos CRTP */}
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
              Centro de Recursos Tecnológicos y Pedagógicos (CRTP)
            </h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl">
              Calle Héroes del Acre Nro. 1850 | Teléfono: (591-2) 2491481 2484818-int 117 | Email:{' '}
              <a href="mailto:faadu.crtp@umsa.bo" className="text-amber-600 font-bold hover:underline transition-colors">
                faadu.crtp@umsa.bo
              </a>
            </p>
          </div>

          {/* Columna Derecha: Logotipo CRTP */}
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
          © 2026 Facultad de Arquitectura, Artes, Diseño y Urbanismo (FAADU) - UMSA. Todos los derechos reservados.
        </div>
      </footer>

      {/* Botón flotante para el Documento de Comisión */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={LINK_DOCUMENTO_COMISION}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-bold text-xs md:text-sm border border-amber-400 group cursor-pointer"
          title="Ver Documento de Comisión"
        >
          <FileText className="w-4 h-4 md:w-5 md:h-5 animate-pulse group-hover:scale-110 transition-transform" />
          <span>Comisión de Rediseño Curricular</span>
        </a>
      </div>
    </main>
  )
}
