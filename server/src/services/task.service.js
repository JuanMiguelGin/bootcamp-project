// src/services/task.service.js
// ─────────────────────────────────────────────────────────────
//  Capa de servicios: contiene la lógica de negocio pura.
//  Esta capa NO conoce Express, req ni res.  Trabaja con datos
//  limpios que le pasa el controlador y devuelve resultados o
//  lanza errores estándar de JavaScript.
//
//  Persistencia: array en memoria (simulación de base de datos).
//  En una versión real se reemplazaría por llamadas a MongoDB,
//  PostgreSQL, etc. sin tocar controladores ni rutas.
// ─────────────────────────────────────────────────────────────

/** @type {Array<{id: string, title: string, completed: boolean, createdAt: string}>} */
let tasks = [];

/**
 * Genera un ID único basado en timestamp + sufijo aleatorio.
 * @returns {string}
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Devuelve todas las tareas almacenadas.
 * Aplicar filtros opcionales: filter ("all"|"pending"|"completed") y search (texto).
 *
 * @param {{ filter?: string, search?: string }} [options]
 * @returns {Array}
 */
function obtenerTodas({ filter = "all", search = "" } = {}) {
  let result = tasks.slice(); // copia para no mutar el array interno

  // Filtrar por estado
  if (filter === "pending") {
    result = result.filter((t) => !t.completed);
  } else if (filter === "completed") {
    result = result.filter((t) => t.completed);
  }

  // Filtrar por texto de búsqueda (insensible a mayúsculas)
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(term));
  }

  return result;
}

/**
 * Busca una tarea por ID.  Lanza un error si no existe.
 *
 * @param {string} id
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string }}
 */
function obtenerPorId(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    const err = new Error("NOT_FOUND");
    err.taskId = id;
    throw err;
  }
  return task;
}

/**
 * Crea una nueva tarea y la añade al array.
 *
 * @param {{ title: string }} data
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string }}
 */
function crearTarea({ title }) {
  const nuevaTarea = {
    id:        generateId(),
    title:     title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(nuevaTarea); // más reciente primero
  return nuevaTarea;
}

/**
 * Actualiza campos de una tarea existente (PATCH semántico).
 * Solo modifica los campos que se pasen en `data`.
 *
 * @param {string} id
 * @param {{ title?: string, completed?: boolean }} data
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string }}
 */
function actualizarTarea(id, data) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    const err = new Error("NOT_FOUND");
    err.taskId = id;
    throw err;
  }

  // Solo se sobreescriben los campos que vengan en data
  tasks[index] = { ...tasks[index], ...data };
  return tasks[index];
}

/**
 * Elimina una tarea por ID.  Lanza un error si no existe.
 *
 * @param {string} id
 * @returns {void}
 */
function eliminarTarea(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    const err = new Error("NOT_FOUND");
    err.taskId = id;
    throw err;
  }
  tasks.splice(index, 1);
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
};
