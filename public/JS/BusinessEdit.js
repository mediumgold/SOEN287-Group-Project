document.addEventListener('DOMContentLoaded', function () {
    const isAdmin = localStorage.getItem('isAdmin'); // Check if the user is an admin
    const logoutButton = document.getElementById('logoutButton'); // Assume you have a logout button with id "logoutButton"

    // If the user is not an admin, redirect them to the login page
    if (!isAdmin || isAdmin !== 'true') {
        alert('Access denied. Admins only.');
        window.location.href = 'login.html';  // Redirect to login page if not an admin
    }

    // Handle logout
    logoutButton.onclick = function () {
        alert("Logging out...");

        // Clear login state
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');  // Remove admin status if present

        // Redirect to index.html after logout
        window.location.href = 'index.html';
    };
});

// document.addEventListener('DOMContentLoaded', function () {
//     const logoutButton = document.getElementById('logoutButton');

//     if (logoutButton) {
//         logoutButton.onclick = function () {
//             alert("Logging out...");

//             // Clear login state from localStorage
//             localStorage.removeItem('loggedIn');
//             localStorage.removeItem('userId');
//             localStorage.removeItem('isAdmin');  // Remove admin status if present

//             // Redirect to the home page (index.html)
//             window.location.href = 'index.html';  // Redirect to the home page
//         };
//     }

//     // Admin access check
//     const isAdmin = localStorage.getItem('isAdmin');
//     if (!isAdmin || isAdmin !== 'true') {
//         alert('Access denied. Admins only.');
//         window.location.href = 'login.html';  // Redirect to login page if not an admin
//     }
// });


document.addEventListener("DOMContentLoaded", function () {
    const isAdmin = localStorage.getItem("isAdmin");
  
    const logoutButton = document.getElementById("logout-btn");
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("isAdmin");
      alert("You have been logged out.");
      window.location.href = "login.html"; // Redirect to login page
    });
  });
  
  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch("http://localhost:5500/api/editItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert(
        response.ok ? "Item updated successfully!" : "Failed to update item."
      );
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the item.");
    }
  });
  
  document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch("http://localhost:5500/api/addItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert(response.ok ? "Item added successfully!" : "Failed to add item.");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the item.");
    }
  });
  
  document.getElementById("delete-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch("http://localhost:5500/api/deleteItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert(
        response.ok ? "Item deleted successfully!" : "Failed to delete item."
      );
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the item.");
    }
  });
  
  //change company name
  document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("nameInput");
    const updateNameBtn = document.getElementById("updateNameBtn");
    const businessNameSpan = document.getElementById("business-name");
  
    // Load the current name from localStorage if it exists
    const savedName = localStorage.getItem("companyName");
    if (savedName) {
      businessNameSpan.textContent = savedName;
      const titleElement = document.getElementById("title");
      if (titleElement) {
        titleElement.textContent = savedName;
      }
    }
  
    // Update name on button click
    updateNameBtn.addEventListener("click", () => {
      const newName = nameInput.value.trim();
      if (newName) {
        // Save the new name to localStorage
        localStorage.setItem("companyName", newName);
  
        // Update the displayed name
        businessNameSpan.textContent = newName;
  
        // Update the navbar title in the same page
        const titleElement = document.getElementById("title");
        if (titleElement) {
          titleElement.textContent = newName;
        }
      } else {
        alert("Please enter a valid name.");
      }
    });
  });
  
  //change company logo
  document.addEventListener("DOMContentLoaded", () => {
    const logoInput = document.getElementById("logoInput"); // File input
    const navLogo = document.getElementById("logo"); // Navbar logo image
  
    // Load the logo from localStorage if it exists
    const savedLogo = localStorage.getItem("companyLogo");
    if (savedLogo) {
      navLogo.src = savedLogo;
    }
  
    logoInput?.addEventListener("change", (event) => {
      const file = event.target.files[0]; // Get the selected file
  
      if (!file) {
        alert("No file selected. Please choose an image.");
        return;
      }
  
      // Validate file type
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PNG or JPEG image.");
        logoInput.value = ""; // Reset the file input
        return;
      }
  
      // Optional: Validate file size (e.g., max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert("File is too large. Please upload an image smaller than 2MB.");
        logoInput.value = ""; // Reset the file input
        return;
      }
  
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = function (e) {
        const logoURL = e.target.result;
        navLogo.src = logoURL; // Update the navbar logo
        localStorage.setItem("companyLogo", logoURL); // Save the logo URL to localStorage
      };
      reader.readAsDataURL(file); // Read the file as a DataURL
    });
  });
  
  //change company address
  document.addEventListener("DOMContentLoaded", () => {
    const addressInput = document.getElementById("addressInput");
    const updateAddressBtn = document.getElementById("updateAddressBtn");
    const businessAddressSpan = document.getElementById("business-address");
  
    // Load the current address from localStorage if it exists
    const savedAddress = localStorage.getItem("businessAddress");
    if (savedAddress) {
      businessAddressSpan.textContent = savedAddress;
    }
  
    // Update the address on button click
    updateAddressBtn.addEventListener("click", () => {
      const newAddress = addressInput.value.trim();
      if (newAddress) {
        // Save the new address to localStorage
        localStorage.setItem("businessAddress", newAddress);
  
        // Update the displayed address
        businessAddressSpan.textContent = newAddress;
      } else {
        alert("Please enter a valid address.");
      }
    });
  });
  