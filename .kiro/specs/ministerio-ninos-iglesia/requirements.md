# Documento de Requisitos

## Introducción

Este documento describe los requisitos para el sistema web del Ministerio de Niños de una iglesia dominical. La aplicación es una página web moderna y responsive que gestiona la estructura organizacional del ministerio, el proceso de inscripción de niños, y la generación de tarjetas de identificación con los datos del alumno registrado.

El sistema soporta una jerarquía de roles (Director General, Líder General, Coordinadoras, Maestros/Maestras, Auxiliares) y organiza a los alumnos en salones separados por grupos de edad (Cuna, Preescolar, Primaria Baja, Primaria Alta).

---

## Glosario

- **Sistema**: La aplicación web del Ministerio de Niños.
- **Director_General**: Rol de mayor jerarquía dentro del ministerio; supervisa toda la operación.
- **Lider_General**: Rol que apoya al Director General en la gestión global del ministerio.
- **Coordinadora**: Rol que supervisa a los maestros y auxiliares de uno o más salones.
- **Maestro**: Rol responsable de impartir clases en un salón asignado.
- **Auxiliar**: Rol de apoyo asignado a un Maestro específico dentro de un salón.
- **Alumno**: Niño inscrito en el ministerio, asignado a un salón según su edad.
- **Apoderado**: Padre, madre o tutor legal responsable de un Alumno.
- **Salon**: Grupo de Alumnos organizado por rango de edad, con un Maestro y uno o más Auxiliares asignados.
- **Tarjeta_Alumno**: Documento visual generado al completar el registro de un Alumno, que contiene sus datos personales y los de su Apoderado.
- **Formulario_Inscripcion**: Interfaz web que captura los datos del Alumno y su Apoderado para completar el registro.
- **Grupo_Cuna**: Salón para Alumnos de 0 a 2 años.
- **Grupo_Preescolar**: Salón para Alumnos de 3 a 5 años.
- **Grupo_Primaria_Baja**: Salón para Alumnos de 6 a 10 años.
- **Grupo_Primaria_Alta**: Salón para Alumnos de 11 a 13 años.

---

## Requisitos

### Requisito 1: Estructura Organizacional del Ministerio

**Historia de Usuario:** Como Director General, quiero visualizar y gestionar la jerarquía completa del ministerio, para que pueda supervisar roles, salones y asignaciones de personal desde un solo lugar.

#### Criterios de Aceptación

1. THE Sistema SHALL mantener una jerarquía de roles en el siguiente orden descendente: Director_General, Lider_General, Coordinadora, Maestro, Auxiliar.
2. THE Sistema SHALL permitir que cada Salon tenga exactamente un Maestro asignado.
3. THE Sistema SHALL permitir que cada Salon tenga uno o más Auxiliares asignados a su Maestro.
4. THE Sistema SHALL asignar cada Alumno a exactamente un Salon según su rango de edad.
5. WHEN un usuario con rol Director_General o Lider_General accede al panel de administración, THE Sistema SHALL mostrar la lista completa de Coordinadoras, Maestros y Auxiliares con sus respectivas asignaciones de salón.

---

### Requisito 2: Gestión de Salones por Grupo de Edad

**Historia de Usuario:** Como Coordinadora, quiero que los salones estén organizados por rango de edad, para que cada Alumno sea asignado automáticamente al grupo correcto según su fecha de nacimiento.

#### Criterios de Aceptación

1. THE Sistema SHALL definir cuatro grupos de salón: Grupo_Cuna (0–2 años), Grupo_Preescolar (3–5 años), Grupo_Primaria_Baja (6–10 años) y Grupo_Primaria_Alta (11–13 años).
2. WHEN se completa el registro de un Alumno, THE Sistema SHALL calcular la edad del Alumno a partir de su fecha de nacimiento y asignarlo al Salon correspondiente a su grupo de edad.
3. IF la edad del Alumno no corresponde a ningún grupo definido, THEN THE Sistema SHALL mostrar un mensaje de error indicando que el Alumno no cumple el rango de edad del ministerio.
4. WHILE un Alumno permanece inscrito, THE Sistema SHALL mantener su asignación de Salon actualizada si su edad cambia de rango en el siguiente ciclo de inscripción.

---

### Requisito 3: Formulario de Inscripción de Alumnos

**Historia de Usuario:** Como Apoderado, quiero completar un formulario de inscripción en línea, para que mi hijo quede registrado en el ministerio sin necesidad de trámites presenciales.

#### Criterios de Aceptación

1. THE Formulario_Inscripcion SHALL capturar los siguientes datos del Alumno: nombre completo, fecha de nacimiento, sexo y fotografía opcional.
2. THE Formulario_Inscripcion SHALL capturar los siguientes datos del Apoderado: nombre completo, relación con el Alumno (padre, madre o tutor), número de teléfono de contacto y correo electrónico.
3. WHEN el Apoderado envía el Formulario_Inscripcion, THE Sistema SHALL validar que todos los campos obligatorios estén completos antes de procesar el registro.
4. IF un campo obligatorio del Formulario_Inscripcion está vacío o contiene un formato inválido, THEN THE Sistema SHALL mostrar un mensaje de error descriptivo junto al campo correspondiente sin borrar los datos ya ingresados.
5. THE Formulario_Inscripcion SHALL ser accesible y funcional en dispositivos móviles, tabletas y computadoras de escritorio.
6. WHEN el Apoderado envía el Formulario_Inscripcion con datos válidos, THE Sistema SHALL confirmar el registro mostrando un mensaje de éxito en pantalla.

---

### Requisito 4: Generación de Tarjeta del Alumno

**Historia de Usuario:** Como Apoderado, quiero recibir una tarjeta con los datos de mi hijo al finalizar el registro, para que pueda usarla como identificación dentro del ministerio.

#### Criterios de Aceptación

1. WHEN el registro de un Alumno se completa exitosamente, THE Sistema SHALL generar automáticamente una Tarjeta_Alumno con los datos del Alumno y su Apoderado.
2. THE Tarjeta_Alumno SHALL mostrar: nombre completo del Alumno, fecha de nacimiento, grupo de Salon asignado, nombre del Apoderado y número de teléfono de contacto.
3. WHERE el Alumno tiene fotografía registrada, THE Tarjeta_Alumno SHALL incluir la fotografía del Alumno.
4. THE Tarjeta_Alumno SHALL ser descargable en formato PDF o imagen (PNG/JPG) desde la misma pantalla de confirmación de registro.
5. THE Tarjeta_Alumno SHALL presentar un diseño visual consistente con la identidad del ministerio (colores, tipografía y logotipo si está disponible).

---

### Requisito 5: Diseño Web Moderno y Responsive

**Historia de Usuario:** Como usuario del sistema, quiero que la página web sea moderna y funcione correctamente en cualquier dispositivo, para que pueda acceder desde mi teléfono, tableta o computadora sin problemas.

#### Criterios de Aceptación

1. THE Sistema SHALL renderizar correctamente en resoluciones de pantalla desde 320px (móvil) hasta 1920px (escritorio) sin pérdida de funcionalidad ni contenido.
2. THE Sistema SHALL cargar la página principal en menos de 3 segundos en una conexión de banda ancha estándar (10 Mbps).
3. THE Sistema SHALL utilizar un diseño visual moderno con componentes de interfaz claros, jerarquía tipográfica definida y paleta de colores coherente.
4. WHEN un usuario navega entre secciones del Sistema, THE Sistema SHALL mantener la navegación visible y accesible en todos los tamaños de pantalla.
5. THE Sistema SHALL mostrar indicadores de carga visibles WHEN una operación tarda más de 500ms en completarse.

---

### Requisito 6: Gestión de Personal del Ministerio

**Historia de Usuario:** Como Director General, quiero registrar y administrar el personal del ministerio (Coordinadoras, Maestros y Auxiliares), para que las asignaciones de salones estén siempre actualizadas.

#### Criterios de Aceptación

1. THE Sistema SHALL permitir registrar miembros del personal con los siguientes datos: nombre completo, rol (Coordinadora, Maestro o Auxiliar), número de teléfono y correo electrónico.
2. WHEN se registra un Maestro, THE Sistema SHALL permitir asignarlo a uno o más Salones disponibles.
3. WHEN se registra un Auxiliar, THE Sistema SHALL permitir asignarlo a un Maestro específico dentro de un Salon.
4. IF se intenta eliminar un Maestro que tiene Alumnos asignados en su Salon, THEN THE Sistema SHALL mostrar una advertencia solicitando reasignación antes de proceder.
5. THE Sistema SHALL mostrar en el perfil de cada Maestro la lista de Auxiliares y Alumnos asignados a su Salon.
