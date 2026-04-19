import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SERVICIOS_DOMINGO = [
  { id: '8am',    hora: '8:00 AM',  label: 'Primer Servicio' },
  { id: '11am',   hora: '11:00 AM', label: 'Segundo Servicio' },
  { id: '1pm',    hora: '1:00 PM',  label: 'Tercer Servicio' },
  { id: '730pm',  hora: '7:30 PM',  label: 'Servicio Nocturno' },
] as const;

export type ServicioId = typeof SERVICIOS_DOMINGO[number]['id'];

export interface AsignacionServicio {
  id: string;           // UUID
  fecha: string;        // ISO "YYYY-MM-DD" (siempre domingo)
  servicioId: ServicioId;
  salonId: string;
  maestroId: string;
  auxiliaresIds: string[];
  alumnosIds: string[];
  notas?: string;
}

interface AgendaState {
  asignaciones: AsignacionServicio[];
  agregarAsignacion: (a: AsignacionServicio) => void;
  actualizarAsignacion: (id: string, datos: Partial<AsignacionServicio>) => void;
  eliminarAsignacion: (id: string) => void;
  obtenerPorFechaYServicio: (fecha: string, servicioId: ServicioId) => AsignacionServicio[];
  obtenerPorMaestro: (maestroId: string) => AsignacionServicio[];
}

export const useAgendaStore = create<AgendaState>()(
  persist(
    (set, get) => ({
      asignaciones: [],

      agregarAsignacion: (a) =>
        set((state) => ({ asignaciones: [...state.asignaciones, a] })),

      actualizarAsignacion: (id, datos) =>
        set((state) => ({
          asignaciones: state.asignaciones.map((a) =>
            a.id === id ? { ...a, ...datos } : a
          ),
        })),

      eliminarAsignacion: (id) =>
        set((state) => ({
          asignaciones: state.asignaciones.filter((a) => a.id !== id),
        })),

      obtenerPorFechaYServicio: (fecha, servicioId) =>
        get().asignaciones.filter(
          (a) => a.fecha === fecha && a.servicioId === servicioId
        ),

      obtenerPorMaestro: (maestroId) =>
        get().asignaciones.filter((a) => a.maestroId === maestroId),
    }),
    {
      name: 'agenda-storage',
      onRehydrateStorage: () => (_, error) => {
        if (error) console.warn('Error al rehidratar agenda-storage:', error);
      },
    }
  )
);

// Utilidad: obtener los próximos N domingos desde hoy
export function proximosDomingos(cantidad = 8): string[] {
  const domingos: string[] = [];
  const hoy = new Date();
  const diaSemana = hoy.getDay(); // 0 = domingo
  const diasHastaDomingo = diaSemana === 0 ? 0 : 7 - diaSemana;
  const primero = new Date(hoy);
  primero.setDate(hoy.getDate() + diasHastaDomingo);

  for (let i = 0; i < cantidad; i++) {
    const d = new Date(primero);
    d.setDate(primero.getDate() + i * 7);
    domingos.push(d.toISOString().split('T')[0]);
  }
  return domingos;
}

export function formatearFechaDomingo(fechaISO: string): string {
  const [year, month, day] = fechaISO.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  return fecha.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
