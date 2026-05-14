'use client';
import { IconFileDescription, IconPresentation, IconFileText, IconChevronRight } from '@tabler/icons-react';

function ItemIcon({ tipo }) {
  const t = (tipo || '').toLowerCase();
  if (t.includes('presentac')) return <IconPresentation size={16} color="var(--ink-600)" aria-hidden="true" />;
  if (t.includes('pdf')) return <IconFileText size={16} color="var(--ink-600)" aria-hidden="true" />;
  return <IconFileDescription size={16} color="var(--ink-600)" aria-hidden="true" />;
}

export default function Nosotros({ nosotros, onOpenItem }) {
  return (
    <div className="content active">
      <div className="nosotros-wrap">
        {nosotros.map((item, i) => {
          const hasLink = Boolean(item.preview_url);
          return (
            <div
              key={i}
              className="nosotros-card"
              style={{ cursor: hasLink ? 'pointer' : 'default' }}
              onClick={hasLink ? () => onOpenItem(item) : undefined}
            >
              {hasLink ? (
                <div className="doc-link" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <div className="doc-icon-wrap">
                    <ItemIcon tipo={item.tipo} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="doc-title">{item.titulo}</div>
                    {item.descripcion && <div className="doc-sub">{item.descripcion}</div>}
                  </div>
                  <IconChevronRight
                    size={16}
                    aria-hidden="true"
                    style={{ marginLeft: 'auto', color: 'var(--cranberry)', flexShrink: 0 }}
                  />
                </div>
              ) : (
                <>
                  <div className="nosotros-heading">{item.titulo}</div>
                  {item.descripcion && <div className="nosotros-text">{item.descripcion}</div>}
                </>
              )}
            </div>
          );
        })}

        {nosotros.length === 0 && (
          <p style={{ color: 'var(--ink-400)', fontSize: 13, marginTop: 8 }}>
            No hay información disponible.
          </p>
        )}
      </div>
    </div>
  );
}
