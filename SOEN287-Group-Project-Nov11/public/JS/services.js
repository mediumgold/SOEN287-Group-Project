document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const serviceId = button.getAttribute('data-service-id');
            
            // Retrieve userId from local storage (assuming it's stored after login)
            const userId = localStorage.getItem('userId');

            if (!userId) {
                alert('You need to log in to add items to your cart.');
                window.location.href = 'login.html'; // Redirect to login page
                return;
            }

            // Create the request payload
            const payload = {
                userId: parseInt(userId), // Ensure userId is an integer
                itemId: parseInt(serviceId), // Ensure itemId matches the database schema
                quantity: 1 // Default quantity for now
            };

            try {
                // Send POST request to the /cart endpoint
                const response = await fetch('http://localhost:5500/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.message === 'Item added to cart') {
                    alert(`Service ${serviceId} added to your cart!`);
                } else {
                    alert('Failed to add to cart. Please try again.');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('An error occurred while adding to your cart. Please try again later.');
            }
        });
    });
});
