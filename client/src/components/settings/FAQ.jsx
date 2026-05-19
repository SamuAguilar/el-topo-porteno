import { useState } from "react";

const faqs = [
  {
    q: "¿En qué zonas trabajan?",
    a: "Operamos en CABA y todo el Gran Buenos Aires. Para obras fuera de esa área consultanos directamente por WhatsApp.",
  },
  {
    q: "¿Cómo solicito una cotización?",
    a: "Completá el formulario en nuestra página o escribinos por WhatsApp. Nos contactamos en menos de 24 horas con un presupuesto personalizado.",
  },
  {
    q: "¿Cuánto tarda la excavación de un pozo?",
    a: "Depende del tipo y profundidad. Un pozo séptico estándar se realiza en 1 a 2 días. Para obras más complejas coordinamos un relevamiento previo sin costo.",
  },
  {
    q: "¿Los precios son fijos o varían por obra?",
    a: "Los precios se definen según el tipo de trabajo, la profundidad y el acceso al terreno. Por eso ofrecemos cotizaciones personalizadas para cada proyecto.",
  },
  {
    q: "¿Trabajan con particulares y empresas?",
    a: "Sí, atendemos tanto a clientes particulares como a contratistas, constructoras y empresas de servicios.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="bg-[#1F2937] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-widest">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            ¿Tenés dudas?
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#0B0B0B] border border-[#374151] rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center text-white font-medium hover:text-[#F59E0B] transition"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span className="text-[#F59E0B] text-xl">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-[#6B7280] text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
