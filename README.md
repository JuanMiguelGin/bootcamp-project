# TaskFlow ✦

Aplicación de gestión de tareas desarrollada como proyecto de bootcamp, con asistencia de IA (Claude y Cursor) para explorar el impacto de las herramientas de inteligencia artificial en el desarrollo web.

## VERCEL URL

🔗 [https://bootcamp-project-eta.vercel.app/](https://bootcamp-project-eta.vercel.app/)

---

## Descripción del proyecto

TaskFlow es una aplicación de gestión de tareas construida con HTML, CSS y JavaScript vanilla (sin frameworks). El objetivo del proyecto fue doble: por un lado, desarrollar una app funcional y bien diseñada; por otro, documentar el proceso de uso de herramientas de IA durante el desarrollo para analizar su impacto real en productividad, calidad del código y aprendizaje.

---

## Diseño

La interfaz sigue un estilo limpio y editorial con estas secciones:

- **Cabecera**: logo y botón de modo oscuro.
- **Formulario**: campo de texto + botón para añadir tareas.
- **Controles**: filtros (todas / pendientes / completadas), buscador por texto y selector de ordenación.
- **Lista de tareas**: tarjetas con check, edición inline y botón de eliminar con modal de confirmación.
- **Panel de estadísticas**: total, pendientes, completadas y barra de progreso.
- **Pie de página**: créditos del proyecto.

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
| Persistencia con LocalStorage | ✅ |
| Modo oscuro con preferencia guardada | ✅ |
| Diseño responsive | ✅ |
| Accesibilidad básica (teclado, aria) | ✅ |

---

## Estructura del proyecto

```
bootcamp-project/
├── index.html          # Estructura HTML semántica
├── style.css           # Estilos complementarios a Tailwind
├── app.js              # Lógica JavaScript completa
├── .gitignore
├── README.md           # Este archivo
└── docs/
    ├── ai-comparison.md      # Comparativa ChatGPT vs Claude
    ├── cursor-workflow.md    # Experiencia con Cursor
    ├── experiments.md        # Experimentos con y sin IA
    ├── prompt-engineering.md # Prompts útiles documentados
    └── reflection.md         # Reflexión final
```

---

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, Flexbox, animaciones)
- JavaScript ES6+ (sin frameworks)
- [Tailwind CSS](https://tailwindcss.com/) via CDN (modo oscuro, utilidades responsivas)
- LocalStorage para persistencia de datos
- [Vercel](https://vercel.com/) para el despliegue

