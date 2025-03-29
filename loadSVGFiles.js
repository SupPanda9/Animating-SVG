document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    
    if (projectId) {
        fetchSVGFiles(projectId);
    } else {
        console.error('No project ID found in URL.');
    }
});

function fetchSVGFiles(projectId) {
    fetch(`loadSVGFiles.php?project_id=${projectId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let svgContainer = document.getElementById('svgContainer');
        svgContainer.innerHTML = ""; // Clear previous SVGs

        data.svgFiles.forEach(svgFile => {
            let svgElement = document.createElement('div');
            svgElement.classList.add('svg-file');
            svgElement.innerHTML = svgFile.content;
            
            if (svgFile.animation_file) {
                let animationElement = document.createElement('div');
                animationElement.classList.add('svg-animation');
                animationElement.innerHTML = svgFile.animation_file;
                svgElement.appendChild(animationElement);
            }
            
            
            svgContainer.appendChild(svgElement);
            
            const svgLoadedEvent = new Event('svgLoaded');
            document.dispatchEvent(svgLoadedEvent);
        });
    })
    .catch(error => {
        console.error('Error fetching SVG files:', error);
    });
}
