'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Carousel({ slides, onOpenLightbox, isLightboxOpen }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startAuto = useCallback(() => {
    if (!slides?.length) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent(c => (c + 1) % slides.length),
      3500
    );
  }, [slides?.length]);

  useEffect(() => {
    if (!isLightboxOpen) {
      startAuto();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLightboxOpen, startAuto]);

  if (!slides?.length) return null;

  const safeIdx = current % slides.length;
  const slide = slides[safeIdx];

  return (
    <div className="carousel-wrap">
      <div
        className="carousel-img-track-wrap"
        onClick={() => onOpenLightbox(safeIdx)}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${safeIdx * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="carousel-slide"
              style={{ background: s.bg || 'var(--cranberry)' }}
            >
              {s.imagen_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imagen_url}
                  alt={s.titulo || ''}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="slide-tap-hint">Toca para ampliar</div>
      </div>
      <div className="carousel-below">
        <div className="carousel-info">
          <div className="carousel-text">
            <div className="c-title">{slide.titulo}</div>
            <div className="c-date">{slide.fecha}</div>
          </div>
          <div className="carousel-dots">
            {slides.map((_, i) => (
              <div key={i} className={`dot${i === safeIdx ? ' active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
