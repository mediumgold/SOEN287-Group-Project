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
            

            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
        
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
                    localStorage.setItem('isAdmin', true);  
                    window.location.href = data.redirectTo;  
                } else {
                    alert(data.message || 'Admin login failed.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
    const isLoggedIn = localStorage.getItem('loggedIn');
    const hasUserID = localStorage.getItem('userId')
    const loginStatus = document.getElementById('loginStatus');
    const signInDiv = document.getElementById('signInDiv');

    //The two buttons to the right of the nav bar. sign in and create acc
    const btn1 = document.getElementById('signIn');
    const btn2 = document.getElementById('createAcc');

    //current userID
    const userId = localStorage.getItem('userId');

    //test comment
    if (isLoggedIn) {
        //once logged in, we will change the contents and href of btn 1 (sign in) to lead to account
        btn1.querySelector('a').innerText = 'Account';
        btn1.querySelector('a').href = '../HTML/account.html';

        //once logged in, we will change the contents and href of btn2 (create account) to log out and index.html
        btn2.querySelector('a').innerText = 'Logout';

        // we want to prevent it from going right away, (only want it onclick)
        btn2.querySelector('a').href = '#'; 

        //onclick, logout and go to home page
        btn2.onclick = function(){
            //clear login status
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            
            //bring back to home page
            window.location.href = '../HTML/index.html';

        }

    } else {
        loginStatus.style.display = '';
    }
});