document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');

    if (userForm) {
        userForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            fetch('http://localhost:5500/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password }) // Send values directly
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Store login status in localStorage
                    localStorage.setItem('loggedIn', true);

                    //Store userID
                    localStorage.setItem('userId', data.userId);
                    
                    // Redirect to the home page
                    window.location.href = data.redirectTo;
                } else {
                    console.error('Error creating account:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
