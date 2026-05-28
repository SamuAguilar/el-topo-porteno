// src/pages/admin/TrabajoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate, normalizarEstado, estadoParaApi } from "../../utils/formatters";

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

  useEffect(() => {
    let cancelado = false;

    async function fetchDetalle() {
      try {
        // Obtener la lista de trabajos y buscar el que coincida con el id
        const resTrabajos = await apiFetch("/trabajos");
        const trabajosRaw = resTrabajos.data || [];
        // Normalizar estados de todos los trabajos
        const trabajosNormalizados = trabajosRaw.map(t => ({
          ...t,
          estado: normalizarEstado(t.estado),
        }));
        const trabajoActual = trabajosNormalizados.find(t => t.id === parseInt(id));

        if (!trabajoActual) throw new Error("Trabajo no encontrado");

        // Obtener historial
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
        body: { estado_nuevo: estadoParaApi(nuevoEstado) },
      });
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
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Estado</span>
          <select
            value={trabajo.estado}
            onChange={(e) => cambiarEstado(e.target.value)}
            style={{
              background: estadoConfig[trabajo.estado]?.bg ?? "#1a1a1a",
              color: estadoConfig[trabajo.estado]?.text ?? "#fff",
              border: "none", borderRadius: "999px",
              fontSize: "12px", padding: "4px 10px",
              cursor: "pointer", fontWeight: "500",
              width: "fit-content",
            }}
          >
            {estadoOptions.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Historial */}
      <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #374151" }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "bold", margin: 0 }}>Historial de cambios</h2>
        </div>
        {historial.length === 0 ? (
          <div style={{ padding: "24px 20px", color: "#6B7280", fontSize: "14px" }}>
            Sin movimientos registrados.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #374151" }}>
                {["Fecha", "Estado anterior", "Estado nuevo", "Usuario", "Comentario"].map((h) => (
                  <th key={h} style={{ color: "#6B7280", fontSize: "11px", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historial.map((entry, i) => (
                <tr key={entry.id || i} style={{ borderBottom: i < historial.length - 1 ? "1px solid #374151" : "none" }}>
                  <td style={{ padding: "10px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {formatDate(entry.fecha_cambio)}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      background: estadoConfig[entry.estado_anterior]?.bg ?? "#1a1a1a",
                      color: estadoConfig[entry.estado_anterior]?.text ?? "#fff",
                      fontSize: "12px", padding: "3px 10px", borderRadius: "999px", fontWeight: "500",
                    }}>
                      {entry.estado_anterior}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      background: estadoConfig[entry.estado_nuevo]?.bg ?? "#1a1a1a",
                      color: estadoConfig[entry.estado_nuevo]?.text ?? "#fff",
                      fontSize: "12px", padding: "3px 10px", borderRadius: "999px", fontWeight: "500",
                    }}>
                      {entry.estado_nuevo}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {entry.modificado_por ?? "—"}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#fff", fontSize: "13px" }}>
                    {entry.comentario ?? "—"}
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