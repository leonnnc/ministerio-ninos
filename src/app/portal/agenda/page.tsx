'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useAgendaStore, SERVICIOS_DOMINGO, proximosDomingos, formatearFechaDomingo, type ServicioId, type AsignacionServicio } from '@/stores/agendaStore';
import { usePersonalStore } from '@/stores/personalStore';
import { useSalonesStore } from '@/stores/salonesStore';
import { useAlumnosStore } from '@/stores/alumnosStore';
import ModalAsignacion from '@/components/agenda/ModalAsignacion';

export default function AgendaPage() {
  const router = useRouter();
  const { usuarioActual, estaAutenticado } = useAuthStore();
  const { asignaciones, eliminarAsignacion, obtenerPorFechaYServicio } = useAgendaStore();
  const personal = usePersonalStore((s) => s.personal);
  const salones = useSalonesStore((s) => s.salones);
  const inicializarSalones = useSalonesStore((s) => s.inicializarSalones);
  const alumnos = useAlumnosStore((s) => s.alumnos);

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [asignacionEditando, setAsignacionEditando] = useState<AsignacionServicio | null>(null);
  const [servicioModal, setServicioModal] = useState<ServicioId | null>(null);

  const domingos = proximosDomingos(8);

  useEffect(() => {
    inicializarSalones();
    if (domingos.length > 0) setFechaSeleccionada(domingos[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!estaAutenticado) router.replace('/login');
  }, [estaAutenticado, router]);

  if (!usuarioActual) return null;

  const puedeEditar =
    usuarioActual.rol === 'Director_General' ||
    usuarioActual.rol === 'Lider_General' ||
    usuarioActual.rol === 'Coordinadora';

  // Para maestros: filtrar solo sus asignaciones
  const esMaestro = usuarioActual.rol === 'Maestro';

  function abrirModalNuevo(servicioId: ServicioId) {
    setAsignacionEditando(null);
    setServicioModal(servicioId);
    setModalAbierto(true);
  }

  function abrirModalEditar(asignacion: AsignacionServicio) {
    setAsignacionEditando(asignacion);
    setServicioModal(asignacion.servicioId);
    setModalAbierto(true);
  }

  function getNombrePersonal(id: string) {
    return personal.find((p) => p.id === id)?.nombreCompleto ?? 'Sin asignar';
  }

  function getNombreSalon(id: string) {
    return salones.find((s) => s.id === id)?.nombre ?? '—';
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFFDE7' }}>

      {/* Header */}
      <div className="px-6 py-8 text-center" style={{ background: '#F5C518' }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#4a2c00' }}>
          📅 Agenda Dominical
        </h1>
        <p className="text-sm mt-1" style={{ color: '#78350f' }}>
          Programación de servicios y asignaciones del ministerio
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Selector de domingo */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: '#92400e' }}>Selecciona el domingo:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {domingos.map((fecha) => (
              <button
                key={fecha}
                onClick={() => setFechaSeleccionada(fecha)}
                className="flex-none px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all whitespace-nowrap"
                style={{
                  background: fechaSeleccionada === fecha ? '#F5C518' : '#fff',
                  borderColor: fechaSeleccionada === fecha ? '#D97706' : '#FDE68A',
                  color: fechaSeleccionada === fecha ? '#4a2c00' : '#92400e',
                }}
              >
                {formatearFechaDomingo(fecha).replace('domingo, ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Servicios del día */}
        {fechaSeleccionada && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold capitalize" style={{ color: '#E65100' }}>
              {formatearFechaDomingo(fechaSeleccionada)}
            </h2>

            {SERVICIOS_DOMINGO.map((servicio) => {
              let asignacionesServicio = obtenerPorFechaYServicio(fechaSeleccionada, servicio.id);

              // Maestros solo ven sus asignaciones
              if (esMaestro) {
                asignacionesServicio = asignacionesServicio.filter(
                  (a) => a.maestroId === usuarioActual.id
                );
              }

              return (
                <div key={servicio.id} className="rounded-2xl border-2 border-yellow-200 bg-white overflow-hidden shadow-sm">
                  {/* Header del servicio */}
                  <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#FFF9C4' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⛪</span>
                      <div>
                        <p className="font-bold" style={{ color: '#4a2c00' }}>{servicio.hora}</p>
                        <p className="text-xs" style={{ color: '#78350f' }}>{servicio.label}</p>
                      </div>
                    </div>
                    {puedeEditar && (
                      <button
                        onClick={() => abrirModalNuevo(servicio.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-yellow-400 transition-colors hover:bg-yellow-100"
                        style={{ color: '#92400e' }}
                      >
                        + Agregar asignación
                      </button>
                    )}
                  </div>

                  {/* Asignaciones del servicio */}
                  <div className="p-4">
                    {asignacionesServicio.length === 0 ? (
                      <p className="text-sm text-center py-4" style={{ color: '#D97706' }}>
                        {esMaestro
                          ? 'No tienes asignaciones en este servicio'
                          : 'Sin asignaciones aún'}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {asignacionesServicio.map((asig) => {
                          const alumnosSalon = alumnos.filter((a) =>
                            asig.alumnosIds.includes(a.id)
                          );
                          const auxiliares = asig.auxiliaresIds.map((id) =>
                            personal.find((p) => p.id === id)
                          ).filter(Boolean);

                          return (
                            <div key={asig.id} className="rounded-xl border-2 border-yellow-100 p-4" style={{ background: '#FFFDE7' }}>
                              {/* Salón */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-sm" style={{ color: '#4a2c00' }}>
                                  🏫 {getNombreSalon(asig.salonId)}
                                </span>
                                {puedeEditar && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => abrirModalEditar(asig)}
                                      className="text-xs px-2 py-1 rounded-lg border border-yellow-300 hover:bg-yellow-100 transition-colors"
                                      style={{ color: '#92400e' }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => eliminarAsignacion(asig.id)}
                                      className="text-xs px-2 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-red-500"
                                    >
                                      Quitar
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Maestro */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-none"
                                  style={{ background: '#F5C518', color: '#4a2c00' }}>
                                  {getNombrePersonal(asig.maestroId).charAt(0)}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-700">{getNombrePersonal(asig.maestroId)}</p>
                                  <p className="text-xs text-gray-400">Maestro/a</p>
                                </div>
                              </div>

                              {/* Auxiliares */}
                              {auxiliares.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-semibold text-gray-500 mb-1">Auxiliares:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {auxiliares.map((aux) => aux && (
                                      <span key={aux.id} className="text-xs px-2 py-0.5 rounded-full border border-yellow-200 bg-yellow-50" style={{ color: '#78350f' }}>
                                        {aux.nombreCompleto}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Niños */}
                              {alumnosSalon.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Niños asignados ({alumnosSalon.length}):
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {alumnosSalon.map((alumno) => (
                                      <span key={alumno.id} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200" style={{ color: '#4a2c00' }}>
                                        {alumno.nombreCompleto.split(' ')[0]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Notas */}
                              {asig.notas && (
                                <p className="mt-2 text-xs italic text-gray-400">📝 {asig.notas}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de asignación */}
      {modalAbierto && servicioModal && (
        <ModalAsignacion
          fecha={fechaSeleccionada}
          servicioId={servicioModal}
          asignacionEditando={asignacionEditando}
          onCerrar={() => { setModalAbierto(false); setAsignacionEditando(null); }}
        />
      )}
    </div>
  );
}
