// src/routes/task.routes.js
// ─────────────────────────────────────────────────────────────
//  Capa de enrutamiento: su ÚNICA misión es escuchar la red y
//  mapear cada combinación [verbo HTTP + URL] al controlador
//  adecuado.  Esta capa no toma ninguna decisión lógica.
// ─────────────────────────────────────────────────────────────

const { Router } = require("express");
const taskController = require("../controllers/task.controller");

const router = Router();

// GET    /api/v1/tasks          → listar tareas (con filtros opcionales)
// POST   /api/v1/tasks          → crear una nueva tarea
router
  .route("/")
  .get(taskController.getTasks)
  .post(taskController.createTask);

// GET    /api/v1/tasks/:id      → obtener una tarea concreta
// PATCH  /api/v1/tasks/:id      → actualizar campos de una tarea
// DELETE /api/v1/tasks/:id      → eliminar una tarea
router
  .route("/:id")
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
