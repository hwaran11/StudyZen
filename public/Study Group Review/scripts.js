document.addEventListener('DOMContentLoaded', function () {
  async function fetchGroupSetupDetails() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/groups/details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Fetched data:', data); // Log the fetched data
        displayGroupSetupDetails(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  function displayGroupSetupDetails(data) {
    console.log('Displaying data:', data); // Log the data to be displayed

    const sections = [
      { title: 'Preferred Group Size', field: 'groupSize', step: 'step1' },
      { title: 'Preferred Interaction Style', field: 'interactionStyle', step: 'step2' },
      { title: 'Preferred Study Schedule', field: 'studySchedule', step: 'step3' },
      { title: 'Preferred Study Session Length', field: 'sessionLength', step: 'step4' },
      { title: 'Group Goals', field: 'groupGoals', step: 'step5' },
      { title: 'Preferred Engagement Level', field: 'engagementLevel', step: 'step6' },
      { title: 'Preferred Leadership Style', field: 'leadershipStyle', step: 'step7' },
      { title: 'Preferred Group Support', field: 'groupSupport', step: 'step8' },
    ];

    sections.forEach(section => {
      const container = document.getElementById(`review-${section.field}`);
      if (!container) {
        console.error(`Container for ${section.field} not found`);
        return;
      }
      container.innerHTML = ''; // Clear existing tags

      const values = data[section.step][section.field];
      console.log(`Processing ${section.field}:`, values);
      if (values) {
        if (Array.isArray(values)) {
          values.forEach(value => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            container.appendChild(tag);
          });
        } else {
          const tag = document.createElement('div');
          tag.className = 'tag';
          tag.textContent = values;
          container.appendChild(tag);
        }
      } else {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = 'Not provided';
        container.appendChild(tag);
      }
    });
  }

  // Navigate to previous step
  window.navigateToPrevious = function() {
    window.location.href = '/group-setup-step8.html';
  }

  // Submit setup
  window.submitSetup = async function() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/groups/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Group setup submitted successfully');
        window.location.href = '/Dashboard/dashboard.html'; // Redirect to dashboard or desired page
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  fetchGroupSetupDetails();
});
