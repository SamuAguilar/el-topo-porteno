import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

// Protección de rutas
import ProtectedRoute from "../components/auth/ProtectedRoute";

const router = createBrowserRouter([
  // ── Rutas públicas ─────────────────────────────────────────
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },

  // ── Login (público) ────────────────────────────────────────
  {
    path: "/admin/login",
    element: <Login />,
  },

  // ── Panel admin (protegido) ────────────────────────────────
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },             // /admin → dashboard
      { path: "dashboard", element: <Dashboard /> },
      { path: "gestion-contactos", element: <GestionContactos /> },
      { path: "clientes/:id", element: <ClienteDetalle /> },
      { path: "trabajos", element: <Trabajos /> },
      { path: "trabajos/:id", element: <TrabajoDetalle /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}