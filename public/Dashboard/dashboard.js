document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please check your script tags.');
        return;
    }

    fetchUserData();
    setupLogout();
    setupMobileMenu();
    fetchTaskDistribution();
    fetchTaskCompletionOverTime();
    fetchMindfulnessData();
});

function fetchUserData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user._id === userId);
                if (user) {
                    document.getElementById('sidebarUsername').textContent = user.partnerSetup?.step1?.fullName || 'User';
                    document.querySelector('.sidebar-avatar').src = user.partnerSetup?.step1?.profilePic || 'https://via.placeholder.com/50';
                    document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.partnerSetup?.step1?.fullName.split(' ')[0] || 'User'}!`;
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
}

function setupLogout() {
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/Login/login.html';
    });
}

function setupMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !hamburgerMenu.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
}

function fetchTaskDistribution() {
    console.log('Fetching task distribution');
    const categories = ['Productivity', 'Active Recreation', 'Personal Development'];
    const priorities = ['High', 'Medium', 'Low'];
    let chartData = {
        labels: categories,
        datasets: priorities.map(priority => ({
            label: priority,
            data: new Array(categories.length).fill(0),
            backgroundColor: getPriorityColor(priority)
        }))
    };

    let fetchPromises = categories.map(category => 
        fetch(`/api/tasks/analytics/priority/${category.replace(' ', '-')}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Data received for ${category}:`, data);
                data.forEach(item => {
                    let priorityIndex = priorities.indexOf(item._id);
                    let categoryIndex = categories.indexOf(category);
                    if (priorityIndex !== -1 && categoryIndex !== -1) {
                        chartData.datasets[priorityIndex].data[categoryIndex] = item.count;
                    }
                });
            })
            .catch(error => {
                console.error(`Error fetching ${category} distribution:`, error);
            })
    );

    Promise.all(fetchPromises).then(() => {
        console.log('All data fetched, creating chart');
        console.log('Chart data:', chartData);
        createStackedBarChart(chartData);
    });
}

function createStackedBarChart(data) {
    const ctx = document.getElementById('taskDistributionChart');
    if (!ctx) {
        console.error('Chart container not found when trying to create chart');
        return;
    }

    console.log('Creating chart with data:', data);

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { 
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tasks'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Task Distribution by Category and Priority',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    console.log('Chart created');
}

function getPriorityColor(priority) {
    switch(priority) {
        case 'High': return 'rgba(255, 99, 132, 0.8)';
        case 'Medium': return 'rgba(255, 206, 86, 0.8)';
        case 'Low': return 'rgba(75, 192, 192, 0.8)';
        default: return 'rgba(201, 203, 207, 0.8)';
    }
}

function fetchTaskCompletionOverTime() {
    const startDate = '2024-07-01';
    const endDate = '2024-07-31';
    fetch(`/api/tasks/analytics/completion-over-time?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            createCompletionOverTimeChart(data);
        })
        .catch(error => console.error('Error fetching completion over time data:', error));
}

function createCompletionOverTimeChart(data) {
    const ctx = document.getElementById('completionOverTimeChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0.2)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item._id),
            datasets: [{
                label: 'Completed Tasks',
                data: data.map(item => item.taskCount),
                backgroundColor: gradient,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 4,
                fill: 'start'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tasks'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Task Completion Over Time',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}

function fetchMindfulnessData() {
    const userId = localStorage.getItem('userId') || '669c1b21a0611aa1070f644a';
    
    fetch(`/api/mindfulness/analytics/frequency?userId=${userId}`)
        .then(response => response.json())
        .then(data => createMindfulnessFrequencyChart(data))
        .catch(error => console.error('Error fetching mindfulness frequency data:', error));

    fetch(`/api/mindfulness/analytics/time-of-day?userId=${userId}`)
        .then(response => response.json())
        .then(data => createTimeOfDayChart(data))
        .catch(error => console.error('Error fetching time of day analysis:', error));
}

function createMindfulnessFrequencyChart(data) {
    const ctx = document.getElementById('mindfulnessFrequencyChart').getContext('2d');
    const chartData = Array.isArray(data) ? data : [data];
    const labels = chartData.map(item => item._id || 'Unknown');
    const values = chartData.map(item => item.count || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mindfulness Sessions',
                data: values,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Sessions'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Mindfulness Practice Frequency',
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Sessions: ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}

function createTimeOfDayChart(data) {
    const ctx = document.getElementById('timeOfDayChart').getContext('2d');
    const timeLabels = Array.from({length: 24}, (_, i) => `${i}:00`);
    const dataset = timeLabels.map(label => {
        const matchingData = data.find(item => item._id === label);
        return matchingData ? matchingData.count : 0;
    });

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Mindfulness Sessions',
                data: dataset,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Time of Day Analysis for Mindfulness Practice',
                fontSize: 16
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });
}