'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalStore } from '@/stores/personalStore';
import { useAlumnosStore } from '@/stores/alumnosStore';
import { useSalonesStore } from '@/stores/salonesStore';
import { useAgendaStore, proximosDomingos, SERVICIOS_DOMINGO } from '@/stores/agendaStore';
import type { Personal, Alumno, Apoderado } from '@/types';

// ── Datos demo ────────────────────────────────────────────────────────────────

const NOMBRES_MAESTRAS = [
  'Ana García', 'María López', 'Carmen Rodríguez', 'Laura Martínez', 'Isabel Sánchez',
  'Patricia Flores', 'Claudia Torres', 'Verónica Ramírez', 'Daniela Castro', 'Fernanda Morales',
  'Alejandra Vargas', 'Gabriela Herrera', 'Valentina Jiménez', 'Natalia Romero', 'Sofía Mendoza',
  'Andrea Reyes', 'Paola Gutiérrez', 'Mónica Díaz', 'Lorena Peña', 'Cristina Vega',
];

const NOMBRES_AUXILIARES = [
  'Roberto Silva', 'Carlos Muñoz', 'Diego Fuentes', 'Andrés Rojas', 'Felipe Navarro',
];

const NOMBRES_NINOS = [
  'Santiago', 'Mateo', 'Sebastián', 'Nicolás', 'Emilio', 'Lucas', 'Tomás', 'Benjamín',
  'Martín', 'Agustín', 'Valentina', 'Sofía', 'Isabella', 'Camila', 'Valeria', 'Luciana',
  'Renata', 'Antonella', 'Catalina', 'Mariana', 'Diego', 'Joaquín', 'Maximiliano', 'Rodrigo',
  'Ignacio', 'Cristóbal', 'Alejandro', 'Felipe', 'Andrés', 'Gabriel', 'Daniela', 'Fernanda',
  'Gabriela', 'Natalia', 'Paola', 'Andrea', 'Claudia', 'Verónica', 'Patricia', 'Carmen',
  'Samuel', 'David', 'Elías', 'Josué', 'Caleb', 'Ezequiel', 'Isaías', 'Jeremías',
  'Abigail', 'Rebeca', 'Raquel', 'Ester', 'Rut', 'Miriam', 'Débora', 'Ana',
  'Pablo', 'Pedro', 'Juan', 'Marcos', 'Lucas', 'Timoteo', 'Esteban', 'Bernabé',
  'Priscila', 'Lidia', 'Febe', 'Eunice', 'Lois', 'María', 'Marta', 'Salomé',
  'Héctor', 'Víctor', 'Óscar', 'Iván', 'Alexis', 'Cristian', 'Mauricio', 'Patricio',
];

const APELLIDOS = [
  'González', 'Rodríguez', 'López', 'Martínez', 'García', 'Pérez', 'Sánchez', 'Ramírez',
  'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Morales', 'Cruz',
];

function apellidoRandom() {
  return APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
}

// Fecha de nacimiento según grupo de edad
function fechaNacimientoParaGrupo(grupo: 'Cuna' | 'Preescolar' | 'PrimariaBaja' | 'PrimariaAlta'): string {
  const hoy = new Date();
  let edadMin: number, edadMax: number;
  if (grupo === 'Cuna')         { edadMin = 0;  edadMax = 2;  }
  else if (grupo === 'Preescolar')   { edadMin = 3;  edadMax = 5;  }
  else if (grupo === 'PrimariaBaja') { edadMin = 6;  edadMax = 10; }
  else                               { edadMin = 11; edadMax = 13; }

  const edadAnios = edadMin + Math.floor(Math.random() * (edadMax - edadMin + 1));
  const meses = Math.floor(Math.random() * 12);
  const dias = Math.floor(Math.random() * 28) + 1;
  const anio = hoy.getFullYear() - edadAnios;
  return `${anio}-${String(meses + 1).padStart(2, '0')}-${String(dias).padStart(2, '0')}`;
}

export default function DemoPage() {
  const router = useRouter();
  const { agregarPersonal } = usePersonalStore();
  const { agregarAlumno } = useAlumnosStore();
  const { salones, inicializarSalones, asignarMaestro, asignarAuxiliar } = useSalonesStore();
  const { agregarAsignacion } = useAgendaStore();

  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog((prev) => [...prev, msg]);
  }

  async function cargarDemo() {
    setCargando(true);
    setLog([]);

    // 1. Inicializar salones
    inicializarSalones();
    await new Promise((r) => setTimeout(r, 200));

    // Obtener salones actualizados
    const salonesActuales = useSalonesStore.getState().salones;
    if (salonesActuales.length === 0) {
      addLog('❌ No se pudieron crear los salones');
      setCargando(false);
      return;
    }
    addLog(`✅ ${salonesActuales.length} salones inicializados`);

    // 2. Crear 20 maestras (5 por salón)
    const maestrasCreadas: Personal[] = [];
    NOMBRES_MAESTRAS.forEach((nombre, i) => {
      const salonIdx = Math.floor(i / 5); // 5 maestras por salón
      const salon = salonesActuales[salonIdx];
      const maestra: Personal = {
        id: crypto.randomUUID(),
        nombreCompleto: nombre,
        rol: 'Maestro',
        telefono: `+569${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        email: `${nombre.toLowerCase().replace(/ /g, '.')}@ministerio.com`,
        salonesIds: salon ? [salon.id] : [],
      };
      agregarPersonal(maestra);
      maestrasCreadas.push(maestra);

      // Asignar primera maestra de cada grupo como maestra principal del salón
      if (i % 5 === 0 && salon) {
        asignarMaestro(salon.id, maestra.id);
      }
    });
    addLog(`✅ 20 maestras creadas y asignadas`);

    // 3. Crear 5 auxiliares
    const auxiliaresCreados: Personal[] = [];
    NOMBRES_AUXILIARES.forEach((nombre, i) => {
      const salon = salonesActuales[i % salonesActuales.length];
      const auxiliar: Personal = {
        id: crypto.randomUUID(),
        nombreCompleto: nombre,
        rol: 'Auxiliar',
        telefono: `+569${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        email: `${nombre.toLowerCase().replace(/ /g, '.')}@ministerio.com`,
        salonesIds: salon ? [salon.id] : [],
        maestroAsignadoId: maestrasCreadas[i * 5]?.id,
      };
      agregarPersonal(auxiliar);
      auxiliaresCreados.push(auxiliar);
      if (salon) asignarAuxiliar(salon.id, auxiliar.id);
    });
    addLog(`✅ 5 auxiliares creados`);

    // 4. Crear 80 niños (20 por salón)
    const grupos: Array<'Cuna' | 'Preescolar' | 'PrimariaBaja' | 'PrimariaAlta'> = ['Cuna', 'Preescolar', 'PrimariaBaja', 'PrimariaAlta'];
    let ninoIdx = 0;

    for (let g = 0; g < 4; g++) {
      const salon = salonesActuales[g];
      if (!salon) continue;

      for (let n = 0; n < 20; n++) {
        const nombre = NOMBRES_NINOS[ninoIdx % NOMBRES_NINOS.length];
        const apellido1 = apellidoRandom();
        const apellido2 = apellidoRandom();
        const apoderadoId = crypto.randomUUID();
        const alumnoId = crypto.randomUUID();

        const apoderado: Apoderado = {
          id: apoderadoId,
          nombreCompleto: `${apellido1} ${apellido2}`,
          relacion: n % 3 === 0 ? 'padre' : n % 3 === 1 ? 'madre' : 'tutor',
          telefono: `+569${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
          email: `apoderado${ninoIdx}@correo.com`,
        };

        const alumno: Alumno = {
          id: alumnoId,
          nombreCompleto: `${nombre} ${apellido1}`,
          fechaNacimiento: fechaNacimientoParaGrupo(grupos[g]),
          sexo: ninoIdx % 2 === 0 ? 'masculino' : 'femenino',
          salonId: salon.id,
          apoderadoId,
          fechaRegistro: new Date().toISOString(),
        };

        agregarAlumno(alumno, apoderado);
        ninoIdx++;
      }
    }
    addLog(`✅ 80 niños creados (20 por salón)`);

    // 5. Crear asignaciones de agenda para los próximos 2 domingos
    const domingos = proximosDomingos(2);
    const alumnosActuales = useAlumnosStore.getState().alumnos;

    for (const fecha of domingos) {
      for (const servicio of SERVICIOS_DOMINGO) {
        for (let g = 0; g < 4; g++) {
          const salon = salonesActuales[g];
          if (!salon) continue;

          // Rotar maestras por servicio
          const maestraIdx = (g * 5) + (SERVICIOS_DOMINGO.indexOf(servicio) % 5);
          const maestra = maestrasCreadas[maestraIdx];
          if (!maestra) continue;

          const alumnosSalon = alumnosActuales
            .filter((a) => a.salonId === salon.id)
            .map((a) => a.id);

          agregarAsignacion({
            id: crypto.randomUUID(),
            fecha,
            servicioId: servicio.id,
            salonId: salon.id,
            maestroId: maestra.id,
            auxiliaresIds: auxiliaresCreados[g] ? [auxiliaresCreados[g].id] : [],
            alumnosIds: alumnosSalon,
          });
        }
      }
    }
    addLog(`✅ Agenda creada para los próximos 2 domingos (4 servicios × 4 salones)`);

    await new Promise((r) => setTimeout(r, 300));
    setListo(true);
    setCargando(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#FFFDE7' }}>
      <div className="w-full max-w-md">
        <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-yellow-200 bg-white">
          <div className="px-6 py-6 text-center" style={{ background: '#F5C518' }}>
            <p className="text-4xl mb-2">🧪</p>
            <h1 className="text-xl font-extrabold" style={{ color: '#4a2c00' }}>Cargar Datos Demo</h1>
            <p className="text-sm mt-1" style={{ color: '#78350f' }}>
              20 maestras + 5 auxiliares + 80 niños + agenda
            </p>
          </div>

          <div className="px-6 py-6 space-y-4">
            {log.length > 0 && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 space-y-1">
                {log.map((l, i) => (
                  <p key={i} className="text-sm" style={{ color: '#4a2c00' }}>{l}</p>
                ))}
              </div>
            )}

            {!listo ? (
              <button
                onClick={cargarDemo}
                disabled={cargando}
                className="w-full py-3 rounded-xl font-bold text-sm transition-opacity disabled:opacity-50"
                style={{ background: '#F5C518', color: '#4a2c00' }}
              >
                {cargando ? 'Cargando datos...' : 'Cargar datos demo'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
                  <p className="text-green-700 font-bold text-sm">✅ Datos cargados exitosamente</p>
                </div>
                <button
                  onClick={() => router.push('/portal')}
                  className="w-full py-3 rounded-xl font-bold text-sm"
                  style={{ background: '#F5C518', color: '#4a2c00' }}
                >
                  Ir al Portal →
                </button>
              </div>
            )}

            <p className="text-xs text-center text-gray-400">
              ⚠️ Solo usar para pruebas. Los datos se guardan en localStorage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
