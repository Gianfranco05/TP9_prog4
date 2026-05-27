import type { Modalidad, Nivel } from '../types';

export class Participante {
  constructor(
    public id: number,
    public nombre: string,
    public email: string,
    public edad: number,
    public pais: string,
    public modalidad: Modalidad,
    public tecnologias: string[],
    public nivel: Nivel,
    public aceptaTerminos: boolean,
  ) {}
}