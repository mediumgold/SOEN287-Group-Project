Installation Guide:

1. Install Node.js
  -1. Download and install Node.js from the official website https://nodejs.org/en
  -2. Verify the installation on your device's terminal using the commands: 
  
      node -v

      npm -v

2. Setting Up the Server Dependencies 
  -1. Navigate to the server project directory using the terminal
      
      cd/path/to/server

  -2. Install required npm packages on the terminal using the command:
      
      npm install express body-parser mysql mysql2 cors

3. Install XAMPP
  1. Download and install XAMPP from the official website https://www.apachefriends.org/
  2. Verify the installation on your device's terminal using the command:

     mysql --version

4. Set Up MySQL Database
  1. Open XAMPP Control Panel
  2. Start both Apache and MySQL
  3. Open the terminal on your preferred IDE and run the command:

     node app.js

     Note: use CTRL + C in order to exit the back end server 

  4. Open phpMyAdmin on your browser to view databases in GUI using the link:
     
     http://localhost/phpmyadmin


User Guide on Website:
1. Navigation Bar 
  1. Home -> goes to home screen
  2. Services -> shows all available services with the name & price and a button to request services (goes to Contact page)
  3. About -> shows company information along with the address
  4. Contact -> shows company social media and form to write a service request (sends to database) 
  5. Cart -> shows all services added to cart along with the total price 
  6. Sign In -> shows "Account" when user/admin is logged in
  7. Create Account -> displays "Logout" when user/admin is logged in

  Note: Services and Cart pages will not work unless user is logged in.

2. When signed in (Account & Logout)
  1. Account -> Order History & Account 
  2. Logout -> logs user out, Sign In and Create Account will display again

3. An example of how a user can use the website

4. An example of how an admin can use the website