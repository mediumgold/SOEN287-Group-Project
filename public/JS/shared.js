//saves changes to logo when edited
document.addEventListener("DOMContentLoaded", () => {
  const navLogo = document.getElementById("logo"); // Navbar logo image

  // Load the logo from localStorage if it exists
  const savedLogo = localStorage.getItem("companyLogo");
  if (savedLogo && navLogo) {
    navLogo.src = savedLogo; // Update the logo dynamically
  }
});

//save changes to company name when edited
document.addEventListener("DOMContentLoaded", () => {
  const navLogo = document.getElementById("logo"); // Navbar logo image
  const titleElement = document.getElementById("title"); // Navbar title
  const defaultLogo = "../assets/company logo placeholder for a website.png"; // Default logo path
  const defaultName = "Company Name"; // Default company name

  // Load the logo from localStorage if it exists, otherwise use the default logo
  const savedLogo = localStorage.getItem("companyLogo") || defaultLogo;
  if (navLogo) {
    navLogo.src = savedLogo;
  }

  // Load the company name from localStorage if it exists, otherwise use the default name
  const savedName = localStorage.getItem("companyName") || defaultName;
  if (titleElement) {
    titleElement.textContent = savedName;
  }
});

//save changes to company address when edited
document.addEventListener("DOMContentLoaded", () => {
  const navLogo = document.getElementById("logo"); // Navbar logo image
  const titleElement = document.getElementById("title"); // Navbar title
  const addressElement = document.getElementById("business-address"); // Address field
  const defaultLogo = "../assets/company logo placeholder for a website.png"; // Default logo path
  const defaultName = "Company Name"; // Default company name
  const defaultAddress = "Your Address"; // Default address

  // Load the logo from localStorage if it exists, otherwise use the default logo
  const savedLogo = localStorage.getItem("companyLogo") || defaultLogo;
  if (navLogo) {
    navLogo.src = savedLogo;
  }

  // Load the company name from localStorage if it exists, otherwise use the default name
  const savedName = localStorage.getItem("companyName") || defaultName;
  if (titleElement) {
    titleElement.textContent = savedName;
  }

  // Load the business address from localStorage if it exists, otherwise use the default address
  const savedAddress =
    localStorage.getItem("businessAddress") || defaultAddress;
  if (addressElement) {
    addressElement.textContent = savedAddress;
  }
});
