document.addEventListener('DOMContentLoaded', function() {
    const isAdmin = localStorage.getItem('isAdmin');

    //if (!isAdmin || isAdmin !== 'true') {
    //    alert('Access denied. Admins only.');
    //    window.location.href = 'login.html';  // Redirect to login page if not admin
    //}

    const logoutButton = document.getElementById('logout-btn');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('isAdmin');
        alert('You have been logged out.');
        window.location.href = 'login.html'; // Redirect to login page
    });
});

document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:5500/api/editItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert(response.ok ? 'Item updated successfully!' : 'Failed to update item.');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the item.');
    }
});

document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:5500/api/addItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert(response.ok ? 'Item added successfully!' : 'Failed to add item.');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the item.');
    }
});

document.getElementById('delete-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:5500/api/deleteItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert(response.ok ? 'Item deleted successfully!' : 'Failed to delete item.');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the item.');
    }
});

// Adding event listener for the Update Logo form
document.getElementById('update-logo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('http://localhost:5500/api/updateLogo', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Logo updated successfully!');
        } else {
            alert('Failed to update logo.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the logo.');
    }
});
