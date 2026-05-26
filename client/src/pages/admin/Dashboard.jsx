// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api"; 

const statsMock = [
  { label: "Leads nuevos",       value: "8",  sub: "Esta semana",        color: "#F59E0B" },
  { label: "Clientes activos",   value: "24", sub: "Total registrados",  color: "#10B981" },
  { label: "Trabajos en curso",  value: "5",  sub: "En ejecución",       color: "#3B82F6" },
  { label: "Trabajos cerrados",  value: "31", sub: "Historial total",    color: "#8B5CF6" },
];

const trabajosEnCursoMock = [
  { id: 1, cliente: "Carlos Méndez",  tipo: "Excavación", ubicacion: "Palermo, CABA",      estado: "En ejecución" },
  { id: 2, cliente: "Ana Suárez",     tipo: "Sanjeo",     ubicacion: "Quilmes, GBA Sur",   estado: "Aceptado"     },
  { id: 3, cliente: "Jorge Villalba", tipo: "Limpieza",   ubicacion: "Lanús, GBA Sur",     estado: "En ejecución" },
];

const estadoColor = {
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981" },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6" },
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(statsMock);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiFetch("/clientes/stats"); // Ajustá la ruta real cuando el backend la defina
        // Mapeo de los datos que devuelva la API al formato de las tarjetas
        setStats([
          { label: "Leads nuevos",       value: String(data.leadsNuevos ?? statsMock[0].value), sub: statsMock[0].sub, color: statsMock[0].color },
          { label: "Clientes activos",   value: String(data.clientesActivos ?? statsMock[1].value), sub: statsMock[1].sub, color: statsMock[1].color },
          { label: "Trabajos en curso",  value: String(data.trabajosEnCurso ?? statsMock[2].value), sub: statsMock[2].sub, color: statsMock[2].color },
          { label: "Trabajos cerrados",  value: String(data.trabajosCerrados ?? statsMock[3].value), sub: statsMock[3].sub, color: statsMock[3].color },
        ]);
      } catch {
        // Si falla, dejamos los mocks
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Encabezado */}
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Resumen general del negocio
        </p>
      </div>

      {/* KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "#1F2937",
            border: `1px solid #374151`,
            borderRadius: "10px",
            padding: "20px",
            borderLeft: `4px solid ${s.color}`,
            opacity: loadingStats ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}>
            <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </p>
            <p style={{ color: "#fff", fontSize: "32px", fontWeight: "bold", margin: "0 0 4px 0", lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ color: "#6B7280", fontSize: "12px", margin: 0 }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Trabajos en curso */}
      <div style={{
        background: "#1F2937",
        border: "1px solid #374151",
        borderRadius: "10px",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #374151",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "bold", margin: 0 }}>
            Trabajos en curso
          </h2>
          <button
            onClick={() => navigate("/admin/trabajos")}
            style={{
              background: "none",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#F59E0B",
              fontSize: "12px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Ver todos →
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              {["Cliente", "Tipo", "Ubicación", "Estado"].map((h) => (
                <th key={h} style={{
                  color: "#6B7280", fontSize: "11px", textAlign: "left",
                  padding: "10px 20px", textTransform: "uppercase", letterSpacing: "0.05em",
                  fontWeight: "600",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trabajosEnCursoMock.map((t, i, arr) => (
              <tr key={t.id}
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid #374151" : "none",
                  transition: "background 0.15s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#263244"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 20px", color: "#fff",    fontSize: "14px" }}>{t.cliente}</td>
                <td style={{ padding: "12px 20px", color: "#6B7280", fontSize: "14px" }}>{t.tipo}</td>
                <td style={{ padding: "12px 20px", color: "#6B7280", fontSize: "14px" }}>{t.ubicacion}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{
                    background: estadoColor[t.estado]?.bg ?? "#1a1a1a",
                    color: estadoColor[t.estado]?.text ?? "#fff",
                    fontSize: "12px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    fontWeight: "500",
                  }}>
                    {t.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}