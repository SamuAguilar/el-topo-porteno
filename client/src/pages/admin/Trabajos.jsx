// src/pages/admin/Trabajos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate, normalizarEstado, estadoParaApi } from "../../utils/formatters";
import DataTable from "../../components/ui/DataTable";

const estadoConfig = {
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280" },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6" },
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981" },
  "Finalizado":    { bg: "#1a1a3a", text: "#8B5CF6" },
  "En garantía":   { bg: "#2a2a1a", text: "#F59E0B" },
  "Cerrado":       { bg: "#1a2a1a", text: "#34D399" },
};

const estadoOptions = ["Presupuestado", "Aceptado", "En ejecución", "Finalizado", "En garantía", "Cerrado"];
const servicioOptions = ["Todos", "Excavacion", "Zanjeo", "Limpieza"];

export default function Trabajos() {
  const navigate = useNavigate();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroServicio, setFiltroServicio] = useState("Todos");

  useEffect(() => {
    let cancelado = false;
    async function fetchTrabajos() {
      try {
        const response = await apiFetch("/trabajos");
        if (!cancelado) {
          const trabajosRaw = Array.isArray(response.data) ? response.data : [];
          setTrabajos(trabajosRaw.map(t => ({ ...t, estado: normalizarEstado(t.estado) })));
          setError("");
        }
      } catch (err) {
        if (!cancelado) { console.error(err); setError("No se pudieron cargar los trabajos."); }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    fetchTrabajos();
    return () => { cancelado = true; };
  }, []);

  const filtrados = trabajos.filter(t => {
    const matchEstado = filtroEstado === "Todos" || t.estado === filtroEstado;
    const matchServicio = filtroServicio === "Todos" || t.tipo_servicio === filtroServicio;
    return matchEstado && matchServicio;
  });

  async function cambiarEstado(id, nuevoEstado) {
    try {
      await apiFetch(`/trabajos/${id}/estado`, { method: "PUT", body: { estado_nuevo: estadoParaApi(nuevoEstado) } });
      setTrabajos(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    } catch (err) { console.error(err); alert("No se pudo actualizar el estado."); }
  }

  const columnas = [
    { key: "cliente", label: "Cliente", render: (t) => t.cliente_nombre ?? "—", cellStyle: { color: "#fff", fontSize: "14px" } },
    { key: "servicio", label: "Servicio", render: (t) => t.tipo_servicio ?? "—", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "ubicacion", label: "Ubicación", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "profundidad", label: "Prof.", render: (t) => t.profundidad_estimada != null ? `${t.profundidad_estimada}m` : "—", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "estado", label: "Estado", render: (t) => (
      <select value={t.estado} onChange={(e) => cambiarEstado(t.id, e.target.value)}
        className="text-xs px-2.5 py-0.5 rounded-full font-medium cursor-pointer border-none outline-none"
        style={{ backgroundColor: estadoConfig[t.estado]?.bg ?? "#1a1a1a", color: estadoConfig[t.estado]?.text ?? "#fff" }}>
        {estadoOptions.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
    )},
    { key: "precio", label: "Precio", render: (t) => t.precio != null ? `$${Number(t.precio).toLocaleString("es-AR")}` : "—", cellStyle: { color: "#6B7280", fontSize: "14px", fontWeight: "bold" } },
    { key: "inicio", label: "Inicio", render: (t) => formatDate(t.fecha_inicio), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "fin", label: "Fin", render: (t) => formatDate(t.fecha_fin), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "acciones", label: "", render: (t) => (
      <button onClick={() => navigate(`/admin/trabajos/${t.id}`)}
        className="bg-transparent border border-brand-border rounded-md text-brand-muted text-xs px-3 py-1.5 cursor-pointer hover:border-brand-accent hover:text-brand-accent transition">
        Ver
      </button>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white text-xl font-bold m-0">Trabajos</h1>
        <p className="text-brand-muted text-sm mt-1">Todos los trabajos y pozos registrados</p>
      </div>
      {error && <div className="bg-red-900/20 border border-red-500 rounded-md text-red-500 text-sm p-3">{error}</div>}
      <div className="flex gap-3 flex-wrap">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="bg-brand-surface border border-brand-border rounded-md text-white text-sm px-3 py-1.5 cursor-pointer">
          <option value="Todos">Todos los estados</option>
          {estadoOptions.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
        <select value={filtroServicio} onChange={(e) => setFiltroServicio(e.target.value)} className="bg-brand-surface border border-brand-border rounded-md text-white text-sm px-3 py-1.5 cursor-pointer">
          <option value="Todos">Todos los servicios</option>
          {servicioOptions.filter(op => op !== "Todos").map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      </div>
      
      {/* Contenedor responsivo para móviles */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-225">
          <DataTable 
            columns={columnas} 
            data={filtrados} 
            loading={loading} 
            emptyMessage="No hay trabajos que coincidan con los filtros." 
            keyExtractor={(item) => item.id} 
          />
        </div>
      </div>
    </div>
  );
}