document.addEventListener('DOMContentLoaded', async () => {
    const serviceCardsContainer = document.querySelector('.service-cards');

    // Fetch service items
    try {
        const response = await fetch('http://localhost:5500/api/items');
        if (!response.ok) {
            throw new Error('Failed to fetch service items');
        }

        const services = await response.json();

        // Dynamically create service cards
        services.forEach(service => {
            const card = document.createElement('div');
            card.classList.add('service-card');

            card.innerHTML = `
                <img src="${service.image_url || '../assets/service1-placeholder.png'}" alt="${service.name}" />
                <h2>${service.name}</h2>
                <p>${service.description}</p>
                <p>Price: $${service.price.toFixed(2)}</p>
                <button class="btn add-to-cart" data-service-id="${service.item_id}">
                    Add to Cart
                </button>
            `;

            serviceCardsContainer.appendChild(card);
        });

        // Add to cart button event listener
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', async () => {
                const serviceId = button.getAttribute('data-service-id');
                const userId = localStorage.getItem('userId');

                if (!userId) {
                    alert('You need to log in to add items to your cart.');
                    window.location.href = 'login.html'; 
                    return;
                }

                const payload = {
                    userId: parseInt(userId),
                    itemId: parseInt(serviceId),
                    quantity: 1
                };

                try {
                    const cartResponse = await fetch('http://localhost:5500/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await cartResponse.json();
                    if (cartResponse.ok && data.message === 'Item added to cart') {
                        alert(`Service ${serviceId} added to your cart!`);
                    } else {
                        alert('Failed to add to cart. Please try again.');
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('An error occurred. Please try again later.');
                }
            });
        });

    } catch (error) {
        console.error('Error fetching services:', error);
        alert('An error occurred while fetching services. Please try again later.');
    }

    // Login status management
    const isLoggedIn = localStorage.getItem('loggedIn');
    const hasUserID = localStorage.getItem('userId');
    const loginStatus = document.getElementById('loginStatus');
    const signInDiv = document.getElementById('signInDiv');
    const btn1 = document.getElementById('signIn');
    const btn2 = document.getElementById('createAcc');

    if (isLoggedIn) {
        btn1.querySelector('a').innerText = 'Account';
        btn1.querySelector('a').href = 'account.html';

        btn2.querySelector('a').innerText = 'Logout';
        btn2.querySelector('a').href = '#';

        btn2.onclick = function () {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            window.location.href = 'index.html';
        };

    } else {
        loginStatus.style.display = '';
    }
});
