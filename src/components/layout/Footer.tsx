import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Columna 1: Identidad */}
        <div>
          <h3 className="text-lg font-bold mb-3">✝️ Ministerio de Niños</h3>
          <p className="text-primary-300 text-sm leading-relaxed">
            Formando el corazón de los niños con amor, fe y propósito en cada reunión dominical.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div>
          <h3 className="text-lg font-bold mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm text-primary-300">
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link href="/inscripcion" className="hover:text-white transition-colors">Inscripción</Link></li>
            <li><Link href="/#grupos" className="hover:text-white transition-colors">Nuestros Grupos</Link></li>
            <li><Link href="/#historia" className="hover:text-white transition-colors">Historia</Link></li>
            <li><Link href="/#videos" className="hover:text-white transition-colors">Videos</Link></li>
          </ul>
        </div>

        {/* Columna 3: Grupos */}
        <div>
          <h3 className="text-lg font-bold mb-3">Grupos</h3>
          <ul className="space-y-2 text-sm text-primary-300">
            <li>🍼 Cuna — 0 a 2 años</li>
            <li>🎨 Preescolar — 3 a 5 años</li>
            <li>📚 Primaria Baja — 6 a 10 años</li>
            <li>🌟 Primaria Alta — 11 a 13 años</li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-primary-700 py-4 text-center text-xs text-primary-400">
        © {new Date().getFullYear()} Ministerio de Niños. Todos los derechos reservados.
      </div>
    </footer>
  );
}
