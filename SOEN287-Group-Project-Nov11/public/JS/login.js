document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
   // const adminLoginForm = 

    if (loginForm) {
        //user form login
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            fetch('http://localhost:5500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }) // Send email and password
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Store login status and user ID in localStorage
                    localStorage.setItem('loggedIn', true);
                    localStorage.setItem('userId', data.userId);
                    
                    // Redirect to the home page
                    window.location.href = data.redirectTo;

                    //message saying they logged in
                    alert("You logged in!");
                } else {
                    // Show error message if login fails
                    alert(data.message || 'Login failed. Please check your credentials.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
