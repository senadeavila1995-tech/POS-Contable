import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Panel Admin</h3>

       <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/categorias"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        Categorías
      </NavLink>

      <NavLink
        to="/clientes"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        Clientes
      </NavLink>

      <NavLink
        to="/productos"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        Productos
      </NavLink>

      <NavLink
        to="/ventas"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        Ventas (POS)
      </NavLink>

      <button className="sidebar-logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}
