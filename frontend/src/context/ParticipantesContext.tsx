import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import { Participante } from '../models/Participante';
import { participantesReducer } from '../reducers/participantesReducer';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API = `${API_URL}/participantes`;

interface ContextType {
  participantes: Participante[];
  participanteSeleccionado: Participante | null;
  agregar: (p: Participante) => Promise<void>;
  editar: (p: Participante) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => Promise<void>;
  seleccionar: (p: Participante | null) => void;
}

const ParticipantesContext = createContext<ContextType | null>(null);

function mapear(p: Participante): Participante {
  return new Participante(
    p.id,
    p.nombre,
    p.email,
    p.edad,
    p.pais,
    p.modalidad,
    Array.isArray(p.tecnologias) ? p.tecnologias : [],
    p.nivel,
    p.aceptaTerminos,
  );
}

export function ParticipantesProvider({ children }: { children: ReactNode }) {
  const [participantes, dispatch] = useReducer(participantesReducer, []);
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState<Participante | null>(null);
  const { user } = useAuth();

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.token ?? ''}`,
  });

  const leerError = async (res: Response, mensajePorDefecto: string) => {
    const data = await res.json().catch(() => null);
    return data?.detail || mensajePorDefecto;
  };

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET', payload: [] });
      return;
    }

    fetch(`${API}/`, { headers: authHeaders() })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await leerError(res, 'No se pudieron cargar los participantes'));
        }
        return res.json();
      })
      .then((data) => {
        const lista = Array.isArray(data) ? data.map(mapear) : [];
        dispatch({ type: 'GET_PARTICIPANTES', payload: lista });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: 'SET', payload: [] });
      });
  }, [user]);

  const agregar = async (p: Participante) => {
    const res = await fetch(`${API}/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(p),
    });

    if (!res.ok) {
      throw new Error(await leerError(res, 'No se pudo registrar el participante'));
    }

    const nuevo = await res.json();
    dispatch({ type: 'AGREGAR', payload: mapear(nuevo) });
  };

  const editar = async (p: Participante) => {
    const res = await fetch(`${API}/${p.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(p),
    });

    if (!res.ok) {
      throw new Error(await leerError(res, 'No se pudo actualizar el participante'));
    }

    const actualizado = await res.json();
    dispatch({ type: 'EDITAR', payload: mapear(actualizado) });
  };

  const eliminar = async (id: number) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este participante? Se hará un borrado lógico.');
    if (!confirmar) return;

    const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders() });

    if (!res.ok) {
      throw new Error(await leerError(res, 'No se pudo eliminar el participante'));
    }

    // En la base queda guardado con activo = false. En el estado local se quita de la lista visible.
    dispatch({ type: 'ELIMINAR', payload: id });
  };

  const resetear = async () => {
    const confirmar = window.confirm(
      '¿Seguro que querés resetear los datos? Los participantes actuales quedarán inactivos mediante borrado lógico.',
    );

    if (!confirmar) return;

    const res = await fetch(`${API}/resetear`, {
      method: 'POST',
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(await leerError(res, 'No se pudieron resetear los datos'));
    }

    // El backend ya marcó todos los participantes activos como inactivos.
    dispatch({ type: 'RESET', payload: [] });
  };

  const seleccionar = (p: Participante | null) => {
    setParticipanteSeleccionado(p);
  };

  return (
    <ParticipantesContext.Provider
      value={{ participantes, participanteSeleccionado, agregar, editar, eliminar, resetear, seleccionar }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
}

export function useParticipantes() {
  const ctx = useContext(ParticipantesContext);
  if (!ctx) throw new Error('useParticipantes debe usarse dentro de ParticipantesProvider');
  return ctx;
}
