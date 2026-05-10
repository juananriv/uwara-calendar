import AppShell from '@/components/AppShell';
import { getEventos, getProyectos, getAvisos, getActas } from '@/lib/sheets';

export default async function Home() {
  let eventos: object[] = [];
  let proyectos: object[] = [];
  let avisos: object[] = [];
  let actas: object[] = [];

  try {
    [eventos, proyectos, avisos, actas] = await Promise.all([
      getEventos(),
      getProyectos(),
      getAvisos(),
      getActas(),
    ]);
  } catch (err) {
    console.error('Error fetching from Google Sheets:', err);
  }

  return (
    <div className="phone">
      <AppShell
        eventos={eventos}
        proyectos={proyectos}
        avisos={avisos}
        actas={actas}
      />
    </div>
  );
}
