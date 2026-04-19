'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useAlumnosStore } from '@/stores/alumnosStore';
import { useSalonesStore } from '@/stores/salonesStore';
import { useAsistenciaStore } from '@/stores/asistenciaStore';
import { SERVICIOS_DOMINGO } from '@/stores/agendaStore';
import type { Alumno, RegistroAsistencia } from '@/types';

function formatHora(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function hoyISO() {
  return new Date().toISOString().split('T')[0];
}

export default function CheckinPage() {
  const router = useRouter();
  const { usuarioActual, estaAutenticado } = useAuthStore();
  const alumnos = useAlumnosStore((s) => s.alumnos);
  const apoderados = useAlumnosStore((s) => s.apoderados);
  const salones = useSalonesStore((s) => s.salones);
  const { registros, registrarIngreso, registrarSalida, obtenerRegistroActivo } = useAsistenciaStore();

  const [servicioId, setServicioId] = useState<string>(SERVICIOS_DOMINGO[0].id);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'ok' | 'error' } | null>(null);

  const fecha = hoyISO();

  useEffect(() => {
    if (!estaAutenticado) router.replace('/login');
  }, [estaAutenticado, router]);

  if (!usuarioActual) return null;

  // Filtrar alumnos según rol
  const esMaestro = usuarioActual.rol === 'Maestro';
  const misSalones = esMaestro
    ? salones.filter((s) => s.maestroId === usuarioActual.id)
    : salones;
  const misSalonIds = misSalones.map((s) => s.id);

  const alumnosFiltrados = alumnos
    .filter((a) => misSalonIds.includes(a.salonId))
    .filter((a) =>
      busqueda.trim() === '' ||
      a.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
    );

  async function handleIngreso(alumno: Alumno) {
    const existente = obtenerRegistroActivo(alumno.id, fecha, servicioId);
    if (existente) {
      setMensaje({ texto: `${alumno.nombreCompleto} ya tiene ingreso registrado`, tipo: 'error' });
      return;
    }
    setCargando(alumno.id + '-in');
    try {
      await registrarIngreso(alumno.id, fecha, servicioId, usuarioActual!.id);
      setMensaje({ texto: `✅ Ingreso registrado: ${alumno.nombreCompleto}`, tipo: 'ok' });
    } finally {
      setCargando(null);
      setTimeout(() => setMensaje(null), 3000);
    }
  }

  async function handleSalida(alumno: Alumno) {
    const registro = obtenerRegistroActivo(alumno.id, fecha, servicioId);
    if (!registro) {
      setMensaje({ texto: `${alumno.nombreCompleto} no tiene ingreso registrado`, tipo: 'error' });
      return;
    }
    if (registro.estado === 'entregado') {
      setMensaje({ texto: `${alumno.nombreCompleto} ya fue entregado`, tipo: 'error' });
      return;
    }
    setCargando(alumno.id + '-out');
    try {
      await registrarSalida(registro.id, usuarioActual!.id);
      // Enviar WhatsApp al apoderado
      const apoderado = apoderados.find((ap) => ap.id === alumno.apoderadoId);
      if (apoderado) {
        const tel = (apoderado.whatsapp ?? apoderado.telefono).replace(/\D/g, '');
        const msg = encodeURIComponent(
          `✝️ *Ministerio de Niños*\n\n` +
          `Hola ${apoderado.nombreCompleto}, tu hijo/a *${alumno.nombreCompleto}* ya está listo para ser recogido.\n\n` +
          `🕐 Hora de entrega: ${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}\n` +
          `Por favor acércate al salón. ¡Dios te bendiga! 🙏`
        );
        window.open(`https://wa.me/${tel}?text=${msg}`, '_blank');
      }
      setMensaje({ texto: `✅ Salida registrada: ${alumno.nombreCompleto}`, tipo: 'ok' });
    } finally {
      setCargando(null);
      setTimeout(() => setMensaje(null), 3000);
    }
  }

  const estadoAlumno = (alumnoId: string): RegistroAsistencia | undefined =>
    obtenerRegistroActivo(alumnoId, fecha, servicioId);

  // Contadores
  const presentes = alumnosFiltrados.filter((a) => {
    const r = estadoAlumno(a.id);
    return r?.estado === 'presente';
  }).length;
  const entregados = alumnosFiltrados.filter((a) => {
    const r = estadoAlumno(a.id);
    return r?.estado === 'entregado';
  }).length;

  return (
    <div className="min-h-screen" style={{ background: '#FFFDE7' }}>
      {/* Header */}
      <div className="px-6 py-6 text-center" style={{ background: '#F5C518' }}>
        <h1 className="text-2xl font-extrabold" style={{ color: '#4a2c00' }}>
          📋 Check-in / Check-out
        </h1>
        <p className="text-sm mt-1" style={{ color: '#78350f' }}>
          Registro de ingreso y salida de niños(as)
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Selector de servicio */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SERVICIOS_DOMINGO.map((s) => (
            <button key={s.id} onClick={() => setServicioId(s.id)}
              className="flex-none px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap"
              style={{
                background: servicioId === s.id ? '#F5C518' : '#fff',
                borderColor: servicioId === s.id ? '#D97706' : '#FDE68A',
                color: '#4a2c00',
              }}>
              {s.hora}
            </button>
          ))}
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', valor: alumnosFiltrados.length, color: '#4a2c00', bg: '#FFF9C4' },
            { label: 'Presentes', valor: presentes, color: '#15803d', bg: '#dcfce7' },
            { label: 'Entregados', valor: entregados, color: '#1d4ed8', bg: '#dbeafe' },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl p-3 text-center border border-yellow-200"
              style={{ background: c.bg }}>
              <p className="text-2xl font-extrabold" style={{ color: c.color }}>{c.valor}</p>
              <p className="text-xs font-semibold text-gray-600">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Búsqueda */}
        <input
          type="search"
          placeholder="🔍 Buscar niño(a) por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border-2 border-yellow-200 px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
          style={{ background: '#fff' }}
        />

        {/* Mensaje de feedback */}
        {mensaje && (
          <div className={`rounded-xl px-4 py-3 text-sm font-semibold text-center ${
            mensaje.tipo === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Lista de niños */}
        <div className="space-y-3">
          {alumnosFiltrados.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No hay niños en este salón</p>
          ) : (
            alumnosFiltrados.map((alumno) => {
              const registro = estadoAlumno(alumno.id);
              const salon = salones.find((s) => s.id === alumno.salonId);
              const apoderado = apoderados.find((ap) => ap.id === alumno.apoderadoId);
              const enCargando = cargando?.startsWith(alumno.id);

              return (
                <div key={alumno.id} className="rounded-2xl border-2 bg-white overflow-hidden shadow-sm"
                  style={{
                    borderColor: registro?.estado === 'entregado' ? '#93c5fd'
                      : registro?.estado === 'presente' ? '#86efac'
                      : '#FDE68A',
                  }}>
                  <div className="flex items-center gap-3 p-4">
                    {/* Avatar */}
                    {alumno.fotografiaUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={alumno.fotografiaUrl} alt={alumno.nombreCompleto}
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300 flex-none" />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-none border-2 border-yellow-300"
                        style={{ background: '#FFF9C4', color: '#4a2c00' }}>
                        {alumno.nombreCompleto.charAt(0)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: '#4a2c00' }}>
                        {alumno.nombreCompleto}
                      </p>
                      <p className="text-xs text-gray-500">{salon?.nombre}</p>
                      {apoderado && (
                        <p className="text-xs text-gray-400 truncate">
                          {apoderado.nombreCompleto} · {apoderado.telefono}
                        </p>
                      )}
                      {registro && (
                        <div className="flex gap-3 mt-1 text-xs">
                          {registro.horaIngreso && (
                            <span className="text-green-600">▶ {formatHora(registro.horaIngreso)}</span>
                          )}
                          {registro.horaSalida && (
                            <span className="text-blue-600">◀ {formatHora(registro.horaSalida)}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Estado + botones */}
                    <div className="flex flex-col gap-2 flex-none">
                      {!registro ? (
                        <button onClick={() => handleIngreso(alumno)} disabled={!!enCargando}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                          style={{ background: '#16a34a' }}>
                          {enCargando ? '...' : '✅ Recibir'}
                        </button>
                      ) : registro.estado === 'presente' ? (
                        <>
                          <span className="text-xs font-bold text-green-600 text-center">Presente</span>
                          <button onClick={() => handleSalida(alumno)} disabled={!!enCargando}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                            style={{ background: '#2563eb' }}>
                            {enCargando ? '...' : '👋 Entregar'}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-blue-600 text-center">Entregado ✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
