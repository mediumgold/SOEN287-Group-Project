const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const util = require('util');

const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userDB',
});

db.query = util.promisify(db.query); // Promisify db.query for async/await

const initDB = async () => {
    try {
        const sqlFilePath = path.join(__dirname, 'userDB.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        const sqlCommands = sql.split(';').filter(cmd => cmd.trim() !== '');
        for (const command of sqlCommands) {
            await db.query(command);
        }
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

db.connect(async (err) => {
    if (err) throw err;
    console.log('Connected to database');

    try {
        // Initialize the database using the SQL file
        const sqlFilePath = path.join(__dirname, 'userDB.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        const sqlCommands = sql.split(';').filter(cmd => cmd.trim() !== '');
        for (const command of sqlCommands) {
            await db.query(command);
        }
        console.log('Database initialized');

        // Explicitly select the userDB database
        await db.query('USE userDB');
        console.log('Database switched to userDB');
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1); // Exit if initialization fails
    }
});

// Routes

// User registration
app.post('/submit', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const sql = 'INSERT INTO userLogin (name, email, password) VALUES (?, ?, ?)';
        const result = await db.query(sql, [name, email, password]);
        res.json({
            success: true,
            userId: result.insertId,
            message: 'Account created successfully',
            redirectTo: 'index.html',
        });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT user_id FROM userLogin WHERE email = ? AND password = ?';
        const results = await db.query(sql, [email, password]);

        if (results.length > 0) {
            res.json({
                success: true,
                userId: results[0].user_id,
                redirectTo: 'index.html',
            });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Database error' });
    }
});
// Admin login
app.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT id FROM adminLogin WHERE email = ? AND password = ?';
        const results = await db.query(sql, [email, password]);

        if (results.length > 0) {
            res.json({
                success: true,
                userId: results[0].id,  
                redirectTo: 'BusinessAdmin.html',  
            });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Database error' });
    }
});
// Add item to cart
app.post('/cart', async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const sql = 'INSERT INTO Cart (user_id, item_id, quantity) VALUES (?, ?, ?)';
        await db.query(sql, [userId, itemId, quantity]);
        res.status(201).json({ message: 'Item added to cart' });
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});

// View user's cart
app.get('/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sql = `
            SELECT Cart.*, Items.name, Items.price 
            FROM Cart 
            JOIN Items ON Cart.item_id = Items.item_id 
            WHERE Cart.user_id = ?
        `;
        const results = await db.query(sql, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

// Remove item from cart by cart_id
app.delete('/cart/:cartId', async (req, res) => {
    const { cartId } = req.params;

    try {
        const sql = 'DELETE FROM Cart WHERE cart_id = ?';
        const result = await db.query(sql, [cartId]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Item removed from cart' });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
});


// Checkout and create an order
app.post('/checkout', async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Create a new order in the Orders table
        const orderSql = 'INSERT INTO Orders (user_id, total_price, order_date) VALUES (?, ?, NOW())';
        // You might want to calculate the total price of the order
        let totalPrice = 0;

        // Fetch item prices and calculate the total price
        const itemsWithPrices = await Promise.all(items.map(async (item) => {
            const itemSql = 'SELECT price FROM Items WHERE item_id = ?';
            const itemResult = await db.query(itemSql, [item.item_id]);
            const price = itemResult[0].price;
            totalPrice += price * item.quantity;  // Calculate the total price for the order
            return { ...item, price };
        }));

        // Insert the order with the calculated total price
        const orderResult = await db.query(orderSql, [userId, totalPrice]);
        const orderId = orderResult.insertId;

        // Insert each item from the cart into the Order_Items table
        for (const item of itemsWithPrices) {
            const orderItemSql = 'INSERT INTO Order_Items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)';
            await db.query(orderItemSql, [orderId, item.item_id, item.quantity, item.price]);
        }

        // Clear the cart after placing the order
        await db.query('DELETE FROM Cart WHERE user_id = ?', [userId]);

        res.json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Error processing order' });
    }
});

// View user's order history
app.get('/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sql = `
            SELECT Orders.*, Order_Items.*, Items.name, Order_Items.quantity, Order_Items.price
            FROM Orders
            JOIN Order_Items ON Orders.order_id = Order_Items.order_id
            JOIN Items ON Order_Items.item_id = Items.item_id
            WHERE Orders.user_id = ?
            ORDER BY Orders.order_date DESC
        `;
        const results = await db.query(sql, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving order history:', error);
        res.status(500).json({ message: 'Database error' });
    }
});
//add


app.get('/api/orders', (req, res) => {
    const query = 'SELECT * FROM Orders';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).send('Failed to fetch orders.');
        }
        res.json(results);
    });
});

app.post('/api/neworders', (req, res) => {
    const { user_id, total_price } = req.body;  

    const query = 'INSERT INTO Orders (user_id, total_price) VALUES (?, ?)';
    

    db.query(query, [user_id, total_price], (error, results) => {
        if (error) {
            console.error('Error inserting order:', error);
            return res.status(500).send('Failed to add order');
        }
        
        res.status(201).json({ message: 'Order added successfully', order_id: results.insertId });
    });
});

app.post('/api/services', (req, res) => {
    const { order_id, user_id, name, service_content, total_price, paid, unpaid } = req.body;

    const query = `
        INSERT INTO AdminServices (order_id, user_id, name, service_content, total_price, paid, unpaid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [order_id, user_id, name, service_content, total_price, paid, unpaid], (error, results) => {
        if (error) {
            console.error('Error inserting service:', error);
            return res.status(500).send('Failed to add service.');
        }
        res.status(200).json({ message: 'Service added successfully.' });
    });
});


app.get('/api/services', (req, res) => {
    const query = 'SELECT * FROM services';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching services:', err);
            res.status(500).send('Error fetching services');
        } else {
            res.json(results);  
        }
    });
});

app.put('/api/services/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { user_id, name, service_content, total_price, paid, unpaid } = req.body;

    const query = `
        UPDATE AdminServices
        SET user_id = ?, name = ?, service_content = ?, total_price = ?, paid = ?, unpaid = ?
        WHERE order_id = ?
    `;

    db.query(query, [user_id, name, service_content, total_price, paid, unpaid, orderId], (error, results) => {
        if (error) {
            console.error('Error updating service:', error);
            return res.status(500).send('Failed to update service.');
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Service updated successfully.' });
        } else {
            res.status(404).send('Order ID not found.');
        }
    });
});

app.get('/api/unpaid', (req, res) => {
    const query = `
        SELECT user_id, name, unpaid
        FROM AdminServices
        WHERE unpaid > 0
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching unpaid bills:', error);
            return res.status(500).send('Failed to fetch unpaid bills.');
        }
        res.status(200).json(results);
    });
});

const { migrateData } = require('./businessAdmin');

app.get('/migrate-data', (req, res) => {
    migrateData();  
    res.send('Data migration started...');
});

// Catch-all route for unhandled endpoints
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




