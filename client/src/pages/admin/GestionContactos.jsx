// src/pages/admin/GestionContactos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate } from "../../utils/formatters";

const estadoConfig = {
  "Nuevo":                 { bg: "#1a2a1a", text: "#10B981" },
  "Contactado":            { bg: "#1a2a3a", text: "#3B82F6" },
  "Cerrado exitoso":       { bg: "#1a1a3a", text: "#8B5CF6" },
  "Cerrado no concretado": { bg: "#2a1a1a", text: "#EF4444" },
};

const tabs = ["Todos", "Leads", "Clientes"];
const estadoOptions = [
  "Nuevo",
  "Contactado",
  "Cerrado exitoso",
  "Cerrado no concretado",
];

export default function GestionContactos() {
  const navigate = useNavigate();

  const [tabActiva, setTabActiva] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [leads, setLeads] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos de la API
  useEffect(() => {
    let cancelado = false;

    async function fetchContactos() {
      try {
        const [leadsData, clientesData] = await Promise.all([
          apiFetch("/leads"),       // GET /api/leads
          apiFetch("/clientes"),    // GET /api/clientes
        ]);

        if (!cancelado) {
          setLeads(Array.isArray(leadsData) ? leadsData : []);
          setClientes(Array.isArray(clientesData) ? clientesData : []);
          setError("");
        }
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError("No se pudieron cargar los contactos.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    fetchContactos();
    return () => { cancelado = true; };
  }, []);

  // Crear un mapa de leads por id para enriquecer clientes
  const leadMap = new Map(leads.map((l) => [l.id, l]));

  // Enriquecer cada cliente con datos del lead asociado (si existe)
  const clientesEnriquecidos = clientes.map((c) => {
    const lead = leadMap.get(c.lead_id);
    return {
      ...c,
      tipo: "cliente",
      servicio: c.servicio ?? (lead ? lead.servicio : undefined),
      descripcion: c.descripcion ?? (lead ? lead.descripcion : undefined),
      estado: c.estado ?? (lead ? lead.estado : undefined),
    };
  });

  // Unir leads y clientes enriquecidos
  const todos = [
    ...leads.map((l) => ({ ...l, tipo: "lead" })),
    ...clientesEnriquecidos,
  ];

  // Aplicar filtros
  const filtrados = todos.filter((item) => {
    const matchTab =
      tabActiva === "Todos" ||
      (tabActiva === "Leads" && item.tipo === "lead") ||
      (tabActiva === "Clientes" && item.tipo === "cliente");
    const matchEstado = filtroEstado === "Todos" || item.estado === filtroEstado;
    return matchTab && matchEstado;
  });

  // Cambiar estado de un lead
  async function cambiarEstadoLead(id, nuevoEstado) {
    try {
      await apiFetch(`/leads/${id}/estado`, {
        method: "PUT",
        body: { estado: nuevoEstado },
      });
      // Actualizar localmente
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, estado: nuevoEstado } : l))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo actualizar el estado.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Encabezado */}
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Gestión de Contactos
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Leads y clientes registrados
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div style={{
          background: "#2a1a1a", border: "1px solid #EF4444",
          borderRadius: "6px", color: "#EF4444", padding: "12px 16px", fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      {/* Tabs + Filtro */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "4px", background: "#1F2937", borderRadius: "8px", padding: "4px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              style={{
                background: tabActiva === tab ? "#374151" : "none",
                border: "none",
                borderRadius: "6px",
                color: tabActiva === tab ? "#fff" : "#6B7280",
                fontSize: "13px",
                fontWeight: tabActiva === tab ? "600" : "400",
                padding: "6px 16px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            background: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "13px",
            padding: "7px 12px",
            cursor: "pointer",
          }}
        >
          <option value="Todos">Todos los estados</option>
          {estadoOptions.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div style={{
        background: "#1F2937",
        border: "1px solid #374151",
        borderRadius: "10px",
        overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
            Cargando contactos...
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
            No hay contactos que coincidan con los filtros.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #374151" }}>
                {["Nombre", "WhatsApp", "Servicio", "Descripción", "Estado", "Fecha", "Acciones"].map((h) => (
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
              {filtrados.map((c, i) => (
                <tr
                  key={`${c.tipo}-${c.id}`}   // clave única combinando tipo e id
                  style={{
                    borderBottom: i < filtrados.length - 1 ? "1px solid #374151" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#263244"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Nombre + tipo */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#fff", fontSize: "14px" }}>{c.nombre}</div>
                    <div style={{
                      display: "inline-block",
                      marginTop: "3px",
                      background: c.tipo === "lead" ? "#1a2a1a" : "#1a1a3a",
                      color: c.tipo === "lead" ? "#10B981" : "#8B5CF6",
                      fontSize: "10px",
                      padding: "1px 8px",
                      borderRadius: "999px",
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}>
                      {c.tipo}
                    </div>
                  </td>

                  {/* WhatsApp */}
                  <td style={{ padding: "12px 16px" }}>
                    <a
                      href={`https://wa.me/${c.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#10B981", fontSize: "13px", textDecoration: "none" }}
                    >
                      💬 {c.whatsapp}
                    </a>
                  </td>

                  {/* Servicio */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {c.servicio ?? "—"}
                  </td>

                  {/* Descripción */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px", maxWidth: "200px" }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {c.descripcion ?? "—"}
                    </span>
                  </td>

                  {/* Estado */}
                  <td style={{ padding: "12px 16px" }}>
                    {c.tipo === "lead" ? (
                      <select
                        value={c.estado}
                        onChange={(e) => cambiarEstadoLead(c.id, e.target.value)}
                        style={{
                          background: estadoConfig[c.estado]?.bg ?? "#1a1a1a",
                          color: estadoConfig[c.estado]?.text ?? "#fff",
                          border: "none",
                          borderRadius: "999px",
                          fontSize: "12px",
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        {estadoOptions.map((op) => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{
                        background: estadoConfig[c.estado]?.bg ?? "#1a1a1a",
                        color: estadoConfig[c.estado]?.text ?? "#fff",
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontWeight: "500",
                      }}>
                        {c.estado}
                      </span>
                    )}
                  </td>

                  {/* Fecha */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {formatDate(c.fecha_creacion ?? c.fecha)}
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: "12px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        style={{ color: "#6B7280", fontSize: "12px", textDecoration: "none" }}
                        title={c.email}
                      >
                        ✉️
                      </a>
                    )}
                    {c.tipo === "cliente" && (
                      <button
                        onClick={() => navigate(`/admin/clientes/${c.id}`, { state: { cliente: c } })}
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
                    )}
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