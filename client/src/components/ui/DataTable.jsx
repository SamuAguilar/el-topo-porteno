// src/components/ui/DataTable.jsx
import PropTypes from "prop-types";

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No hay datos disponibles.",
  keyExtractor = (item) => item.id,
  onRowClick,
}) {
  return (
    <div style={{
      background: "#1F2937",
      border: "1px solid #374151",
      borderRadius: "10px",
      overflow: "hidden",
    }}>
      {loading ? (
        <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
          Cargando...
        </div>
      ) : data.length === 0 ? (
        <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
          {emptyMessage}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              {columns.map((col) => (
                <th key={col.key} style={{
                  color: "#6B7280", fontSize: "11px", textAlign: "left",
                  padding: "10px 16px", textTransform: "uppercase",
                  letterSpacing: "0.05em", fontWeight: "600",
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={keyExtractor(item)}
                style={{
                  borderBottom: i < data.length - 1 ? "1px solid #374151" : "none",
                  transition: "background 0.15s",
                  cursor: onRowClick ? "pointer" : "default",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#263244"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "12px 16px", ...col.cellStyle }}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      cellStyle: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  keyExtractor: PropTypes.func,
  onRowClick: PropTypes.func,
};