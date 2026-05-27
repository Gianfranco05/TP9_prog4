import { useState, useMemo } from 'react';
import type { Participante } from '../models/Participante';
import type { Filtros } from '../types';

const filtrosIniciales: Filtros = { nombre: '', modalidad: 'Todas', nivel: 'Todos' };

export function useFiltros(participantes: Participante[]) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase().trim());
      const coincideNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel;
      const coincideModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad;
      return coincideNombre && coincideNivel && coincideModalidad;
    });
  }, [participantes, filtros]);

  const actualizarFiltros = (campo: keyof Filtros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor as Filtros[typeof campo] }));
  };

  const limpiarFiltros = () => setFiltros(filtrosIniciales);

  return { filtros, participantesFiltrados, actualizarFiltros, limpiarFiltros };
}