import Card from "../ui/Card";

const servicios = [
  {
    icon: "⛏️",
    title: "Excavación",
    subtitle: "Pozos Sépticos y de Agua",
    description:
      "Realizamos excavaciones de pozos sépticos y pozos de agua con maquinaria profesional. Adaptamos la profundidad según los requerimientos técnicos de cada obra.",
    variant: "default",
    //variant: "highlighted",
  },
  {
    icon: "🪛",
    title: "Zanjeo",
    subtitle: "Instalaciones y Cañerías",
    description:
      "Apertura de zanjas para instalaciones de cañerías, cables y servicios. Trabajo preciso y eficiente para minimizar el impacto en el terreno.",
    variant: "default",
  },
  {
    icon: "🧹",
    title: "Limpieza de Pozos",
    subtitle: "Mantenimiento Profesional",
    description:
      "Limpieza y mantenimiento de pozos ciegos y absorbentes. Servicio rápido con equipamiento especializado para garantizar el correcto funcionamiento.",
    variant: "default",
  },
];

export default function Features() {
  return (
    <section id="servicios" className="bg-[#0B0B0B] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-widest">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            ¿Qué hacemos?
          </h2>
          <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
            Más de 10 años brindando soluciones de excavación profesionales en
            Buenos Aires y alrededores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <Card key={s.title} title={s.title} subtitle={s.subtitle} icon={s.icon} variant={s.variant}>
              {s.description}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
