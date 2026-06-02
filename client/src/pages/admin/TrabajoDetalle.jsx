// src/pages/admin/TrabajoDetalle.jsx
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

  // Estados para el comentario al cambiar de estado
  const [comentarioCambio, setComentarioCambio] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function fetchDetalle() {
      try {
        const resTrabajos = await apiFetch("/trabajos");
        const trabajosRaw = resTrabajos.data || [];
        const trabajosNormalizados = trabajosRaw.map(t => ({
          ...t,
          estado: normalizarEstado(t.estado),
        }));
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
        body: {
          estado_nuevo: estadoParaApi(nuevoEstado),
          notas: comentarioCambio.trim() || null, // envía null si está vacío
        },
      });
      // Limpiar comentario después de éxito
      setComentarioCambio("");
      // Actualizar localmente
      setTrabajo(prev => ({ ...prev, estado: nuevoEstado }));
      // Recargar historial
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
      await apiFetch(`/trabajos/${id}`, {
        method: "PUT",
        body: { precio: precioNumerico },
      });
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
    return (
      <div style={{ color: "#6B7280", padding: "32px", textAlign: "center" }}>
        Cargando trabajo...
      </div>
    );
  }

  if (error || !trabajo) {
    return (
      <div style={{ color: "#6B7280", padding: "32px", textAlign: "center" }}>
        <p>{error || "Trabajo no encontrado."}</p>
        <button onClick={() => navigate("/admin/trabajos")} style={{ color: "#F59E0B", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
          ← Volver a Trabajos
        </button>
      </div>
    );
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
          {trabajo.cliente_nombre} — {trabajo.tipo_servicio}
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          ID: {trabajo.id}
        </p>
      </div>

      {/* Datos generales */}
      <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", padding: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Cliente",         value: trabajo.cliente_nombre },
          { label: "Servicio",        value: trabajo.tipo_servicio },
          { label: "Ubicación",       value: trabajo.ubicacion },
          { label: "Profundidad",     value: trabajo.profundidad_estimada ? `${trabajo.profundidad_estimada}m` : "—" },
          { label: "Fecha inicio",    value: formatDate(trabajo.fecha_inicio) },
          { label: "Fecha fin",       value: formatDate(trabajo.fecha_fin) },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
            <span style={{ color: "#fff", fontSize: "14px" }}>{value}</span>
          </div>
        ))}

        {/* Estado */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div>
            <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Estado</span>
            <select
              value={trabajo.estado}
              onChange={(e) => cambiarEstado(e.target.value)}
              style={{
                marginTop: "4px",
                background: estadoConfig[trabajo.estado]?.bg ?? "#1a1a1a",
                color: estadoConfig[trabajo.estado]?.text ?? "#fff",
                border: "none", borderRadius: "999px",
                fontSize: "12px", padding: "4px 10px",
                cursor: "pointer", fontWeight: "500",
                width: "fit-content",
                display: "block",
              }}
            >
              {estadoOptions.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ color: "#6B7280", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Comentario (opcional)</span>
            <input
              type="text"
              value={comentarioCambio}
              onChange={(e) => setComentarioCambio(e.target.value)}
              placeholder="Motivo del cambio..."
              style={{
                background: "#0B0B0B",
                border: "1px solid #374151",
                borderRadius: "6px",
                padding: "6px 10px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                width: "100%",
                maxWidth: "220px",
              }}
            />
          </div>
        </div>

        {/* Precio editable */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Precio</span>
          {editandoPrecio ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="number"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                style={{
                  background: "#0B0B0B", border: "1px solid #374151",
                  borderRadius: "6px", padding: "6px 10px", color: "#fff",
                  fontSize: "14px", width: "120px", outline: "none",
                }}
              />
              <button
                onClick={guardarPrecio}
                style={{
                  background: "#F59E0B", color: "#000", border: "none",
                  borderRadius: "6px", padding: "6px 14px", fontSize: "13px",
                  fontWeight: "bold", cursor: "pointer",
                }}
              >
                Guardar
              </button>
              <button
                onClick={() => setEditandoPrecio(false)}
                style={{
                  background: "none", border: "1px solid #374151",
                  borderRadius: "6px", color: "#6B7280", fontSize: "13px",
                  padding: "6px 14px", cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ color: "#F59E0B", fontSize: "16px", fontWeight: "bold" }}>
                {trabajo.precio != null ? `$${Number(trabajo.precio).toLocaleString("es-AR")}` : "—"}
              </span>
              <button
                onClick={() => {
                  setNuevoPrecio(trabajo.precio ?? "");
                  setEditandoPrecio(true);
                }}
                style={{
                  background: "none", border: "1px solid #374151",
                  borderRadius: "6px", color: "#6B7280", fontSize: "12px",
                  padding: "4px 10px", cursor: "pointer",
                }}
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Historial */}
      <DataTable
        columns={columnasHistorial}
        data={historial}
        emptyMessage="Sin movimientos registrados."
        keyExtractor={(h) => h.id}
      />
    </div>
  );
}