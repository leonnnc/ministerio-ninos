'use client';

import { useEffect } from 'react';
import { escucharAlumnos, escucharApoderados } from '@/lib/firestore/alumnosService';
import { escucharPersonal } from '@/lib/firestore/personalService';
import { escucharSalones } from '@/lib/firestore/salonesService';
import { escucharAgenda } from '@/lib/firestore/agendaService';
import { useAlumnosStore } from '@/stores/alumnosStore';
import { usePersonalStore } from '@/stores/personalStore';
import { useSalonesStore } from '@/stores/salonesStore';
import { useAgendaStore } from '@/stores/agendaStore';

/**
 * Hook que sincroniza Firestore → stores de Zustand en tiempo real.
 * Úsalo una sola vez en el layout raíz.
 */
export function useFirestoreSync() {
  useEffect(() => {
    const unsubs = [
      escucharAlumnos((alumnos) => {
        useAlumnosStore.setState({ alumnos });
      }),
      escucharApoderados((apoderados) => {
        useAlumnosStore.setState({ apoderados });
      }),
      escucharPersonal((personal) => {
        usePersonalStore.setState({ personal });
      }),
      escucharSalones((salones) => {
        useSalonesStore.setState({ salones });
      }),
      escucharAgenda((asignaciones) => {
        useAgendaStore.setState({ asignaciones });
      }),
    ];

    return () => unsubs.forEach((u) => u());
  }, []);
}
