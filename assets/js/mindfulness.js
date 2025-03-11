// Add this to your mindfulness.js file

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const breathingExercise = document.getElementById("breathingExercise");
  const breathingContainer = document.getElementById("breathingContainer");
  const closeBreathingContainer = document.getElementById(
    "closeBreathingContainer"
  );

  const meditationExercise = document.getElementById("meditationExercise");
  const shortMeditationContainer = document.getElementById(
    "shortMeditationContainer"
  );
  const closeShortMeditationContainer = document.getElementById(
    "closeShortMeditationContainer"
  );

  const longMeditationExercise = document.querySelector(
    ".exercise-card:nth-child(3)"
  );
  const longMeditationContainer = document.getElementById(
    "longMeditationContainer"
  );
  const closeLongMeditationContainer = document.getElementById(
    "closeLongMeditationContainer"
  );

  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  document.body.appendChild(modalOverlay);

  // Timer variables
  let breathingTimer;
  let shortMeditationTimer;
  let longMeditationTimer;
  let breathingTimeLeft = 120; // 2 minutes in seconds
  let shortMeditationTimeLeft = 300; // 5 minutes in seconds
  let longMeditationTimeLeft = 600; // 10 minutes in seconds

  // Breathing Exercise
  breathingExercise.addEventListener("click", function () {
    openExerciseContainer(breathingContainer);
    resetBreathingTimer();
  });

  closeBreathingContainer.addEventListener("click", function () {
    closeExerciseContainer(breathingContainer);
    clearInterval(breathingTimer);
  });

  // Short Meditation Exercise
  meditationExercise.addEventListener("click", function () {
    openExerciseContainer(shortMeditationContainer);
    resetShortMeditationTimer();
  });

  closeShortMeditationContainer.addEventListener("click", function () {
    closeExerciseContainer(shortMeditationContainer);
    clearInterval(shortMeditationTimer);
  });

  // Long Meditation Exercise
  longMeditationExercise.addEventListener("click", function () {
    openExerciseContainer(longMeditationContainer);
    resetLongMeditationTimer();
  });

  closeLongMeditationContainer.addEventListener("click", function () {
    closeExerciseContainer(longMeditationContainer);
    clearInterval(longMeditationTimer);
  });

  // Meditation Control Buttons
  const startShortMeditation = document.getElementById("startShortMeditation");
  const pauseShortMeditation = document.getElementById("pauseShortMeditation");
  const startLongMeditation = document.getElementById("startLongMeditation");
  const pauseLongMeditation = document.getElementById("pauseLongMeditation");

  if (startShortMeditation && pauseShortMeditation) {
    startShortMeditation.addEventListener("click", function () {
      startMeditationTimer("short");
      this.disabled = true;
      pauseShortMeditation.disabled = false;
    });

    pauseShortMeditation.addEventListener("click", function () {
      pauseMeditationTimer("short");
      this.disabled = true;
      startShortMeditation.disabled = false;
    });
  }

  if (startLongMeditation && pauseLongMeditation) {
    startLongMeditation.addEventListener("click", function () {
      startMeditationTimer("long");
      this.disabled = true;
      pauseLongMeditation.disabled = false;
    });

    pauseLongMeditation.addEventListener("click", function () {
      pauseMeditationTimer("long");
      this.disabled = true;
      startLongMeditation.disabled = false;
    });
  }

  // Click on overlay to close
  modalOverlay.addEventListener("click", function () {
    if (breathingContainer.classList.contains("active")) {
      closeExerciseContainer(breathingContainer);
      clearInterval(breathingTimer);
    }
    if (shortMeditationContainer.classList.contains("active")) {
      closeExerciseContainer(shortMeditationContainer);
      clearInterval(shortMeditationTimer);
    }
    if (longMeditationContainer.classList.contains("active")) {
      closeExerciseContainer(longMeditationContainer);
      clearInterval(longMeditationTimer);
    }
  });

  // Functions
  function openExerciseContainer(container) {
    container.classList.add("active");
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeExerciseContainer(container) {
    container.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function resetBreathingTimer() {
    const breathingTimerDisplay = document.querySelector(".breathing-timer");
    breathingTimeLeft = 120;
    breathingTimerDisplay.textContent = "2:00";
    clearInterval(breathingTimer);
    breathingTimer = setInterval(updateBreathingTimer, 1000);
  }

  function updateBreathingTimer() {
    const breathingTimerDisplay = document.querySelector(".breathing-timer");
    breathingTimeLeft--;

    if (breathingTimeLeft >= 0) {
      breathingTimerDisplay.textContent = formatTime(breathingTimeLeft);
    } else {
      clearInterval(breathingTimer);
      // Update streak or user stats here
      setTimeout(() => {
        closeExerciseContainer(breathingContainer);
        // You could show a completion message here
      }, 1500);
    }
  }

  function resetShortMeditationTimer() {
    const meditationTimerDisplay = document.querySelector(
      "#shortMeditationContainer .meditation-timer"
    );
    shortMeditationTimeLeft = 300;
    meditationTimerDisplay.textContent = "5:00";
    clearInterval(shortMeditationTimer);

    // Reset buttons
    if (startShortMeditation && pauseShortMeditation) {
      startShortMeditation.disabled = false;
      pauseShortMeditation.disabled = true;
    }
  }

  function resetLongMeditationTimer() {
    const meditationTimerDisplay = document.querySelector(
      "#longMeditationContainer .meditation-timer"
    );
    longMeditationTimeLeft = 600;
    meditationTimerDisplay.textContent = "10:00";
    clearInterval(longMeditationTimer);

    // Reset progress bar
    const progressFill = document.querySelector(
      "#meditationProgressBar .progress-fill"
    );
    if (progressFill) {
      progressFill.style.width = "0%";
    }

    // Reset buttons
    if (startLongMeditation && pauseLongMeditation) {
      startLongMeditation.disabled = false;
      pauseLongMeditation.disabled = true;
    }
  }

  function startMeditationTimer(type) {
    if (type === "short") {
      clearInterval(shortMeditationTimer);
      shortMeditationTimer = setInterval(updateShortMeditationTimer, 1000);
    } else if (type === "long") {
      clearInterval(longMeditationTimer);
      longMeditationTimer = setInterval(updateLongMeditationTimer, 1000);
    }
  }

  function pauseMeditationTimer(type) {
    if (type === "short") {
      clearInterval(shortMeditationTimer);
    } else if (type === "long") {
      clearInterval(longMeditationTimer);
    }
  }

  function updateShortMeditationTimer() {
    const meditationTimerDisplay = document.querySelector(
      "#shortMeditationContainer .meditation-timer"
    );
    shortMeditationTimeLeft--;

    if (shortMeditationTimeLeft >= 0) {
      meditationTimerDisplay.textContent = formatTime(shortMeditationTimeLeft);
    } else {
      clearInterval(shortMeditationTimer);
      // Update meditation sessions count
      updateMeditationSessions();
      setTimeout(() => {
        closeExerciseContainer(shortMeditationContainer);
        // Show completion message or update stats
      }, 1500);
    }
  }

  function updateLongMeditationTimer() {
    const meditationTimerDisplay = document.querySelector(
      "#longMeditationContainer .meditation-timer"
    );
    const progressFill = document.querySelector(
      "#meditationProgressBar .progress-fill"
    );

    longMeditationTimeLeft--;

    if (longMeditationTimeLeft >= 0) {
      meditationTimerDisplay.textContent = formatTime(longMeditationTimeLeft);

      // Update progress bar
      if (progressFill) {
        const progressPercentage = 100 - (longMeditationTimeLeft / 600) * 100;
        progressFill.style.width = `${progressPercentage}%`;
      }
    } else {
      clearInterval(longMeditationTimer);
      // Update meditation sessions count
      updateMeditationSessions();
      setTimeout(() => {
        closeExerciseContainer(longMeditationContainer);
        // Show completion message or update stats
      }, 1500);
    }
  }

  function updateMeditationSessions() {
    // Get the current session count
    const sessionsElement = document.querySelector(
      ".user-insights .insight-card:nth-child(2) .insight-value"
    );
    if (sessionsElement) {
      const currentSessions = parseInt(sessionsElement.textContent) || 0;
      sessionsElement.textContent = `${currentSessions + 1} Sessions`;

      // Update streak if needed
      updateMindfulnessStreak();
    }
  }

  function updateMindfulnessStreak() {
    const streakNumberElement = document.getElementById("streakNumber");
    if (streakNumberElement) {
      const currentStreak = parseInt(streakNumberElement.textContent) || 0;
      streakNumberElement.textContent = currentStreak + 1;

      // Update motivation message based on new streak
      updateStreakMotivation(currentStreak + 1);
    }
  }

  function updateStreakMotivation(streak) {
    const motivationElement = document.getElementById("streakMotivation");
    if (motivationElement) {
      if (streak === 1) {
        motivationElement.textContent =
          "Great start to your mindfulness journey!";
      } else if (streak <= 3) {
        motivationElement.textContent = "Building a healthy habit!";
      } else if (streak <= 7) {
        motivationElement.textContent = "Impressive commitment!";
      } else {
        motivationElement.textContent = "You're a mindfulness master!";
      }
    }
  }
});
