import { Outlet, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard",     label: "Dashboard" },
  { to: "/admin/leads",         label: "Leads" },
  { to: "/admin/clientes",      label: "Clientes" },
  { to: "/admin/trabajos",      label: "Trabajos" },
  { to: "/admin/configuracion", label: "Configuración" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    // Lógica de logout
    navigate("/admin");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B0B0B" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px", background: "#1F2937", padding: "24px 16px",
        display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0
      }}>
        <p style={{ color: "#F59E0B", fontWeight: "bold", fontSize: "16px", marginBottom: "16px" }}>
          El Topo Porteño
        </p>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              color: isActive ? "#F59E0B" : "#fff",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              background: isActive ? "#374151" : "transparent",
              fontSize: "14px",
            })}
          >
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto", background: "none", border: "1px solid #374151",
            color: "#6B7280", borderRadius: "6px", padding: "8px 12px",
            cursor: "pointer", fontSize: "14px", textAlign: "left"
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, padding: "32px", color: "#fff" }}>
        <Outlet />
      </main>
    </div>
  );
}
