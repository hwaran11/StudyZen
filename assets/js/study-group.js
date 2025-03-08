document.addEventListener('DOMContentLoaded', function() {
    // Profile data
    const profileData = {
        1: {
            name: "Sofea",
            role: "Computer Science",
            preferences: {
                time: "evening",
                approach: "Problem-solving"
            },
            qualities: ["Adaptability & Flexibility"],
            availability: ["Evenings"]
        },
        2: {
            name: "Aisha Rahman",
            role: "Petroleum Engineering",
            preferences: {
                time: "morning",
                approach: "Sharing notes and resources"
            },
            qualities: ["Good Communication"],
            availability: ["Mornings"]
        },
        3: {
            name: "Faizal Aziz",
            role: "Chemical Engineering",
            preferences: {
                time: "afternoon",
                approach: "Motivating and holding each other accountable"
            },
            qualities: ["Accountability"],
            availability: ["Afternoons"]
        }
    };
    
    // Get modal elements
    const modal = document.getElementById('profileModal');
    const modalBody = modal.querySelector('.modal-body');
    const closeModal = modal.querySelector('.close-modal');
    
    // Profile view button event listeners
    const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
    const profileCards = document.querySelectorAll('.profile-card');
    
    // Function to open modal with profile data
    function openProfileModal(profileId) {
        const profile = profileData[profileId];
        
        if (!profile) return;
        
        // Create modal content
        const modalContent = `
            <div class="modal-profile-card">
                <div class="card-header">
                    <div class="profile-info">
                        <h2 class="profile-name">${profile.name}</h2>
                        <p class="profile-role">${profile.role}</p>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">Study Preferences</h3>
                    <div class="detail-item">
                        <span class="detail-text"><span>${profile.preferences.approach}</span> approach</span>
                    </div>
                </div>

                <div class="profile-section">
                    <h3 class="section-title">Qualities Matters in a Study Partner</h3>
                    ${profile.qualities.map(quality => `
                        <div class="detail-item">
                            <span class="detail-text">${quality}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="profile-section">
                    <h3 class="section-title">Availability</h3>
                    <div class="availability-schedule">
                        ${profile.availability.map(time => `
                            <span class="schedule-item available">${time}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="action-button primary-action" data-profile-id="${profileId}" data-action="connect">
                        <i class="fa-solid fa-user-plus"></i>
                        Connect
                    </button>
                    <button class="action-button secondary-action" data-profile-id="${profileId}" data-action="message">
                        <i class="fa-solid fa-message"></i>
                        Message
                    </button>
                </div>
            </div>
        `;
        
        // Set modal content
        modalBody.innerHTML = modalContent;
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        
        // Add event listeners to action buttons in modal
        const actionButtons = modalBody.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', handleActionButton);
        });
    }
    
    // Handle action button clicks (Connect or Message)
    function handleActionButton(event) {
        const button = event.currentTarget;
        const profileId = button.getAttribute('data-profile-id');
        const actionType = button.getAttribute('data-action');
        const profileName = profileData[profileId].name;
        
        // Show alert and close modal
        alert(`You've chosen to ${actionType === 'connect' ? 'connect with' : 'message'} ${profileName}!`);
        closeProfileModal();
    }
    
    // Function to close modal
    function closeProfileModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Event listener for view profile buttons
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click event from firing
            const profileCard = this.closest('.profile-card');
            const profileId = profileCard.getAttribute('data-profile-id');
            openProfileModal(profileId);
        });
    });
    
    // Allow clicking anywhere on card to open profile
    profileCards.forEach(card => {
        card.addEventListener('click', function() {
            const profileId = this.getAttribute('data-profile-id');
            openProfileModal(profileId);
        });
    });
    
    // Close modal when clicking close button
    closeModal.addEventListener('click', closeProfileModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeProfileModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeProfileModal();
        }
    });
});