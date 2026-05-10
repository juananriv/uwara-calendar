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
 * Proyectos: id | titulo | area | descripcion | lider_nombre | lider_iniciales |
 *            deadline | bg | actualizado | objetivo | contexto | proximos_pasos | como_ayudar | eventos_proyecto | imagen_url
 *   - imagen_url      = Google Drive share link (auto-converted to direct URL)
 *   - proximos_pasos  = semicolon-separated steps
 *   - como_ayudar     = semicolon-separated help items
 *   - eventos_proyecto = semicolon-separated events, each formatted as "day|month|title|meta"
 *
 * Actas:     titulo | fecha | archivo | drive_url
 *   - archivo   = filename to display (e.g. "Acta Mayo 2025.pdf")
 *   - drive_url = Google Drive share link → auto-converted to /preview iframe URL
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
  // DD/MM/YYYY
  const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10), 12);
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return rows
    .filter(row => {
      const d = parseDate(row.fecha);
      return d !== null ? d >= today : true;
    })
    .map(row => ({ ...row, flyer_url: convertDriveUrl(row.flyer_url) }));
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
