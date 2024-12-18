CREATE DATABASE IF NOT EXISTS websiteDB;
USE websiteDB;

-- Create userLogin table
CREATE TABLE IF NOT EXISTS userLogin (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create adminLogin table
CREATE TABLE IF NOT EXISTS adminLogin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT IGNORE INTO adminLogin (name, email, password) VALUES
('Yumo', 'yumo@gmail.com', '123'),
('Nathan', 'nathan@gmail.com', '123'),
('Alex', 'alex@gmail.com', '123'),
('Nick', 'nick@gmail.com', '123');

-- Create Items table
CREATE TABLE IF NOT EXISTS Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    UNIQUE(name)
);

-- Create Cart table with ON DELETE CASCADE for user_id and item_id
CREATE TABLE IF NOT EXISTS Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    quantity INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES userLogin(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);

-- Create Orders table with ON DELETE CASCADE for user_id
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES userLogin(user_id) ON DELETE CASCADE
);

-- Create Order_Items table with ON DELETE CASCADE for order_id and item_id
CREATE TABLE IF NOT EXISTS Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);

-- Create contactMessages table (No cascade required here)
CREATE TABLE IF NOT EXISTS contactMessages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AdminServices table with ON DELETE CASCADE for user_id and order_id
CREATE TABLE IF NOT EXISTS AdminServices (
    New_order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    service_content TEXT,
    total_price DECIMAL(10, 2) NOT NULL,
    paid DECIMAL(10, 2) DEFAULT 0,
    unpaid DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES userLogin(user_id) ON DELETE CASCADE
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
