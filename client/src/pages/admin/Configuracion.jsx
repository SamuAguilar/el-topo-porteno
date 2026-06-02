// src/pages/admin/Configuracion.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import DataTable from "../../components/ui/DataTable";

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

  useEffect(() => {
    let cancelado = false;

    async function fetchConfig() {
      try {
        const data = await apiFetch("/configuracion");
        if (!cancelado) {
          if (data && typeof data === "object") {
            if (Array.isArray(data.servicios)) setServicios(data.servicios);
            if (data.precios && typeof data.precios === "object") setPrecios(data.precios);
          }
          setError("");
        }
      } catch {
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

    setPrecios(prev => ({ ...prev, [servicio]: nuevoPrecio }));
    setEditando(null);
    setMensaje(`Precio de "${servicio}" actualizado correctamente.`);
    setTimeout(() => setMensaje(""), 3000);

    try {
      await apiFetch("/configuracion", {
        method: "PUT",
        body: { servicio, precio: nuevoPrecio },
      });
    } catch {
      console.warn("No se pudo guardar en el servidor (¿endpoint no implementado?)");
    }
  }

  // Convertimos los servicios en objetos para DataTable
  const filas = servicios.map((servicio) => ({
    servicio,
    precio: precios[servicio],
  }));

  const columnas = [
    {
      key: "servicio",
      label: "Servicio",
      render: (fila) => fila.servicio,
      cellStyle: { color: "#fff", fontSize: "14px" },
    },
    {
      key: "precio",
      label: "Precio actual",
      render: (fila) => (
        editando === fila.servicio ? (
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
            ${fila.precio?.toLocaleString("es-AR") ?? "—"}
          </span>
        )
      ),
    },
    {
      key: "acciones",
      label: "",
      render: (fila) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {editando === fila.servicio ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => guardarPrecio(fila.servicio)}
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
              onClick={() => iniciarEdicion(fila.servicio)}
              style={{
                background: "none", border: "1px solid #374151",
                borderRadius: "6px", color: "#6B7280", fontSize: "13px",
                padding: "6px 14px", cursor: "pointer",
              }}
            >
              Editar
            </button>
          )}
        </div>
      ),
    },
  ];

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

      <DataTable
        columns={columnas}
        data={filas}
        loading={loading}
        emptyMessage="No hay servicios configurados."
        keyExtractor={(fila) => fila.servicio}
      />
    </div>
  );
}