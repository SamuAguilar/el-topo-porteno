// src/components/ui/KpiCard.jsx
import PropTypes from "prop-types";

export default function KpiCard({ label, value, sub, color, loading = false }) {
  if (loading) {
    return (
      <div style={{
        background: "#1F2937", border: "1px solid #374151",
        borderRadius: "10px", padding: "20px", opacity: 0.5,
      }}>
        <div style={{ background: "#374151", height: 12, width: "60%", borderRadius: 4, marginBottom: 12 }} />
        <div style={{ background: "#374151", height: 28, width: "40%", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ background: "#374151", height: 10, width: "50%", borderRadius: 4 }} />
      </div>
    );
  }

  return (
    <div style={{
      background: "#1F2937",
      border: `1px solid #374151`,
      borderRadius: "10px",
      padding: "20px",
      borderLeft: `4px solid ${color}`,
    }}>
      <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p style={{ color: "#fff", fontSize: "32px", fontWeight: "bold", margin: "0 0 4px 0", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ color: "#6B7280", fontSize: "12px", margin: 0 }}>
        {sub}
      </p>
    </div>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string,
  color: PropTypes.string,
  loading: PropTypes.bool,
};