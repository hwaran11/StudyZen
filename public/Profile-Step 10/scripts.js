document.addEventListener('DOMContentLoaded', function () {
  const tagsContainer = document.getElementById('motivation');
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
    const selectedTags = document.querySelectorAll('#motivation .tag.selected');
    if (tag.classList.contains('selected')) {
      tag.classList.remove('selected');
    } else if (selectedTags.length < maxTags) {
      tag.classList.add('selected');
    }
    validateForm();
  }

  document.getElementById('profileForm10').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedTags = Array.from(document.querySelectorAll('#motivation .tag.selected')).map(tag => tag.dataset.value);
    const data = { motivation: selectedTags };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/step10', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Profile setup completed');
        window.location.href = '/Profile - Study Partners/profile-review.html'; // Redirect to profile completion or dashboard
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  function validateForm() {
    const selectedTags = document.querySelectorAll('#motivation .tag.selected').length;
    nextButton.disabled = selectedTags < minTags || selectedTags > maxTags;
  }

  function navigateToPrevious() {
    window.location.href = '/Profile-Step 9/profile-step9.html';
  }

  function updateProgress(type, percentage) {
    if (type === 'partners') {
      document.getElementById('progress-partners').style.width = `${percentage}%`;
    } else if (type === 'groups') {
      document.getElementById('progress-groups').style.width = `${percentage}%`;
    }
  }
});
