// src/pages/admin/GestionContactos.jsx
import { useState } from "react";

const leads = [
  { id: 1,  nombre: "Carlos Méndez",   whatsapp: "5491112345678", email: "carlos@gmail.com",  servicio: "Excavación", descripcion: "Pozo séptico de 3 metros",         estado: "Nuevo",                 fecha: "12/05/2026", tipo: "lead"    },
  { id: 2,  nombre: "Laura Gómez",     whatsapp: "5491187654321", email: "laura@gmail.com",   servicio: "Sanjeo",     descripcion: "Zanja para instalación de gas",    estado: "Contactado",            fecha: "11/05/2026", tipo: "lead"    },
  { id: 3,  nombre: "Martín Herrera",  whatsapp: "5491198765432", email: "martin@gmail.com",  servicio: "Limpieza",   descripcion: "Limpieza de pozo ciego",           estado: "Nuevo",                 fecha: "10/05/2026", tipo: "lead"    },
  { id: 4,  nombre: "Sofía Ramos",     whatsapp: "5491176543210", email: "sofia@gmail.com",   servicio: "Excavación", descripcion: "Pozo de agua, 5 metros",           estado: "Cerrado no concretado", fecha: "09/05/2026", tipo: "lead"    },
  { id: 5,  nombre: "Ana Suárez",      whatsapp: "5491134567890", email: "ana@gmail.com",     servicio: "Sanjeo",     descripcion: "Zanja perimetral para cañería",    estado: "Cerrado exitoso",       fecha: "05/05/2026", tipo: "cliente" },
  { id: 6,  nombre: "Jorge Villalba",  whatsapp: "5491145678901", email: "jorge@gmail.com",   servicio: "Limpieza",   descripcion: "Limpieza y mantenimiento",         estado: "Cerrado exitoso",       fecha: "02/05/2026", tipo: "cliente" },
  { id: 7,  nombre: "Roberto Díaz",    whatsapp: "5491156789012", email: "roberto@gmail.com", servicio: "Excavación", descripcion: "Pozo séptico doble cámara",        estado: "Cerrado exitoso",       fecha: "28/04/2026", tipo: "cliente" },
];

const estadoConfig = {
  "Nuevo":                 { bg: "#1a2a1a", text: "#10B981" },
  "Contactado":            { bg: "#1a2a3a", text: "#3B82F6" },
  "Cerrado exitoso":       { bg: "#1a1a3a", text: "#8B5CF6" },
  "Cerrado no concretado": { bg: "#2a1a1a", text: "#EF4444" },
};

const tabs = ["Todos", "Leads", "Clientes"];

const estadoOptions = [
  "Nuevo",
  "Contactado",
  "Cerrado exitoso",
  "Cerrado no concretado",
];

export default function GestionContactos() {
  const [tabActiva, setTabActiva] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [data, setData] = useState(leads);

  const filtrados = data.filter((c) => {
    const matchTab =
      tabActiva === "Todos" ||
      (tabActiva === "Leads" && c.tipo === "lead") ||
      (tabActiva === "Clientes" && c.tipo === "cliente");
    const matchEstado = filtroEstado === "Todos" || c.estado === filtroEstado;
    return matchTab && matchEstado;
  });

  function cambiarEstado(id, nuevoEstado) {
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Encabezado */}
      <div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Gestión de Contactos
        </h1>
        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
          Leads y clientes registrados
        </p>
      </div>

      {/* Tabs + Filtro */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", background: "#1F2937", borderRadius: "8px", padding: "4px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              style={{
                background: tabActiva === tab ? "#374151" : "none",
                border: "none",
                borderRadius: "6px",
                color: tabActiva === tab ? "#fff" : "#6B7280",
                fontSize: "13px",
                fontWeight: tabActiva === tab ? "600" : "400",
                padding: "6px 16px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filtro estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            background: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "13px",
            padding: "7px 12px",
            cursor: "pointer",
          }}
        >
          <option value="Todos">Todos los estados</option>
          {estadoOptions.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div style={{
        background: "#1F2937",
        border: "1px solid #374151",
        borderRadius: "10px",
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              {["Nombre", "WhatsApp", "Servicio", "Descripción", "Estado", "Fecha", ""].map((h) => (
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
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
                  No hay contactos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              filtrados.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: i < filtrados.length - 1 ? "1px solid #374151" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#263244"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Nombre + tipo */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#fff", fontSize: "14px" }}>{c.nombre}</div>
                    <div style={{
                      display: "inline-block",
                      marginTop: "3px",
                      background: c.tipo === "lead" ? "#1a2a1a" : "#1a1a3a",
                      color: c.tipo === "lead" ? "#10B981" : "#8B5CF6",
                      fontSize: "10px",
                      padding: "1px 8px",
                      borderRadius: "999px",
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}>
                      {c.tipo}
                    </div>
                  </td>

                  {/* WhatsApp */}
                  <td style={{ padding: "12px 16px" }}>
                    <a
                      href={`https://wa.me/${c.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#10B981", fontSize: "13px", textDecoration: "none" }}
                    >
                      💬 {c.whatsapp}
                    </a>
                  </td>

                  {/* Servicio */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {c.servicio}
                  </td>

                  {/* Descripción */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px", maxWidth: "200px" }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {c.descripcion}
                    </span>
                  </td>

                  {/* Estado */}
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={c.estado}
                      onChange={(e) => cambiarEstado(c.id, e.target.value)}
                      style={{
                        background: estadoConfig[c.estado]?.bg ?? "#1a1a1a",
                        color: estadoConfig[c.estado]?.text ?? "#fff",
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
                  </td>

                  {/* Fecha */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>
                    {c.fecha}
                  </td>

                  {/* Email */}
                  <td style={{ padding: "12px 16px" }}>
                    <a
                      href={`mailto:${c.email}`}
                      style={{ color: "#6B7280", fontSize: "12px", textDecoration: "none" }}
                      title={c.email}
                    >
                      ✉️
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}