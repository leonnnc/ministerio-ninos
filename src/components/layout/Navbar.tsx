'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/inscripcion', label: 'Inscripción' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-primary-700 text-white shadow-md" aria-label="Navegación principal">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo / nombre */}
        <Link href="/" className="text-xl font-bold tracking-wide hover:text-primary-200 transition-colors">
          Ministerio de Niños
        </Link>

        {/* Links desktop */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-primary-200 transition-colors ${
                  pathname === href ? 'text-primary-200 underline underline-offset-4' : ''
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded hover:bg-primary-600 transition-colors"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul role="navigation" aria-label="Menú móvil" className="md:hidden bg-primary-800 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block py-1 hover:text-primary-200 transition-colors ${
                  pathname === href ? 'text-primary-200 underline underline-offset-4' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
