// src/middleware/errorHandler.js
// ─────────────────────────────────────────────────────────────
//  Middleware global de manejo de excepciones.
//
//  Express lo identifica como manejador de errores porque tiene
//  exactamente 4 parámetros: (err, req, res, next).
//  Debe montarse al FINAL de la cadena de middlewares en index.js.
//
//  Responsabilidades:
//    · Mapear errores de dominio a códigos HTTP semánticos.
//    · Registrar errores internos en consola (para el equipo).
//    · Nunca filtrar detalles técnicos al cliente en producción.
// ─────────────────────────────────────────────────────────────

const { NODE_ENV } = require("../config/env");

// Mapa de mensajes de error de dominio → código HTTP
const ERROR_MAP = {
  NOT_FOUND:   404,
  FORBIDDEN:   403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Determinar el código HTTP a partir del mensaje del error
  const statusCode = ERROR_MAP[err.message] || 500;

  // Los errores 5xx son fallos internos: los registramos completos
  // en consola para que el equipo pueda diagnosticarlos.
  if (statusCode >= 500) {
    console.error("[ErrorHandler] Error interno no controlado:", err);
  }

  // Construir la respuesta. En producción ocultamos la traza técnica.
  const response = {
    error: statusCode === 404
      ? "Recurso no encontrado."
      : statusCode === 400
      ? "Petición incorrecta."
      : statusCode === 401
      ? "No autenticado."
      : statusCode === 403
      ? "Acceso denegado."
      : "Error interno del servidor.",
  };

  // En entorno de desarrollo añadimos el stack para facilitar el debug
  if (NODE_ENV === "development" && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
