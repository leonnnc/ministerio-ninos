'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useAlumnosStore } from '@/stores/alumnosStore';
import { useSalonesStore } from '@/stores/salonesStore';
import { usePersonalStore } from '@/stores/personalStore';
import { Badge, Button } from '@/components/ui';
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

  return (
    <div className="min-h-screen" style={{ background: '#FFFDE7' }}>
      {/* Header del portal */}
      <div className="px-6 py-8" style={{ background: 'linear-gradient(135deg, #F57F17, #FFD600)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#78350f' }}>Bienvenido/a</p>
            <h1 className="text-2xl font-extrabold" style={{ color: '#4a2c00' }}>
              {usuarioActual.nombreCompleto}
            </h1>
            <div className="mt-2">
              <Badge label={rolLabel[usuarioActual.rol]} variant={rolColor[usuarioActual.rol]} />
            </div>
          </div>
          <Button variant="outline" onClick={handleCerrarSesion} size="sm">
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Admin: acceso rápido al panel completo */}
        {esAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin" className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">⚙️</div>
              <p className="font-bold" style={{ color: '#78350f' }}>Panel Admin</p>
              <p className="text-xs mt-1" style={{ color: '#92400e' }}>Gestión completa</p>
            </Link>
            <Link href="/admin/personal" className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">👥</div>
              <p className="font-bold" style={{ color: '#78350f' }}>Personal</p>
              <p className="text-xs mt-1" style={{ color: '#92400e' }}>{personal.length} miembros</p>
            </Link>
            <Link href="/admin/alumnos" className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🎒</div>
              <p className="font-bold" style={{ color: '#78350f' }}>Alumnos</p>
              <p className="text-xs mt-1" style={{ color: '#92400e' }}>{alumnos.length} inscritos</p>
            </Link>
          </div>
        )}

        {/* Mis salones */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#E65100' }}>
            {esAdmin ? 'Todos los Salones' : 'Mi Salón'}
          </h2>

          {misSalones.length === 0 ? (
            <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-8 text-center">
              <p className="text-lg" style={{ color: '#92400e' }}>
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
                  <div key={salon.id} className="rounded-2xl border-2 border-yellow-300 bg-white shadow-sm overflow-hidden">
                    {/* Header del salón */}
                    <div className="px-5 py-4" style={{ background: 'linear-gradient(90deg, #FFD600, #FFEE58)' }}>
                      <h3 className="text-lg font-bold" style={{ color: '#4a2c00' }}>{salon.nombre}</h3>
                      <p className="text-sm" style={{ color: '#78350f' }}>{salon.edadMinima} – {salon.edadMaxima} años</p>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Personal del salón */}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div>
                          <span className="font-semibold" style={{ color: '#92400e' }}>Maestro: </span>
                          <span style={{ color: '#4a2c00' }}>{maestro?.nombreCompleto ?? 'Sin asignar'}</span>
                        </div>
                        {auxiliaresSalon.length > 0 && (
                          <div>
                            <span className="font-semibold" style={{ color: '#92400e' }}>Auxiliares: </span>
                            <span style={{ color: '#4a2c00' }}>{auxiliaresSalon.map((a) => a?.nombreCompleto).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Lista de niños */}
                      <div>
                        <p className="font-semibold text-sm mb-2" style={{ color: '#E65100' }}>
                          Niños inscritos ({alumnosSalon.length})
                        </p>
                        {alumnosSalon.length === 0 ? (
                          <p className="text-sm" style={{ color: '#92400e' }}>Sin alumnos inscritos aún</p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {alumnosSalon.map((alumno) => {
                              const apoderado = apoderados.find((ap) => ap.id === alumno.apoderadoId);
                              return (
                                <div key={alumno.id} className="flex items-center gap-3 rounded-xl p-2 border border-yellow-100 bg-yellow-50">
                                  {/* Avatar */}
                                  {alumno.fotografiaUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={alumno.fotografiaUrl} alt={alumno.nombreCompleto}
                                      className="w-9 h-9 rounded-full object-cover border-2 border-yellow-300 flex-none" />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center font-bold text-sm border-2 border-yellow-300"
                                      style={{ background: '#FFD600', color: '#4a2c00' }}>
                                      {alumno.nombreCompleto.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate" style={{ color: '#4a2c00' }}>
                                      {alumno.nombreCompleto}
                                    </p>
                                    {apoderado && (
                                      <p className="text-xs truncate" style={{ color: '#92400e' }}>
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

        {/* Programación semanal (placeholder) */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#E65100' }}>Programación</h2>
          <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📅</span>
              <div>
                <p className="font-bold" style={{ color: '#4a2c00' }}>Próximo Domingo</p>
                <p className="text-sm" style={{ color: '#78350f' }}>Reunión dominical del ministerio</p>
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
                <div key={item.hora} className="flex items-center gap-2 rounded-xl p-3 bg-white border border-yellow-200">
                  <span className="text-xl">{item.icono}</span>
                  <div>
                    <p className="font-semibold" style={{ color: '#F57F17' }}>{item.hora}</p>
                    <p style={{ color: '#4a2c00' }}>{item.actividad}</p>
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
