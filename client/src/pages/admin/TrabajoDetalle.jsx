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

  const [estadoEdicion, setEstadoEdicion] = useState("");
  const [comentarioCambio, setComentarioCambio] = useState("");
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "success" });
  const [dialogoEliminar, setDialogoEliminar] = useState({ visible: false, idHistorial: null });
  const [guardando, setGuardando] = useState(false);

  const mostrarNotificacion = (mensaje, tipo = "error") => {
    setAlerta({ visible: true, mensaje, tipo });
    setTimeout(() => setAlerta({ visible: false, mensaje: "", tipo: "success" }), 3500);
  };

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
          setEstadoEdicion(trabajoActual.estado);
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

  async function guardarEstadoCambio() {
    if (guardando) return;
    setGuardando(true);

    try {
      await apiFetch(`/trabajos/${id}/estado`, {
        method: "PUT",
        body: { estado_nuevo: estadoParaApi(estadoEdicion), notas: comentarioCambio.trim() || null },
      });

      setComentarioCambio("");
      setTrabajo(prev => ({ ...prev, estado: estadoEdicion }));
      mostrarNotificacion("Estado actualizado correctamente", "success");

      const historialData = await apiFetch(`/trabajos/${id}/historial`);
      const historialNormalizado = Array.isArray(historialData)
        ? historialData.map(h => ({
            ...h,
            estado_anterior: normalizarEstado(h.estado_anterior),
            estado_nuevo: normalizarEstado(h.estado_nuevo),
          }))
        : [];
      setHistorial(historialNormalizado);

      const resTrabajos = await apiFetch("/trabajos");
      const trabajosRaw = resTrabajos.data || [];
      const trabajoActualizado = trabajosRaw.find(t => t.id === parseInt(id));
      if (trabajoActualizado) {
        setTrabajo(prev => ({
          ...prev,
          fecha_inicio: trabajoActualizado.fecha_inicio,
          fecha_fin: trabajoActualizado.fecha_fin,
        }));
      }

    } catch (err) {
      console.error(err);
      mostrarNotificacion("No se pudo actualizar el estado.", "error");
    } finally {
      setGuardando(false);
    }
  }

  async function ejecutarEliminarHistorial() {
    try {
      await apiFetch(`/trabajos/historial/${dialogoEliminar.idHistorial}`, { method: "DELETE" });
      setHistorial(prev => prev.filter(h => h.id !== dialogoEliminar.idHistorial));
      setDialogoEliminar({ visible: false, idHistorial: null });
      mostrarNotificacion("Registro eliminado del historial", "success");
    } catch (error) {
      console.error(error);
      setDialogoEliminar({ visible: false, idHistorial: null });
      mostrarNotificacion("Ocurrió un error al intentar eliminar el registro.", "error");
    }
  }

  async function guardarPrecio() {
    const precioNumerico = parseFloat(nuevoPrecio);
    if (isNaN(precioNumerico) || precioNumerico < 0) {
      mostrarNotificacion("Por favor, ingresá un precio válido.", "error");
      return;
    }
    try {
      await apiFetch(`/trabajos/${id}`, { method: "PUT", body: { precio: precioNumerico } });
      setTrabajo(prev => ({ ...prev, precio: precioNumerico }));
      setEditandoPrecio(false);
      mostrarNotificacion("Precio actualizado", "success");
    } catch (err) {
      console.error(err);
      mostrarNotificacion("No se pudo actualizar el precio.", "error");
    }
  }

  const columnasHistorial = [
    { key: "fecha", label: "Fecha", render: (h) => formatDate(h.fecha_cambio), cellStyle: { color: "#6B7280", fontSize: "13px", minWidth: "90px" } },
    { key: "anterior", label: "Estado anterior", render: (h) => <Badge estado={h.estado_anterior} config={estadoConfig} /> },
    { key: "nuevo", label: "Estado nuevo", render: (h) => <Badge estado={h.estado_nuevo} config={estadoConfig} /> },
    { key: "usuario", label: "Usuario", render: (h) => h.modificado_por ?? "—", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "comentario", label: "Comentario", render: (h) => h.comentario ?? "—", cellStyle: { color: "#fff", fontSize: "13px" } },
    {
      key: "acciones", label: "", render: (h) => (
        <button
          onClick={() => setDialogoEliminar({ visible: true, idHistorial: h.id })}
          className="bg-transparent text-brand-muted hover:text-red-400 border-none rounded px-2 py-1 text-xs cursor-pointer transition flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )
    },
  ];

  if (loading) return <div className="text-brand-muted p-8 text-center text-sm">Cargando trabajo...</div>;

  if (error || !trabajo) return (
    <div className="text-brand-muted p-8 text-center">
      <p>{error || "Trabajo no encontrado."}</p>
      <button onClick={() => navigate("/admin/trabajos")} className="text-brand-accent bg-transparent border-none cursor-pointer text-sm mt-2">
        ← Volver a Trabajos
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 relative">

      {alerta.visible && (
        <div className={`fixed top-8 right-8 z-9999 px-6 py-3 rounded-lg shadow-2xl text-sm font-bold text-white transition-opacity duration-300 flex items-center gap-3 ${alerta.tipo === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {alerta.tipo === 'success' ? '✓' : '⚠'} {alerta.mensaje}
        </div>
      )}

      <button onClick={() => navigate("/admin/trabajos")} className="bg-transparent border-none text-brand-muted cursor-pointer text-sm w-fit">
        ← Volver a Trabajos
      </button>

      <div>
        <h1 className="text-white text-xl font-bold m-0">{trabajo.cliente_nombre} — {trabajo.tipo_servicio}</h1>
        <p className="text-brand-muted text-sm mt-1">ID: {trabajo.id}</p>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 xl:gap-6 shadow-lg w-full">

        <div className="flex flex-col gap-0.5">
          <span className="text-brand-muted text-[10px] uppercase tracking-wider font-semibold">Cliente</span>
          <span className="text-white text-sm font-medium whitespace-nowrap">{trabajo.cliente_nombre}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-brand-muted text-[10px] uppercase tracking-wider font-semibold">Servicio</span>
          <span className="text-white text-sm font-medium whitespace-nowrap">{trabajo.tipo_servicio}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-brand-muted text-[10px] uppercase tracking-wider font-semibold">Ubicación</span>
          <span className="text-white text-sm font-medium line-clamp-1 max-w-50" title={trabajo.ubicacion}>{trabajo.ubicacion}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-brand-muted text-[10px] uppercase tracking-wider font-semibold">Precio</span>
          {editandoPrecio ? (
            <div className="flex gap-1.5 items-center">
              <input
                type="number"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                className="bg-brand-bg border border-brand-border rounded-md px-2 py-0.5 text-white text-sm w-20 outline-none"
              />
              <button onClick={guardarPrecio} className="bg-brand-accent text-black border-none rounded-md px-2 py-1 text-[11px] font-bold cursor-pointer">OK</button>
              <button onClick={() => setEditandoPrecio(false)} className="bg-transparent border border-brand-border rounded-md text-brand-muted text-[11px] px-2 py-1 cursor-pointer hover:text-white">✕</button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <span className="text-brand-accent text-base font-bold whitespace-nowrap">
                {trabajo.precio != null ? `$${Number(trabajo.precio).toLocaleString("es-AR")}` : "—"}
              </span>
              <button
                onClick={() => { setNuevoPrecio(trabajo.precio ?? ""); setEditandoPrecio(true); }}
                className="bg-transparent border border-brand-border rounded-md text-brand-muted text-[10px] px-2 py-0.5 cursor-pointer hover:border-brand-accent hover:text-brand-accent transition uppercase tracking-wider"
              >
                Editar
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-2 bg-brand-bg/60 px-2 py-1.5 rounded-lg border border-brand-border shrink-0">
          <select
            value={estadoEdicion}
            onChange={(e) => setEstadoEdicion(e.target.value)}
            disabled={guardando}
            className="text-[11px] px-2 py-1.5 rounded-md font-medium cursor-pointer border border-brand-border outline-none bg-brand-surface text-white shrink-0 disabled:opacity-50"
          >
            {estadoOptions.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
          <input
            type="text"
            value={comentarioCambio}
            onChange={(e) => setComentarioCambio(e.target.value)}
            disabled={guardando}
            placeholder="Motivo..."
            className="bg-brand-surface border border-brand-border rounded-md px-2.5 py-1 text-white text-[13px] outline-none w-28 lg:w-36 transition-all focus:w-36 disabled:opacity-50"
          />
          <button
            onClick={guardarEstadoCambio}
            disabled={guardando || (estadoEdicion === trabajo.estado && !comentarioCambio)}
            className="bg-brand-accent hover:bg-brand-accent/90 text-black text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>

        <button
          onClick={() => setMostrarDetalles(true)}
          className="bg-transparent border border-brand-border rounded-md text-brand-muted text-xs px-4 py-2 cursor-pointer hover:border-brand-accent hover:text-brand-accent transition whitespace-nowrap shrink-0"
        >
          Ver detalles →
        </button>

      </div>

      <div className="overflow-x-auto w-full border border-brand-border rounded-xl">
        <div className="min-w-200">
          <DataTable
            columns={columnasHistorial}
            data={historial}
            emptyMessage="Sin movimientos registrados."
            keyExtractor={(h) => h.id}
          />
        </div>
      </div>

      {mostrarDetalles && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-500 p-4 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setMostrarDetalles(false)}
              className="absolute top-4 right-4 bg-brand-bg/50 border-none text-brand-muted hover:text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer font-bold transition"
            >
              ✕
            </button>
            <h2 className="text-white text-lg font-bold mb-5 mt-0">Detalles del Trabajo</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-brand-muted text-xs uppercase tracking-wider">Profundidad Estimada</span>
                <span className="text-white text-sm">{trabajo.profundidad_estimada ? `${trabajo.profundidad_estimada}m` : "—"}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-brand-muted text-xs uppercase tracking-wider">Fecha de Inicio</span>
                  <span className="text-brand-accent font-bold text-sm">{formatDate(trabajo.fecha_inicio)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-brand-muted text-xs uppercase tracking-wider">Fecha de Fin</span>
                  <span className="text-emerald-500 font-bold text-sm">{formatDate(trabajo.fecha_fin)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-brand-muted text-xs uppercase tracking-wider">Observaciones Iniciales</span>
                <div className="bg-brand-bg border border-brand-border p-3 rounded-md text-brand-muted text-sm whitespace-pre-wrap min-h-20">
                  {trabajo.observaciones || "Sin observaciones registradas."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {dialogoEliminar.visible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-1000 p-4 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="bg-red-500/10 text-red-500 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-bold m-0 mb-2">¿Eliminar registro?</h3>
            <p className="text-brand-muted text-sm mb-6">Esta acción no se puede deshacer. El historial perderá este movimiento para siempre.</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDialogoEliminar({ visible: false, idHistorial: null })}
                className="flex-1 bg-transparent border border-brand-border text-brand-muted hover:text-white rounded-md py-2 cursor-pointer transition"
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarEliminarHistorial}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none rounded-md py-2 cursor-pointer transition font-bold"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}