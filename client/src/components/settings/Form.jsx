import { useState } from "react";
import { apiFetch } from "../../services/api";

const servicios = [
  { label: "Excavación — Pozo séptico", value: "Excavacion" },
  { label: "Excavación — Pozo de agua", value: "Excavacion" },
  { label: "Zanjeo", value: "Zanjeo" },
  { label: "Limpieza de pozos", value: "Limpieza" },
];

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
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "El WhatsApp es obligatorio.";
    if (!form.email.trim()) newErrors.email = "El email es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "El email no es válido.";
    if (!form.servicio) newErrors.servicio = "Seleccioná un tipo de servicio.";
    if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validar();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await apiFetch("/leads", { method: "POST", body: form }, false);
      setEnviado(true);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      if (err.errores) {
        const backendErrors = {};
        err.errores.forEach((e) => {
          const campo = e.path || e.param;
          const mensaje = e.mensaje || e.msg;
          if (campo) backendErrors[campo] = mensaje;
        });
        setErrors(backendErrors);
      } else {
        alert("Ocurrió un error al enviar. Intentalo de nuevo.");
      }
    }
  }

  if (enviado) {
    return (
      <section id="contacto" className="bg-brand-surface py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-brand-bg border border-brand-border rounded-xl p-12">
            <p className="text-5xl mb-6">✅</p>
            <h2 className="text-white text-2xl font-bold mb-3">¡Consulta recibida!</h2>
            <p className="text-brand-muted text-base leading-relaxed mb-6">
              Nos pondremos en contacto a la brevedad para coordinar el presupuesto.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="border border-brand-border text-brand-muted rounded-lg px-6 py-2 text-sm hover:border-brand-accent hover:text-brand-accent transition cursor-pointer"
            >
              Enviar otra consulta
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="bg-brand-surface py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
            Contacto
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">
            Solicitá tu presupuesto
          </h2>
          <p className="text-brand-muted mt-3 text-sm">
            Completá el formulario y te contactamos para coordinar los detalles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-bg border border-brand-border rounded-xl p-8 flex flex-col gap-5 focus-within:shadow-2xl focus-within:shadow-brand-accent/5 transition-shadow duration-500">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre y apellido"
              className={`bg-brand-surface text-white placeholder-brand-muted text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition ${
                errors.nombre ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.nombre && <p className="text-red-400 text-xs">{errors.nombre}</p>}
          </div>

          {/* WhatsApp y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Número de WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="+54 11 0000-0000"
                className={`bg-brand-surface text-white placeholder-brand-muted text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition ${
                  errors.whatsapp ? "border-red-500" : "border-brand-border"
                }`}
              />
              {errors.whatsapp && <p className="text-red-400 text-xs">{errors.whatsapp}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={`bg-brand-surface text-white placeholder-brand-muted text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition ${
                  errors.email ? "border-red-500" : "border-brand-border"
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>
          </div>

          {/* Servicio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium">Tipo de servicio</label>
            <select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className={`bg-brand-surface text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition cursor-pointer ${
                errors.servicio ? "border-red-500" : "border-brand-border"
              } ${!form.servicio ? "text-brand-muted" : "text-white"}`}
            >
              <option value="" disabled>Seleccioná un servicio</option>
              {servicios.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.servicio && <p className="text-red-400 text-xs">{errors.servicio}</p>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium">Descripción del trabajo</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Contanos brevemente qué necesitás..."
              rows={4}
              className={`bg-brand-surface text-white placeholder-brand-muted text-sm rounded-lg px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition resize-none ${
                errors.descripcion ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.descripcion && <p className="text-red-400 text-xs">{errors.descripcion}</p>}
          </div>

          {/* Botón con cursor-pointer */}
          <button
            type="submit"
            className="bg-brand-accent hover:bg-brand-accentDk text-black font-bold text-base rounded-lg py-3 transition mt-1 cursor-pointer"
          >
            Enviar consulta
          </button>

          <p className="text-brand-muted text-xs text-center">
            Nos contactamos en menos de 24 horas para coordinar el presupuesto.
          </p>
        </form>
      </div>
    </section>
  );
}