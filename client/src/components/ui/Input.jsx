// src/components/ui/Input.jsx
import PropTypes from "prop-types";

export default function Input({ label, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          background: "#0B0B0B",
          border: `1px solid ${error ? "#EF4444" : "#374151"}`,
          borderRadius: "6px",
          padding: "10px 14px",
          color: "#fff",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
};