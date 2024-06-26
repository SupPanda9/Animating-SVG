function exportAnimationFrames() {
    const svgContainer = document.getElementById('svgContainer');
    const svgElement = svgContainer.querySelector('svg');

    if (!svgElement) {
        alert('No SVG element found to export.');
        return;
    }

    const duration = 2000; // Duration of the animation in milliseconds
    const frameRate = 30; // Frames per second
    const totalFrames = (duration / 1000) * frameRate;
    let currentFrame = 0;

    const width = svgElement.viewBox.baseVal.width;
    const height = svgElement.viewBox.baseVal.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    function captureFrame() {
        if (currentFrame >= totalFrames) {
            // Finished capturing frames
            alert('Frames captured. Please check your console for the frame URLs.');
            return;
        }

        const currentTime = (currentFrame / totalFrames) * (duration / 1000);
        svgElement.setCurrentTime(currentTime); // Update the SVG animation time

        // Serialize the updated SVG and draw it to the canvas
        const updatedSvgData = new XMLSerializer().serializeToString(svgElement);
        const updatedSvgBlob = new Blob([updatedSvgData], { type: 'image/svg+xml;charset=utf-8' });
        const updatedSvgUrl = URL.createObjectURL(updatedSvgBlob);
        const img = new Image();
        img.src = updatedSvgUrl;

        img.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            const frameDataUrl = canvas.toDataURL('image/png');
            console.log(`Frame ${currentFrame}:`, frameDataUrl);

            currentFrame++;
            URL.revokeObjectURL(updatedSvgUrl); // Clean up URL object
            setTimeout(captureFrame, 1000 / frameRate); // Capture next frame
        };
    }

    captureFrame(); // Start capturing frames
}