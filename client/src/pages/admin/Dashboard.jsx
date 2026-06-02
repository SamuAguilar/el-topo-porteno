// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { normalizarEstado } from "../../utils/formatters";
import KpiCard from "../../components/ui/KpiCard";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";

const cardColors = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

const estadoBadgeConfig = {
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280" },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6" },
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981" },
  "Finalizado":    { bg: "#1a1a3a", text: "#8B5CF6" },
  "En garantía":   { bg: "#2a2a1a", text: "#F59E0B" },
  "Cerrado":       { bg: "#1a2a1a", text: "#34D399" },
};

const columnsTrabajos = [
  { key: "cliente", label: "Cliente", render: (t) => t.cliente_nombre ?? t.cliente ?? "—", cellStyle: { color: "#fff", fontSize: "14px" } },
  { key: "tipo", label: "Tipo", render: (t) => t.tipo_servicio ?? "—", cellStyle: { color: "#6B7280", fontSize: "14px" } },
  { key: "ubicacion", label: "Ubicación", cellStyle: { color: "#6B7280", fontSize: "14px" } },
  {
    key: "estado",
    label: "Estado",
    render: (t) => <Badge estado={t.estado} config={estadoBadgeConfig} />,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trabajos, setTrabajos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function fetchData() {
      try {
        const dataStats = await apiFetch("/dashboard/stats");
        if (cancelado) return;

        // La API devuelve { leads_nuevos, clientes_totales, trabajos_activos }
        const leadsNuevos = dataStats.leads_nuevos ?? 0;
        const clientesActivos = dataStats.clientes_totales ?? 0;
        const trabajosActivos = dataStats.trabajos_activos ?? 0;

        // Para "Trabajos cerrados" necesitamos todos los trabajos
        const dataTrabajos = await apiFetch("/trabajos");
        if (cancelado) return;

        const todosTrabajos = Array.isArray(dataTrabajos.data)
          ? dataTrabajos.data.map(t => ({ ...t, estado: normalizarEstado(t.estado) }))
          : [];

        const enCurso = todosTrabajos.filter(
          t => t.estado === "En ejecución" || t.estado === "Aceptado"
        );

        // Consideramos "cerrados" a los que están en estado Finalizado o Cerrado
        const cerrados = todosTrabajos.filter(
          t => t.estado === "Finalizado" || t.estado === "Cerrado"
        ).length;

        const tarjetas = [
          { label: "Leads",       value: leadsNuevos,       color: cardColors[0] },
          { label: "Clientes",   value: clientesActivos,   color: cardColors[1] },
          { label: "Trabajos en curso",  value: trabajosActivos,   color: cardColors[2] },
          { label: "Trabajos cerrados",  value: cerrados,          color: cardColors[3] },
        ];

        setStats(tarjetas);
        setTrabajos(enCurso);
        setError("");
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError("No se pudieron cargar los datos del panel.");
        }
      }
    }

    fetchData();
    return () => { cancelado = true; };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Resumen general del negocio
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

      {/* KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
      }}>
        {stats === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <KpiCard key={i} loading label="" value="" />
            ))
          : stats.map((s) => (
              <KpiCard
                key={s.label}
                label={s.label}
                value={s.value}
                sub={s.sub}
                color={s.color}
              />
            ))}
      </div>

      {/* Trabajos en curso */}
      <DataTable
        columns={columnsTrabajos}
        data={trabajos ?? []}
        loading={trabajos === null}
        emptyMessage="No hay trabajos en curso."
        keyExtractor={(t) => t.id}
      />

      {/* Botón "Ver todos" (lo mantenemos fuera de la tabla por si queremos personalizarlo) */}
      {trabajos && trabajos.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/admin/trabajos")}
            style={{
              background: "none",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#F59E0B",
              fontSize: "12px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Ver todos →
          </button>
        </div>
      )}
    </div>
  );
}