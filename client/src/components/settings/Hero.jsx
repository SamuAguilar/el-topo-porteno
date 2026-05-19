import Button from "../ui/Button";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center justify-center text-center bg-[#0B0B0B] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/60 to-[#0B0B0B] z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/foto-gratis/vista-maquinaria-pesada-utilizada-industria-construccion_23-2151307824.jpg')",
        }}
      />
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Soluciones de{" "}
          <span className="text-[#F59E0B]">Excavación</span>{" "}
          Profesionales
        </h1>
        <p className="text-[#6B7280] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Transformamos terrenos y construimos bases sólidas. Servicios
          eficientes de Excavación, Zanjeo y Limpieza de Pozos en toda la región.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Button
  variant="primary"
  size="lg"
  onClick={() => {
    const el = document.getElementById("contacto");
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }}
>
  Solicitar Cotización
</Button>
        </div>
      </div>
    </section>
  );
}
