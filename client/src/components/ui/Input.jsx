import PropTypes from "prop-types";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-white text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`bg-brand-bg text-white text-sm rounded-lg px-3.5 py-2.5 outline-none border transition
          ${error ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-brand-border focus:ring-2 focus:ring-brand-accent"}
          ${className}`}
      />
      {error && error !== " " && (
        <p className="text-red-400 text-xs mt-0.5">{error}</p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};