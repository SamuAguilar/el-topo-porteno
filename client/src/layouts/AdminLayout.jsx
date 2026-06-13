import { Outlet, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard",         label: "Dashboard" },
  { to: "/admin/gestion-contactos", label: "Contactos" },
  { to: "/admin/trabajos",          label: "Trabajos" },
  { to: "/admin/configuracion",     label: "Configuración" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Sidebar */}
      <aside className="w-55 bg-brand-surface p-6 flex flex-col gap-2 shrink-0">
        <p className="text-brand-accent font-bold text-base mb-4">
          El Topo Porteño
        </p>

        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${
                isActive
                  ? "text-brand-accent bg-brand-border"
                  : "text-white bg-transparent"
              } no-underline px-3 py-2 rounded-md text-sm transition-colors`
            }
          >
            {label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto bg-transparent border border-brand-border text-brand-muted rounded-md px-3 py-2 cursor-pointer text-sm text-left hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 text-white">
        <Outlet />
      </main>
    </div>
  );
}