# TaskFlow ✦
 
Aplicación de gestión de tareas desarrollada como proyecto de bootcamp. Construida con HTML, CSS y JavaScript vanilla en el frontend, y Node.js con Express en el backend.
 
## URL de producción
 
🔗 [https://bootcamp-project-eta.vercel.app/](https://bootcamp-project-eta.vercel.app/)
 
---
 
## Descripción del proyecto
 
TaskFlow permite crear, organizar y hacer seguimiento de tareas del día a día. El proyecto nació como ejercicio práctico del bootcamp para aplicar todas las fases de desarrollo de una aplicación web completa: desde el HTML semántico hasta un servidor REST con arquitectura por capas.
 
A lo largo del desarrollo se usaron herramientas de IA (Claude y Cursor) para explorar su impacto real en productividad, calidad del código y aprendizaje.
 
---
 
## Cómo ejecutar el proyecto en local
 
El proyecto tiene dos partes que deben estar corriendo a la vez.
 
### 1. Arrancar el servidor
 
```bash
cd server
npm install
npm run dev
```
 
El servidor queda escuchando en `http://localhost:3000`. Mientras esté activo, todas las operaciones con tareas (crear, editar, eliminar) se comunican con él. Para detenerlo pulsa `Ctrl + C` en la terminal.
 
### 2. Abrir el frontend
 
Abre `frontend/index.html` con la extensión **Live Server** de VS Code. El frontend estará disponible en `http://localhost:5500`.
 
> ⚠️ Las tareas se guardan en memoria en el servidor. Si lo reinicias, los datos se pierden. La persistencia real con base de datos está prevista como siguiente fase.
 
---
 
## Estructura del proyecto
 
```
bootcamp-project/
├── frontend/
│   ├── index.html              # Estructura HTML semántica
│   ├── estilos.css             # Estilos complementarios a Tailwind
│   ├── app.js                  # Lógica del frontend (async/await + API)
│   └── src/
│       └── api/
│           └── client.js       # Capa de red: todas las llamadas fetch
├── server/
│   ├── .env                    # Variables de entorno (no subir a git)
│   ├── package.json
│   └── src/
│       ├── index.js            # Punto de entrada: ensambla Express
│       ├── config/
│       │   └── env.js          # Carga y valida variables de entorno
│       ├── middleware/
│       │   ├── logger.js       # Registra cada petición con método, estado y duración
│       │   └── errorHandler.js # Manejador global de errores
│       ├── routes/
│       │   └── task.routes.js  # Mapea URL + verbo HTTP al controlador
│       ├── controllers/
│       │   └── task.controller.js  # Valida entrada y llama al servicio
│       └── services/
│           └── task.service.js     # Lógica de negocio pura (sin Express)
├── docs/
│   ├── backend-api.md          # Qué son Axios, Postman, Sentry y Swagger
│   ├── ai-comparison.md        # Comparativa ChatGPT vs Claude
│   ├── cursor-workflow.md      # Experiencia con Cursor
│   ├── experiments.md          # Experimentos con y sin IA
│   ├── prompt-engineering.md   # Prompts útiles documentados
│   └── reflection.md           # Reflexión final
└── README.md
```
 
---
 
## Funcionalidades
 
| Funcionalidad | Estado |
|---|---|
| Añadir tareas | ✅ |
| Marcar como completada | ✅ |
| Eliminar tarea con confirmación (modal) | ✅ |
| Editar tarea inline | ✅ |
| Filtrar (todas / pendientes / completadas) | ✅ |
| Buscar por texto en tiempo real | ✅ |
| Ordenar por fecha o estado | ✅ |
| Marcar todas como completadas | ✅ |
| Borrar todas las completadas | ✅ |
| Modo oscuro con preferencia guardada | ✅ |
| Diseño responsive | ✅ |
| Accesibilidad básica (teclado, aria) | ✅ |
| API REST con servidor Node.js | ✅ |
| Arquitectura por capas (rutas / controladores / servicios) | ✅ |
| Estados de red en UI (cargando / éxito / error) | ✅ |
 
---
 
## Tecnologías utilizadas
 
### Frontend
- HTML5 semántico
- CSS3 (Flexbox, animaciones, variables)
- JavaScript ES6+ con módulos nativos (`import/export`)
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- LocalStorage para persistir preferencias de UI (modo oscuro, filtro activo)
### Backend
- [Node.js](https://nodejs.org/) — entorno de ejecución
- [Express](https://expressjs.com/) — framework HTTP
- [dotenv](https://github.com/motdotla/dotenv) — gestión de variables de entorno
- [cors](https://github.com/expressjs/cors) — control de acceso desde el frontend
- [nodemon](https://nodemon.io/) — recarga automática en desarrollo
---
 
## Servidor — API REST
 
### ¿Qué es y para qué sirve?
 
El servidor es el intermediario entre el frontend y los datos. Cuando añades una tarea en la aplicación, el frontend no la guarda directamente en el navegador: envía una petición HTTP al servidor, que la procesa, la almacena y devuelve una respuesta.
 
Esto permite que los datos existan de forma independiente al navegador, que la lógica de negocio esté protegida en el servidor, y que en el futuro se pueda conectar una base de datos real sin tocar el frontend.
 
### Arquitectura por capas
 
El servidor está dividido en tres capas con responsabilidades separadas. Cada capa solo habla con la siguiente, nunca se saltan:
 
```
Petición HTTP
     │
     ▼
┌──────────┐
│  Router  │  Solo escucha la red y decide qué controlador llama.
│          │  No toma ninguna decisión lógica.
└────┬─────┘
     │
     ▼
┌──────────────┐
│  Controller  │  Extrae los datos de la petición, los valida
│              │  y llama al servicio. Devuelve la respuesta HTTP.
└──────┬───────┘
       │
       ▼
┌─────────┐
│ Service │  Contiene la lógica de negocio pura.
│         │  No conoce Express, ni req, ni res.
└─────────┘
```
 
Esta separación tiene una ventaja práctica importante: si en el futuro se quiere cambiar la base de datos (de memoria a MongoDB, por ejemplo), solo hay que modificar el servicio. Las rutas y los controladores no se tocan.
 
### Middlewares
 
Los middlewares son funciones que se ejecutan en cada petición antes de llegar a la ruta. El servidor tiene dos:
 
**logger.js** — Registra en la terminal cada petición que recibe el servidor: el método HTTP, la URL, el código de estado y el tiempo que tardó en responder. Usa colores para distinguir respuestas correctas (verde) de errores (rojo/amarillo).
 
```
[GET]    /api/v1/tasks → 200 (4.21ms)
[POST]   /api/v1/tasks → 201 (2.87ms)
[DELETE] /api/v1/tasks/abc → 404 (1.03ms)
```
 
**errorHandler.js** — Captura cualquier error que ocurra en la aplicación y lo convierte en una respuesta HTTP con el código correcto. Si una tarea no existe devuelve 404; si los datos son inválidos devuelve 400. En producción nunca muestra el stack trace al cliente.
 
### Endpoints disponibles
 
Base URL: `http://localhost:3000/api/v1`
 
| Método | Ruta | Descripción | Código de respuesta |
|--------|------|-------------|---------------------|
| GET | `/tasks` | Listar todas las tareas | 200 |
| GET | `/tasks?filter=pending` | Filtrar por estado | 200 |
| GET | `/tasks?search=texto` | Buscar por texto | 200 |
| POST | `/tasks` | Crear una tarea nueva | 201 |
| GET | `/tasks/:id` | Obtener una tarea concreta | 200 |
| PATCH | `/tasks/:id` | Actualizar campos de una tarea | 200 |
| DELETE | `/tasks/:id` | Eliminar una tarea | 204 |
| GET | `/health` | Comprobar que el servidor está vivo | 200 |
 
### Códigos HTTP utilizados
 
| Código | Significado | Cuándo se devuelve |
|--------|-------------|-------------------|
| 200 | OK | GET o PATCH exitoso |
| 201 | Created | POST exitoso (tarea creada) |
| 204 | No Content | DELETE exitoso (sin cuerpo de respuesta) |
| 400 | Bad Request | Datos de entrada inválidos |
| 404 | Not Found | El ID solicitado no existe |
| 500 | Internal Server Error | Error inesperado en el servidor |
 
### Validación en la frontera de red
 
El controlador valida todos los datos que llegan del cliente antes de pasarlos al servicio. Nunca se confía en lo que envía el frontend. Ejemplos de validaciones aplicadas:
 
- El campo `title` es obligatorio y no puede estar vacío.
- `title` no puede superar los 120 caracteres.
- `completed` debe ser exactamente `true` o `false`, no un string.
- El parámetro `filter` solo acepta los valores `all`, `pending` o `completed`.
Si alguna validación falla, el servidor responde con un `400 Bad Request` y un mensaje explicando qué está mal, sin llegar a ejecutar ninguna lógica de negocio.
 
### Variables de entorno
 
El servidor usa un fichero `.env` para la configuración. Nunca se escribe configuración directamente en el código.
 
| Variable | Obligatoria | Descripción | Valor por defecto |
|----------|-------------|-------------|-------------------|
| `PORT` | ✅ | Puerto en el que escucha el servidor | — |
| `NODE_ENV` | No | Entorno de ejecución | `development` |
 
> El fichero `.env` está en `.gitignore` y nunca se sube al repositorio.
 
---
 
## Testing manual
 
| Prueba | Resultado |
|---|---|
| App con lista vacía | ✅ Muestra mensaje de bienvenida |
| Añadir tarea sin título | ✅ Animación de error en el input |
| Título muy largo (120 chars) | ✅ Se adapta con word-break |
| Marcar varias como completadas | ✅ Estadísticas se actualizan |
| Eliminar tarea (modal de confirmación) | ✅ Lista se actualiza correctamente |
| Cancelar eliminación | ✅ La tarea se mantiene |
| Búsqueda en tiempo real | ✅ Filtra correctamente mientras se escribe |
| Ordenación por fecha y estado | ✅ Las tareas se reordenan correctamente |
| Modo oscuro | ✅ Preferencia guardada entre sesiones |
| Navegación con teclado (Tab) | ✅ Foco visible en todos los elementos |
| Servidor caído | ✅ Muestra estado de error con botón de reintento |
| POST sin título al servidor | ✅ Devuelve 400 con mensaje de error |
| DELETE de ID inexistente | ✅ Devuelve 404 |
 
---
 
## Herramientas de IA utilizadas
 
### Claude (Sonnet 4)
Usado principalmente para:
- Explicar conceptos técnicos (middlewares, arquitectura por capas, event loop, closures)
- Generar y revisar código con explicaciones detalladas
- Detectar y corregir bugs con contexto del proyecto real
### ChatGPT (GPT-4o)
Comparado con Claude en las mismas tareas. Resultó más conciso y directo, útil para respuestas rápidas sin demasiado contexto extra.
 
### Cursor
Editor de código con IA integrada. Los atajos más usados durante el desarrollo:
 
| Atajo | Acción |
|---|---|
| `Ctrl + K` | Edición inline con IA |
| `Ctrl + L` | Chat contextual |
| `Ctrl + Shift + I` | Composer (cambios multi-archivo) |
 
Casos de uso concretos en TaskFlow:
- Extracción de `showInputError()` como función reutilizable
- Generación automática de JSDoc para `getVisibleTasks()`
- Refactorización de `app.js` para separar la capa de red
---
 
## Proceso de desarrollo con IA
 
| Experimento | Sin IA | Con IA | Diferencia |
|---|---|---|---|
| Función `memoize` | 25 min | 5 min | 5x más rápido |
| Aplanar array anidado | 15 min | 2 min | 7x más rápido |
| Función `debounce` | 20 min | 3 min | 6x más rápido |
| Ordenación de tareas en TaskFlow | 35 min | 12 min | 3x más rápido |
| Modal de confirmación de borrado | 8 min | 5 min | 1.6x más rápido |
| Arquitectura por capas del servidor | 60 min | 15 min | 4x más rápido |
 
**Conclusión principal:** la IA acelera significativamente el desarrollo, pero la comprensión es mayor cuando se intenta resolver el problema primero. El flujo óptimo encontrado fue: intentar 10–15 min de forma independiente → usar IA si hay bloqueo → estudiar y entender la solución propuesta.
 
---
 
## Prompt engineering aplicado
 
Durante el desarrollo se documentaron patrones de prompts especialmente útiles:
 
- **Rol de desarrollador senior**: mejora la calidad del feedback en revisiones de código.
- **Few-shot para bugs**: dar un ejemplo antes de la pregunta fuerza un formato estructurado (BUG / CAUSA / FIX).
- **Restricciones claras**: limitar líneas, dependencias o formato evita respuestas largas que luego hay que editar.
- **Criterios ordenados para revisión**: preguntas concretas producen respuestas accionables en lugar de comentarios vagos.
- **Contexto de code review**: produce explicaciones orientadas a riesgos y comprensión, no solo descripción línea a línea.
---
 
## Reflexiones sobre el uso de IA en programación
 
### Dónde ayuda más
- Desbloquear situaciones de error donde no se sabe por dónde empezar.
- Entender conceptos nuevos aplicados directamente al código propio.
- Tareas repetitivas como documentación y validaciones.
### Limitaciones observadas
- Puede generar código que parece correcto pero tiene fallos sutiles.
- A veces sobrecomplicar soluciones simples.
- Responde con seguridad incluso cuando la información no es del todo precisa o está desactualizada.
### Cuándo programar sin asistencia
- Al aprender algo nuevo desde cero: el esfuerzo de equivocarse es parte del aprendizaje.
- En problemas simples donde escribir directamente es más rápido.
- Al revisar código propio para entender qué se comprende realmente.