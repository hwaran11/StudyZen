document.addEventListener('DOMContentLoaded', () => {
    const dateNav = document.querySelector('.date-nav');
    const currentDateElement = document.getElementById('datePicker');
    const addTaskBtns = document.querySelectorAll('.add-task');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.querySelector('.close');
    const taskForm = document.getElementById('taskForm');
    const taskColumns = document.querySelectorAll('.task-column');
    const prevDayBtn = document.getElementById('prevDay');
    const nextDayBtn = document.getElementById('nextDay');
    const userGreeting = document.getElementById('userGreeting');
    const eisenhowerTags = document.querySelectorAll('#priorityOptions .tag');
    const snackbar = document.getElementById('snackbar');

    let currentDate = new Date();
    let currentTaskId = null; 
    let startTime = null; 

    let tasks = {
        Productivity: [],
        "Active Recreation": [],
        "Personal Development": []
    };

    async function fetchTasks(date) {
        try {
            console.log('Fetching tasks for date:', date); // Add log
            const response = await fetch(`/api/tasks?date=${date}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Tasks received:', data); // Add log
            tasks = {
                Productivity: [],
                "Active Recreation": [],
                "Personal Development": []
            };
            data.forEach(task => {
                if (tasks[task.category]) {
                    tasks[task.category].push(task);
                }
            });
            renderTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showSnackbar('Error fetching tasks');
        }
    }    

    function updateDateDisplay() {
        const formattedDate = currentDate.toISOString().split('T')[0];
        if (currentDateElement) {
            currentDateElement.value = formattedDate;
        }
        if (userGreeting) {
            userGreeting.textContent = `Hi ${getUserName()}, Let's rock today!`;
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDateDisplay = currentDate.toLocaleDateString(undefined, options);
        document.getElementById('currentDate').textContent = formattedDateDisplay;
        document.getElementById('datePicker').value = formattedDate;  // Ensure the date picker is set to the current date
        fetchTasks(formattedDate); // Fetch tasks for the new date
    }
    
    function getUserName() {
        return "Hervishwaran";
    }

    function previousDay() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        fetchTasks(currentDate.toISOString().split('T')[0]);
    }

    function nextDay() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        fetchTasks(currentDate.toISOString().split('T')[0]);
    }

    document.getElementById('prevDay').addEventListener('click', previousDay);
    document.getElementById('nextDay').addEventListener('click', nextDay);

    function openModal(category) {
        if (taskModal) {
            taskModal.style.display = 'flex';
            document.getElementById('category').value = category;

            // Set the current date
            const formattedDate = currentDate.toISOString().split('T')[0];
            document.getElementById('taskDate').value = formattedDate;

            // Reset other form fields
            document.getElementById('taskTitle').value = '';
            document.getElementById('startTime').value = '';
            document.getElementById('endTime').value = '';
            document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('selected'));

            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = 'Add New Task';
        }
    }

    function closeModalHandler() {
        if (taskModal) {
            taskModal.style.display = 'none';
        }
    }

    async function handleTaskSubmit(event) {
        event.preventDefault();
        const category = document.getElementById('category').value;
        const title = document.getElementById('taskTitle').value;
        const date = document.getElementById('taskDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const priority = document.querySelector('.tag.selected')?.dataset.value;
        const userId = getCurrentUserId(); // Add this line to get the current user ID
    
        if (!category || !title || !date || !startTime || !endTime || !priority) {
            alert('Please fill in all fields');
            return;
        }
    
        const task = {
            userId, // Include the user ID in the task object
            category,
            title,
            date,
            startTime,
            endTime,
            priority,
            completed: false
        };
    
        try {
            if (currentTaskId) {
                const response = await fetch(`/api/tasks/${currentTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(task)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedTask = await response.json();
                const index = tasks[category].findIndex(t => t._id === currentTaskId);
                if (index !== -1) {
                    tasks[category][index] = updatedTask;
                }
            } else {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(task)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const newTask = await response.json();
                tasks[category].push(newTask);
            }
            closeModalHandler();
            renderTasks();
            showSnackbar('Task saved successfully');
        } catch (error) {
            console.error('Error saving task:', error);
            showSnackbar('Error saving task');
        }
    }
    
    function getCurrentUserId() {
        // Assuming the user ID is stored in local storage after login
        return localStorage.getItem('userId');
    }

    function renderTasks() {
        const currentDateStr = currentDate.toISOString().split('T')[0];
        Object.keys(tasks).forEach(category => {
            const possibleIds = [
                `${category.replace(/\s+/g, '')}Tasks`,
                `${category.toLowerCase().replace(/\s+/g, '-')}Tasks`,
                category
            ];
            let column;
            for (let id of possibleIds) {
                column = document.getElementById(id);
                if (column) break;
            }
            if (!column) {
                console.warn(`Column for category "${category}" not found. Tried IDs: ${possibleIds.join(', ')}`);
                return;
            }
            let taskList = column.querySelector('.task-list');
            if (!taskList) {
                taskList = document.createElement('div');
                taskList.className = 'task-list';
                column.appendChild(taskList);
            }
            taskList.innerHTML = '';
            if (Array.isArray(tasks[category])) {
                tasks[category].forEach(task => {
                    if (task && task.date === currentDateStr) {
                        const taskItem = document.createElement('div');
                        taskItem.className = 'task-card';
                        const priorityClass = task.priority.toLowerCase().replace(' ', '-');
                        const completedClass = task.completed ? 'completed' : '';
                        taskItem.innerHTML = `
                            <div class="task-card-header">
                                <h3 class="task-title">${task.title || 'Untitled Task'}</h3>
                                <div class="task-actions">
                                    <button class="edit-btn"><i class="material-icons">edit</i></button>
                                    <button class="delete-btn"><i class="material-icons">delete</i></button>
                                </div>
                            </div>
                            <div class="task-details">
                                <p class="task-time">${task.startTime || ''} - ${task.endTime || ''}</p>
                                <p class="task-category">${task.category || ''}</p>
                                <div class="task-meta">
                                    <span class="task-priority ${task.priority.toLowerCase()}-priority">${task.priority}</span>
                                    <input type="checkbox" class="complete-checkbox ${completedClass}" ${task.completed ? 'checked' : ''}>
                                </div>
                            </div>
                        `;
                        const checkbox = taskItem.querySelector('.complete-checkbox');
                        checkbox.addEventListener('change', () => toggleTaskCompletion(task._id, category));
                        const editBtn = taskItem.querySelector('.edit-btn');
                        editBtn.addEventListener('click', () => editTask(task._id, category));
                        const deleteBtn = taskItem.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', () => deleteTask(task._id, category));
                        if (task.completed) {
                            taskItem.classList.add('completed');
                        }
                        taskList.appendChild(taskItem);
                    }
                });
            }
        });
        updateProgressBars();
    }    

    async function toggleTaskCompletion(taskId, category) {
        try {
            const response = await fetch(`/api/tasks/${taskId}/toggle`, {
                method: 'PATCH'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTask = await response.json();
            const task = tasks[category].find(t => t._id === taskId);
            if (task) {
                task.completed = updatedTask.completed;
                renderTasks();
            }
            showSnackbar('Task completion status updated');
        } catch (error) {
            console.error('Error toggling task completion:', error);
            showSnackbar('Error updating task completion status');
        }
    }

    async function deleteTask(taskId, category) {
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            tasks[category] = tasks[category].filter(task => task._id !== taskId);
            renderTasks();
            showSnackbar('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            showSnackbar('Error deleting task');
        }
    }

    function updateProgressBars() {
        taskColumns.forEach(column => {
            const category = column.id.replace('Tasks', '');
            if (tasks[category]) {
                const totalTasks = tasks[category].filter(task => task.date === currentDate.toISOString().split('T')[0]).length;
                const completedTasks = tasks[category].filter(task => task.date === currentDate.toISOString().split('T')[0] && task.completed).length;
                const progress = (completedTasks / totalTasks) * 100 || 0;
                const progressBar = column.querySelector('.progress');
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
            }
        });
    }

    if (typeof flatpickr === 'undefined') {
        const dateInput = document.getElementById('taskDate');
        dateInput.type = 'date';
    } else {
        flatpickr("#taskDate", {
            dateFormat: "Y-m-d",
            defaultDate: "today",
            minDate: "today",
            disableMobile: "true"
        });
    }

    function setupTimePicker(inputId, dropdownId, isEndTime = false) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        input.addEventListener('click', () => {
            const timeOptions = generateTimeOptions(isEndTime);
            dropdown.innerHTML = timeOptions.map(({ time, duration }) => 
                `<div class="time-option">${time}${duration ? ` (${duration})` : ''}</div>`
            ).join('');
            dropdown.style.display = 'block';
        });
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        dropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-option')) {
                input.value = e.target.textContent.split(' (')[0];
                dropdown.style.display = 'none';
                if (inputId === 'startTime') {
                    startTime = parseTime(input.value);
                    updateEndTimeOptions();
                }
            }
        });
    }

    function generateTimeOptions(isEndTime) {
        const options = [];
        const baseTime = isEndTime && startTime ? new Date(startTime.getTime()) : new Date().setHours(0, 0, 0, 0);
        const endTime = new Date(baseTime).setHours(24, 0, 0, 0);
        for (let time = new Date(baseTime); time < endTime; time.setMinutes(time.getMinutes() + 15)) {
            const formattedTime = formatTime(time);
            let duration = '';
            if (isEndTime && startTime) {
                duration = getDuration(time - startTime);
            }
            options.push({ time: formattedTime, duration });
        }
        return options;
    }

    function parseTime(timeString) {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return new Date(2000, 0, 1, hours, parseInt(minutes));
    }

    function getDuration(milliseconds) {
        const minutes = Math.round(milliseconds / (60 * 1000));
        if (minutes < 60) return `${minutes} mins`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
        return `${hours} hr ${remainingMinutes} mins`;
    }

    function updateEndTimeOptions() {
        const endTimeInput = document.getElementById('endTime');
        const endTimeDropdown = document.getElementById('endTimeDropdown');
        const endTimeOptions = generateTimeOptions(true);
        endTimeDropdown.innerHTML = endTimeOptions.map(({ time, duration }) => 
            `<div class="time-option">${time}${duration ? ` (${duration})` : ''}</div>`
        ).join('');
        const defaultEndTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        endTimeInput.value = formatTime(defaultEndTime);
    }

    function formatTime(date) {
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${hours}:${minutes} ${period}`;
    }

    eisenhowerTags.forEach(tag => {
        tag.addEventListener('click', () => {
            eisenhowerTags.forEach(tag => tag.classList.remove('selected'));
            tag.classList.add('selected');
        });
    });

    function showSnackbar(message) {
        snackbar.textContent = message;
        snackbar.className = "show";
        setTimeout(() => { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }

    function init() {
        updateDateDisplay();
        fetchTasks(currentDate.toISOString().split('T')[0]);
        if (prevDayBtn) prevDayBtn.addEventListener('click', previousDay);
        if (nextDayBtn) nextDayBtn.addEventListener('click', nextDay);
        if (currentDateElement) {
            currentDateElement.addEventListener('change', (e) => {
                currentDate = new Date(e.target.value);
                updateDateDisplay();
                fetchTasks(currentDate.toISOString().split('T')[0]);
            });
        }
        addTaskBtns.forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.category));
        });
        if (closeModal) {
            closeModal.addEventListener('click', closeModalHandler);
        }
        window.addEventListener('click', (event) => {
            if (event.target === taskModal) {
                closeModalHandler();
            }
        });
        if (taskForm) {
            taskForm.addEventListener('submit', handleTaskSubmit);
        }
        setupTimePicker('startTime', 'startTimeDropdown');
        setupTimePicker('endTime', 'endTimeDropdown', true);
    }

    window.editTask = openModal;
    window.deleteTask = deleteTask;
    window.toggleTaskCompletion = toggleTaskCompletion;

    init();
});

document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user._id === userId);
                if (user) {
                    document.getElementById('sidebarUsername').textContent = user.partnerSetup?.step1?.fullName;
                    document.querySelector('.sidebar-avatar').src = user.partnerSetup?.step1?.profilePic || 'https://via.placeholder.com/50';
                    document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.partnerSetup?.step1?.fullName.split(' ')[0]}!`;
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }

    // User profile dropdown
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const dropdownContent = userProfileDropdown.querySelector('.dropdown-content');

    userProfileDropdown.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });

    // Close the dropdown if clicked outside
    window.addEventListener('click', function(event) {
        if (!event.target.closest('#userProfileDropdown')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/Login/login.html';
    });
});
