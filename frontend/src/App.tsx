import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import PublicaPage from './pages/PublicaPage';
import ListaPage from './pages/ListaPage';
import FormularioPage from './pages/FormularioPage';
import EditarPage from './pages/EditarPage';
import CursosPage from './pages/CursosPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/publica" element={<PublicaPage />} />
      
      <Route path="/lista" element={
        <PrivateRoute>
          <ListaPage />
        </PrivateRoute>
      } />
      
      <Route path="/cursos" element={
        <PrivateRoute>
          <CursosPage />
        </PrivateRoute>
      } />
      
      <Route path="/nuevo" element={
        <PrivateRoute rol="ADMIN">
          <FormularioPage />
        </PrivateRoute>
      } />
      
      <Route path="/editar/:id" element={
        <PrivateRoute rol="ADMIN">
          <EditarPage />
        </PrivateRoute>
      } />
    </Routes>
  );
}