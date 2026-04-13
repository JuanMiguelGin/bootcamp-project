// ============================================================
//  TASKFLOW — app.js
//  Fases 6, 7, 8 y parte de la 9 (modo oscuro + LocalStorage)
// ============================================================

// ── 1. ESTADO DE LA APLICACIÓN ──────────────────────────────
// tasks: array de objetos tarea
// filter: "all" | "pending" | "completed"
// search: texto de búsqueda

let tasks  = [];
let filter = "all";
let search = "";

// ── 2. REFERENCIAS AL DOM ───────────────────────────────────
const taskForm          = document.getElementById("taskForm");
const taskInput         = document.getElementById("taskInput");
const taskList          = document.getElementById("taskList");
const emptyMsg          = document.getElementById("emptyMsg");
const searchInput       = document.getElementById("searchInput");
const markAllBtn        = document.getElementById("markAllBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const darkToggle        = document.getElementById("darkToggle");
const darkIcon          = document.getElementById("darkIcon");
const statTotal         = document.getElementById("statTotal");
const statPending       = document.getElementById("statPending");
const statCompleted     = document.getElementById("statCompleted");
const progressFill      = document.getElementById("progressFill");
const progressLabel     = document.getElementById("progressLabel");
const filterBtns        = document.querySelectorAll(".filter-btn");

// ── 3. LOCALSTORAGE ─────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("taskflow_tasks");
  tasks = stored ? JSON.parse(stored) : [];
}

function saveDarkMode(isDark) {
  localStorage.setItem("taskflow_dark", isDark ? "1" : "0");
}

function loadDarkMode() {
  return localStorage.getItem("taskflow_dark") === "1";
}

// ── 4. CREAR UNA TAREA ──────────────────────────────────────
function createTask(title) {
  return {
    id:        Date.now(),            // identificador único
    title:     title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

// ── 5. AÑADIR TAREA ─────────────────────────────────────────
function addTask(title) {
  if (!title.trim()) {
    taskInput.focus();
    taskInput.classList.add("shake");
    setTimeout(() => taskInput.classList.remove("shake"), 400);
    return;
  }
  tasks.unshift(createTask(title));  // añade al principio
  saveTasks();
  render();
  taskInput.value = "";
  taskInput.focus();
}

// ── 6. ELIMINAR TAREA ───────────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

// ── 7. MARCAR / DESMARCAR ───────────────────────────────────
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  render();
}

// ── 8. EDITAR TAREA ─────────────────────────────────────────
function editTask(id, newTitle) {
  if (!newTitle.trim()) return;
  tasks = tasks.map(t =>
    t.id === id ? { ...t, title: newTitle.trim() } : t
  );
  saveTasks();
  render();
}

// ── 9. MARCAR TODAS COMO COMPLETADAS ────────────────────────
function markAll() {
  const allDone = tasks.every(t => t.completed);
  tasks = tasks.map(t => ({ ...t, completed: !allDone }));
  saveTasks();
  render();
}

// ── 10. BORRAR TAREAS COMPLETADAS ───────────────────────────
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

// ── 11. FILTRAR Y BUSCAR ─────────────────────────────────────
function getVisibleTasks() {
  return tasks.filter(t => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending"   && !t.completed) ||
      (filter === "completed" &&  t.completed);

    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });
}

// ── 12. ACTUALIZAR ESTADÍSTICAS ──────────────────────────────
function updateStats() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  const pct       = total ? Math.round((completed / total) * 100) : 0;

  statTotal.textContent     = total;
  statPending.textContent   = pending;
  statCompleted.textContent = completed;
  progressFill.style.width  = pct + "%";
  progressLabel.textContent = pct + "%";
}

// ── 13. RENDERIZAR LA LISTA ──────────────────────────────────
function render() {
  const visible = getVisibleTasks();

  // Vaciar la lista actual
  taskList.innerHTML = "";

  // Mostrar / ocultar mensaje vacío
  emptyMsg.classList.toggle("visible", visible.length === 0);

  // Obtener la plantilla
  const template = document.getElementById("taskTemplate");

  visible.forEach(task => {
    // Clonar la plantilla
    const clone = template.content.cloneNode(true);
    const li    = clone.querySelector(".task-card");

    // Aplicar clase si está completada
    if (task.completed) li.classList.add("completed");

    // Botón check: marcar / desmarcar
    const checkBtn = li.querySelector(".task-check");
    checkBtn.setAttribute("aria-label",
      task.completed ? "Desmarcar tarea" : "Marcar como completada"
    );
    if (task.completed) checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", () => toggleTask(task.id));

    // Título de la tarea
    const titleEl = li.querySelector(".task-title");
    titleEl.textContent = task.title;

    // Botón editar
    const editBtn = li.querySelector(".task-edit");
    editBtn.addEventListener("click", () => startEdit(li, task));

    // Botón eliminar
    const deleteBtn = li.querySelector(".task-delete");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(li);
  });

  // Actualizar estadísticas
  updateStats();
}

// ── 14. MODO EDICIÓN INLINE ──────────────────────────────────
function startEdit(li, task) {
  const titleEl = li.querySelector(".task-title");
  const editBtn = li.querySelector(".task-edit");

  // Crear un input de edición
  const input = document.createElement("input");
  input.type      = "text";
  input.className = "task-edit-input";
  input.value     = task.title;

  // Reemplazar el span con el input
  titleEl.replaceWith(input);
  editBtn.textContent  = "✓";
  editBtn.setAttribute("aria-label", "Guardar cambios");
  input.focus();
  input.select();

  // Guardar al hacer clic en ✓
  const save = () => {
    editTask(task.id, input.value);
  };

  editBtn.onclick = save;

  // Guardar al pulsar Enter, cancelar con Escape
  input.addEventListener("keydown", e => {
    if (e.key === "Enter")  save();
    if (e.key === "Escape") render();  // cancelar
  });
}

// ── 15. MODO OSCURO ──────────────────────────────────────────
function applyDarkMode(isDark) {
  document.body.classList.toggle("dark", isDark);
  darkIcon.textContent = isDark ? "☀" : "☽";
  darkToggle.setAttribute("aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro"
  );
}

// ── 16. EVENTOS ──────────────────────────────────────────────

// Enviar formulario → añadir tarea
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  addTask(taskInput.value);
});

// Búsqueda
searchInput.addEventListener("input", e => {
  search = e.target.value;
  render();
});

// Filtros
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

// Marcar todas
markAllBtn.addEventListener("click", markAll);

// Borrar completadas
clearCompletedBtn.addEventListener("click", clearCompleted);

// Modo oscuro
darkToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyDarkMode(isDark);
  saveDarkMode(isDark);
});

// ── 17. ANIMACIÓN SHAKE (tarea vacía) ────────────────────────
// (añadida en CSS inline para no añadir otro fichero)
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-6px); }
    75%      { transform: translateX(6px); }
  }
  .shake { animation: shake 0.35s ease; border-color: #c1440e !important; }
`;
document.head.appendChild(shakeStyle);

// ── 18. ARRANQUE ─────────────────────────────────────────────
loadTasks();
applyDarkMode(loadDarkMode());
render();
