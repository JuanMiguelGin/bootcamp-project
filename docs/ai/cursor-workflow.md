# Cursor — Primer contacto 

---

## Atajos de teclado más utilizados

| Atajo | Acción |
|---|---|
| `Ctrl + L` | Abrir chat contextual |
| `Ctrl + K` | Edición inline con IA |
| `Ctrl + Shift + I` | Abrir Composer (multi-archivo) |
| `Ctrl + P` | Búsqueda rápida de archivos |
| `Ctrl + Shift + F` | Búsqueda en todo el proyecto |
| `Ctrl + \`` | Terminal integrada |
| `Alt + Z` | Toggle word wrap |
| `Ctrl + /` | Comentar/descomentar línea |
| `F12` | Ir a definición |
| `Ctrl + Shift + P` | Paleta de comandos |

---

## Dos ejemplos donde Cursor mejoró el código

### Ejemplo 1: Refactorización de `addTask`

**Antes:**
```javascript
function addTask(title) {
  if (!title.trim()) {
    taskInput.classList.add("animate-shake", "border-red-400");
    setTimeout(() => {
      taskInput.classList.remove("animate-shake", "border-red-400");
    }, 400);
    taskInput.focus();
    return;
  }
  tasks.unshift(createTask(title));
  saveTasks();
  render();
  taskInput.value = "";
  taskInput.focus();
}
```

**Prompt usado (Ctrl + K):** *"Extrae la lógica de error del input a una función separada llamada showInputError"*

**Después:**
```javascript
function showInputError(input) {
  input.classList.add("animate-shake", "border-red-400");
  setTimeout(() => input.classList.remove("animate-shake", "border-red-400"), 400);
  input.focus();
}

function addTask(title) {
  if (!title.trim()) return showInputError(taskInput);
  tasks.unshift(createTask(title));
  saveTasks();
  render();
  taskInput.value = "";
  taskInput.focus();
}
```

El código quedó más limpio y reutilizable.

---

### Ejemplo 2: JSDoc automático

Seleccioné la función `getVisibleTasks()` y pedí: *"Añade JSDoc a esta función."*

Cursor generó:
```javascript
/**
 * Retorna las tareas visibles según el filtro activo y el texto de búsqueda.
 * @returns {Array<{id: number, title: string, completed: boolean, createdAt: string}>}
 */
function getVisibleTasks() { ... }
```

Sin tener que escribir la documentación manualmente ni revisar qué devuelve la función.

---

## Conclusión

Cursor acelera mucho el flujo de trabajo, especialmente para refactorizaciones puntuales con `Ctrl + K` y para navegar código desconocido con el chat contextual. El Composer es útil pero hay que revisarlo con cuidado porque puede hacer cambios agresivos en varios archivos a la vez.