import { z } from 'zod';

export const SchemaAlumno = z.object({
  nombreCompleto: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecciona una fecha de nacimiento válida'),
  sexo: z.enum(['masculino', 'femenino'], {
    errorMap: () => ({ message: 'Selecciona el sexo del niño' }),
  }),
  fotografiaUrl: z.string().optional(),
});

export const SchemaApoderado = z.object({
  nombreCompleto: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  relacion: z.enum(['padre', 'madre', 'tutor'], {
    errorMap: () => ({ message: 'Selecciona la relación con el niño' }),
  }),
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
