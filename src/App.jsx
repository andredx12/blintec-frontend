import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import NovoPedidoPage from './pages/NovoPedidoPage';
import DetalhePedidoPage from './pages/DetalhePedidoPage';
import EstoquePage from './pages/EstoquePage';
import NovoRoloPage from './pages/NovoRoloPage';
import DashboardPage from './pages/DashboardPage';
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
        <Route path="/pedidos/:id" element={<DetalhePedidoPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/estoque/novo" element={<NovoRoloPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
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