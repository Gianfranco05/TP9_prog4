import { useNavigate } from 'react-router-dom';
import Formulario from '../components/Formulario';
import ParticipantesTabs from '../components/ParticipantesTabs';
import { useAuth } from '../context/AuthContext';

export default function FormularioPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 sm:px-6">
        <header className="rounded-lg bg-green-500 px-6 py-5 text-white shadow">
          <h1 className="text-center text-3xl font-bold">Nuevo Participante</h1>
        </header>

        <nav className="rounded-lg bg-white px-4 pt-4 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ParticipantesTabs />

            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-500">
                Sesión: <strong>{user?.username}</strong> · Rol: <strong>{user?.rol}</strong>
              </span>

              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-5 py-2 font-medium text-white shadow transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </nav>

        <Formulario onSuccess={() => navigate('/lista')} />
      </div>
    </main>
  );
}