// Shared task helpers, used by both the project detail panel (ProjectDetail)
// and the global tasks timeline (Proyectos "Tareas" subtab).

const MESES_ES = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

export const MESES_LARGO = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Handles ISO, DD/MM/YY(YY), and Spanish "18 de mayo de 2025". Noon-anchored
// to avoid timezone off-by-one drift. Returns a Date or null.
export function parseFecha(str) {
  if (!str) return null;
  const iso = new Date(`${str}T12:00:00`);
  if (!isNaN(iso.getTime())) return iso;
  const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmy) {
    const yr = dmy[3].length === 2 ? 2000 + parseInt(dmy[3], 10) : parseInt(dmy[3], 10);
    return new Date(yr, parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10), 12);
  }
  const es = str.match(/(\d{1,2})\s+de\s+(\w+)(?:[,\s]+(\d{4}))?/i);
  if (es) {
    const month = MESES_ES[es[2].toLowerCase()];
    const year = es[3] ? parseInt(es[3], 10) : new Date().getFullYear();
    if (month !== undefined) return new Date(year, month, parseInt(es[1], 10), 12);
  }
  return null;
}

// Normalize estado for comparison: "En Progreso" → "en progreso"
function normEstado(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

// Map a raw estado to a display label, status-pill class, and left-bar class.
export function estadoInfo(estado) {
  const e = normEstado(estado);
  if (['en progreso', 'en curso', 'progreso', 'ongoing', 'working'].includes(e)) {
    return { label: 'En progreso', cls: 'status-progreso', bar: 'task-bar-progreso', done: false };
  }
  if (['completada', 'completado', 'hecho', 'hecha', 'done', 'finalizada', 'lista'].includes(e)) {
    return { label: 'Completada', cls: 'status-completada', bar: 'task-bar-completada', done: true };
  }
  return { label: 'Pendiente', cls: 'status-pendiente', bar: 'task-bar-pendiente', done: false };
}

// Compare by due date, ascending. Undated tasks sort last.
export function byFechaLimite(a, b) {
  const da = parseFecha(a.fecha_limite);
  const db = parseFecha(b.fecha_limite);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return da - db;
}
