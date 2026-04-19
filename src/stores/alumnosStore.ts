import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Alumno, Apoderado } from '@/types';

interface AlumnosState {
  alumnos: Alumno[];
  apoderados: Apoderado[];
  agregarAlumno: (alumno: Alumno, apoderado: Apoderado) => void;
  obtenerAlumnoPorId: (id: string) => Alumno | undefined;
  obtenerAlumnosPorSalon: (salonId: string) => Alumno[];
}

export const useAlumnosStore = create<AlumnosState>()(
  persist(
    (set, get) => ({
      alumnos: [],
      apoderados: [],

      agregarAlumno: (alumno, apoderado) => {
        set((state) => ({
          alumnos: [...state.alumnos, alumno],
          apoderados: [...state.apoderados, apoderado],
        }));
      },

      obtenerAlumnoPorId: (id) => {
        return get().alumnos.find((a) => a.id === id);
      },

      obtenerAlumnosPorSalon: (salonId) => {
        return get().alumnos.filter((a) => a.salonId === salonId);
      },
    }),
    {
      name: 'alumnos-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Error al rehidratar alumnos-storage:', error);
        }
      },
    }
  )
);
