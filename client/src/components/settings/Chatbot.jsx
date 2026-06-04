// src/components/settings/Chatbot.jsx
import { useState } from "react";
import { chatTree } from "../../data/chatbot";
import { apiFetch } from "../../services/api";

const initialForm = { nombre: "", whatsapp: "", email: "", servicio: "" };

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [nodo, setNodo] = useState("inicio");
  const [form, setForm] = useState(initialForm);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const actual = chatTree[nodo];

  function handleOpcion(opcion) {
    // Agregar mensaje del usuario al historial
    setMensajes(prev => [...prev, { tipo: "usuario", texto: opcion.texto }]);
    
    if (opcion.link) {
      window.open(opcion.link, "_blank");
      return;
    }
    
    if (opcion.valor) {
      setForm(prev => ({ ...prev, servicio: opcion.valor }));
    }
    
    if (opcion.next) {
      setNodo(opcion.next);
      // Agregar respuesta del bot después de un pequeño delay
      setTimeout(() => {
        setMensajes(prev => [...prev, { tipo: "bot", texto: chatTree[opcion.next].mensaje }]);
      }, 300);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.whatsapp || !form.email) {
      setError("Completá todos los campos.");
      return;
    }
    
    try {
      await apiFetch("/leads", {
        method: "POST",
        body: { ...form, descripcion: "Solicitado desde chatbot" },
      }, false);
      setEnviado(true);
      setMensajes(prev => [...prev, { tipo: "bot", texto: "¡Gracias! Tus datos fueron enviados correctamente. Un asesor te contactará pronto." }]);
    } catch {
      setError("Error al enviar. Intentá de nuevo.");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => {
          setAbierto(true);
          setMensajes([{ tipo: "bot", texto: chatTree.inicio.mensaje }]);
        }}
        className="fixed bottom-6 right-6 z-50 bg-brand-accent text-black font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-brand-accentDk transition cursor-pointer text-xl"
        title="Chat de ayuda"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-h-125 bg-brand-surface border border-brand-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Cabecera */}
      <div className="bg-brand-accent text-black px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-sm">El Topo Porteño</span>
        <button onClick={() => setAbierto(false)} className="text-black text-lg leading-none cursor-pointer">✕</button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm">
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg ${
              msg.tipo === "bot"
                ? "bg-brand-bg text-white self-start rounded-bl-none"
                : "bg-brand-accent text-black self-end rounded-br-none"
            }`}
          >
            {msg.texto}
          </div>
        ))}
      </div>

      {/* Formulario de contacto */}
      {actual.formulario && !enviado && (
        <form onSubmit={handleSubmit} className="px-4 pb-3 flex flex-col gap-2">
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre completo"
            className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-white text-sm outline-none"
          />
          <input
            type="tel"
            name="whatsapp"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="WhatsApp"
            className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-white text-sm outline-none"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-white text-sm outline-none"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" className="bg-brand-accent text-black font-bold rounded-md py-2 text-sm cursor-pointer">
            Enviar
          </button>
        </form>
      )}

      {/* Opciones del árbol */}
      {!actual.formulario && (
        <div className="px-4 pb-3 flex flex-col gap-1.5">
          {actual.opciones.map((op, i) => (
            <button
              key={i}
              onClick={() => handleOpcion(op)}
              className="bg-brand-bg border border-brand-border rounded-md text-white text-sm px-3 py-2 text-left hover:border-brand-accent transition cursor-pointer"
            >
              {op.texto}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}