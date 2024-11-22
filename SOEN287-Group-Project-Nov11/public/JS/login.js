document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const adminLoginForm = document.getElementById('admin-login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            fetch('http://localhost:5500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('loggedIn', true);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('isAdmin', data.isAdmin || false); // Store if the user is an admin
                    window.location.href = data.redirectTo;
                } else {
                    alert(data.message || 'Login failed. Please check your credentials.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }


    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            fetch('http://localhost:5500/admin-login', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('loggedIn', true);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('isAdmin', true);  // Set isAdmin to true for admin login
                    window.location.href = 'businessAdmin.html';  // Redirect to BusinessAdmin page
                } else {
                    alert(data.message || 'Admin login failed.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});