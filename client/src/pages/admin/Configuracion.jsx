// src/pages/admin/Configuracion.jsx
import { useState } from "react";

const servicios = [
  "Excavación — Pozo séptico",
  "Excavación — Pozo de agua",
  "Sanjeo",
  "Limpieza de pozos",
];

const preciosIniciales = {
  "Excavación — Pozo séptico": 85000,
  "Excavación — Pozo de agua": 95000,
  "Sanjeo": 60000,
  "Limpieza de pozos": 35000,
};

export default function Configuracion() {
  const [precios, setPrecios] = useState(preciosIniciales);
  const [editando, setEditando] = useState(null); // nombre del servicio en edición
  const [valorEdit, setValorEdit] = useState("");
  const [mensaje, setMensaje] = useState("");

  function iniciarEdicion(servicio) {
    setEditando(servicio);
    setValorEdit(precios[servicio].toString());
    setMensaje("");
  }

  function cancelarEdicion() {
    setEditando(null);
    setValorEdit("");
  }

  function guardarPrecio(servicio) {
    const nuevoPrecio = parseFloat(valorEdit);
    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
      setMensaje("Ingresá un valor numérico válido.");
      return;
    }
    setPrecios({ ...precios, [servicio]: nuevoPrecio });
    setEditando(null);
    setMensaje(`Precio de "${servicio}" actualizado correctamente.`);
    setTimeout(() => setMensaje(""), 3000);
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

      {mensaje && (
        <div style={{
          background: "#14532d", border: "1px solid #10B981", borderRadius: "6px",
          color: "#10B981", fontSize: "14px", padding: "10px 16px",
        }}>
          {mensaje}
        </div>
      )}

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
                      ${precios[servicio].toLocaleString("es-AR")}
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
    </div>
  );
}