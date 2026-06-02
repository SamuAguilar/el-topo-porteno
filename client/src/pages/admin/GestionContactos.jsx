// src/pages/admin/GestionContactos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate } from "../../utils/formatters";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const estadoConfig = {
  "Nuevo":                 { bg: "#1a2a1a", text: "#10B981" },
  "Contactado":            { bg: "#1a2a3a", text: "#3B82F6" },
  "Cerrado exitoso":       { bg: "#1a1a3a", text: "#8B5CF6" },
  "Cerrado no concretado": { bg: "#2a1a1a", text: "#EF4444" },
};

const tipoConfig = {
  lead:    { bg: "#1a2a1a", text: "#10B981" },
  cliente: { bg: "#1a1a3a", text: "#8B5CF6" },
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

  useEffect(() => {
    let cancelado = false;

    async function fetchContactos() {
      try {
        const [leadsData, clientesData] = await Promise.all([
          apiFetch("/leads"),
          apiFetch("/clientes"),
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

  const leadMap = new Map(leads.map((l) => [l.id, l]));

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

  const todos = [
    ...leads.map((l) => ({ ...l, tipo: "lead" })),
    ...clientesEnriquecidos,
  ];

  const filtrados = todos.filter((item) => {
    const matchTab =
      tabActiva === "Todos" ||
      (tabActiva === "Leads" && item.tipo === "lead") ||
      (tabActiva === "Clientes" && item.tipo === "cliente");
    const matchEstado = filtroEstado === "Todos" || item.estado === filtroEstado;
    return matchTab && matchEstado;
  });

  async function cambiarEstadoLead(id, nuevoEstado) {
    try {
      await apiFetch(`/leads/${id}/estado`, {
        method: "PUT",
        body: { estado: nuevoEstado },
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, estado: nuevoEstado } : l))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo actualizar el estado.");
    }
  }

  // Definición de columnas para DataTable
  const columnas = [
    {
      key: "nombre",
      label: "Nombre",
      render: (c) => (
        <div>
          <div style={{ color: "#fff", fontSize: "14px" }}>{c.nombre}</div>
          <Badge estado={c.tipo} config={tipoConfig} />
        </div>
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      render: (c) => (
        <a
          href={`https://wa.me/${c.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#10B981", fontSize: "13px", textDecoration: "none" }}
        >
          {c.whatsapp}
        </a>
      ),
    },
    {
      key: "servicio",
      label: "Servicio",
      render: (c) => c.servicio ?? "—",
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (c) => (
        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {c.descripcion ?? "—"}
        </span>
      ),
      cellStyle: { color: "#6B7280", fontSize: "13px", maxWidth: "200px" },
    },
    {
      key: "estado",
      label: "Estado",
      render: (c) =>
        c.tipo === "lead" ? (
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
          <Badge estado={c.estado} config={estadoConfig} />
        ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (c) => formatDate(c.fecha_creacion ?? c.fecha_alta ?? c.fecha),
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "email",
      label: "Email",
      render: (c) => c.email || "—",
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (c) =>
        c.tipo === "cliente" ? (
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
        ) : null,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Gestión de Contactos
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Leads y clientes registrados
        </p>
      </div>

      {error && (
        <div style={{
          background: "#2a1a1a", border: "1px solid #EF4444",
          borderRadius: "6px", color: "#EF4444", padding: "12px 16px", fontSize: "14px",
        }}>
          {error}
        </div>
      )}

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

      <DataTable
        columns={columnas}
        data={filtrados}
        loading={loading}
        emptyMessage="No hay contactos que coincidan con los filtros."
        keyExtractor={(item) => `${item.tipo}-${item.id}`}
      />
    </div>
  );
}