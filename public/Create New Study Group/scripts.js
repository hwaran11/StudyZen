document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('create-group-form');
    const tagContainers = document.querySelectorAll('.tag-container');
    const progressBar = document.querySelector('.progress');
    
    // Handle tag selection
    tagContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag')) {
                // Deselect all tags in this container
                container.querySelectorAll('.tag').forEach(tag => tag.classList.remove('selected'));
                // Select the clicked tag
                e.target.classList.add('selected');
                updateProgress();
            }
        });
    });
    
    function updateProgress() {
        const totalFields = tagContainers.length + 1; // +1 for the group name input
        const filledFields = Array.from(tagContainers).filter(container => 
            container.querySelector('.tag.selected')
        ).length + (document.getElementById('groupName').value ? 1 : 0);
        const progress = (filledFields / totalFields) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            groupName: document.getElementById('groupName').value,
            groupSize: getSelectedTag('groupSize'),
            interactionStyle: getSelectedTag('interactionStyle'),
            studySchedule: getSelectedTag('studySchedule'),
            sessionLength: getSelectedTag('sessionLength'),
            groupGoals: getSelectedTag('groupGoals'),
            engagementLevel: getSelectedTag('engagementLevel'),
            leadershipStyle: getSelectedTag('leadershipStyle'),
            groupSupport: getSelectedTag('groupSupport'),
            discordChannelId: document.getElementById('discordChannelLink').value
        };
        
        try {
            const response = await fetch('/api/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Study group created successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error creating study group:', error);
            alert('An error occurred while creating the study group. Please try again.');
        }
    });
    
    function getSelectedTag(containerId) {
        const container = document.getElementById(containerId);
        const selectedTag = container.querySelector('.tag.selected');
        return selectedTag ? selectedTag.dataset.value : null;
    }
    
    // Initial progress update
    updateProgress();
});
