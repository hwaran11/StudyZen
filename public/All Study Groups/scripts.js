async function loginUser(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data._id);  // Store user ID in local storage
        window.location.href = 'joinstudygroup.html';  // Redirect to Join Study Group page
    } else {
        const error = await response.json();
        console.error(error.message);
    }
}

async function fetchRecommendedGroups() {
    const userId = localStorage.getItem('userId');  // Retrieve user ID from local storage

    if (!userId) {
        console.error('User ID not found');
        return;
    }

    const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching recommended groups:', error.message);
        return;
    }

    const recommendedGroups = await response.json();
    displayGroups(recommendedGroups, 'recommended-group-list');
}

async function fetchAllGroups() {
    const response = await fetch('/api/groups/all');

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching all groups:', error.message);
        return;
    }

    const allGroups = await response.json();
    displayGroups(allGroups, 'all-group-list');
}

function displayGroups(groups, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (groups.length === 0) {
        container.innerHTML = '<p>No study groups found.</p>';
        return;
    }
    groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.innerHTML = `
            <h3>${group.groupName}</h3>
            <div class="group-info">
                <span class="info-tag"><i class="fas fa-clock"></i> ${group.studySchedule}</span>
                <span class="info-tag"><i class="fas fa-comments"></i> ${group.interactionStyle}</span>
                <span class="info-tag"><i class="fas fa-hourglass-half"></i> ${group.sessionLength}</span>
                <span class="info-tag"><i class="fas fa-tasks"></i> ${group.groupGoals}</span>
                <span class="info-tag"><i class="fas fa-balance-scale"></i> ${group.engagementLevel}</span>
                <span class="info-tag"><i class="fas fa-user-shield"></i> ${group.leadershipStyle}</span>
                <span class="info-tag"><i class="fas fa-hands-helping"></i> ${group.groupSupport}</span>
            </div>
            <button class="join-button" onclick="showDiscordModal('${group.discordChannelLink}')">
                <i class="fab fa-discord"></i> Join Group
            </button>
        `;
        container.appendChild(groupDiv);
    });
}

function showDiscordModal(discordChannelLink) {
    const discordModal = document.getElementById('discordModal');
    const discordChannelIdElem = document.getElementById('discordChannelId');

    discordChannelIdElem.textContent = discordChannelLink;
    discordModal.style.display = 'block';
}

function closeModal() {
    const discordModal = document.getElementById('discordModal');
    discordModal.style.display = 'none';
}

function copyToClipboard() {
    const discordChannelIdElem = document.getElementById('discordChannelId').textContent;
    navigator.clipboard.writeText(discordChannelIdElem).then(() => {
        alert('Discord Channel ID copied to clipboard');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

function createNewGroup() {
    window.location.href = '/Create New Study Group/createnewstudygroup.html';
}

function viewRecommendedGroups() {
    window.location.href = '/Join Study Group/joinstudygroup.html';
}

// Fetch and display recommended groups or all groups on page load
document.addEventListener('DOMContentLoaded', () => {
    const allGroupsSection = document.getElementById('all-group-list');
    if (allGroupsSection) {
        fetchAllGroups();  // Fetch all groups if on the all study groups page
    } else {
        fetchRecommendedGroups();  // Fetch recommended groups if on the join study group page
    }
});

// Add event listener for the "View All Study Groups" button if it exists
const viewAllButton = document.getElementById('view-all-button');
if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
        window.location.href = 'allstudygroups.html';  // Redirect to All Study Groups page
    });
}

function joinStudyGroupServer() {
    const serverLink = 'https://discord.gg/yourserverlink'; // Replace with your server link
    window.open(serverLink, '_blank');
}

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