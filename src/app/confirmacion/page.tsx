'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAlumnosStore } from '@/stores/alumnosStore';
import { useSalonesStore } from '@/stores/salonesStore';
import TarjetaAlumno from '@/components/tarjeta/TarjetaAlumno';
import { descargarTarjetaPDF } from '@/components/tarjeta/TarjetaAlumnoPDF';
import { Button, Spinner } from '@/components/ui';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const alumnoId = searchParams.get('alumnoId') ?? '';

  const alumno = useAlumnosStore((s) => s.obtenerAlumnoPorId(alumnoId));
  const apoderados = useAlumnosStore((s) => s.apoderados);
  const salones = useSalonesStore((s) => s.salones);

  const [descargando, setDescargando] = useState(false);

  if (!alumno) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-600 text-lg font-semibold">
          No se encontró el alumno registrado.
        </p>
        <Link href="/inscripcion" className="text-primary-600 underline hover:text-primary-800">
          Volver a inscripción
        </Link>
      </div>
    );
  }

  const apoderado = apoderados.find((a) => a.id === alumno.apoderadoId);
  const salon = salones.find((s) => s.id === alumno.salonId);

  if (!apoderado || !salon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-600 text-lg font-semibold">
          Datos incompletos. No se pudo cargar la información.
        </p>
        <Link href="/inscripcion" className="text-primary-600 underline hover:text-primary-800">
          Volver a inscripción
        </Link>
      </div>
    );
  }

  async function handleDescargarPDF() {
    if (!alumno || !apoderado || !salon) return;
    setDescargando(true);
    try {
      await descargarTarjetaPDF(alumno, apoderado, salon);
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-primary-800">¡Inscripción exitosa! 🎉</h1>
        <p className="text-gray-600 mt-2">El niño ha sido registrado correctamente.</p>
      </div>

      <TarjetaAlumno alumno={alumno} apoderado={apoderado} salon={salon} modo="preview" />

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={handleDescargarPDF}
          loading={descargando}
          className="w-full"
        >
          {descargando ? 'Generando PDF...' : 'Descargar PDF'}
        </Button>

        <Link href="/inscripcion" className="w-full">
          <Button variant="outline" className="w-full">
            Inscribir otro niño
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}
