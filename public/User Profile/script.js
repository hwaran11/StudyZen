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
    // Fetch user profile data and display it
    const userProfile = document.getElementById('user-profile');

    fetch(`/api/profile/userdetails`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assumes token is stored in local storage
        }
    })
    .then(response => response.json())
    .then(data => {
        userProfile.innerHTML = `
            <div class="profile-header">
                <img src="${data.partnerSetup.step1.profilePic || 'https://via.placeholder.com/180'}" alt="Profile Picture" class="profile-picture">
                <h2 class="profile-name">${data.partnerSetup.step1.fullName}</h2>
                <p class="profile-username">@${data.username}</p>
                <p class="profile-bio">${data.partnerSetup.step1.shortBio}</p>
            </div>
            <div class="profile-section">
                <h3>Academic Information</h3>
                <div class="tag-list">
                    <span class="tag tag-academic">${data.partnerSetup.step2.university}</span>
                    <span class="tag tag-academic">${data.partnerSetup.step2.program}</span>
                    <span class="tag tag-academic">${data.partnerSetup.step2.semester}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Study Preferences</h3>
                <div class="tag-list">
                    <span class="tag tag-preference">${data.partnerSetup.step3.bestStudyTimes.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Study Goals</h3>
                <div class="tag-list">
                    <span class="tag tag-goal">${data.partnerSetup.step4.studyGoals.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Learning Characteristics</h3>
                <div class="tag-list">
                    <span class="tag tag-characteristic">${data.partnerSetup.step5.learningCharacteristics.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Weekly Availability</h3>
                <div class="tag-list">
                    <span class="tag tag-availability">${data.partnerSetup.step6.weeklyAvailability.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Personal Attributes</h3>
                <div class="tag-list">
                    <span class="tag tag-attribute">${data.partnerSetup.step7.personalAttributes.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Support Needs</h3>
                <div class="tag-list">
                    <span class="tag tag-support">${data.partnerSetup.step8.supportNeeds.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Self-Assessment</h3>
                <div class="tag-list">
                    <span class="tag tag-assessment">${data.partnerSetup.step9.selfAssessment.join(', ')}</span>
                </div>
            </div>
            <div class="profile-section">
                <h3>Motivation</h3>
                <div class="tag-list">
                    <span class="tag tag-motivation">${data.partnerSetup.step10.motivation.join(', ')}</span>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
    });
});

