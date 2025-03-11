// Task completion functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all task checkboxes
  const taskCheckboxes = document.querySelectorAll(".task-checkbox");

  // Add event listeners to each checkbox
  taskCheckboxes.forEach((checkbox) => {
    // Check if already checked and apply completed class
    if (checkbox.checked) {
      checkbox.closest(".task-item").classList.add("completed");
    }

    // Add event listener for changes
    checkbox.addEventListener("change", function () {
      const taskItem = this.closest(".task-item");

      if (this.checked) {
        // Add completed class with animation
        taskItem.classList.add("completed");

        // Optionally update task counters and insights
        updateTaskCounters();
      } else {
        // Remove completed class
        taskItem.classList.remove("completed");

        // Optionally update task counters and insights
        updateTaskCounters();
      }
    });
  });

  // Function to update task counters (pending and completed)
  function updateTaskCounters() {
    const totalTasks = document.querySelectorAll(".task-item").length;
    const completedTasks = document.querySelectorAll(
      ".task-item.completed"
    ).length;
    const pendingTasks = totalTasks - completedTasks;

    // Update the insight cards with new values
    const pendingInsight = document.querySelector(
      ".insight-card:nth-child(1) .insight-value"
    );
    const completedInsight = document.querySelector(
      ".insight-card:nth-child(2) .insight-value"
    );
    const progressInsight = document.querySelector(
      ".insight-card:nth-child(3) .insight-value"
    );

    if (pendingInsight) pendingInsight.textContent = pendingTasks;
    if (completedInsight) completedInsight.textContent = completedTasks;
    if (progressInsight && totalTasks > 0) {
      const progressPercentage = Math.round(
        (completedTasks / totalTasks) * 100
      );
      progressInsight.textContent = progressPercentage + "%";
    }
  }
});

// Task completion functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get all task checkboxes
    const taskCheckboxes = document.querySelectorAll(".task-checkbox");
  
    // Add event listeners to each checkbox
    taskCheckboxes.forEach((checkbox) => {
      // Check if already checked and apply completed class
      if (checkbox.checked) {
        checkbox.closest(".task-item").classList.add("completed");
      }
  
      // Add event listener for changes
      checkbox.addEventListener("change", function () {
        const taskItem = this.closest(".task-item");
  
        if (this.checked) {
          // Add completed class with animation
          taskItem.classList.add("completed");
  
          // Optionally update task counters and insights
          updateTaskCounters();
        } else {
          // Remove completed class
          taskItem.classList.remove("completed");
  
          // Optionally update task counters and insights
          updateTaskCounters();
        }
      });
    });
  
    // Function to update task counters (pending and completed)
    function updateTaskCounters() {
      const totalTasks = document.querySelectorAll(".task-item").length;
      const completedTasks = document.querySelectorAll(
        ".task-item.completed"
      ).length;
      const pendingTasks = totalTasks - completedTasks;
  
      // Update the insight cards with new values
      const pendingInsight = document.querySelector(
        ".insight-card:nth-child(1) .insight-value"
      );
      const completedInsight = document.querySelector(
        ".insight-card:nth-child(2) .insight-value"
      );
      const progressInsight = document.querySelector(
        ".insight-card:nth-child(3) .insight-value"
      );
  
      if (pendingInsight) pendingInsight.textContent = pendingTasks;
      if (completedInsight) completedInsight.textContent = completedTasks;
      if (progressInsight && totalTasks > 0) {
        const progressPercentage = Math.round(
          (completedTasks / totalTasks) * 100
        );
        progressInsight.textContent = progressPercentage + "%";
      }
    }
  });
  
  // Task Modal Functionality
  document.addEventListener('DOMContentLoaded', function() {
      // Modal elements
      const modal = document.createElement('div');
      modal.id = 'taskModal';
      modal.className = 'task-modal';
      modal.innerHTML = `
      <div class="task-modal-content">
          <div class="task-modal-header">
              <h3>Add New Task</h3>
              <button class="close-modal-btn">
                  <i data-lucide="x"></i>
              </button>
          </div>
          <div class="task-modal-body">
              <form id="taskForm">
                  <div class="form-group">
                      <label for="taskCategory">Category</label>
                      <select id="taskCategory" required>
                          <option value="" disabled selected>Select a category</option>
                          <option value="physical">Physical Win</option>
                          <option value="mental">Mental Win</option>
                          <option value="spiritual">Spiritual Win</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="taskTitle">Task Title</label>
                      <input type="text" id="taskTitle" placeholder="Enter task title" required>
                  </div>
                  <div class="form-group">
                      <label for="taskDescription">Description</label>
                      <input type="text" id="taskDescription" placeholder="Add additional details (optional)">
                  </div>
                  <div class="form-row">
                      <div class="form-group half">
                          <label for="taskTimeStart">Start Time</label>
                          <input type="time" id="taskTimeStart" required>
                      </div>
                      <div class="form-group half">
                          <label for="taskTimeEnd">End Time</label>
                          <input type="time" id="taskTimeEnd" required>
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="taskPriority">Priority</label>
                      <select id="taskPriority" required>
                          <option value="high">High</option>
                          <option value="medium" selected>Medium</option>
                          <option value="low">Low</option>
                      </select>
                  </div>
                  <div class="form-actions">
                      <button type="button" class="cancel-btn">Cancel</button>
                      <button type="submit" class="add-task-submit-btn">Add Task</button>
                  </div>
              </form>
          </div>
      </div>
      `;
      
      // Append modal to body
      document.body.appendChild(modal);
      
      // Initialize Lucide icons after adding to DOM
      if (window.lucide) {
          lucide.createIcons();
      }
      
      // Variables
      let currentCategory = ''; // To store which category's Add Task button was clicked
      
      // Add task buttons
      const addTaskButtons = document.querySelectorAll('.add-task-btn');
      const taskModal = document.getElementById('taskModal');
      const closeModalBtn = taskModal.querySelector('.close-modal-btn');
      const cancelBtn = taskModal.querySelector('.cancel-btn');
      const taskForm = document.getElementById('taskForm');
      const categorySelect = document.getElementById('taskCategory');
      
      // Open modal when any Add Task button is clicked
      addTaskButtons.forEach(button => {
          button.addEventListener('click', function() {
              // Get the category from the parent card
              const categoryCard = this.closest('.category-card');
              const categoryTitle = categoryCard.querySelector('h3').textContent.trim();
              
              // Store the current category
              currentCategory = categoryTitle;
              
              // Pre-select the category in the dropdown
              const categoryOptions = Array.from(categorySelect.options);
              const matchingOption = categoryOptions.find(option => 
                  option.textContent.toLowerCase().includes(categoryTitle.toLowerCase())
              );
              
              if (matchingOption) {
                  categorySelect.value = matchingOption.value;
              }
              
              // Show the modal
              taskModal.classList.add('show');
          });
      });
      
      // Close modal functions
      function closeModal() {
          taskModal.classList.remove('show');
          // Reset form after modal is closed
          setTimeout(() => {
              taskForm.reset();
          }, 300); // Wait for transition to complete
      }
      
      // Close modal when clicking the close button
      closeModalBtn.addEventListener('click', closeModal);
      
      // Close modal when clicking the cancel button
      cancelBtn.addEventListener('click', closeModal);
      
      // Close modal when clicking outside the modal content
      taskModal.addEventListener('click', function(event) {
          if (event.target === taskModal) {
              closeModal();
          }
      });
      
      // Handle form submission
      taskForm.addEventListener('submit', function(event) {
          event.preventDefault();
          
          // Get form values
          const category = categorySelect.value;
          const title = document.getElementById('taskTitle').value;
          const description = document.getElementById('taskDescription').value;
          const timeStart = document.getElementById('taskTimeStart').value;
          const timeEnd = document.getElementById('taskTimeEnd').value;
          const priority = document.getElementById('taskPriority').value;
          
          // Format time for display
          const timeDisplay = formatTimeDisplay(timeStart, timeEnd);
          
          // Create new task
          createNewTask(category, title, description, timeDisplay, priority);
          
          // Close modal
          closeModal();
      });
      
      // Function to format time display
      function formatTimeDisplay(startTime, endTime) {
          if (!startTime && !endTime) return 'No time set';
          
          // Convert 24h format to 12h format with AM/PM
          function formatTime(timeString) {
              if (!timeString) return '';
              
              const [hours, minutes] = timeString.split(':');
              let h = parseInt(hours, 10);
              const ampm = h >= 12 ? 'PM' : 'AM';
              h = h % 12;
              h = h ? h : 12; // Convert 0 to 12
              return `${h}:${minutes} ${ampm}`;
          }
          
          const formattedStart = formatTime(startTime);
          const formattedEnd = formatTime(endTime);
          
          if (formattedStart && formattedEnd) {
              return `${formattedStart} - ${formattedEnd}`;
          } else if (formattedStart) {
              return `Starts at ${formattedStart}`;
          } else if (formattedEnd) {
              return `Ends at ${formattedEnd}`;
          }
          
          return 'No time set';
      }
      
      // Function to create a new task
      function createNewTask(category, title, description, time, priority) {
          // Find the appropriate category card
          const categoryCards = document.querySelectorAll('.category-card');
          let targetCard;
          
          // Match by category value or by current category name
          for (const card of categoryCards) {
              const cardTitle = card.querySelector('h3').textContent.trim().toLowerCase();
              if (cardTitle.includes(category) || (currentCategory && cardTitle.includes(currentCategory.toLowerCase()))) {
                  targetCard = card;
                  break;
              }
          }
          
          if (!targetCard) return;
          
          // Create the task item
          const taskItem = document.createElement('div');
          taskItem.className = 'task-item';
          
          // Set priority class
          const priorityClass = priority === 'high' ? 'priority-high' : 
                               priority === 'medium' ? 'priority-medium' : 'priority-low';
          
          // Create task item content
          taskItem.innerHTML = `
              <span class="task-priority ${priorityClass}"></span>
              <div class="task-details">
                  <strong>${title}</strong>
                  <p>${time} ${description ? '| ' + description : ''}</p>
              </div>
              <div class="task-actions">
                  <input type="checkbox" class="task-checkbox">
                  <button class="task-actions-btn">
                      <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="task-actions-btn">
                      <i class="fa-solid fa-trash"></i>
                  </button>
              </div>
          `;
          
          // Add the task to the category card
          targetCard.appendChild(taskItem);
          
          // Update task counts
          updateTaskCounts();
      }
      
      // Function to update task counts
      function updateTaskCounts() {
          const totalTasks = document.querySelectorAll('.task-item').length;
          const completedTasks = document.querySelectorAll('.task-item .task-checkbox:checked').length;
          const pendingTasks = totalTasks - completedTasks;
          
          // Update the insight cards
          const pendingTasksElement = document.querySelector('.insight-card:nth-child(1) .insight-value');
          const completedTasksElement = document.querySelector('.insight-card:nth-child(2) .insight-value');
          const progressElement = document.querySelector('.insight-card:nth-child(3) .insight-value');
          
          if (pendingTasksElement) pendingTasksElement.textContent = pendingTasks;
          if (completedTasksElement) completedTasksElement.textContent = completedTasks;
          
          // Calculate and update progress percentage
          if (progressElement && totalTasks > 0) {
              const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
              progressElement.textContent = `${progressPercentage}%`;
          }
      }
      
      // Add event listener for task checkboxes (for existing and new tasks)
      document.addEventListener('change', function(event) {
          if (event.target.classList.contains('task-checkbox')) {
              const taskItem = event.target.closest('.task-item');
              
              if (event.target.checked) {
                  taskItem.classList.add('completed');
              } else {
                  taskItem.classList.remove('completed');
              }
              
              // Update task counts
              updateTaskCounts();
          }
      });
      
      // Add event listener for delete buttons
      document.addEventListener('click', function(event) {
          const deleteBtn = event.target.closest('.fa-trash');
          if (deleteBtn) {
              const taskItem = deleteBtn.closest('.task-item');
              taskItem.remove();
              // Update task counts
              updateTaskCounts();
          }
      });
  });