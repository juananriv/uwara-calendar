# App Architecture Context

This document captures the decisions, fixes, and non-obvious patterns used in this project so they can be replicated in similar apps.

---

## Stack

- **Next.js App Router** (v16+) with React 19
- **Tailwind v4** — import syntax is `@import "tailwindcss"`, not the v3 plugin setup
- **`@tabler/icons-react`** — all icons come from this package, not a CDN
- **`next/font/google`** for Outfit font, exposed as CSS variable `--font-outfit`
- **Google Sheets API v4** as the CMS/data source
- **No database** — all content is managed from a Google Sheet

---

## Server / Client Component Split

The page is split into two layers to allow server-side data fetching while keeping interactivity:

- **`app/page.tsx`** — async Server Component. Fetches all data in parallel, passes it as props. No `'use client'`.
- **`components/AppShell.jsx`** — `'use client'`. Owns all UI state (active tab, open panels, lightbox index). Receives data as props only.

All tab components, detail panels, and overlays are children of AppShell. This is the only correct way to mix server-fetched data with client state in App Router.

```tsx
// page.tsx — server component
export default async function Home() {
  let eventos = [], proyectos = [], avisos = [], actas = [];
  try {
    [eventos, proyectos, avisos, actas] = await Promise.all([
      getEventos(), getProyectos(), getAvisos(), getActas()
    ]);
  } catch (err) {
    console.error('Error fetching from Google Sheets:', err);
  }
  return <div className="phone"><AppShell ... /></div>;
}
```

The `try/catch` around `Promise.all` is intentional — if Sheets is unreachable (e.g. missing API key in dev), the app renders with empty arrays instead of crashing.

---

## Google Sheets Integration (`lib/sheets.js`)

### Setup

- Credentials come from `process.env.GOOGLE_SHEETS_API_KEY` and `process.env.SHEET_ID`
- Each tab is fetched as `TabName!A:Z`
- Row 1 of each tab is the header row — cells become object keys
- Empty rows are filtered out

```js
async function fetchTab(tabName) {
  const range = encodeURIComponent(`${tabName}!A:Z`);
  const url = `${BASE_URL}/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json();
  const [headers, ...body] = json.values ?? [];
  return body
    .filter(row => row.some(cell => cell?.trim()))
    .map(row => Object.fromEntries(headers.map((h, i) => [h.trim(), (row[i] ?? '').trim()])));
}
```

### Column schemas

```
Avisos:    id | titulo | fecha | tipo | imagen_url | texto
Eventos:   id | titulo | fecha | tipo | hora | lugar | descripcion | flyer_url | proyecto_id
Proyectos: id | titulo | area | descripcion | objetivo | contexto | lider |
           deadline | imagen_url | proximos_pasos | como_ayudar | actualizado
Actas:     titulo | fecha | archivo | drive_url
Tareas:    proyecto_id | titulo | responsable | fecha_limite | estado | descripcion
```

> Columns are keyed by the header text in row 1, so column **order** does not
> matter — only the header names. Adding a column (e.g. `descripcion`) is safe:
> it simply becomes available as `row.descripcion`.

---

## Google Drive Image URLs — Critical Fix

### The problem

Google Drive share links (`/uc?export=view&id=...`) work when opened directly in a browser but **fail silently as `<img src>`** due to CORS restrictions. The image simply does not load.

### The fix

Convert the share link to the Google thumbnail CDN URL:

```js
function convertDriveUrl(url) {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (!match) return url;
  return `https://lh3.googleusercontent.com/d/${match[1]}`;
}
```

This format (`lh3.googleusercontent.com/d/FILE_ID`) works as an `<img src>` with no CORS issues, as long as the file is publicly shared in Drive.

Apply this to every image field on fetch:
```js
rows.map(row => ({ ...row, imagen_url: convertDriveUrl(row.imagen_url) }))
```

### PDF previews (Actas)

For PDFs, use the `/preview` embed URL instead — this gives a full Google Drive viewer with pagination inside an iframe:

```js
function convertDrivePreviewUrl(url) {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (!match) return '';
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}
```

Render in an iframe with `flex: 1` so it fills the panel height:

```jsx
<iframe
  src={acta.preview_url}
  title={acta.titulo}
  allow="fullscreen"
  style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
/>
```

---

## Date Parsing

Dates in Sheets come in multiple formats depending on how they were typed. The parser handles all three:

```js
function parseDate(str) {
  // ISO: 2025-05-18 — append T12:00:00 to avoid UTC midnight drift
  const iso = new Date(`${str}T12:00:00`);
  if (!isNaN(iso.getTime())) return iso;

  // DD/MM/YYYY
  const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return new Date(parseInt(dmy[3]), parseInt(dmy[2]) - 1, parseInt(dmy[1]), 12);

  // Spanish: "18 de mayo de 2025"
  const es = str.match(/(\d{1,2})\s+de\s+(\w+)(?:[,\s]+(\d{4}))?/i);
  if (es) { ... }
}
```

**Important:** always use `T12:00:00` (noon) when constructing a Date from a date-only string. Using midnight (`T00:00:00`) causes off-by-one errors in timezones behind UTC.

---

## Agenda — Tipo Filtering and Color Logic

The Agenda has two subtabs with different filtering rules:

- **Mi Club**: shows events where `tipo` is `sesion`, `evento`, or `proyecto`. Excludes `invitado`.
- **Rotaract Guatemala**: shows **all** events with no tipo filter whatsoever.

The `fecha >= today` filter is applied upstream in `getEventos()` — the component receives only future events.

### Accent-safe tipo comparison

Sheet values may have accents (`Sesión`) or not (`Sesion`). Normalize before comparing:

```js
function normTipo(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
const MICLUB_TIPOS = new Set(['sesion', 'evento', 'proyecto']);
```

### Bar color logic

```js
if (isRotary) {
  barClass = nt === 'invitado' ? 'bar-guest' : 'bar-club-rotary'; // cranberry
} else {
  if (nt === 'sesion') barClass = 'bar-sesion-club';     // blue
  else if (nt === 'invitado') barClass = 'bar-guest';    // gray
  else barClass = 'bar-evento';                          // cranberry
}
```

---

## Slide-in Detail Panels

All detail views (project, event, acta) use the same pattern:

```css
.detail-panel {
  position: absolute;
  inset: 0;
  transform: translateX(100%);
  transition: transform 300ms ease;
}
.detail-panel.open {
  transform: translateX(0);
}
```

The parent `.screen` div must have `position: relative` so `inset: 0` works correctly. All panels are rendered as children of `.screen` (inside AppShell), not as portals.

Panels are conditionally rendered with state:
```jsx
{openProject && <ProjectDetail project={openProject} onClose={() => setOpenProject(null)} />}
```

---

## Carousel and Lightbox — Shared Slide Array

Both the Carousel and the Lightbox need to reference the same slides array with the same indices (so clicking slide 2 opens slide 2 in the lightbox). This is computed once in AppShell using `useMemo` and passed as props to both:

```js
const carouselSlides = useMemo(
  () => avisos.filter(a => a.tipo?.toLowerCase() !== 'recordatorio'),
  [avisos]
);
```

Do not filter inside Carousel or Lightbox separately — indices will drift.

---

## Multiline Sheet Fields

Google Sheets exports line breaks (Enter key) as `\n` in the API response. Split on `\n`, not `;`:

```js
const splitLines = str => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];
```

Use this for `proximos_pasos` and `como_ayudar` in Proyectos.

For fields with a different separator (e.g. `eventos_proyecto` uses `|` within `;`-separated entries), parse accordingly.

---

## Leader Initials

The sheet stores the project lead as a single `lider` column (full name, e.g. `"Jaime"`).
Initials are always derived client-side — the first letter of each name, max two:

```js
function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}
// "Jaime" → "J"   ·   "Juan An" → "JA"
```

> Historical note: earlier the schema used `lider_nombre` + an optional
> `lider_iniciales` override. Those columns were collapsed into a single `lider`.
> Reading the old names is what caused the avatar to show `??`.

---

## Project Tasks (Tareas) — Monday-style tracking

Each project has a task list, fed from a dedicated **`Tareas`** tab so the club
secretary can manage tasks without touching code.

### Linking

Tasks attach to a project by **id**: `tarea.proyecto_id === proyecto.id`.
Projects with an empty `id` cannot have tasks — every trackable project needs a
unique id in the Proyectos tab. Tasks whose `proyecto_id` is blank or doesn't
match an existing project are **not shown** in the timeline (no orphan tasks).

```js
function tasksFor(project, tareas) {
  if (!project.id) return [];
  return tareas.filter(t => t.proyecto_id === project.id);
}
```

### Resilient fetch

`getTareas()` swallows errors and returns `[]`. This is deliberate: if the
`Tareas` tab doesn't exist yet, `fetchTab` throws a 400, and without the
try/catch the whole `Promise.all` in `page.tsx` would fall back to empty arrays —
breaking every tab, not just tasks.

```js
export async function getTareas() {
  try { return await fetchTab('Tareas'); }
  catch { return []; }
}
```

### Shared helpers — `lib/tasks.js`

Task logic lives in `lib/tasks.js` so the project detail and the global timeline
stay in sync: `estadoInfo` (status → label/pill/bar class), `parseFecha` (the
noon-anchored date parser), `byFechaLimite` (the sort comparator), and the
`MESES_LARGO` / `DIAS` label arrays.

### Sorting

Tasks are **always sorted by due date ascending** (`byFechaLimite`); undated
tasks sort last. This holds in both the project detail and the timeline.

### Status normalization

`estado` is matched accent/case-insensitively and mapped to a label, a status-pill
class, and a left-bar class. Blank/unknown defaults to Pendiente.

| estado (sheet)                         | label        | color |
|----------------------------------------|--------------|-------|
| en progreso / en curso / ongoing       | En progreso  | blue  |
| (blank) / pendiente                    | Pendiente    | gray  |
| completada / completado / hecho / done | Completada   | green |

Completed tasks (`estadoInfo().done`) get the `task-done` class — dimmed and with
a struck-through title — in both the detail rows and the timeline cards.

### UI

The **Proyectos** tab has two subtabs (same pattern as the Agenda):

- **Proyectos** — the project cards. Each card's `tasks-chip` shows its task count
  (`N tareas`), hidden when zero.
- **Tareas** — a global timeline of **every** task across all projects, grouped by
  due-date month (soonest first, so overdue months bubble to the top — what a
  reminder needs). Each row always shows its **project name** (`tl-project`
  eyebrow), the `responsable`, the due date, a status pill, and a status-colored
  left bar reusing the Agenda's `event-card` styling.

In the **project detail**, the *Tareas* section is the **last** section of the
panel. When a task has a `descripcion`, an info icon appears and the row becomes
clickable to expand/collapse the details inline. The timeline rows behave the same
(via a "Ver detalles" hint).

---

## Multiple GitHub Accounts

If the machine has multiple GitHub accounts configured in `gh`:

```bash
gh auth status          # see all accounts and which is active
gh auth switch          # switch the active account
git config user.name "username"
git config user.email "email@example.com"
```

Set the local (not global) git config per repo so different projects can use different identities without affecting each other.

---

## Environment Variables

Store in `.env.local` (never committed):

```
GOOGLE_SHEETS_API_KEY=your_key
SHEET_ID=your_sheet_id
```

The sheet must be published or shared so the API key can read it. For a fully public sheet, any valid API key with Sheets API enabled works.
