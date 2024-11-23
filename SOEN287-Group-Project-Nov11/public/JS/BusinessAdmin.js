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

serviceForm.onsubmit = async function (event) {
    event.preventDefault();  
    const formData = new FormData(serviceForm);  

    
    const total_price = parseFloat(formData.get('total_price'));  
    const serviceData = {
        order_id: formData.get('order_id'),  
        user_id: formData.get('user_id'),    
        name: formData.get('name'), 
        service_content: formData.get('service_content'), 
        total_price: total_price, 
        paid: parseFloat(formData.get('paid')),  
        unpaid: total_price 
    };

    try {
     
        const response = await fetch('http://localhost:5500/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)  
        });

      
        if (response.ok) {
            const result = await response.json();
            alert('Service successfully added to the database!');

           
            services.push(serviceData);

            renderServiceList();


            serviceForm.reset();
        } else {
            alert('Failed to save service.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the service.');
    }
};

function renderServiceList() {
    const serviceList = document.getElementById('current-services');
    serviceList.innerHTML = ''; // Clear existing content

    services.forEach(service => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Order ID:</strong> ${service.order_id} |
            <strong>User ID:</strong> ${service.user_id} |
            <strong>Name:</strong> ${service.name} |
            <strong>Service Content:</strong> ${service.service_content} |
            <strong>Total Price:</strong> $${service.total_price.toFixed(2)} |
            <strong>Paid:</strong> $${service.paid.toFixed(2)} |
            <strong>Unpaid:</strong> $${service.unpaid.toFixed(2)}
        `;
        serviceList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderServiceList(); // This will render the list on page load
});

function renderServiceOverview() {
    const serviceOverview = document.getElementById('service-overview');
    serviceOverview.innerHTML = ''; 

    if (services.length === 0) {
        serviceOverview.innerHTML = '<tr><td colspan="8">No services available.</td></tr>';
        return;
    }

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.order_id}</td>
            <td>${service.user_id}</td>
            <td>${service.name}</td>
            <td>${service.service_content}</td>
            <td>$${service.total_price.toFixed(2)}</td>
            <td>$${service.paid.toFixed(2)}</td>
            <td>$${service.unpaid.toFixed(2)}</td>
            <td>${service.unpaid > 0 ? 'Unpaid' : 'Paid'}</td>
        `;
        serviceOverview.appendChild(row);
    });
}


confirmServiceForm.onsubmit = function (event) {
    event.preventDefault(); 
    const formData = new FormData(confirmServiceForm);  
    const orderId = formData.get('order_id');  

    const serviceIndex = services.findIndex(service => service.order_id == orderId);

    if (serviceIndex >= 0) {
        const confirmedService = services[serviceIndex];  

        confirmedService.paid = 0;
        confirmedService.unpaid = confirmedService.total_price;

        // Remove the confirmed service from services array
        services.splice(serviceIndex, 1);

        // Optionally, add to a confirmed service list if needed
        // confirmedServices.push(confirmedService); // Uncomment if you have another array for confirmed services

        renderServiceList();
        renderServiceOverview();

        alert(`Order ID ${orderId} moved!`);
    } else {
        alert(`Not Found Order ID ${orderId}`);
    }
};





unpaidBillForm.onsubmit = async function (event) {
    event.preventDefault();
    const formData = new FormData(unpaidBillForm);
    const orderId = formData.get('order_id');  
    const unpaidAmount = parseFloat(formData.get('unpaid_amount'));

    if (isNaN(unpaidAmount) || unpaidAmount <= 0) {
        alert("Invalid amount entered.");
        return;
    }

    const serviceIndex = serviceOverview.findIndex(service => service.order_id === parseInt(orderId, 10));
    if (serviceIndex >= 0) {
        const service = serviceOverview[serviceIndex];

       
        if (unpaidAmount <= service.unpaid && unpaidAmount > 0) {
            service.paid += unpaidAmount;
            service.unpaid = service.total_price - service.paid;  


            renderServiceOverview();

         
            try {
                const response = await fetch(`http://localhost:5500/api/services/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        order_id: service.order_id,      
                        user_id: service.user_id,       
                        name: service.name,              
                        service_content: service.service_content, 
                        total_price: service.total_price,  
                        paid: service.paid,               
                        unpaid: service.unpaid           
                    })
                });

                if (response.ok) {
                    alert('Service updated successfully in the database!');
                } else {
                    alert('Failed to update service in the database.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the service.');
            }
        } else {
            alert("Invalid unpaid amount or amount exceeds remaining unpaid balance.");
        }

        
        unpaidBillForm.reset();
    } else {
        alert(`Order ID ${orderId} not found.`);
    }
};


function renderUnpaidBillsList() {
    unpaidBillsList.innerHTML = '';
    
    unpaidCustomers.forEach(service => {
        
        const li = document.createElement('li');
        li.textContent = `Order ID: ${service.order_id} | Name: ${service.name} | Unpaid: $${service.unpaid.toFixed(2)}`;
        unpaidBillsList.appendChild(li);
    });

    if (unpaidCustomers.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No unpaid bills found.';
        unpaidBillsList.appendChild(li);
    }
}

async function fetchUnpaidBills() {
    try {
        const response = await fetch('http://localhost:5500/api/unpaid');
        const unpaidData = await response.json();
        unpaidCustomers = unpaidData;  
        renderUnpaidBillsList();
    } catch (error) {
        console.error('Error fetching unpaid bills:', error);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    fetchUnpaidBills();
});

logoutButton.onclick = function () {
    alert("Logging out...");
    window.location.href = 'login.html'; // Redirect to login page
};

document.addEventListener('DOMContentLoaded', function() {
    const isAdmin = localStorage.getItem('isAdmin');

    if (!isAdmin || isAdmin !== 'true') {
        alert('Access denied. Admins only.');
        window.location.href = 'login.html';  // Redirect to login page if not admin
    }
});
