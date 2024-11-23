CREATE DATABASE IF NOT EXISTS userDB;
USE userDB; -- <- database being used

-- Create userLogin table
CREATE TABLE IF NOT EXISTS userLogin (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create adminLogin table
CREATE TABLE IF NOT EXISTS adminLogin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
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
    UNIQUE(name) -- Ensure that item names are unique
);

-- Insert Services if not already in the table
INSERT IGNORE INTO Items (name, price, description) VALUES
('Service 1', 50.00, 'Description for Service 1'),
('Service 2', 75.00, 'Description for Service 2'),
('Service 3', 100.00, 'Description for Service 3');

-- Create Cart table
CREATE TABLE IF NOT EXISTS Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    quantity INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES userLogin(user_id)
);

-- Create Order_Items table to store the items in each order
CREATE TABLE IF NOT EXISTS Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE IF NOT EXISTS AdminServices (
    New_order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    service_content TEXT,
    total_price DECIMAL(10, 2) NOT NULL,
    paid DECIMAL(10, 2) DEFAULT 0,
    unpaid DECIMAL(10, 2)
);




