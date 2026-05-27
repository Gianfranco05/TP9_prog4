import { Link } from 'react-router-dom';

export default function PublicaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100">
      <div className="rounded-lg bg-white p-8 shadow text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Página Pública</h1>
        <p className="text-slate-500 mb-6">Esta página es accesible sin iniciar sesión.</p>
        <Link to="/login" className="rounded bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 transition">
          Ir al Login
        </Link>
      </div>
    </main>
  );
}