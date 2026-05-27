import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useParticipantes } from '../context/ParticipantesContext';
import Formulario from '../components/Formulario';

export default function EditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { participantes, seleccionar } = useParticipantes();

  useEffect(() => {
    const participante = participantes.find((p) => p.id === Number(id));
    if (participante) {
      seleccionar(participante);
    }
    return () => {
      seleccionar(null);
    };
  }, [id, participantes]);

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 sm:px-6">
        <header className="rounded-lg bg-yellow-500 px-6 py-5 text-white shadow">
          <h1 className="text-center text-3xl font-bold">Editar Participante</h1>
        </header>

        <div>
          <Link to="/lista" className="text-sm text-blue-600 hover:underline">
             ← Volver al listado
          </Link>
        </div>

        <Formulario onSuccess={() => navigate('/lista')} />
      </div>
    </main>
  );
}