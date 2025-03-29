document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('exportSVGButton').addEventListener('click', function(event) {
        console.log("clicked");
        event.preventDefault();  // Предотвратяване на рефрешването на страницата
        exportSVG();
    });
});

function exportSVG() {
    const select = document.getElementById('svgSelect');
    const selectedId = select.value;

    if (!selectedId) {
        alert('Please select an SVG to export.');
        return;
    }

    const svgElement = document.getElementById(selectedId);
    if (!svgElement) {
        alert('Selected SVG element not found.');
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