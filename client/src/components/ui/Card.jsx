import PropTypes from "prop-types";

export default function Card({ title, subtitle, icon, children, variant = "default" }) {
  const variants = {
    default:     "bg-brand-surface border border-brand-border",
    highlighted: "bg-brand-surface border-2 border-brand-accent",
    dark:        "bg-brand-bg border border-brand-surface",
  };

  return (
    <div className={`rounded-xl p-6 flex flex-col gap-3 ${variants[variant]}`}>
      {icon && (
        <span className="text-3xl">{icon}</span>
      )}
      <div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        {subtitle && <p className="text-brand-accent text-sm font-medium mt-0.5">{subtitle}</p>}
      </div>
      <p className="text-brand-muted text-sm leading-relaxed">{children}</p>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf(["default", "highlighted", "dark"]),
};