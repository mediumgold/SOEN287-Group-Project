const serviceForm = document.getElementById('service-form');
const confirmServiceForm = document.getElementById('confirm-service-form');
const unpaidBillForm = document.getElementById('unpaid-customer-form');
const serviceList = document.getElementById('service-list');
const unpaidBillsList = document.getElementById('unpaid-bills-list');  
const serviceOverviewList = document.getElementById('service-overview-list');
const logoutButton = document.getElementById('logout-button');

const services = [];
const serviceOverview = [];
const unpaidCustomers = [];  
document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();

    async function fetchOrders() {
        try {
            const response = await fetch('http://localhost:5500/api/orders');
            if (response.ok) {
                const orders = await response.json();
                renderOrderList(orders);
            } else {
                alert('Failed to load orders.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching orders.');
        }
    }

    function renderOrderList(orders) {
        const orderTableBody = document.getElementById('orderTableBody');
        orderTableBody.innerHTML = '';  // Clear any existing rows

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.user_id}</td>
                <td>$${order.total_price.toFixed(2)}</td>
                <td>${new Date(order.order_date).toLocaleString()}</td>
            `;
            orderTableBody.appendChild(row);
        });
    }
});

document.getElementById('order-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validation
    if (!data.order_id || !data.total_price) {
        alert('Order ID and Total Price are required.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5500/api/updateOrderPrice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Order updated successfully!');
        } else {
            console.error('Response Status:', response.status);
            console.error('Response Message:', result.message);
            alert(result.message || 'Failed to update order.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the order.');
    }
});


document.getElementById('delete-order-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        // Send POST request to delete the order
        const response = await fetch('http://localhost:5500/api/deleteOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Order deleted successfully!');
        } else {
            alert(result.message || 'Failed to delete order.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the order.');
    }
});



document.getElementById('add-order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Gather form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log('Form data:', data);  

    // Ensure required fields are present
    if (!data.user_id || !data.total_price) {
        return alert('User ID and Total Price are required.');
    }

    try {
        // Send POST request to add new order
        const response = await fetch('http://localhost:5500/api/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Order added successfully!');
        } else {
            console.error('Error from server:', result.message);  
            alert(result.message || 'Failed to add order.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the order.');
    }
});

document.addEventListener('DOMContentLoaded', loadPendingOrders);

// Function to load pending orders from the server
async function loadPendingOrders() {
    try {
        const response = await fetch('http://localhost:5500/api/getPendingOrders');
        const orders = await response.json();

        const tbody = document.querySelector('#pending-orders tbody');
        tbody.innerHTML = '';  // Clear existing rows

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.user_id}</td>
                <td>${order.total_price}</td>
                <td><button class="remove-btn" data-order-id="${order.order_id}">Remove</button></td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for 'Remove' buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', handleRemoveOrder);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Handle "Mark as Pending" form submission
document.getElementById('mark-pending-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!data.order_id || !data.user_id) {
        return alert('Order ID and User ID are required.');
    }

    try {
        const response = await fetch('http://localhost:5500/api/markAsPending', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Order marked as pending!');
            loadPendingOrders();  // Reload the pending orders list
        } else {
            console.error('Error from server:', result.message);
            alert(result.message || 'Failed to mark order as pending.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while marking the order as pending.');
    }
});

// Handle removing an order (mark as paid)
async function handleRemoveOrder(event) {
    const orderId = event.target.getAttribute('data-order-id');

    try {
        const response = await fetch(`http://localhost:5500/api/removeOrder/${orderId}`, {
            method: 'PUT',
        });

        if (response.ok) {
            alert('Order marked as paid!');
            loadPendingOrders();  // Reload the pending orders list
        } else {
            alert('Failed to mark order as paid.');
        }
    } catch (error) {
        console.error('Error removing order:', error);
        alert('An error occurred while marking the order as paid.');
    }
}


logoutButton.onclick = function () {
    alert("Logging out...");
    window.location.href = 'login.html'; // Redirect to login page
};

//document.addEventListener('DOMContentLoaded', function() {
//    const isAdmin = localStorage.getItem('isAdmin');
//
//    if (!isAdmin || isAdmin !== 'true') {
//        alert('Access denied. Admins only.');
//        window.location.href = 'login.html';  // Redirect to login page if not admin
//    }
//});
