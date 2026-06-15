/**
 * Google Sheets API v4 data layer.
 *
 * Expected column headers per tab (row 1):
 *
 * Avisos:    titulo | fecha | bg | tipo | imagen_url
 *   - tipo       = "aviso" (carousel) or "recordatorio" (reminder card)
 *   - bg         = CSS gradient or color string, e.g. "linear-gradient(135deg,#d41367,#3d3445)"
 *   - imagen_url = Google Drive share link (auto-converted to direct URL)
 *
 * Eventos:   fecha | titulo | hora | lugar | tipo | subtab | flyer_url
 *   - tipo      = Sesión | Evento | Proyecto | Invitado
 *   - subtab    = miclub | rotary
 *   - flyer_url = Google Drive share link (auto-converted to direct URL)
 *
 * Proyectos: id | titulo | area | descripcion | objetivo | contexto | lider |
 *            deadline | imagen_url | proximos_pasos | como_ayudar | actualizado
 *   - id              = unique key (e.g. "p1") — required for Tareas to attach
 *   - descripcion     = short blurb shown on the project card
 *   - lider           = full name of the project lead; initials derived client-side
 *   - imagen_url      = Google Drive share link (auto-converted to direct URL)
 *   - proximos_pasos  = newline-separated steps
 *   - como_ayudar     = newline-separated help items
 *
 * Actas:     titulo | fecha | archivo | drive_url
 *   - archivo   = filename to display (e.g. "Acta Mayo 2025.pdf")
 *   - drive_url = Google Drive share link → auto-converted to /preview iframe URL
 *
 * Tareas:    proyecto_id | titulo | responsable | fecha_limite | estado | descripcion
 *   - proyecto_id  = matches the "id" of a row in Proyectos (e.g. "p1", "p4")
 *   - responsable  = name of the person responsible for the task
 *   - fecha_limite = due date (any format parseDate handles)
 *   - estado       = Pendiente | En progreso | Completada (blank → Pendiente)
 *   - descripcion  = optional details; when present, the task is clickable to expand
 */

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.SHEET_ID;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

const MESES = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

function parseDate(str) {
  if (!str) return null;
  // ISO: 2025-05-18
  const iso = new Date(`${str}T12:00:00`);
  if (!isNaN(iso.getTime())) return iso;
  // DD/MM/YYYY or DD/MM/YY
  const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmy) {
    const yr = dmy[3].length === 2 ? 2000 + parseInt(dmy[3], 10) : parseInt(dmy[3], 10);
    return new Date(yr, parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10), 12);
  }
  // Spanish: "18 de mayo de 2025" or "18 de mayo, 2025"
  const es = str.match(/(\d{1,2})\s+de\s+(\w+)(?:[,\s]+(\d{4}))?/i);
  if (es) {
    const month = MESES[es[2].toLowerCase()];
    const year = es[3] ? parseInt(es[3], 10) : new Date().getFullYear();
    if (month !== undefined) return new Date(year, month, parseInt(es[1], 10), 12);
  }
  return null;
}

function convertDriveUrl(url) {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (!match) return url;
  return `https://lh3.googleusercontent.com/d/${match[1]}`;
}

function convertDrivePreviewUrl(url) {
  if (!url) return '';
  const match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (!match) return '';
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

async function fetchTab(tabName) {
  const range = encodeURIComponent(`${tabName}!A:Z`);
  const url = `${BASE_URL}/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Google Sheets API error ${res.status} for tab "${tabName}"`);
  }
  const json = await res.json();
  const rows = json.values ?? [];
  if (rows.length < 2) return [];
  const [headers, ...body] = rows;
  return body
    .filter(row => row.some(cell => cell?.trim()))
    .map(row =>
      Object.fromEntries(headers.map((h, i) => [h.trim(), (row[i] ?? '').trim()]))
    );
}

export async function getEventos() {
  const rows = await fetchTab('Eventos');
  return rows.map(row => ({ ...row, flyer_url: convertDriveUrl(row.flyer_url) }));
}

export async function getProyectos() {
  const rows = await fetchTab('Proyectos');
  return rows.map(row => ({ ...row, imagen_url: convertDriveUrl(row.imagen_url) }));
}

export async function getAvisos() {
  const rows = await fetchTab('Avisos');
  return rows.map(row => ({ ...row, imagen_url: convertDriveUrl(row.imagen_url) }));
}

export async function getActas() {
  const rows = await fetchTab('Actas');
  return rows.map(row => ({ ...row, preview_url: convertDrivePreviewUrl(row.drive_url) }));
}

export async function getNosotros() {
  const rows = await fetchTab('Nosotros');
  return rows.map(row => ({ ...row, preview_url: convertDrivePreviewUrl(row.link) }));
}

export async function getSocios() {
  return fetchTab('Socios');
}

// Resilient on purpose: if the "Tareas" tab doesn't exist yet, the Sheets API
// returns a 400 and fetchTab throws. We swallow it and return [] so the rest of
// the app keeps working before the secretary creates the tab.
export async function getTareas() {
  try {
    return await fetchTab('Tareas');
  } catch {
    return [];
  }
}
