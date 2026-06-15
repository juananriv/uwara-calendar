'use client';
import { useState, useMemo } from 'react';
import { IconFileText, IconChevronRight, IconChevronDown } from '@tabler/icons-react';

const MESES_LARGO = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MESES_ES = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

function parseFecha(str) {
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

// Group actas by month. Unlike the Agenda, NO date filtering happens here —
// every acta is kept, including past ones. Most recent month first; actas with
// an unparseable/missing date fall into a "Sin fecha" group at the bottom.
function groupByMonth(actas) {
  const groups = {};
  const undated = [];
  for (const a of actas) {
    const d = parseFecha(a.fecha);
    if (!d) {
      undated.push(a);
      continue;
    }
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!groups[key]) {
      groups[key] = { label: `${MESES_LARGO[d.getMonth()]} ${d.getFullYear()}`, sortKey: key, actas: [] };
    }
    groups[key].actas.push({ ...a, _d: d });
  }
  const ordered = Object.values(groups)
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey)) // most recent month first
    .map(g => ({ ...g, actas: g.actas.sort((a, b) => b._d - a._d) })); // newest first within month
  if (undated.length) {
    ordered.push({ label: 'Sin fecha', sortKey: '', actas: undated });
  }
  return ordered;
}

function ActaCard({ acta, onOpenActa }) {
  const hasPdf = Boolean(acta.preview_url);
  return (
    <div
      className="acta-card"
      style={{ cursor: hasPdf ? 'pointer' : 'default' }}
      onClick={hasPdf ? () => onOpenActa(acta) : undefined}
    >
      <div className="acta-icon">
        <IconFileText size={18} color="var(--cranberry)" aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <div className="acta-title">{acta.titulo}</div>
        <div className="acta-date">{acta.fecha}</div>
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
}

function MonthGroup({ label, actas, onOpenActa }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="month-group">
      <div className="month-header" onClick={() => setOpen(o => !o)}>
        <div className="month-name">{label}</div>
        <IconChevronDown
          size={18}
          aria-hidden="true"
          style={{
            color: 'var(--ink-400)',
            transition: 'transform 200ms',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      <div className="month-divider" />
      <div className={`month-events${open ? '' : ' collapsed'}`}>
        {actas.map((a, i) => (
          <ActaCard key={a.id || i} acta={a} onOpenActa={onOpenActa} />
        ))}
      </div>
    </div>
  );
}

export default function Actas({ actas, onOpenActa }) {
  const groups = useMemo(() => groupByMonth(actas), [actas]);

  return (
    <div className="content active">
      <div style={{ padding: '14px 16px 0' }}>
        <div className="section-label">Actas de reunión</div>
      </div>

      {groups.map((g) => (
        <MonthGroup key={g.sortKey || g.label} label={g.label} actas={g.actas} onOpenActa={onOpenActa} />
      ))}

      {actas.length === 0 && (
        <p style={{ padding: '0 16px', color: 'var(--ink-400)', fontSize: 13 }}>
          No hay actas disponibles.
        </p>
      )}
    </div>
  );
}
