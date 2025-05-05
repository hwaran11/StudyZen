document.addEventListener('DOMContentLoaded', function () {
  const tagsContainer = document.getElementById('best-study-times');
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
    const selectedTags = document.querySelectorAll('#best-study-times .tag.selected');
    if (tag.classList.contains('selected')) {
      tag.classList.remove('selected');
    } else if (selectedTags.length < maxTags) {
      tag.classList.add('selected');
    }
    validateForm();
  }

  document.getElementById('profileForm3').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedTags = Array.from(document.querySelectorAll('#best-study-times .tag.selected')).map(tag => tag.dataset.value);
    const data = { bestStudyTimes: selectedTags };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/step3', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Profile step 3 saved');
        updateProgress('partners', 60); // Update study partners progress
        window.location.href = '/Profile-Step 4/profile-step4.html'; // Redirect to step 4
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  function validateForm() {
    const selectedTags = document.querySelectorAll('#best-study-times .tag.selected').length;
    nextButton.disabled = selectedTags < minTags || selectedTags > maxTags;
  }

  function navigateToPrevious() {
    window.location.href = '/Profile-Step 2/profile-step2.html';
  }

  function updateProgress(type, percentage) {
    if (type === 'partners') {
      document.getElementById('progress-partners').style.width = `${percentage}%`;
    } else if (type === 'groups') {
      document.getElementById('progress-groups').style.width = `${percentage}%`;
    }
  }
});
