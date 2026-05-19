import PropTypes from 'prop-types';   // ← import al inicio

export default function Button({ children, variant = "primary", size = "md", onClick, type = "button" }) {
  const base = "inline-flex items-center justify-center font-bold rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0B0B]";

  const variants = {
    primary:   "bg-[#F59E0B] hover:bg-[#D97706] text-black focus:ring-[#F59E0B]",
    secondary: "bg-[#1F2937] hover:bg-[#374151] text-white focus:ring-[#374151]",
    outline:   "border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black focus:ring-[#F59E0B]",
    danger:    "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

// Validación de props
Button.propTypes = {
  children: PropTypes.node.isRequired,       // contenido del botón
  variant:  PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  size:     PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick:  PropTypes.func,
  type:     PropTypes.string,
};