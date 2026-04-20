// src/controllers/task.controller.js
// ─────────────────────────────────────────────────────────────
//  Capa de controladores: director de orquesta entre la red y
//  la lógica de negocio.  Su trabajo es:
//    1. Extraer datos de req (params, body, query)
//    2. Validar que esos datos son correctos (frontera de red)
//    3. Llamar al servicio con datos limpios
//    4. Formatear y enviar la respuesta HTTP
//
//  Un controlador debe ser DELGADO: sin lógica de negocio propia.
// ─────────────────────────────────────────────────────────────

const taskService = require("../services/task.service");

// ── GET /api/v1/tasks ────────────────────────────────────────
/**
 * Devuelve la lista de tareas, con soporte para filtros opcionales
 * via query params: ?filter=pending&search=compra
 */
function getTasks(req, res, next) {
  try {
    const { filter = "all", search = "" } = req.query;

    // Validar que filter tenga un valor permitido
    const validFilters = ["all", "pending", "completed"];
    if (!validFilters.includes(filter)) {
      return res.status(400).json({
        error: `El parámetro 'filter' debe ser uno de: ${validFilters.join(", ")}.`,
      });
    }

    const tasks = taskService.obtenerTodas({ filter, search });
    res.status(200).json({ data: tasks, total: tasks.length });
  } catch (err) {
    next(err); // delegar al middleware global de errores
  }
}

// ── GET /api/v1/tasks/:id ────────────────────────────────────
function getTaskById(req, res, next) {
  try {
    const task = taskService.obtenerPorId(req.params.id);
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/v1/tasks ───────────────────────────────────────
/**
 * Crea una nueva tarea.
 * Body esperado: { "title": "string (mín. 1 carácter)" }
 * Respuesta exitosa: HTTP 201 Created
 */
function createTask(req, res, next) {
  try {
    const { title } = req.body;

    // ── Validación defensiva en la frontera de red ──────────
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        error: "El campo 'title' es obligatorio y no puede estar vacío.",
      });
    }
    if (title.trim().length > 120) {
      return res.status(400).json({
        error: "El campo 'title' no puede superar los 120 caracteres.",
      });
    }
    // ────────────────────────────────────────────────────────

    const nuevaTarea = taskService.crearTarea({ title });
    res.status(201).json({ data: nuevaTarea });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/v1/tasks/:id ──────────────────────────────────
/**
 * Modifica campos concretos de una tarea (parcial, semántica PATCH).
 * Body aceptado: { "title"?: string, "completed"?: boolean }
 */
function updateTask(req, res, next) {
  try {
    const { title, completed } = req.body;
    const updates = {};

    // Solo incluimos en updates los campos que lleguen y sean válidos
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({
          error: "Si se envía 'title', debe ser una cadena no vacía.",
        });
      }
      if (title.trim().length > 120) {
        return res.status(400).json({
          error: "El campo 'title' no puede superar los 120 caracteres.",
        });
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          error: "Si se envía 'completed', debe ser un booleano (true/false).",
        });
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "Debes enviar al menos un campo para actualizar: 'title' o 'completed'.",
      });
    }

    const tareaActualizada = taskService.actualizarTarea(req.params.id, updates);
    res.status(200).json({ data: tareaActualizada });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/v1/tasks/:id ─────────────────────────────────
/**
 * Elimina una tarea por ID.
 * Respuesta exitosa: HTTP 204 No Content (sin cuerpo).
 */
function deleteTask(req, res, next) {
  try {
    taskService.eliminarTarea(req.params.id);
    res.status(204).send(); // 204 = éxito sin contenido que devolver
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
