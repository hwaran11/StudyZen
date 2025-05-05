document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('groupForm4');
  const tagsContainer = document.getElementById('session-length');
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
    
    const sessionLength = Array.from(selectedTags);
    const data = { sessionLength };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/groups/step4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Group setup step 4 saved');
        updateProgress('groups', 40); // Update study groups progress
        window.location.href = '/Study Group Step 5/group-setup-step5.html'; // Redirect to step 5
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
    window.location.href = '/Study Group Step 3/group-setup-step3.html';
  }

  function updateProgress(type, percentage) {
    if (type === 'groups') {
      document.getElementById('progress-groups').style.width = `${percentage}%`;
    }
  }
});

  