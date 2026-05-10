'use client';
import { IconX, IconCalendarEvent, IconClock, IconMapPin } from '@tabler/icons-react';

const PILL_CLASS = {
  'Sesión': 'pill-sesion', 'Sesion': 'pill-sesion', 'sesion': 'pill-sesion', 'sesión': 'pill-sesion',
  'Evento': 'pill-evento', 'evento': 'pill-evento',
  'Proyecto': 'pill-proyecto', 'proyecto': 'pill-proyecto',
  'Invitado': 'pill-invitado', 'invitado': 'pill-invitado',
};

export default function EventDetail({ event, onClose }) {
  const tipo = event.tipo || '';

  return (
    <div className="detail-panel open">
      <div className="detail-header">
        <div className="detail-back" onClick={onClose}>
          <IconX size={16} color="var(--ink-600)" aria-hidden="true" />
        </div>
        <span className={`event-type-pill ${PILL_CLASS[tipo] || 'pill-sesion'}`}>
          {tipo}
        </span>
      </div>

      <div className="detail-body">
        <div className="detail-content">
          <div className="event-detail-meta">
            {event.fecha && (
              <div className="event-detail-meta-row">
                <IconCalendarEvent size={16} color="var(--ink-400)" aria-hidden="true" />
                {event.fecha}
              </div>
            )}
            {event.hora && (
              <div className="event-detail-meta-row">
                <IconClock size={16} color="var(--ink-400)" aria-hidden="true" />
                {event.hora}
              </div>
            )}
            {event.lugar && (
              <div className="event-detail-meta-row">
                <IconMapPin size={16} color="var(--ink-400)" aria-hidden="true" />
                {event.lugar}
              </div>
            )}
          </div>

          <div className="detail-title" style={{ marginBottom: 14 }}>
            {event.titulo}
          </div>

          <div className="event-detail-desc">{event.descripcion}</div>

          {event.flyer_url && (
            <div className="event-flyer-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.flyer_url} alt={`Flyer: ${event.titulo}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
