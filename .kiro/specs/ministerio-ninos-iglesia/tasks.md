# Plan de Implementación: Sistema Web del Ministerio de Niños

## Descripción General

Implementación incremental de la aplicación Next.js 14 con TypeScript y Tailwind CSS. Cada tarea construye sobre la anterior, comenzando por la base de tipos y lógica de dominio, luego el estado global, los formularios, la generación de tarjetas y finalmente el panel de administración.

## Tareas

- [x] 1. Configurar el proyecto base y la estructura de tipos
  - Inicializar proyecto Next.js 14 con TypeScript, Tailwind CSS y App Router
  - Instalar dependencias: `zustand`, `react-hook-form`, `zod`, `@react-pdf/renderer`, `fast-check`, `vitest`, `@testing-library/react`
  - Crear `src/types/index.ts` con todos los tipos e interfaces: `GrupoEdad`, `Rol`, `RelacionApoderado`, `Sexo`, `Alumno`, `Apoderado`, `Salon`, `Personal`
  - Crear `src/lib/validaciones.ts` con los esquemas Zod: `SchemaAlumno`, `SchemaApoderado`, `SchemaInscripcion`
  - Crear `src/lib/asignacionSalon.ts` con la constante `CONFIGURACION_SALONES` y la función `asignarSalon(fechaNacimiento: string): GrupoEdad | null`
  - _Requisitos: 1.1, 2.1, 2.2, 2.3, 3.1, 3.2_

- [ ] 2. Implementar lógica de dominio y pruebas de propiedades
  - [x] 2.1 Implementar función `asignarSalon` con manejo de rangos y errores
    - La función debe calcular la edad a partir de `fechaNacimiento` (ISO 8601) y retornar el `GrupoEdad` correspondiente o `null` si está fuera de rango (0–13 años)
    - Manejar fechas futuras retornando `null` con mensaje descriptivo
    - _Requisitos: 1.4, 2.2, 2.3_

  - [ ]* 2.2 Escribir prueba de propiedad P1: Asignación de salón por edad es total y correcta
    - **Propiedad 1: Asignación de salón por edad es total y correcta**
    - Usar `fc.date({ min: hace13años, max: hoy })` para generar fechas válidas
    - Verificar que `asignarSalon` retorna exactamente un `GrupoEdad` cuyo rango contiene la edad calculada
    - **Valida: Requisitos 1.4, 2.2**

  - [ ]* 2.3 Escribir prueba de propiedad P2: Edades fuera de rango son rechazadas
    - **Propiedad 2: Edades fuera de rango son rechazadas**
    - Usar `fc.date({ min: hace100años, max: hace14años })` para fechas fuera de rango
    - Verificar que `asignarSalon` retorna `null` o lanza error
    - **Valida: Requisito 2.3**

  - [ ]* 2.4 Escribir prueba de propiedad P3: Validación rechaza datos incompletos
    - **Propiedad 3: Validación de formulario rechaza datos incompletos**
    - Usar `fc.record(...)` con campos obligatorios omitidos aleatoriamente
    - Verificar que `SchemaInscripcion.safeParse` retorna al menos un error de validación
    - **Valida: Requisitos 3.1, 3.2, 3.3, 3.4**

- [x] 3. Punto de control — Verificar lógica de dominio
  - Asegurarse de que todas las pruebas de dominio pasen. Consultar al usuario si surgen dudas.

- [ ] 4. Implementar stores Zustand con persistencia
  - [x] 4.1 Crear `src/stores/salonesStore.ts`
    - Implementar `SalonesState` con `inicializarSalones`, `asignarMaestro`, `asignarAuxiliar`
    - `inicializarSalones` debe crear los 4 salones base usando `CONFIGURACION_SALONES`
    - `asignarMaestro` debe reemplazar el `maestroId` existente (no acumular)
    - Configurar middleware `persist` de Zustand con localStorage
    - _Requisitos: 1.2, 1.3, 2.1_

  - [ ]* 4.2 Escribir prueba de propiedad P5: Salón tiene exactamente un maestro
    - **Propiedad 5: Un salón tiene exactamente un maestro asignado**
    - Usar `fc.uuid()` para generar ids de maestro
    - Verificar que asignar un segundo maestro reemplaza al primero
    - **Valida: Requisito 1.2**

  - [x] 4.3 Crear `src/stores/personalStore.ts`
    - Implementar `PersonalState` con `agregarPersonal`, `actualizarPersonal`, `eliminarPersonal`
    - `eliminarPersonal` debe retornar `false` si el maestro tiene alumnos asignados en su salón
    - Configurar middleware `persist`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 4.4 Escribir prueba de propiedad P6: Asignación de personal se refleja en el estado
    - **Propiedad 6: La asignación de personal se refleja en el estado**
    - Verificar que tras `agregarPersonal` + `asignarMaestro`, el `salonId` aparece en `salonesIds` del maestro
    - Verificar que para auxiliares, `maestroAsignadoId` queda correctamente asignado
    - **Valida: Requisitos 6.2, 6.3**

  - [ ]* 4.5 Escribir prueba de propiedad P7: No se puede eliminar maestro con alumnos asignados
    - **Propiedad 7: No se puede eliminar un maestro con alumnos asignados**
    - Generar maestro con al menos un alumno asignado en su salón
    - Verificar que `eliminarPersonal` retorna `false` y el maestro permanece en el store
    - **Valida: Requisito 6.4**

  - [x] 4.6 Crear `src/stores/alumnosStore.ts`
    - Implementar `AlumnosState` con `agregarAlumno`, `obtenerAlumnoPorId`, `obtenerAlumnosPorSalon`
    - `agregarAlumno` debe recibir `(alumno: Alumno, apoderado: Apoderado)` y persistir ambos
    - Configurar middleware `persist`
    - _Requisitos: 1.4, 3.3, 3.6_

- [x] 5. Punto de control — Verificar stores
  - Asegurarse de que todas las pruebas de stores pasen. Consultar al usuario si surgen dudas.

- [ ] 6. Implementar componentes de layout y UI base
  - [x] 6.1 Crear componentes base en `src/components/ui/`
    - Implementar `Button`, `Input`, `Card`, `Badge`, `Modal` con Tailwind CSS
    - Todos los componentes deben ser responsive (320px–1920px)
    - Incluir indicador de carga (`Spinner`) para operaciones > 500ms
    - _Requisitos: 5.1, 5.3, 5.5_

  - [x] 6.2 Crear `src/components/layout/Navbar.tsx` y `Footer.tsx`
    - Navbar con navegación visible en todos los tamaños de pantalla (hamburger en móvil)
    - Links a: Inicio, Inscripción, Panel de Administración
    - _Requisitos: 5.1, 5.4_

  - [x] 6.3 Crear página principal `src/app/page.tsx`
    - Landing page con presentación del ministerio
    - Botón de acceso al formulario de inscripción
    - Botón de acceso al panel de administración
    - _Requisitos: 5.1, 5.2, 5.3_

- [ ] 7. Implementar formulario de inscripción
  - [x] 7.1 Crear `src/components/forms/FormularioInscripcion.tsx`
    - Integrar `react-hook-form` con `SchemaInscripcion` (zod resolver)
    - Campos del alumno: nombre completo, fecha de nacimiento, sexo, fotografía (opcional)
    - Campos del apoderado: nombre completo, relación, teléfono, correo electrónico
    - Mostrar mensajes de error descriptivos por campo sin borrar datos válidos
    - Subida de fotografía con validación de formato (JPG/PNG/WebP) y tamaño (≤ 5MB)
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 7.2 Crear `src/app/inscripcion/page.tsx`
    - Renderizar `FormularioInscripcion`
    - Al envío exitoso: calcular grupo de edad con `asignarSalon`, guardar en store, redirigir a `/confirmacion`
    - Mostrar error si la edad está fuera de rango (0–13 años)
    - _Requisitos: 2.2, 2.3, 3.3, 3.6_

  - [ ]* 7.3 Escribir pruebas unitarias para el formulario de inscripción
    - Envío exitoso → mensaje de confirmación visible
    - Envío con campos vacíos → errores por campo visibles, datos no borrados
    - Foto con formato inválido → mensaje de error correcto
    - Foto mayor a 5MB → mensaje de error correcto
    - _Requisitos: 3.3, 3.4_

- [ ] 8. Implementar generación de tarjeta del alumno
  - [x] 8.1 Crear `src/lib/generarTarjeta.ts`
    - Función `generarDatosTarjeta(alumno: Alumno, apoderado: Apoderado, salon: Salon)` que retorna un objeto con todos los campos requeridos por la tarjeta
    - Incluir fotografía si `fotografiaUrl` está definida
    - _Requisitos: 4.1, 4.2, 4.3_

  - [ ]* 8.2 Escribir prueba de propiedad P4: La tarjeta contiene todos los datos requeridos
    - **Propiedad 4: La tarjeta generada contiene todos los datos requeridos**
    - Usar `fc.record(...)` con datos válidos aleatorios de `Alumno`, `Apoderado` y `Salon`
    - Verificar que el objeto retornado contiene nombre del alumno, fecha de nacimiento, grupo de salón, nombre del apoderado y teléfono
    - Verificar que si `fotografiaUrl` está definida, aparece en el resultado
    - **Valida: Requisitos 4.1, 4.2, 4.3**

  - [x] 8.3 Crear `src/components/tarjeta/TarjetaAlumno.tsx`
    - Componente visual de la tarjeta con diseño consistente (colores, tipografía, logotipo del ministerio)
    - Props: `{ alumno, apoderado, salon, modo: 'preview' | 'pdf' }`
    - Mostrar fotografía si está disponible
    - _Requisitos: 4.2, 4.3, 4.5_

  - [x] 8.4 Crear `src/components/tarjeta/TarjetaAlumnoPDF.tsx`
    - Versión de la tarjeta usando `@react-pdf/renderer`
    - Mismos datos y diseño que `TarjetaAlumno` pero renderizada como PDF
    - _Requisitos: 4.4, 4.5_

  - [x] 8.5 Crear `src/app/confirmacion/page.tsx`
    - Mostrar mensaje de éxito de registro
    - Renderizar preview de `TarjetaAlumno` con los datos del alumno recién registrado
    - Botones de descarga: PDF (usando `@react-pdf/renderer`) e imagen PNG
    - _Requisitos: 3.6, 4.1, 4.4_

  - [ ]* 8.6 Escribir pruebas unitarias para la generación de tarjeta
    - Alumno con fotografía → tarjeta incluye imagen
    - Descarga de tarjeta → produce blob de tipo `application/pdf`
    - _Requisitos: 4.3, 4.4_

- [x] 9. Punto de control — Verificar flujo de inscripción completo
  - Asegurarse de que todas las pruebas del flujo de inscripción pasen. Consultar al usuario si surgen dudas.

- [ ] 10. Implementar panel de administración
  - [x] 10.1 Crear `src/components/forms/FormularioPersonal.tsx`
    - Formulario para registrar/editar personal con campos: nombre completo, rol, teléfono, correo
    - Validación con Zod y react-hook-form
    - _Requisitos: 6.1_

  - [x] 10.2 Crear `src/components/admin/TablaPersonal.tsx`
    - Tabla con lista de personal, columnas: nombre, rol, salón(es) asignado(s), acciones (editar/eliminar)
    - Al eliminar maestro con alumnos: mostrar modal de advertencia antes de proceder
    - Props: `{ personal: Personal[], onEditar, onEliminar }`
    - _Requisitos: 1.5, 6.4, 6.5_

  - [x] 10.3 Crear `src/components/admin/TablaSalones.tsx`
    - Tabla con los 4 salones, mostrando maestro asignado y lista de auxiliares
    - Permitir asignar/cambiar maestro y auxiliares desde la tabla
    - _Requisitos: 1.2, 1.3, 6.2, 6.3_

  - [x] 10.4 Crear `src/components/admin/TablaAlumnos.tsx`
    - Tabla con lista de alumnos, columnas: nombre, fecha de nacimiento, salón, apoderado
    - Filtro por salón/grupo de edad
    - _Requisitos: 1.4, 1.5_

  - [x] 10.5 Crear páginas del panel de administración
    - `src/app/admin/page.tsx`: dashboard con resumen de personal y alumnos por salón
    - `src/app/admin/personal/page.tsx`: gestión de personal usando `TablaPersonal` y `FormularioPersonal`
    - `src/app/admin/salones/page.tsx`: gestión de salones usando `TablaSalones`
    - `src/app/admin/alumnos/page.tsx`: lista de alumnos usando `TablaAlumnos`
    - _Requisitos: 1.5, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 10.6 Escribir pruebas unitarias para el panel de administración
    - Panel de administración → lista de personal visible con sus asignaciones
    - Perfil de maestro → muestra auxiliares y alumnos asignados
    - Eliminar maestro con alumnos → muestra advertencia modal
    - _Requisitos: 1.5, 6.4, 6.5_

- [x] 11. Punto de control final — Verificar todas las pruebas
  - Asegurarse de que todas las pruebas pasen (dominio, stores, formularios, tarjeta, admin). Consultar al usuario si surgen dudas.

- [ ] 12. Integración final y ajustes de rendimiento
  - [x] 12.1 Conectar todos los componentes y páginas
    - Verificar que el flujo completo funciona: inscripción → confirmación → descarga de tarjeta
    - Verificar que el panel de administración refleja los alumnos y personal registrados
    - _Requisitos: 1.4, 2.2, 3.6, 4.1_

  - [ ]* 12.2 Escribir pruebas de humo (smoke tests)
    - Los 4 grupos de salón existen con rangos correctos al inicializar el store
    - La jerarquía de roles está definida en el orden correcto
    - El formulario renderiza en viewport 320px sin overflow horizontal
    - _Requisitos: 1.1, 2.1, 5.1_

  - [x] 12.3 Optimizar rendimiento y accesibilidad
    - Verificar carga < 3 segundos con Lighthouse
    - Agregar indicadores de carga para operaciones > 500ms
    - Asegurar navegación accesible en todos los tamaños de pantalla
    - Manejar errores de localStorage (no disponible o datos corruptos)
    - _Requisitos: 5.1, 5.2, 5.4, 5.5_

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los puntos de control garantizan validación incremental
- Las pruebas de propiedad usan `fast-check` con mínimo 100 iteraciones por propiedad
- Las pruebas unitarias usan `Vitest` + `@testing-library/react`
- Toda la persistencia es en `localStorage`; no se requiere backend
