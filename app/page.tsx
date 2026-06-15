import AppShell from '@/components/AppShell';
import { getEventos, getProyectos, getAvisos, getActas, getNosotros, getSocios, getTareas } from '@/lib/sheets';

export default async function Home() {
  let eventos: object[] = [];
  let proyectos: object[] = [];
  let avisos: object[] = [];
  let actas: object[] = [];
  let nosotros: object[] = [];
  let socios: object[] = [];
  let tareas: object[] = [];

  try {
    [eventos, proyectos, avisos, actas, nosotros, socios, tareas] = await Promise.all([
      getEventos(),
      getProyectos(),
      getAvisos(),
      getActas(),
      getNosotros(),
      getSocios(),
      getTareas(),
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
        socios={socios}
        tareas={tareas}
      />
    </div>
  );
}
