document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email.endsWith('@utp.edu.my')) {
        alert('Invalid domain');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful');
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data._id); // Store user ID in local storage
            console.log('User ID stored:', data._id); // Debugging: Log the stored user ID
            if (data.isProfileComplete) {
                window.location.href = '/Dashboard/dashboard.html';
            } else {
                window.location.href = '/Profile-Step 1/profile-step1.html';
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
