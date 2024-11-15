CREATE DATABASE IF NOT EXISTS userDB;
USE userDB; -- <- database being used
CREATE TABLE IF NOT EXISTS userLogin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE DATABASE IF NOT EXISTS adminDB;
USE adminDB; -- <- database being used
CREATE TABLE IF NOT EXISTS adminLogin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);