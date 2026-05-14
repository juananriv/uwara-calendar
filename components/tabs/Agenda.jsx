'use client';
import { useState, useMemo } from 'react';
import {
  IconClock,
  IconMapPin,
  IconPhoto,
  IconChevronDown,
  IconInfoCircle,
} from '@tabler/icons-react';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_LARGO = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MESES_ES = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

// Normalize tipo for comparison: "Sesión" → "sesion"
function normTipo(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const MICLUB_TIPOS = new Set(['sesion', 'evento', 'proyecto']);

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

function groupByMonth(events) {
  const groups = {};
  for (const ev of events) {
    const d = parseFecha(ev.fecha);
    if (!d) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!groups[key]) {
      groups[key] = { month: MESES_LARGO[d.getMonth()], year: String(d.getFullYear()), sortKey: key, events: [] };
    }
    groups[key].events.push({ ...ev, _d: d, _day: String(d.getDate()), _dow: DIAS[d.getDay()] });
  }
  return Object.values(groups)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(g => ({ ...g, events: g.events.sort((a, b) => a._d - b._d) }));
}

// Pill CSS class by tipo
const PILL_CLASS = {
  'Sesión': 'pill-sesion', 'Sesion': 'pill-sesion', 'sesion': 'pill-sesion', 'sesión': 'pill-sesion',
  'Evento': 'pill-evento', 'evento': 'pill-evento',
  'Proyecto': 'pill-proyecto', 'proyecto': 'pill-proyecto',
  'Invitado': 'pill-invitado', 'invitado': 'pill-invitado',
};

function EventCard({ event, isRotary, onOpen }) {
  const tipo = event.tipo || '';
  const nt = normTipo(tipo);
  const hasDesc = Boolean(event.descripcion);
  const hasFlyer = Boolean(event.flyer_url);

  // Bar color:
  // Mi Club view: sesion=blue, evento/proyecto=cranberry, invitado=gray
  // Rotary view:  sesion/evento/proyecto=cranberry, invitado=gray
  let barClass;
  if (isRotary) {
    barClass = nt === 'invitado' ? 'bar-guest' : 'bar-club-rotary';
  } else {
    if (nt === 'sesion') barClass = 'bar-sesion-club';
    else if (nt === 'invitado') barClass = 'bar-guest';
    else barClass = 'bar-evento';
  }

  return (
    <div
      className="event-card"
      style={{ cursor: hasDesc ? 'pointer' : 'default' }}
      onClick={hasDesc ? () => onOpen(event) : undefined}
    >
      <div className={`event-bar ${barClass}`} />
      <div className="event-inner">
        <div className="event-top-row">
          <span className={`event-type-pill ${PILL_CLASS[tipo] || 'pill-sesion'}`}>
            {tipo || 'Evento'}
          </span>
          <div className="event-date-col">
            <div className="event-day-big">{event._day}</div>
            <div className="event-dow">{event._dow}</div>
          </div>
        </div>

        <div className="event-title">{event.titulo}</div>

        <div className="event-meta-row">
          {event.hora && <span><IconClock size={12} aria-hidden="true" />{event.hora}</span>}
          {event.lugar && <span><IconMapPin size={12} aria-hidden="true" />{event.lugar}</span>}
        </div>

        {hasDesc && (
          <div className="event-flyer-hint">
            <IconInfoCircle size={12} aria-hidden="true" />
            Ver detalles
          </div>
        )}
        {hasFlyer && (
          <div className="event-flyer-hint">
            <IconPhoto size={12} aria-hidden="true" />
            Ver flyer
          </div>
        )}
      </div>
    </div>
  );
}

function MonthGroup({ month, year, events, isRotary, onOpen }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="month-group">
      <div className="month-header" onClick={() => setOpen(o => !o)}>
        <div className="month-name">{month} <span>{year}</span></div>
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
        {events.map((e, i) => (
          <EventCard key={i} event={e} isRotary={isRotary} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

const Empty = () => (
  <p style={{ padding: '20px 16px', color: 'var(--ink-400)', fontSize: 13 }}>
    No hay eventos próximos.
  </p>
);

function todayDateStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isUpcoming(e) {
  const d = parseFecha(e.fecha);
  if (!d) return true;
  return toDateStr(d) >= todayDateStr();
}

export default function Agenda({ eventos, onOpenEvent }) {
  const [subtab, setSubtab] = useState('miclub');

  // Only show today and future events — filtered client-side using the browser's local date
  const upcoming = useMemo(() => eventos.filter(isUpcoming), [eventos]);

  // Mi Club: only sesion / evento / proyecto (exclude invitado)
  const miClubGroups = useMemo(
    () => groupByMonth(
      upcoming.filter(e => {
        const isMyClub = !e.subtab || e.subtab.toLowerCase() === 'miclub';
        return isMyClub && MICLUB_TIPOS.has(normTipo(e.tipo));
      })
    ),
    [upcoming]
  );

  // Rotaract Guatemala: all eventos, no tipo or subtab filter
  const rotaryGroups = useMemo(
    () => groupByMonth(upcoming),
    [upcoming]
  );

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <div className="subtabs">
        <div
          className={`subtab${subtab === 'miclub' ? ' active' : ''}`}
          onClick={() => setSubtab('miclub')}
        >
          Mi Club
        </div>
        <div
          className={`subtab${subtab === 'rotary' ? ' active' : ''}`}
          onClick={() => setSubtab('rotary')}
        >
          Rotaract Guatemala
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--ink-25)' }}>
        {subtab === 'miclub' && (
          <div className="agenda-view active">
            {miClubGroups.length > 0
              ? miClubGroups.map((mg, i) => (
                  <MonthGroup
                    key={i}
                    month={mg.month}
                    year={mg.year}
                    events={mg.events}
                    isRotary={false}
                    onOpen={onOpenEvent}
                  />
                ))
              : <Empty />}
          </div>
        )}
        {subtab === 'rotary' && (
          <div className="agenda-view active">
            <div className="legend-row">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--cranberry)' }} />
                Uwara Kik&apos;
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--ink-500)' }} />
                Otros clubes
              </div>
            </div>
            {rotaryGroups.length > 0
              ? rotaryGroups.map((mg, i) => (
                  <MonthGroup
                    key={i}
                    month={mg.month}
                    year={mg.year}
                    events={mg.events}
                    isRotary={true}
                    onOpen={onOpenEvent}
                  />
                ))
              : <Empty />}
          </div>
        )}
      </div>
    </div>
  );
}
