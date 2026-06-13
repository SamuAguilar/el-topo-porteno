import PropTypes from "prop-types";

export default function KpiCard({ label, value, sub, color, loading = false, className = "" }) {
  if (loading) {
    return (
      <div className={`bg-brand-surface border border-brand-border rounded-xl p-5 opacity-50 animate-pulse ${className}`}>
        <div className="bg-brand-border h-3 w-3/5 rounded mb-3" />
        <div className="bg-brand-border h-7 w-2/5 rounded mb-2" />
        <div className="bg-brand-border h-2.5 w-1/2 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`bg-brand-surface border border-brand-border rounded-xl p-5 ${className}`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <p className="text-brand-muted text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className="text-white text-3xl font-bold mb-1 leading-none">{value}</p>
      <p className="text-brand-muted text-xs m-0">{sub}</p>
    </div>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string,
  color: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
};