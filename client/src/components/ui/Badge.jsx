// src/components/ui/Badge.jsx
import PropTypes from "prop-types";

const defaultConfig = { bg: "#1a1a1a", text: "#fff" };

export default function Badge({ estado, config }) {
  const { bg, text } = config[estado] || defaultConfig;

  return (
    <span style={{
      background: bg,
      color: text,
      fontSize: "12px",
      padding: "3px 10px",
      borderRadius: "999px",
      fontWeight: "500",
      whiteSpace: "nowrap",
    }}>
      {estado}
    </span>
  );
}

Badge.propTypes = {
  estado: PropTypes.string.isRequired,
  config: PropTypes.objectOf(
    PropTypes.shape({
      bg: PropTypes.string,
      text: PropTypes.string,
    })
  ).isRequired,
};