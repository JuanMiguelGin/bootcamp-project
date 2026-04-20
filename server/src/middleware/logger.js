// src/middleware/logger.js
// ─────────────────────────────────────────────────────────────
//  Middleware de auditoría: registra cada petición HTTP con su
//  método, URL, código de estado y duración en milisegundos.
//
//  Implementa el patrón cadena de responsabilidad: recibe la
//  petición, se suscribe al evento 'finish' del stream de
//  respuesta para medir la duración real, y cede el control
//  al siguiente middleware con next().
// ─────────────────────────────────────────────────────────────

function logger(req, res, next) {
  const inicio = performance.now();

  // El evento 'finish' se dispara cuando Node termina de enviar
  // todos los headers y el cuerpo de la respuesta al cliente.
  res.on("finish", () => {
    const duracion = (performance.now() - inicio).toFixed(2);
    const color =
      res.statusCode < 300 ? "\x1b[32m"   // verde  → 2xx
      : res.statusCode < 400 ? "\x1b[36m" // cian   → 3xx
      : res.statusCode < 500 ? "\x1b[33m" // amarillo → 4xx
      : "\x1b[31m";                        // rojo   → 5xx

    console.log(
      `${color}[${req.method}]\x1b[0m ${req.originalUrl} → ${res.statusCode} (${duracion}ms)`
    );
  });

  next(); // OBLIGATORIO: sin esto la petición queda colgada para siempre
}

module.exports = logger;
