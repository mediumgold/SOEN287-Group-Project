document.addEventListener("DOMContentLoaded", function () {
    
    const contactForm = document.getElementById("contactForm");
  
    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
  
        // Send the form data to the server
        fetch("http://localhost:5500/submitContact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        })
          .then((response) => {
            if (response.ok) {
              return response.text(); // Assuming the server sends a success message
            } else {
              throw new Error("Failed to submit the form. Please try again.");
            }
          })
          .then((data) => {
            alert("Message sent successfully!");
            contactForm.reset(); // Clear the form fields
          })
          .catch((error) => {
            console.error("Error:", error);
            alert(
              "There was an error submitting your message. Please try again later."
            );
          });
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