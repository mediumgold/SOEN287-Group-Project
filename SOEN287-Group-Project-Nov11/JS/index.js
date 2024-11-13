
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test5' // Update database name to 'test5'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/submit', (req, res) => {
    const inputData = req.body.data;
    console.log('Received data:', inputData);
    const sql = `INSERT INTO test_table (data) VALUES ('${inputData}')`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json({ success: true, data: inputData });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
