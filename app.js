// ============================================================
//  TASKFLOW — app.js  (Fase D: conectado al servidor Node.js)
//
//  Cambios respecto a la versión anterior:
//    · LocalStorage eliminado para las tareas (el servidor es
//      la única fuente de verdad).
//    · LocalStorage solo persiste preferencias de UI:
//      modo oscuro, filtro activo y ordenación.
//    · Todas las operaciones CRUD son asíncronas (async/await).
//    · Se gestionan tres estados de red: cargando, éxito, error.
// ============================================================

import {
  fetchTasks,
  createTask  as apiCreateTask,
  updateTask  as apiUpdateTask,
  deleteTask  as apiDeleteTask,
} from "./src/api/client.js";

// ── 1. ESTADO DE UI ─────────────────────────────────────────
let filter    = localStorage.getItem("tf_filter") || "all";
let search    = "";
let sortOrder = localStorage.getItem("tf_sort")   || "newest";

// ── 2. REFERENCIAS AL DOM ───────────────────────────────────
const taskForm             = document.getElementById("taskForm");
const taskInput            = document.getElementById("taskInput");
const taskList             = document.getElementById("taskList");
const emptyMsg             = document.getElementById("emptyMsg");
const searchInput          = document.getElementById("searchInput");
const sortSelect           = document.getElementById("sortSelect");
const markAllBtn           = document.getElementById("markAllBtn");
const clearCompletedBtn    = document.getElementById("clearCompletedBtn");
const darkToggle           = document.getElementById("darkToggle");
const darkIcon             = document.getElementById("darkIcon");
const statTotal            = document.getElementById("statTotal");
const statPending          = document.getElementById("statPending");
const statCompleted        = document.getElementById("statCompleted");
const progressFill         = document.getElementById("progressFill");
const progressLabel        = document.getElementById("progressLabel");
const filterBtns           = document.querySelectorAll(".filter-btn");
const deleteModal          = document.getElementById("deleteModal");
const deleteModalBackdrop  = document.getElementById("deleteModalBackdrop");
const deleteModalTaskTitle = document.getElementById("deleteModalTaskTitle");
const deleteModalCancel    = document.getElementById("deleteModalCancel");
const deleteModalConfirm   = document.getElementById("deleteModalConfirm");

let pendingDeleteId = null;

// ── 3. ESTADOS DE RED ────────────────────────────────────────

/** Estado CARGANDO: spinner sobre la lista */
function setLoadingState() {
  taskList.innerHTML = `
    <li class="flex flex-col items-center gap-3 py-12
               text-stone-400 dark:text-neutral-500" aria-label="Cargando">
      <svg class="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span class="text-sm">Cargando tareas…</span>
    </li>`;
  emptyMsg.classList.add("hidden");
}

/** Estado ERROR: mensaje con botón de reintento */
function setErrorState(message) {
  taskList.innerHTML = `
    <li class="flex flex-col items-center gap-2 py-12
               text-red-400 dark:text-red-300" role="alert">
      <span class="text-2xl" aria-hidden="true">⚠</span>
      <p class="text-sm font-medium">No se pudo conectar con el servidor</p>
      <p class="text-xs text-stone-400 dark:text-neutral-500 max-w-xs text-center">
        ${message}
      </p>
      <button onclick="window._tfReload()"
              class="mt-2 px-4 py-1.5 text-xs font-medium rounded-lg
                     border border-red-200 dark:border-red-800
                     text-red-500 dark:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-900/30
                     transition-colors duration-150">
        Reintentar
      </button>
    </li>`;
  emptyMsg.classList.add("hidden");
}
// Exponer para el botón de reintento
window._tfReload = () => loadAndRender();

// ── 4. MODO OSCURO ──────────────────────────────────────────
function applyDarkMode(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  darkIcon.textContent = isDark ? "☀" : "☽";
  darkToggle.setAttribute("aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro");
}
function saveDarkMode(isDark) { localStorage.setItem("taskflow_dark", isDark ? "1" : "0"); }
function loadDarkMode()       { return localStorage.getItem("taskflow_dark") === "1"; }

// ── 5. ORDENACIÓN (en cliente, sobre datos del servidor) ─────
function sortTasks(list) {
  return list.slice().sort((a, b) => {
    const at = new Date(a.createdAt).getTime();
    const bt = new Date(b.createdAt).getTime();
    if (sortOrder === "newest")        return bt - at;
    if (sortOrder === "oldest")        return at - bt;
    if (sortOrder === "completedLast") {
      const d = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
      return d !== 0 ? d : bt - at;
    }
    return 0;
  });
}

// ── 6. ESTADÍSTICAS ──────────────────────────────────────────
function updateStats(tasks) {
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

// ── 7. RENDERIZAR LISTA ──────────────────────────────────────
function renderTasks(tasks) {
  const sorted   = sortTasks(tasks);
  const template = document.getElementById("taskTemplate");
  taskList.innerHTML = "";
  emptyMsg.classList.toggle("hidden", sorted.length > 0);

  sorted.forEach(task => {
    const clone = template.content.cloneNode(true);
    const li    = clone.querySelector(".task-card");

    if (task.completed) li.classList.add("completed");

    const checkBtn = li.querySelector(".task-check");
    checkBtn.setAttribute("aria-label",
      task.completed ? "Desmarcar tarea" : "Marcar como completada");
    if (task.completed) checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", () => handleToggle(task));

    li.querySelector(".task-title").textContent = task.title;
    li.querySelector(".task-edit").addEventListener("click",   () => startEdit(li, task));
    li.querySelector(".task-delete").addEventListener("click", () => openDeleteModal(task));

    taskList.appendChild(li);
  });

  updateStats(tasks);
}

// ── 8. CARGA PRINCIPAL ───────────────────────────────────────
async function loadAndRender() {
  setLoadingState();
  try {
    // El servidor aplica el filtro de estado; la búsqueda también va al servidor
    const tasks = await fetchTasks({ filter, search });
    renderTasks(tasks);   // estado ÉXITO
  } catch (err) {
    setErrorState(err.message);   // estado ERROR
  }
}

// ── 9. AÑADIR TAREA ─────────────────────────────────────────
async function handleAddTask(title) {
  if (!title.trim()) {
    taskInput.classList.add("animate-shake", "border-red-400");
    setTimeout(() => taskInput.classList.remove("animate-shake", "border-red-400"), 400);
    taskInput.focus();
    return;
  }
  const submitBtn = taskForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "…";
  try {
    await apiCreateTask(title);
    taskInput.value = "";
    taskInput.focus();
    await loadAndRender();
  } catch (err) {
    showToast(`No se pudo añadir la tarea: ${err.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Añadir";
  }
}

// ── 10. MARCAR / DESMARCAR ───────────────────────────────────
async function handleToggle(task) {
  try {
    await apiUpdateTask(task.id, { completed: !task.completed });
    await loadAndRender();
  } catch (err) {
    showToast(`Error al actualizar: ${err.message}`, "error");
  }
}

// ── 11. EDICIÓN INLINE ───────────────────────────────────────
function startEdit(li, task) {
  const titleEl = li.querySelector(".task-title");
  const editBtn = li.querySelector(".task-edit");
  const input   = document.createElement("input");
  input.type      = "text";
  input.className = "task-edit-input";
  input.value     = task.title;
  titleEl.replaceWith(input);
  editBtn.textContent = "✓";
  editBtn.setAttribute("aria-label", "Guardar cambios");
  input.focus();
  input.select();

  const save = async () => {
    if (!input.value.trim()) return;
    try {
      await apiUpdateTask(task.id, { title: input.value });
      await loadAndRender();
    } catch (err) {
      showToast(`Error al editar: ${err.message}`, "error");
    }
  };
  editBtn.onclick = save;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter")  save();
    if (e.key === "Escape") loadAndRender();
  });
}

// ── 12. MODAL DE BORRADO ─────────────────────────────────────
function openDeleteModal(task) {
  pendingDeleteId = task.id;
  deleteModalTaskTitle.textContent = `"${task.title}"`;
  deleteModal.classList.remove("hidden");
  deleteModal.setAttribute("aria-hidden", "false");
  deleteModalCancel.focus();
}
function closeDeleteModal() {
  pendingDeleteId = null;
  deleteModal.classList.add("hidden");
  deleteModal.setAttribute("aria-hidden", "true");
}

// ── 13. MARCAR TODAS / BORRAR COMPLETADAS ───────────────────
async function handleMarkAll() {
  try {
    const all    = await fetchTasks();
    const allDone = all.every(t => t.completed);
    await Promise.all(all.map(t => apiUpdateTask(t.id, { completed: !allDone })));
    await loadAndRender();
  } catch (err) {
    showToast(`Error: ${err.message}`, "error");
  }
}

async function handleClearCompleted() {
  try {
    const all       = await fetchTasks();
    const completed = all.filter(t => t.completed);
    await Promise.all(completed.map(t => apiDeleteTask(t.id)));
    await loadAndRender();
  } catch (err) {
    showToast(`Error: ${err.message}`, "error");
  }
}

// ── 14. TOAST DE NOTIFICACIÓN ────────────────────────────────
function showToast(message, type = "error") {
  document.getElementById("tf-toast")?.remove();
  const color = type === "error"
    ? "bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
    : "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300";
  const toast = document.createElement("div");
  toast.id        = "tf-toast";
  toast.className = `fixed bottom-4 right-4 z-[70] flex items-center gap-2 px-4 py-3
    rounded-xl border text-sm shadow-lg animate-slideIn ${color}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `<span aria-hidden="true">${type === "error" ? "⚠" : "✓"}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── 15. EVENTOS ──────────────────────────────────────────────
taskForm.addEventListener("submit", e => { e.preventDefault(); handleAddTask(taskInput.value); });
searchInput.addEventListener("input", e => { search = e.target.value; loadAndRender(); });
sortSelect.addEventListener("change", e => {
  sortOrder = e.target.value;
  localStorage.setItem("tf_sort", sortOrder);
  loadAndRender();
});
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    localStorage.setItem("tf_filter", filter);
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadAndRender();
  });
});
markAllBtn.addEventListener("click", handleMarkAll);
clearCompletedBtn.addEventListener("click", handleClearCompleted);
darkToggle.addEventListener("click", () => {
  const isDark = !document.documentElement.classList.contains("dark");
  applyDarkMode(isDark);
  saveDarkMode(isDark);
});
deleteModalCancel.addEventListener("click", closeDeleteModal);
deleteModalBackdrop.addEventListener("click", closeDeleteModal);
deleteModalConfirm.addEventListener("click", async () => {
  if (pendingDeleteId != null) {
    try {
      await apiDeleteTask(pendingDeleteId);
      closeDeleteModal();
      await loadAndRender();
    } catch (err) {
      closeDeleteModal();
      showToast(`Error al eliminar: ${err.message}`, "error");
    }
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !deleteModal.classList.contains("hidden")) closeDeleteModal();
});

// ── 16. ARRANQUE ─────────────────────────────────────────────
applyDarkMode(loadDarkMode());
const savedFilterBtn = document.querySelector(`[data-filter="${filter}"]`);
if (savedFilterBtn) {
  filterBtns.forEach(b => b.classList.remove("active"));
  savedFilterBtn.classList.add("active");
}
if (sortSelect) sortSelect.value = sortOrder;
loadAndRender(); // carga inicial desde el servidor
