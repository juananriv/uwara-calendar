'use client';
import { IconFileText, IconChevronRight } from '@tabler/icons-react';

export default function Actas({ actas, onOpenActa }) {
  return (
    <div className="content active">
      <div className="actas-section">
        <div className="section-label">Actas de reunión</div>

        {actas.map((a, i) => {
          const hasPdf = Boolean(a.preview_url);
          return (
            <div
              key={a.id || i}
              className="acta-card"
              style={{ cursor: hasPdf ? 'pointer' : 'default' }}
              onClick={hasPdf ? () => onOpenActa(a) : undefined}
            >
              <div className="acta-icon">
                <IconFileText size={18} color="var(--cranberry)" aria-hidden="true" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="acta-title">{a.titulo}</div>
                <div className="acta-date">{a.fecha}</div>
                {hasPdf && (
                  <div style={{
                    marginTop: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--cranberry)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}>
                    <IconChevronRight size={11} aria-hidden="true" />
                    Ver acta
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {actas.length === 0 && (
          <p style={{ color: 'var(--ink-400)', fontSize: 13, marginTop: 8 }}>
            No hay actas disponibles.
          </p>
        )}
      </div>
    </div>
  );
}
