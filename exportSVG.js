document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('exportSVGButton').addEventListener('click', function(event) {
        event.preventDefault();  // Предотвратяване на рефрешването на страницата
        exportSVG();
    });
});

function exportSVG() {
    const svgContainer = document.getElementById('svgContainer');
    const svgElement = svgContainer.querySelector('svg');
    if (!svgElement) {
        alert('No SVG element found to export.');
        return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}