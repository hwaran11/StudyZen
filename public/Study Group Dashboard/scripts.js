document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const createdGroups = [
        'Advanced Mathematics',
        'Web Development Basics',
        'Data Structures and Algorithms'
    ];

    const joinedGroups = [
        'Machine Learning Study Group',
        'Spanish Language Exchange',
        'Physics 101'
    ];

    const notifications = [
        'New event in Advanced Mathematics: Quiz session on Friday',
        'Web Development Basics: New resource added',
        'Upcoming meeting for Spanish Language Exchange tomorrow'
    ];

    // Populate lists with "View Details" buttons
    function populateList(elementId, items) {
        const list = document.getElementById(elementId);
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item}</span>
            `;
            list.appendChild(li);
        });
    }

    populateList('createdGroupsList', createdGroups);
    populateList('joinedGroupsList', joinedGroups);
    populateList('notificationsList', notifications);

    // Create New Group button
    document.getElementById('createGroupBtn').addEventListener('click', function() {
        window.location.href = '/Create New Study Group/createnewstudygroup.html';
    });

    // Join New Group button
    document.getElementById('joinGroupBtn').addEventListener('click', function() {
        window.location.href = '/Join Study Group/joinstudygroup.html';
    });

        // Find Study Partner button
        document.getElementById('findPartnerBtn').addEventListener('click', function() {
            window.location.href = '/Find Study Group Partners/findstudypartners.html';
        });
    
        // View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const groupName = this.previousElementSibling.textContent;
                alert(`Redirecting to Study Group Details Screen for "${groupName}"`);
            });
        });
    
        // View All buttons
        document.querySelectorAll('.viewAllBtn').forEach(button => {
            button.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                alert(`View All ${section} groups functionality will be implemented here.`);
            });
        });
    
        // Add hover effect to list items
        document.querySelectorAll('.group-list li, .notification-list li').forEach(item => {
            item.addEventListener('mouseover', function() {
                this.style.transform = 'translateX(5px)';
            });
            item.addEventListener('mouseout', function() {
                this.style.transform = 'translateX(0)';
            });
        });
    
        // Optional: Add some animation to the dashboard cards on page load
        document.querySelectorAll('.dashboard-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    });
    
