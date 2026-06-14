import { useState } from "react";

export default function FAQ() {

  const preguntas = [
    {
      pregunta: "¿Cuánto demora una excavación?",
      respuesta: "El tiempo estimado depende del tipo de pozo, la profundidad requerida y las características del terreno. Generalmente, un trabajo estándar se completa entre 2 y 5 días hábiles. Nos enfocamos en trabajar con rapidez garantizando la seguridad y prolijidad del área de trabajo en todo momento.",
    },
    {
      pregunta: "¿Qué zonas cubren?",
      respuesta: "Brindamos nuestros servicios en toda la Ciudad Autónoma de Buenos Aires (CABA) y el Gran Buenos Aires (GBA Norte, Sur y Oeste). Si tu proyecto se encuentra fuera de esta área de cobertura principal, podés consultarnos para evaluar la disponibilidad técnica y los costos de traslado.",
    },
    {
      pregunta: "¿Dan garantía?",
      respuesta: "Sí, la tranquilidad de nuestros clientes es fundamental. Todos nuestros trabajos de excavación, zanjeo y limpieza de pozos cuentan con garantía por escrito. Nos aseguramos de utilizar maquinaria especializada y personal altamente capacitado para entregarte resultados duraderos.",
    },
  ];

  // 2. Estado para saber qué pregunta está abierta (guardamos su índice)
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  // 3. Función para alternar la apertura/cierre
  const togglePregunta = (index) => {
    if (preguntaAbierta === index) {
      setPreguntaAbierta(null);
    } else {
      setPreguntaAbierta(index);
    }
  };

  return (
    <section id="faq" className="py-20 px-6 bg-brand-surface border-t border-brand-border">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">
            Preguntas frecuentes
          </h2>
        </div>

        {/* Lista de preguntas */}
        <div className="space-y-4">
          {preguntas.map((faq, i) => {
            const estaAbierta = preguntaAbierta === i;

            return (
              <div
                key={i}
                onClick={() => togglePregunta(i)}
                className="bg-brand-bg border border-brand-border rounded-xl p-6 cursor-pointer group"
              >
                <div className="text-white font-semibold flex justify-between items-center select-none">
                  {faq.pregunta}
                  <span
                    className={`text-brand-muted text-lg transition-transform duration-300 ${
                      estaAbierta ? "rotate-45 text-brand-accent" : ""
                    }`}
                  >
                    +
                  </span>
                </div>


                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    estaAbierta ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-brand-muted text-sm leading-relaxed">
                      {faq.respuesta}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}