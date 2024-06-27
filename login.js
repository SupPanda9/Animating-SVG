document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#login-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        let formData = new FormData(this);

        fetch("login.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            let messageDiv = document.querySelector("#form-messages");
            messageDiv.innerHTML = ""; // Clear any previous messages

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
                    window.location.href = "dashboard.html";
                }, 2000); // Redirect after 2 seconds
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
