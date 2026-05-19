// src/services/api.js

const BASE_URL = "http://localhost:3000/api";

/**
 * Envuelve fetch con:
 * - base URL automática
 * - header Authorization Bearer (excepto para login y leads públicos)
 * - parseo automático de JSON
 * - manejo de errores HTTP
 *
 * @param {string} endpoint  - ej: '/auth/login'
 * @param {object} options   - opciones de fetch (method, body, headers...)
 * @param {boolean} auth     - si es true (por defecto) añade el token
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}, auth = true) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Si la petición requiere autenticación y hay token en localStorage
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Parsear la respuesta (puede ser JSON o vacía)
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Para errores 400 con array de validación
    if (response.status === 400 && data?.errores) {
      throw { status: 400, errores: data.errores };
    }
    // Otros errores
    throw new Error(data?.mensaje || `Error ${response.status}`);
  }

  return data;
}