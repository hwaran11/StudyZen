const sidebarContent = `
    <div id="logo-container" class="logo-container">
        <a href="#" class="logo">StudyZen</a>
    </div>

    <div id="user-profile" class="user-profile">
        <div class="profile-content">
            <div class="profile-icon">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="profile-details">
                <p class="profile-name">Alex Johnson</p>
                <p class="profile-role">Click here to view profile</p>
            </div>
        </div>
    </div>

    <nav class="sidebar-nav">
        <ul id="nav-list">
            <li>
                <a href="/dashboard.html" class="nav-item" id="dashboard-link" style="--item-index: 1;">
                    <i class="ri-dashboard-fill"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="/study-group.html" class="nav-item" id="study-groups-link" style="--item-index: 2;">
                    <i class="ri-group-2-fill"></i>
                    <span>Study Groups</span>
                </a>
            </li>
            <li>
                <a href="/daily-planner.html" class="nav-item" id="daily-planner-link" style="--item-index: 3;">
                    <i class="ri-task-fill"></i>
                    <span>Daily Planner</span>
                </a>
            </li>
            <li>
                <a href="/calendar.html" class="nav-item" id="calendar-link" style="--item-index: 4;">
                    <i class="ri-calendar-fill"></i>
                    <span>Calendar</span>
                </a>
            </li>
            <li>
                <a href="/mindfulness.html" class="nav-item" id="mindfulness-link" style="--item-index: 5;">
                    <i class="ri-brain-2-fill"></i>
                    <span>Mindfulness</span>
                </a>
            </li>
        </ul>
    </nav>

    <div class="sidebar-footer">
        <div class="user-status">
            <div class="status-indicator">
                <div class="status-dot"></div>
                <span class="status-text">Online</span>
            </div>
            <div class="quick-actions">
                <button class="action-btn" data-tooltip="Notifications">
                    <i class="fa-solid fa-bell"></i>
                </button>
            </div>
        </div>
        <div class="footer-actions">
            <button class="footer-btn settings-btn" data-tooltip="Settings">
                <i class="ri-settings-line"></i>
                <span>Settings</span>
            </button>
            <button class="footer-btn logout-btn" data-tooltip="Logout">
                <i class="ri-logout-box-r-line"></i>
                <span>Logout</span>
            </button>
        </div>
        <p class="help-text">Stay focused and keep learning!</p>
    </div>
`;

// Function to inject the sidebar content
function loadSidebar() {
    const sidebarElement = document.getElementById("sidebar");
    if (sidebarElement) {
        sidebarElement.innerHTML = sidebarContent;
        
        // Simpler active menu detection
        // Get just the filename from the URL (e.g., "dashboard.html")
        const currentPage = window.location.pathname.split("/").pop();
        
        // Find the link that contains this filename
        const navLinks = document.querySelectorAll('.nav-item');
        
        navLinks.forEach(link => {
            // Extract the filename from each link's href attribute
            const linkPage = link.getAttribute('href').split("/").pop();
            
            // Simple string comparison to set active class
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
}
// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSidebar);