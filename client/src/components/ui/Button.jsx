import PropTypes from "prop-types";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
}) {
  const base = "inline-flex items-center justify-center font-bold rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg";

  const variants = {
    primary:   "bg-brand-accent hover:bg-brand-accentDk text-black focus:ring-brand-accent",
    secondary: "bg-brand-surface hover:bg-brand-border text-white focus:ring-brand-border",
    outline:   "border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black focus:ring-brand-accent",
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
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};