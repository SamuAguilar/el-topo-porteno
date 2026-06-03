import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate, normalizarEstado } from "../../utils/formatters";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

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
  const [cliente, setCliente] = useState(() => location.state?.cliente ?? null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(!cliente);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;
    async function cargarTrabajos(clienteId) {
      try {
        const resTrabajos = await apiFetch("/trabajos");
        if (cancelado) return;
        const todosTrabajos = resTrabajos.data || [];
        const trabajosCliente = todosTrabajos.filter(t => t.cliente_id === parseInt(clienteId)).map(t => ({ ...t, estado: normalizarEstado(t.estado) }));
        setTrabajos(trabajosCliente); setError("");
      } catch (err) { if (!cancelado) { console.error(err); setError("Error al cargar los trabajos del cliente."); } }
      finally { if (!cancelado) setLoading(false); }
    }
    if (cliente) { cargarTrabajos(cliente.id); return; }
    async function fetchCliente() {
      try {
        const clienteData = await apiFetch(`/clientes/${id}`);
        if (!cancelado) { setCliente(clienteData); cargarTrabajos(clienteData.id); }
      } catch (err) { if (!cancelado) { console.error(err); setError("Cliente no encontrado."); setLoading(false); } }
    }
    fetchCliente();
    return () => { cancelado = true; };
  }, [id, cliente]);

  const columnasTrabajos = [
    { key: "servicio", label: "Servicio", render: (t) => t.tipo_servicio ?? "—", cellStyle: { color: "#fff", fontSize: "14px" } },
    { key: "ubicacion", label: "Ubicación", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "estado", label: "Estado", render: (t) => <Badge estado={t.estado} config={estadoConfig} /> },
    { key: "inicio", label: "Inicio", render: (t) => formatDate(t.fecha_inicio), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "fin", label: "Fin", render: (t) => formatDate(t.fecha_fin), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "accion", label: "", render: (t) => (
      <button onClick={() => navigate(`/admin/trabajos/${t.id}`)}
        className="bg-transparent border border-brand-border rounded-md text-brand-muted text-xs px-3 py-1.5 cursor-pointer hover:border-brand-accent hover:text-brand-accent transition">Ver</button>
    )},
  ];

  if (loading) return <div className="text-brand-muted p-8 text-center text-sm">Cargando cliente...</div>;
  if (error || !cliente) return (
    <div className="text-brand-muted p-8 text-center">
      <p>{error || "Cliente no encontrado."}</p>
      <button onClick={() => navigate("/admin/gestion-contactos")} className="text-brand-accent bg-transparent border-none cursor-pointer text-sm mt-2">← Volver a Contactos</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/admin/gestion-contactos")} className="bg-transparent border-none text-brand-muted cursor-pointer text-sm w-fit">← Volver a Contactos</button>
      <div>
        <h1 className="text-white text-xl font-bold m-0">{cliente.nombre}</h1>
        <p className="text-brand-muted text-sm mt-1">Cliente desde {formatDate(cliente.fecha_alta ?? cliente.fecha_creacion)}</p>
      </div>
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-white text-sm font-bold m-0">Datos de contacto</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {[["Nombre", cliente.nombre], ["WhatsApp", cliente.whatsapp], ["Email", cliente.email], ["Alta en sistema", formatDate(cliente.fecha_alta ?? cliente.fecha_creacion)]].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-brand-muted text-xs uppercase tracking-wider">{label}</span>
              <span className="text-white text-sm">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 flex-wrap pt-1">
          <a href={`https://wa.me/${cliente.whatsapp}`} target="_blank" rel="noreferrer" className="bg-emerald-900 border-none rounded-md text-emerald-500 text-sm font-medium px-4 py-2 no-underline inline-block">WhatsApp</a>
          <a href={`mailto:${cliente.email}`} className="bg-brand-surface text-brand-muted border border-brand-border rounded-md text-sm px-4 py-2 no-underline inline-block">Email</a>
        </div>
      </div>
      <DataTable columns={columnasTrabajos} data={trabajos} loading={false} emptyMessage="Este cliente no tiene trabajos registrados." keyExtractor={(t) => t.id} />
    </div>
  );
}