document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('groupForm6');
    const tagsContainer = document.getElementById('engagement-level');
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
      
      const engagementLevel = Array.from(selectedTags);
      const data = { engagementLevel };
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/groups/step6', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        const responseData = await response.json();
        if (response.ok) {
          alert('Group setup step 6 saved');
          updateProgress('groups', 60); // Update study groups progress
          window.location.href = '/Study Group Step 7/group-setup-step7.html'; // Redirect to step 7
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
      window.location.href = '/Study Group Step 5/group-setup-step5.html';
    }
  
    function updateProgress(type, percentage) {
      if (type === 'groups') {
        document.getElementById('progress-groups').style.width = `${percentage}%`;
      }
    }
  });
  