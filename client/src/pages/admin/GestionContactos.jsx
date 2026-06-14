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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function fetchContactos() {
      try {
        // Ahora solo traemos la data unificada desde leads
        const leadsData = await apiFetch("/leads");

        if (!cancelado) {
          setLeads(Array.isArray(leadsData) ? leadsData : []);
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

  // Mapeamos la data pura a "todos", asignándole el tipo en base a MySQL o su estado
  const todos = leads.map((l) => ({
    ...l,
    // Si la DB dice es_cliente (1 o true) o el estado ya es Cerrado exitoso, lo mostramos como Cliente
    tipo: (l.es_cliente === 1 || l.es_cliente === true || l.estado === "Cerrado exitoso") ? "cliente" : "lead"
  }));

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

  const columnas = [
    {
      key: "nombre",
      label: "Nombre",
      render: (c) => (
        <div>
          <div className="text-white text-sm whitespace-nowrap">{c.nombre}</div>
          <Badge estado={c.tipo} config={tipoConfig} className="mt-1" />
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
          className="text-emerald-500 text-sm no-underline whitespace-nowrap"
        >
          {c.whatsapp}
        </a>
      ),
    },
    {
      key: "servicio",
      label: "Servicio",
      render: (c) => c.servicio ?? "—",
      cellStyle: { color: "#6B7280", fontSize: "13px", minWidth: "120px" },
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (c) => (
        <span className="line-clamp-2 text-brand-muted text-sm min-w-37.5">
          {c.descripcion ?? "—"}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (c) => (
        <select
          value={c.estado}
          onChange={(e) => cambiarEstadoLead(c.id, e.target.value)}
          className="text-xs px-2.5 py-0.5 rounded-full font-medium cursor-pointer border-none outline-none whitespace-nowrap"
          style={{
            backgroundColor: estadoConfig[c.estado]?.bg ?? "#1a1a1a",
            color: estadoConfig[c.estado]?.text ?? "#fff",
          }}
        >
          {estadoOptions.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      )
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (c) => formatDate(c.fecha_creacion ?? c.fecha_alta ?? c.fecha),
      cellStyle: { color: "#6B7280", fontSize: "13px", minWidth: "100px" },
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
            className="bg-transparent border border-brand-border rounded-md text-brand-muted text-xs px-3 py-1.5 hover:border-brand-accent hover:text-brand-accent transition cursor-pointer"
          >
            Ver
          </button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-white text-xl font-bold m-0">Gestión de Contactos</h1>
        <p className="text-brand-muted text-sm mt-1">Leads y clientes unificados</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-md text-red-500 text-sm p-3">
          {error}
        </div>
      )}

      {/* Tabs + Filtro (Responsivo con flex-wrap) */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-1 bg-brand-surface rounded-lg p-1 w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              className={`flex-1 sm:flex-none border-none rounded-md text-sm px-4 py-1.5 transition cursor-pointer ${
                tabActiva === tab
                  ? "bg-brand-border text-white font-semibold"
                  : "bg-transparent text-brand-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="bg-brand-surface border border-brand-border rounded-md text-white text-sm px-3 py-1.5 cursor-pointer w-full sm:w-auto"
        >
          <option value="Todos">Todos los estados</option>
          {estadoOptions.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla con scroll horizontal (overflow-x-auto) para celulares */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-200">
          <DataTable
            columns={columnas}
            data={filtrados}
            loading={loading}
            emptyMessage="No hay contactos que coincidan con los filtros."
            keyExtractor={(item) => `${item.tipo}-${item.id}`}
          />
        </div>
      </div>
    </div>
  );
}