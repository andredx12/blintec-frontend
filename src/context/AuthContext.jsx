import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('blintec_token');
    if (!token) {
      setCarregando(false);
      return;
    }

    api.get('/auth/me')
      .then((response) => setUsuario(response.data))
      .catch(() => localStorage.removeItem('blintec_token'))
      .finally(() => setCarregando(false));
  }, []);

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, nome, perfil } = response.data;

    localStorage.setItem('blintec_token', token);
    setUsuario({ nome, perfil });
  }

  function logout() {
    localStorage.removeItem('blintec_token');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}