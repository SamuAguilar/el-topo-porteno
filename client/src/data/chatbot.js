// src/data/chatbot.js

export const chatTree = {
  inicio: {
    mensaje: "¡Hola! Soy el asistente de El Topo Porteño. ¿En qué puedo ayudarte?",
    opciones: [
      { texto: "Quiero solicitar un presupuesto", next: "servicio" },
      { texto: "Quiero saber más sobre los servicios", next: "info_servicios" },
      { texto: "Quiero hablar con un asesor", next: "asesor" },
    ],
  },
  
  servicio: {
    mensaje: "¿Qué tipo de servicio necesitás?",
    opciones: [
      { texto: "Excavación — Pozo séptico", next: "contacto", valor: "Excavacion" },
      { texto: "Excavación — Pozo de agua", next: "contacto", valor: "Excavacion" },
      { texto: "Zanjeo", next: "contacto", valor: "Zanjeo" },
      { texto: "Limpieza de pozos", next: "contacto", valor: "Limpieza" },
      { texto: "Volver al inicio", next: "inicio" },
    ],
  },
  
  info_servicios: {
    mensaje: "Estos son nuestros servicios principales:\n\n🏗️ Excavación: Pozos sépticos y de agua\n⚙️ Zanjeo: Zanjeo técnico para gas y cañerías\n💧 Limpieza: Mantenimiento de pozos ciegos\n\nTrabajamos en CABA y GBA. ¿Qué querés hacer ahora?",
    opciones: [
      { texto: "Solicitar un presupuesto", next: "servicio" },
      { texto: "Volver al inicio", next: "inicio" },
    ],
  },
  
  contacto: {
    mensaje: "¡Excelente elección! Dejame tus datos y un asesor te contactará a la brevedad.",
    formulario: true,  // Activa el formulario de contacto
    opciones: [
      { texto: "Volver al inicio", next: "inicio" },
    ],
  },
  
  asesor: {
    mensaje: "Un asesor se comunicará con vos pronto. Mientras tanto, podés contactarnos directamente por WhatsApp.",
    opciones: [
      { texto: "Abrir WhatsApp", link: "https://wa.me/5491100000000" },
      { texto: "Volver al inicio", next: "inicio" },
    ],
  },
};