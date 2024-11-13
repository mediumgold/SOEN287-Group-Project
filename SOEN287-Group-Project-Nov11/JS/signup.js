
// document.getElementById('userForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const userName = document.getElementById('name').value;
//     fetch('/submit', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name: userName })
//     })
//     .then(response => response.json())
//     .then(name => {
//         document.getElementById('results').innerText = JSON.stringify(name);
//     })
//     .catch(error => console.error('Error:', error));
// });

// document.getElementById('dataForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const inputData = document.getElementById('inputData').value;
//     fetch('/submit', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ data: inputData })
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('results').innerText = JSON.stringify(data);
//     })
//     .catch(error => console.error('Error:', error));
// });


document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputData = document.getElementById('inputData').value;
    fetch('http://localhost:5500/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: inputData })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('results').innerText = JSON.stringify(data);
    })
    .catch(error => console.error('Error:', error));
});







































// // let idTracker = 0; //id of users creating a new account
// let idTracker = JSON.parse(localStorage.getItem('idTracker')) || 0;

// function saveUserData() {
//     // Get form data
//     let userId = idTracker;
//     let userName = document.getElementById('name').value;
//     let userEmail = document.getElementById('email').value;
//     let userPassword = document.getElementById('password').value;

//     // Create user object
//     let user = {
//         id: userId,
//         name: userName,
//         email: userEmail,
//         password: userPassword
//     };

//     // Get existing users from Local Storage 
//     let users = JSON.parse(localStorage.getItem('users')) || []; 
//     let emailExists = users.some(u => u.email === userEmail);

//     // Add new user to the array 
//     if(emailExists){
//         alert("Email is already associated to an account. Please use a different email.");
//         return;
//     }
//     users.push(user);
    
//     // Save user object to Local Storage
//     localStorage.setItem('users', JSON.stringify(users));
    
//     idTracker++;
//     localStorage.setItem('idTracker', JSON.stringify(idTracker)); // Update idTracker in Local Storage


//     // Confirm data has been saved
//     alert('User data saved!');

//     //generate a new ID for the next user
//    // idTracker++;

// }

// // Function to get user by ID from Local Storage 
// function getUserById(userId) { 
//     let users = JSON.parse(localStorage.getItem('users')) || []; 
//     return users.find(u => u.id === userId); 
// }

// // Function to retrieve user data from Local Storage (optional)
// // function getUserData() {
// //     let user = JSON.parse(localStorage.getItem('user'));
// //     console.log(user);
// // }

// function show(){
//     // console.log(getUserById(0));
//     // console.log(getUserById(1));
//     // console.log(getUserById(2));
//     for (let i = 0; i < localStorage.length; i++) {
//         let key = localStorage.key(i);
//         let value = localStorage.getItem(key);
//         console.log(`${key}: ${value}`);
//     }
// }


// //Initialize idTracker from Local Storage or set to 0 if not present
// let idTracker = JSON.parse(localStorage.getItem('idTracker')) || 0;
// // localStorage.clear();
// //console.log(idTracker);
// function saveUserData() {
//     // Get form data
//     let userId = idTracker;
//     let userName = document.getElementById('name').value;
//     let userEmail = document.getElementById('email').value;
//     let userPassword = document.getElementById('password').value;

//     // Create user object
//     let user = {
//         id: userId,
//         name: userName,
//         email: userEmail,
//         password: userPassword
//     };

//     // Get existing users from Local Storage
//     let users = JSON.parse(localStorage.getItem('users')) || [];
//     let emailExists = users.some(u => u.email === userEmail);

//     // Check for duplicate emails
//     if (emailExists) {
//         alert("Email is already associated with an account. Please use a different email.");
//         return;
//     }

//     // Add new user to the array
//     users.push(user);

//     // Save updated users array and new idTracker value to Local Storage
//     localStorage.setItem('users', JSON.stringify(users));
//     idTracker++;
//     localStorage.setItem('idTracker', JSON.stringify(idTracker)); // Update idTracker in Local Storage

//     console.log(idTracker);
//     // Confirm data has been saved
//     alert('User data saved!');
// }

// // Function to get user by ID from Local Storage
// function getUserById(userId) {
//     let users = JSON.parse(localStorage.getItem('users')) || [];
//     return users.find(user => user.id === userId);
// }

// // Function to show multiple users for testing
// function show() {
//     for (let i = 0; i < localStorage.length; i++) {
//         let key = localStorage.key(i);
//         let value = localStorage.getItem(key);
//         console.log(`${key}: ${value}`);
//     }
// }
















// const mysql = require('mysql2');

// // Create a connection to the database
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'admin',
//     password: 'pass123',
//     database: 'userdb'
// });

// // Initialize idTracker from the database or set to 0 if not present
// let idTracker = 0;

// // Function to get the current highest ID (initialization)
// connection.query('SELECT MAX(id) AS maxId FROM users', (error, results) => {
//     if (error) throw error;
//     idTracker = results[0].maxId || 0;
// });

// // Save user data to the database
// function saveUserData() {
//     // Get form data
//     let userName = document.getElementById('name').value;
//     let userEmail = document.getElementById('email').value;
//     let userPassword = document.getElementById('password').value;

//     // Check for duplicate emails
//     connection.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [userEmail], (error, results) => {
//         if (error) throw error;
//         if (results[0].count > 0) {
//             alert('Email is already associated with an account. Please use a different email.');
//             return;
//         }

//         // Insert new user
//         let userId = ++idTracker;
//         connection.query('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
//             [userId, userName, userEmail, userPassword],
//             (error) => {
//                 if (error) throw error;
//                 alert('User data saved!');
//             }
//         );
//     });
// }

// // Function to get user by ID from the database
// function getUserById(userId) {
//     connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
//         if (error) throw error;
//         console.log(results[0]);
//     });
// }

// // Function to show multiple users for testing
// function show() {
//     connection.query('SELECT * FROM users', (error, results) => {
//         if (error) throw error;
//         results.forEach(user => {
//             console.log(`id: ${user.id}, name: ${user.name}, email: ${user.email}`);
//         });
//     });
// }























// const express = require('express');
// const mysql = require('mysql2');

// const app = express();
// app.use(express.json()); // To parse JSON request bodies

// // MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'users_db',
// });

// // Check connection
// connection.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// // API endpoint to save user data
// app.post('/save-user', (req, res) => {
//   const { userId, userName, userEmail, userPassword } = req.body;

//   connection.execute(
//     'SELECT * FROM users WHERE email = ?',
//     [userEmail],
//     (err, results) => {
//       if (err) return res.status(500).json({ message: 'Database error' });

//       if (results.length > 0) {
//         return res.status(400).json({ message: 'Email already exists' });
//       }

//       // Insert the new user into the database
//       connection.execute(
//         'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
//         [userId, userName, userEmail, userPassword],
//         (err) => {
//           if (err) return res.status(500).json({ message: 'Error saving user' });
//           res.json({ message: 'User saved!' });
//         }
//       );
//     }
//   );
// });

// // Start server
// app.listen(3000, () => console.log('Server running on port 3000'));
