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
});
