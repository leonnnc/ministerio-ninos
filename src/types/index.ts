// Grupos de edad disponibles
export type GrupoEdad = 'Cuna' | 'Preescolar' | 'PrimariaBaja' | 'PrimariaAlta';

// Roles del ministerio (orden jerárquico descendente)
export type Rol = 'Director_General' | 'Lider_General' | 'Coordinadora' | 'Maestro' | 'Auxiliar';

// Relación del apoderado con el alumno
export type RelacionApoderado = 'padre' | 'madre' | 'tutor';

// Sexo del alumno
export type Sexo = 'masculino' | 'femenino';

export interface Alumno {
  id: string;                   // UUID generado al registrar
  nombreCompleto: string;
  fechaNacimiento: string;      // ISO 8601: "YYYY-MM-DD"
  sexo: Sexo;
  fotografiaUrl?: string;       // Base64 o URL de objeto local
  salonId: string;              // Referencia al Salon asignado
  apoderadoId: string;          // Referencia al Apoderado
  fechaRegistro: string;        // ISO 8601 timestamp
}

export interface Apoderado {
  id: string;
  nombreCompleto: string;
  relacion: RelacionApoderado;
  telefono: string;
  email: string;
}

export interface Salon {
  id: string;
  nombre: string;               // Ej: "Grupo Cuna", "Grupo Preescolar"
  grupoEdad: GrupoEdad;
  edadMinima: number;           // En años
  edadMaxima: number;           // En años
  maestroId?: string;           // Referencia al Personal con rol Maestro
  auxiliaresIds: string[];      // Referencias a Personal con rol Auxiliar
}

export interface Personal {
  id: string;
  nombreCompleto: string;
  rol: Rol;
  telefono: string;
  email: string;
  salonesIds: string[];         // Salones asignados (para Maestros/Coordinadoras)
  maestroAsignadoId?: string;   // Solo para Auxiliares: maestro al que apoyan
}
