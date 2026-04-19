import { z } from 'zod';

// Acepta tanto YYYY-MM-DD como DD/MM/YYYY y normaliza a YYYY-MM-DD
function normalizarFecha(valor: string): string {
  // Si ya está en formato YYYY-MM-DD, retornar tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
  // Si está en formato DD/MM/YYYY, convertir
  const partes = valor.split('/');
  if (partes.length === 3 && partes[2].length === 4) {
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
  }
  return valor;
}

export const SchemaAlumno = z.object({
  nombreCompleto: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string()
    .min(1, 'Selecciona la fecha de nacimiento')
    .transform(normalizarFecha)
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Formato de fecha inválido'),
  sexo: z.string().refine((v) => v === 'masculino' || v === 'femenino', {
    message: 'Selecciona el sexo del niño',
  }) as z.ZodType<'masculino' | 'femenino'>,
  fotografiaUrl: z.string().optional(),
});

export const SchemaApoderado = z.object({
  nombreCompleto: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  relacion: z.string().refine((v) => v === 'padre' || v === 'madre' || v === 'tutor', {
    message: 'Selecciona la relación con el niño',
  }) as z.ZodType<'padre' | 'madre' | 'tutor'>,
  telefono: z.string().min(1, 'El teléfono es requerido').min(7, 'Teléfono inválido'),
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
});

export const SchemaInscripcion = z.object({
  alumno: SchemaAlumno,
  apoderado: SchemaApoderado,
});

export type AlumnoFormData = z.infer<typeof SchemaAlumno>;
export type ApoderadoFormData = z.infer<typeof SchemaApoderado>;
export type InscripcionFormData = z.infer<typeof SchemaInscripcion>;
