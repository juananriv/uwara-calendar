import AppShell from '@/components/AppShell';
import { getEventos, getProyectos, getAvisos, getActas, getNosotros } from '@/lib/sheets';

export default async function Home() {
  let eventos: object[] = [];
  let proyectos: object[] = [];
  let avisos: object[] = [];
  let actas: object[] = [];
  let nosotros: object[] = [];

  try {
    [eventos, proyectos, avisos, actas, nosotros] = await Promise.all([
      getEventos(),
      getProyectos(),
      getAvisos(),
      getActas(),
      getNosotros(),
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
        nosotros={nosotros}
      />
    </div>
  );
}
