
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import fs module 
const path = require('path'); // Import path module
const cors = require('cors');


const app = express();
const port = 5500;

// app.use(cors({
//     origin: 'http://localhost:5500'
// }));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    //database: 'userDB'
});

/*
    When the db connects, it'll run the code in the userDB.sql file. Which will create/open the userDB
*/
db.connect((err) => {
    if (err) 
        throw err;
    console.log('Connected to database');

    // Read and execute SQL file 
    const sqlFilePath = path.join(__dirname, 'userDB.sql'); 
    
    fs.readFile(sqlFilePath, 'utf8', (err, sql) => { 
        if (err) 
            throw err; 
    
        // Split SQL commands to execute them sequentially 
        const sqlCommands = sql.split(';').filter(cmd => cmd.trim() !== ''); 
    
        sqlCommands.forEach(command => { 
            db.query(command, (err, result) => { 
                if (err) 
                    throw err; 
            }); 
        }); 
    
        console.log('SQL file executed successfully'); 

        db.query('USE userDB', (err) => {
            if (err) 
                throw err;
            console.log('Database selected');
        });

    });
    

});


//Submitting to the database
app.post('/submit', (req, res) => {
    
    const { name, email, password } = req.body
    const sql = `INSERT INTO userLogin (name, email, password) VALUES ('${name}', '${email}', '${password}')`;

    db.query(sql, (err, result) => { 
        if (err) { 
            console.error('Error executing query:', err); 
            return res.status(500).json({ success: false, message: 'Database error' }); 
        } 
        //res.json({ 
        //     success: true, 
        //     data: { name, email, password } 
        // }); 

        //success message and redirect to home index.html and save the current id of the user to userId
        res.json({ success: true, userId: result.insertId, message: 'Account created successfully', redirectTo: 'index.html' });
    });
});

//Reading from the database
app.post('/login', (req, res) => {
    //Get email and password from the request
    const { email, password } = req.body; 

    //Check if there's an email and password that exists.
    const sql = `SELECT id FROM userLogin WHERE email = ? AND password = ?`;

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            //If user is found, login is successful, record the id
            const userId = results[0].id;
            res.json({ success: true, userId: userId, redirectTo: 'index.html' });

        } else {
            //No user found, login fails
            res.json({ success: false, message: 'Invalid email or password' });
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
