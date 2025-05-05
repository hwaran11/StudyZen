// Function to handle joining a study group
async function joinGroup(groupId) {
    const userId = localStorage.getItem('userId');
    const role = 'member'; // Default role for users joining the group

    // Debug: log the data being sent
    console.log('Joining group with data:', { sessionId: groupId, userId, role });

    const response = await fetch('/api/studySessions/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: groupId, userId, role })
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('sessionId', groupId);
        localStorage.setItem('groupName', result.session.groupName); // Store the group name
        window.location.href = '/studysession.html';
    } else {
        console.error('Failed to join group:', result);
        alert(`Failed to join group: ${result.message}`);
    }
}

// Function to initialize study session page
function initializeStudySession() {
    const sessionId = localStorage.getItem('sessionId');
    const groupName = localStorage.getItem('groupName'); // Retrieve the group name

    if (document.getElementById('group-name')) {
        document.getElementById('group-name').textContent = groupName; // Display the group name
    }

    if (sessionId) {
        fetch(`/api/studySessions/${sessionId}`)
            .then(response => response.json())
            .then(data => {
                const membersList = document.getElementById('members-list');
                data.session.members.forEach(member => {
                    const memberItem = document.createElement('li');
                    memberItem.textContent = member.userId.fullName;
                    membersList.appendChild(memberItem);
                });

                const chatMessages = document.getElementById('chat-messages');
                data.session.messages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'chat-message';
                    messageDiv.textContent = `${message.userId.fullName}: ${message.message}`;
                    chatMessages.appendChild(messageDiv);
                });
            });
    }
}

// Initialize appropriate page on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('join-study-group-page')) {
        // Initialize join study group page specific scripts if needed
    } else if (document.body.classList.contains('study-session-page')) {
        initializeStudySession();
    }
});
