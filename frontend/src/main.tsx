import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ParticipantesProvider } from './context/ParticipantesContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ParticipantesProvider>
          <App />
        </ParticipantesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);