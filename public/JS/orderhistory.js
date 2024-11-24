document.addEventListener('DOMContentLoaded', () => {
    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Get user ID from localStorage
            if (!userId) {
                alert('You need to log in to view your orders.');
                window.location.href = 'login.html'; // Redirect to login if no userId
                return;
            }

            const response = await fetch(`http://localhost:5500/orders/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();
            const ordersContainer = document.getElementById('orders-container');
            ordersContainer.innerHTML = ''; // Clear existing content

            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
            } else {
                // Group orders by order_id
                const groupedOrders = groupOrdersByOrderId(orders);

                // Render each order in a bubble
                Object.keys(groupedOrders).forEach(orderId => {
                    const order = groupedOrders[orderId];
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('order-bubble'); // Add bubble class for styling

                    let orderDetails = `
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Date:</strong> ${new Date(order[0].order_date).toLocaleString()}</p>
                        <div class="order-items">
                    `;

                    order.forEach(item => {
                        orderDetails += `
                            <div class="order-item">
                                <p><strong>Item:</strong> ${item.name}</p>
                                <p><strong>Quantity:</strong> ${item.quantity}</p>
                                <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                            </div>
                        `;
                    });

                    orderDetails += `</div>`; // Close the order items container
                    orderElement.innerHTML = orderDetails;
                    ordersContainer.appendChild(orderElement);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching your orders. Please try again later.');
        }
    };

    // Helper function to group orders by order_id
    function groupOrdersByOrderId(orders) {
        return orders.reduce((grouped, order) => {
            if (!grouped[order.order_id]) {
                grouped[order.order_id] = [];
            }
            grouped[order.order_id].push(order);
            return grouped;
        }, {});
    }

    fetchOrders(); // Call the function to fetch orders on page load


    const isLoggedIn = localStorage.getItem('loggedIn');
    const hasUserID = localStorage.getItem('userId')
    const loginStatus = document.getElementById('loginStatus');
    const signInDiv = document.getElementById('signInDiv');

    //The two buttons to the right of the nav bar. sign in and create acc
    const btn1 = document.getElementById('signIn');
    const btn2 = document.getElementById('createAcc');

    //current userID
    const userId = localStorage.getItem('userId');

    //test comment
    if (isLoggedIn) {
        //once logged in, we will change the contents and href of btn 1 (sign in) to lead to account
        btn1.querySelector('a').innerText = 'Account';
        btn1.querySelector('a').href = '../HTML/account.html';

        //once logged in, we will change the contents and href of btn2 (create account) to log out and index.html
        btn2.querySelector('a').innerText = 'Logout';

        // we want to prevent it from going right away, (only want it onclick)
        btn2.querySelector('a').href = '#'; 

        //onclick, logout and go to home page
        btn2.onclick = function(){
            //clear login status
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            
            //bring back to home page
            window.location.href = '../HTML/index.html';

        }

    } else {
        loginStatus.style.display = '';
    }

});
