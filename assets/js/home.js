// Toggle mobile menu
const navMenu = document.getElementById('nav-menu');
const navToggle = document.querySelector('.nav-toggle');

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});