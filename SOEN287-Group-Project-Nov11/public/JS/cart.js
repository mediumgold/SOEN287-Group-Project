document.addEventListener('DOMContentLoaded', () => {
    const loadCart = async () => {
        try {
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                alert('You need to log in to view your cart.');
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch(`http://localhost:5500/cart/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const cartItems = await response.json();
            const cartItemsContainer = document.querySelector('.cart-items');
            const cartTotalElement = document.querySelector('.cart-total h3');

            // Clear existing cart items
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';  // Display empty cart message
            } else {
                cartItems.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `  
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p>${item.description || 'No description available'}</p>
                        </div>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <button class="delete-item-button" data-cart-id="${item.cart_id}">Delete</button>  <!-- Delete Button -->
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    total += item.price * (item.quantity || 1);
                });
            }

            // Update total
            cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
        } catch (error) {
            console.error('Error loading cart:', error);
            alert('An error occurred while loading your cart. Please try again later.');
        }
    };

    // Handle item deletion
    document.querySelector('.cart-items').addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-item-button')) {
            const cartId = event.target.dataset.cartId; // Get the cart_id from the data attribute

            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('You need to log in to remove items from your cart.');
                window.location.href = 'login.html';
                return;
            }

            try {
                const response = await fetch(`http://localhost:5500/cart/${cartId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to remove item from cart');
                }

                alert('Item removed from cart.');
                loadCart(); // Reload cart to show updated state
            } catch (error) {
                console.error('Error removing item from cart:', error);
                alert('An error occurred while removing the item. Please try again later.');
            }
        }
    });

    // Handle Checkout functionality
    const checkoutButton = document.querySelector('.checkout-button');
    checkoutButton.addEventListener('click', async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('You need to log in to checkout.');
            window.location.href = 'login.html';
            return;
        }

        try {
            // Fetch the cart items before proceeding to checkout
            const response = await fetch(`http://localhost:5500/cart/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart data for checkout');
            }

            const cartItems = await response.json();
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add items to your cart before checking out.');
                return;
            }

            // Sending checkout request to server (creating an order)
            const orderResponse = await fetch('http://localhost:5500/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    items: cartItems.map(item => ({
                        item_id: item.item_id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Checkout failed');
            }

            // If checkout is successful, clear the cart
            alert('Checkout successful! Your order has been placed.');
            loadCart(); // Reload cart (which should now be empty)
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again later.');
        }
    });

    loadCart();
});
