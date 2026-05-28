// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { normalizarEstado } from "../../utils/formatters";

const cardColors = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

const estadoBadge = {
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280" },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6" },
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981" },
  "Finalizado":    { bg: "#1a1a3a", text: "#8B5CF6" },
  "En garantía":   { bg: "#2a2a1a", text: "#F59E0B" },
  "Cerrado":       { bg: "#1a2a1a", text: "#34D399" },
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);         // null = cargando
  const [trabajos, setTrabajos] = useState(null);   // null = cargando
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function fetchData() {
      try {
        // 1. Obtener estadísticas
        const dataStats = await apiFetch("/dashboard/stats");
        if (cancelado) return;

        const tarjetas = [
          { label: "Leads nuevos",       value: dataStats.leadsNuevos       ?? 0 },
          { label: "Clientes activos",   value: dataStats.clientesActivos   ?? 0 },
          { label: "Trabajos en curso",  value: dataStats.trabajosEnCurso  ?? 0 },
          { label: "Trabajos cerrados",  value: dataStats.trabajosCerrados ?? 0 },
        ].map((item, idx) => ({
          ...item,
          sub: item.label === "Leads nuevos" ? "Esta semana" :
               item.label === "Clientes activos" ? "Total registrados" :
               item.label === "Trabajos en curso" ? "En ejecución" : "Historial total",
          color: cardColors[idx],
        }));

        setStats(tarjetas);

        // 2. Obtener trabajos en curso
        const dataTrabajos = await apiFetch("/trabajos");
        if (cancelado) return;

        const enCurso = Array.isArray(dataTrabajos.data)
          ? dataTrabajos.data
              .map(t => ({ ...t, estado: normalizarEstado(t.estado) }))
              .filter(t => t.estado === "En ejecución" || t.estado === "Aceptado")
          : [];

        setTrabajos(enCurso);
        setError("");
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError("No se pudieron cargar los datos del panel.");
        }
      }
    }

    fetchData();

    return () => {
      cancelado = true;
    };
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

      {/* Mensaje de error global */}
      {error && (
        <div style={{
          background: "#2a1a1a", border: "1px solid #EF4444",
          borderRadius: "6px", color: "#EF4444", padding: "12px 16px", fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      {/* KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
      }}>
        {stats === null ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              background: "#1F2937", border: "1px solid #374151",
              borderRadius: "10px", padding: "20px", opacity: 0.5,
            }}>
              <div style={{ background: "#374151", height: 12, width: "60%", borderRadius: 4, marginBottom: 12 }} />
              <div style={{ background: "#374151", height: 28, width: "40%", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ background: "#374151", height: 10, width: "50%", borderRadius: 4 }} />
            </div>
          ))
        ) : (
          stats.map((s) => (
            <div key={s.label} style={{
              background: "#1F2937",
              border: `1px solid #374151`,
              borderRadius: "10px",
              padding: "20px",
              borderLeft: `4px solid ${s.color}`,
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
          ))
        )}
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

        {trabajos === null ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
            Cargando trabajos...
          </div>
        ) : trabajos.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
            No hay trabajos en curso.
          </div>
        ) : (
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
              {trabajos.map((t, i, arr) => (
                <tr key={t.id}
                  style={{
                    borderBottom: i < arr.length - 1 ? "1px solid #374151" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#263244"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 20px", color: "#fff", fontSize: "14px" }}>
                    {t.cliente_nombre ?? t.cliente ?? "—"}
                  </td>
                  <td style={{ padding: "12px 20px", color: "#6B7280", fontSize: "14px" }}>
                    {t.tipo_servicio ?? "—"}
                  </td>
                  <td style={{ padding: "12px 20px", color: "#6B7280", fontSize: "14px" }}>
                    {t.ubicacion}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{
                      background: estadoBadge[t.estado]?.bg ?? "#1a1a1a",
                      color: estadoBadge[t.estado]?.text ?? "#fff",
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
        )}
      </div>
    </div>
  );
}