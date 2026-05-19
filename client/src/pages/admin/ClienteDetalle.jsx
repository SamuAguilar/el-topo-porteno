// src/pages/admin/ClienteDetalle.jsx
import { useParams, useNavigate } from "react-router-dom";

const clientesData = [
  {
    id: 5, nombre: "Ana Suárez", whatsapp: "5491134567890", email: "ana@gmail.com", fechaAlta: "05/05/2026",
    trabajos: [
      { id: 1, servicio: "Sanjeo",     ubicacion: "Quilmes, GBA Sur",    estado: "En ejecución", fechaInicio: "05/05/2026", fechaFin: "20/05/2026" },
    ],
  },
  {
    id: 6, nombre: "Jorge Villalba", whatsapp: "5491145678901", email: "jorge@gmail.com", fechaAlta: "02/05/2026",
    trabajos: [
      { id: 2, servicio: "Limpieza",   ubicacion: "Lanús, GBA Sur",       estado: "En ejecución", fechaInicio: "08/05/2026", fechaFin: "10/05/2026" },
    ],
  },
  {
    id: 7, nombre: "Roberto Díaz", whatsapp: "5491156789012", email: "roberto@gmail.com", fechaAlta: "28/04/2026",
    trabajos: [
      { id: 3, servicio: "Excavación", ubicacion: "Palermo, CABA",        estado: "Finalizado",   fechaInicio: "20/04/2026", fechaFin: "28/04/2026" },
      { id: 7, servicio: "Limpieza",   ubicacion: "Flores, CABA",         estado: "Cerrado",      fechaInicio: "15/03/2026", fechaFin: "16/03/2026" },
    ],
  },
];

const estadoConfig = {
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280" },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6" },
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981" },
  "Finalizado":    { bg: "#1a1a3a", text: "#8B5CF6" },
  "En garantía":   { bg: "#2a2a1a", text: "#F59E0B" },
  "Cerrado":       { bg: "#1a2a1a", text: "#34D399" },
};

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cliente = clientesData.find((c) => c.id === parseInt(id));

  if (!cliente) {
    return (
      <div style={{ color: "#6B7280", padding: "32px", textAlign: "center" }}>
        <p>Cliente no encontrado.</p>
        <button onClick={() => navigate("/admin/gestion-contactos")} style={{ color: "#F59E0B", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
          ← Volver a Contactos
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Volver */}
      <button
        onClick={() => navigate("/admin/gestion-contactos")}
        style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "13px", textAlign: "left", padding: 0, width: "fit-content" }}
      >
        ← Volver a Contactos
      </button>

      {/* Encabezado */}
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          {cliente.nombre}
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Cliente desde {cliente.fechaAlta}
        </p>
      </div>

      {/* Datos del cliente */}
      <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "bold", margin: 0 }}>Datos de contacto</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            ["Nombre",          cliente.nombre],
            ["WhatsApp",        cliente.whatsapp],
            ["Email",           cliente.email],
            ["Alta en sistema", cliente.fechaAlta],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "4px" }}>
          <a
            href={`https://wa.me/${cliente.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#14532d", color: "#10B981", border: "none",
              borderRadius: "6px", fontSize: "13px", fontWeight: "500",
              padding: "8px 16px", textDecoration: "none", display: "inline-block",
            }}
          >
            💬 Abrir WhatsApp
          </a>
          <a
            href={`mailto:${cliente.email}`}
            style={{
              background: "#1F2937", color: "#6B7280", border: "1px solid #374151",
              borderRadius: "6px", fontSize: "13px",
              padding: "8px 16px", textDecoration: "none", display: "inline-block",
            }}
          >
            ✉️ Enviar email
          </a>
        </div>
      </div>

      {/* Trabajos */}
      <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #374151", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "bold", margin: 0 }}>
            Trabajos ({cliente.trabajos.length})
          </h2>
        </div>

        {cliente.trabajos.length === 0 ? (
          <p style={{ color: "#6B7280", fontSize: "14px", padding: "24px 20px", margin: 0 }}>
            Este cliente no tiene trabajos registrados.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #374151" }}>
                {["Servicio", "Ubicación", "Estado", "Inicio", "Fin", ""].map((h) => (
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
              {cliente.trabajos.map((t, i) => (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: i < cliente.trabajos.length - 1 ? "1px solid #374151" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#263244"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", color: "#fff",    fontSize: "14px" }}>{t.servicio}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{t.ubicacion}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: estadoConfig[t.estado]?.bg ?? "#1a1a1a",
                      color: estadoConfig[t.estado]?.text ?? "#fff",
                      fontSize: "12px", padding: "3px 10px",
                      borderRadius: "999px", fontWeight: "500",
                    }}>
                      {t.estado}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{t.fechaInicio ?? "—"}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{t.fechaFin ?? "—"}</td>
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
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}