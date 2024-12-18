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
});

db.query = util.promisify(db.query); // Promisify db.query for async/await

const initDB = async () => {
    try {
        const sqlFilePath = path.join(__dirname, 'websiteDB.sql');
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
        const sqlFilePath = path.join(__dirname, 'websiteDB.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        const sqlCommands = sql.split(';').filter(cmd => cmd.trim() !== '');
        for (const command of sqlCommands) {
            await db.query(command);
        }
        console.log('Database initialized');

        // Explicitly select the websiteDB database
        await db.query('USE websiteDB');
        console.log('Database switched to websiteDB');
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1); // Exit if initialization fails
    }
});

// Routes

// User registration
app.post('/submit', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.',
        });
    }

    // Check if the email exists in either userLogin or adminLogin
    const checkEmailSqlUser = 'SELECT email FROM userLogin WHERE email = ?';
    const checkEmailSqlAdmin = 'SELECT email FROM adminLogin WHERE email = ?';

    // Check in userLogin table
    db.query(checkEmailSqlUser, [email], (err, userResults) => {
        if (err) {
            console.error('Error checking userLogin email:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (userResults.length > 0) {
            // return res.status(400).json({
            //     success: false,
            //     message: 'This email is already registered in the user database.',
            // });
            return res.json({ success: false, message: 'Name or email already exists.' });
        }

        // Check in adminLogin table
        db.query(checkEmailSqlAdmin, [email], (err, adminResults) => {
            if (err) {
                console.error('Error checking adminLogin email:', err);
                return res.status(500).json({ message: 'Database error.' });
            }

            if (adminResults.length > 0) {
                // return res.status(400).json({
                //     success: false,
                //     message: 'This email is already registered in the admin database.',
                // });
                return res.json({ success: false, message: 'Name or email already exists.' });
            }

            // If no conflict, insert new user
            const insertSql = 'INSERT INTO userLogin (name, email, password) VALUES (?, ?, ?)';
            db.query(insertSql, [name, email, password], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).json({ message: 'Database error.' });
                }

                res.json({
                    success: true,
                    userId: result.insertId,
                    message: 'Account created successfully.',
                    redirectTo: 'index.html',
                });
            });
        });
    });
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT user_id, name FROM userLogin WHERE email = ? AND password = ?';  // Include the name in the query
        const results = await db.query(sql, [email, password]);

        if (results.length > 0) {
            res.json({
                success: true,
                userId: results[0].user_id,
                userName: results[0].name,
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

        // Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // SQL query to check admin login with plain password
        const sql = 'SELECT id, name, password FROM adminLogin WHERE email = ?';  // Include the name in the query
        
        // Querying the database
        db.query(sql, [email], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error occurred'
                });
            }

            // If the user exists
            if (results.length > 0) {
                const storedPassword = results[0].password;

                // Directly compare the plain text password
                if (storedPassword === password) {
                    return res.json({
                        success: true,
                        userId: results[0].id,
                        userName: results[0].name,
                        redirectTo: 'BusinessAdmin.html'
                    });
                }
            }

            // If no match is found or email/password incorrect
            res.json({ success: false, message: 'Invalid email or password' });
        });

    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({
            success: false,
            message: 'Database error occurred'
        });
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

//view orders history
app.get('/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sql = `
            SELECT 
                Orders.order_id, 
                Orders.order_date, 
                Orders.total_price, 
                Items.name, 
                Order_Items.quantity, 
                Order_Items.price
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
})

// Handle form submission from the contact page
app.post("/submitContact", async (req, res) => {
    const { name, email, message } = req.body;
  
    try {
      // Insert into database (example SQL query)
      const sql =
        "INSERT INTO contactMessages (name, email, message) VALUES (?, ?, ?)";
      await db.query(sql, [name, email, message]);
  
      res.status(200).send("Message submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to save the message. Please try again later.");
    }
  });


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

app.post('/api/updateOrderPrice', (req, res) => {
    const { order_id, total_price } = req.body;

    console.log('Received data:', req.body);

    if (!order_id || !total_price) {
        console.error('Missing required fields');
        return res.status(400).json({ message: 'Order ID and Total Price are required.' });
    }

    const query = 'UPDATE Orders SET total_price = ? WHERE order_id = ?';
    db.query(query, [total_price, order_id], (err, result) => {
        if (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ message: 'Failed to update order.' });
        }

        console.log('Update result:', result);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Order updated successfully!' });
        } else {
            console.warn('Order not found for ID:', order_id);
            return res.status(404).json({ message: 'Order not found.' });
        }
    });
});

app.post('/api/deleteOrder', (req, res) => {
    const { order_id } = req.body;

    // Validate input
    if (!order_id) {
        return res.status(400).json({ message: 'Order ID is required.' });
    }

    // Start transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to start transaction', error: err });
        }

        // Disable foreign key checks
        db.query('SET foreign_key_checks = 0;', (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ message: 'Failed to disable foreign key checks', error: err });
                });
            }

            // Delete order
            const deleteOrderQuery = 'DELETE FROM Orders WHERE order_id = ?';
            db.query(deleteOrderQuery, [order_id], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: 'Failed to delete order', error: err });
                    });
                }

                // Log the result
                console.log('Delete result:', result);

                // Enable foreign key checks
                db.query('SET foreign_key_checks = 1;', (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: 'Failed to enable foreign key checks', error: err });
                        });
                    }

                    // Commit transaction
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Failed to commit transaction', error: err });
                            });
                        }

                        // Return success message directly without checking rows affected
                        res.status(200).json({ message: 'Order deleted successfully!' });
                    });
                });
            });
        });
    });
});

// POST API to add an order
app.post('/api/addOrder', (req, res) => {
    const { user_id, total_price } = req.body;

    console.log('Received data:', req.body);  

    if (!user_id || !total_price) {
        return res.status(400).json({ message: 'User ID and Total Price are required.' });
    }

    const query = 'INSERT INTO Orders (user_id, total_price) VALUES (?, ?)';
    db.query(query, [user_id, total_price], (err, result) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).json({ message: 'Failed to add order.' });
        }

        return res.status(200).json({ message: 'Order added successfully!' });
    });
});


// Route to mark an order as pending
app.post('/api/markAsPending', (req, res) => {
    const { order_id, user_id } = req.body;

    if (!order_id || !user_id) {
        return res.status(400).json({ message: 'Order ID and User ID are required.' });
    }

    console.log('Received order_id:', order_id, 'Received user_id:', user_id);  

    const query = 'UPDATE Orders SET payment_status = 0 WHERE order_id = ? AND user_id = ?';
    
    console.log('Executing query:', query, 'with params:', [order_id, user_id]);  

    db.query(query, [order_id, user_id], (err, result) => {
        if (err) {
            console.error('Error marking order as pending:', err);
            return res.status(500).json({ message: 'Failed to mark order as pending.' });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Order marked as pending.' });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    });
});


app.get('/api/getPendingOrders', (req, res) => {
    const query = 'SELECT * FROM Orders WHERE payment_status = 0';  // 0 means pending
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching pending orders:', err);
            return res.status(500).json({ message: 'Failed to retrieve orders.' });
        }
        res.json(result);  // Send back the list of pending orders
    });
});


app.put('/api/removeOrder/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    const query = 'UPDATE Orders SET payment_status = 1 WHERE order_id = ?'; // payment_status = 1 means paid
    db.query(query, [orderId], (err, result) => {
        if (err) {
            console.error('Error removing order:', err);
            return res.status(500).json({ message: 'Failed to mark order as paid.' });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Order marked as paid.' });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    });
});

app.post('/api/editItem', (req, res) => {
    const { item_id, price, description } = req.body;

    const updates = [];
    if (price) updates.push(`price = ${mysql.escape(price)}`);
    if (description) updates.push(`description = ${mysql.escape(description)}`);

    if (updates.length === 0) {
        return res.status(400).send('No updates provided.');
    }

    const sql = `UPDATE Items SET ${updates.join(', ')} WHERE item_id = ${mysql.escape(item_id)}`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send(result.affectedRows > 0 ? 'Item updated successfully!' : 'Item not found.');
    });
});

// Add a new item
app.post('/api/addItem', (req, res) => {
    const { name, price, description } = req.body;

    const sql = 'INSERT INTO Items (name, price, description) VALUES (?, ?, ?)';
    db.query(sql, [name, price, description], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send('Item added successfully!');
    });
});

// Delete an item
app.post('/api/deleteItem', (req, res) => {
    const { item_id } = req.body;

    const sql = 'DELETE FROM Items WHERE item_id = ?';
    db.query(sql, [item_id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send(result.affectedRows > 0 ? 'Item deleted successfully!' : 'Item not found.');
    });
});

app.get('/api/items', (req, res) => {
    const query = 'SELECT * FROM Items';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ message: 'Failed to fetch items' });
        }

        res.json(results);
    });
});

app.put('/update-user-account', async (req, res) => {
    try {
        const { userId, username, password } = req.body;

        if (!userId || !username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const sql = `
            UPDATE userLogin 
            SET name = ?, password = ? 
            WHERE user_id = ?`;
        const results = await db.query(sql, [username, password, userId]);

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'User account updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error updating user account:', error);
        res.status(500).json({ success: false, message: 'Database error occurred.' });
    }
});


app.put('/update-admin-account', async (req, res) => {
    try {
        const { userId, username, password } = req.body;

        if (!userId || !username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const sql = `
            UPDATE adminLogin 
            SET name = ?, password = ? 
            WHERE id = ?`;
        const results = await db.query(sql, [username, password, userId]);

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Admin account updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Admin not found.' });
        }
    } catch (error) {
        console.error('Error updating admin account:', error);
        res.status(500).json({ success: false, message: 'Database error occurred.' });
    }
});

// app.delete('/delete-user-account', async (req, res) => {
//     try {
//         const { userId } = req.body;

//         if (!userId) {
//             return res.status(400).json({ success: false, message: 'User ID is required.' });
//         }

//         // Delete all related orders
//         const deleteOrdersSQL = `DELETE FROM Orders WHERE user_id = ?`;
//         const deleteCartSQL = `DELETE FROM Cart WHERE user_id = ?`;
//         const cascade = `
//         ALTER TABLE orders
//         DROP FOREIGN KEY orders_ibfk_1;

//         ALTER TABLE orders
//         ADD CONSTRAINT orders_ibfk_1
//         FOREIGN KEY (user_id) REFERENCES userlogin(user_id) ON DELETE CASCADE;
//         `

//         await db.query(deleteOrdersSQL, [userId]); // Remove all orders
//         //await db.query(deleteCartSQL, [userId]);   // Remove all cart items
//         //await db.query(cascade, [userId]);

//         // Delete the user account
//         const deleteUserSQL = `DELETE FROM Users WHERE user_id = ?`;
//         const result = await db.query(deleteUserSQL, [userId]);

//         if (result.affectedRows > 0) {
//             res.status(200).json({ success: true, message: 'Account and related data deleted successfully.' });
//         } else {
//             res.status(404).json({ success: false, message: 'User not found.' });
//         }
//     } catch (error) {
//         console.error('Error deleting user account:', error);
//         res.status(500).json({ success: false, message: 'Database error occurred.' });
//     }
// });


        app.delete('/delete-user-account', async (req, res) => {
            try {
                const { userId } = req.body;
        
                if (!userId) {
                    return res.status(400).json({ success: false, message: 'User ID is required.' });
                }
                const deleteUserSQL = `DELETE FROM userLogin WHERE user_id = ?`;
                const result = await db.query(deleteUserSQL, [userId]);
        
                if (result.affectedRows > 0) {
                    res.status(200).json({ success: true, message: 'User account deleted successfully.' });
                } else {
                    res.status(404).json({ success: false, message: 'User not found.' });
                }
            } catch (error) {
                console.error('Error deleting user account:', error);
                res.status(500).json({ success: false, message: 'Database error occurred.' });
            }
        });



// Delete an order by ID
app.delete('/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // SQL query to delete the order and related items
        const deleteOrderSQL = `DELETE FROM Orders WHERE order_id = ?`;
        const deleteOrderItemsSQL = `DELETE FROM Order_Items WHERE order_id = ?`;

        // Delete items first (maintaining foreign key relationships, if any)
        await db.query(deleteOrderItemsSQL, [orderId]);
        const result = await db.query(deleteOrderSQL, [orderId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Order canceled successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Order not found.' });
        }
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ success: false, message: 'Database error occurred.' });
    }
});



// app.delete('/delete-admin-account', async (req, res) => {
//     const { userId } = req.body;

//     const sql = 'DELETE FROM adminLogin WHERE id = ?';
//     db.query(sql, [userId], (err, result) => {
//         if (err) return res.status(500).send(err.message);
//         res.send(result.affectedRows > 0 ? 'Admin deleted successfully!' : 'Admin not found.');
//     });
// });










// app.get('/latest-value', (req, res) => {
//     const query = 'SELECT name FROM userLogin WHERE id = ?'; // Adjust query to fit your table structure
//     console.log('0000000000000');
//     db.query(query, [req.query.id], (err, results) => {
//         console.log('1111111111111111');
//         if (err) return res.status(500).send(err);
//         // Make sure to return the correct 'name' field from the query result
//         const userName = results[0].name;
//         console.log("22222222222222222");
//         res.json({ value: userName});
//         console.log("33333333333333333");
//     });
// });




app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
