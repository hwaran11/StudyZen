class NotificationManager {
    constructor(btnId, inboxId, badgeId) {
        this.notificationBtn = document.getElementById(btnId);
        this.notificationInbox = document.getElementById(inboxId);
        this.notificationBadge = document.getElementById(badgeId);

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Toggle inbox visibility
        this.notificationBtn.addEventListener('click', () => {
            this.notificationInbox.classList.toggle('show');
        });

        // Close inbox when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.notificationBtn.contains(event.target) && 
                !this.notificationInbox.contains(event.target)) {
                this.notificationInbox.classList.remove('show');
            }
        });
    }

    addNotification(title, text, icon = 'bell') {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-text">${text}</div>
                <div class="notification-time">Just now</div>
            </div>
        `;

        this.notificationInbox.insertBefore(notificationItem, this.notificationInbox.firstChild);
        this.updateBadgeCount();
    }

    updateBadgeCount(count = null) {
        if (count !== null) {
            this.notificationBadge.textContent = count;
        } else {
            const currentCount = parseInt(this.notificationBadge.textContent);
            this.notificationBadge.textContent = currentCount + 1;
        }
    }

    clearNotifications() {
        this.notificationInbox.innerHTML = '';
        this.notificationBadge.textContent = '0';
    }
}

// Productivity Streak remains the same as in previous implementation
class ProductivityStreak {
    // ... (previous implementation)

    completeDay() {
        const today = new Date().toDateString();
        
        if (this.streakData.lastCompletedDate === today) {
            console.log('Day already completed');
            return;
        }

        this.streakData.currentStreak++;
        this.streakData.lastCompletedDate = today;

        localStorage.setItem('productivityStreak', JSON.stringify(this.streakData));
        this.renderStreak();

        // Add a notification when streak is updated
        if (this.streakData.currentStreak % 7 === 0) {
            notificationManager.addNotification(
                'Streak Milestone', 
                `You've reached a ${this.streakData.currentStreak}-day productivity streak!`,
                'trophy'
            );
        }
    }
}

// Initialize components
const productivityStreak = new ProductivityStreak('productivityStreak');
const notificationManager = new NotificationManager('notificationBtn', 'notificationInbox', 'notificationBadge');

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('datePicker');
    const dateDisplay = document.querySelector('.date-display');
    const calendarBtn = document.querySelector('.calendar-btn');

    // Set current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    dateDisplay.textContent = formattedDate;

    // Set the date input to current date
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    dateInput.value = formatDate(currentDate);

    // Open date picker when calendar button is clicked
    calendarBtn.addEventListener('click', () => {
        dateInput.click();
    });

    // Update display when date is changed
    dateInput.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
        dateDisplay.textContent = formattedSelectedDate;
    });
});