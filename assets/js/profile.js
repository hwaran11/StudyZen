// Function to center the active step
function centerActiveStep() {
    const stepIndicator = document.querySelector('.step-indicator');
    const activeStep = document.querySelector('.step.active');
    
    if (stepIndicator && activeStep && window.innerWidth <= 1024) {
        // Get the container's width and padding
        const containerWidth = stepIndicator.offsetWidth;
        const stepWidth = activeStep.offsetWidth;
        
        // Calculate the scroll position
        const scrollPosition = activeStep.offsetLeft - 
            (containerWidth / 2) + 
            (stepWidth / 2);
        
        // Smooth scroll to position
        stepIndicator.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
        });
    }
}

// Center active step on page load
document.addEventListener('DOMContentLoaded', function() {
    centerActiveStep();
    
    // Add touch feedback
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        // Add subtle feedback on touch devices
        step.addEventListener('touchstart', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(0.98)';
            }
        });
        
        step.addEventListener('touchend', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'none';
            }
        });
    });
});

// Re-center on window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(centerActiveStep, 100);
});

// Optional: Add scroll snapping behavior
document.querySelector('.step-indicator').addEventListener('scroll', function() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
        const steps = Array.from(this.querySelectorAll('.step'));
        const center = this.scrollLeft + this.offsetWidth / 2;
        
        // Find the closest step to the center
        const closestStep = steps.reduce((closest, step) => {
            const stepCenter = step.offsetLeft + step.offsetWidth / 2;
            const distance = Math.abs(stepCenter - center);
            return distance < closest.distance ? 
                { element: step, distance } : 
                closest;
        }, { element: null, distance: Infinity });
        
        if (closestStep.element) {
            const scrollPosition = closestStep.element.offsetLeft - 
                (this.offsetWidth / 2) + 
                (closestStep.element.offsetWidth / 2);
                
            this.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, 150);
});




