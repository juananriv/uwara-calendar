'use client';
import { IconCalendar, IconArrowRight } from '@tabler/icons-react';

function initials(name) {
  if (!name) return '??';
  return name.trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '??';
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
// Column names: deadline | imagen_url | proximos_pasos | como_ayudar | actualizado
function toProjectDetail(p) {
  const liderName = p.lider_nombre || '';
  return {
    ...p,
    title: p.titulo,
    bg: p.bg || 'linear-gradient(135deg,var(--cranberry),var(--ink-700))',
    updated: p.actualizado || '',
    objetivo: p.objetivo || '',
    contexto: p.contexto || '',
    leader: {
      initials: p.lider_iniciales || initials(liderName),
      name: liderName,
    },
    deadline: p.deadline || '',
    pasos: splitLines(p.proximos_pasos),
    ayuda: splitLines(p.como_ayudar),
    eventos: parseEventos(p.eventos_proyecto),
  };
}

export default function Proyectos({ proyectos, onOpenProject }) {
  return (
    <div className="content active">
      <div className="projects-wrap">
        <div className="section-label">Proyectos activos</div>

        {proyectos.map((p, i) => (
          <div
            key={p.id || i}
            className="project-card"
            onClick={() => onOpenProject(toProjectDetail(p))}
          >
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
              <div className="project-desc">{p.descripcion}</div>
              <div className="project-meta-row">
                <div className="leader-wrap">
                  <div className="leader-avatar">
                    {p.lider_iniciales || initials(p.lider_nombre)}
                  </div>
                  <div className="leader-name">{p.lider_nombre}</div>
                </div>
                <div className="deadline-chip">
                  <IconCalendar size={10} aria-hidden="true" />
                  {p.deadline}
                </div>
              </div>
            </div>
            <div className="project-open-hint">
              <IconArrowRight size={12} aria-hidden="true" />
              Ver proyecto completo
            </div>
          </div>
        ))}

        {proyectos.length === 0 && (
          <p style={{ color: 'var(--ink-400)', fontSize: 13, marginTop: 8 }}>
            No hay proyectos activos.
          </p>
        )}
      </div>
    </div>
  );
}
