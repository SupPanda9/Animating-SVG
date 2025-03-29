document.getElementById('saveSVGButton').addEventListener('click', function() {
    const svgElements = document.querySelectorAll('svg'); // Извличаме всички SVG елементи на страницата

    if (svgElements.length === 0) {
        alert('No SVG elements found to save.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    console.log("Project ID:", projectId);

    const svgElementsArray = Array.from(svgElements);

    // Използваме Promise.all, за да изпратим заявки за запазване на всеки SVG елемент асинхронно
    Promise.all(svgElementsArray.map((svgElement, index) => {
        const svgContent = svgElement.outerHTML;
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`;
        const formattedTime = `${('0' + currentDate.getHours()).slice(-2)}-${('0' + currentDate.getMinutes()).slice(-2)}-${('0' + currentDate.getSeconds()).slice(-2)}`;
        const svgName = `${formattedDate}_${formattedTime}_${index + 1}`;

        return fetch('saveProject.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: svgName, svgContent, projectId: projectId}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                return { status: 'success', message: 'SVG saved successfully.' };
            } else {
                return { status: 'error', message: 'Failed to save SVG: ' + data.message };
            }
        })
        .catch(error => {
            console.error('Error saving SVG:', error);
            return { status: 'error', message: 'Failed to save SVG.' };
        });
    }))
    .then(results => {
        results.forEach(result => {
            if (result.status === 'success') {
                alert(result.message); // Примерно може да използвате alert вместо console.log
            } else {
                alert(result.message); // Примерно може да използвате alert вместо console.error
            }
        });
    });
});
