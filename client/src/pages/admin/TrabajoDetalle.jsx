import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate, normalizarEstado, estadoParaApi } from "../../utils/formatters";
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

const estadoOptions = ["Presupuestado", "Aceptado", "En ejecución", "Finalizado", "En garantía", "Cerrado"];

export default function TrabajoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trabajo, setTrabajo] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [comentarioCambio, setComentarioCambio] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function fetchDetalle() {
      try {
        const resTrabajos = await apiFetch("/trabajos");
        const trabajosRaw = resTrabajos.data || [];
        const trabajosNormalizados = trabajosRaw.map(t => ({ ...t, estado: normalizarEstado(t.estado) }));
        const trabajoActual = trabajosNormalizados.find(t => t.id === parseInt(id));

        if (!trabajoActual) throw new Error("Trabajo no encontrado");

        const historialData = await apiFetch(`/trabajos/${id}/historial`);
        const historialNormalizado = Array.isArray(historialData)
          ? historialData.map(h => ({
              ...h,
              estado_anterior: normalizarEstado(h.estado_anterior),
              estado_nuevo: normalizarEstado(h.estado_nuevo),
            }))
          : [];

        if (!cancelado) {
          setTrabajo(trabajoActual);
          setHistorial(historialNormalizado);
          setError("");
        }
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError(err.message || "Error al cargar el trabajo.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    fetchDetalle();
    return () => { cancelado = true; };
  }, [id]);

  async function cambiarEstado(nuevoEstado) {
    try {
      await apiFetch(`/trabajos/${id}/estado`, {
        method: "PUT",
        body: { estado_nuevo: estadoParaApi(nuevoEstado), notas: comentarioCambio.trim() || null },
      });
      setComentarioCambio("");
      setTrabajo(prev => ({ ...prev, estado: nuevoEstado }));
      const historialData = await apiFetch(`/trabajos/${id}/historial`);
      const historialNormalizado = Array.isArray(historialData)
        ? historialData.map(h => ({
            ...h,
            estado_anterior: normalizarEstado(h.estado_anterior),
            estado_nuevo: normalizarEstado(h.estado_nuevo),
          }))
        : [];
      setHistorial(historialNormalizado);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado.");
    }
  }

  async function guardarPrecio() {
    const precioNumerico = parseFloat(nuevoPrecio);
    if (isNaN(precioNumerico) || precioNumerico < 0) {
      alert("Ingresá un precio válido.");
      return;
    }
    try {
      await apiFetch(`/trabajos/${id}`, { method: "PUT", body: { precio: precioNumerico } });
      setTrabajo(prev => ({ ...prev, precio: precioNumerico }));
      setEditandoPrecio(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el precio.");
    }
  }

  const columnasHistorial = [
    { key: "fecha", label: "Fecha", render: (h) => formatDate(h.fecha_cambio), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "anterior", label: "Estado anterior", render: (h) => <Badge estado={h.estado_anterior} config={estadoConfig} /> },
    { key: "nuevo", label: "Estado nuevo", render: (h) => <Badge estado={h.estado_nuevo} config={estadoConfig} /> },
    { key: "usuario", label: "Usuario", render: (h) => h.modificado_por ?? "—", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "comentario", label: "Comentario", render: (h) => h.comentario ?? "—", cellStyle: { color: "#fff", fontSize: "13px" } },
  ];

  if (loading) {
    return <div className="text-brand-muted p-8 text-center text-sm">Cargando trabajo...</div>;
  }

  if (error || !trabajo) {
    return (
      <div className="text-brand-muted p-8 text-center">
        <p>{error || "Trabajo no encontrado."}</p>
        <button onClick={() => navigate("/admin/trabajos")} className="text-brand-accent bg-transparent border-none cursor-pointer text-sm mt-2">
          ← Volver a Trabajos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/admin/trabajos")} className="bg-transparent border-none text-brand-muted cursor-pointer text-sm w-fit">
        ← Volver a Trabajos
      </button>

      <div>
        <h1 className="text-white text-xl font-bold m-0">{trabajo.cliente_nombre} — {trabajo.tipo_servicio}</h1>
        <p className="text-brand-muted text-sm mt-1">ID: {trabajo.id}</p>
      </div>

      {/* Datos generales */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {[
          ["Cliente", trabajo.cliente_nombre],
          ["Servicio", trabajo.tipo_servicio],
          ["Ubicación", trabajo.ubicacion],
          ["Profundidad", trabajo.profundidad_estimada ? `${trabajo.profundidad_estimada}m` : "—"],
          ["Fecha inicio", formatDate(trabajo.fecha_inicio)],
          ["Fecha fin", formatDate(trabajo.fecha_fin)],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-brand-muted text-xs uppercase tracking-wider">{label}</span>
            <span className="text-white text-sm">{value}</span>
          </div>
        ))}

        {/* Estado con comentario opcional */}
        <div className="flex flex-col gap-1.5">
          <div>
            <span className="text-brand-muted text-xs uppercase tracking-wider">Estado</span>
            <select
              value={trabajo.estado}
              onChange={(e) => cambiarEstado(e.target.value)}
              className="mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium cursor-pointer border-none outline-none block w-fit"
              style={{ backgroundColor: estadoConfig[trabajo.estado]?.bg ?? "#1a1a1a", color: estadoConfig[trabajo.estado]?.text ?? "#fff" }}
            >
              {estadoOptions.map((op) => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-muted text-xs uppercase tracking-wider">Comentario (opcional)</span>
            <input
              type="text"
              value={comentarioCambio}
              onChange={(e) => setComentarioCambio(e.target.value)}
              placeholder="Motivo del cambio..."
              className="bg-brand-bg border border-brand-border rounded-md px-2.5 py-1.5 text-white text-sm outline-none w-full max-w-55"
            />
          </div>
        </div>

        {/* Precio editable */}
        <div className="flex flex-col gap-1">
          <span className="text-brand-muted text-xs uppercase tracking-wider">Precio</span>
          {editandoPrecio ? (
            <div className="flex gap-2 items-center">
              <input type="number" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)}
                className="bg-brand-bg border border-brand-border rounded-md px-2.5 py-1.5 text-white text-sm w-28 outline-none" />
              <button onClick={guardarPrecio} className="bg-brand-accent text-black border-none rounded-md px-3.5 py-1.5 text-sm font-bold cursor-pointer">Guardar</button>
              <button onClick={() => setEditandoPrecio(false)} className="bg-transparent border border-brand-border rounded-md text-brand-muted text-sm px-3.5 py-1.5 cursor-pointer">Cancelar</button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <span className="text-brand-accent text-base font-bold">
                {trabajo.precio != null ? `$${Number(trabajo.precio).toLocaleString("es-AR")}` : "—"}
              </span>
              <button onClick={() => { setNuevoPrecio(trabajo.precio ?? ""); setEditandoPrecio(true); }}
                className="bg-transparent border border-brand-border rounded-md text-brand-muted text-xs px-2.5 py-1 cursor-pointer">Editar</button>
            </div>
          )}
        </div>
      </div>

      <DataTable columns={columnasHistorial} data={historial} emptyMessage="Sin movimientos registrados." keyExtractor={(h) => h.id} />
    </div>
  );
}