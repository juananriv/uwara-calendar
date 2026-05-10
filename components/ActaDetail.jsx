'use client';
import { IconX } from '@tabler/icons-react';

export default function ActaDetail({ acta, onClose }) {
  return (
    <div className="detail-panel open">
      <div className="detail-header">
        <div className="detail-back" onClick={onClose}>
          <IconX size={16} color="var(--ink-600)" aria-hidden="true" />
        </div>
        <div className="detail-header-title">{acta.titulo}</div>
      </div>

      {/* iframe fills every pixel below the header — Google Drive renders
          its own page controls and scroll, so no wrapper overflow needed */}
      <iframe
        src={acta.preview_url}
        title={acta.titulo}
        allow="fullscreen"
        style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
}
