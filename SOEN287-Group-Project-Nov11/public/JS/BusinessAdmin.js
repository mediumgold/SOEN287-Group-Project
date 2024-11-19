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
    event.preventDefault();
    const formData = new FormData(confirmServiceForm);
    const serviceId = formData.get('service_id');

    const serviceIndex = services.findIndex(service => service.id === serviceId);
    if (serviceIndex >= 0) {
        const confirmedService = services[serviceIndex];
        confirmedService.paid = 0; // Initial paid amount
        confirmedService.unpaid = confirmedService.price; // Initial unpaid amount
        serviceOverview.push(confirmedService);
        services.splice(serviceIndex, 1); // Remove from Manage Services
        renderServiceList();
        renderServiceOverview(); // Update Service Overview with new service
        alert(`Service with ID ${serviceId} confirmed and moved to overview!`);
    } else {
        alert(`Service with ID ${serviceId} not found.`);
    }
};


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


unpaidBillForm.onsubmit = function (event) {
    event.preventDefault();
    const formData = new FormData(unpaidBillForm);
    const customerId = formData.get('customer_id');
    const unpaidAmount = parseFloat(formData.get('unpaid_amount'));

    const serviceIndex = serviceOverview.findIndex(service => service.id === customerId);
    if (serviceIndex >= 0) {
        const service = serviceOverview[serviceIndex];
        service.paid += unpaidAmount;
        service.unpaid = service.price - service.paid;
        renderServiceOverview(); 
        unpaidBillForm.reset();
    } else {
        alert(`Customer ID ${customerId} not found.`);
    }
};


logoutButton.onclick = function () {
    alert("Logging out...");
    window.location.href = 'login.html';
};


loginButton.onclick = function () {
    window.location.href = 'login.html'; // Redirect to login page
};


document.addEventListener('DOMContentLoaded', () => {
    //test
});
