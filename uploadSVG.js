document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Спиране на стандартното поведение на формата

        const fileInput = document.getElementById('svgFileInput');
        const files = fileInput.files;

        if (files.length === 0) {
            alert('Please select at least one SVG file.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('svgFiles[]', files[i]);
        }

        fetch('uploadSVG.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const svgContainer = document.getElementById('svgContainer');
                svgContainer.innerHTML = ''; // Clear previous SVGs
                const select = document.getElementById('svgSelect');

                data.svgContents.forEach((svgContent, index) => {
                    const svgId = `svg${index + 1}`; // Генериране на уникален идентификатор
                    const option = document.createElement('option');
                    option.value = svgId;
                    option.textContent = `SVG ${index + 1}`;
                
                    const svgDiv = document.createElement('div');
                    svgDiv.innerHTML = svgContent;
                
                    svgContainer.appendChild(svgDiv);
                
                    select.appendChild(option);
                });

                const svgLoadedEvent = new Event('svgLoaded');
                document.dispatchEvent(svgLoadedEvent);
            } else {
                alert(data.message);
                const debug = document.getElementById('debug');
                if (data.error) {
                    debug.innerHTML += `<p>Error code: ${data.error}</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while uploading the files.');
        });
    });
});
