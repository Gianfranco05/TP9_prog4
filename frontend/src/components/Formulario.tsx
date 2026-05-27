import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useRef, useId } from 'react';
import type { Modalidad, Nivel } from '../types';
import type { FormularioParticipanteData } from '../types';
import { Participante } from '../models/Participante';
import { useParticipantes } from '../context/ParticipantesContext';

interface FormularioProps {
  onSuccess: () => void;
}

const datosIniciales: FormularioParticipanteData = {
  nombre: '',
  email: '',
  edad: '',
  pais: 'Argentina',
  modalidad: 'Presencial',
  tecnologias: [],
  nivel: 'Principiante',
  aceptaTerminos: false,
};

const paises = ['Argentina', 'Chile', 'Uruguay', 'México', 'España'];
const modalidades: Modalidad[] = ['Presencial', 'Virtual', 'Híbrido'];
const tecnologiasDisponibles = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'];
const niveles: Nivel[] = ['Principiante', 'Intermedio', 'Avanzado'];

export default function Formulario({ onSuccess }: FormularioProps) {
  const { agregar, editar, participanteSeleccionado, seleccionar } = useParticipantes();
  const [datos, setDatos] = useState<FormularioParticipanteData>(datosIniciales);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // useRef: foco automático en el input Nombre.
  const nombreRef = useRef<HTMLInputElement>(null);

  // useId: identificadores accesibles para labels, inputs, selects, checkbox y radio buttons.
  const nombreId = useId();
  const emailId = useId();
  const edadId = useId();
  const paisId = useId();
  const nivelId = useId();
  const terminosId = useId();
  const modalidadBaseId = useId();
  const tecnologiaBaseId = useId();

  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  useEffect(() => {
    if (participanteSeleccionado) {
      setDatos({
        nombre: participanteSeleccionado.nombre,
        email: participanteSeleccionado.email,
        edad: String(participanteSeleccionado.edad),
        pais: participanteSeleccionado.pais,
        modalidad: participanteSeleccionado.modalidad,
        tecnologias: participanteSeleccionado.tecnologias,
        nivel: participanteSeleccionado.nivel,
        aceptaTerminos: participanteSeleccionado.aceptaTerminos,
      });
      setTimeout(() => nombreRef.current?.focus(), 0);
    } else {
      setDatos(datosIniciales);
    }
  }, [participanteSeleccionado]);

  const onChange = (campo: keyof FormularioParticipanteData, valor: string | boolean | string[]) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const manejarTecnologias = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const nuevas = checked
      ? [...datos.tecnologias, value]
      : datos.tecnologias.filter((tecnologia) => tecnologia !== value);
    onChange('tecnologias', nuevas);
  };

  const validar = () => {
    if (!datos.nombre.trim()) return 'Debe ingresar el nombre.';
    if (!datos.email.trim()) return 'Debe ingresar el email.';
    if (!datos.edad || Number(datos.edad) <= 0) return 'Debe ingresar una edad válida.';
    if (datos.tecnologias.length === 0) return 'Debe seleccionar al menos una tecnología.';
    if (!datos.aceptaTerminos) return 'Debe aceptar los términos y condiciones.';
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setEnviando(true);
    setError('');

    try {
      if (participanteSeleccionado) {
        const actualizado = new Participante(
          participanteSeleccionado.id,
          datos.nombre.trim(),
          datos.email.trim(),
          Number(datos.edad),
          datos.pais,
          datos.modalidad,
          datos.tecnologias,
          datos.nivel,
          datos.aceptaTerminos,
        );
        await editar(actualizado);
        seleccionar(null);
      } else {
        const nuevo = new Participante(
          0,
          datos.nombre.trim(),
          datos.email.trim(),
          Number(datos.edad),
          datos.pais,
          datos.modalidad,
          datos.tecnologias,
          datos.nivel,
          datos.aceptaTerminos,
        );
        await agregar(nuevo);
      }

      setDatos(datosIniciales);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el participante';
      setError(message);
    } finally {
      setEnviando(false);
    }
  };

  const editando = participanteSeleccionado !== null;

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">
        {editando ? 'Editar participante' : 'Formulario de inscripción'}
      </h2>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={nombreId} className="mb-1 block text-sm font-medium">Nombre</label>
          <input
            id={nombreId}
            ref={nombreRef}
            type="text"
            value={datos.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            placeholder="Nombre"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor={emailId} className="mb-1 block text-sm font-medium">Email</label>
          <input
            id={emailId}
            type="email"
            value={datos.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Email"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor={edadId} className="mb-1 block text-sm font-medium">Edad</label>
          <input
            id={edadId}
            type="number"
            min="1"
            value={datos.edad}
            onChange={(e) => onChange('edad', e.target.value)}
            placeholder="Edad"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor={paisId} className="mb-1 block text-sm font-medium">País</label>
          <select
            id={paisId}
            value={datos.pais}
            onChange={(e) => onChange('pais', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          >
            {paises.map((pais) => <option key={pais} value={pais}>{pais}</option>)}
          </select>
        </div>

        <fieldset className="md:col-span-2">
          <legend className="mb-2 block text-sm font-medium">Modalidad</legend>
          <div className="flex flex-wrap gap-4">
            {modalidades.map((modalidad) => {
              const modalidadId = `${modalidadBaseId}-${modalidad}`;
              return (
                <div key={modalidad} className="flex items-center gap-2 text-sm">
                  <input
                    id={modalidadId}
                    type="radio"
                    name="modalidad"
                    value={modalidad}
                    checked={datos.modalidad === modalidad}
                    onChange={(e) => onChange('modalidad', e.target.value)}
                  />
                  <label htmlFor={modalidadId}>{modalidad}</label>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="md:col-span-2">
          <legend className="mb-2 block text-sm font-medium">Tecnologías conocidas</legend>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {tecnologiasDisponibles.map((tecnologia) => {
              const tecnologiaId = `${tecnologiaBaseId}-${tecnologia}`;
              return (
                <div key={tecnologia} className="flex items-center gap-2 text-sm">
                  <input
                    id={tecnologiaId}
                    type="checkbox"
                    value={tecnologia}
                    checked={datos.tecnologias.includes(tecnologia)}
                    onChange={manejarTecnologias}
                  />
                  <label htmlFor={tecnologiaId}>{tecnologia}</label>
                </div>
              );
            })}
          </div>
        </fieldset>

        <div className="md:col-span-2">
          <label htmlFor={nivelId} className="mb-1 block text-sm font-medium">Nivel de experiencia</label>
          <select
            id={nivelId}
            value={datos.nivel}
            onChange={(e) => onChange('nivel', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          >
            {niveles.map((nivel) => <option key={nivel} value={nivel}>{nivel}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-sm">
            <input
              id={terminosId}
              type="checkbox"
              checked={datos.aceptaTerminos}
              onChange={(e) => onChange('aceptaTerminos', e.target.checked)}
            />
            <label htmlFor={terminosId}>Acepto los términos y condiciones del evento</label>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={enviando}
            className={`rounded px-4 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${editando ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {enviando ? 'Guardando...' : editando ? 'Actualizar participante' : 'Registrar participante'}
          </button>
        </div>
      </form>
    </section>
  );
}
