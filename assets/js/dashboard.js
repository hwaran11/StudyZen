document.addEventListener("DOMContentLoaded", function () {
  // Update the current date
  const currentDateElement = document.getElementById("current-date");
  if (currentDateElement) {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    currentDateElement.textContent = now.toLocaleDateString("en-US", options);
  }

  // You could also personalize the greeting based on time of day
  const greetingMessage = document.querySelector(".greeting-message");
  if (greetingMessage) {
    const hour = new Date().getHours();
    let greeting = "Welcome back";

    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    // Replace just the greeting part, keeping the username
    const userName = document.querySelector(".user-name").textContent;
    greetingMessage.innerHTML = `${greeting}, <span class="user-name">${userName}</span>!`;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const daysContainer = document.getElementById("calendar-days");
  const monthYearElement = document.getElementById("month-year");
  const selectedDateElement = document.getElementById("selected-date");
  const prevMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");

  let currentDate = new Date();
  let selectedDate = new Date(currentDate);

  // Initialize the calendar
  generateCalendar(currentDate);

  // Event listeners for navigation buttons
  prevMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
  });

  nextMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
  });

  function generateCalendar(date) {
    // Clear the calendar
    daysContainer.innerHTML = "";

    // Update the month and year display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthYearElement.textContent = `${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;

    // Get the first day of the month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    // Get the number of days in the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Create empty cells for days before the first day of the month
    const firstDayIndex = firstDay.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "day empty";
      daysContainer.appendChild(emptyDay);
    }

    // Create cells for each day of the month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = i;

      // Check if this day is today
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        i === today.getDate()
      ) {
        dayElement.classList.add("today");
      }

      // Check if this day is the selected date
      if (
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        i === selectedDate.getDate()
      ) {
        dayElement.classList.add("selected");
      }

      // Add click event to select this day
      dayElement.addEventListener("click", function () {
        // Remove the selected class from the previously selected day
        const selectedDay = document.querySelector(".day.selected");
        if (selectedDay) {
          selectedDay.classList.remove("selected");
        }

        // Add the selected class to this day
        dayElement.classList.add("selected");

        // Update the selected date
        selectedDate = new Date(date.getFullYear(), date.getMonth(), i);
        updateSelectedDateDisplay();
      });

      daysContainer.appendChild(dayElement);
    }

    updateSelectedDateDisplay();
  }

  function updateSelectedDateDisplay() {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    selectedDateElement.textContent = `${selectedDate.toLocaleDateString(
      "en-US",
      options
    )}`;
  }
});

// Daily Planner Stats JavaScript with Chart.js

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {

  // Configuration for the doughnut chart
  const taskProgressCtx = document.getElementById('taskProgressChart').getContext('2d');

  const taskProgressChart = new Chart(taskProgressCtx, {
    type: 'gauge',
    data: {
      datasets: [{
        value: 60,
        minValue: 0,
        maxValue: 100,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) {
            return;
          }
          
          const gradientSegment = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradientSegment.addColorStop(0, '#48bb78');
          gradientSegment.addColorStop(1, '#38a169');
          
          return gradientSegment;
        },
        valueBackgroundColor: '#f7fafc',
        valueTextColor: '#2d3748',
        valueFontSize: 0, // Hide the default value text, we'll use our own
        valueTextShadowColor: 'rgba(0,0,0,0.1)',
        valueTextShadowBlur: 2,
        arc: {
          thickness: 0.15,
          borderWidth: 0,
          cornerRadius: 5,
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 15
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      cutout: '75%',
      circumference: 180,
      rotation: 270
    }
  });

  // Function to update the task progress chart
  function updateTaskProgress(completed, total) {
    const percentage = Math.round((completed / total) * 100);
    const remaining = 100 - percentage;

    // Update chart data
    taskProgressChart.data.datasets[0].data = [percentage, remaining];
    taskProgressChart.update();

    // Update percentage display
    document.querySelector(
      ".progress-percentage"
    ).textContent = `${percentage}%`;

    // Update task count display
    document.querySelector(".count-completed").textContent = completed;
    document.querySelector(".count-total").textContent = total;
  }

  // Example: Update progress (this would be connected to your actual data)
  // updateTaskProgress(3, 5);

  // Function to update streak counter
  function updateStreak(days) {
    document.querySelector(".streak-count").textContent = days;
  }

  // Example: Update streak counter
  // updateStreak(4);

  // For demo purposes, we could add simple animations
  const animateCounter = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Animate the completed tasks count on page load
  const countCompletedElement = document.querySelector(".count-completed");
  animateCounter(countCompletedElement, 0, 3, 1000);

  // Animate the streak count on page load
  const streakCountElement = document.querySelector(".streak-count");
  animateCounter(streakCountElement, 0, 4, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
  // Profile data
  const profileData = {
      1: {
          name: "Sofea",
          role: "Computer Science",
          match: "95%",
          preferences: {
              time: "evening",
              approach: "Problem-solving"
          },
          qualities: ["Adaptability & Flexibility"],
          availability: ["Evenings"]
      }
  };
  
  // Get modal elements
  const modal = document.getElementById('profileModal');
  const modalBody = modal.querySelector('.modal-body');
  const closeModal = modal.querySelector('.close-modal');
  
  // Profile view button event listeners
  const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
  
  // Function to open modal with profile data
  function openProfileModal(profileId) {
      const profile = profileData[profileId];
      
      if (!profile) return;
      
      // Create modal content
      const modalContent = `
          <div class="modal-profile-card">
              <div class="card-header">
                  <div class="profile-info">
                      <h2 class="profile-name">${profile.name}</h2>
                      <p class="profile-role">${profile.role}</p>
                      <div class="match-label">${profile.match} Match</div>
                  </div>
              </div>
              
              <div class="profile-section">
                  <h3 class="section-title">Study Preferences</h3>
                  <div class="detail-item">
                      <span class="detail-text"><span>${profile.preferences.approach}</span> approach</span>
                  </div>
              </div>

              <div class="profile-section">
                  <h3 class="section-title">Qualities Matters in a Study Partner</h3>
                  ${profile.qualities.map(quality => `
                      <div class="detail-item">
                          <span class="detail-text">${quality}</span>
                      </div>
                  `).join('')}
              </div>

              <div class="profile-section">
                  <h3 class="section-title">Availability</h3>
                  <div class="availability-schedule">
                      ${profile.availability.map(time => `
                          <span class="schedule-item available">${time}</span>
                      `).join('')}
                  </div>
              </div>
              
              <div class="profile-actions">
                  <button class="action-button primary-action" data-profile-id="${profileId}" data-action="connect">
                      <i class="fa-solid fa-user-plus"></i>
                      Connect
                  </button>
                  <button class="action-button secondary-action" data-profile-id="${profileId}" data-action="message">
                      <i class="fa-solid fa-message"></i>
                      Message
                  </button>
              </div>
          </div>
      `;
      
      // Set modal content
      modalBody.innerHTML = modalContent;
      
      // Show modal
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      // Add event listeners to action buttons in modal
      const actionButtons = modalBody.querySelectorAll('.action-button');
      actionButtons.forEach(button => {
          button.addEventListener('click', handleActionButton);
      });
  }
  
  // Handle action button clicks (Connect or Message)
  function handleActionButton(event) {
      const button = event.currentTarget;
      const profileId = button.getAttribute('data-profile-id');
      const actionType = button.getAttribute('data-action');
      const profileName = profileData[profileId].name;
      
      // Show alert and close modal
      alert(`You've chosen to ${actionType === 'connect' ? 'connect with' : 'message'} ${profileName}!`);
      closeProfileModal();
  }
  
  // Function to close modal
  function closeProfileModal() {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Event listener for view profile buttons
  viewProfileBtns.forEach(btn => {
      btn.addEventListener('click', function(event) {
          event.preventDefault();
          const profileId = this.getAttribute('data-profile-id');
          openProfileModal(profileId);
      });
  });
  
  // Close modal when clicking close button
  closeModal.addEventListener('click', closeProfileModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          closeProfileModal();
      }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
          closeProfileModal();
      }
  });
});