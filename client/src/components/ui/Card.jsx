export default function Card({ title, subtitle, icon, children, variant = "default" }) {
  const variants = {
    default:     "bg-[#1F2937] border border-[#374151]",
    highlighted: "bg-[#1F2937] border-2 border-[#F59E0B]",
    dark:        "bg-[#0B0B0B] border border-[#1F2937]",
  };

  return (
    <div className={`rounded-xl p-6 flex flex-col gap-3 ${variants[variant]}`}>
      {icon && (
        <span className="text-3xl">{icon}</span>
      )}
      <div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        {subtitle && <p className="text-[#F59E0B] text-sm font-medium mt-0.5">{subtitle}</p>}
      </div>
      <p className="text-[#6B7280] text-sm leading-relaxed">{children}</p>
    </div>
  );
}
