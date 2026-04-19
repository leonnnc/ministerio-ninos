import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Personal } from '@/types';

interface PersonalState {
  personal: Personal[];
  agregarPersonal: (p: Personal) => void;
  actualizarPersonal: (id: string, datos: Partial<Personal>) => void;
  eliminarPersonal: (id: string) => boolean;
}

export const usePersonalStore = create<PersonalState>()(
  persist(
    (set, get) => ({
      personal: [],

      agregarPersonal: (p: Personal) => {
        set((state) => ({ personal: [...state.personal, p] }));
      },

      actualizarPersonal: (id: string, datos: Partial<Personal>) => {
        set((state) => ({
          personal: state.personal.map((p) =>
            p.id === id ? { ...p, ...datos } : p
          ),
        }));
      },

      eliminarPersonal: (id: string): boolean => {
        const miembro = get().personal.find((p) => p.id === id);
        if (!miembro) return false;

        // Si es Maestro, verificar que no tenga alumnos asignados en su salón
        if (miembro.rol === 'Maestro' && miembro.salonesIds.length > 0) {
          // Importación dinámica para evitar dependencias circulares
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { useAlumnosStore } = require('@/stores/alumnosStore');
          const { alumnos } = useAlumnosStore.getState() as { alumnos: { salonId: string }[] };

          const tieneAlumnos = miembro.salonesIds.some((salonId) =>
            alumnos.some((alumno) => alumno.salonId === salonId)
          );

          if (tieneAlumnos) return false;
        }

        set((state) => ({
          personal: state.personal.filter((p) => p.id !== id),
        }));
        return true;
      },
    }),
    {
      name: 'personal-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Error al rehidratar personal-storage:', error);
        }
      },
    }
  )
);
