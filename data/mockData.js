export const slides = [
  { title: 'Cambio de sede — Sesión Mayo', date: '8 de mayo, 2025', bg: 'linear-gradient(135deg,#d41367,#3d3445)' },
  { title: 'Noche cultural Rotaract', date: '1 de mayo, 2025', bg: 'linear-gradient(135deg,#1a6fa8,#d41367)' },
  { title: 'Jornada de reforestación', date: '28 de abril, 2025', bg: 'linear-gradient(135deg,#2a7a35,#1a6fa8)' },
];

export const reminders = [
  {
    badge: 'Recordatorio',
    date: '5 mayo 2025',
    title: 'Cuotas pendientes — Junio',
    text: 'El plazo para el pago de la cuota mensual vence el 15 de junio.',
  },
  {
    badge: 'Recordatorio',
    date: '3 mayo 2025',
    title: 'Confirmar asistencia — Sesión 18 mayo',
    text: 'Avisar a la junta directiva si no pueden asistir.',
  },
];

export const miClubEvents = [
  {
    month: 'Mayo',
    year: '2025',
    events: [
      { type: 'sesion', pill: 'Sesión', day: '18', dow: 'Dom', title: 'Sesión quincenal del club', time: '10:00 AM', place: 'Sede Rotary', flyer: false },
      { type: 'proyecto', pill: 'Proyecto', day: '24', dow: 'Sáb', title: 'Jornada de reforestación — Fase 2', time: '8:00 AM', place: 'Reserva Xibalbá', flyer: true },
    ],
  },
  {
    month: 'Junio',
    year: '2025',
    events: [
      { type: 'sesion', pill: 'Sesión', day: '1', dow: 'Dom', title: 'Sesión quincenal del club', time: '10:00 AM', place: 'Sede Rotary', flyer: false },
      { type: 'evento', pill: 'Evento', day: '7', dow: 'Sáb', title: 'Noche cultural Rotaract', time: '7:00 PM', place: 'Centro Cultural', flyer: true },
    ],
  },
];

export const rotaryEvents = [
  {
    month: 'Mayo',
    year: '2025',
    events: [
      { type: 'club-rotary', pill: 'Sesión', day: '18', dow: 'Dom', title: 'Sesión quincenal del club', time: '10:00 AM', place: 'Sede Rotary', flyer: false },
      { type: 'guest', pill: 'Invitado', day: '21', dow: 'Mié', title: 'Feria vocacional — Club Quetzal', time: '9:00 AM', place: 'Campus Landívar', flyer: true },
      { type: 'club-rotary', pill: 'Proyecto', day: '24', dow: 'Sáb', title: 'Jornada de reforestación — Fase 2', time: '8:00 AM', place: 'Reserva Xibalbá', flyer: false },
    ],
  },
];

export const projects = [
  {
    id: 'reforestacion',
    area: 'Medio ambiente',
    bg: 'linear-gradient(135deg,#2a7a35,#1a6fa8)',
    title: 'Reforestación Xibalbá',
    desc: 'Siembra de árboles nativos en zonas degradadas. Meta: 500 árboles en 3 fases.',
    leader: { initials: 'AM', name: 'Ana Morales' },
    deadline: 'Jun 2025',
    updated: 'Actualizado: 4 mayo',
    objetivo: 'Reforestar 3 hectáreas de zona degradada en la Reserva Xibalbá mediante la siembra de 500 árboles nativos distribuidos en 3 fases durante 2025.',
    contexto: 'La Reserva Xibalbá ha perdido el 40% de su cobertura forestal en los últimos 10 años debido a la expansión agrícola no controlada. Este proyecto busca restaurar el ecosistema nativo y crear conciencia ambiental en comunidades locales.',
    eventos: [
      { day: '24', month: 'Mayo', title: 'Jornada de reforestación — Fase 2', meta: '8:00 AM · Reserva Xibalbá' },
      { day: '14', month: 'Jun', title: 'Jornada de reforestación — Fase 3', meta: '8:00 AM · Reserva Xibalbá' },
    ],
    pasos: [
      'Confirmar transporte para el 24 de mayo con todos los voluntarios.',
      'Coordinar con guardabosques la zona de siembra de la Fase 2.',
      'Documentar con fotos y video el avance para el informe final.',
    ],
    ayuda: [
      'Voluntarios para jornada de siembra — mínimo 4 horas.',
      'Donación de herramientas: palas, cubetas, guantes.',
      'Apoyo en documentación y redes sociales del evento.',
    ],
  },
  {
    id: 'biblioteca',
    area: 'Educación',
    bg: 'linear-gradient(135deg,#d41367,#7a7280)',
    title: 'Biblioteca Móvil',
    desc: 'Dotación de libros y talleres de lectura en comunidades rurales.',
    leader: { initials: 'CR', name: 'Carlos Rivas' },
    deadline: 'Ago 2025',
    updated: 'Actualizado: 20 abril',
    objetivo: 'Llevar libros y talleres de lectura a 4 comunidades rurales del departamento, beneficiando a más de 200 niños en edad escolar.',
    contexto: 'En las comunidades rurales del altiplano, el acceso a material de lectura es limitado. La biblioteca móvil lleva una selección de libros y facilita talleres de animación lectora en coordinación con maestros locales.',
    eventos: [
      { day: '7', month: 'Jun', title: 'Visita Comunidad San Lucas', meta: '9:00 AM · San Lucas Tolimán' },
    ],
    pasos: [
      'Clasificar y empacar los libros donados por categoría de edad.',
      'Coordinar con la maestra de San Lucas la logística de la visita.',
      'Preparar dinámica de animación lectora para 30 minutos.',
    ],
    ayuda: [
      'Donación de libros infantiles y juveniles en buen estado.',
      'Transporte para el 7 de junio (camioneta o pickup).',
      'Facilitadores para el taller de lectura (1-2 personas).',
    ],
  },
];

export const actas = [
  { id: 'pdf-1', title: 'Sesión ordinaria — Mayo 2025', date: '4 de mayo, 2025', fileName: 'Acta Mayo 2025.pdf' },
  { id: 'pdf-2', title: 'Sesión ordinaria — Abril 2025', date: '20 de abril, 2025', fileName: 'Acta Abril 2025.pdf' },
];
