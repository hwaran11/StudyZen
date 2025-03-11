// Calendar state
const calendarState = {
  currentDate: new Date(),
  selectedDate: null,
  currentView: "month", // 'month', 'week', or 'day'
  weekStartDate: null,
};

// DOM Elements
const calendarTitle = document.querySelector(".calendar-title");
const calendarGrid = document.querySelector(".calendar-grid");
const navButtons = document.querySelectorAll(".nav-btn");
const prevButton = navButtons[0];
const nextButton = navButtons[1];
const todayButton = document.querySelector(".today-btn");
const viewButtons = document.querySelectorAll(".view-btn");

// Sample events data - in a real app, this would come from a database
const sampleEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2025, 2, 10), // March 10, 2025
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    priority: "medium",
  },
  {
    id: 2,
    title: "Project Review",
    date: new Date(2025, 2, 12), // March 12, 2025
    startHour: 14,
    startMinute: 0,
    endHour: 15,
    endMinute: 0,
    priority: "high",
  },
  {
    id: 3,
    title: "Client Call",
    date: new Date(2025, 2, 13), // March 13, 2025
    startHour: 11,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    priority: "low",
  },
  {
    id: 4,
    title: "Study Session",
    date: new Date(2025, 2, 8), // March 8, 2025 (Today)
    startHour: 15,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    priority: "medium",
  },
  {
    id: 5,
    title: "Exam Prep",
    date: new Date(2025, 2, 8), // March 8, 2025 (Today)
    startHour: 10,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    priority: "high",
  },
];

// Initialize Calendar
function initCalendar() {
  // Set default view
  calendarState.currentView = "month";

  // Set initial week start date (if on week view)
  updateWeekStartDate();

  // Generate calendar for current view
  generateCalendar();

  // Set up event listeners
  setupEventListeners();
}

// Update the week start date based on current date
function updateWeekStartDate() {
  const date = new Date(calendarState.currentDate);
  const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.

  // Calculate the start of the week (Sunday)
  date.setDate(date.getDate() - day);
  calendarState.weekStartDate = new Date(date);
}

// Generate the calendar grid based on current view
function generateCalendar() {
  // Reset all view-specific classes
  calendarGrid.classList.remove("week-view", "day-view");

  if (calendarState.currentView === "month") {
    generateMonthView();
  } else if (calendarState.currentView === "week") {
    generateWeekView();
  } else if (calendarState.currentView === "day") {
    generateDayView();
  }
}

// Generate month view
function generateMonthView() {
  const date = calendarState.currentDate;
  const year = date.getFullYear();
  const month = date.getMonth();

  // Update calendar title
  calendarTitle.textContent = new Date(year, month).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  // Clear grid
  calendarGrid.innerHTML = "";

  // Add day headers
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  daysOfWeek.forEach((day) => {
    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = day;
    calendarGrid.appendChild(header);
  });

  // Get first day of month and total days in month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get days from previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    createDayCell(day, true, prevYear, prevMonth);
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    createDayCell(day, false, year, month, isToday);
  }

  // Next month days
  const totalCells = 42; // 6 rows of 7 days
  const remainingCells = totalCells - (firstDay + daysInMonth);

  for (let day = 1; day <= remainingCells; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    createDayCell(day, true, nextYear, nextMonth);
  }

  // Add events to the month view
  addEventsToMonthView();
}

// Create a day cell for month view
function createDayCell(day, isOtherMonth, year, month, isToday = false) {
  const cell = document.createElement("div");
  cell.className = "day-cell";

  // Add styling for days from previous or next month
  if (isOtherMonth) {
    cell.classList.add("other-month");
  }

  // Highlight today’s date
  if (isToday) {
    cell.classList.add("current-day");
  }

  // Create the day number inside the cell
  const dayNumber = document.createElement("div");
  dayNumber.className = "day-number";
  dayNumber.textContent = day;
  cell.appendChild(dayNumber);

  // Add dataset attributes for date tracking
  const fullDate = new Date(year, month, day);
  cell.dataset.date = `${year}-${month + 1}-${day}`;
  cell.dataset.fullDate = fullDate.toISOString().split("T")[0];

  // Click event: Switch to Day View when clicking a day cell
  cell.addEventListener("click", () => {
    // Remove selection from all day cells
    document
      .querySelectorAll(".day-cell")
      .forEach((dc) => dc.classList.remove("selected"));
    cell.classList.add("selected");

    // Update calendar state
    calendarState.currentDate = fullDate;
    calendarState.selectedDate = fullDate;
    calendarState.currentView = "day";

    // Update active view button
    updateViewButtons();

    // Regenerate the calendar in Day View
    generateCalendar();
  });

  // Append the cell to the calendar grid
  calendarGrid.appendChild(cell);
}

// Add events to month view
// Enhanced function to add events to month view
function addEventsToMonthView() {
  // Get all days in the current view
  const dayCells = document.querySelectorAll(".day-cell");

  // Create a map of formatted dates to their corresponding day cells
  const dateMap = {};
  dayCells.forEach((cell) => {
    if (cell.dataset.fullDate) {
      dateMap[cell.dataset.fullDate] = cell;
    }
  });

  // Filter events for the visible month range
  const firstCellDate = new Date(dayCells[0].dataset.fullDate);
  const lastCellDate = new Date(dayCells[dayCells.length - 1].dataset.fullDate);

  const visibleEvents = sampleEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= firstCellDate && eventDate <= lastCellDate;
  });

  // Group events by date
  const eventsByDate = {};
  visibleEvents.forEach((event) => {
    const dateStr = event.date.toISOString().split("T")[0];
    if (!eventsByDate[dateStr]) {
      eventsByDate[dateStr] = [];
    }
    eventsByDate[dateStr].push(event);
  });

  // Add events to date cells
  for (const [dateStr, events] of Object.entries(eventsByDate)) {
    const cell = dateMap[dateStr];

    if (cell) {
      // Sort events by start time
      events.sort((a, b) => {
        if (a.startHour !== b.startHour) {
          return a.startHour - b.startHour;
        }
        return a.startMinute - b.startMinute;
      });

      // Clear any existing events
      const existingEvents = cell.querySelectorAll(
        ".month-event, .event-indicators, .more-events"
      );
      existingEvents.forEach((el) => el.remove());

      // Check window width for responsive design
      const isMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;

      // For mobile: show only dots
      if (isMobile) {
        const eventsContainer = document.createElement("div");
        eventsContainer.className = "event-indicators";

        events.forEach((event) => {
          const eventDot = document.createElement("div");
          eventDot.className = `event-indicator priority-${event.priority}`;
          eventDot.title = `${event.title} (${formatHour(
            event.startHour
          )}:${String(event.startMinute).padStart(2, "0")})`;
          eventDot.addEventListener("click", (e) => {
            e.stopPropagation();
            alert(
              `Event: ${event.title}\nTime: ${formatHour(
                event.startHour
              )}:${String(event.startMinute).padStart(2, "0")} - ${formatHour(
                event.endHour
              )}:${String(event.endMinute).padStart(2, "0")}`
            );
          });

          eventsContainer.appendChild(eventDot);
        });

        cell.appendChild(eventsContainer);
      }
      // For tablet: show max 2 events + indicators
      else if (isTablet) {
        // Show first 2 events
        for (let i = 0; i < Math.min(2, events.length); i++) {
          const event = events[i];
          const eventEl = createMonthEventElement(event);
          cell.appendChild(eventEl);
        }

        // If more than 2 events, show indicator dots for the rest
        if (events.length > 2) {
          const eventsContainer = document.createElement("div");
          eventsContainer.className = "event-indicators";

          for (let i = 2; i < events.length; i++) {
            const event = events[i];
            const eventDot = document.createElement("div");
            eventDot.className = `event-indicator priority-${event.priority}`;
            eventDot.title = `${event.title} (${formatHour(
              event.startHour
            )}:${String(event.startMinute).padStart(2, "0")})`;
            eventDot.addEventListener("click", (e) => {
              e.stopPropagation();
              alert(
                `Event: ${event.title}\nTime: ${formatHour(
                  event.startHour
                )}:${String(event.startMinute).padStart(2, "0")} - ${formatHour(
                  event.endHour
                )}:${String(event.endMinute).padStart(2, "0")}`
              );
            });

            eventsContainer.appendChild(eventDot);
          }

          cell.appendChild(eventsContainer);
        }
      }
      // For desktop: show max 3 events + more indicator
      else {
        // Show first 3 events
        for (let i = 0; i < Math.min(3, events.length); i++) {
          const event = events[i];
          const eventEl = createMonthEventElement(event);
          cell.appendChild(eventEl);
        }

        // If more than 3 events, show "+more" text
        if (events.length > 3) {
          const moreIndicator = document.createElement("div");
          moreIndicator.className = "more-events";
          moreIndicator.textContent = `+ ${events.length - 3} more`;
          moreIndicator.addEventListener("click", (e) => {
            e.stopPropagation();

            // Create a message with all events
            let message = `Events on ${new Date(
              dateStr
            ).toLocaleDateString()}:\n\n`;
            events.forEach((event) => {
              message += `• ${event.title}: ${formatHour(
                event.startHour
              )}:${String(event.startMinute).padStart(2, "0")} - ${formatHour(
                event.endHour
              )}:${String(event.endMinute).padStart(2, "0")}\n`;
            });

            alert(message);
          });

          cell.appendChild(moreIndicator);
        }
      }
    }
  }
}

// Helper function to create month event elements
function createMonthEventElement(event) {
  const eventEl = document.createElement("div");
  eventEl.className = `month-event priority-${event.priority}`;

  // Format the time
  const startTime = `${formatHour(event.startHour).replace(" ", "")}`;

  // Create the event title with time
  eventEl.textContent = `${startTime} ${event.title}`;

  // Add tooltip with full details
  eventEl.title = `${event.title}: ${formatHour(event.startHour)}:${String(
    event.startMinute
  ).padStart(2, "0")} - ${formatHour(event.endHour)}:${String(
    event.endMinute
  ).padStart(2, "0")}`;

  // Add click event for viewing details
  eventEl.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering cell click
    alert(
      `Event: ${event.title}\nTime: ${formatHour(event.startHour)}:${String(
        event.startMinute
      ).padStart(2, "0")} - ${formatHour(event.endHour)}:${String(
        event.endMinute
      ).padStart(2, "0")}`
    );
  });

  return eventEl;
}

// Update the window resize listener
window.addEventListener("resize", function () {
  // Regenerate the calendar to update event display
  generateCalendar();
});

// Generate week view
function generateWeekView() {
  // Make sure weekStartDate is updated
  updateWeekStartDate();

  // Add week-view class to grid
  calendarGrid.classList.add("week-view");

  // Clear grid
  calendarGrid.innerHTML = "";

  // Update calendar title with week range
  const weekEnd = new Date(calendarState.weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatOptions = { month: "short", day: "numeric" };
  const startStr = calendarState.weekStartDate.toLocaleDateString(
    "en-US",
    formatOptions
  );
  const endStr = weekEnd.toLocaleDateString("en-US", formatOptions);

  calendarTitle.textContent = `${startStr} - ${endStr}, ${weekEnd.getFullYear()}`;

  // Create time column
  const timeColumn = document.createElement("div");
  timeColumn.className = "time-column";

  // Add empty header cell for time column
  const emptyHeader = document.createElement("div");
  emptyHeader.className = "week-day-header";
  emptyHeader.innerHTML = "";
  timeColumn.appendChild(emptyHeader);

  // Add time slots (6am to 10pm for better coverage)
  for (let hour = 6; hour <= 22; hour++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    timeSlot.textContent = formatHour(hour);
    timeColumn.appendChild(timeSlot);
  }

  calendarGrid.appendChild(timeColumn);

  // Create day columns for the week
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(calendarState.weekStartDate);
    dayDate.setDate(dayDate.getDate() + i);

    const isToday = isSameDay(dayDate, today);
    const isWeekend = i === 0 || i === 6; // Sunday or Saturday

    const dayColumn = document.createElement("div");
    dayColumn.className = "week-day-column";

    if (isToday) {
      dayColumn.classList.add("current-day-column");
    }

    if (isWeekend) {
      dayColumn.classList.add("weekend");
    }

    // Create day header
    const dayHeader = document.createElement("div");
    dayHeader.className = "week-day-header";

    const dayName = document.createElement("div");
    dayName.className = "week-day-name";
    dayName.textContent = dayDate.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const dayNumber = document.createElement("div");
    dayNumber.className = "week-day-date";
    dayNumber.textContent = dayDate.getDate();

    dayHeader.appendChild(dayName);
    dayHeader.appendChild(dayNumber);
    dayColumn.appendChild(dayHeader);

    // Add date attribute to column
    dayColumn.dataset.date = formatDateAttribute(dayDate);

    // Create hour cells
    for (let hour = 6; hour <= 22; hour++) {
      const cell = document.createElement("div");
      cell.className = "week-time-cell";

      // Add half-hour marker
      const halfHourMarker = document.createElement("div");
      halfHourMarker.className = "half-hour-marker";
      cell.appendChild(halfHourMarker);

      // Add current time indicator if it's today and current hour
      if (isToday && today.getHours() === hour) {
        const minutes = today.getMinutes();
        const currentTimeIndicator = document.createElement("div");
        currentTimeIndicator.className = "current-time-indicator";
        currentTimeIndicator.style.top = `${minutes}px`;
        cell.appendChild(currentTimeIndicator);
      }

      // Set data attributes for event handling
      cell.dataset.date = formatDateAttribute(dayDate);
      cell.dataset.hour = hour;

      // Add click event for creating new events
      cell.addEventListener("click", () => {
        // Here you would open a modal to create a new event
        // For now, we'll just show an alert
        alert(
          `Create a new event on ${dayDate.toLocaleDateString()} at ${formatHour(
            hour
          )}`
        );
      });

      dayColumn.appendChild(cell);
    }

    // Add column click event to view this day
    dayHeader.addEventListener("click", () => {
      calendarState.currentDate = new Date(dayDate);
      calendarState.currentView = "day";
      updateViewButtons();
      generateCalendar();
    });

    calendarGrid.appendChild(dayColumn);
  }

  // Add events to the week view
  addEventsToWeekView();
}

function addEventsToWeekView() {
  // Filter events that fall within the current week
  const weekEnd = new Date(calendarState.weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const eventsThisWeek = sampleEvents.filter((event) => {
    return event.date >= calendarState.weekStartDate && event.date < weekEnd;
  });

  // Add each event to the grid
  eventsThisWeek.forEach((event) => {
    // Find the day column for this event
    const eventDay = event.date.getDay(); // 0-6
    const dayColumns = document.querySelectorAll(".week-day-column");
    const dayColumn = dayColumns[eventDay];

    if (!dayColumn) return; // Skip if column not found

    // Calculate position and height
    const startHour = event.startHour;
    const startMin = event.startMinute;
    const endHour = event.endHour;
    const endMin = event.endMinute;

    // Get the first hour cell as reference (6am is the first hour in our grid)
    const hourCells = dayColumn.querySelectorAll(".week-time-cell");
    const firstCellIndex = startHour - 6; // Adjust for 6am start

    if (firstCellIndex < 0 || firstCellIndex >= hourCells.length) return; // Out of range

    const cell = hourCells[firstCellIndex];

    // Create event element
    const eventEl = document.createElement("div");
    eventEl.className = `calendar-event priority-${event.priority}`;
    eventEl.textContent = event.title;

    // Calculate top position based on minutes (60px per hour)
    const topPos = (startMin / 60) * 60; // Convert minutes to pixels

    // Calculate height based on duration (60px per hour)
    const durationHours = endHour - startHour + (endMin - startMin) / 60;
    const height = durationHours * 60; // Convert hours to pixels

    // Set position and dimensions
    eventEl.style.top = `${topPos}px`;
    eventEl.style.height = `${height}px`;

    // Add click event for editing
    eventEl.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering cell click
      alert(`Edit event: ${event.title}`);
    });

    // Add tooltip with time information
    eventEl.title = `${event.title}: ${formatHour(startHour)}:${String(
      startMin
    ).padStart(2, "0")} - ${formatHour(endHour)}:${String(endMin).padStart(
      2,
      "0"
    )}`;

    // Add to the cell
    cell.appendChild(eventEl);
  });
}

// Generate day view
function generateDayView() {
  // Add day-view class to grid
  calendarGrid.classList.add("day-view");

  // Clear grid
  calendarGrid.innerHTML = "";

  // Update calendar title
  calendarTitle.textContent = calendarState.currentDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // Create time column
  const timeColumn = document.createElement("div");
  timeColumn.className = "time-column";

  // Add empty header cell for time column
  const emptyHeader = document.createElement("div");
  emptyHeader.className = "day-view-header";
  emptyHeader.innerHTML = "";
  timeColumn.appendChild(emptyHeader);

  // Add time slots (6am to 10pm for better coverage)
  for (let hour = 6; hour <= 22; hour++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    timeSlot.textContent = formatHour(hour);
    timeColumn.appendChild(timeSlot);
  }

  calendarGrid.appendChild(timeColumn);

  // Create day column
  const dayColumn = document.createElement("div");
  dayColumn.className = "day-column";

  // Create day header
  const dayHeader = document.createElement("div");
  dayHeader.className = "day-view-header";
  dayHeader.textContent = calendarState.currentDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    }
  );
  dayColumn.appendChild(dayHeader);

  // Add date attribute to column
  dayColumn.dataset.date = formatDateAttribute(calendarState.currentDate);

  // Create hour cells
  const today = new Date();
  const isToday = isSameDay(calendarState.currentDate, today);

  for (let hour = 6; hour <= 22; hour++) {
    const cell = document.createElement("div");
    cell.className = "day-time-cell";

    // Add half-hour marker
    const halfHourMarker = document.createElement("div");
    halfHourMarker.className = "half-hour-marker";
    cell.appendChild(halfHourMarker);

    // Add current time indicator if it's today and current hour
    if (isToday && today.getHours() === hour) {
      const minutes = today.getMinutes();
      const currentTimeIndicator = document.createElement("div");
      currentTimeIndicator.className = "current-time-indicator";
      currentTimeIndicator.style.top = `${minutes}px`;
      cell.appendChild(currentTimeIndicator);
    }

    // Set data attributes for event handling
    cell.dataset.date = formatDateAttribute(calendarState.currentDate);
    cell.dataset.hour = hour;

    // Add click event for creating new events
    cell.addEventListener("click", () => {
      // Here you would open a modal to create a new event
      alert(
        `Create a new event on ${calendarState.currentDate.toLocaleDateString()} at ${formatHour(
          hour
        )}`
      );
    });

    dayColumn.appendChild(cell);
  }

  calendarGrid.appendChild(dayColumn);

  // Add events to the day view
  addEventsToDayView();
}

// Add events to day view
function addEventsToDayView() {
  // Filter events for the selected day
  const eventsToday = sampleEvents.filter((event) => {
    return isSameDay(event.date, calendarState.currentDate);
  });

  // Get the day column
  const dayColumn = document.querySelector(".day-column");
  if (!dayColumn) return;

  // Add each event to the grid
  eventsToday.forEach((event) => {
    // Calculate position and height
    const startHour = event.startHour;
    const startMin = event.startMinute;
    const endHour = event.endHour;
    const endMin = event.endMinute;

    // Get the first hour cell as reference (6am is the first hour in our grid)
    const hourCells = dayColumn.querySelectorAll(".day-time-cell");
    const firstCellIndex = startHour - 6; // Adjust for 6am start

    if (firstCellIndex < 0 || firstCellIndex >= hourCells.length) return; // Out of range

    const cell = hourCells[firstCellIndex];

    // Create event element
    const eventEl = document.createElement("div");
    eventEl.className = `calendar-event priority-${event.priority}`;
    eventEl.textContent = event.title;

    // Calculate top position based on minutes (60px per hour)
    const topPos = (startMin / 60) * 60; // Convert minutes to pixels

    // Calculate height based on duration (60px per hour)
    const durationHours = endHour - startHour + (endMin - startMin) / 60;
    const height = durationHours * 60; // Convert hours to pixels

    // Set position and dimensions
    eventEl.style.top = `${topPos}px`;
    eventEl.style.height = `${height}px`;

    // Add click event for editing
    eventEl.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering cell click
      alert(`Edit event: ${event.title}`);
    });

    // Add tooltip with time information
    eventEl.title = `${event.title}: ${formatHour(startHour)}:${String(
      startMin
    ).padStart(2, "0")} - ${formatHour(endHour)}:${String(endMin).padStart(
      2,
      "0"
    )}`;

    // Add to the cell
    cell.appendChild(eventEl);
  });
}

// Setup event listeners for calendar navigation and view switching
function setupEventListeners() {
  // Previous button
  prevButton.addEventListener("click", () => {
    navigateCalendar("prev");
  });

  // Next button
  nextButton.addEventListener("click", () => {
    navigateCalendar("next");
  });

  // Today button
  todayButton.addEventListener("click", () => {
    calendarState.currentDate = new Date();
    updateWeekStartDate();
    generateCalendar();
  });

  // View buttons
  setupViewButtons();
}

// Setup view buttons as a separate function
function setupViewButtons() {
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      viewButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Update the calendar view
      calendarState.currentView = button.textContent.toLowerCase();
      generateCalendar();
    });
  });

  // Ensure the correct button is active
  updateViewButtons();
}

// Update the active view button
function updateViewButtons() {
  const viewBtns = document.querySelectorAll(".view-btn");
  viewBtns.forEach((button) => {
    if (button.textContent.toLowerCase() === calendarState.currentView) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Navigate calendar (previous/next)
function navigateCalendar(direction) {
  const date = calendarState.currentDate;

  if (calendarState.currentView === "month") {
    // Navigate by month
    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
  } else if (calendarState.currentView === "week") {
    // Navigate by week
    if (direction === "prev") {
      date.setDate(date.getDate() - 7);
    } else {
      date.setDate(date.getDate() + 7);
    }
    updateWeekStartDate();
  } else if (calendarState.currentView === "day") {
    // Navigate by day
    if (direction === "prev") {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
  }

  calendarState.currentDate = new Date(date);
  generateCalendar();
}

// Format hour to 12-hour format
function formatHour(hour) {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

// Format date for data attributes
function formatDateAttribute(date) {
  return date.toISOString().split("T")[0];
}

// Check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Initialize calendar on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Calendar initializing...");
  initCalendar();
});
