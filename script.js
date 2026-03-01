let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const body = document.getElementById("taskBody").value.trim();
  const link = document.getElementById("taskLink").value.trim();
  const color = document.getElementById("colorPicker").value;

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    body,
    link,
    completed: false,
    starred: false,
    pinned: false,
    color,
    date: new Date().toLocaleString()
  };

  tasks.push(newTask);

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskBody").value = "";
  document.getElementById("taskLink").value = "";

  saveTasks();
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const starredList = document.getElementById("starredList");

  taskList.innerHTML = "";
  starredList.innerHTML = "";

  let sortedTasks = [...tasks].sort((a,b) => b.pinned - a.pinned);

  sortedTasks.forEach(task => {
    const li = document.createElement("li");
    li.style.background = task.color;
    if (task.completed) li.classList.add("completed");
    if (task.pinned) li.classList.add("pinned");

    li.innerHTML = `
      <div class="task-top">
        <strong>${task.title}</strong>
        <div class="task-buttons">
          <button onclick="toggleStar(${task.id})">⭐</button>
          <button onclick="togglePin(${task.id})">📌</button>
          <button onclick="editTask(${task.id})">✏️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      </div>
      <div class="task-body">${task.body || ""}</div>
      ${task.link ? `<div class="task-link">
        <a href="${formatLink(task.link)}" target="_blank">Abrir link</a>
      </div>` : ""}
      <small>${task.date}</small>
    `;

    li.onclick = (e) => {
      if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
        toggleComplete(task.id);
      }
    };

    if (task.starred) {
      starredList.appendChild(li.cloneNode(true));
    }

    taskList.appendChild(li);
  });
}

function formatLink(link) {
  if (!link.startsWith("http")) {
    return "https://" + link;
  }
  return link;
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? {...task, completed: !task.completed} : task
  );
  saveTasks();
  renderTasks();
}

function toggleStar(id) {
  tasks = tasks.map(task =>
    task.id === id ? {...task, starred: !task.starred} : task
  );
  saveTasks();
  renderTasks();
}

function togglePin(id) {
  tasks = tasks.map(task =>
    task.id === id ? {...task, pinned: !task.pinned} : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Editar título:", task.title);
  if (!newTitle) return;

  const newBody = prompt("Editar descrição:", task.body);
  const newLink = prompt("Editar link:", task.link);

  tasks = tasks.map(t =>
    t.id === id ? {...t, title: newTitle, body: newBody, link: newLink} : t
  );

  saveTasks();
  renderTasks();
}

renderTasks();