export type Modalidad = 'Presencial' | 'Virtual' | 'Híbrido';
export type Nivel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Filtros {
  nombre: string;
  modalidad: 'Todas' | Modalidad;
  nivel: 'Todos' | Nivel;
}

export interface FormularioParticipanteData {
  nombre: string;
  email: string;
  edad: string;
  pais: string;
  modalidad: Modalidad;
  tecnologias: string[];
  nivel: Nivel;
  aceptaTerminos: boolean;
}