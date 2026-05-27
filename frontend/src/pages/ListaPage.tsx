import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParticipantes } from '../context/ParticipantesContext';
import { useAuth } from '../context/AuthContext';
import { useFiltros } from '../hooks/useFiltros';
import Filtros from '../components/Filtros';
import ParticipanteCard from '../components/ParticipanteCard';
import ParticipantesTabs from '../components/ParticipantesTabs';

export default function ListaPage() {
  const { participantes, resetear } = useParticipantes();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Custom Hook — reemplaza el estado manual de filtros
  const { filtros, participantesFiltrados, actualizarFiltros, limpiarFiltros } = useFiltros(participantes);

  // useRef — referencia a la sección de filtros para enfocar con Ctrl+B
  const filtrosRef = useRef<HTMLDivElement>(null);

  // Ctrl+B enfoca el primer input de la sección filtros
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        filtrosRef.current?.scrollIntoView({ behavior: 'smooth' });
        const primerInput = filtrosRef.current?.querySelector('input');
        primerInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <header className="rounded-lg bg-green-500 px-6 py-5 text-white shadow">
          <h1 className="text-center text-3xl font-bold">Registro de Participantes</h1>
          <p className="mt-2 text-center text-sm sm:text-base">TP 8 · useRef + useId + Custom Hooks</p>
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

        <p className="text-xs text-slate-400">
          Presioná{' '}
          <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 text-slate-600">Ctrl+B</kbd>
          {' '}para enfocar los filtros
        </p>

        <div ref={filtrosRef}>
          <Filtros
            filtros={filtros}
            onChange={actualizarFiltros}
            onClear={limpiarFiltros}
            onReset={resetear}
            totalFiltrados={participantesFiltrados.length}
            totalGeneral={participantes.length}
          />
        </div>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Lista de participantes</h2>
          {participantesFiltrados.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">
              No hay participantes
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {participantesFiltrados.map((p) => (
                <ParticipanteCard key={p.id} participante={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}