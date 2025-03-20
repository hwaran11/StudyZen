document.addEventListener('DOMContentLoaded', function () {
    const tagsContainer = document.getElementById('learning-characteristics');
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
      const selectedTags = document.querySelectorAll('#learning-characteristics .tag.selected');
      if (tag.classList.contains('selected')) {
        tag.classList.remove('selected');
      } else if (selectedTags.length < maxTags) {
        tag.classList.add('selected');
      }
      validateForm();
    }
  
    document.getElementById('profileForm5').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const selectedTags = Array.from(document.querySelectorAll('#learning-characteristics .tag.selected')).map(tag => tag.dataset.value);
      const data = { learningCharacteristics: selectedTags };
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile/step5', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        const responseData = await response.json();
        if (response.ok) {
          alert('Profile step 5 saved');
          updateProgress('partners', 80); // Update study partners progress
          window.location.href = '/Profile-Step 6/profile-step6.html'; // Redirect to step 6
        } else {
          alert(responseData.message);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  
    function validateForm() {
      const selectedTags = document.querySelectorAll('#learning-characteristics .tag.selected').length;
      nextButton.disabled = selectedTags < minTags || selectedTags > maxTags;
    }
  
    function navigateToPrevious() {
      window.location.href = '/Profile-Step 4/profile-step4.html';
    }
  
    function updateProgress(type, percentage) {
      if (type === 'partners') {
        document.getElementById('progress-partners').style.width = `${percentage}%`;
      } else if (type === 'groups') {
        document.getElementById('progress-groups').style.width = `${percentage}%`;
      }
    }
  });
  