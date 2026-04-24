import Header from "../../components/layout/Header";
import Hero from "../../components/settings/Hero";
import Features from "../../components/settings/Features";
import FAQ from "../../components/settings/FAQ";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <FAQ />

      {/* ── SHOWCASE DE COMPONENTES ──────────────────────────────── */}
      <section className="bg-[#0B0B0B] py-20 px-6 border-t border-[#1F2937]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-widest">
              Design System
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              Catálogo de Componentes
            </h2>
            <p className="text-[#6B7280] mt-2 text-sm">
              Componentes reutilizables usados en toda la aplicación.
            </p>
          </div>

          {/* Botones */}
          <div className="mb-10">
            <h3 className="text-[#6B7280] text-xs uppercase tracking-widest mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Primario</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-10">
            <h3 className="text-[#6B7280] text-xs uppercase tracking-widest mb-4">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Sin label" />
              <Input label="Con label" placeholder="Tu nombre completo" />
              <Input label="Con error" placeholder="Tu email" error="El correo no es válido." />
              <Input label="Tipo teléfono" type="tel" placeholder="+54 11 0000-0000" />
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-[#6B7280] text-xs uppercase tracking-widest mb-4">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Default" variant="default">
                Variante estándar para contenido general.
              </Card>
              <Card title="Highlighted" variant="highlighted" icon="⭐">
                Variante destacada con borde amarillo.
              </Card>
              <Card title="Dark" variant="dark" icon="🔧" subtitle="Con subtítulo">
                Variante oscura para fondos claros.
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
