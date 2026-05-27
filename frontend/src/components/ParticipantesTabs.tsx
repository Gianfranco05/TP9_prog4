import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const baseTabClass = 'rounded-t-lg border border-b-0 px-5 py-2 text-sm font-semibold transition';
const inactiveTabClass = 'border-slate-200 bg-slate-200 text-slate-600 hover:bg-white hover:text-blue-700';
const activeTabClass = 'border-blue-600 bg-white text-blue-700 shadow-sm';

export default function ParticipantesTabs() {
  const { user } = useAuth();

  const getTabClass = ({ isActive }: { isActive: boolean }) =>
    `${baseTabClass} ${isActive ? activeTabClass : inactiveTabClass}`;

  return (
    <div className="flex flex-wrap items-end gap-2 border-b border-slate-300">
      <NavLink to="/lista" className={getTabClass}>
        Lista de participantes
      </NavLink>

      {/* NUEVA PESTAÑA AQUI */}
      <NavLink to="/cursos" className={getTabClass}>
        Cursos (Mercado Pago)
      </NavLink>

      {user?.rol === 'ADMIN' && (
        <NavLink to="/nuevo" className={getTabClass}>
          Nuevo participante
        </NavLink>
      )}
    </div>
  );
}
