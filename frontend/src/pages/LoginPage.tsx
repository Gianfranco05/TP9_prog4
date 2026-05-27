import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Custom Hook — recuerda el último usuario ingresado en localStorage
  const [username, setUsername] = useLocalStorage('ultimoUsuarioTP8', '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // useId — IDs accesibles para labels e inputs del login
  const usernameId = useId();
  const passwordId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/lista');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión';
      setError(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">
          Iniciar Sesión — Registro de Participantes
        </h1>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor={usernameId} className="mb-1 block text-sm font-medium text-slate-700">
              Usuario
            </label>
            <input
              id={usernameId}
              type="text"
              placeholder="Usuario"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-full border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor={passwordId} className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id={passwordId}
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
