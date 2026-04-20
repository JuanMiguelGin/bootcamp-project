// src/config/env.js
// ─────────────────────────────────────────────────────────────
//  Carga las variables de entorno desde el fichero .env y
//  valida que las obligatorias existan antes de arrancar el
//  servidor.  Si falta alguna, el proceso termina con un error
//  claro en lugar de fallar de forma silenciosa más adelante.
// ─────────────────────────────────────────────────────────────

require("dotenv").config();

const REQUIRED_VARS = ["PORT"];

REQUIRED_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(
      `[config/env] Variable de entorno obligatoria no definida: ${varName}. ` +
        `Comprueba que existe un fichero .env en la raíz de /server con ${varName}=<valor>.`
    );
  }
});

module.exports = {
  PORT: parseInt(process.env.PORT, 10),
  NODE_ENV: process.env.NODE_ENV || "development",
};
