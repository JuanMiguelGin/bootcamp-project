// ============================================================
//  TASKFLOW — app.js
//  Fases 6, 7, 8 y 9 (modo oscuro + LocalStorage)
// ============================================================
 
// ── 1. ESTADO ───────────────────────────────────────────────
let tasks  = [];   // array de objetos { id, title, completed, createdAt }
let filter = "all"; // "all" | "pending" | "completed"
let search = "";    // texto de búsqueda
let sortOrder = "newest"; // "newest" | "oldest" | "completedLast"
 
// ── 2. REFERENCIAS AL DOM ───────────────────────────────────
const taskForm          = document.getElementById("taskForm");
const taskInput         = document.getElementById("taskInput");
const taskList          = document.getElementById("taskList");
const emptyMsg          = document.getElementById("emptyMsg");
const searchInput       = document.getElementById("searchInput");
const sortSelect        = document.getElementById("sortSelect");
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

// Modal de confirmación de borrado
const deleteModal          = document.getElementById("deleteModal");
const deleteModalBackdrop  = document.getElementById("deleteModalBackdrop");
const deleteModalTaskTitle = document.getElementById("deleteModalTaskTitle");
const deleteModalCancel    = document.getElementById("deleteModalCancel");
const deleteModalConfirm   = document.getElementById("deleteModalConfirm");
let pendingDeleteId = null;
 
// ── 3. LOCALSTORAGE ─────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const stored = localStorage.getItem("taskflow_tasks");
  tasks = stored ? JSON.parse(stored) : [];
}
 
// ✅ FASE 9: guardar y leer preferencia de modo oscuro
function saveDarkMode(isDark) {
  localStorage.setItem("taskflow_dark", isDark ? "1" : "0");
}
function loadDarkMode() {
  return localStorage.getItem("taskflow_dark") === "1";
}
 
// ── 4. MODO OSCURO ──────────────────────────────────────────
// Tailwind necesita la clase "dark" en el elemento <html>
// para que todas las clases dark:... del HTML se activen.
function applyDarkMode(isDark) {
  // Añadir o quitar clase "dark" en <html>
  document.documentElement.classList.toggle("dark", isDark);
 
  // Actualizar el icono del botón
  darkIcon.textContent = isDark ? "☀" : "☽";
 
  // Actualizar el aria-label del botón para accesibilidad
  darkToggle.setAttribute(
    "aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro"
  );
}
 
// ── 5. CREAR UNA TAREA ──────────────────────────────────────
function createTask(title) {
  return {
    id:        Date.now(),
    title:     title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}
 
// ── 6. AÑADIR TAREA ─────────────────────────────────────────
function addTask(title) {
  if (!title.trim()) {
    // Animación de error si el campo está vacío
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
 
// ── 7. ELIMINAR TAREA ───────────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function openDeleteModal(task) {
  pendingDeleteId = task.id;
  deleteModalTaskTitle.textContent = `“${task.title}”`;
  deleteModal.classList.remove("hidden");
  deleteModal.setAttribute("aria-hidden", "false");
  deleteModalCancel.focus();
}

function closeDeleteModal() {
  pendingDeleteId = null;
  deleteModal.classList.add("hidden");
  deleteModal.setAttribute("aria-hidden", "true");
}
 
// ── 8. MARCAR / DESMARCAR ───────────────────────────────────
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  render();
}
 
// ── 9. EDITAR TAREA ─────────────────────────────────────────
function editTask(id, newTitle) {
  if (!newTitle.trim()) return;
  tasks = tasks.map(t =>
    t.id === id ? { ...t, title: newTitle.trim() } : t
  );
  saveTasks();
  render();
}
 
// ── 10. MARCAR TODAS ────────────────────────────────────────
function markAll() {
  const allDone = tasks.every(t => t.completed);
  tasks = tasks.map(t => ({ ...t, completed: !allDone }));
  saveTasks();
  render();
}
 
// ── 11. BORRAR COMPLETADAS ──────────────────────────────────
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}
 
// ── 12. FILTRAR Y BUSCAR ─────────────────────────────────────
function sortTasks(inputTasks) {
  const decorated = inputTasks.map((t, idx) => ({ t, idx }));

  decorated.sort((a, b) => {
    const aTime = new Date(a.t.createdAt).getTime();
    const bTime = new Date(b.t.createdAt).getTime();

    if (sortOrder === "newest") {
      if (bTime !== aTime) return bTime - aTime;
      return a.idx - b.idx;
    }

    if (sortOrder === "oldest") {
      if (aTime !== bTime) return aTime - bTime;
      return a.idx - b.idx;
    }

    if (sortOrder === "completedLast") {
      const aDone = a.t.completed ? 1 : 0;
      const bDone = b.t.completed ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      if (bTime !== aTime) return bTime - aTime;
      return a.idx - b.idx;
    }

    return a.idx - b.idx;
  });

  return decorated.map(x => x.t);
}

function getVisibleTasks() {
  const filtered = tasks.filter(t => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending"   && !t.completed) ||
      (filter === "completed" &&  t.completed);
 
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase());
 
    return matchesFilter && matchesSearch;
  });

  // Ojo: Array.sort muta, por eso ordenamos una copia
  return sortTasks(filtered.slice());
}
 
// ── 13. ESTADÍSTICAS ─────────────────────────────────────────
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
 
// ── 14. RENDERIZAR LA LISTA ──────────────────────────────────
function render() {
  const visible  = getVisibleTasks();
  const template = document.getElementById("taskTemplate");
 
  taskList.innerHTML = "";
  emptyMsg.classList.toggle("hidden", visible.length > 0);
 
  visible.forEach(task => {
    const clone = template.content.cloneNode(true);
    const li    = clone.querySelector(".task-card");
 
    // Estado completado
    if (task.completed) li.classList.add("completed");
 
    // Botón check
    const checkBtn = li.querySelector(".task-check");
    checkBtn.setAttribute("aria-label",
      task.completed ? "Desmarcar tarea" : "Marcar como completada"
    );
    if (task.completed) checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", () => toggleTask(task.id));
 
    // Título
    li.querySelector(".task-title").textContent = task.title;
 
    // Editar
    li.querySelector(".task-edit").addEventListener("click", () =>
      startEdit(li, task)
    );
 
    // Eliminar
    li.querySelector(".task-delete").addEventListener("click", () =>
      openDeleteModal(task)
    );
 
    taskList.appendChild(li);
  });
 
  updateStats();
}
 
// ── 15. EDICIÓN INLINE ───────────────────────────────────────
function startEdit(li, task) {
  const titleEl = li.querySelector(".task-title");
  const editBtn = li.querySelector(".task-edit");
 
  // Crear input de edición
  const input = document.createElement("input");
  input.type      = "text";
  input.className = "task-edit-input";  // estilado en style.css
  input.value     = task.title;
 
  titleEl.replaceWith(input);
  editBtn.textContent = "✓";
  editBtn.setAttribute("aria-label", "Guardar cambios");
  input.focus();
  input.select();
 
  const save = () => editTask(task.id, input.value);
 
  editBtn.onclick = save;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter")  save();
    if (e.key === "Escape") render();
  });
}
 
// ── 16. EVENTOS ──────────────────────────────────────────────
 
// Enviar formulario
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  addTask(taskInput.value);
});
 
// Búsqueda en tiempo real
searchInput.addEventListener("input", e => {
  search = e.target.value;
  render();
});

// Cambiar ordenación
sortSelect.addEventListener("change", e => {
  sortOrder = e.target.value;
  render();
});
 
// Cambiar filtro activo
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
 
// ✅ FASE 9: toggle modo oscuro → guarda preferencia en LocalStorage
darkToggle.addEventListener("click", () => {
  const isDark = !document.documentElement.classList.contains("dark");
  applyDarkMode(isDark);
  saveDarkMode(isDark);
});

// Modal borrar: cancelar/confirmar/cerrar
deleteModalCancel.addEventListener("click", closeDeleteModal);
deleteModalBackdrop.addEventListener("click", closeDeleteModal);
deleteModalConfirm.addEventListener("click", () => {
  if (pendingDeleteId != null) deleteTask(pendingDeleteId);
  closeDeleteModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !deleteModal.classList.contains("hidden")) {
    closeDeleteModal();
  }
});
 
// ── 17. ARRANQUE ─────────────────────────────────────────────
loadTasks();
applyDarkMode(loadDarkMode());  // restaurar preferencia guardada
if (sortSelect) sortSelect.value = sortOrder;
render();