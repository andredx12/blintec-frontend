import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const ITENS_MENU = [
  { rota: '/', label: 'Pedidos' },
  { rota: '/estoque', label: 'Estoque' },
  { rota: '/dashboard', label: 'Dashboard' },
];

function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Blintec</div>

        <nav className="sidebar-nav">
          {ITENS_MENU.map((item) => (
            <NavLink
              key={item.rota}
              to={item.rota}
              end={item.rota === '/'}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-user">
            <span className="topbar-user-name">{usuario?.nome}</span>
            <span className="topbar-user-perfil">{usuario?.perfil}</span>
          </div>
          <button className="topbar-logout" onClick={logout}>
            Sair
          </button>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;