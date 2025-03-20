document.addEventListener('DOMContentLoaded', () => {
    const breathingCircle = document.querySelector('.breathing-circle');
    const breathingInstructions = document.querySelector('.breathing-instructions');
    const startButton = document.querySelector('.start-button');
    const setReminderButton = document.querySelector('.set-reminder-button');
    const notification = document.querySelector('.notification');
    
    let isBreathing = false;
    let currentStep = 0;
    const steps = ['Inhale', 'Hold', 'Exhale', 'Hold'];
    const totalSteps = steps.length;
    const stepDuration = 4000; // 4 seconds per step

    function updateBreathingCircle(step) {
        breathingCircle.style.transition = `all ${stepDuration}ms ease`;
        
        switch(step) {
            case 0: // Inhale
                breathingCircle.style.transform = 'scale(1.5)';
                breathingCircle.style.borderColor = '#00a86b';
                break;
            case 1: // Hold after inhale
                breathingCircle.style.borderColor = '#ffc629';
                break;
            case 2: // Exhale
                breathingCircle.style.transform = 'scale(1)';
                breathingCircle.style.borderColor = '#ff7f50';
                break;
            case 3: // Hold after exhale
                breathingCircle.style.borderColor = '#4169e1';
                break;
        }
    }

    function updateInstructions(step) {
        breathingInstructions.textContent = steps[step];
    }

    function breathingCycle() {
        if (!isBreathing) return;

        updateBreathingCircle(currentStep);
        updateInstructions(currentStep);

        currentStep = (currentStep + 1) % totalSteps;

        setTimeout(breathingCycle, stepDuration);
    }

    startButton.addEventListener('click', () => {
        if (!isBreathing) {
            isBreathing = true;
            startButton.textContent = 'Stop Box Breathing';
            breathingCycle();
        } else {
            isBreathing = false;
            startButton.textContent = 'Start Box Breathing';
            currentStep = 0;
            breathingCircle.style.transform = 'scale(1)';
            breathingCircle.style.borderColor = '#005c97';
            breathingInstructions.textContent = 'Inhale';
        }
    });

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    function setDailyReminder() {
        if (Notification.permission === 'granted') {
            showNotification('Daily reminder set for mindfulness breaks!');
            scheduleDailyNotification();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('Daily reminder set for mindfulness breaks!');
                    scheduleDailyNotification();
                }
            });
        } else {
            showNotification('Please enable notifications to set daily reminders.');
        }
    }

    function scheduleDailyNotification() {
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(10, 0, 0, 0); // Set notification time to 10:00 AM

        if (now > notificationTime) {
            notificationTime.setDate(now.getDate() + 1);
        }

        const timeUntilNotification = notificationTime.getTime() - now.getTime();

        setTimeout(() => {
            new Notification('Take a 5-minute mindfulness break to reset and recharge!');
            scheduleDailyNotification();
        }, timeUntilNotification);
    }

    setReminderButton.addEventListener('click', setDailyReminder);
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