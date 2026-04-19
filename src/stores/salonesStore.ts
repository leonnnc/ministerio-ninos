import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Salon } from '@/types';
import { CONFIGURACION_SALONES } from '@/lib/asignacionSalon';
import type { GrupoEdad } from '@/types';

interface SalonesState {
  salones: Salon[];
  inicializarSalones: () => void;
  asignarMaestro: (salonId: string, maestroId: string) => void;
  asignarAuxiliar: (salonId: string, auxiliarId: string) => void;
}

export const useSalonesStore = create<SalonesState>()(
  persist(
    (set, get) => ({
      salones: [],

      inicializarSalones: () => {
        // Solo inicializa si no hay salones ya creados
        if (get().salones.length > 0) return;

        const salones: Salon[] = (Object.entries(CONFIGURACION_SALONES) as [GrupoEdad, { edadMinima: number; edadMaxima: number; nombre: string }][]).map(
          ([grupoEdad, config]) => ({
            id: crypto.randomUUID(),
            nombre: config.nombre,
            grupoEdad,
            edadMinima: config.edadMinima,
            edadMaxima: config.edadMaxima,
            auxiliaresIds: [],
          })
        );

        set({ salones });
      },

      asignarMaestro: (salonId, maestroId) => {
        set((state) => ({
          salones: state.salones.map((salon) =>
            salon.id === salonId ? { ...salon, maestroId } : salon
          ),
        }));
      },

      asignarAuxiliar: (salonId, auxiliarId) => {
        set((state) => ({
          salones: state.salones.map((salon) => {
            if (salon.id !== salonId) return salon;
            if (salon.auxiliaresIds.includes(auxiliarId)) return salon;
            return { ...salon, auxiliaresIds: [...salon.auxiliaresIds, auxiliarId] };
          }),
        }));
      },
    }),
    {
      name: 'salones-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Error al rehidratar salones-storage:', error);
        }
      },
    }
  )
);
