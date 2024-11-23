<<<<<<< Updated upstream
const serviceForm = document.getElementById('service-form');
const confirmServiceForm = document.getElementById('confirm-service-form');
const unpaidBillForm = document.getElementById('unpaid-customer-form');
const serviceList = document.getElementById('service-list');
const unpaidBillsList = document.getElementById('unpaid-bills-list');
const serviceOverviewList = document.getElementById('service-overview-list');
const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('logout-in');

const services = [];
const serviceOverview = [];


serviceForm.onsubmit = function (event) {
    event.preventDefault();
    const formData = new FormData(serviceForm);
    const serviceId = formData.get('service_id');
    const customerName = formData.get('customer_name');
    const serviceContent = formData.get('service_content');
    const servicePrice = parseFloat(formData.get('service_price'));

    services.push({ id: serviceId, name: customerName, content: serviceContent, price: servicePrice, paid: 0, unpaid: servicePrice });
    renderServiceList();
    serviceForm.reset();
};

function renderServiceList() {
    serviceList.innerHTML = '';
    services.forEach(service => {
        const li = document.createElement('li');
        li.textContent = `ID: ${service.id} | Name: ${service.name} | Content: ${service.content} | Price: $${service.price.toFixed(2)}`;
        serviceList.appendChild(li);
    });
}


confirmServiceForm.onsubmit = function (event) {
=======

const serviceForm = document.getElementById('service-form');
//const confirmServiceForm = document.getElementById('confirm-service-form');
//const unpaidBillForm = document.getElementById('unpaid-customer-form');
//const serviceList = document.getElementById('service-list');
//const unpaidBillsList = document.getElementById('unpaid-bills-list');
//const serviceOverviewList = document.getElementById('service-overview-list');
const logoutButton = document.getElementById('logout-button');

const services = [];
const serviceOverview = [];
const unpaidCustomers = [];

serviceForm.onsubmit = function(event) {
    event.preventDefault(); 
    const formData = new FormData(serviceForm);
    
    const serviceId = formData.get('Service_id');
    const customerName = formData.get('customer_name');
    const servicePrice = parseFloat(formData.get('service_price'));

    const data = {
        serviceId: serviceId,
        name: customerName,  
        price: servicePrice
    };


    fetch('http://localhost:5500/add-service', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Service added successfully');
        loadCurrentServices();  
    })
    .catch(error => {
        console.error('Error adding service:', error);
        alert('Error adding service');
    });
};



function loadCurrentServices() {
    fetch('http://localhost:5500/current-services')  
        .then(response => response.json())
        .then(services => {
            const servicesList = document.getElementById('current-services');
            servicesList.innerHTML = '';  

            services.forEach(service => {
                const li = document.createElement('li');
                li.textContent = `${service.name} - $${service.price}`;
                servicesList.appendChild(li); 
            });
        })
        .catch(error => {
            console.error('Error loading current services:', error);
            alert('Failed to load services');
        });
}
window.onload = function() {
    loadCurrentServices(); 
};
//for part 1 which generate by ChatGPT 
confirmServiceForm.onsubmit = function(event) {
>>>>>>> Stashed changes
    event.preventDefault();
    const formData = new FormData(confirmServiceForm);
    const serviceId = formData.get('service_id');

    const serviceIndex = services.findIndex(service => service.id === serviceId);
    if (serviceIndex >= 0) {
        const confirmedService = services[serviceIndex];
<<<<<<< Updated upstream
        confirmedService.paid = 0; // Initial paid amount
        confirmedService.unpaid = confirmedService.price; // Initial unpaid amount
        serviceOverview.push(confirmedService);
        services.splice(serviceIndex, 1); // Remove from Manage Services
        renderServiceList();
        renderServiceOverview(); // Update Service Overview with new service
=======
        confirmedService.paid = 0; 
        confirmedService.unpaid = confirmedService.price; 
        serviceOverview.push(confirmedService);
        services.splice(serviceIndex, 1); 
        renderServiceList();
        renderServiceOverview(); 
>>>>>>> Stashed changes
        alert(`Service with ID ${serviceId} confirmed and moved to overview!`);
    } else {
        alert(`Service with ID ${serviceId} not found.`);
    }
};

<<<<<<< Updated upstream

=======
//for part 1 which generate by ChatGPT 
>>>>>>> Stashed changes
function renderServiceOverview() {
    serviceOverviewList.innerHTML = '';
    serviceOverview.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.content}</td>
            <td>$${service.paid.toFixed(2)}</td>
            <td>$${service.unpaid.toFixed(2)}</td>
            <td>${service.unpaid > 0 ? 'Unpaid' : 'Paid'}</td>
        `;
        serviceOverviewList.appendChild(row);
    });
}

<<<<<<< Updated upstream

unpaidBillForm.onsubmit = function (event) {
=======
//it might useful for part2
unpaidBillForm.onsubmit = function(event) {
>>>>>>> Stashed changes
    event.preventDefault();
    const formData = new FormData(unpaidBillForm);
    const customerId = formData.get('customer_id');
    const unpaidAmount = parseFloat(formData.get('unpaid_amount'));

    const serviceIndex = serviceOverview.findIndex(service => service.id === customerId);
    if (serviceIndex >= 0) {
        const service = serviceOverview[serviceIndex];
<<<<<<< Updated upstream
        service.paid += unpaidAmount;
        service.unpaid = service.price - service.paid;
        renderServiceOverview(); 
=======
        if (unpaidAmount <= service.unpaid && unpaidAmount > 0) {
            service.paid += unpaidAmount;
            service.unpaid = service.price - service.paid;
            renderServiceOverview();
        } else {
            alert("Invalid unpaid amount or amount exceeds the remaining unpaid balance.");
        }
>>>>>>> Stashed changes
        unpaidBillForm.reset();
    } else {
        alert(`Customer ID ${customerId} not found.`);
    }
};


logoutButton.onclick = function () {
    alert("Logging out...");
<<<<<<< Updated upstream
    window.location.href = 'login.html';
};


loginButton.onclick = function () {
    window.location.href = 'login.html'; // Redirect to login page
};


document.addEventListener('DOMContentLoaded', () => {
    //test
=======
    window.location.href = 'login.html'; 
};


document.addEventListener('DOMContentLoaded', function() {
    const isAdmin = localStorage.getItem('isAdmin');

    if (!isAdmin || isAdmin !== 'true') {
        alert('Access denied. Admins only.');
        window.location.href = 'login.html';  
    }
>>>>>>> Stashed changes
});
