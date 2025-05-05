document.addEventListener('DOMContentLoaded', function () {
  const tagsContainer = document.getElementById('study-goals');
  const nextButton = document.getElementById('next-button');
  const maxTags = 3;
  const minTags = 2;

  tagsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('tag')) {
      toggleTag(event.target);
      validateForm();
    }
  });

  function toggleTag(tag) {
    const selectedTags = document.querySelectorAll('#study-goals .tag.selected');
    if (tag.classList.contains('selected')) {
      tag.classList.remove('selected');
    } else if (selectedTags.length < maxTags) {
      tag.classList.add('selected');
    }
    validateForm();
  }

  document.getElementById('profileForm4').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedTags = Array.from(document.querySelectorAll('#study-goals .tag.selected')).map(tag => tag.dataset.value);
    const data = { studyGoals: selectedTags };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/step4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Profile step 4 saved');
        updateProgress('partners', 80); // Update study partners progress
        window.location.href = '/Profile-Step 5/profile-step5.html'; // Redirect to step 5
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  function validateForm() {
    const selectedTags = document.querySelectorAll('#study-goals .tag.selected').length;
    nextButton.disabled = selectedTags < minTags || selectedTags > maxTags;
  }

  function navigateToPrevious() {
    window.location.href = '/Profile-Step 3/profile-step3.html';
  }

  function updateProgress(type, percentage) {
    if (type === 'partners') {
      document.getElementById('progress-partners').style.width = `${percentage}%`;
    } else if (type === 'groups') {
      document.getElementById('progress-groups').style.width = `${percentage}%`;
    }
  }
});
