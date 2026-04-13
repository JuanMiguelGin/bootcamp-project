# TaskFlow ✦

Aplicación de gestión de tareas desarrollada como proyecto del bootcamp.

## VERCEL

URL: https://bootcamp-project-eta.vercel.app/

---

## Diseño

La interfaz sigue un diseño limpio y editorial con las siguientes secciones:

- **Cabecera**: logo y botón de modo oscuro.
- **Formulario**: campo de texto + botón para añadir tareas.
- **Controles**: filtros (todas / pendientes / completadas) y buscador por texto.
- **Lista de tareas**: tarjetas con check, edición inline y botón de eliminar.
- **Panel de estadísticas**: total, pendientes, completadas y barra de progreso.
- **Pie de página**: créditos del proyecto.

## Funcionalidades

| Funcionalidad | Estado |
|---|---|
| Añadir tareas | ✅ |
| Marcar como completada | ✅ |
| Eliminar tarea | ✅ |
| Editar tarea inline | ✅ |
| Filtrar (todas / pendientes / completadas) | ✅ |
| Buscar por texto | ✅ |
| Marcar todas como completadas | ✅ |
| Borrar todas las completadas | ✅ |
| Persistencia con LocalStorage | ✅ |
| Modo oscuro con preferencia guardada | ✅ |
| Diseño responsive | ✅ |
| Accesibilidad básica (teclado, aria) | ✅ |

---

## Estructura del proyecto

```
bootcamp-project/
├── index.html      # Estructura HTML semántica
├── style.css       # Estilos, variables CSS, responsive
├── app.js          # Lógica JavaScript completa
├── .gitignore      # Archivos ignorados por Git
├── README.md       # Este archivo
└── docs/
    └── design/     # Capturas del diseño / wireframes
```

---

## Testing manual

| Prueba | Resultado |
|---|---|
| App con lista vacía | ✅ Muestra mensaje de bienvenida |
| Añadir tarea sin título | ✅ Muestra animación de error |
| Título muy largo (120 chars) | ✅ Se adapta con word-break |
| Marcar varias como completadas | ✅ Estadísticas se actualizan |
| Eliminar tareas | ✅ Lista se actualiza correctamente |
| Recargar la página | ✅ Datos persisten (LocalStorage) |
| Modo oscuro | ✅ Preferencia guardada entre sesiones |
| Navegación con teclado (Tab) | ✅ Foco visible en todos los elementos |

---

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, Flexbox, media queries, animaciones)
- JavaScript ES6+ (sin frameworks)
- LocalStorage para persistencia
- Vercel para el despliegue
