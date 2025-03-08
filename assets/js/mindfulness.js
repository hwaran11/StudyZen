document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openMindfulness = document.getElementById('openMindfulness');
    const mindfulnessDashboard = document.getElementById('mindfulnessDashboard');
    const breathingExercise = document.getElementById('breathingExercise');
    const breathingContainer = document.getElementById('breathingContainer');
    const closeBreathingContainer = document.getElementById('closeBreathingContainer');
    const breakReminderContainer = document.getElementById('breakReminderContainer');
    const closeBreakContainer = document.getElementById('closeBreakContainer');
    const takeMindfulnessBreak = document.getElementById('takeMindfulnessBreak');
    const startBreathingExercise = document.getElementById('startBreathingExercise');
    
    // Toggle Mindfulness Dashboard
    openMindfulness.addEventListener('click', function() {
        mindfulnessDashboard.classList.add('active');
    });
    
    // Open Breathing Exercise
    breathingExercise.addEventListener('click', function() {
        breathingContainer.classList.add('active');
    });
    
    // Close Breathing Exercise
    closeBreathingContainer.addEventListener('click', function() {
        breathingContainer.classList.remove('active');
    });
    
    // Take Mindfulness Break
    takeMindfulnessBreak.addEventListener('click', function() {
        breakReminderContainer.classList.add('active');
    });
    
    // Close Break Reminder
    closeBreakContainer.addEventListener('click', function() {
        breakReminderContainer.classList.remove('active');
    });
    
    // Start Breathing Exercise from Break Reminder
    startBreathingExercise.addEventListener('click', function() {
        breakReminderContainer.classList.remove('active');
        breathingContainer.classList.add('active');
    });
    
    // Pomodoro Timer functionality
    const startTimer = document.getElementById('startTimer');
    const pauseTimer = document.getElementById('pauseTimer');
    const resetTimer = document.getElementById('resetTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const focusDuration = document.getElementById('focusDuration');
    
    let timer;
    let minutes = 25;
    let seconds = 0;
    let isRunning = false;
    
    function startTimerFunction() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(function() {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timer);
                        isRunning = false;
                        // Show break reminder when timer ends
                        breakReminderContainer.classList.add('active');
                        return;
                    }
                    minutes--;
                    seconds = 59;
                } else {
                    seconds--;
                }
                updateTimerDisplay();
            }, 1000);
        }
    }
    
    function pauseTimerFunction() {
        clearInterval(timer);
        isRunning = false;
    }
    
    function resetTimerFunction() {
        clearInterval(timer);
        isRunning = false;
        minutes = parseInt(focusDuration.value);
        seconds = 0;
        updateTimerDisplay();
    }
    
    startTimer.addEventListener('click', startTimerFunction);
    pauseTimer.addEventListener('click', pauseTimerFunction);
    resetTimer.addEventListener('click', resetTimerFunction);
    
    // Change timer duration based on select
    focusDuration.addEventListener('change', function() {
        if (!isRunning) {
            minutes = parseInt(this.value);
            seconds = 0;
            updateTimerDisplay();
        }
    });
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Breathing Animation Timer
    const breathingTimer = document.querySelector('.breathing-timer');
    let breathingMinutes = 2;
    let breathingSeconds = 0;
    let breathingInterval;
    
    function updateBreathingTimer() {
        breathingTimer.textContent = `${breathingMinutes}:${String(breathingSeconds).padStart(2, '0')}`;
    }
    
    function startBreathingTimer() {
        breathingInterval = setInterval(function() {
            if (breathingSeconds === 0) {
                if (breathingMinutes === 0) {
                    clearInterval(breathingInterval);
                    // Close breathing container when time is up
                    breathingContainer.classList.remove('active');
                    
                    // Reset for next time
                    breathingMinutes = 2;
                    breathingSeconds = 0;
                    updateBreathingTimer();
                    return;
                }
                breathingMinutes--;
                breathingSeconds = 59;
            } else {
                breathingSeconds--;
            }
            updateBreathingTimer();
        }, 1000);
    }
    
    // Start breathing timer when exercise is opened
    breathingExercise.addEventListener('click', function() {
        breathingMinutes = 2;
        breathingSeconds = 0;
        updateBreathingTimer();
        startBreathingTimer();
    });
    
    // Also start breathing timer when starting from break reminder
    startBreathingExercise.addEventListener('click', function() {
        breathingMinutes = 2;
        breathingSeconds = 0;
        updateBreathingTimer();
        startBreathingTimer();
    });
    
    // Stop timer when closing the exercise
    closeBreathingContainer.addEventListener('click', function() {
        clearInterval(breathingInterval);
    });
    
    // Handle Break Timer
    const startBreakTimer = document.getElementById('startBreakTimer');
    const breakDuration = document.getElementById('breakDuration');
    
    startBreakTimer.addEventListener('click', function() {
        breakReminderContainer.classList.remove('active');
        
        // Set timer to break duration
        minutes = parseInt(breakDuration.value);
        seconds = 0;
        updateTimerDisplay();
        
        // Auto-start the timer
        startTimerFunction();
    });
    
    // Update stats (for demo purposes)
    const pomodoroStatus = document.getElementById('pomodoroStatus');
    const totalFocusTime = document.getElementById('totalFocusTime');
    const breaksTaken = document.getElementById('breaksTaken');
    const longestStreak = document.getElementById('longestStreak');
    
    let totalFocusMinutes = 0;
    let breakCount = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    
    // Example function to update stats that would be called when a session completes
    function updateStats(sessionMinutes) {
        totalFocusMinutes += sessionMinutes;
        currentStreak += sessionMinutes;
        
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
        
        totalFocusTime.textContent = `${Math.floor(totalFocusMinutes/60)}h ${totalFocusMinutes%60}m studied`;
        longestStreak.textContent = `${maxStreak} min streak`;
    }
    
    // Example function to update break count
    function incrementBreaks() {
        breakCount++;
        breaksTaken.textContent = `${breakCount} mindfulness breaks`;
        currentStreak = 0; // Reset current streak when taking a break
    }
    
    // For demonstration, attach these to some events
    startBreakTimer.addEventListener('click', function() {
        incrementBreaks();
    });
    
    startBreathingExercise.addEventListener('click', function() {
        incrementBreaks();
    });
});