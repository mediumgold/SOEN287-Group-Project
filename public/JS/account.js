document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const userName = localStorage.getItem('userName');
    const isAdmin = localStorage.getItem("isAdmin"); // Stored as a string
    const loginStatus = document.getElementById('loginStatus');
    const signInDiv = document.getElementById('signInDiv');

    // The two buttons to the right of the nav bar: sign in and create acc
    const btn1 = document.getElementById('signIn');
    const btn2 = document.getElementById('createAcc');

    // Current userID
    const userId = localStorage.getItem('userId');

    if (isLoggedIn) {
        // Once logged in, change the contents and href of btn1 (sign in) to lead to the account page
        btn1.querySelector('a').innerText = 'Account';
        btn1.querySelector('a').href = '../HTML/account.html';

        // Once logged in, change the contents and href of btn2 (create account) to log out and index.html
        btn2.querySelector('a').innerText = 'Logout';

        // Prevent it from navigating away immediately; instead, handle it on click
        btn2.querySelector('a').href = '#';

        // On click, log out and redirect to the home page
        btn2.onclick = function() {
            // Clear login status
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole'); // Clear user role
            localStorage.removeItem('isAdmin');
            
            // Redirect to the home page
            window.location.href = '../HTML/index.html';
        };

        // If the user is on the account page and is an admin, dynamically add the "Admin Permissions" option
        if (isAdmin === "true" && isLoggedIn) { // Check explicitly for the string "true"
            const accountOptions = document.querySelector('.account-options');

            // Create the Admin Permissions option
            const adminOption = document.createElement('div');
            adminOption.classList.add('account-option');

            adminOption.innerHTML = `
                <a href="businessadmin.html" class="">
                    <span class="icon">🛠️</span>
                    <div class="option-text">
                        <h3>Admin Permissions</h3>
                        <p>Manage administrative tasks</p>
                    </div>
                    <span class="arrow">›</span>
                </a>
            `;

            // Append the new option to the account options section
            accountOptions.appendChild(adminOption);
        }
    } else {
        loginStatus.style.display = '';
    }

    // // Dynamically generate the welcome message in the account page
    // const welcomeMessage = document.getElementById('welcomeMessage'); // Get the element where the welcome message will be displayed
    // if (userName) {
    //     fetchAndUpdateDisplay(1);
    //     welcomeMessage.innerText = `Welcome, ${userName} !`; // Set the text content of the h1 element
    // } else {
    //     welcomeMessage.innerText = "Welcome to Your Account"; // Default text if no userName is found
    // }
});

// Updated fetchAndUpdateDisplay function to update localStorage with the username
// async function fetchAndUpdateDisplay(userId) {
//     try {
//         // Fetch the latest value from the server
//         const response = await fetch(`http://localhost:5500/latest-value?id=${userId}`);
//         console.log('just fetched');
//         console.log('responce status' + response.status)
//         if (!response.ok) throw new Error('Failed to fetch data');
        
//         const data = await response.json();
//         console.log(data.value + '<- the new name');
//         // Update localStorage with the new username
//         localStorage.setItem('userName', data.value);

//         // Update the DOM (if necessary, this will be handled dynamically)
//         const welcomeMessage = document.getElementById('welcomeMessage');
//         welcomeMessage.innerText = `Welcome, ${data.value} !`;
//     } catch (error) {
//         console.error('Error fetching or updating data:', error);
//     }
// }
