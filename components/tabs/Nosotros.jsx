import { IconFileDescription, IconPresentation, IconExternalLink } from '@tabler/icons-react';

export default function Nosotros() {
  return (
    <div className="content active">
      <div className="nosotros-wrap">
        <div className="nosotros-card">
          <div className="nosotros-heading">Quiénes somos</div>
          <div className="nosotros-text">
            Somos Rotaract Uwara Kik&apos; — &quot;unidos por sangre&quot;, la sangre de la amistad
            y el deseo de servir. Jóvenes de 18 a 30 años comprometidos con Guatemala.
          </div>
        </div>
        <div className="nosotros-card">
          <div className="nosotros-heading">Guías y recursos</div>
          <div className="doc-link">
            <div className="doc-icon-wrap">
              <IconFileDescription size={16} color="var(--ink-600)" aria-hidden="true" />
            </div>
            <div>
              <div className="doc-title">Cómo crear un proyecto</div>
              <div className="doc-sub">Guía oficial Rotaract</div>
            </div>
            <IconExternalLink
              size={16}
              aria-hidden="true"
              style={{ marginLeft: 'auto', color: 'var(--ink-400)' }}
            />
          </div>
          <div className="doc-link">
            <div className="doc-icon-wrap">
              <IconPresentation size={16} color="var(--ink-600)" aria-hidden="true" />
            </div>
            <div>
              <div className="doc-title">Presentación del club</div>
              <div className="doc-sub">Introducción para nuevos miembros</div>
            </div>
            <IconExternalLink
              size={16}
              aria-hidden="true"
              style={{ marginLeft: 'auto', color: 'var(--ink-400)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
