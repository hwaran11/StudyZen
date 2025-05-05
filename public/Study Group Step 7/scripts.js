document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('groupForm7');
    const tagsContainer = document.getElementById('leadership-style');
    const nextButton = document.getElementById('next-button');
    let selectedTags = new Set();
    const maxTags = 1;
  
    tagsContainer.addEventListener('click', function (event) {
      if (event.target.classList.contains('tag')) {
        if (event.target.classList.contains('selected')) {
          event.target.classList.remove('selected');
          selectedTags.delete(event.target.dataset.value);
        } else {
          if (selectedTags.size < maxTags) {
            event.target.classList.add('selected');
            selectedTags.add(event.target.dataset.value);
          }
        }
        validateForm();
      }
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const leadershipStyle = Array.from(selectedTags);
      const data = { leadershipStyle };
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/groups/step7', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        const responseData = await response.json();
        if (response.ok) {
          alert('Group setup step 7 saved');
          updateProgress('groups', 70); // Update study groups progress
          window.location.href = '/Study Group Step 8/group-setup-step8.html'; // Redirect to step 8
        } else {
          alert(responseData.message);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  
    function validateForm() {
      nextButton.disabled = selectedTags.size !== maxTags;
    }
  
    function navigateToPrevious() {
      window.location.href = '/Study Group Step 6/group-setup-step6.html';
    }
  
    function updateProgress(type, percentage) {
      if (type === 'groups') {
        document.getElementById('progress-groups').style.width = `${percentage}%`;
      }
    }
  });
  