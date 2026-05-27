import { useNavigate } from 'react-router-dom';
import { Participante } from '../models/Participante';
import { useParticipantes } from '../context/ParticipantesContext';
import { useAuth } from '../context/AuthContext';

const nivelStyles: Record<Participante['nivel'], string> = {
  Principiante: 'bg-green-100 border-green-200',
  Intermedio: 'bg-yellow-100 border-yellow-200',
  Avanzado: 'bg-red-100 border-red-200',
};

const textoNivelStyles: Record<Participante['nivel'], string> = {
  Principiante: 'text-green-700',
  Intermedio: 'text-yellow-700',
  Avanzado: 'text-red-700',
};

export default function ParticipanteCard({ participante }: { participante: Participante }) {
  const { eliminar } = useParticipantes();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <article className={`rounded-lg border p-4 shadow transition hover:shadow-lg ${nivelStyles[participante.nivel]}`}>
      <h3 className="text-lg font-bold">{participante.nombre} — {participante.edad} años</h3>
      <p className="mt-1 text-sm text-slate-700">{participante.pais}</p>
      <p className="mt-2 text-sm"><span className="font-semibold">Modalidad:</span> {participante.modalidad}</p>
      <p className={`mt-1 text-sm font-semibold ${textoNivelStyles[participante.nivel]}`}>
        Nivel: {participante.nivel}
      </p>
      <p className="mt-1 text-sm text-slate-700">{participante.tecnologias.join(' - ')}</p>
      <p className={`mt-1 text-sm font-bold ${textoNivelStyles[participante.nivel]}`}>
        Perfil {participante.nivel}
      </p>

      {user?.rol === 'ADMIN' && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/editar/${participante.id}`)}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => eliminar(participante.id)}
            className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      )}
    </article>
  );
}