export default function FAQ() {
  const preguntas = [
    {
      pregunta: "¿Cuánto demora una excavación?",
      respuesta: "Depende del tipo de pozo y la profundidad. Generalmente entre 2 y 5 días.",
    },
    {
      pregunta: "¿Qué zonas cubren?",
      respuesta: "CABA y Gran Buenos Aires (GBA Norte, Sur y Oeste).",
    },
    {
      pregunta: "¿Dan garantía?",
      respuesta: "Sí, todos nuestros trabajos tienen garantía por escrito.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-brand-surface border-t border-brand-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">
            Preguntas frecuentes
          </h2>
        </div>
        <div className="space-y-4">
          {preguntas.map((faq, i) => (
            <details
              key={i}
              className="bg-brand-bg border border-brand-border rounded-xl p-6 cursor-pointer group"
            >
              <summary className="text-white font-semibold list-none flex justify-between items-center">
                {faq.pregunta}
                <span className="text-brand-muted group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <p className="text-brand-muted text-sm mt-3 leading-relaxed">
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}