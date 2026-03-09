// Wrap all code after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

  // Start in dark mode
  document.body.classList.add('dark-mode');

  // DOM Elements
  const taskInput = document.getElementById('task-name');
  const taskCategory = document.getElementById('task-category');
  const addTaskBtn = document.getElementById('add-task');
  const tasksUL = document.getElementById('tasks');
  const themeToggle = document.getElementById('theme-toggle');

  // Modal Elements (optional, only if modal exists in HTML)
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
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';
      li.innerHTML = `
        <span class="task-name">${task.name}<span class="task-badge ${task.category}">${task.category}</span></span>
        <button class="delete-btn">✕</button>
      `;

      // Toggle completed on click
      li.querySelector('.task-name').addEventListener('click', () => {
        task.completed = !task.completed;
        saveTasks();
      });

      // Open modal on double click (if modal exists)
      if(modal) {
        li.addEventListener('dblclick', (e) => {
          if (!e.target.classList.contains('delete-btn')) openModal(index);
        });
      }

      // Delete button
      li.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(index);
      });

      tasksUL.appendChild(li);
    });
  }

  // Add task
  addTaskBtn.addEventListener('click', () => {
    const name = taskInput.value.trim();
    if (!name) {
      alert("Task name cannot be empty!");
      taskInput.focus();
      return;
    }

    tasks.push({ name, category: taskCategory.value, completed: false });
    saveTasks();
    taskInput.value = '';
  });

  // Save tasks
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  // Delete task
  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
  }

  // Modal functions (if modal exists)
  function openModal(index) {
    if(!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('show');
    modalTaskName.textContent = tasks[index].name;
    modalTaskCategory.textContent = tasks[index].category;
    modalTaskStatus.textContent = tasks[index].completed ? 'Completed' : 'Pending';
  }

  if(modalClose) {
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
  }

  // Dark mode toggle
  if(themeToggle) {
    themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
  }

  // Initial render
  renderTasks();

});