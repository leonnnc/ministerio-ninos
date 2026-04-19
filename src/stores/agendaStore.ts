import { create } from 'zustand';
import {
  guardarAsignacion,
  actualizarAsignacion as actualizarAsignacionFS,
  eliminarAsignacion as eliminarAsignacionFS,
} from '@/lib/firestore/agendaService';

export const SERVICIOS_DOMINGO = [
  { id: '8am',   hora: '8:00 AM',  label: 'Primer Servicio'   },
  { id: '11am',  hora: '11:00 AM', label: 'Segundo Servicio'  },
  { id: '1pm',   hora: '1:00 PM',  label: 'Tercer Servicio'   },
  { id: '730pm', hora: '7:30 PM',  label: 'Servicio Nocturno' },
] as const;

export type ServicioId = typeof SERVICIOS_DOMINGO[number]['id'];

export interface AsignacionServicio {
  id: string;
  fecha: string;
  servicioId: ServicioId;
  salonId: string;
  maestroId: string;
  auxiliaresIds: string[];
  alumnosIds: string[];
  notas?: string;
}

interface AgendaState {
  asignaciones: AsignacionServicio[];
  agregarAsignacion: (a: AsignacionServicio) => Promise<void>;
  actualizarAsignacion: (id: string, datos: Partial<AsignacionServicio>) => Promise<void>;
  eliminarAsignacion: (id: string) => Promise<void>;
  obtenerPorFechaYServicio: (fecha: string, servicioId: ServicioId) => AsignacionServicio[];
  obtenerPorMaestro: (maestroId: string) => AsignacionServicio[];
}

export const useAgendaStore = create<AgendaState>()((set, get) => ({
  asignaciones: [],

  agregarAsignacion: async (a) => {
    await guardarAsignacion(a);
    set((state) => ({ asignaciones: [...state.asignaciones, a] }));
  },

  actualizarAsignacion: async (id, datos) => {
    await actualizarAsignacionFS(id, datos);
    set((state) => ({
      asignaciones: state.asignaciones.map((a) => a.id === id ? { ...a, ...datos } : a),
    }));
  },

  eliminarAsignacion: async (id) => {
    await eliminarAsignacionFS(id);
    set((state) => ({
      asignaciones: state.asignaciones.filter((a) => a.id !== id),
    }));
  },

  obtenerPorFechaYServicio: (fecha, servicioId) =>
    get().asignaciones.filter((a) => a.fecha === fecha && a.servicioId === servicioId),

  obtenerPorMaestro: (maestroId) =>
    get().asignaciones.filter((a) => a.maestroId === maestroId),
}));

export function proximosDomingos(cantidad = 8): string[] {
  const domingos: string[] = [];
  const hoy = new Date();
  const diaSemana = hoy.getDay();
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
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
