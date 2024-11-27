document.addEventListener('DOMContentLoaded', function () {
    const accountEditForm = document.getElementById('account-edit-form');
    const deleteAccount = document.getElementById('delete-account');

    if (accountEditForm) {
        accountEditForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            //const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const userId = localStorage.getItem('userId');
            const isAdmin = localStorage.getItem('isAdmin') === 'true';

            if (!userId) {
                alert('You are not logged in.');
                return;
            }

            const endpoint = isAdmin ? '/update-admin-account' : '/update-user-account';

            fetch(`http://localhost:5500${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, username, password })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Account details updated successfully!');
                    } else {
                        alert(data.message || 'Failed to update account details.');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    //delete account button

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if(isAdmin){
        document.getElementById("container2").style.display = 'none';
    }

    deleteAccount.onclick = function () {
        const userId = localStorage.getItem('userId');
        

        if (!userId) {
            alert('You are not logged in.');
            return;
        }

        //const endpoint = isAdmin ? '/delete-admin-account' : '/delete-user-account';
        const endpoint = '/delete-user-account';

        fetch(`http://localhost:5500${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId})
        })
        .catch(error => console.error('Error:', error));
        
        alert('Account deleted successfully!');
        localStorage.removeItem('userId'); // Clear user data from localStorage
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('loggedIn');
        window.location.href = '/public/HTML/index.html';
            // .then(data => {
            //     if (data.success) {
            //         alert('Account deleted successfully!');
            //         localStorage.removeItem('userId'); // Clear user data from localStorage
            //         localStorage.removeItem('isAdmin');
            //         window.location.href = '/public/HTML/index.html';
            //     } else {
            //         alert(data.message || 'Failed to delete account details.');
            //     }
            // })

       
    }
   
    

    const isLoggedIn = localStorage.getItem('loggedIn');
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
            localStorage.removeItem("userId");
            localStorage.removeItem('isAdmin');
            
            //bring back to home page
            window.location.href = '../HTML/index.html';

        }

    } else {
        loginStatus.style.display = '';
    }
    
});
