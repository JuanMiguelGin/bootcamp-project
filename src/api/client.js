// src/api/client.js
// ─────────────────────────────────────────────────────────────
//  Capa de red del frontend.
//
//  Centraliza todas las peticiones HTTP al servidor Node.js.
//  El resto de la aplicación (app.js) nunca usa fetch directamente:
//  siempre llama a estas funciones.  Así, si la URL del servidor
//  cambia, solo hay que tocar este fichero.
//
//  Cada función:
//    · Es asíncrona (async/await)
//    · Devuelve los datos ya parseados
//    · Lanza un Error con mensaje legible si el servidor responde
//      con un código de error (4xx / 5xx)
// ─────────────────────────────────────────────────────────────

const API_BASE = "/api/v1";

/**
 * Helper interno: ejecuta fetch y normaliza errores HTTP.
 * Si la respuesta no es ok (status >= 400), lanza un Error
 * con el mensaje que devuelve el servidor.
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}  Datos ya parseados como JSON (o null para 204)
 */
async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // 204 No Content → el servidor no devuelve cuerpo
  if (response.status === 204) return null;

  const json = await response.json();

  if (!response.ok) {
    // El servidor devuelve { error: "mensaje" }
    throw new Error(json.error || `Error ${response.status}`);
  }

  return json;
}

// ── Funciones públicas de la API ─────────────────────────────

/**
 * Obtiene la lista de tareas.
 * @param {{ filter?: string, search?: string }} [params]
 * @returns {Promise<Array>}
 */
export async function fetchTasks({ filter = "all", search = "" } = {}) {
  const qs = new URLSearchParams({ filter, search }).toString();
  const json = await request(`${API_BASE}/tasks?${qs}`);
  return json.data;
}

/**
 * Crea una nueva tarea.
 * @param {string} title
 * @returns {Promise<Object>}  La tarea creada
 */
export async function createTask(title) {
  const json = await request(`${API_BASE}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  return json.data;
}

/**
 * Actualiza campos de una tarea (PATCH parcial).
 * @param {string} id
 * @param {{ title?: string, completed?: boolean }} updates
 * @returns {Promise<Object>}  La tarea actualizada
 */
export async function updateTask(id, updates) {
  const json = await request(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return json.data;
}

/**
 * Elimina una tarea.
 * @param {string} id
 * @returns {Promise<null>}
 */
export async function deleteTask(id) {
  return request(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
}
