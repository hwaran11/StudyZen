document.addEventListener('DOMContentLoaded', function () {
  const profileDetails = document.getElementById('profile-details');

  async function fetchProfileDetails() {
      try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/profile/details', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              }
          });

          const data = await response.json();
          if (response.ok) {
              console.log('Fetched data:', data);
              displayProfileDetails(data);
          } else {
              showNotification(data.message, 'error');
          }
      } catch (error) {
          showNotification('Error: ' + error.message, 'error');
      }
  }

  function displayProfileDetails(data) {
      console.log('Displaying data:', data);

      const sections = [
          { title: 'About Yourself', fields: ['fullName', 'profilePic', 'shortBio'], step: 'step1', icon: 'fa-user' },
          { title: 'Academic Information', fields: ['university', 'program', 'semester'], step: 'step2', icon: 'fa-graduation-cap' },
          { title: 'Best Study Times', fields: ['bestStudyTimes'], step: 'step3', icon: 'fa-clock' },
          { title: 'Study Goals', fields: ['studyGoals'], step: 'step4', icon: 'fa-bullseye' },
          { title: 'Learning Characteristics', fields: ['learningCharacteristics'], step: 'step5', icon: 'fa-brain' },
          { title: 'Weekly Availability', fields: ['weeklyAvailability'], step: 'step6', icon: 'fa-calendar-alt' },
          { title: 'Personal Attributes', fields: ['personalAttributes'], step: 'step7', icon: 'fa-user-tag' },
          { title: 'Support Needs', fields: ['supportNeeds'], step: 'step8', icon: 'fa-hands-helping' },
          { title: 'Self-Assessment', fields: ['selfAssessment'], step: 'step9', icon: 'fa-chart-bar' },
          { title: 'Motivation', fields: ['motivation'], step: 'step10', icon: 'fa-fire' }
      ];

      profileDetails.innerHTML = ''; // Clear existing content

      sections.forEach(section => {
          const sectionDiv = document.createElement('div');
          sectionDiv.className = 'profile-section';

          const sectionTitle = document.createElement('h3');
          sectionTitle.innerHTML = `<i class="fas ${section.icon}"></i> ${section.title}`;
          sectionDiv.appendChild(sectionTitle);

          section.fields.forEach(field => {
              const fieldDiv = document.createElement('div');
              fieldDiv.className = 'tag-container';

              if (data[section.step] && data[section.step][field]) {
                  if (field === 'profilePic') {
                      const profilePicContainer = document.createElement('div');
                      profilePicContainer.className = 'profile-pic-container';
                      const img = document.createElement('img');
                      img.src = data[section.step][field];
                      img.alt = 'Profile Picture';
                      img.className = 'profile-pic';
                      profilePicContainer.appendChild(img);
                      sectionDiv.appendChild(profilePicContainer);
                  } else {
                      if (Array.isArray(data[section.step][field])) {
                          data[section.step][field].forEach(item => {
                              const tag = document.createElement('div');
                              tag.className = 'tag';
                              tag.textContent = item;
                              fieldDiv.appendChild(tag);
                          });
                      } else {
                          const tag = document.createElement('div');
                          tag.className = 'tag';
                          tag.textContent = data[section.step][field];
                          fieldDiv.appendChild(tag);
                      }
                  }

                  sectionDiv.appendChild(fieldDiv);
              } else {
                  console.warn(`Field ${field} in section ${section.title} is undefined or missing.`);
              }
          });

          profileDetails.appendChild(sectionDiv);
      });
  }

  function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
          notification.remove();
      }, 3000);
  }

  fetchProfileDetails();

  document.getElementById('edit-button').addEventListener('click', function () {
      window.location.href = '/profile-edit.html';
  });

  document.getElementById('confirm-button').addEventListener('click', function () {
      showNotification('Profile confirmed', 'success');
      setTimeout(() => {
          window.location.href = '/Study Group Step 1/group-setup-step1.html';
      }, 1500);
  });
});