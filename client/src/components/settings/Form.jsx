import { useState } from "react";
import { apiFetch } from "../../services/api";

const servicios = ["Excavación — Pozo séptico", "Excavación — Pozo de agua", "Sanjeo", "Limpieza de pozos"];
const initialForm = { nombre: "", whatsapp: "", email: "", servicio: "", descripcion: "" };

export default function Form() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validar() {
    const newErrors = {};
    if (!form.nombre.trim())      newErrors.nombre      = "El nombre es obligatorio.";
    if (!form.whatsapp.trim())    newErrors.whatsapp    = "El WhatsApp es obligatorio.";
    if (!form.email.trim())       newErrors.email       = "El email es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "El email no es válido.";
    if (!form.servicio)           newErrors.servicio    = "Seleccioná un tipo de servicio.";
    if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validación local
    const newErrors = validar();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await apiFetch(
        "/leads",
        { method: "POST", body: form },
        false // endpoint público, sin token
      );
      setEnviado(true);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      if (err.errores) {
        const backendErrors = {};
        err.errores.forEach((e) => {
          backendErrors[e.path] = e.mensaje;
        });
        setErrors(backendErrors);
      } else {
        alert("Ocurrió un error al enviar. Intentalo de nuevo.");
      }
    }
  }

  if (enviado) {
    return (
      <section id="contacto" className="bg-[#1F2937] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[#0B0B0B] border border-[#374151] rounded-xl p-12">
            <p className="text-5xl mb-6">✅</p>
            <h2 className="text-white text-2xl font-bold mb-3">¡Consulta recibida!</h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-6">
              Nos pondremos en contacto a la brevedad para coordinar el presupuesto.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="border border-[#374151] text-[#6B7280] rounded-lg px-6 py-2 text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition"
            >
              Enviar otra consulta
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="bg-[#1F2937] py-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-widest">
            Contacto
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">
            Solicitá tu presupuesto
          </h2>
          <p className="text-[#6B7280] mt-3 text-sm">
            Completá el formulario y te contactamos para coordinar los detalles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0B0B0B] border border-[#374151] rounded-xl p-8 flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium">Nombre completo</label>
            <input
              type="text" name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Tu nombre y apellido"
              className={`bg-[#1F2937] text-white placeholder-[#6B7280] text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition ${errors.nombre ? "border-red-500" : "border-[#374151]"}`}
            />
            {errors.nombre && <p className="text-red-400 text-xs">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Número de WhatsApp</label>
              <input
                type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange}
                placeholder="+54 11 0000-0000"
                className={`bg-[#1F2937] text-white placeholder-[#6B7280] text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition ${errors.whatsapp ? "border-red-500" : "border-[#374151]"}`}
              />
              {errors.whatsapp && <p className="text-red-400 text-xs">{errors.whatsapp}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Correo electrónico</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="tu@email.com"
                className={`bg-[#1F2937] text-white placeholder-[#6B7280] text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition ${errors.email ? "border-red-500" : "border-[#374151]"}`}
              />
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium">Tipo de servicio</label>
            <select
              name="servicio" value={form.servicio} onChange={handleChange}
              className={`bg-[#1F2937] text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition cursor-pointer ${errors.servicio ? "border-red-500" : "border-[#374151]"} ${!form.servicio ? "text-[#6B7280]" : "text-white"}`}
            >
              <option value="" disabled>Seleccioná un servicio</option>
              {servicios.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.servicio && <p className="text-red-400 text-xs">{errors.servicio}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium">Descripción del trabajo</label>
            <textarea
              name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Contanos brevemente qué necesitás: tipo de pozo, profundidad estimada, ubicación, etc."
              rows={4}
              className={`bg-[#1F2937] text-white placeholder-[#6B7280] text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition resize-none ${errors.descripcion ? "border-red-500" : "border-[#374151]"}`}
            />
            {errors.descripcion && <p className="text-red-400 text-xs">{errors.descripcion}</p>}
          </div>

          <button
            type="submit"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-base rounded-lg py-3 transition mt-1"
          >
            Enviar consulta
          </button>

          <p className="text-[#6B7280] text-xs text-center">
            Nos contactamos en menos de 24 horas para coordinar el presupuesto.
          </p>

        </form>
      </div>
    </section>
  );
}