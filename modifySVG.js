let selectedElement = null;

function addClickEventToSVGElements() {
    const svgContainer = document.getElementById('svgContainer');
    const svgElements = getNonGroupSVGElements(svgContainer);

    svgElements.forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.stopPropagation(); // Спиране на разпространението на събитието
            console.log("clicked");
            if (selectedElement !== null) {
                selectedElement.classList.remove('selected');
            }

            selectedElement = element;
            selectedElement.classList.add('selected');

            // Показване на color picker само когато има избран елемент
            const colorPicker = document.getElementById('colorPicker');
            if (colorPicker) {
                colorPicker.style.display = 'block';
            }
        });
    });
}

function getNonGroupSVGElements(container) {
    let elements = [];
    function traverse(element) {
        if (element.tagName.toLowerCase() !== 'g') {
            elements.push(element);
        } else {
            Array.from(element.children).forEach(child => traverse(child));
        }
    }
    Array.from(container.querySelectorAll('svg')).forEach(svg => {
        Array.from(svg.children).forEach(child => traverse(child));
    });
    return elements;
}

function addColorPicker() {
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'colorPicker';
    colorInput.style.display = 'none'; // Начално скриване на пикера за цвят

    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.appendChild(colorInput);

    colorInput.addEventListener('input', function() {
        if (selectedElement !== null) {
            selectedElement.style.fill = colorInput.value;
        }
    });
}

function getSelectedElementType() {
    if (selectedElement !== null) {
        return selectedElement.tagName.toLowerCase();
    }
    return null;
}

document.addEventListener('svgLoaded', function() {
    addClickEventToSVGElements();
    addColorPicker();
    console.log(getSelectedElementType());
});
