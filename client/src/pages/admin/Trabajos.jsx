// src/pages/admin/Trabajos.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const trabajosData = [
  { id: 1, cliente: "Ana Suárez",     servicio: "Sanjeo",     ubicacion: "Quilmes, GBA Sur",      profundidad: null, estado: "En ejecución", fechaInicio: "05/05/2026", fechaFin: "20/05/2026" },
  { id: 2, cliente: "Jorge Villalba", servicio: "Limpieza",   ubicacion: "Lanús, GBA Sur",         profundidad: null, estado: "En ejecución", fechaInicio: "08/05/2026", fechaFin: "10/05/2026" },
  { id: 3, cliente: "Roberto Díaz",   servicio: "Excavación", ubicacion: "Palermo, CABA",          profundidad: 4.5,  estado: "Finalizado",   fechaInicio: "20/04/2026", fechaFin: "28/04/2026" },
  { id: 4, cliente: "Carlos Méndez",  servicio: "Excavación", ubicacion: "Palermo, CABA",          profundidad: 3.0,  estado: "Aceptado",     fechaInicio: "15/05/2026", fechaFin: null         },
  { id: 5, cliente: "María Torres",   servicio: "Sanjeo",     ubicacion: "Morón, GBA Oeste",       profundidad: null, estado: "Presupuestado",fechaInicio: null,         fechaFin: null         },
  { id: 6, cliente: "Pablo Ríos",     servicio: "Excavación", ubicacion: "Lomas de Zamora, GBA",   profundidad: 6.0,  estado: "En garantía",  fechaInicio: "01/04/2026", fechaFin: "10/04/2026" },
  { id: 7, cliente: "Roberto Díaz",   servicio: "Limpieza",   ubicacion: "Flores, CABA",           profundidad: null, estado: "Cerrado",      fechaInicio: "15/03/2026", fechaFin: "16/03/2026" },
];

const estadoConfig = {
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280"  },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6"  },
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981"  },
  "Finalizado":    { bg: "#1a1a3a", text: "#8B5CF6"  },
  "En garantía":   { bg: "#2a2a1a", text: "#F59E0B"  },
  "Cerrado":       { bg: "#1a2a1a", text: "#34D399"  },
};

const estadoOptions = ["Presupuestado", "Aceptado", "En ejecución", "Finalizado", "En garantía", "Cerrado"];
const servicioOptions = ["Todos", "Excavación", "Sanjeo", "Limpieza"];

export default function Trabajos() {
  const navigate = useNavigate();
  const [data, setData] = useState(trabajosData);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroServicio, setFiltroServicio] = useState("Todos");

  const filtrados = data.filter((t) => {
    const matchEstado   = filtroEstado   === "Todos" || t.estado   === filtroEstado;
    const matchServicio = filtroServicio === "Todos" || t.servicio === filtroServicio;
    return matchEstado && matchServicio;
  });

  function cambiarEstado(id, nuevoEstado) {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Encabezado */}
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Trabajos
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Todos los trabajos y pozos registrados
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            background: "#1F2937", border: "1px solid #374151", borderRadius: "6px",
            color: "#fff", fontSize: "13px", padding: "7px 12px", cursor: "pointer",
          }}
        >
          <option value="Todos">Todos los estados</option>
          {estadoOptions.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>

        <select
          value={filtroServicio}
          onChange={(e) => setFiltroServicio(e.target.value)}
          style={{
            background: "#1F2937", border: "1px solid #374151", borderRadius: "6px",
            color: "#fff", fontSize: "13px", padding: "7px 12px", cursor: "pointer",
          }}
        >
          {servicioOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div style={{
        background: "#1F2937", border: "1px solid #374151",
        borderRadius: "10px", overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              {["Cliente", "Servicio", "Ubicación", "Prof.", "Estado", "Inicio", "Fin", ""].map((h) => (
                <th key={h} style={{
                  color: "#6B7280", fontSize: "11px", textAlign: "left",
                  padding: "10px 16px", textTransform: "uppercase",
                  letterSpacing: "0.05em", fontWeight: "600",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
                  No hay trabajos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              filtrados.map((t, i) => (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: i < filtrados.length - 1 ? "1px solid #374151" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#263244"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", color: "#fff", fontSize: "14px" }}>{t.cliente}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{t.servicio}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{t.ubicacion}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {t.profundidad ? `${t.profundidad}m` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={t.estado}
                      onChange={(e) => cambiarEstado(t.id, e.target.value)}
                      style={{
                        background: estadoConfig[t.estado]?.bg ?? "#1a1a1a",
                        color: estadoConfig[t.estado]?.text ?? "#fff",
                        border: "none", borderRadius: "999px",
                        fontSize: "12px", padding: "4px 10px",
                        cursor: "pointer", fontWeight: "500",
                      }}
                    >
                      {estadoOptions.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {t.fechaInicio ?? "—"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {t.fechaFin ?? "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => navigate(`/admin/trabajos/${t.id}`)}
                      style={{
                        background: "none", border: "1px solid #374151",
                        borderRadius: "6px", color: "#6B7280",
                        fontSize: "12px", padding: "5px 12px", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.color = "#F59E0B"; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#6B7280"; }}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}