

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputData = document.getElementById('inputData').value;
    fetch('http://localhost:5500/submit', { // Ensure the URL matches your server's port
        method: 'POST', // Ensure POST method is used
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: inputData })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('results').innerText = JSON.stringify(data);
    })
    .catch(error => console.error('Error:', error));
});

