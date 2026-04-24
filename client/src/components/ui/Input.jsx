export default function Input({ placeholder, label, error, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-white text-sm font-medium">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          bg-[#1F2937] text-white placeholder-[#6B7280] text-sm
          border rounded px-4 py-2.5 w-full
          focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent
          transition
          ${error ? "border-red-500" : "border-[#374151] hover:border-[#6B7280]"}
        `}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
