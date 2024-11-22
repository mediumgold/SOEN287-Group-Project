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
});
