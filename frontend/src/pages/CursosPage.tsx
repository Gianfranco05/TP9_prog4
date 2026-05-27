import { useState } from 'react';
import ParticipantesTabs from '../components/ParticipantesTabs';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Curso {
  id: number;
  titulo: string;
  precio: number;
}

const cursos: Curso[] = [
  { id: 1, titulo: "Curso React", precio: 250 },
  { id: 2, titulo: "Curso DBA", precio: 400 },
  { id: 3, titulo: "Curso Python Básico", precio: 300 },
  { id: 4, titulo: "Curso Java SpringBoot", precio: 350 },
  { id: 5, titulo: "Curso Node.js y Express", precio: 280 },
  { id: 6, titulo: "Curso Ciberseguridad", precio: 450 },
];

export default function CursosPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<number | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const comprarCurso = async (curso: Curso) => {
    setLoading(curso.id);
    try {
      const res = await fetch(`http://localhost:8000/pagos/crear-preferencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token ?? ''}`,
        },
        body: JSON.stringify({ titulo: curso.titulo, precio: curso.precio })
      });

      if (!res.ok) throw new Error('Error al generar el pago');
      const data = await res.json();

      // Redirección nativa de Checkout Pro hacia el init_point
      window.location.href = data.init_point;
    } catch (error) {
      console.error(error);
      alert("Hubo un error al conectar con Mercado Pago.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <header className="rounded-lg bg-indigo-600 px-6 py-5 text-white shadow">
          <h1 className="text-center text-3xl font-bold">Catálogo de Cursos</h1>
          <p className="mt-2 text-center text-sm sm:text-base">TP 9 · Integración Mercado Pago</p>
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

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map(curso => (
            <article key={curso.id} className="flex flex-col items-center rounded-lg border bg-white p-6 shadow transition hover:shadow-lg">
              <h3 className="text-xl font-bold text-slate-800">{curso.titulo}</h3>
              <p className="mt-4 text-3xl font-semibold text-green-600">${curso.precio.toLocaleString('es-AR')}</p>
              <button
                onClick={() => comprarCurso(curso)}
                disabled={loading === curso.id}
                className="mt-6 w-full rounded bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading === curso.id ? 'Cargando Checkout...' : 'QUIERO ESTE CURSO'}
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}