document.addEventListener('DOMContentLoaded', () => {
    const dailyPlannerGrid = document.querySelector('.planner-grid');
    if (dailyPlannerGrid) {
        dailyPlannerGrid.innerHTML += generateDailyTimeSlots();
    }

    let currentDay = dayjs();
    updateDayDisplay(currentDay);

    document.getElementById('prev-day').addEventListener('click', () => {
        currentDay = currentDay.subtract(1, 'day');
        updateDayDisplay(currentDay);
        loadTasksForDay(currentDay);
    });

    document.getElementById('next-day').addEventListener('click', () => {
        currentDay = currentDay.add(1, 'day');
        updateDayDisplay(currentDay);
        loadTasksForDay(currentDay);
    });

    document.getElementById('today-button').addEventListener('click', () => {
        currentDay = dayjs();
        updateDayDisplay(currentDay);
        loadTasksForDay(currentDay);
        scrollToTimeIndicator();
    });

    document.getElementById('day-view').addEventListener('click', () => {
        window.location.href = './calendar-daily.html';
    });

    document.getElementById('week-view').addEventListener('click', () => {
        window.location.href = '/Calendar-Weekly/dailyweekly.html';
    });

    document.getElementById('month-view').addEventListener('click', () => {
        window.location.href = '/Calendar-Monthly/monthlycalendar.html';
    });

    loadTasksForDay(currentDay);
    updateCurrentTimeIndicator(currentDay);
    scrollToTimeIndicator();
    setInterval(() => updateCurrentTimeIndicator(currentDay), 60000);

    implementTaskCreation();
});

function generateDailyTimeSlots() {
    const times = [];
    for (let i = 0; i < 24; i++) {
        let hour = i % 12 === 0 ? 12 : i % 12;
        let ampm = i < 12 ? 'AM' : 'PM';
        let time = `${hour} ${ampm}`;
        times.push(`<div class="time-slot hour">${time}</div><div class="time-slot" data-hour="${i}"></div><div class="time-slot" data-hour="${i}" style="height: 30px;"></div>`);
    }
    return times.join('');
}

function updateDayDisplay(day) {
    const dayDisplay = document.getElementById('current-date');
    dayDisplay.textContent = day.format('MMMM D, YYYY');
}

async function loadTasksForDay(day) {
    console.log(`Loading tasks for day: ${day.format('YYYY-MM-DD')}`); // Debug statement
    try {
        const response = await fetch(`/api/tasks/day?date=${day.format('YYYY-MM-DD')}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }

        const tasks = await response.json();
        console.log('Fetched tasks:', tasks); // Debug statement
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function displayTasks(tasks) {
    const grid = document.querySelector('.planner-grid');
    grid.querySelectorAll('.task-card').forEach(card => card.remove());

    tasks.forEach(task => {
        const startHour = parseInt(task.startTime.split(':')[0], 10);
        const startMinute = parseInt(task.startTime.split(':')[1], 10);
        const endHour = parseInt(task.endTime.split(':')[0], 10);
        const endMinute = parseInt(task.endTime.split(':')[1], 10);

        const startPosition = startHour * 2 + Math.floor(startMinute / 30) + 1;
        const endPosition = endHour * 2 + Math.floor(endMinute / 30) + 1;

        const taskElement = document.createElement('div');
        taskElement.id = `task-${task.id}`;
        taskElement.classList.add('task-card', task.category.toLowerCase().replace(' ', '-'));
        taskElement.style.gridRow = `${startPosition} / ${endPosition}`;
        taskElement.style.gridColumn = '2';

        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.category}</p>
            <p>${task.startTime} - ${task.endTime}</p>
        `;

        taskElement.addEventListener('click', () => editTask(task));

        grid.appendChild(taskElement);
    });

    implementDragAndDrop();
}

function updateCurrentTimeIndicator(day) {
    const currentTimeIndicator = document.querySelector('.current-time-indicator');
    if (day.isSame(dayjs(), 'day')) {
        const now = dayjs();
        const hours = now.hour();
        const minutes = now.minute();
        const totalMinutes = hours * 60 + minutes;
        const totalHalfHours = totalMinutes / 30;
        const percentageOfDay = totalHalfHours / 48 * 100;

        currentTimeIndicator.style.top = `${percentageOfDay}%`;
        currentTimeIndicator.style.display = 'block';
    } else {
        currentTimeIndicator.style.display = 'none';
    }
}

function scrollToTimeIndicator() {
    const currentTimeIndicator = document.querySelector('.current-time-indicator');
    if (currentTimeIndicator.style.display === 'block') {
        currentTimeIndicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function implementDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.setAttribute('draggable', true);
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
    });

    const timeSlots = document.querySelectorAll('.time-slot:not(.hour)');
    timeSlots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', drop);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.style.display = 'none', 0);
}

function dragEnd(e) {
    e.target.style.display = 'block';
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    const taskElement = document.getElementById(taskId);
    const targetSlot = e.target.closest('.time-slot');
    
    if (targetSlot && taskElement) {
        targetSlot.appendChild(taskElement);
        updateTaskTime(taskId, targetSlot.dataset.hour);
    }
}

async function updateTaskTime(taskId, newHour) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ startTime: `${newHour}:00` })
        });

        if (!response.ok) {
            throw new Error('Failed to update task time');
        }

        loadTasksForDay(currentDay);
    } catch (error) {
        console.error('Error updating task time:', error);
    }
}

function implementTaskCreation() {
    const timeSlots = document.querySelectorAll('.time-slot:not(.hour)');
    timeSlots.forEach(slot => {
        slot.addEventListener('dblclick', (e) => createNewTask(e, slot.dataset.hour));
    });
}

async function createNewTask(e, hour) {
    const taskTitle = prompt('Enter task title:');
    if (taskTitle) {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: taskTitle,
                    startTime: `${hour}:00`,
                    endTime: `${parseInt(hour) + 1}:00`,
                    date: currentDay.format('YYYY-MM-DD'),
                    category: 'Productivity' // Default category
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            loadTasksForDay(currentDay);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }
}

async function editTask(task) {
    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle !== null) {
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: newTitle })
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            loadTasksForDay(currentDay);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
}

// You might want to add this function to handle task deletion
async function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            loadTasksForDay(currentDay);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}

// Add this function to handle category changes
async function changeTaskCategory(taskId, newCategory) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ category: newCategory })
        });

        if (!response.ok) {
            throw new Error('Failed to update task category');
        }

        loadTasksForDay(currentDay);
    } catch (error) {
        console.error('Error updating task category:', error);
    }
}

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