import PropTypes from "prop-types";

export default function Badge({ estado, config, className = "" }) {
  const defaultConfig = { bg: "#1a1a1a", text: "#fff" };
  const { bg, text } = config[estado] || defaultConfig;

  return (
    <span
      className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
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
  className: PropTypes.string,
};