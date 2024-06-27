document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    let formData = new FormData(this);

    // Validate form inputs (you can add your validation logic here if needed)

    // Send form data using AJAX
    fetch('registration.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Display response from registration.php in #form-messages
        let messageDiv = document.querySelector("#form-messages");
            messageDiv.innerHTML = "";

        if (data.errors) {
            data.errors.forEach(error => {
                let p = document.createElement("p");
                p.textContent = error;
                p.style.color = "red";
                messageDiv.appendChild(p);
            });
        } else if (data.success) {
            let p = document.createElement("p");
            p.textContent = data.success;
            p.classList.add("success");
            messageDiv.appendChild(p);
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000); // Redirect after 2 seconds
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors if any
    });
});
