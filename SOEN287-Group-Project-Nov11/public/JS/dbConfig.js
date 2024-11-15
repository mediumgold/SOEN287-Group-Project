const express = require("express");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "example1db"
});

db.connect((err) => {
    if(err) {
        console.log("Error connecting to DB");
    }else{
        console.log("Connected");
    }
});

app.get("/addstudent", (request, response) => {
    let student = {
        // name: document.getElementById('name').value,
        // email: document.getElementById('email').value
        name: "Emilio",
        email:"emilio@gmail.com"
    }
    let sql = "INSERT INTO `students` SET ?";

    let query = db.query(sql, student, (err, result) => {
        if(err)
            response.send("Could not insert new record!");
        else
            response.send("Record inserted successfully!");
    });
});
// function addStudent(){

// }

app.get("/getstudents", (request, response) =>{
    let sql = "SELECT * FROM STUDENTS";

    let query = db.query(sql, (err, result) =>{
        if(err)
            response.send("Could not retrieve data from table!");
        else
            response.send(result);
    });
});
// function show(){
// }