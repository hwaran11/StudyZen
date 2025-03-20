document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('groupForm1');
  const tagsContainer = document.getElementById('group-size');
  const nextButton = document.getElementById('next-button');
  let selectedTag = null;

  tagsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('tag')) {
      if (selectedTag) {
        selectedTag.classList.remove('selected');
      }
      event.target.classList.add('selected');
      selectedTag = event.target;
      validateForm();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const groupSize = selectedTag ? selectedTag.dataset.value : '';
    const data = { groupSize };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/groups/step1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Group setup step 1 saved');
        updateProgress('groups', 10); // Update study groups progress
        window.location.href = '/Study Group Step 2/group-setup-step2.html'; // Redirect to step 2
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  function validateForm() {
    nextButton.disabled = !selectedTag;
  }

  function navigateToPrevious() {
    window.location.href = '/Profile - Study Partners/profile-review.html';
  }

  function updateProgress(type, percentage) {
    if (type === 'groups') {
      document.getElementById('progress-groups').style.width = `${percentage}%`;
    }
  }
});

  