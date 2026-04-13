let tasks = [];
let filter = "all";
let search = "";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const searchInput = document.getElementById("searchInput");
const markAllBtn = document.getElementById("markAllBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const darkToggle = document.getElementById("darkToggle");
const darkIcon = document.getElementById("darkIcon");
const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statCompleted = document.getElementById("statCompleted");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const filterBtns = document.querySelectorAll(".filter-btn");

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

function createTask(title) {
  return {
    id: Date.now(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function addTask(title) {
  if (!title.trim()) {
    taskInput.focus();
    taskInput.classList.add("shake");
    setTimeout(() => taskInput.classList.remove("shake"), 400);
    return;
  }
  tasks.unshift(createTask(title));
  saveTasks();
  render();
  taskInput.value = "";
  taskInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  render();
}

function editTask(id, newTitle) {
  if (!newTitle.trim()) return;
  tasks = tasks.map(t =>
    t.id === id ? { ...t, title: newTitle.trim() } : t
  );
  saveTasks();
  render();
}

function markAll() {
  const allDone = tasks.every(t => t.completed);
  tasks = tasks.map(t => ({ ...t, completed: !allDone }));
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

function getVisibleTasks() {
  return tasks.filter(t => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !t.completed) ||
      (filter === "completed" && t.completed);

    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  statTotal.textContent = total;
  statPending.textContent = pending;
  statCompleted.textContent = completed;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = pct + "%";
}

function render() {
  const visible = getVisibleTasks();

  taskList.innerHTML = "";
  emptyMsg.classList.toggle("visible", visible.length === 0);

  const template = document.getElementById("taskTemplate");

  visible.forEach(task => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector(".task-card");

    if (task.completed) li.classList.add("completed");

    const checkBtn = li.querySelector(".task-check");
    checkBtn.setAttribute(
      "aria-label",
      task.completed ? "Desmarcar tarea" : "Marcar como completada"
    );
    if (task.completed) checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", () => toggleTask(task.id));

    const titleEl = li.querySelector(".task-title");
    titleEl.textContent = task.title;

    const editBtn = li.querySelector(".task-edit");
    editBtn.addEventListener("click", () => startEdit(li, task));

    const deleteBtn = li.querySelector(".task-delete");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(li);
  });

  updateStats();
}

function startEdit(li, task) {
  const titleEl = li.querySelector(".task-title");
  const editBtn = li.querySelector(".task-edit");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "task-edit-input";
  input.value = task.title;

  titleEl.replaceWith(input);
  editBtn.textContent = "✓";
  editBtn.setAttribute("aria-label", "Guardar cambios");
  input.focus();
  input.select();

  const save = () => editTask(task.id, input.value);

  editBtn.onclick = save;

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") render();
  });
}

function applyDarkMode(isDark) {
  document.body.classList.toggle("dark", isDark);
  darkIcon.textContent = isDark ? "☀" : "☽";
  darkToggle.setAttribute(
    "aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro"
  );
}

taskForm.addEventListener("submit", e => {
  e.preventDefault();
  addTask(taskInput.value);
});

searchInput.addEventListener("input", e => {
  search = e.target.value;
  render();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

markAllBtn.addEventListener("click", markAll);
clearCompletedBtn.addEventListener("click", clearCompleted);

darkToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyDarkMode(isDark);
  saveDarkMode(isDark);
});

const style = document.createElement("style");
style.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
.shake { animation: shake 0.35s ease; border-color: #c1440e !important; }
`;
document.head.appendChild(style);

loadTasks();
applyDarkMode(loadDarkMode());
render();