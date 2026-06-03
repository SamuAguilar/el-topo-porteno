export default function Features() {
  const servicios = [
    {
      titulo: "Excavación",
      descripcion: "Pozos sépticos y de agua con maquinaria especializada.",
      icono: "🏗️",
    },
    {
      titulo: "Sanjeo",
      descripcion: "Zanjeo técnico para instalaciones de gas y cañerías.",
      icono: "⚙️",
    },
    {
      titulo: "Limpieza de Pozos",
      descripcion: "Mantenimiento y limpieza de pozos ciegos.",
      icono: "💧",
    },
  ];

  return (
    <section id="servicios" className="py-20 px-6 bg-brand-bg border-t border-brand-surface">
      <div className="max-w-6xl mx-auto text-center">
        <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
          Servicios
        </span>
        <h2 className="text-white text-3xl md:text-4xl font-bold mt-2 mb-12">
          ¿Qué hacemos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((s) => (
            <div
              key={s.titulo}
              className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center hover:border-brand-accent transition"
            >
              <div className="text-4xl mb-4">{s.icono}</div>
              <h3 className="text-white text-lg font-bold mb-2">{s.titulo}</h3>
              <p className="text-brand-muted text-sm">{s.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}