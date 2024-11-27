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

    // deleteAccount.onclick = function () {
    //     const userId = localStorage.getItem('userId');
        

    //     if (!userId) {
    //         alert('You are not logged in.');
    //         return;
    //     }

    //     //const endpoint = isAdmin ? '/delete-admin-account' : '/delete-user-account';
    //     const endpoint = '/delete-user-account';

    //     fetch(`http://localhost:5500${endpoint}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ userId})
    //     })
    //     .catch(error => console.error('Error:', error));
        
    //     //deleteOrder(localStorage.getItem('userId'));


    //     alert('Account deleted successfully!');
    //     localStorage.removeItem('userId'); // Clear user data from localStorage
    //     localStorage.removeItem('isAdmin');
    //     localStorage.removeItem('loggedIn');

    //     window.location.href = '/public/HTML/index.html';
            
       
    // }
    


//const deleteAccount = document.getElementById('delete-account');
deleteAccount.onclick = function () {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('You are not logged in.');
        return;
    }

    // Ask for confirmation before deleting account
    const confirmDelete = confirm('Are you sure you want to delete your account and all related data?');
    if (!confirmDelete) {
        return;
    }

    // Send a DELETE request to delete the user account and related data
    fetch('http://localhost:5500/delete-user-account', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Your account and related data have been deleted successfully.');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('loggedIn');
            window.location.href = '/public/HTML/index.html'; // Redirect to home page
        } else {
            alert(data.message || 'An error occurred while deleting your account.');
        }
    })
    .catch(error => {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account. Please try again later.');
    });
};
    

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


// async function deleteOrder(userId){
//     const data = userId;

//     try {
//         // Send POST request to delete the order
//         const response = await fetch('http://localhost:5500/api/deleteOrder', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         if (response.ok) {
//             alert('Order deleted successfully!');
//         } else {
//             alert(result.message || 'Failed to delete order.');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while deleting the order.');
//     }
//     location.reload();
// }