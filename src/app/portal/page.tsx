'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useAlumnosStore } from '@/stores/alumnosStore';
import { useSalonesStore } from '@/stores/salonesStore';
import { usePersonalStore } from '@/stores/personalStore';
import { Badge } from '@/components/ui';
import type { Rol } from '@/types';

const rolLabel: Record<Rol, string> = {
  Director_General: 'Director General',
  Lider_General: 'Líder General',
  Coordinadora: 'Coordinadora',
  Maestro: 'Maestro/a',
  Auxiliar: 'Auxiliar',
};

const rolColor: Record<Rol, 'primary' | 'success' | 'info' | 'secondary' | 'warning'> = {
  Director_General: 'primary',
  Lider_General: 'secondary',
  Coordinadora: 'warning',
  Maestro: 'success',
  Auxiliar: 'info',
};

export default function PortalPage() {
  const router = useRouter();
  const { usuarioActual, estaAutenticado, cerrarSesion } = useAuthStore();
  const alumnos = useAlumnosStore((s) => s.alumnos);
  const apoderados = useAlumnosStore((s) => s.apoderados);
  const salones = useSalonesStore((s) => s.salones);
  const inicializarSalones = useSalonesStore((s) => s.inicializarSalones);
  const personal = usePersonalStore((s) => s.personal);

  useEffect(() => {
    inicializarSalones();
  }, [inicializarSalones]);

  useEffect(() => {
    if (!estaAutenticado) router.replace('/login');
  }, [estaAutenticado, router]);

  if (!usuarioActual) return null;

  const esAdmin = usuarioActual.rol === 'Director_General' || usuarioActual.rol === 'Lider_General';
  const esCoordinadora = usuarioActual.rol === 'Coordinadora';
  const esMaestro = usuarioActual.rol === 'Maestro';
  const esAuxiliar = usuarioActual.rol === 'Auxiliar';

  // Salones que le corresponden según rol
  const misSalones = esAdmin
    ? salones
    : salones.filter((s) => {
        if (esMaestro) return s.maestroId === usuarioActual.id;
        if (esCoordinadora) return usuarioActual.salonesIds.includes(s.id);
        if (esAuxiliar) return s.auxiliaresIds.includes(usuarioActual.id);
        return false;
      });

  function handleCerrarSesion() {
    cerrarSesion();
    router.push('/');
  }

  // Colores según rol: admin/maestros = formal ámbar oscuro, resto = alegre amarillo
  const esRolFormal = esAdmin || esMaestro;
  const headerBg = esRolFormal ? '#F5C518' : '#FFD600';
  const headerTexto = '#4a2c00';
  const headerSubtexto = '#78350f';
  const fondoPagina = '#FFFDE7';
  const accentColor = '#92400e';
  const salonHeaderBg = esRolFormal ? '#F5C518' : '#FFD600';
  const salonHeaderTexto = '#4a2c00';

  return (
    <div className="min-h-screen" style={{ background: fondoPagina }}>
      {/* Header del portal */}
      <div className="px-6 py-8" style={{ background: headerBg }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: headerSubtexto }}>Bienvenido/a</p>
            <h1 className="text-2xl font-extrabold" style={{ color: headerTexto }}>
              {usuarioActual.nombreCompleto}
            </h1>
            <div className="mt-2">
              <Badge label={rolLabel[usuarioActual.rol]} variant={rolColor[usuarioActual.rol]} />
            </div>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors"
            style={{
              borderColor: '#92400e',
              color: '#92400e',
              background: 'transparent',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Admin: acceso rápido al panel completo */}
        {esAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/admin', emoji: '⚙️', label: 'Panel Admin', sub: 'Gestión completa' },
              { href: '/admin/personal', emoji: '👥', label: 'Personal', sub: `${personal.length} miembros` },
              { href: '/admin/alumnos', emoji: '🎒', label: 'Alumnos', sub: `${alumnos.length} inscritos` },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="rounded-2xl border-2 p-5 text-center hover:shadow-md transition-shadow bg-white"
                style={{ borderColor: '#D97706' }}>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="font-bold" style={{ color: '#78350f' }}>{item.label}</p>
                <p className="text-xs mt-1 text-gray-500">{item.sub}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Mis salones */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
            {esAdmin ? 'Todos los Salones' : 'Mi Salón'}
          </h2>

          {misSalones.length === 0 ? (
            <div className="rounded-2xl border-2 p-8 text-center bg-white" style={{ borderColor: '#D97706' }}>
              <p className="text-lg text-gray-600">
                {esMaestro || esAuxiliar
                  ? 'Aún no tienes un salón asignado. Contacta al administrador.'
                  : 'No hay salones configurados aún.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {misSalones.map((salon) => {
                const alumnosSalon = alumnos.filter((a) => a.salonId === salon.id);
                const maestro = personal.find((p) => p.id === salon.maestroId);
                const auxiliaresSalon = salon.auxiliaresIds
                  .map((id) => personal.find((p) => p.id === id))
                  .filter(Boolean);

                return (
                  <div key={salon.id} className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden" style={{ borderColor: '#D97706' }}>
                    <div className="px-5 py-4" style={{ background: salonHeaderBg }}>
                      <h3 className="text-lg font-bold" style={{ color: salonHeaderTexto }}>{salon.nombre}</h3>
                      <p className="text-sm" style={{ color: '#78350f' }}>
                        {salon.edadMinima} – {salon.edadMaxima} años
                      </p>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600">Maestro: </span>
                          <span className="text-gray-800">{maestro?.nombreCompleto ?? 'Sin asignar'}</span>
                        </div>
                        {auxiliaresSalon.length > 0 && (
                          <div>
                            <span className="font-semibold text-gray-600">Auxiliares: </span>
                            <span className="text-gray-800">{auxiliaresSalon.map((a) => a?.nombreCompleto).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-sm mb-2" style={{ color: accentColor }}>
                          Niños inscritos ({alumnosSalon.length})
                        </p>
                        {alumnosSalon.length === 0 ? (
                          <p className="text-sm text-gray-400">Sin alumnos inscritos aún</p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {alumnosSalon.map((alumno) => {
                              const apoderado = apoderados.find((ap) => ap.id === alumno.apoderadoId);
                              return (
                                <div key={alumno.id} className="flex items-center gap-3 rounded-xl p-2 border border-amber-100 bg-amber-50">
                                  {alumno.fotografiaUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={alumno.fotografiaUrl} alt={alumno.nombreCompleto}
                                      className="w-9 h-9 rounded-full object-cover border-2 border-amber-300 flex-none" />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center font-bold text-sm border-2 border-amber-300"
                                      style={{ background: '#FCD34D', color: '#4a2c00' }}>
                                      {alumno.nombreCompleto.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate text-gray-800">{alumno.nombreCompleto}</p>
                                    {apoderado && (
                                      <p className="text-xs truncate text-gray-500">
                                        {apoderado.nombreCompleto} · {apoderado.telefono}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Programación */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Programación</h2>
          <div className="rounded-2xl border-2 bg-white p-6" style={{ borderColor: '#D97706' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">📅</span>
              <div>
                <p className="font-bold text-gray-800">Próximo Domingo</p>
                <p className="text-sm text-gray-500">Reunión dominical del ministerio</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { hora: '9:00 AM', actividad: 'Recepción de niños', icono: '🚪' },
                { hora: '9:15 AM', actividad: 'Alabanza y adoración', icono: '🎵' },
                { hora: '9:45 AM', actividad: 'Mensaje bíblico', icono: '📖' },
                { hora: '10:15 AM', actividad: 'Actividad creativa', icono: '🎨' },
                { hora: '10:45 AM', actividad: 'Refrigerio', icono: '🍎' },
                { hora: '11:00 AM', actividad: 'Entrega de niños', icono: '👨‍👩‍👧' },
              ].map((item) => (
                <div key={item.hora} className="flex items-center gap-2 rounded-xl p-3 border border-amber-100 bg-amber-50">
                  <span className="text-xl">{item.icono}</span>
                  <div>
                    <p className="font-semibold" style={{ color: '#B45309' }}>{item.hora}</p>
                    <p className="text-gray-700">{item.actividad}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
