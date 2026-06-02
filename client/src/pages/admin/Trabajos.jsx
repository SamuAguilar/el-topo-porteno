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
const servicioOptions = ["Todos", "Excavacion", "Sanjeo", "Limpieza"];

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
          const trabajosNormalizados = trabajosRaw.map(t => ({
            ...t,
            estado: normalizarEstado(t.estado),
          }));
          setTrabajos(trabajosNormalizados);
          setError("");
        }
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError("No se pudieron cargar los trabajos.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    fetchTrabajos();
    return () => { cancelado = true; };
  }, []);

  const filtrados = trabajos.filter((t) => {
    const matchEstado = filtroEstado === "Todos" || t.estado === filtroEstado;
    const matchServicio =
      filtroServicio === "Todos" ||
      t.tipo_servicio === filtroServicio;
    return matchEstado && matchServicio;
  });

  async function cambiarEstado(id, nuevoEstado) {
    try {
      await apiFetch(`/trabajos/${id}/estado`, {
        method: "PUT",
        body: { estado_nuevo: estadoParaApi(nuevoEstado) },
      });
      setTrabajos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, estado: nuevoEstado } : t
        )
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo actualizar el estado.");
    }
  }

  const columnas = [
    {
      key: "cliente",
      label: "Cliente",
      render: (t) => t.cliente_nombre ?? "—",
      cellStyle: { color: "#fff", fontSize: "14px" },
    },
    {
      key: "servicio",
      label: "Servicio",
      render: (t) => t.tipo_servicio ?? "—",
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "ubicacion",
      label: "Ubicación",
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "profundidad",
      label: "Prof.",
      render: (t) => (t.profundidad_estimada != null ? `${t.profundidad_estimada}m` : "—"),
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "estado",
      label: "Estado",
      render: (t) => (
        <select
          value={t.estado}
          onChange={(e) => cambiarEstado(t.id, e.target.value)}
          style={{
            background: estadoConfig[t.estado]?.bg ?? "#1a1a1a",
            color: estadoConfig[t.estado]?.text ?? "#fff",
            border: "none",
            borderRadius: "999px",
            fontSize: "12px",
            padding: "4px 10px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {estadoOptions.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (t) =>
        t.precio != null ? `$${Number(t.precio).toLocaleString("es-AR")}` : "—",
      cellStyle: { color: "#6B7280", fontSize: "14px", fontWeight: "bold" },
    },
    {
      key: "inicio",
      label: "Inicio",
      render: (t) => formatDate(t.fecha_inicio),
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "fin",
      label: "Fin",
      render: (t) => formatDate(t.fecha_fin),
      cellStyle: { color: "#6B7280", fontSize: "13px" },
    },
    {
      key: "acciones",
      label: "",
      render: (t) => (
        <button
          onClick={() => navigate(`/admin/trabajos/${t.id}`)}
          style={{
            background: "none", border: "1px solid #374151",
            borderRadius: "6px", color: "#6B7280",
            fontSize: "12px", padding: "5px 12px", cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.color = "#F59E0B"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#6B7280"; }}
        >
          Ver
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Trabajos
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Todos los trabajos y pozos registrados
        </p>
      </div>

      {error && (
        <div style={{
          background: "#2a1a1a", border: "1px solid #EF4444",
          borderRadius: "6px", color: "#EF4444", padding: "12px 16px", fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            background: "#1F2937", border: "1px solid #374151", borderRadius: "6px",
            color: "#fff", fontSize: "13px", padding: "7px 12px", cursor: "pointer",
          }}
        >
          <option value="Todos">Todos los estados</option>
          {estadoOptions.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>

        <select
          value={filtroServicio}
          onChange={(e) => setFiltroServicio(e.target.value)}
          style={{
            background: "#1F2937", border: "1px solid #374151", borderRadius: "6px",
            color: "#fff", fontSize: "13px", padding: "7px 12px", cursor: "pointer",
          }}
        >
          <option value="Todos">Todos los servicios</option>
          {servicioOptions.filter(op => op !== "Todos").map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columnas}
        data={filtrados}
        loading={loading}
        emptyMessage="No hay trabajos que coincidan con los filtros."
        keyExtractor={(item) => item.id}
      />
    </div>
  );
}