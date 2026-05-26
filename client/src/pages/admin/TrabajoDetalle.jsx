// src/pages/admin/TrabajoDetalle.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

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

// Genera un historial de ejemplo basado en el estado actual
function generarHistorial(trabajo) {
  const base = [
    { fecha: trabajo.fechaInicio ?? "—", descripcion: "Trabajo creado", estado: "Presupuestado" },
  ];
  if (trabajo.estado === "Aceptado" || trabajo.estado === "En ejecución" || trabajo.estado === "Finalizado" || trabajo.estado === "En garantía" || trabajo.estado === "Cerrado") {
    base.push({ fecha: "—", descripcion: "Presupuesto aceptado", estado: "Aceptado" });
  }
  if (trabajo.estado === "En ejecución" || trabajo.estado === "Finalizado" || trabajo.estado === "En garantía" || trabajo.estado === "Cerrado") {
    base.push({ fecha: "—", descripcion: "Trabajo iniciado", estado: "En ejecución" });
  }
  if (trabajo.estado === "Finalizado" || trabajo.estado === "En garantía" || trabajo.estado === "Cerrado") {
    base.push({ fecha: trabajo.fechaFin ?? "—", descripcion: "Trabajo finalizado", estado: "Finalizado" });
  }
  if (trabajo.estado === "En garantía") {
    base.push({ fecha: "—", descripcion: "Entró en garantía", estado: "En garantía" });
  }
  if (trabajo.estado === "Cerrado") {
    base.push({ fecha: "—", descripcion: "Garantía cumplida, cerrado", estado: "Cerrado" });
  }
  return base;
}

export default function TrabajoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trabajo = trabajosData.find((t) => t.id === parseInt(id));
  const [estadoActual, setEstadoActual] = useState(trabajo?.estado ?? "");
  const [historial, setHistorial] = useState(trabajo ? generarHistorial({...trabajo, estado: estadoActual}) : []);

  if (!trabajo) {
    return (
      <div style={{ color: "#6B7280", padding: "32px", textAlign: "center" }}>
        <p>Trabajo no encontrado.</p>
        <button onClick={() => navigate("/admin/trabajos")} style={{ color: "#F59E0B", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
          ← Volver a Trabajos
        </button>
      </div>
    );
  }

  function cambiarEstado(nuevoEstado) {
    const hoy = new Date().toLocaleDateString("es-AR");
    setEstadoActual(nuevoEstado);
    setHistorial((prev) => [
      ...prev,
      { fecha: hoy, descripcion: `Estado cambiado a ${nuevoEstado}`, estado: nuevoEstado },
    ]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <button
        onClick={() => navigate("/admin/trabajos")}
        style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "13px", padding: 0, width: "fit-content" }}
      >
        ← Volver a Trabajos
      </button>

      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          {trabajo.cliente} — {trabajo.servicio}
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          ID: {trabajo.id}
        </p>
      </div>

      {/* Datos generales */}
      <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", padding: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Cliente",         value: trabajo.cliente },
          { label: "Servicio",        value: trabajo.servicio },
          { label: "Ubicación",       value: trabajo.ubicacion },
          { label: "Profundidad",     value: trabajo.profundidad ? `${trabajo.profundidad}m` : "—" },
          { label: "Fecha inicio",    value: trabajo.fechaInicio ?? "—" },
          { label: "Fecha fin",       value: trabajo.fechaFin ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
            <span style={{ color: "#fff", fontSize: "14px" }}>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Estado</span>
          <select
            value={estadoActual}
            onChange={(e) => cambiarEstado(e.target.value)}
            style={{
              background: estadoConfig[estadoActual]?.bg ?? "#1a1a1a",
              color: estadoConfig[estadoActual]?.text ?? "#fff",
              border: "none", borderRadius: "999px",
              fontSize: "12px", padding: "4px 10px",
              cursor: "pointer", fontWeight: "500",
              width: "fit-content",
            }}
          >
            {estadoOptions.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Historial */}
      <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #374151" }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "bold", margin: 0 }}>Historial de cambios</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              {["Fecha", "Descripción", "Estado"].map((h) => (
                <th key={h} style={{ color: "#6B7280", fontSize: "11px", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historial.map((entry, i) => (
              <tr key={i} style={{ borderBottom: i < historial.length - 1 ? "1px solid #374151" : "none" }}>
                <td style={{ padding: "10px 16px", color: "#6B7280", fontSize: "13px" }}>{entry.fecha}</td>
                <td style={{ padding: "10px 16px", color: "#fff", fontSize: "14px" }}>{entry.descripcion}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{
                    background: estadoConfig[entry.estado]?.bg ?? "#1a1a1a",
                    color: estadoConfig[entry.estado]?.text ?? "#fff",
                    fontSize: "12px", padding: "3px 10px", borderRadius: "999px", fontWeight: "500",
                  }}>
                    {entry.estado}
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