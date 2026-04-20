// src/index.js
// ─────────────────────────────────────────────────────────────
//  Punto de entrada del servidor.  Aquí se ensambla la
//  aplicación Express:
//    1. Middlewares globales (parseo, CORS, auditoría)
//    2. Rutas de la API
//    3. Ruta 404 para endpoints desconocidos
//    4. Manejador global de errores (siempre al final)
// ─────────────────────────────────────────────────────────────

// config/env.js DEBE cargarse primero para validar variables de entorno
const { PORT } = require("./config/env");

const express    = require("express");
const cors       = require("cors");
const logger     = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/task.routes");

const app = express();

// ── Middlewares globales ─────────────────────────────────────

// Parseo de JSON: transforma el cuerpo crudo de la petición en req.body
app.use(express.json());

// CORS: permite que el frontend (localhost:5500, etc.) consuma esta API
app.use(
  cors({
    origin: [
      "http://localhost:5500",   // Live Server de VS Code
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      // Añade aquí tu URL de Vercel cuando despliegues en producción
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Auditoría: registra cada petición con método, URL, estado y duración
app.use(logger);

// ── Rutas de la API ──────────────────────────────────────────
// Todas las rutas de tareas viven bajo el prefijo /api/v1/tasks
app.use("/api/v1/tasks", taskRoutes);

// ── Ruta de verificación de salud del servidor ───────────────
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Ruta 404: endpoint no reconocido ────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// ── Manejador global de errores (siempre el último) ──────────
// Nota: tiene 4 parámetros (err, req, res, next) — Express lo
// identifica así como middleware de errores.
app.use(errorHandler);

// ── Arrancar el servidor ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ TaskFlow API escuchando en http://localhost:${PORT}`);
  console.log(`  Endpoints disponibles:`);
  console.log(`    GET    http://localhost:${PORT}/api/v1/tasks`);
  console.log(`    POST   http://localhost:${PORT}/api/v1/tasks`);
  console.log(`    GET    http://localhost:${PORT}/api/v1/tasks/:id`);
  console.log(`    PATCH  http://localhost:${PORT}/api/v1/tasks/:id`);
  console.log(`    DELETE http://localhost:${PORT}/api/v1/tasks/:id`);
  console.log(`    GET    http://localhost:${PORT}/health\n`);
});

module.exports = app; // exportado para tests futuros
