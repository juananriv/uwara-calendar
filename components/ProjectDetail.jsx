'use client';
import { IconX, IconHeart } from '@tabler/icons-react';

export default function ProjectDetail({ project, onClose }) {
  return (
    <div className="detail-panel open">
      <div className="detail-header">
        <div className="detail-back" onClick={onClose}>
          <IconX size={16} color="var(--ink-600)" aria-hidden="true" />
        </div>
        <div className="detail-header-title">{project.title}</div>
      </div>
      <div className="detail-body">
        <div className="detail-img" style={{ background: project.bg }}>
          {project.imagen_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imagen_url}
              alt={project.title || ''}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <div className="detail-area-badge">{project.area}</div>
          <div className="detail-updated">{project.updated}</div>
        </div>
        <div className="detail-content">
          <div className="detail-title">{project.title}</div>
          <div className="detail-leader-row">
            <div className="detail-leader-av">{project.leader.initials}</div>
            <div className="detail-leader-name">{project.leader.name}</div>
            <div className="detail-deadline">{project.deadline}</div>
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Objetivo</div>
            <div className="detail-text">{project.objetivo}</div>
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Contexto</div>
            <div className="detail-text">{project.contexto}</div>
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Eventos del proyecto</div>
            {project.eventos.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ink-500)', fontStyle: 'italic', margin: 0 }}>No hay eventos registrados aún</p>
            ) : (
              <div className="detail-events-list">
                {project.eventos.map((e, i) => (
                  <div key={i} className="detail-event-row">
                    <div>
                      <div className="detail-event-date">{e.day}</div>
                      <div className="detail-event-month">{e.month}</div>
                    </div>
                    <div className="detail-event-info">
                      <div className="detail-event-title">{e.title}</div>
                      <div className="detail-event-meta">{e.meta}</div>
                    </div>
                    <span className="detail-event-pill">Proyecto</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Próximos pasos</div>
            {project.pasos.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ink-500)', fontStyle: 'italic', margin: 0 }}>No hay próximos pasos definidos</p>
            ) : (
              <div className="steps-list">
                {project.pasos.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className="step-num">{i + 1}</div>
                    <div className="step-text">{s}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Cómo ayudar</div>
            {project.ayuda.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ink-500)', fontStyle: 'italic', margin: 0 }}>No hay oportunidades de ayuda definidas aún</p>
            ) : (
              <div className="help-list">
                {project.ayuda.map((a, i) => (
                  <div key={i} className="help-row">
                    <IconHeart size={14} className="help-icon" aria-hidden="true" />
                    <div className="help-text">{a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
