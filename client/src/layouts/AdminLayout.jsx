import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard",         label: "Dashboard" },
  { to: "/admin/gestion-contactos", label: "Contactos" },
  { to: "/admin/trabajos",          label: "Trabajos" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  // Estado para controlar el menú en celulares
  const [menuAbierto, setMenuAbierto] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  return (
    // md:flex-row permite que en escritorio estén uno al lado del otro, y en móvil apilados
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-bg">
      
      {/* Header Mobile (Solo visible en pantallas pequeñas) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-brand-surface border-b border-brand-border">
        <p className="text-brand-accent font-bold text-base m-0">El Topo Porteño</p>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="text-white text-2xl bg-transparent border-none cursor-pointer"
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <aside 
        className={`${
          menuAbierto ? "flex" : "hidden"
        } md:flex w-full md:w-55 bg-brand-surface p-6 flex-col gap-2 shrink-0 border-b md:border-b-0 md:border-r border-brand-border`}
      >
        <p className="hidden md:block text-brand-accent font-bold text-base mb-4">
          El Topo Porteño
        </p>

        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMenuAbierto(false)} // Cierra el menú al navegar en móvil
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
          className="mt-4 md:mt-auto bg-transparent border border-brand-border text-brand-muted rounded-md px-3 py-2 cursor-pointer text-sm text-left hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido (w-full y overflow-x-hidden evitan que la pantalla se desborde horizontalmente) */}
      <main className="flex-1 p-4 md:p-8 text-white w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}