// src/utils/formatters.js

/**
 * Formatea una fecha ISO a dd/mm/aaaa
 */
export function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Convierte el estado que viene de la BD (sin tilde) al formato con tildes
 * para que coincida con las opciones de los selects y badges del frontend.
 */
export function normalizarEstado(estado) {
  const mapa = {
    'En ejecucion': 'En ejecución',
    'En garantia': 'En garantía',
  };
  return mapa[estado] || estado;
}

/**
 * Convierte el estado con tildes al formato que espera la BD (sin tilde)
 * para enviar en las peticiones PUT.
 */
export function estadoParaApi(estado) {
  const mapa = {
    'En ejecución': 'En ejecucion',
    'En garantía': 'En garantia',
  };
  return mapa[estado] || estado;
}