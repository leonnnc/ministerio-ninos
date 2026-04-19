import { z } from 'zod';

export const SchemaAlumno = z.object({
  nombreCompleto: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecciona una fecha de nacimiento válida'),
  sexo: z.string().refine((v) => v === 'masculino' || v === 'femenino', {
    message: 'Selecciona el sexo del niño',
  }) as z.ZodType<'masculino' | 'femenino'>,
  fotografiaUrl: z.string().optional(),
});

export const SchemaApoderado = z.object({
  nombreCompleto: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  relacion: z.string().refine((v) => v === 'padre' || v === 'madre' || v === 'tutor', {
    message: 'Selecciona la relación con el niño',
  }) as z.ZodType<'padre' | 'madre' | 'tutor'>,
  telefono: z.string().min(7, 'Teléfono inválido'),
  email: z.string().email('Correo electrónico inválido'),
});

export const SchemaInscripcion = z.object({
  alumno: SchemaAlumno,
  apoderado: SchemaApoderado,
});

export type AlumnoFormData = z.infer<typeof SchemaAlumno>;
export type ApoderadoFormData = z.infer<typeof SchemaApoderado>;
export type InscripcionFormData = z.infer<typeof SchemaInscripcion>;
