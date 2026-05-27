import { createContext, useContext, useState, type ReactNode } from 'react';

type Rol = 'ADMIN' | 'CONSULTA';

interface Usuario {
  username: string;
  rol: Rol;
  token: string;
}

interface AuthContextType {
  user: Usuario | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || 'Credenciales incorrectas');
    }

    const data = await res.json();
    const usuario: Usuario = {
      username: data.username,
      rol: data.rol,
      token: data.token,
    };
    setUser(usuario);
    localStorage.setItem('user', JSON.stringify(usuario));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
