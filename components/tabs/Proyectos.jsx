'use client';
import { useState, useMemo } from 'react';
import {
  IconCalendar,
  IconArrowRight,
  IconListCheck,
  IconUser,
  IconInfoCircle,
  IconFolder,
} from '@tabler/icons-react';
import { estadoInfo, parseFecha, byFechaLimite, MESES_LARGO, DIAS } from '@/lib/tasks';

// First letter of each name (max 2). "Jaime" → "J", "Juan An" → "JA".
function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}

// Splits multiline sheet fields — Google Sheets exports Enter as \n
const splitLines = str => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];

const splitSemi = str => str ? str.split(';').map(s => s.trim()).filter(Boolean) : [];

function parseEventos(str) {
  return splitSemi(str).map(entry => {
    const [day, month, title, meta] = entry.split('|').map(s => s.trim());
    return { day, month, title, meta };
  }).filter(e => e.title);
}

// Transforms a raw sheet row into the shape ProjectDetail expects.
// Column names: lider | deadline | imagen_url | proximos_pasos | como_ayudar | actualizado
function toProjectDetail(p, tareas) {
  const liderName = p.lider || '';
  return {
    ...p,
    title: p.titulo,
    bg: p.bg || 'linear-gradient(135deg,var(--cranberry),var(--ink-700))',
    updated: p.actualizado || '',
    objetivo: p.objetivo || '',
    contexto: p.contexto || '',
    leader: {
      initials: initials(liderName),
      name: liderName,
    },
    deadline: p.deadline || '',
    pasos: splitLines(p.proximos_pasos),
    ayuda: splitLines(p.como_ayudar),
    eventos: parseEventos(p.eventos_proyecto),
    tareas,
  };
}

// Tasks for a project, matched by id. Projects without an id can't have tasks attached.
function tasksFor(project, tareas) {
  if (!project.id) return [];
  return tareas.filter(t => t.proyecto_id === project.id);
}

// Flatten every task across all projects and group by due-date month, soonest
// first (overdue months bubble to the top — exactly what a reminder needs).
// Undated tasks land in a "Sin fecha" group at the bottom.
function buildTimeline(proyectos, tareas) {
  const nameById = new Map(proyectos.filter(p => p.id).map(p => [p.id, p.titulo]));
  const groups = {};
  const undated = [];
  for (const t of tareas) {
    // Skip tasks that aren't linked to an existing project (blank or unknown id).
    if (!nameById.has(t.proyecto_id)) continue;
    const enriched = {
      ...t,
      _estado: estadoInfo(t.estado),
      _proyecto: nameById.get(t.proyecto_id),
    };
    const d = parseFecha(t.fecha_limite);
    if (!d) {
      undated.push(enriched);
      continue;
    }
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!groups[key]) {
      groups[key] = { label: `${MESES_LARGO[d.getMonth()]} ${d.getFullYear()}`, sortKey: key, tasks: [] };
    }
    groups[key].tasks.push({ ...enriched, _day: String(d.getDate()), _dow: DIAS[d.getDay()] });
  }
  const ordered = Object.values(groups)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(g => ({ ...g, tasks: g.tasks.sort(byFechaLimite) }));
  if (undated.length) ordered.push({ label: 'Sin fecha', sortKey: 'zzzz', tasks: undated });
  return ordered;
}

function ProjectCard({ p, projectTasks, onOpenProject }) {
  return (
    <div className="project-card" onClick={() => onOpenProject(toProjectDetail(p, projectTasks))}>
      <div
        className="project-img"
        style={{ background: p.bg || 'linear-gradient(135deg,var(--cranberry),var(--ink-700))' }}
      >
        {p.imagen_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imagen_url}
            alt={p.titulo || ''}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div className="project-area-badge" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{p.area}</div>
      </div>
      <div className="project-body">
        <div className="project-title">{p.titulo}</div>
        <div className="project-desc">{p.descripcion || p.objetivo}</div>
        <div className="project-meta-row">
          <div className="leader-wrap">
            <div className="leader-avatar">{initials(p.lider)}</div>
            <div className="leader-name">{p.lider}</div>
          </div>
          <div className="project-meta-chips">
            {projectTasks.length > 0 && (
              <div className="tasks-chip">
                <IconListCheck size={11} aria-hidden="true" />
                {projectTasks.length} {projectTasks.length === 1 ? 'tarea' : 'tareas'}
              </div>
            )}
            {p.deadline && (
              <div className="deadline-chip">
                <IconCalendar size={10} aria-hidden="true" />
                {p.deadline}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="project-open-hint">
        <IconArrowRight size={12} aria-hidden="true" />
        Ver proyecto completo
      </div>
    </div>
  );
}

// A single task in the global timeline — always shows its project name.
function TimelineTask({ task }) {
  const [open, setOpen] = useState(false);
  const hasDesc = Boolean(task.descripcion);
  return (
    <div
      className={`event-card${task._estado.done ? ' task-done' : ''}`}
      style={{ cursor: hasDesc ? 'pointer' : 'default' }}
      onClick={hasDesc ? () => setOpen(o => !o) : undefined}
    >
      <div className={`event-bar ${task._estado.bar}`} />
      <div className="event-inner">
        <div className="event-top-row">
          <span className={`task-status-pill ${task._estado.cls}`}>{task._estado.label}</span>
          {task._day && (
            <div className="event-date-col">
              <div className="event-day-big">{task._day}</div>
              <div className="event-dow">{task._dow}</div>
            </div>
          )}
        </div>
        <div className="tl-project">
          <IconFolder size={10} aria-hidden="true" />
          {task._proyecto}
        </div>
        <div className="event-title">{task.titulo}</div>
        <div className="event-meta-row">
          {task.responsable && <span><IconUser size={12} aria-hidden="true" />{task.responsable}</span>}
          {task.fecha_limite && <span><IconCalendar size={12} aria-hidden="true" />{task.fecha_limite}</span>}
        </div>
        {hasDesc && (
          <div className="event-flyer-hint">
            <IconInfoCircle size={12} aria-hidden="true" />
            {open ? 'Ocultar detalles' : 'Ver detalles'}
          </div>
        )}
        {hasDesc && open && <div className="task-desc">{task.descripcion}</div>}
      </div>
    </div>
  );
}

export default function Proyectos({ proyectos, tareas = [], onOpenProject }) {
  const [subtab, setSubtab] = useState('proyectos');
  const timeline = useMemo(() => buildTimeline(proyectos, tareas), [proyectos, tareas]);

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <div className="subtabs">
        <div
          className={`subtab${subtab === 'proyectos' ? ' active' : ''}`}
          onClick={() => setSubtab('proyectos')}
        >
          Proyectos
        </div>
        <div
          className={`subtab${subtab === 'tareas' ? ' active' : ''}`}
          onClick={() => setSubtab('tareas')}
        >
          Tareas
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--ink-25)' }}>
        {subtab === 'proyectos' && (
          <div className="projects-wrap">
            {proyectos.map((p, i) => (
              <ProjectCard
                key={p.id || i}
                p={p}
                projectTasks={tasksFor(p, tareas)}
                onOpenProject={onOpenProject}
              />
            ))}
            {proyectos.length === 0 && (
              <p style={{ color: 'var(--ink-400)', fontSize: 13, marginTop: 8 }}>
                No hay proyectos activos.
              </p>
            )}
          </div>
        )}

        {subtab === 'tareas' && (
          <div className="agenda-view active">
            {timeline.length === 0 ? (
              <p style={{ padding: '20px 16px', color: 'var(--ink-400)', fontSize: 13 }}>
                No hay tareas registradas aún.
              </p>
            ) : (
              timeline.map((g, i) => (
                <div key={i} className="month-group">
                  <div className="month-header" style={{ cursor: 'default' }}>
                    <div className="month-name">{g.label}</div>
                  </div>
                  <div className="month-divider" />
                  <div className="month-events">
                    {g.tasks.map((t, j) => (
                      <TimelineTask key={j} task={t} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
