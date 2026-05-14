'use client';
import { useState } from 'react';
import { IconFileDescription, IconPresentation, IconFileText, IconChevronRight, IconChevronDown, IconUser } from '@tabler/icons-react';

function ItemIcon({ tipo }) {
  const t = (tipo || '').toLowerCase();
  if (t.includes('presentac')) return <IconPresentation size={16} color="var(--ink-600)" aria-hidden="true" />;
  if (t.includes('pdf')) return <IconFileText size={16} color="var(--ink-600)" aria-hidden="true" />;
  return <IconFileDescription size={16} color="var(--ink-600)" aria-hidden="true" />;
}

function MemberRow({ member, first }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0',
      borderTop: first ? 'none' : '1px solid var(--ink-100)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: 'var(--ink-50)',
        border: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <IconUser size={15} color="var(--ink-500)" aria-hidden="true" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-1000)', letterSpacing: '-0.01em' }}>
          {member.nombre}
        </div>
        <div style={{ fontSize: 11, color: 'var(--cranberry)', fontWeight: 600, marginTop: 1 }}>
          {member.puesto}
        </div>
        {member.contacto && (
          <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 1 }}>
            {member.contacto}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, badge, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 4 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', padding: '10px 0 8px', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="section-label" style={{ margin: 0 }}>{title}</span>
          {badge !== undefined && (
            <span style={{ fontSize: 10, color: 'var(--ink-400)', fontWeight: 600, letterSpacing: 0 }}>
              ({badge})
            </span>
          )}
        </div>
        <IconChevronDown
          size={16}
          aria-hidden="true"
          color="var(--ink-400)"
          style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
        />
      </div>
      <div style={{ height: 1, background: 'var(--ink-100)', marginBottom: open ? 10 : 0 }} />
      {open && <div style={{ marginBottom: 8 }}>{children}</div>}
    </div>
  );
}

export default function Nosotros({ nosotros, socios, onOpenItem }) {
  const junta = socios.filter(s => (s.puesto || '').toLowerCase() !== 'socio');
  const sociosList = socios.filter(s => (s.puesto || '').toLowerCase() === 'socio');

  return (
    <div className="content active">
      <div className="nosotros-wrap">

        <Section title="Documentos" badge={nosotros.length}>
          {nosotros.length === 0 ? (
            <p style={{ color: 'var(--ink-400)', fontSize: 13, marginBottom: 8 }}>
              No hay documentos disponibles.
            </p>
          ) : nosotros.map((item, i) => {
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
                    <div className="doc-icon-wrap"><ItemIcon tipo={item.tipo} /></div>
                    <div style={{ flex: 1 }}>
                      <div className="doc-title">{item.titulo}</div>
                      {item.descripcion && <div className="doc-sub">{item.descripcion}</div>}
                    </div>
                    <IconChevronRight size={16} aria-hidden="true"
                      style={{ marginLeft: 'auto', color: 'var(--cranberry)', flexShrink: 0 }} />
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
        </Section>

        <Section title="Junta Directiva" badge={junta.length}>
          {junta.length === 0 ? (
            <p style={{ color: 'var(--ink-400)', fontSize: 13, marginBottom: 8 }}>
              No hay miembros registrados.
            </p>
          ) : (
            <div className="nosotros-card">
              {junta.map((m, i) => <MemberRow key={i} member={m} first={i === 0} />)}
            </div>
          )}
        </Section>

        <Section title="Socios" badge={sociosList.length}>
          {sociosList.length === 0 ? (
            <p style={{ color: 'var(--ink-400)', fontSize: 13, marginBottom: 8 }}>
              No hay socios registrados.
            </p>
          ) : (
            <div className="nosotros-card">
              {sociosList.map((m, i) => <MemberRow key={i} member={m} first={i === 0} />)}
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
