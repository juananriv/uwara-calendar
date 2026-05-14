'use client';
import { IconX } from '@tabler/icons-react';

export default function NosotrosDetail({ item, onClose }) {
  return (
    <div className="detail-panel open">
      <div className="detail-header">
        <div className="detail-back" onClick={onClose}>
          <IconX size={16} color="var(--ink-600)" aria-hidden="true" />
        </div>
        <div className="detail-header-title">{item.titulo}</div>
      </div>
      <iframe
        src={item.preview_url}
        title={item.titulo}
        allow="fullscreen"
        style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
}
