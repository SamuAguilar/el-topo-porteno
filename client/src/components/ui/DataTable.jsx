import PropTypes from "prop-types";

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No hay datos disponibles.",
  keyExtractor = (item) => item.id,
  onRowClick,
  className = "",
}) {
  return (
    <div className={`bg-brand-surface border border-brand-border rounded-xl overflow-hidden ${className}`}>
      {loading ? (
        <div className="p-8 text-center text-brand-muted text-sm">
          Cargando...
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-brand-muted text-sm">
          {emptyMessage}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-brand-muted text-xs text-left px-4 py-2.5 uppercase tracking-wider font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors hover:bg-[#263244] cursor-${onRowClick ? "pointer" : "default"}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm"
                    style={col.cellStyle}
                  >
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
  className: PropTypes.string,
};