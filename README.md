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

---

## Herramientas de IA utilizadas

El desarrollo incorporó dos herramientas de IA de formas distintas:

### Claude (Sonnet 4)
Usado principalmente para:
- Explicar conceptos técnicos (closures, event loop, hoisting)
- Detectar y corregir bugs con explicaciones detalladas
- Generar código con documentación JSDoc integrada
- Revisar código con criterios específicos

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
- Extracción de `showInputError()` como función reutilizable (refactorización de `addTask`)
- Generación automática de JSDoc para `getVisibleTasks()`

---

## Proceso de desarrollo con IA

Se documentaron experimentos comparando resolución de problemas con y sin asistencia de IA:

| Experimento | Sin IA | Con IA | Diferencia de tiempo |
|---|---|---|---|
| Función `memoize` | 25 min | 5 min | 5x más rápido |
| Aplanar array anidado | 15 min | 2 min | 7x más rápido |
| Función `debounce` | 20 min | 3 min | 6x más rápido |
| Ordenación de tareas en TaskFlow | 35 min | 12 min | 3x más rápido |
| Modal de confirmación de borrado | 8 min | 5 min | 1.6x más rápido |

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

## Testing manual

| Prueba | Resultado |
|---|---|
| App con lista vacía | ✅ Muestra mensaje de bienvenida |
| Añadir tarea sin título | ✅ Muestra animación de error |
| Título muy largo (120 chars) | ✅ Se adapta con word-break |
| Marcar varias como completadas | ✅ Estadísticas se actualizan |
| Eliminar tarea (modal de confirmación) | ✅ Lista se actualiza correctamente |
| Cancelar eliminación | ✅ La tarea se mantiene |
| Recargar la página | ✅ Datos persisten (LocalStorage) |
| Modo oscuro | ✅ Preferencia guardada entre sesiones |
| Búsqueda en tiempo real | ✅ Filtra correctamente mientras se escribe |
| Ordenación por fecha y estado | ✅ Las tareas se reordenan correctamente |
| Navegación con teclado (Tab) | ✅ Foco visible en todos los elementos |

---

## Reflexiones sobre el uso de IA en programación

### Dónde ayuda más
- Desbloquear situaciones de error donde no se sabe por dónde empezar.
- Tareas repetitivas como documentación y JSDoc.
- Aprender conceptos aplicados directamente al código propio.

### Limitaciones observadas
- Puede generar código que parece correcto pero tiene fallos sutiles (ejemplo: manejo de eventos en IndexedDB).
- A veces sobrecomplicar soluciones simples.
- Responde con seguridad incluso cuando la información no es del todo precisa o está desactualizada.

### Cuándo programar sin asistencia
- Al aprender algo nuevo desde cero: el esfuerzo de equivocarse es parte del aprendizaje.
- En problemas simples donde escribir directamente es más rápido.
- Al revisar código propio para entender qué se comprende realmente.
