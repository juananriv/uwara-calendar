'use client';
import { useState } from 'react';
import { IconX, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

export default function Lightbox({ slides, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  if (!slides?.length) return null;

  const safeIdx = ((current % slides.length) + slides.length) % slides.length;
  const slide = slides[safeIdx];

  function nav(dir) {
    setCurrent(c => ((c + dir) % slides.length + slides.length) % slides.length);
  }

  return (
    <div className="lightbox">
      <div className="lb-close" onClick={onClose}>
        <IconX size={17} color="white" aria-hidden="true" />
      </div>
      <div
        className="lb-img"
        style={{ background: slide.bg || 'var(--cranberry)', overflow: 'hidden', position: 'relative' }}
      >
        {slide.imagen_url
          ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.imagen_url}
              alt={slide.titulo || ''}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )
          : 'FLYER'
        }
      </div>
      <div className="lb-title">{slide.titulo}</div>
      <div className="lb-date">{slide.fecha}</div>
      {slides.length > 1 && (
        <div className="lb-nav">
          <div className="lb-btn" onClick={() => nav(-1)}>
            <IconArrowLeft size={14} aria-hidden="true" />
            Anterior
          </div>
          <div className="lb-btn" onClick={() => nav(1)}>
            Siguiente
            <IconArrowRight size={14} aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
