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
            
            //bring back to home page
            window.location.href = '../HTML/index.html';

        }

    } else {
        loginStatus.style.display = '';
    }

});
