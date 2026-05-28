// src/pages/admin/ClienteDetalle.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate, normalizarEstado } from "../../utils/formatters";

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
  const location = useLocation();

  // Obtener el cliente del state si viene desde la tabla, sino null
  const [cliente, setCliente] = useState(() => location.state?.cliente ?? null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(!cliente); // Si no tenemos cliente, mostramos carga
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarTrabajos(clienteId) {
      try {
        const resTrabajos = await apiFetch("/trabajos");
        if (cancelado) return;

        const todosTrabajos = resTrabajos.data || [];
        const trabajosCliente = todosTrabajos
          .filter((t) => t.cliente_id === parseInt(clienteId))
          .map((t) => ({
            ...t,
            estado: normalizarEstado(t.estado),
          }));

        setTrabajos(trabajosCliente);
        setError("");
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError("Error al cargar los trabajos del cliente.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    // Si ya tenemos cliente (vino del state), solo cargamos trabajos
    if (cliente) {
      cargarTrabajos(cliente.id);
      return;
    }

    // Si no hay cliente en state, intentamos obtenerlo de la API (fallback)
    async function fetchCliente() {
      try {
        const clienteData = await apiFetch(`/clientes/${id}`);
        if (!cancelado) {
          setCliente(clienteData);
          cargarTrabajos(clienteData.id);
        }
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError("Cliente no encontrado.");
          setLoading(false);
        }
      }
    }

    fetchCliente();

    return () => {
      cancelado = true;
    };
  }, [id, cliente]);

  // Mostrar carga mientras se espera
  if (loading) {
    return (
      <div style={{ color: "#6B7280", padding: "32px", textAlign: "center" }}>
        Cargando cliente...
      </div>
    );
  }

  // Mostrar error si no hay cliente
  if (error || !cliente) {
    return (
      <div style={{ color: "#6B7280", padding: "32px", textAlign: "center" }}>
        <p>{error || "Cliente no encontrado."}</p>
        <button
          onClick={() => navigate("/admin/gestion-contactos")}
          style={{ color: "#F59E0B", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
        >
          ← Volver a Contactos
        </button>
      </div>
    );
  }

  // Datos del cliente (ya están disponibles)
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
          Cliente desde {formatDate(cliente.fecha_alta ?? cliente.fecha_creacion)}
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
            ["Alta en sistema", formatDate(cliente.fecha_alta ?? cliente.fecha_creacion)],
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
            Trabajos ({trabajos.length})
          </h2>
        </div>

        {trabajos.length === 0 ? (
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
              {trabajos.map((t, i) => (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: i < trabajos.length - 1 ? "1px solid #374151" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#263244"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", color: "#fff", fontSize: "14px" }}>
                    {t.tipo_servicio ?? "—"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {t.ubicacion}
                  </td>
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
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {formatDate(t.fecha_inicio)}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {formatDate(t.fecha_fin)}
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}