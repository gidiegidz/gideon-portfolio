// Start in dark mode
document.body.classList.add('dark-mode');

// DOM Elements
const taskInput = document.getElementById('task-name');
const taskCategory = document.getElementById('task-category');
const addTaskBtn = document.getElementById('add-task');
const tasksUL = document.getElementById('tasks');
const filterCategory = document.getElementById('filter-category');
const showCompleted = document.getElementById('show-completed');
const themeToggle = document.getElementById('theme-toggle');

// Modal Elements
const modal = document.getElementById('task-modal');
const modalTaskName = document.getElementById('modal-task-name');
const modalTaskCategory = document.getElementById('modal-task-category');
const modalTaskStatus = document.getElementById('modal-task-status');
const modalClose = document.querySelector('.close');

// Load tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
  tasksUL.innerHTML = '';
  tasks.forEach((task, index) => {
    if(filterCategory.value !== 'All' && task.category !== filterCategory.value) return;
    if(!showCompleted.checked && task.completed) return;

    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `<span>${task.name} [${task.category}]</span><button onclick="deleteTask(${index})">✕</button>`;
    
    li.querySelector('span').addEventListener('click', () => toggleTask(index));
    li.addEventListener('dblclick', () => openModal(index));
    tasksUL.appendChild(li);
  });
}

// Add task with validation
addTaskBtn.addEventListener('click', () => {
  const name = taskInput.value.trim();
  const errorMsg = document.getElementById('task-error');

  if (!name) {
    // Show popup alert if input is empty
    alert("Task name cannot be empty!");
    taskInput.focus();  // focus back on the input
    return;
}

  // Clear error if input is valid
  errorMsg.textContent = "";
    tasks.push({ name, category: taskCategory.value, completed: false });
    saveTasks();
    taskInput.value = '';
});

// Toggle completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Filters
filterCategory.addEventListener('change', renderTasks);
showCompleted.addEventListener('change', renderTasks);

// Dark/Light Mode
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

// Modal
function openModal(index) {
  modal.style.display = 'flex';
  modalTaskName.textContent = tasks[index].name;
  modalTaskCategory.textContent = tasks[index].category;
  modalTaskStatus.textContent = tasks[index].completed ? 'Completed' : 'Pending';
}

modalClose.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

// Initial render
renderTasks();

// Show spinner while loading
const spinner = document.getElementById('spinner');
spinner.style.display = 'block';
window.addEventListener('load', () => {
  spinner.style.display = 'none';
});

// Add badges in renderTasks
function renderTasks() {
  tasksUL.innerHTML = '';
  tasks.forEach((task, index) => {
    if (filterCategory.value !== 'All' && task.category !== filterCategory.value) return;
    if (!showCompleted.checked && task.completed) return;

    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
      <span class="task-name">${task.name}<span class="task-badge ${task.category}">${task.category}</span></span>
      <button class="delete-btn">✕</button>
    `;

    // REMOVE click toggle for task completion
    // Previously: taskNameSpan.addEventListener('click', ...)

    // Open modal on double click anywhere on the li (except delete)
    li.addEventListener('dblclick', (e) => {
      if (!e.target.classList.contains('delete-btn')) {
        openModal(index);
      }
    });

    // Delete button
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(index);
    });

    tasksUL.appendChild(li);
  });
}

// Modal animation toggle
function openModal(index) {
  modal.style.display = 'flex';
  modal.classList.add('show');
  modalTaskName.textContent = tasks[index].name;
  modalTaskCategory.textContent = tasks[index].category;
  modalTaskStatus.textContent = tasks[index].completed ? 'Completed' : 'Pending';
}

modalClose.addEventListener('click', () => {
  modal.classList.remove('show');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
});

window.addEventListener('click', e => {
  if(e.target === modal) {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }
});