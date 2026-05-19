import { createBrowserRouter, RouterProvider} from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Páginas públicas
import Home from "../pages/public/Home";

// Páginas admin
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import GestionContactos from "../pages/admin/GestionContactos";
import ClienteDetalle from "../pages/admin/ClienteDetalle";
import Trabajos from "../pages/admin/Trabajos";
import TrabajoDetalle from "../pages/admin/TrabajoDetalle";
import Configuracion from "../pages/admin/Configuracion";

const router = createBrowserRouter([
  // ── Rutas públicas ────────────────────────────────────────────
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },

  // ── Login (sin layout) ────────────────────────────────────────
  {
    path: "/admin",
    element: <Login />,
  },

  // ── Rutas del panel admin ─────────────────────────────────────
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard",              element: <Dashboard /> },
      { path: "gestion-contactos",      element: <GestionContactos /> },
      { path: "clientes/:id",           element: <ClienteDetalle /> },
      { path: "trabajos",               element: <Trabajos /> },
      { path: "trabajos/:id",           element: <TrabajoDetalle /> },
      { path: "configuracion",          element: <Configuracion /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
