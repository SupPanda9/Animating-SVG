document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Спиране на стандартното поведение на формата

        const fileInput = document.getElementById('svgFileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select an SVG file.');
            return;
        }

        const formData = new FormData();
        formData.append('svgFile', file);

        fetch('uploadSVG.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const svgContainer = document.getElementById('svgContainer');

                svgContainer.innerHTML = data.svgContent;
                
                const svgLoadedEvent = new Event('svgLoaded');
                document.dispatchEvent(svgLoadedEvent);
            } else {
                alert(data.message);
                if (data.error) {
                    debug.innerHTML += `<p>Error code: ${data.error}</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while uploading the file.');
        });
    });
});