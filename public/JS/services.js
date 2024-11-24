document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const serviceId = button.getAttribute('data-service-id');
            
            // Retrieve userId from local storage (assuming it's stored after login)
            const userId = localStorage.getItem('userId');

            if (!userId) {
                alert('You need to log in to add items to your cart.');
                window.location.href = 'login.html'; // Redirect to login page
                return;
            }

            // Create the request payload
            const payload = {
                userId: parseInt(userId), // Ensure userId is an integer
                itemId: parseInt(serviceId), // Ensure itemId matches the database schema
                quantity: 1 // Default quantity for now
            };

            try {
                // Send POST request to the /cart endpoint
                const response = await fetch('http://localhost:5500/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.message === 'Item added to cart') {
                    alert(`Service ${serviceId} added to your cart!`);
                } else {
                    alert('Failed to add to cart. Please try again.');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('An error occurred while adding to your cart. Please try again later.');
            }
        });
    });

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
        btn2.querySelector('a').href = '#'; // we want to prevent it from going right away, (only want it onclick)

        //onclick, logout and go to home page
        btn2.onclick = function(){
            //clear login status
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            
            //bring back to home page
            window.location.href = '../HTML/index.html';

        }

        // signInDiv.style.display = 'none';
        // loginStatus.style.display = 'flex';
        // loginStatus.innerText = 'You are logged in';
    } else {
        loginStatus.style.display = '';
    }


});
