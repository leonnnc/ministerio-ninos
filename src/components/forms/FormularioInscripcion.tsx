'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SchemaInscripcion, type InscripcionFormData } from '@/lib/validaciones';
import { Button, Input, Card } from '@/components/ui';
import type { Alumno, Apoderado } from '@/types';

interface FormularioInscripcionProps {
  onExito: (alumno: Alumno, apoderado: Apoderado) => void;
}

const TIPOS_FOTO_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FOTO_BYTES = 5 * 1024 * 1024; // 5MB

function convertirArchivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(archivo);
  });
}

export default function FormularioInscripcion({ onExito }: FormularioInscripcionProps) {
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InscripcionFormData>({
    resolver: zodResolver(SchemaInscripcion),
    defaultValues: {
      alumno: {
        nombreCompleto: '',
        fechaNacimiento: '',
        sexo: undefined,
        fotografiaUrl: undefined,
      },
      apoderado: {
        nombreCompleto: '',
        relacion: undefined,
        telefono: '',
        email: '',
      },
    },
  });

  async function manejarCambioFoto(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorFoto(null);
    const archivo = e.target.files?.[0];
    if (!archivo) {
      setFotoBase64(undefined);
      return;
    }
    if (!TIPOS_FOTO_ACEPTADOS.includes(archivo.type)) {
      setErrorFoto('Solo se aceptan imágenes en formato JPG, PNG o WebP');
      setFotoBase64(undefined);
      return;
    }
    if (archivo.size > MAX_FOTO_BYTES) {
      setErrorFoto('La imagen no debe superar los 5MB');
      setFotoBase64(undefined);
      return;
    }
    try {
      const base64 = await convertirArchivoABase64(archivo);
      setFotoBase64(base64);
    } catch {
      setErrorFoto('Error al procesar la imagen');
      setFotoBase64(undefined);
    }
  }

  async function onSubmit(datos: InscripcionFormData) {
    const ahora = new Date().toISOString();
    const apoderadoId = crypto.randomUUID();
    const alumnoId = crypto.randomUUID();

    const apoderado: Apoderado = {
      id: apoderadoId,
      ...datos.apoderado,
    };

    const alumno: Alumno = {
      id: alumnoId,
      ...datos.alumno,
      fotografiaUrl: fotoBase64,
      salonId: '',       // será asignado por la lógica de negocio del padre
      apoderadoId,
      fechaRegistro: ahora,
    };

    onExito(alumno, apoderado);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Sección: Datos del Niño */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del Niño</h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Nombre completo"
            placeholder="Ej: Juan Pérez García"
            error={errors.alumno?.nombreCompleto?.message}
            {...register('alumno.nombreCompleto')}
          />

          <Input
            label="Fecha de nacimiento"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            error={errors.alumno?.fechaNacimiento?.message}
            {...register('alumno.fechaNacimiento')}
          />

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="alumno-sexo" className="text-sm font-medium text-gray-700">
              Sexo
            </label>
            <select
              id="alumno-sexo"
              className={[
                'w-full rounded-lg border px-3 py-2 text-sm text-gray-900',
                'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1',
                errors.alumno?.sexo
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-400',
              ].join(' ')}
              aria-invalid={!!errors.alumno?.sexo}
              aria-describedby={errors.alumno?.sexo ? 'alumno-sexo-error' : undefined}
              defaultValue=""
              {...register('alumno.sexo')}
            >
              <option value="" disabled>Seleccionar...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
            {errors.alumno?.sexo && (
              <p id="alumno-sexo-error" className="text-xs text-red-600" role="alert">
                {errors.alumno.sexo.message}
              </p>
            )}
          </div>

          {/* Fotografía — tomar foto o subir desde galería */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700">
              Fotografía <span className="text-gray-400 font-normal">(opcional)</span>
            </label>

            {/* Preview de la foto */}
            {fotoBase64 && (
              <div className="relative w-24 h-24 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoBase64}
                  alt="Vista previa"
                  className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300 shadow"
                />
                <button
                  type="button"
                  onClick={() => setFotoBase64(undefined)}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow"
                  aria-label="Quitar foto"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2">
              {/* Tomar foto con cámara (móvil) */}
              <label
                htmlFor="foto-camara"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-colors hover:bg-yellow-50"
                style={{ borderColor: '#F5C518', color: '#92400e' }}
              >
                📷 Tomar foto
                <input
                  id="foto-camara"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={manejarCambioFoto}
                />
              </label>

              {/* Subir desde galería */}
              <label
                htmlFor="foto-galeria"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-colors hover:bg-yellow-50"
                style={{ borderColor: '#FDE68A', color: '#92400e' }}
              >
                🖼️ Galería
                <input
                  id="foto-galeria"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={manejarCambioFoto}
                />
              </label>
            </div>

            {errorFoto && (
              <p className="text-xs text-red-600" role="alert">{errorFoto}</p>
            )}
            <p className="text-xs text-gray-400">JPG, PNG o WebP · máximo 5MB</p>
          </div>
        </div>
      </Card>

      {/* Sección: Datos del Apoderado */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del Apoderado</h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Nombre completo"
            placeholder="Ej: María García López"
            error={errors.apoderado?.nombreCompleto?.message}
            {...register('apoderado.nombreCompleto')}
          />

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="apoderado-relacion" className="text-sm font-medium text-gray-700">
              Relación con el niño
            </label>
            <select
              id="apoderado-relacion"
              className={[
                'w-full rounded-lg border px-3 py-2 text-sm text-gray-900',
                'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1',
                errors.apoderado?.relacion
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-400',
              ].join(' ')}
              aria-invalid={!!errors.apoderado?.relacion}
              aria-describedby={errors.apoderado?.relacion ? 'apoderado-relacion-error' : undefined}
              defaultValue=""
              {...register('apoderado.relacion')}
            >
              <option value="" disabled>Seleccionar...</option>
              <option value="padre">Padre</option>
              <option value="madre">Madre</option>
              <option value="tutor">Tutor</option>
            </select>
            {errors.apoderado?.relacion && (
              <p id="apoderado-relacion-error" className="text-xs text-red-600" role="alert">
                {errors.apoderado.relacion.message}
              </p>
            )}
          </div>

          <Input
            label="Teléfono"
            type="tel"
            placeholder="Ej: +56912345678"
            error={errors.apoderado?.telefono?.message}
            {...register('apoderado.telefono')}
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="Ej: maria@correo.com"
            error={errors.apoderado?.email?.message}
            {...register('apoderado.email')}
          />
        </div>
      </Card>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? 'Registrando...' : 'Inscribir Niño'}
      </Button>
    </form>
  );
}
