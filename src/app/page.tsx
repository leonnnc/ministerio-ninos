'use client';

import Link from "next/link";
import CarruselFondo, { type MediaItem } from "@/components/ui/CarruselFondo";

const MEDIA_CARRUSEL: MediaItem[] = [
  { tipo: 'imagen', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80', alt: 'Niños en el ministerio' },
  { tipo: 'imagen', src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80', alt: 'Niños aprendiendo' },
  { tipo: 'imagen', src: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&q=80', alt: 'Comunidad infantil' },
];

// Reemplaza con tus fotos reales en /public/media/reunion/
const FOTOS_REUNION = [
  { src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', alt: 'Reunión 1' },
  { src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80', alt: 'Reunión 2' },
  { src: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&q=80', alt: 'Reunión 3' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', alt: 'Reunión 4' },
  { src: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80', alt: 'Reunión 5' },
  { src: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=600&q=80', alt: 'Reunión 6' },
];

// Reemplaza con tus videos reales de YouTube embed
const VIDEOS = [
  { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', titulo: 'Alabanza dominical' },
  { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', titulo: 'Mensaje para los niños' },
  { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', titulo: 'Actividades especiales' },
  { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', titulo: 'Testimonio de familias' },
];

const grupos = [
  { nombre: 'Cuna',         rango: '0 – 2 años',   emoji: '🍼', bg: 'bg-yellow-100',  border: 'border-yellow-300', text: 'text-yellow-800' },
  { nombre: 'Preescolar',   rango: '3 – 5 años',   emoji: '🎨', bg: 'bg-amber-100',   border: 'border-amber-300',  text: 'text-amber-800'  },
  { nombre: 'Primaria Baja',rango: '6 – 10 años',  emoji: '📚', bg: 'bg-yellow-200',  border: 'border-yellow-400', text: 'text-yellow-900' },
  { nombre: 'Primaria Alta',rango: '11 – 13 años', emoji: '🌟', bg: 'bg-amber-200',   border: 'border-amber-400',  text: 'text-amber-900'  },
];

export default function Home() {
  return (
    <>
      {/* ── 1. HERO carrusel ── */}
      <CarruselFondo items={MEDIA_CARRUSEL} intervalo={6000}>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          ✝️ Ministerio de Niños
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow">
          Formando el corazón de los niños con amor, fe y propósito.
        </p>
        <Link
          href="/inscripcion"
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-colors text-lg"
        >
          Inscribir a mi hijo
        </Link>
      </CarruselFondo>

      {/* ── 2. FOTOS última reunión — scroll automático infinito ── */}
      <section className="py-16 overflow-hidden" style={{ background: '#FFFDE7' }} id="reunion">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <h2 className="text-3xl font-bold text-center mb-1" style={{ color: '#F57F17' }}>
            Última Reunión Dominical
          </h2>
          <p className="text-center" style={{ color: '#F9A825' }}>Momentos especiales de nuestra familia</p>
        </div>
        <div className="relative">
          {/* Degradé izquierdo */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #FFFDE7, transparent)' }} />
          {/* Degradé derecho */}
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #FFFDE7, transparent)' }} />

          {/* Pista de scroll infinito — duplicamos las fotos para el loop */}
          <div className="flex gap-4 pb-2" style={{ animation: 'scrollInfinito 28s linear infinite', width: 'max-content' }}>
            {[...FOTOS_REUNION, ...FOTOS_REUNION].map((foto, i) => (
              <div key={i} className="flex-none w-72 h-52 sm:w-80 sm:h-60 rounded-2xl overflow-hidden shadow-md border-2 border-yellow-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.src} alt={foto.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HISTORIA / VISIÓN / MISIÓN — degradé amarillo intenso ── */}
      <section id="historia" className="relative py-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F57F17 0%, #FFD600 45%, #FFEE58 75%, #FFF9C4 100%)' }}>
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20" style={{ background: '#FFD600' }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ background: '#F9A825' }} />
        <div className="relative max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 drop-shadow" style={{ color: '#4a2c00' }}>
            Nuestra Historia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '📖', titulo: 'Cómo Empezamos', texto: 'Nació de un sueño: ver a cada niño conocer el amor de Dios. Con un pequeño grupo de familias comprometidas, comenzamos a construir un espacio seguro donde los niños pudieran crecer en fe, valores y comunidad.' },
              { emoji: '🔭', titulo: 'Nuestra Visión', texto: 'Ser un ministerio de referencia que forme niños con carácter, identidad y propósito, preparándolos para ser líderes que transformen su generación con los valores del Reino de Dios.' },
              { emoji: '🎯', titulo: 'Nuestra Misión', texto: 'Enseñar la Palabra de Dios de manera creativa y relevante, crear un ambiente de amor y pertenencia, y acompañar a cada familia en el proceso de formación espiritual de sus hijos.' },
            ].map((item) => (
              <div key={item.titulo} className="rounded-2xl p-6 shadow-lg border border-yellow-300/60"
                style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}>
                <div className="text-4xl mb-4 text-center">{item.emoji}</div>
                <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#4a2c00' }}>{item.titulo}</h3>
                <p className="text-sm leading-relaxed text-center" style={{ color: '#5a3500' }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. GRUPOS — fondo amarillo medio ── */}
      <section className="py-16 px-6" style={{ background: '#FFF9C4' }} id="grupos">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#E65100' }}>Nuestros Grupos</h2>
          <p className="text-center mb-10" style={{ color: '#F57F17' }}>Cada niño en el salón perfecto para su edad</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grupos.map((g) => (
              <div key={g.nombre}
                className={`rounded-2xl border-2 ${g.border} ${g.bg} p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}>
                <span className="text-5xl mb-3">{g.emoji}</span>
                <h3 className={`text-xl font-bold ${g.text}`}>{g.nombre}</h3>
                <p className="text-sm mt-1" style={{ color: '#78350f' }}>{g.rango}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. VIDEOS — fondo amarillo dorado suave ── */}
      <section className="py-16 px-6" style={{ background: '#FFF3E0' }} id="videos">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#E65100' }}>Videos del Ministerio</h2>
          <p className="text-center mb-10" style={{ color: '#F57F17' }}>Revive los mejores momentos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIDEOS.map((video, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md border-2 border-yellow-200"
                style={{ background: '#FFFDE7' }}>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={video.src}
                    title={video.titulo}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="font-semibold text-xs" style={{ color: '#78350f' }}>{video.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
