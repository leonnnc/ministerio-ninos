'use client';

import { useEffect, useRef, useState } from 'react';

export interface MediaItem {
  tipo: 'imagen' | 'video';
  src: string;
  alt?: string;
}

interface CarruselFondoProps {
  items: MediaItem[];
  intervalo?: number; // ms entre slides (default 5000)
  children?: React.ReactNode;
}

export default function CarruselFondo({
  items,
  intervalo = 5000,
  children,
}: CarruselFondoProps) {
  const [actual, setActual] = useState(0);
  const [anterior, setAnterior] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = items.length;

  const irA = (idx: number) => {
    setAnterior(actual);
    setActual(idx);
  };

  const siguiente = () => irA((actual + 1) % total);
  const anterior_ = () => irA((actual - 1 + total) % total);

  // Auto-avance
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setTimeout(siguiente, intervalo);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual, intervalo, total]);

  // Reproducir video activo, pausar los demás
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === actual) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [actual]);

  if (total === 0) return <>{children}</>;

  return (
    <div className="relative w-full h-screen min-h-[500px] overflow-hidden">
      {/* Slides */}
      {items.map((item, i) => {
        const esActual = i === actual;
        const esAnterior = i === anterior;

        return (
          <div
            key={i}
            className={[
              'absolute inset-0 transition-opacity duration-1000',
              esActual ? 'opacity-100 z-10' : esAnterior ? 'opacity-0 z-0' : 'opacity-0 z-0',
            ].join(' ')}
            aria-hidden={!esActual}
          >
            {item.tipo === 'imagen' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={item.src}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay={i === 0}
              />
            )}
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-black/45" />
          </div>
        );
      })}

      {/* Contenido encima del carrusel */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        {children}
      </div>

      {/* Controles de navegación */}
      {total > 1 && (
        <>
          {/* Botón anterior */}
          <button
            onClick={anterior_}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            ‹
          </button>

          {/* Botón siguiente */}
          <button
            onClick={siguiente}
            aria-label="Slide siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            ›
          </button>

          {/* Indicadores (dots) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => irA(i)}
                aria-label={`Ir al slide ${i + 1}`}
                className={[
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                  i === actual ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80',
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
