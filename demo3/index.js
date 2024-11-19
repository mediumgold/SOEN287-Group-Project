const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
//const cors = require('cors'); // Make sure you have included this

const fs = require('fs'); // Import fs module 
const path = require('path'); // Import path module

const app = express();
const port = 5500; // Ensure this matches your server port

//app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test5' // Ensure this is the correct database name
});

db.connect((err) => {
    if (err) 
        throw err; 
    console.log('Connected to database'); 
    // Read and execute SQL file 
    const sqlFilePath = path.join(__dirname, 'test.sql'); 
    fs.readFile(sqlFilePath, 'utf8', (err, sql) => { 
        if (err) throw err; 
        // Split SQL commands to execute them sequentially 
        const sqlCommands = sql.split(';').filter(cmd => cmd.trim() !== ''); 
        sqlCommands.forEach(command => { 
            db.query(command, (err, result) => { 
                if (err) throw err; 
            }); 
        }); 
        console.log('SQL file executed successfully'); 
    });
});

function insertData(database, table, data) {
    db.query(`USE ${database}`, (err, result) => {
        if (err) throw err;
        const sql = `INSERT INTO ${table} SET ?`;
        db.query(sql, data, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
            console.log(`Data inserted into ${database}.${table}`);
        });
    });
}


app.post('/submit', (req, res) => {
    const inputData = req.body.data;
    console.log('Received data:', inputData); // Add this line for debugging
    const sql = `INSERT INTO test_table (data) VALUES ('${inputData}')`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, data: inputData });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
