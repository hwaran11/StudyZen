let connectRequestInProgress = false;

async function connectWithPartner(partnerId) {
    if (connectRequestInProgress) {
        return;
    }
    connectRequestInProgress = true;

    try {
        const userId = localStorage.getItem('userId');
        
        // Fetch the user's name
        const userResponse = await fetch(`/api/users/${userId}`);
        const userData = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user details: ${userData.message}`);
        }

        const userName = userData.partnerSetup.step1.fullName;

        const response = await fetch('/api/partners/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, partnerId })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Connection request sent!');
            await sendNotification(partnerId, `You have a new connection request from ${userName}`);
            fetchMatchedPartners();
        } else {
            alert(`Failed to connect. Please try again. Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error connecting with partner:', error);
        alert('An error occurred. Please try again.');
    } finally {
        connectRequestInProgress = false;
    }
}

async function sendNotification(userId, message) {
    await fetch('/api/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, message })
    });
}

async function fetchNotifications() {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`/api/notifications/${userId}`);

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching notifications:', error.message);
        return;
    }

    const notifications = await response.json();
    displayNotifications(notifications);
}

function displayNotifications(notifications) {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.innerHTML = '';

    if (notifications.length === 0) {
        dropdown.innerHTML = '<p>No notifications</p>';
        return;
    }

    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification';
        notificationItem.innerHTML = `
            <div class="message">${notification.message}</div>
            ${notification.type === 'connection_request' ? `
            <div class="actions">
                <button onclick="respondToConnection('${notification._id}', 'accepted')">Accept</button>
                <button onclick="respondToConnection('${notification._id}', 'rejected')">Reject</button>
            </div>
            ` : ''}
            <button class="mark-read" onclick="markAsRead('${notification._id}')">Mark as read</button>
        `;
        dropdown.appendChild(notificationItem);
    });
}

async function markAsRead(notificationId) {
    const userId = localStorage.getItem('userId');
    const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, notificationId })
    });

    if (response.ok) {
        fetchNotifications();
    } else {
        const error = await response.json();
        console.error('Error marking notification as read:', error.message);
    }
}

async function respondToConnection(requestId, response) {
    const res = await fetch('/api/partners/respond', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, response })
    });

    if (res.ok) {
        const data = await res.json();
        if (response === 'accepted') {
            showConnectionModal(data.user);
            fetchConnectedUsers();  // Update connected users list
        } else {
            alert('Connection request rejected.');
        }
        fetchNotifications();
    } else {
        const error = await res.json();
        console.error('Error responding to connection request:', error.message);
    }
}

function showConnectionModal(user) {
    const modal = document.getElementById('userModal');
    const modalContent = document.getElementById('modal-user-details');

    modalContent.innerHTML = `
        <h2>${user.partnerSetup.step1.fullName}</h2>
        <p>Discord User ID: ${user.partnerSetup.step1.discordId}</p>
        <a href="https://discordapp.com/users/${user.partnerSetup.step1.discordId}" target="_blank">Open Discord Profile</a>
        <button onclick="closeModal()">Close</button>
    `;
    modal.style.display = 'block';
}

document.querySelector('.notification-bell').addEventListener('click', () => {
    document.getElementById('notification-dropdown').classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', () => {
    fetchRecommendedGroups();
    fetchMatchedPartners();
    fetchUsers();
    fetchConnectedUsers();  // Fetch connected users
    fetchNotifications();
});

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.classList.toggle('show');
}

document.querySelector('.notification-bell').addEventListener('click', toggleNotificationDropdown);

window.onclick = function(event) {
    const modal = document.getElementById('userModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

function joinStudyGroupServer() {
    const serverLink = 'https://discord.gg/yourserverlink';
    window.open(serverLink, '_blank');
}

async function fetchRecommendedGroups() {
    const userId = localStorage.getItem('userId');

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
            <p class="matching-attributes"><i class="fas fa-check-circle"></i> Matching Attributes: ${group.matchCount || 'N/A'}</p>
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

async function fetchMatchedPartners() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('User ID not found');
        return;
    }

    const response = await fetch(`/api/partners?userId=${userId}`);

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching matched partners:', error.message);
        return;
    }

    const matchedPartners = await response.json();
    displayPartners(matchedPartners, 'matched-partners-list');
}

function displayPartners(partners, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (partners.length === 0) {
        container.innerHTML = '<p>No matched partners found.</p>';
        return;
    }
    partners.forEach(partner => {
        const partnerCard = document.createElement('div');
        partnerCard.className = 'partner-card';
        partnerCard.innerHTML = `
            <h2 class="partner-name">${partner.fullName}</h2>
            <div class="partner-details" style="display: none;">
                <img src="${partner.profilePic || 'https://via.placeholder.com/150'}" alt="${partner.fullName}" class="partner-img">
                <div class="partner-info">
                    <p class="short-bio">${partner.shortBio || 'No bio available'}</p>
                    <p class="university">${partner.partnerSetup?.step2?.university || 'Unknown University'}</p>
                    <p class="program">${partner.partnerSetup?.step2?.program || 'Unknown Program'}</p>
                    <p class="specialization">Specialization: ${partner.partnerSetup?.step2?.semester || 'N/A'}</p>
                    <div class="tags">
                        ${(partner.partnerSetup?.step5?.learningCharacteristics || []).map(char => `<span class="tag setting">${char}</span>`).join('')}
                        ${(partner.partnerSetup?.step4?.studyGoals || []).map(goal => `<span class="tag goal">${goal}</span>`).join('')}
                        ${(partner.partnerSetup?.step3?.bestStudyTimes || []).map(time => `<span class="tag time">${time}</span>`).join('')}
                        ${(partner.partnerSetup?.step6?.weeklyAvailability || []).map(day => `<span class="tag day">${day}</span>`).join('')}
                    </div>
                </div>
                <button class="connect-btn" onclick="connectWithPartner('${partner._id}')">Connect</button>
            </div>
        `;
        partnerCard.addEventListener('click', () => {
            const details = partnerCard.querySelector('.partner-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
        container.appendChild(partnerCard);
    });
}

function createNewGroup() {
    window.location.href = '/Create New Study Group/createnewstudygroup.html';
}

function findStudyPartner() {
    window.location.href = '/Find Study Group Partners/findstudypartners.html';
}

function viewAllGroups() {
    window.location.href = '/All Study Groups/allstudygroups.html';
}

async function fetchUsers() {
    const response = await fetch('/api/users');

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching users:', error.message);
        return;
    }

    const users = await response.json();
    displayUsers(users, 'user-list');
}

async function fetchConnectedUsers() {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`/api/partners/connected/${userId}`);

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching connected users:', error.message);
        return;
    }

    const users = await response.json();
    displayUsers(users, 'connected-user-list');
}

function displayUsers(users, containerId) {
    const userList = document.getElementById(containerId);
    userList.innerHTML = '';
    users.forEach(user => {
        const userName = user.username || 'Unknown User';
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <div class="user-info">
                <span class="username">${userName}</span>
            </div>
        `;
        userItem.addEventListener('click', () => openUserModal(user));
        userList.appendChild(userItem);
    });
}

function openUserModal(user) {
    const modal = document.getElementById('userModal');
    const modalContent = document.getElementById('modal-user-details');
    const connectBtn = document.getElementById('modal-connect-btn');

    modalContent.innerHTML = `
        <h2>${user.partnerSetup?.step1?.fullName}</h2>
        <img src="${user.partnerSetup?.step1?.profilePic || 'https://via.placeholder.com/150'}" alt="${user.partnerSetup?.step1?.fullName}" class="partner-img">
        <p class="short-bio">${user.partnerSetup?.step1?.shortBio || 'No bio available'}</p>
        <p class="university">${user.partnerSetup?.step2?.university || 'Unknown University'}</p>
        <p class="program">${user.partnerSetup?.step2?.program || 'Unknown Program'}</p>
        <p class="specialization">Specialization: ${user.partnerSetup?.step2?.semester || 'N/A'}</p>
        <div class="tags">
            ${(user.partnerSetup?.step5?.learningCharacteristics || []).map(char => `<span class="tag setting">${char}</span>`).join('')}
            ${(user.partnerSetup?.step4?.studyGoals || []).map(goal => `<span class="tag goal">${goal}</span>`).join('')}
            ${(user.partnerSetup?.step3?.bestStudyTimes || []).map(time => `<span class="tag time">${time}</span>`).join('')}
            ${(user.partnerSetup?.step6?.weeklyAvailability || []).map(day => `<span class="tag day">${day}</span>`).join('')}
        </div>
    `;

    connectBtn.onclick = debounce(() => connectWithPartner(user._id), 1000);

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('discordModal').style.display = 'none';
}

function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
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