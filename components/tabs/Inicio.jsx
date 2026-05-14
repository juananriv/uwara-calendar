'use client';
import Carousel from '@/components/Carousel';

export default function Inicio({ slides, reminders, socioCount, proyectoCount, onOpenLightbox, isLightboxOpen }) {
  return (
    <div className="content active">
      <div className="hero">
        <div className="hero-eyebrow">Rotaract Club</div>
        <div className="hero-title">
          Uwara <em>Kik&apos;</em>
        </div>
        <div className="hero-sub">
          Unidos por sangre — la sangre de la amistad y el deseo de servir.
        </div>
        <div className="stats-row">
          <div className="stat-pill">
            <div className="stat-val">{socioCount}</div>
            <div className="stat-lbl">Miembros</div>
          </div>
          <div className="stat-pill">
            <div className="stat-val">{proyectoCount}</div>
            <div className="stat-lbl">Proyectos</div>
          </div>
          <div className="stat-pill">
            <div className="stat-val">{new Date().getFullYear()}</div>
            <div className="stat-lbl">Año</div>
          </div>
        </div>
      </div>

      <div className="avisos-section">
        <div className="section-label">Avisos</div>

        <Carousel
          slides={slides}
          onOpenLightbox={onOpenLightbox}
          isLightboxOpen={isLightboxOpen}
        />

        {reminders.length > 0 && (
          <>
            <div className="section-label-sm">Recordatorios</div>
            {reminders.map((r, i) => (
              <div key={i} className="reminder-card">
                <div className="reminder-top">
                  <span className="reminder-badge">Recordatorio</span>
                  <span className="reminder-date">{r.fecha}</span>
                </div>
                <div className="reminder-title">{r.titulo}</div>
                <div className="reminder-text">{r.texto}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
