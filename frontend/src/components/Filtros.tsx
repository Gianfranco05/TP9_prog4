import { useId } from 'react';
import type { Filtros as FiltrosType } from '../types';
import { useAuth } from '../context/AuthContext';

interface FiltrosProps {
  filtros: FiltrosType;
  onChange: (campo: keyof FiltrosType, valor: string) => void;
  onClear: () => void;
  onReset: () => void;
  totalFiltrados: number;
  totalGeneral: number;
}

export default function Filtros({ filtros, onChange, onClear, onReset, totalFiltrados, totalGeneral }: FiltrosProps) {
  const { user } = useAuth();

  // useId — IDs accesibles para conectar labels con inputs/selects de filtros
  const nombreFiltroId = useId();
  const modalidadFiltroId = useId();
  const nivelFiltroId = useId();

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Filtros de búsqueda</h2>
          <p className="mt-1 text-sm text-slate-500">
            Mostrando {totalFiltrados} de {totalGeneral} participantes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClear}
            className="rounded bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Limpiar filtros
          </button>
          {user?.rol === 'ADMIN' && (
            <button
              type="button"
              onClick={onReset}
              className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Resetear datos
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor={nombreFiltroId} className="mb-1 block text-sm font-medium">Buscar por nombre</label>
          <input
            id={nombreFiltroId}
            type="text"
            value={filtros.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            placeholder="Buscar"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor={modalidadFiltroId} className="mb-1 block text-sm font-medium">Filtrar por modalidad</label>
          <select
            id={modalidadFiltroId}
            value={filtros.modalidad}
            onChange={(e) => onChange('modalidad', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          >
            <option value="Todas">Todas</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label htmlFor={nivelFiltroId} className="mb-1 block text-sm font-medium">Filtrar por nivel</label>
          <select
            id={nivelFiltroId}
            value={filtros.nivel}
            onChange={(e) => onChange('nivel', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
          >
            <option value="Todos">Todos</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>
    </section>
  );
}
