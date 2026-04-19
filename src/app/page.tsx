'use client';

import Link from "next/link";
import CarruselFondo, { type MediaItem } from "@/components/ui/CarruselFondo";

// ─── Agrega aquí tus imágenes y videos ───────────────────────────────────────
// Coloca los archivos en la carpeta /public/media/ y referencia así:
// { tipo: 'imagen', src: '/media/foto1.jpg', alt: 'Descripción' }
// { tipo: 'video',  src: '/media/video1.mp4' }
const MEDIA_CARRUSEL: MediaItem[] = [
  {
    tipo: 'imagen',
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
    alt: 'Niños en el ministerio',
  },
  {
    tipo: 'imagen',
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80',
    alt: 'Niños aprendiendo',
  },
  {
    tipo: 'imagen',
    src: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&q=80',
    alt: 'Comunidad infantil',
  },
];

const grupos = [
  {
    nombre: "Cuna",
    rango: "0 – 2 años",
    emoji: "🍼",
    bg: "bg-pink-100",
    border: "border-pink-300",
    text: "text-pink-700",
  },
  {
    nombre: "Preescolar",
    rango: "3 – 5 años",
    emoji: "🎨",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    text: "text-yellow-700",
  },
  {
    nombre: "Primaria Baja",
    rango: "6 – 10 años",
    emoji: "📚",
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-700",
  },
  {
    nombre: "Primaria Alta",
    rango: "11 – 13 años",
    emoji: "🌟",
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-700",
  },
];

const jerarquia = [
  { rol: "Director General", emoji: "👑", descripcion: "Visión y dirección del ministerio" },
  { rol: "Líder General", emoji: "🎯", descripcion: "Coordinación operativa general" },
  { rol: "Coordinadoras", emoji: "📋", descripcion: "Gestión de grupos y salones" },
  { rol: "Maestros", emoji: "🏫", descripcion: "Enseñanza y formación de los niños" },
  { rol: "Auxiliares", emoji: "🤝", descripcion: "Apoyo y cuidado en cada salón" },
];

export default function Home() {
  return (
    <>
      {/* Hero con carrusel de fondo */}
      <CarruselFondo items={MEDIA_CARRUSEL} intervalo={6000}>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          ✝️ Ministerio de Niños
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow">
          Formando el corazón de los niños con amor, fe y propósito. Bienvenido
          al sistema de gestión e inscripción de nuestro ministerio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/inscripcion"
            className="bg-accent-400 hover:bg-accent-500 text-primary-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-colors text-lg"
          >
            Inscribir a mi hijo
          </Link>
          <Link
            href="/admin"
            className="bg-white/20 hover:bg-white/30 border border-white text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-colors text-lg"
          >
            Panel de Administración
          </Link>
        </div>
      </CarruselFondo>

      {/* Grupos / Salones */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-2">
            Nuestros Grupos
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Cada niño en el salón perfecto para su edad
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grupos.map((g) => (
              <div
                key={g.nombre}
                className={`rounded-2xl border-2 ${g.border} ${g.bg} p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}
              >
                <span className="text-5xl mb-3">{g.emoji}</span>
                <h3 className={`text-xl font-bold ${g.text}`}>{g.nombre}</h3>
                <p className="text-gray-600 text-sm mt-1">{g.rango}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jerarquía */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-2">
            Equipo del Ministerio
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Personas comprometidas sirviendo con excelencia
          </p>
          <ol className="relative border-l-4 border-primary-200 space-y-8 pl-8">
            {jerarquia.map((item, i) => (
              <li key={item.rol} className="relative">
                <span className="absolute -left-[2.35rem] flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 border-2 border-primary-400 text-xl">
                  {item.emoji}
                </span>
                <div className="bg-primary-50 rounded-xl p-4 shadow-sm">
                  <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
                    Nivel {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-primary-800">{item.rol}</h3>
                  <p className="text-gray-500 text-sm">{item.descripcion}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
