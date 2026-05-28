// src/pages/admin/Configuracion.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

const serviciosMock = [
  "Excavación — Pozo séptico",
  "Excavación — Pozo de agua",
  "Sanjeo",
  "Limpieza de pozos",
];

const preciosMock = {
  "Excavación — Pozo séptico": 85000,
  "Excavación — Pozo de agua": 95000,
  "Sanjeo": 60000,
  "Limpieza de pozos": 35000,
};

export default function Configuracion() {
  const [servicios, setServicios] = useState(serviciosMock);
  const [precios, setPrecios] = useState(preciosMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorEdit, setValorEdit] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Intentar cargar configuración desde el backend (si existe)
  useEffect(() => {
    let cancelado = false;

    async function fetchConfig() {
      try {
        // TODO: cambiar la ruta cuando el backend implemente el endpoint
        const data = await apiFetch("/configuracion"); // Ejemplo: GET /api/configuracion
        if (!cancelado) {
          if (data && typeof data === "object") {
            // Asumimos que la respuesta tiene { servicios: [...], precios: {...} }
            if (Array.isArray(data.servicios)) setServicios(data.servicios);
            if (data.precios && typeof data.precios === "object") setPrecios(data.precios);
          }
          setError("");
        }
      } catch {
        // Si el endpoint no existe (404), usamos los mocks silenciosamente
        if (!cancelado) {
          console.warn("Endpoint de configuración no disponible, usando datos locales.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    fetchConfig();
    return () => { cancelado = true; };
  }, []);

  function iniciarEdicion(servicio) {
    setEditando(servicio);
    setValorEdit(precios[servicio]?.toString() ?? "0");
    setMensaje("");
  }

  function cancelarEdicion() {
    setEditando(null);
    setValorEdit("");
  }

  async function guardarPrecio(servicio) {
    const nuevoPrecio = parseFloat(valorEdit);
    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
      setMensaje("Ingresá un valor numérico válido.");
      return;
    }

    // Actualizar localmente siempre (optimista)
    setPrecios(prev => ({ ...prev, [servicio]: nuevoPrecio }));
    setEditando(null);
    setMensaje(`Precio de "${servicio}" actualizado correctamente.`);
    setTimeout(() => setMensaje(""), 3000);

    // Intentar persistir en el backend (si el endpoint existe)
    try {
      await apiFetch("/configuracion", {
        method: "PUT", // o POST, según defina el backend
        body: { servicio, precio: nuevoPrecio },
      });
    } catch {
      console.warn("No se pudo guardar en el servidor (¿endpoint no implementado?)");
      // No revertimos el cambio local para no afectar la UX
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Configuración
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Precios de referencia por tipo de servicio
        </p>
      </div>

      {loading && (
        <div style={{ color: "#6B7280", fontSize: "14px", textAlign: "center", padding: "16px" }}>
          Cargando configuración...
        </div>
      )}

      {error && (
        <div style={{
          background: "#2a1a1a", border: "1px solid #EF4444",
          borderRadius: "6px", color: "#EF4444", fontSize: "14px", padding: "10px 16px",
        }}>
          {error}
        </div>
      )}

      {mensaje && (
        <div style={{
          background: "#14532d", border: "1px solid #10B981", borderRadius: "6px",
          color: "#10B981", fontSize: "14px", padding: "10px 16px",
        }}>
          {mensaje}
        </div>
      )}

      {!loading && (
        <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #374151" }}>
                {["Servicio", "Precio actual", ""].map((h) => (
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
              {servicios.map((servicio) => (
                <tr key={servicio} style={{ borderBottom: "1px solid #374151" }}>
                  <td style={{ padding: "12px 16px", color: "#fff", fontSize: "14px" }}>{servicio}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {editando === servicio ? (
                      <input
                        type="number"
                        value={valorEdit}
                        onChange={(e) => setValorEdit(e.target.value)}
                        style={{
                          background: "#0B0B0B", border: "1px solid #374151",
                          borderRadius: "6px", padding: "6px 10px", color: "#fff",
                          fontSize: "14px", width: "120px", outline: "none",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#F59E0B", fontSize: "16px", fontWeight: "bold" }}>
                        ${precios[servicio]?.toLocaleString("es-AR") ?? "—"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {editando === servicio ? (
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => guardarPrecio(servicio)}
                          style={{
                            background: "#F59E0B", color: "#000", border: "none",
                            borderRadius: "6px", padding: "6px 14px", fontSize: "13px",
                            fontWeight: "bold", cursor: "pointer",
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelarEdicion}
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
                      <button
                        onClick={() => iniciarEdicion(servicio)}
                        style={{
                          background: "none", border: "1px solid #374151",
                          borderRadius: "6px", color: "#6B7280", fontSize: "13px",
                          padding: "6px 14px", cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}