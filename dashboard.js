<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    fetchProjects();

    document.getElementById('create-project-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let formData = new FormData(this);

        fetch("dashboard.php", {
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

                // Redirect to svgEdit.html with the project_id after 2 seconds
                setTimeout(() => {
                    window.location.href = `svgEdit.html?project_id=${data.project_id}`;
                }, 2000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});

function fetchProjects() {
    fetch('dashboard.php?action=get_projects')
    .then(response => response.json())
    .then(data => {
        let projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = ""; // Clear previous projects

        data.projects.forEach(project => {
            let projectTile = document.createElement('div');
            projectTile.classList.add('project-tile');
            projectTile.textContent = project.name;
            projectTile.addEventListener('click', () => {
                window.location.href = `project.html?project_id=${project.id}`;
            });
            projectsContainer.appendChild(projectTile);
        });
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
    });
}
=======
document.getElementById('create-project-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData(this);

    fetch("dashboard.php", {
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
                window.location.href = "svgEdit.html";
            }, 2000); // Redirect after 2 seconds
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
>>>>>>> 7001cac89484ab355c8e2378b4a1480bf9a2cf95
