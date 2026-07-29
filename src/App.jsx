import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import NovoPedidoPage from './pages/NovoPedidoPage';
import PedidosPage from './pages/PedidosPage';
import Layout from './components/Layout';

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return null;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >
        <Route path="/" element={<PedidosPage />} />
        <Route path="/pedidos/novo" element={<NovoPedidoPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;