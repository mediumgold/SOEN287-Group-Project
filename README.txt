Alexander Hsu - 40247307
Nicholas Taddio 40213969
Nathan Wong - 40168305
Yumo Tao - 40025397

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
  2. Services -> shows all available services with the description & price and a button to request services (goes to Contact page)
  3. About -> shows company information along with the address
  4. Contact -> shows company social media and form to write a service request (sends to database) 
  5. Cart -> shows all services added to cart along with the total price and a button to delete added service
  6. Sign In -> shows "Account" when user/admin is logged in
  7. Create Account -> displays "Logout" when user/admin is logged in

  Note: Services and Cart pages will not work unless user is logged in.

2. When signed in (Account & Logout)
  1. Account -> Order History & Account Settings (as a user)
  2. Account -> Order History & Account Settings & Admin Permissions
  3. Logout -> logs user out, Sign In, and Create Account will display again

3. An example of how a user can use the website
  The user creates an account using "Create Account", they input their name, email, and password. They sign in with their valid credentials. If they wish to delete their account or change their name and password they can do so from the Account page. They can browse the services catalog and add the preferred services to their cart. If they wish to request a service, they can write a form on the Contact page using their name, email, and message request. Once the user is satisfied with their cart they can proceed to checkout from the Cart page. From here, the user can see their order history by accessing Account, where they see all of the information related to their cart. To proceed with obtaining their service they will need confirmation from an admin user that they paid. Once confirmed, the user will be able to obtain their service.

4. An example of how an admin can use the website
  Once an admin user logs in, they have access to "Admin Permissions" on the Account page. Accessing this page will allow the admin user to manage orders such as: 
    -editing the total price for a specific order (required inputs are the order id and the new total price)
    -deleting an order (required input is order id)
    -adding an order (required inputs are user id and total price)
    -mark an order as pending (required inputs are order id and user id)

  The admin user has access to the tables that contain the order id, user id, total price, and the order date. They can mark an order as paid.

  At the bottom of the page, there is a link that goes to the "Update Services Page". From here, the admin has access to managing the services such as:
    -editing existing services (required inputs are item id, new price, and new description)
    -adding a new service (required inputs are item name, price, and description)
    -deleting a service (required input is item id)

  Admins are also able to manage business information such as:
    -editing the company name (required input is new company name)
    -editing the company logo (choosing the right image file is the required input)
    -editing the company address (required input is new company address)

  On this page, the admin has access to the tables that contain the service id, name, price, and description.
